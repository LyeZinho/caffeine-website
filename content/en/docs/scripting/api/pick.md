# Pick

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Input</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 8 · Dryad 0</span>
</div>

<p class="doc-lede">Find the entity under a point, a screen position, the mouse or a 3D ray, and register custom pickers.</p>

[All namespaces](index.md)

Namespace: `caffeine.pick`

## world

Lua: `caffeine.pick.world`

```
world(wx, wy) -> integer
```

Picks the entity under a 2D world position.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>wx</code></td><td>number</td><td>World x.</td></tr>
<tr><td><code>wy</code></td><td>number</td><td>World y.</td></tr>
</tbody>
</table>

**Returns:** `integer`. Entity id, or 0 when nothing is hit.

**Example**

```lua
local e = caffeine.pick.world(3, 4)
```

## screen

Lua: `caffeine.pick.screen`

```
screen(sx, sy) -> integer
```

Converts a screen position to the world using the play-mode camera and picks the entity there.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>sx</code></td><td>number</td><td>Screen x.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>Screen y.</td></tr>
</tbody>
</table>

**Returns:** `integer`. Entity id, or 0 when nothing is hit.

**Example**

```lua
local e = caffeine.pick.screen(400, 300)
```

## atMouse

Lua: `caffeine.pick.atMouse`

```
atMouse() -> integer
```

Picks the entity under the mouse cursor; 0 without a world or input.

**Returns:** `integer`. Entity id, or 0 when nothing is hit.

**Example**

```lua
local e = caffeine.pick.atMouse()
```

## screenToWorld

Lua: `caffeine.pick.screenToWorld`

```
screenToWorld(sx, sy) -> table
```

Converts a screen position to a 2D world position.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>sx</code></td><td>number</td><td>Screen x.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>Screen y.</td></tr>
</tbody>
</table>

**Returns:** `table`. {x, y} in world units.

**Example**

```lua
local w = caffeine.pick.screenToWorld(400, 300)
```

## register

Lua: `caffeine.pick.register`

```
register(fn) -> integer
```

Registers a custom picker consulted by pick queries.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>fn</code></td><td>function</td><td>Called as fn(worldX, worldY); return an entity id (above 0) for a hit, or false/nil for none.</td></tr>
</tbody>
</table>

**Returns:** `integer`. Handle for unregister.

**Example**

```lua
local h = caffeine.pick.register(function(x, y) return 0 end)
```

## unregister

Lua: `caffeine.pick.unregister`

```
unregister(handle)
```

Removes a custom picker.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>integer</td><td>Handle from register.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.pick.unregister(h)
```

## query

Lua: `caffeine.pick.query`

```
query(wx, wy) -> table
```

Full pick query at a world position, including custom pickers.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>wx</code></td><td>number</td><td>World x.</td></tr>
<tr><td><code>wy</code></td><td>number</td><td>World y.</td></tr>
</tbody>
</table>

**Returns:** `table`. {kind = "entity", entityId}, {kind = "custom", customId} or {kind = "none"}; empty without a world.

**Example**

```lua
local hit = caffeine.pick.query(3, 4)
if hit.kind == 'entity' then caffeine.debug.log(hit.entityId) end
```

## raycast

Lua: `caffeine.pick.raycast`

```
raycast(origin, dir) -> integer
```

Casts a 3D ray and returns the entity hit.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>origin</code></td><td>table</td><td>{x, y, z}; missing parts are 0.</td></tr>
<tr><td><code>dir</code></td><td>table</td><td>{x, y, z} direction; normalised for you (default z = 1).</td></tr>
</tbody>
</table>

**Returns:** `integer`. Entity id, or 0 when nothing is hit.

**Example**

```lua
local e = caffeine.pick.raycast({x=0,y=1,z=0}, {x=0,y=0,z=1})
```
