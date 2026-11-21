# Draw 2D

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">UI</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 0</span>
</div>

<p class="doc-lede">Immediate-mode 2D overlay shapes (lines, circles, rectangles, polylines) in world or screen space.</p>

[All namespaces](index.md)

Namespace: `caffeine.draw2d`

## beginFrame

Lua: `caffeine.draw2d.beginFrame`

```
beginFrame()
```

Starts a new overlay frame, clearing previous draw2d shapes. Call it once at the start of drawing.

**Returns:** none

**Example**

```lua
caffeine.draw2d.beginFrame()
```

## line

Lua: `caffeine.draw2d.line`

```
line(a, b, color[, thickness[, space]])
```

Draws a line in the 2D overlay.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Start {x, y}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>End {x, y}.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} in 0..1 (each defaults to 1).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Line thickness (default 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (default) or "screen".</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.draw2d.line({x=0,y=0},{x=5,y=5},{r=1,g=0,b=0,a=1}, 2)
```

## circle

Lua: `caffeine.draw2d.circle`

```
circle(center, radius, color[, thickness[, space]])
```

Draws a circle outline (32 segments).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>center</code></td><td>table</td><td>Center {x, y}.</td></tr>
<tr><td><code>radius</code></td><td>number</td><td>Radius.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} in 0..1 (each defaults to 1).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Line thickness (default 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (default) or "screen".</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.draw2d.circle({x=0,y=0}, 3, {r=0,g=1,b=0,a=1})
```

## rect

Lua: `caffeine.draw2d.rect`

```
rect(min, max, color[, thickness[, space]])
```

Draws a rectangle outline.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>min</code></td><td>table</td><td>Corner {x, y}.</td></tr>
<tr><td><code>max</code></td><td>table</td><td>Opposite corner {x, y}.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} in 0..1 (each defaults to 1).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Line thickness (default 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (default) or "screen".</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.draw2d.rect({x=-1,y=-1},{x=1,y=1},{r=1,g=1,b=0,a=1})
```

## poly

Lua: `caffeine.draw2d.poly`

```
poly(points, color[, closed[, thickness[, space]]])
```

Draws a polyline or polygon outline.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>points</code></td><td>table</td><td>Array of {x, y}; at least 2 points or nothing is drawn.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} in 0..1 (each defaults to 1).</td></tr>
<tr><td><code>closed</code></td><td>boolean</td><td>Close the shape (default false).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Line thickness (default 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (default) or "screen".</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.draw2d.poly({{x=0,y=0},{x=2,y=0},{x=1,y=2}}, {r=1,g=1,b=1,a=1}, true)
```
