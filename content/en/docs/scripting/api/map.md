# Map

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">World</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Hooks for map surface chunk requests.</p>

[All namespaces](index.md)

Namespace: `caffeine.map`

## onChunkRequest

Lua: `caffeine.map.onChunkRequest`

```
onChunkRequest(callback) -> number
```

Registers a handler for the `mapChunkRequest` event raised when a map surface requests a chunk.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>callback</code></td><td>function</td><td>Called with a payload table: `surfaceEntityId`, `chunkX`, `chunkY`, `worldMinX`, `worldMinY`, `chunkSize`.</td></tr>
</tbody>
</table>

**Returns:** `number`. Event handler handle.

**Example**

```lua
caffeine.map.onChunkRequest(function(req)
  print(req.chunkX, req.chunkY)
end)
```
