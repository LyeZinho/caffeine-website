#!/usr/bin/env node
/**
 * One-shot / repeatable migration: Markdown sources -> static HTML under content/html/.
 * Engine repo must not keep .md documentation; this output is what the site and MCP serve.
 */
import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = [
  { label: 'docs', dir: path.join(root, 'import', 'docs') },
  { label: 'planning', dir: path.join(root, 'import', 'planning') },
  { label: 'engine', dir: path.join(root, 'import', 'engine-root') },
];

const outDir = path.join(root, 'content', 'html');
const indexPath = path.join(root, 'content', 'search-index.json');

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

const index = [];

for (const { label, dir } of sources) {
  for (const { full, rel } of walkMd(dir)) {
    const md = fs.readFileSync(full, 'utf8');
    const titleMatch = md.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(rel, '.md');
    const body = marked.parse(md);
    const slug = `${label}/${slugFromRel(rel)}`;
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

index.sort((a, b) => a.slug.localeCompare(b.slug));
fs.mkdirSync(path.dirname(indexPath), { recursive: true });
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
console.log(`Wrote ${index.length} HTML pages to ${outDir}`);
