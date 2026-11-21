# Core

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Top-level helpers of the caffeine table.</p>

[All namespaces](index.md)

Namespace: `caffeine`

## require

Lua: `caffeine.require`

```
require(name)
```

Loads and runs another script module from the project's scripts/ folder. It returns nothing; an error is raised if loading fails.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Module name; dots become folders, so 'util.maths' loads scripts/util/maths.lua.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.require('util.maths')
```
