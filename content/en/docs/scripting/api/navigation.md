# Navigation

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">World</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 0</span>
</div>

<p class="doc-lede">Navigation agents: destinations, patrol points, follow targets and behaviour scripts.</p>

[All namespaces](index.md)

Namespace: `caffeine.navigation`

## setDestination

Lua: `caffeine.navigation.setDestination`

```
setDestination(entity, x, y, z) -> boolean
```

Sets the agent's destination in world space.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>World X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>World Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>World Z.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.navigation.setDestination(npc, 10, 0, 5)
```

## setMode

Lua: `caffeine.navigation.setMode`

```
setMode(entity, mode) -> boolean
```

Sets the agent's navigation mode.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>mode</code></td><td>string</td><td>"patrol", "follow" or "scripted"; any other value means idle.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.navigation.setMode(npc, 'patrol')
```

## addPatrolPoint

Lua: `caffeine.navigation.addPatrolPoint`

```
addPatrolPoint(entity, x, y, z) -> boolean
```

Appends a point to the agent's patrol route.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>World X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>World Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>World Z.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.navigation.addPatrolPoint(npc, 0, 0, 0)
```

## setFollowTarget

Lua: `caffeine.navigation.setFollowTarget`

```
setFollowTarget(entity, targetId) -> boolean
```

Sets the entity the agent follows.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>targetId</code></td><td>number</td><td>Entity id to follow.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.navigation.setFollowTarget(npc, player)
```

## setBehaviorScript

Lua: `caffeine.navigation.setBehaviorScript`

```
setBehaviorScript(entity, path) -> boolean
```

Sets the script that drives the agent in scripted mode.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Behaviour script path.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.navigation.setBehaviorScript(npc, 'scripts/ai.lua')
```
