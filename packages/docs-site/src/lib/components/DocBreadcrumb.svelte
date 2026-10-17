<script>
  import { base } from '$app/paths';
  import { docHref } from '$lib/doc-href.js';
  import { sourceLabels } from '$lib/nav-meta.js';

  let { entry } = $props();

  const parts = $derived(entry?.path?.split('/') ?? []);
  const section = $derived(parts.length > 1 ? parts[0] : null);
</script>

{#if entry}
  <nav class="doc-breadcrumb" aria-label="Breadcrumb">
    <a href={base || '/docs'}>Docs</a>
    <span aria-hidden="true">/</span>
    <span class="muted">{sourceLabels[entry.source] ?? entry.source}</span>
    {#if section}
      <span aria-hidden="true">/</span>
      <span>{section}</span>
    {/if}
    <span aria-hidden="true">/</span>
    <span class="current">{entry.title}</span>
  </nav>
{/if}
