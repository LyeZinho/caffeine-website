# UI

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">UI</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 0</span>
</div>

<p class="doc-lede">Create canvases, labels and buttons, update them and hit-test screen positions.</p>

[All namespaces](index.md)

Namespace: `caffeine.ui`

## createCanvas

Lua: `caffeine.ui.createCanvas`

```
createCanvas([w, h]) -> integer
```

Creates a UI canvas entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>w</code></td><td>number</td><td>Width (default 1280).</td></tr>
<tr><td><code>h</code></td><td>number</td><td>Height (default 720).</td></tr>
</tbody>
</table>

**Returns:** `integer`. Canvas entity id, or 0 without a UI system or world.

**Example**

```lua
local canvas = caffeine.ui.createCanvas(1280, 720)
```

## createLabel

Lua: `caffeine.ui.createLabel`

```
createLabel(parent, text, pos) -> integer
```

Creates a text label under a parent.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>parent</code></td><td>integer</td><td>Parent canvas or widget id.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>Label text.</td></tr>
<tr><td><code>pos</code></td><td>table</td><td>{x, y} position.</td></tr>
</tbody>
</table>

**Returns:** `integer`. Label entity id, or 0.

**Example**

```lua
local l = caffeine.ui.createLabel(canvas, 'Score: 0', { x = 10, y = 10 })
```

## createButton

Lua: `caffeine.ui.createButton`

```
createButton(parent, text, pos[, w, h]) -> integer
```

Creates a button under a parent.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>parent</code></td><td>integer</td><td>Parent canvas or widget id.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>Button text.</td></tr>
<tr><td><code>pos</code></td><td>table</td><td>{x, y} position.</td></tr>
<tr><td><code>w</code></td><td>number</td><td>Width (default 120).</td></tr>
<tr><td><code>h</code></td><td>number</td><td>Height (default 40).</td></tr>
</tbody>
</table>

**Returns:** `integer`. Button entity id, or 0.

**Example**

```lua
local b = caffeine.ui.createButton(canvas, 'Play', { x = 20, y = 60 })
```

## hitTest

Lua: `caffeine.ui.hitTest`

```
hitTest(sx, sy) -> integer
```

Finds the UI element at a screen position.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>sx</code></td><td>number</td><td>Screen x.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>Screen y.</td></tr>
</tbody>
</table>

**Returns:** `integer`. UI entity id under the point, or 0.

**Example**

```lua
local hit = caffeine.ui.hitTest(100, 80)
```

## setLabel

Lua: `caffeine.ui.setLabel`

```
setLabel(entity, text)
```

Changes a label's text. Does nothing when the entity has no label.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>New text (up to 255 characters).</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.ui.setLabel(l, 'Score: 10')
```

## setProgress

Lua: `caffeine.ui.setProgress`

```
setProgress(entity, normalized)
```

Sets a progress bar between its min and max. Does nothing when the entity has no progress bar.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>normalized</code></td><td>number</td><td>0..1; clamped.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.ui.setProgress(bar, 0.5)
```
