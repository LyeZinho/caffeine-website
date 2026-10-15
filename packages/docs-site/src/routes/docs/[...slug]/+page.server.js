import fs from 'node:fs';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { fileURLToPath } from 'node:url';

const contentRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../../..',
  'content',
);

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  const slug = params.slug;
  const file = path.join(contentRoot, 'html', `${slug}.html`);
  if (!fs.existsSync(file)) {
    error(404, 'Document not found');
  }
  const indexPath = path.join(contentRoot, 'search-index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const meta = index.find((e) => e.slug === slug);
  const html = fs.readFileSync(file, 'utf8');
  return { slug, title: meta?.title ?? slug, html };
}
