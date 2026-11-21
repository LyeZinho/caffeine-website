#!/usr/bin/env node
// Static site generator for caffeine.devscafe.org.
//
//   node site/build.mjs            build into dist/
//   node site/build.mjs --check    build and fail on broken links / missing assets
//   node site/build.mjs --serve    build, serve dist/ on :4173 and rebuild on change
//
// Input is the HTML-first Markdown tree in content/<lang>/docs (see DOCS_STYLE.md).
// Output is plain static files: no framework, no runtime dependencies in the browser.

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { STRINGS, renderHome, renderLanding, renderPage, renderNotFound, renderRootRedirect } from './templates.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');
const ASSETS = path.join(ROOT, 'site', 'assets');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'site', 'config.json'), 'utf8'));
const args = new Set(process.argv.slice(2));

// ── helpers ────────────────────────────────────────────────────────────

const toPosix = (p) => p.split(path.sep).join('/');
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (html) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

function slugify(text) {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s+/g, '-');
  return slug || 'section';
}

function prettify(name) {
  return name
    .replace(/\.md$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // LaTeX book sources are not site content.
      if (fs.existsSync(path.join(full, 'main.tex'))) continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

// ── markdown ───────────────────────────────────────────────────────────

const LANG_ALIASES = {
  dryad: 'javascript',
  dyd: 'javascript',
  rs: 'rust',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  'c++': 'cpp',
  hpp: 'cpp',
  h: 'cpp',
  cc: 'cpp',
  yml: 'yaml',
  glsl: 'glsl',
  wgsl: 'rust',
  mat: 'json',
  texgraph: 'json',
  cmakelists: 'cmake',
};

function highlight(code, rawLang) {
  const lang = LANG_ALIASES[rawLang] ?? rawLang;
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    } catch {
      /* fall through to plain text */
    }
  }
  return escapeHtml(code);
}

