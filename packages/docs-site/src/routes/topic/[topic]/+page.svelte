<script>
  import { base } from '$app/paths';
  import { docHref } from '$lib/doc-href.js';
  import DocSidebar from '$lib/components/DocSidebar.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.hub.title} · Caffeine Docs</title>
</svelte:head>

<div class="doc-layout">
  <DocSidebar index={data.index} />
  <div class="doc-content">
    <div class="doc-main docs-index">
      <nav class="doc-breadcrumb">
        <a href={base || '/docs'}>Docs</a>
        <span>/</span>
        <span class="current">Tópico: {data.hub.title}</span>
      </nav>
      <h1>{data.hub.title}</h1>
      <p class="muted">{data.hub.blurb}</p>

      {#if data.related.length}
        <section class="topic-related">
          <h2>Ver também</h2>
          <ul class="doc-xref-pills">
            {#each data.related as hub}
              <li><a href="{base}/topic/{hub.id}">{hub.title}</a></li>
            {/each}
          </ul>
        </section>
      {/if}

      <section class="topic-entries">
        <h2>Páginas neste tópico ({data.entries.length})</h2>
        <ul>
          {#each data.entries as entry}
            <li>
              <a href={docHref(entry.slug, base)}>{entry.title}</a>
              <span class="muted">{entry.slug}</span>
            </li>
          {/each}
        </ul>
      </section>
    </div>
  </div>
</div>
