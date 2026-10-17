<script>
  import { page } from '$app/stores';
  import DocSidebar from '$lib/components/DocSidebar.svelte';
  import DocsToolbar from '$lib/components/DocsToolbar.svelte';
  import DocCrossRefs from '$lib/components/DocCrossRefs.svelte';
  import DocBreadcrumb from '$lib/components/DocBreadcrumb.svelte';

  let { data } = $props();
  let searchQuery = $state('');
  const embed = $derived($page.url.searchParams.get('embed') === '1');
</script>

<svelte:head>
  <title>{data.meta.title} · Caffeine Docs</title>
</svelte:head>

{#if embed}
  <div class="doc-embed">
    <div class="doc-main doc-article">
      {@html data.html}
    </div>
    <DocCrossRefs slug={data.meta.slug} index={data.index} graph={data.graph} />
  </div>
{:else}
  <div class="doc-layout">
    <DocSidebar index={data.index} activeSlug={data.meta.slug} />
    <div class="doc-content">
      <DocsToolbar index={data.index} bind:query={searchQuery} />
      <DocBreadcrumb entry={data.meta} />
      <div class="doc-main">
        {@html data.html}
      </div>
      <DocCrossRefs slug={data.meta.slug} index={data.index} graph={data.graph} />
    </div>
  </div>
{/if}
