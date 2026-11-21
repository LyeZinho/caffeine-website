# Native modules

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 2 · Dryad 0</span>
</div>

<p class="doc-lede">Load and call native modules through JSON.</p>

[All namespaces](index.md)

Namespace: `caffeine.native`

## load

Lua: `caffeine.native.load`

```
load(name) -> boolean
```

Loads a native module. The load error is not reported to the script.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Native module name.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True when the module loaded.

**Example**

```lua
caffeine.native.load('mymodule')
```

## call

Lua: `caffeine.native.call`

```
call(module, fn[, argsJson]) -> string
```

Calls a function of a loaded native module with JSON arguments.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>module</code></td><td>string</td><td>Module name.</td></tr>
<tr><td><code>fn</code></td><td>string</td><td>Function name.</td></tr>
<tr><td><code>argsJson</code></td><td>string</td><td>JSON arguments (default "{}").</td></tr>
</tbody>
</table>

**Returns:** `string`. The result text; on failure the error message is returned instead.

**Example**

```lua
local out = caffeine.native.call('mymodule', 'ping', '{}')
```
