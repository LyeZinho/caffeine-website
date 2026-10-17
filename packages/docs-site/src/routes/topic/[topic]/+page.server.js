import { error } from '@sveltejs/kit';
import { loadSearchIndex } from '$lib/content.server.js';
import { topicHubs, hubEntries, publicHub } from '$lib/nav-meta.js';

export function entries() {
  return topicHubs.map((h) => ({ topic: h.id }));
}

/** @param {{ params: { topic: string } }} event */
export function load({ params }) {
  const hub = topicHubs.find((h) => h.id === params.topic);
  if (!hub) error(404, 'Tópico não encontrado');
  const index = loadSearchIndex();
  const entries = hubEntries(hub, index);
  const related = (hub.related ?? [])
    .map((id) => topicHubs.find((h) => h.id === id))
    .filter(Boolean);
  return {
    hub: publicHub(hub),
    entries,
    related: related.map(publicHub),
    index,
  };
}
