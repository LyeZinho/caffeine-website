# Animation

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 7 · Dryad 0</span>
</div>

<p class="doc-lede">Clip, state-machine, skinned-mesh and sprite-sheet animation control.</p>

[All namespaces](index.md)

Namespace: `caffeine.animation`

## playClip

Lua: `caffeine.animation.playClip`

```
playClip(entity, path) -> boolean
```

Plays an animation clip on the entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Clip asset path.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.animation.playClip(e, 'clips/run.anim')
```

## playSkinnedClip

Lua: `caffeine.animation.playSkinnedClip`

```
playSkinnedClip(entity, meshPath, clipIndex) -> boolean
```

Plays a clip of a skinned mesh by index.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>meshPath</code></td><td>string</td><td>Skinned mesh path.</td></tr>
<tr><td><code>clipIndex</code></td><td>number</td><td>Index of the clip in the mesh.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.animation.playSkinnedClip(e, 'models/hero.glb', 0)
```

## playState

Lua: `caffeine.animation.playState`

```
playState(entity, state) -> boolean
```

Switches the animator to a named state.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>state</code></td><td>string</td><td>State name.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.animation.playState(e, 'Idle')
```

## setBool

Lua: `caffeine.animation.setBool`

```
setBool(entity, name, value) -> boolean
```

Sets a boolean animator parameter.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Parameter name.</td></tr>
<tr><td><code>value</code></td><td>boolean</td><td>New value.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.animation.setBool(e, 'grounded', true)
```

## setFloat

Lua: `caffeine.animation.setFloat`

```
setFloat(entity, name, value) -> boolean
```

Sets a float animator parameter.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Parameter name.</td></tr>
<tr><td><code>value</code></td><td>number</td><td>New value.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.animation.setFloat(e, 'speed', 3.5)
```

## setTrigger

Lua: `caffeine.animation.setTrigger`

```
setTrigger(entity, name) -> boolean
```

Fires an animator trigger.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Trigger name.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.animation.setTrigger(e, 'jump')
```

## setSpriteSheet

Lua: `caffeine.animation.setSpriteSheet`

```
setSpriteSheet(entity, columns, rows, frameCount) -> boolean
```

Configures sprite-sheet animation on the entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>columns</code></td><td>number</td><td>Columns in the sheet.</td></tr>
<tr><td><code>rows</code></td><td>number</td><td>Rows in the sheet.</td></tr>
<tr><td><code>frameCount</code></td><td>number</td><td>Total number of frames.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.animation.setSpriteSheet(e, 4, 4, 16)
```
