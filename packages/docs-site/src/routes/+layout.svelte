<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { readLangFromStorage, t as tr } from '$lib/i18n.js';

  let { children } = $props();

  let lang = $state('pt');
  onMount(() => {
    lang = readLangFromStorage();
  });

  const embed = $derived($page.url.searchParams.get('embed') === '1');

  const home = '/';
  const docsRoot = base || '/docs';

  function isDocsActive() {
    const p = $page.url.pathname;
    return p === docsRoot || p.startsWith(`${docsRoot}/`);
  }
</script>

{#if !embed}
<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href={home} rel="external">
      <span class="site-brand-mark">☕</span>
      <span>Caffeine <span style="color: var(--accent-punch)">·</span> Doppio</span>
    </a>
    <nav class="site-nav" aria-label="Site">
      <a href={home} rel="external">{tr(lang, 'site')}</a>
      <a href="{docsRoot}" class:active={isDocsActive()}>{tr(lang, 'docs')}</a>
      <a href="{docsRoot}#topicos">{tr(lang, 'topics')}</a>
      <a href="{home}#tutorials" rel="external">{tr(lang, 'tutorials')}</a>
      <a href="{base}/pdf">{tr(lang, 'pdf')}</a>
    </nav>
  </div>
</header>
{/if}

<main class:doc-embed-root={embed}>{@render children()}</main>