/** Resolve a link found in a page to a site URL. Returns `{ href, broken }`. */
function makeResolver(lang, srcRel, ctx) {
  const srcDir = path.posix.dirname(srcRel);
  return function resolve(href) {
    if (!href || /^(https?:|mailto:|tel:|data:|#|\/\/|\/)/i.test(href)) return { href };
    const match = href.match(/^([^?#]*)([?#].*)?$/);
    const pathPart = decodeURI(match[1]);
    const suffix = match[2] ?? '';
    if (!pathPart) return { href };
    let target = path.posix.normalize(path.posix.join(srcDir, pathPart));
    // `../docs/X.md` written from the docs root still points inside the tree.
    if (target.startsWith('../docs/')) target = target.slice('../docs/'.length);
    if (target.startsWith('..')) {
      const repoPath = target.replace(/^(\.\.\/)+/, '');
      if (/^(src|include|doppio|assets|tests|scripts|apps|cmake|caf-pack|doppio-plugins)\//.test(repoPath)) {
        return { href: `${config.repo}/blob/main/${repoPath}${suffix}` };
      }
      return { href, broken: `escapes the docs tree: ${href}` };
    }
    const clean = target.replace(/\/$/, '');
    if (/\.md$/i.test(clean)) {
      const page = ctx.pageByRel.get(clean);
      if (page) return { href: page.url + suffix };
      return { href, broken: `missing page: ${href}` };
    }
    // A folder link: use its index page.
    const folderPage = ctx.pageByRel.get(`${clean}/README.md`) ?? ctx.pageByRel.get(`${clean}/index.md`);
    if (folderPage) return { href: folderPage.url + suffix };
    // Any other file is an asset copied next to the pages.
    const own = path.join(CONTENT, lang, 'docs', clean);
    const fallback = path.join(CONTENT, config.defaultLanguage, 'docs', clean);
    if (fs.existsSync(own) && fs.statSync(own).isFile()) {
      ctx.assets.set(`/${lang}/docs/${clean}`, own);
      return { href: `/${lang}/docs/${clean}${suffix}` };
    }
    if (fs.existsSync(fallback) && fs.statSync(fallback).isFile()) {
      ctx.assets.set(`/${lang}/docs/${clean}`, fallback);
      return { href: `/${lang}/docs/${clean}${suffix}` };
    }
    return { href, broken: `missing file: ${href}` };
  };
}

function createMarkdown() {
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false });

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const rawLang = (token.info || '').trim().split(/\s+/)[0].toLowerCase();
    if (rawLang === 'mermaid') {
      return `<pre class="mermaid">${escapeHtml(token.content)}</pre>\n`;
    }
    const label = rawLang || 'text';
    const body = highlight(token.content, rawLang);
    return (
      `<div class="code-block" data-lang="${escapeHtml(label)}">` +
      `<div class="code-head"><span class="code-lang">${escapeHtml(label)}</span>` +
      `<button class="code-copy" type="button" aria-label="Copy code">Copy</button></div>` +
      `<pre><code class="hljs language-${escapeHtml(label)}">${body}</code></pre></div>\n`
    );
  };
  md.renderer.rules.code_block = md.renderer.rules.fence;

  md.renderer.rules.heading_open = (toks, idx, opts, e, self) =>
    toks[idx].hidden ? '' : self.renderToken(toks, idx, opts);
  md.renderer.rules.heading_close = (toks, idx, opts, e, self) => {
    const t = toks[idx];
    if (t.hidden) return '';
    const anchor = t.meta?.anchor;
    const link = anchor ? `<a class="anchor" href="#${anchor}" aria-label="Link to this section">#</a>` : '';
    return link + self.renderToken(toks, idx, opts);
  };

  const defaultTableOpen = md.renderer.rules.table_open ?? ((t, i, o, e, s) => s.renderToken(t, i, o));
  md.renderer.rules.table_open = (...a) => `<div class="table-wrap">${defaultTableOpen(...a)}`;
  md.renderer.rules.table_close = () => '</table></div>\n';
  return md;
}

function rewriteHtml(html, resolve, broken) {
  return html.replace(/(\s(?:href|src|poster)=)(["'])(.*?)\2/g, (all, attr, quote, value) => {
    const result = resolve(value);
    if (result.broken) broken.push(result.broken);
    return `${attr}${quote}${result.href}${quote}`;
  });
}

function renderMarkdown(md, source, resolve, broken) {
  const env = {};
  const tokens = md.parse(source, env);
  const toc = [];
  const seen = new Map();
  let title = '';
  let skipUntilClose = false;
  let capturing = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open') {
      const inline = tokens[i + 1];
      const text = inline.children
        ? inline.children.map((c) => (c.type === 'text' || c.type === 'code_inline' ? c.content : '')).join('')
        : inline.content;
      const level = Number(token.tag.slice(1));
      if (level === 1 && !title) {
        title = text.trim();
        skipUntilClose = true;
        token.hidden = true;
        continue;
      }
      let id = slugify(text);
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;
      token.attrSet('id', id);
      token.meta = { anchor: id };
      if (level === 2 || level === 3) toc.push({ level, id, text: text.trim() });
      capturing = token;
    } else if (token.type === 'heading_close') {
      if (skipUntilClose) {
        token.hidden = true;
        skipUntilClose = false;
      } else if (capturing?.meta?.anchor) {
        token.meta = { anchor: capturing.meta.anchor };
        capturing = null;
      }
    } else if (skipUntilClose && token.type === 'inline') {
      token.hidden = true;
      token.children = [];
      token.content = '';
    }
    if (token.type === 'inline' && token.children) {
      for (const child of token.children) {
        if (child.type === 'link_open') {
          const href = child.attrGet('href');
          const result = resolve(href);
          if (result.broken) broken.push(result.broken);
          child.attrSet('href', result.href);
          if (/^https?:/i.test(result.href)) {
            child.attrSet('rel', 'noopener');
            child.attrSet('class', 'ext');
          }
        } else if (child.type === 'image') {
          const result = resolve(child.attrGet('src'));
          if (result.broken) broken.push(result.broken);
          child.attrSet('src', result.href);
          child.attrSet('loading', 'lazy');
        } else if (child.type === 'html_inline') {
          child.content = rewriteHtml(child.content, resolve, broken);
        }
      }
    }
    if (token.type === 'html_block') token.content = rewriteHtml(token.content, resolve, broken);
  }

  const html = md.renderer.render(
    tokens.filter((t) => !(t.type === 'inline' && t.hidden)),
    md.options,
    env,
  );
  return { html, toc, title };
}

// ── content model ──────────────────────────────────────────────────────

function pageUrl(lang, rel) {
  let p = rel.replace(/\.md$/i, '');
  if (/(^|\/)(README|index)$/i.test(p)) p = p.replace(/(^|\/)(README|index)$/i, '');
  p = p.replace(/\/$/, '');
  return `/${lang}/docs/${p ? `${p}/` : ''}`;
}

function topKey(rel) {
  const first = rel.split('/')[0];
  return first;
}

function groupFor(key) {
  const found = config.groups.find((g) => g.items.includes(key));
  return found ? found.id : 'project';
}

function titleFor(lang, dirPath, fallback) {
  const entry = config.titles[dirPath];
  return entry?.[lang] ?? fallback;
}

function booksPage(lang) {
  const s = STRINGS[lang];
  const books = [
    { dir: 'caffeine-internals', title: 'Caffeine Internals', note: s.bookInternals },
    { dir: 'scripting-reference', title: s.bookScripting, note: s.bookScriptingNote },
    { dir: 'fundamentos-computacao-grafica', title: 'Fundamentos de Computação Gráfica', note: s.bookGraphics },
  ];
  const rows = books
    .map((b) => {
      const pdf = path.join(CONTENT, lang, 'docs', b.dir, 'main.pdf');
      const alt = path.join(CONTENT, config.defaultLanguage, 'docs', b.dir, 'main.pdf');
      const have = fs.existsSync(pdf) ? pdf : fs.existsSync(alt) ? alt : null;
      const source = `${config.siteRepo}/tree/main/tex/${b.dir}`;
      const links = [have ? `<a href="/books/${b.dir}.pdf">PDF</a>` : '', `<a href="${source}">LaTeX</a>`]
        .filter(Boolean)
        .join(' · ');
      return `<tr><td><strong>${escapeHtml(b.title)}</strong></td><td>${escapeHtml(b.note)}</td><td>${links}</td></tr>`;
    })
    .join('\n');
  return `# ${s.booksTitle}\n\n<div class="doc-meta"><span class="doc-badge">${s.booksBadge}</span></div>\n\n<p class="doc-lede">${s.booksLede}</p>\n\n<table class="doc-table"><thead><tr><th>${s.bookCol}</th><th>${s.aboutCol}</th><th>${s.linksCol}</th></tr></thead><tbody>\n${rows}\n</tbody></table>\n`;
}

function loadLanguage(lang, ctx) {
  const docsRoot = path.join(CONTENT, lang, 'docs');
  const files = walk(docsRoot).filter((f) => /\.md$/i.test(f));
  const pages = [];
  const virtual = { rel: 'books.md', source: booksPage(lang), virtual: true };
  const entries = files.map((file) => ({
    rel: toPosix(path.relative(docsRoot, file)),
    source: fs.readFileSync(file, 'utf8'),
  }));
  entries.push(virtual);

  for (const entry of entries) {
    const rel = entry.rel;
    const page = {
      lang,
      rel,
      url: pageUrl(lang, rel),
      source: entry.source,
      virtual: !!entry.virtual,
      isIndex: /(^|\/)(README|index)\.md$/i.test(rel),
      key: topKey(rel),
    };
    pages.push(page);
    ctx.pageByRel.set(rel, page);
  }
  ctx.pagesByLang.set(lang, pages);
  return pages;
}

function renderPages(lang, pages, ctx, md) {
  for (const page of pages) {
    const broken = [];
    const resolve = makeResolver(lang, page.rel, ctx);
    const out = renderMarkdown(md, page.source, resolve, broken);
    page.html = out.html;
    page.toc = out.toc;
    page.title = out.title || prettify(path.posix.basename(page.rel));
    const lede = page.html.match(/<p class="doc-lede">([\s\S]*?)<\/p>/);
    const firstPara = page.html.match(/<p>([\s\S]*?)<\/p>/);
    page.description = stripTags(lede ? lede[1] : firstPara ? firstPara[1] : '').slice(0, 220);
    page.text = stripTags(page.html.replace(/<div class="code-block"[\s\S]*?<\/div>\s*<\/div>/g, ' '));
    page.broken = broken;
    page.group = page.rel === 'README.md' ? null : groupFor(page.key);
    for (const message of broken) ctx.broken.push(`${lang}/${page.rel}: ${message}`);
  }
}

// ── navigation tree ────────────────────────────────────────────────────

function buildTree(lang, pages) {
  const root = { kind: 'dir', path: '', children: [], page: null, title: '' };
  const dirs = new Map([['', root]]);
  const ensureDir = (dirPath) => {
    if (dirs.has(dirPath)) return dirs.get(dirPath);
    const parentPath = path.posix.dirname(dirPath) === '.' ? '' : path.posix.dirname(dirPath);
    const parent = ensureDir(parentPath);
    const node = {
      kind: 'dir',
      path: dirPath,
      children: [],
      page: null,
      title: titleFor(lang, dirPath, prettify(path.posix.basename(dirPath))),
    };
    parent.children.push(node);
    dirs.set(dirPath, node);
    return node;
  };
  for (const page of pages) {
    if (page.rel === 'README.md') continue;
    const dirPath = path.posix.dirname(page.rel) === '.' ? '' : path.posix.dirname(page.rel);
    const dir = ensureDir(dirPath);
    if (page.isIndex && dirPath !== '') {
      dir.page = page;
      if (!config.titles[dirPath]) dir.title = page.title;
    } else {
      dir.children.push({ kind: 'page', page, title: page.title });
    }
  }
  const dated = (list) => list.length > 3 && list.filter((n) => n.kind === 'page' && /^\d{4}-\d\d-\d\d/.test(path.posix.basename(n.page.rel))).length > list.length / 2;
  const order = (node) => {
    if (node.kind !== 'dir') return;
    node.children.forEach(order);
    const pagesFirst = (a, b) => (a.kind === b.kind ? 0 : a.kind === 'page' ? -1 : 1);
    if (dated(node.children)) {
      node.children.sort((a, b) => pagesFirst(a, b) || (b.page?.rel ?? b.path).localeCompare(a.page?.rel ?? a.path));
    } else {
      node.children.sort((a, b) => pagesFirst(a, b) || a.title.localeCompare(b.title, lang));
    }
  };
  order(root);
  return { root, dirs };
}

function groupTrees(lang, root) {
  const bucket = new Map(config.groups.map((g) => [g.id, []]));
  const byKey = new Map();
  for (const child of root.children) byKey.set(child.kind === 'dir' ? child.path : path.posix.basename(child.page.rel), child);
  for (const group of config.groups) {
    for (const item of group.items) if (byKey.has(item)) { bucket.get(group.id).push(byKey.get(item)); byKey.delete(item); }
  }
  for (const [, node] of byKey) bucket.get('project').push(node);
  return bucket;
}

function flatten(nodes, out = []) {
  for (const node of nodes) {
    if (node.kind === 'dir') {
      if (node.page) out.push(node.page);
      flatten(node.children, out);
    } else out.push(node.page);
  }
  return out;
}

function countPages(node) {
  if (node.kind === 'page') return 1;
  return (node.page ? 1 : 0) + node.children.reduce((n, c) => n + countPages(c), 0);
}

// ── output ─────────────────────────────────────────────────────────────

function write(file, content) {
  const full = path.join(DIST, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function copyFile(from, to) {
  const full = path.join(DIST, to);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.copyFileSync(from, full);
}

function build() {
  const started = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const ctx = {
    pageByRel: new Map(),
    pagesByLang: new Map(),
    assets: new Map(),
    broken: [],
  };

  const stamp = crypto
    .createHash('sha1')
    .update(fs.readFileSync(path.join(ASSETS, 'style.css')))
    .update(fs.readFileSync(path.join(ASSETS, 'app.js')))
    .digest('hex')
    .slice(0, 8);

  const md = createMarkdown();
  const sitemap = [];
  let pageCount = 0;

  for (const language of config.languages) {
    const lang = language.code;
    ctx.pageByRel = new Map();
    const pages = loadLanguage(lang, ctx);
    renderPages(lang, pages, ctx, md);
    const { root } = buildTree(lang, pages);
    const trees = groupTrees(lang, root);
    const shared = { config, lang, stamp, trees, groups: config.groups, root };

    // Search index.
    const index = pages.map((p) => [
      p.title,
      p.url,
      p.group ? config.groups.find((g) => g.id === p.group)?.title[lang] ?? '' : STRINGS[lang].docsHome,
      p.toc.map((h) => h.text).join(' | '),
      p.text.slice(0, 1800),
    ]);
    write(`${lang}/search.json`, JSON.stringify(index));

    // Documentation pages.
    for (const page of pages) {
      const groupNodes = page.group ? trees.get(page.group) : null;
      const flat = groupNodes ? flatten(groupNodes) : [];
      const at = flat.indexOf(page);
      const html = renderPage({
        ...shared,
        page,
        prev: at > 0 ? flat[at - 1] : null,
        next: at >= 0 && at < flat.length - 1 ? flat[at + 1] : null,
        switchTo: (code) => (ctx.pagesByLang.get(code)?.some((p) => p.rel === page.rel) ? pageUrl(code, page.rel) : `/${code}/`),
        sections: groupNodes,
      });
      write(`${page.url.slice(1)}index.html`, html);
      sitemap.push(page.url);
      pageCount++;
    }

    // Section landing pages and the home page.
    for (const group of config.groups) {
      const nodes = trees.get(group.id);
      const html = renderLanding({
        ...shared,
        group,
        nodes,
        counts: new Map(nodes.map((n) => [n, countPages(n)])),
        switchTo: (code) => `/${code}/section/${group.id}/`,
      });
      write(`${lang}/section/${group.id}/index.html`, html);
      sitemap.push(`/${lang}/section/${group.id}/`);
    }
    write(
      `${lang}/index.html`,
      renderHome({ ...shared, switchTo: (code) => `/${code}/`, pageCount: pages.length, firstOf: (id) => {
        const nodes = trees.get(id) ?? [];
        return nodes.length ? `/${lang}/section/${id}/` : `/${lang}/docs/`;
      } }),
    );
    sitemap.push(`/${lang}/`);
    write(
      `${lang}/404.html`,
      renderNotFound({ ...shared, switchTo: (code) => `/${code}/` }),
    );
  }

  // Assets referenced by pages.
  for (const [url, file] of ctx.assets) copyFile(file, url.slice(1));
  // Whole image trees, so figures that Markdown only hints at (poster, source) still resolve.
  for (const language of config.languages) {
    const images = path.join(CONTENT, language.code, 'docs', 'images');
    for (const file of walk(images)) {
      copyFile(file, `${language.code}/docs/images/${toPosix(path.relative(images, file))}`);
    }
  }
  // Books.
  for (const dir of ['caffeine-internals', 'scripting-reference', 'fundamentos-computacao-grafica']) {
    for (const code of [config.defaultLanguage, ...config.languages.map((l) => l.code)]) {
      const pdf = path.join(CONTENT, code, 'docs', dir, 'main.pdf');
      if (fs.existsSync(pdf)) {
        copyFile(pdf, `books/${dir}.pdf`);
        break;
      }
    }
  }

  // Static assets.
  for (const file of fs.readdirSync(ASSETS)) copyFile(path.join(ASSETS, file), `assets/${file}`);
  const mermaid = path.join(ROOT, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js');
  if (fs.existsSync(mermaid)) copyFile(mermaid, 'assets/vendor/mermaid.min.js');

  // Root files.
  write('index.html', renderRootRedirect({ config }));
  write('404.html', renderNotFound({ config, lang: 'en', stamp, trees: new Map(), groups: config.groups, switchTo: () => '/en/' }));
  write('CNAME', `${new URL(config.url).host}\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${config.url}/sitemap.xml\n`);
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(sitemap)]
      .map((u) => `  <url><loc>${config.url}${u}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
  );

  const unique = [...new Set(ctx.broken)];
  console.log(`built ${pageCount} pages, ${ctx.assets.size} linked assets in ${Date.now() - started} ms`);
  if (unique.length) {
    console.log(`${unique.length} broken reference(s):`);
    for (const message of unique.slice(0, 60)) console.log(`  ${message}`);
  }
  return unique;
}

function serve() {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };
  http
    .createServer((req, res) => {
      let url = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(DIST, url);
      if (!file.startsWith(DIST)) return res.writeHead(403).end();
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'content-type': types['.html'] });
        return res.end(fs.readFileSync(path.join(DIST, '404.html')));
      }
      res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    })
    .listen(4173, () => console.log('serving http://localhost:4173'));
  let timer = null;
  for (const dir of [CONTENT, path.join(ROOT, 'site')]) {
    fs.watch(dir, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          build();
        } catch (error) {
          console.error(error);
        }
      }, 300);
    });
  }
}

const broken = build();
if (args.has('--check') && broken.length) process.exit(1);
if (args.has('--serve')) serve();
