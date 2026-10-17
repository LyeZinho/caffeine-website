import { error } from '@sveltejs/kit';
import { loadDocHtml, loadLinkGraph, loadSearchIndex } from '$lib/content.server.js';

export function entries() {
  return loadSearchIndex().map(({ slug }) => ({ slug }));
}

/** @param {{ params: { slug: string } }} event */
export function load({ params }) {
  const slug = params.slug;
  const index = loadSearchIndex();
  const meta = index.find((e) => e.slug === slug);
  if (!meta) error(404, 'Documento não encontrado');

  try {
    const html = loadDocHtml(slug);
    const graph = loadLinkGraph();
    return { html, meta, index, graph, xref: graph[slug] ?? null };
  } catch {
    error(404, 'Documento não encontrado');
  }
}
