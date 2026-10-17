<script>
  import { base } from '$app/paths';
  import { sourceLabels, topicHubs } from '$lib/nav-meta.js';
  import { docHref } from '$lib/doc-href.js';
  import DocsToolbar from '$lib/components/DocsToolbar.svelte';

  let { data } = $props();
  let searchQuery = $state('');
</script>

<svelte:head>
  <title>Documentação · Caffeine & Doppio</title>
</svelte:head>

<div class="docs-home">
  <DocsToolbar index={data.index} bind:query={searchQuery} />
  <div class="doc-main docs-index">
    <h1>Documentação Caffeine</h1>
    <p class="muted">
      Referência técnica do motor, planos de implementação e notas de release — migrada do repositório
      <code>caffeine</code>. O site de marketing está em <a href="/" rel="external">/</a>; aqui é o
      índice completo ({data.index.length} páginas).
    </p>

    <section class="topic-hub-grid" id="topicos">
      <h2>Tópicos</h2>
      <ul class="topic-hub-cards">
        {#each topicHubs as hub}
          <li>
            <a href="{base}/topic/{hub.id}">
              <strong>{hub.title}</strong>
              <span>{hub.blurb}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>

    <p class="muted docs-quick-links">
      <a href={docHref('docs/MASTER', base)}>MASTER</a> ·
      <a href={docHref('docs/README', base)}>Índice funcional</a> ·
      <a href={docHref('docs/HISTORY', base)}>Histórico</a> ·
      <a href={docHref('docs/ECOSYSTEM_WORKFLOW', base)}>Ecossistema</a>
    </p>

    {#each Object.entries(data.grouped) as [source, sections]}
      <section class="docs-index-group">
        <h2>{sourceLabels[source] ?? source}</h2>
        {#each Object.entries(sections) as [section, entries]}
          <h3>{section}</h3>
          <ul>
            {#each entries as entry}
              <li>
                <a href={docHref(entry.slug, base)}>{entry.title}</a>
              </li>
            {/each}
          </ul>
        {/each}
      </section>
    {/each}
  </div>
</div>

<style>
  .docs-home {
    max-width: 56rem;
    margin: 0 auto;
    padding: 1.5rem 1.25rem 3rem;
  }

  .docs-quick-links a {
    color: var(--accent-punch);
    text-decoration: none;
  }

  .docs-quick-links a:hover {
    text-decoration: underline;
  }
</style>
