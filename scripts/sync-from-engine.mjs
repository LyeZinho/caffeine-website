#!/usr/bin/env node
/**
 * Copy Markdown documentation from the engine repo (parent of this submodule)
 * into import/ for migrate-markdown-to-html.mjs. import/ is gitignored; run
 * migrate:md and commit content/html + search-index.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const engineRoot = path.resolve(websiteRoot, '..');

const pairs = [
  { from: path.join(engineRoot, 'docs'), to: path.join(websiteRoot, 'import', 'docs') },
  { from: path.join(engineRoot, 'planning'), to: path.join(websiteRoot, 'import', 'planning') },
  { from: path.join(engineRoot, '.planning'), to: path.join(websiteRoot, 'import', 'planning', '.planning') },
];

const engineRootMd = [
  'CHANGELOG.md',
  'BUILD_CHECKLIST.md',
  'BUILD_GUIDE.md',
  'SESSION_SUMMARY.md',
];

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`skip (missing): ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) copyDir(from, to);
    else if (name.endsWith('.md')) fs.copyFileSync(from, to);
  }
}

for (const { from, to } of pairs) {
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  copyDir(from, to);
  console.log(`synced ${from} -> ${to}`);
}

const engineRootOut = path.join(websiteRoot, 'import', 'engine-root');
fs.mkdirSync(engineRootOut, { recursive: true });
for (const name of engineRootMd) {
  const from = path.join(engineRoot, name);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, path.join(engineRootOut, name));
    console.log(`copied ${name}`);
  }
}

console.log('Done. Run: npm run migrate:md');
