import { loadSearchIndex } from '$lib/content.server.js';
import { groupIndex } from '$lib/nav-meta.js';

export function load() {
  const index = loadSearchIndex();
  return { index, grouped: groupIndex(index) };
}
