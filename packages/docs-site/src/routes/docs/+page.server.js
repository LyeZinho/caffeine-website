import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const contentRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../..',
  'content',
);

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const indexPath = path.join(contentRoot, 'search-index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  return { index };
}
