# Session

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 5</span>
</div>

<p class="doc-lede">A key-value store that survives scene changes for as long as the game runs (score, settings, choices). Values are numbers, booleans or text. It is not saved to disk.</p>

[All namespaces](index.md)

Namespace: `caffeine.session` · Dryad prefix: `caffeine_session_`

## set

Lua: `caffeine.session.set` · Dryad: `caffeine_session_set`

```
set(key, value)
```

Stores a value.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Name of the value.</td></tr>
<tr><td><code>value</code></td><td>number | boolean | string | nil</td><td>The value to keep; nil removes the key.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.session.set("coins", 12)
```

## get

Lua: `caffeine.session.get` · Dryad: `caffeine_session_get`

```
get(key) -> any
```

Reads a value.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Name of the value.</td></tr>
</tbody>
</table>

**Returns:** `number | boolean | string | nil`. The stored value, or nil when the key does not exist.

**Example**

```lua
local coins = caffeine.session.get("coins") or 0
```

## has

Lua: `caffeine.session.has` · Dryad: `caffeine_session_has`

```
has(key) -> boolean
```

Tells whether a key exists.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Name of the value.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true when the key exists.

**Example**

```lua
if caffeine.session.has("checkpoint") then end
```

## remove

Lua: `caffeine.session.remove` · Dryad: `caffeine_session_remove`

```
remove(key) -> boolean
```

Deletes a key.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Name of the value.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true when the key existed.

**Example**

```lua
caffeine.session.remove("checkpoint")
```

## clear

Lua: `caffeine.session.clear` · Dryad: `caffeine_session_clear`

```
clear()
```

Deletes every key.

**Returns:** none

**Example**

```lua
caffeine.session.clear() -- new game
```
