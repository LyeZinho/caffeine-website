import fs from 'node:fs';
import path from 'node:path';

/** Monorepo content root (html + search-index.json). */
export const contentRoot = path.resolve(process.cwd(), '../../content');

export function loadSearchIndex() {
  const indexPath = path.join(contentRoot, 'search-index.json');
  return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
}

export function loadLinkGraph() {
  const graphPath = path.join(contentRoot, 'link-graph.json');
  if (!fs.existsSync(graphPath)) return {};
  return JSON.parse(fs.readFileSync(graphPath, 'utf8'));
}

/** @param {string} slug */
export function loadDocHtml(slug) {
  const file = path.join(contentRoot, 'html', `${slug}.html`);
  return fs.readFileSync(file, 'utf8');
}
