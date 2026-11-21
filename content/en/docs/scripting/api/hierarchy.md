# Hierarchy

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 6</span>
</div>

<p class="doc-lede">Parent and child links between entities. A child's transform is composed with its parent's.</p>

[All namespaces](index.md)

Namespace: `caffeine.hierarchy` · Dryad prefix: `caffeine_hierarchy_`

## parent

Lua: `caffeine.hierarchy.parent` · Dryad: `caffeine_hierarchy_parent`

```
parent(entity) -> number
```

Returns the parent of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. The parent id, or 0 when it has none.

**Example**

```lua
local p = caffeine.hierarchy.parent(eid)
```

## setParent

Lua: `caffeine.hierarchy.setParent` · Dryad: `caffeine_hierarchy_set_parent`

```
setParent(entity, parent) -> boolean
```

Attaches an entity under another.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The child.</td></tr>
<tr><td><code>parent</code></td><td>number</td><td>The new parent; 0 detaches.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when either entity is dead, the parent is the entity itself, or the link would create a cycle.

**Example**

```lua
caffeine.hierarchy.setParent(wheel, car)
```

## detach

Lua: `caffeine.hierarchy.detach` · Dryad: `caffeine_hierarchy_detach`

```
detach(entity) -> boolean
```

Removes the parent link.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when the entity is dead.

**Example**

```lua
caffeine.hierarchy.detach(wheel)
```

## children

Lua: `caffeine.hierarchy.children` · Dryad: `caffeine_hierarchy_children`

```
children(entity) -> table
```

Lists the direct children of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. Array of direct child ids, ascending.

**Example**

```lua
for _, c in ipairs(caffeine.hierarchy.children(car)) do end
```

## childCount

Lua: `caffeine.hierarchy.childCount` · Dryad: `caffeine_hierarchy_child_count`

```
childCount(entity) -> number
```

Counts the direct children.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Number of direct children.

**Example**

```lua
local n = caffeine.hierarchy.childCount(car)
```

## root

Lua: `caffeine.hierarchy.root` · Dryad: `caffeine_hierarchy_root`

```
root(entity) -> number
```

Walks up to the top of the hierarchy.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>The entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. The topmost ancestor (the entity itself when it has no parent).

**Example**

```lua
local top = caffeine.hierarchy.root(wheel)
```
