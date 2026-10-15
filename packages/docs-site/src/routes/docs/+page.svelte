<script>
  let { data } = $props();
</script>

<svelte:head>
  <title>Documentation index</title>
</svelte:head>

<h1>Documentation</h1>
<p class="muted">{data.index.length} pages</p>
<ul>
  {#each data.index as entry}
    <li><a href="/docs/{entry.slug}">{entry.title}</a> <span class="muted">({entry.source})</span></li>
  {/each}
</ul>
