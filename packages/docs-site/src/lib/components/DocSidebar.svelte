<script>
  import { base } from '$app/paths';
  import { sourceLabels, groupIndex } from '$lib/nav-meta.js';
  import { docHref } from '$lib/doc-href.js';

  let { index = [], activeSlug = '' } = $props();

  const grouped = $derived(groupIndex(index));

  function sectionContainsActive(entries) {
    return activeSlug && entries.some((e) => e.slug === activeSlug);
  }
</script>

<aside class="doc-sidebar" aria-label="Documentação">
  {#each Object.entries(grouped) as [source, sections]}
    <div class="doc-sidebar-block">
      <h2 class="doc-sidebar-source">{sourceLabels[source] ?? source}</h2>
      {#each Object.entries(sections) as [section, entries]}
        <details class="doc-sidebar-details" open={sectionContainsActive(entries)}>
          <summary class="doc-sidebar-section">{section} ({entries.length})</summary>
          <ul>
            {#each entries as entry}
              <li>
                <a
                  href={docHref(entry.slug, base)}
                  class:active={entry.slug === activeSlug}
                  title={entry.path}
                >
                  {entry.title}
                </a>
              </li>
            {/each}
          </ul>
        </details>
      {/each}
    </div>
  {/each}
</aside>
