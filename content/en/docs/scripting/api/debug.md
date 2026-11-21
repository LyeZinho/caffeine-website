# Debug

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 3 · Dryad 1</span>
</div>

<p class="doc-lede">Logging to the engine console.</p>

[All namespaces](index.md)

Namespace: `caffeine.debug` · Dryad prefix: `caffeine_log`

## log

Lua: `caffeine.debug.log` · Dryad: `caffeine_log`

```
log(msg)
```

Writes an info message to the engine log (source "Lua"). In Dryad `caffeine_log(value)` logs the first argument as text under "Dryad".

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>msg</code></td><td>string</td><td>Message text.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.debug.log('hello')
```

## warn

Lua: `caffeine.debug.warn`

```
warn(msg)
```

Writes a warning to the engine log.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>msg</code></td><td>string</td><td>Message text.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.debug.warn('low health')
```

## error

Lua: `caffeine.debug.error`

```
error(msg)
```

Writes an error message to the engine log. It does not stop the script.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>msg</code></td><td>string</td><td>Message text.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.debug.error('missing target')
```
