# Events

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 3 · Dryad 0</span>
</div>

<p class="doc-lede">A simple named-event bus: subscribe, emit and unsubscribe.</p>

[All namespaces](index.md)

Namespace: `caffeine.events`

## on

Lua: `caffeine.events.on`

```
on(eventName, callback) -> integer
```

Subscribes a callback to a named event.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>eventName</code></td><td>string</td><td>Event name.</td></tr>
<tr><td><code>callback</code></td><td>function</td><td>Called with the arguments given to emit.</td></tr>
</tbody>
</table>

**Returns:** `integer`. Handler handle for off.

**Example**

```lua
local h = caffeine.events.on('hit', function(dmg) end)
```

## emit

Lua: `caffeine.events.emit`

```
emit(eventName, ...)
```

Calls every handler of the event in registration order. A handler error is logged and does not stop the others.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>eventName</code></td><td>string</td><td>Event name.</td></tr>
<tr><td><code>...</code></td><td>any</td><td>Arguments passed to each handler.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.events.emit('hit', 10)
```

## off

Lua: `caffeine.events.off`

```
off(handle)
```

Removes a handler.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>integer</td><td>Handle returned by on.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.events.off(h)
```
