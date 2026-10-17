<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { docHref } from '$lib/doc-href.js';
  import { readLangFromStorage, t as tr } from '$lib/i18n.js';

  let { index = [], query = $bindable('') } = $props();
  let lang = $state('pt');
  onMount(() => {
    lang = readLangFromStorage();
  });

  const hits = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          e.path.toLowerCase().includes(q)
      )
      .slice(0, 12);
  });
</script>

<div class="docs-toolbar">
  <input
    type="search"
    placeholder={tr(lang, 'search')}
    bind:value={query}
    aria-label="Pesquisar"
  />
</div>

{#if query.trim() && hits.length}
  <ul class="docs-search-hits">
    {#each hits as hit}
      <li>
        <a href={docHref(hit.slug, base)}>{hit.title}</a>
        <span class="muted">{hit.slug}</span>
      </li>
    {/each}
  </ul>
{/if}
