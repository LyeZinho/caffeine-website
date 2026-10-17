<script>
  import { base } from '$app/paths';
  import { docHref } from '$lib/doc-href.js';
  import { hubsForSlug, sectionSiblings, topicHubs } from '$lib/nav-meta.js';

  let { slug, index = [], graph = {} } = $props();

  const entry = $derived(index.find((e) => e.slug === slug));
  const node = $derived(graph[slug] ?? { outgoing: [], backlinks: [], prev: null, next: null });
  const hubs = $derived(entry ? hubsForSlug(slug, index) : []);
  const siblings = $derived(entry ? sectionSiblings(entry, index).slice(0, 8) : []);
  const relatedHubs = $derived.by(() => {
    const seen = new Set();
    const list = [];
    for (const h of hubs) {
      for (const id of h.related ?? []) {
        if (seen.has(id) || hubs.some((x) => x.id === id)) continue;
        const hub = topicHubs.find((t) => t.id === id);
        if (hub) {
          seen.add(id);
          list.push(hub);
        }
      }
    }
    return list;
  });

  function titleFor(s) {
    return index.find((e) => e.slug === s)?.title ?? s;
  }
</script>

<nav class="doc-crossrefs" aria-label="Referências cruzadas">
  {#if node.prev || node.next}
    <section class="doc-xref-block">
      <h2>Sequência (planeamento)</h2>
      <div class="doc-seq">
        {#if node.prev}
          <a class="doc-seq-link" href={docHref(node.prev, base)}>← {titleFor(node.prev)}</a>
        {/if}
        {#if node.next}
          <a class="doc-seq-link" href={docHref(node.next, base)}>{titleFor(node.next)} →</a>
        {/if}
      </div>
    </section>
  {/if}

  {#if hubs.length}
    <section class="doc-xref-block">
      <h2>Tópicos</h2>
      <ul class="doc-xref-list">
        {#each hubs as hub}
          <li>
            <a href="{base}/topic/{hub.id}">{hub.title}</a>
            <span class="muted">{hub.blurb}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if relatedHubs.length}
    <section class="doc-xref-block">
      <h2>Áreas relacionadas</h2>
      <ul class="doc-xref-pills">
        {#each relatedHubs as hub}
          <li><a href="{base}/topic/{hub.id}">{hub.title}</a></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if node.outgoing?.length}
    <section class="doc-xref-block">
      <h2>Liga para</h2>
      <ul class="doc-xref-list compact">
        {#each node.outgoing.slice(0, 24) as link}
          <li><a href={docHref(link.slug, base)}>{link.title}</a></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if node.backlinks?.length}
    <section class="doc-xref-block">
      <h2>Mencionado em</h2>
      <ul class="doc-xref-list compact">
        {#each node.backlinks as link}
          <li><a href={docHref(link.slug, base)}>{link.title}</a></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if siblings.length}
    <section class="doc-xref-block">
      <h2>Mesma secção</h2>
      <ul class="doc-xref-list compact">
        {#each siblings as s}
          <li><a href={docHref(s.slug, base)}>{s.title}</a></li>
        {/each}
      </ul>
    </section>
  {/if}
</nav>
