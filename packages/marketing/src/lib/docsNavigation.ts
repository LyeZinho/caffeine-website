/** Full navigation to the Svelte docs app (proxied at /docs in dev and dist). */
export function openEngineDocs(slug?: string): void {
  const path = slug ? `/docs/${slug}` : '/docs/';
  window.location.assign(path);
}
