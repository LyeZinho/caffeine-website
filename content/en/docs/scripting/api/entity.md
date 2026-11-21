# Entity

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 4</span>
</div>

<p class="doc-lede">Names and lookup. Entities are plain numeric ids; a name is optional and need not be unique.</p>

[All namespaces](index.md)

Namespace: `caffeine.entity` · Dryad prefix: `caffeine_entity_`

## name

Lua: `caffeine.entity.name` · Dryad: `caffeine_entity_name`

```
name(entity) -> string
```

Reads the editor name of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
</tbody>
</table>

**Returns:** `string`. The name, or an empty string when unnamed or dead.

**Example**

```lua
print(caffeine.entity.name(eid))
```

## setName

Lua: `caffeine.entity.setName` · Dryad: `caffeine_entity_set_name`

```
setName(entity, name) -> boolean
```

Names an entity so it can be found later.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>New name, at most 63 characters.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when the entity is not alive.

**Example**

```lua
caffeine.entity.setName(eid, "Boss")
```

## find

Lua: `caffeine.entity.find` · Dryad: `caffeine_entity_find`

```
find(name) -> number
```

Finds an entity by name.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Exact name to look for.</td></tr>
</tbody>
</table>

**Returns:** `number`. The lowest matching entity id, or 0 when none.

**Example**

```lua
local boss = caffeine.entity.find("Boss")
```

## findAll

Lua: `caffeine.entity.findAll` · Dryad: `caffeine_entity_find_all`

```
findAll(name) -> table
```

Finds every entity with a name.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Exact name to look for.</td></tr>
</tbody>
</table>

**Returns:** `table`. Array of matching entity ids, ascending (empty when none).

**Example**

```lua
for _, id in ipairs(caffeine.entity.findAll("Coin")) do caffeine.world.destroy(id) end
```

## isAlive

Lua: `caffeine.entity.isAlive`

```
isAlive(entity) -> boolean
```

Tells whether an id still refers to a live entity. Dryad: use caffeine_world_is_alive.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true when the entity exists.

**Example**

```lua
if caffeine.entity.isAlive(target) then end
```
