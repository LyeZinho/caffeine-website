#!/usr/bin/env node
/**
 * One-shot / repeatable migration: Markdown sources -> static HTML under content/html/.
 * Builds search-index.json and link-graph.json for cross-references on the site.
 */
import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveMdHref,
  extractDocSlugsFromHtml,
  extractMdLinkHrefs,
} from './lib/doc-slug.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = [
  { label: 'docs', dir: path.join(root, 'import', 'docs') },
  { label: 'planning', dir: path.join(root, 'import', 'planning') },
  { label: 'engine', dir: path.join(root, 'import', 'engine-root') },
];

const outDir = path.join(root, 'content', 'html');
const indexPath = path.join(root, 'content', 'search-index.json');
const graphPath = path.join(root, 'content', 'link-graph.json');

marked.setOptions({ gfm: true, headerIds: true, mangle: false });

function walkMd(dir, base = dir) {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) entries.push(...walkMd(full, base));
    else if (name.endsWith('.md')) entries.push({ full, rel: path.relative(base, full) });
  }
  return entries;
}

function slugFromRel(rel) {
  return rel.replace(/\.md$/i, '').split(path.sep).join('/');
}

/** Rewrite legacy .md hrefs to site routes (/docs/{slug}). */
function rewriteDocLinks(html, sourceLabel, relPath) {
  const docDir = path.posix.dirname(relPath.replace(/\\/g, '/'));
  return html.replace(/href="([^"]+)"/g, (match, href) => {
    const slug = resolveMdHref(href, sourceLabel, relPath);
    if (!slug) return match;
    const hashIdx = href.indexOf('#');
    const hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
    return `href="/docs/${slug}${hash}"`;
  });
}

/** @type {Map<string, Set<string>>} */
const outgoing = new Map();

function addLink(fromSlug, toSlug) {
  if (!fromSlug || !toSlug || fromSlug === toSlug) return;
  if (!outgoing.has(fromSlug)) outgoing.set(fromSlug, new Set());
  outgoing.get(fromSlug).add(toSlug);
}

const index = [];
const slugToTitle = new Map();

for (const { label, dir } of sources) {
  for (const { full, rel } of walkMd(dir)) {
    const md = fs.readFileSync(full, 'utf8');
    const titleMatch = md.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(rel, '.md');
    const raw = marked.parse(md);
    const relPosix = rel.replace(/\\/g, '/');
    const body = rewriteDocLinks(raw, label, relPosix);
    const slug = `${label}/${slugFromRel(rel)}`;
    slugToTitle.set(slug, title);

    for (const href of extractMdLinkHrefs(md)) {
      const target = resolveMdHref(href, label, relPosix);
      if (target) addLink(slug, target);
    }

    for (const target of extractDocSlugsFromHtml(body)) {
      addLink(slug, target);
    }

    const outFile = path.join(outDir, `${slug}.html`);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const html = `<article class="doc-article" data-slug="${slug}">\n${body}\n</article>\n`;
    fs.writeFileSync(outFile, html, 'utf8');
    index.push({
      slug,
      title,
      source: label,
      path: rel.replace(/\\/g, '/'),
    });
  }
}

/** Planning folders: prev/next by filename order. */
const planningByDir = new Map();
for (const entry of index.filter((e) => e.source === 'planning')) {
  const dir = path.posix.dirname(entry.path);
  if (!planningByDir.has(dir)) planningByDir.set(dir, []);
  planningByDir.get(dir).push(entry);
}
for (const entries of planningByDir.values()) {
  entries.sort((a, b) => a.path.localeCompare(b.path));
}

/** Backlinks + graph export. */
const validSlugs = new Set(index.map((e) => e.slug));
const backlinks = new Map();
for (const [from, targets] of outgoing) {
  for (const to of targets) {
    if (!validSlugs.has(to)) continue;
    if (!backlinks.has(to)) backlinks.set(to, new Set());
    backlinks.get(to).add(from);
  }
}

/** @type {Record<string, { outgoing: { slug: string, title: string }[], backlinks: { slug: string, title: string }[], prev: string | null, next: string | null }>} */
const graph = {};

function linkList(slugSet) {
  return [...slugSet]
    .filter((s) => validSlugs.has(s))
    .sort((a, b) => (slugToTitle.get(a) ?? a).localeCompare(slugToTitle.get(b) ?? b))
    .map((slug) => ({ slug, title: slugToTitle.get(slug) ?? slug }));
}

for (const entry of index) {
  const slug = entry.slug;
  const out = outgoing.get(slug) ?? new Set();
  const back = backlinks.get(slug) ?? new Set();
  const dir = path.posix.dirname(entry.path);
  const seq = entry.source === 'planning' ? planningByDir.get(dir) : null;
  let prev = null;
  let next = null;
  if (seq) {
    const i = seq.findIndex((e) => e.slug === slug);
    if (i > 0) prev = seq[i - 1].slug;
    if (i >= 0 && i < seq.length - 1) next = seq[i + 1].slug;
  }
  graph[slug] = {
    outgoing: linkList(out),
    backlinks: linkList(back),
    prev,
    next,
  };
}

index.sort((a, b) => a.slug.localeCompare(b.slug));
fs.mkdirSync(path.dirname(indexPath), { recursive: true });
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), 'utf8');
console.log(`Wrote ${index.length} HTML pages to ${outDir}`);
console.log(`Wrote link graph (${Object.keys(graph).length} nodes) to ${graphPath}`);
