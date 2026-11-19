# Assets

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Read project assets from scripts.</p>

[All namespaces](index.md)

Namespace: `caffeine.assets`

## loadText

Lua: `caffeine.assets.loadText`

```
loadText(path) -> string
```

Loads a text file. A failure returns the error text rather than raising, so check what you get back.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>Asset path; also searched under the project root, assets/, data/ and data/assets/.</td></tr>
</tbody>
</table>

**Returns:** `string`. The file text (cached); on failure the error message; nil without a loader.

**Example**

```lua
local json = caffeine.assets.loadText('data/items.json')
```
