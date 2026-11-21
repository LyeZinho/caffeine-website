# Math

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 23 · Dryad 0</span>
</div>

<p class="doc-lede">Vector tables ({x, y[, z]}), scalar helpers and angle conversion. Also defines the constants caffeine.math.pi and caffeine.math.epsilon (1e-5).</p>

[All namespaces](index.md)

Namespace: `caffeine.math`

## vec2

Lua: `caffeine.math.vec2`

```
vec2(x, y) -> table
```

Creates a 2D vector table.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y.</td></tr>
</tbody>
</table>

**Returns:** `table`. {x, y}

**Example**

```lua
local v = caffeine.math.vec2(1, 2)
```

## vec3

Lua: `caffeine.math.vec3`

```
vec3(x, y, z) -> table
```

Creates a 3D vector table.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z.</td></tr>
</tbody>
</table>

**Returns:** `table`. {x, y, z}

**Example**

```lua
local v = caffeine.math.vec3(1, 2, 3)
```

## add

Lua: `caffeine.math.add`

```
add(a, b) -> table
```

Component-wise sum of two vectors.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `table`. Vector table; has z only when an operand has z.

**Example**

```lua
local p = caffeine.math.add(a, b)
```

## sub

Lua: `caffeine.math.sub`

```
sub(a, b) -> table
```

Component-wise difference a - b.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `table`. Vector table; has z only when an operand has z.

**Example**

```lua
local d = caffeine.math.sub(a, b)
```

## mul

Lua: `caffeine.math.mul`

```
mul(a, b) -> table
```

Component-wise product of two vectors (not a dot product).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `table`. Vector table; has z only when an operand has z.

**Example**

```lua
local m = caffeine.math.mul(a, b)
```

## scale

Lua: `caffeine.math.scale`

```
scale(v, s) -> table
```

Multiplies a vector by a scalar.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>s</code></td><td>number</td><td>Scalar factor.</td></tr>
</tbody>
</table>

**Returns:** `table`. Scaled vector.

**Example**

```lua
local v2 = caffeine.math.scale(v, 2)
```

## dot

Lua: `caffeine.math.dot`

```
dot(a, b) -> number
```

Dot product of two vectors; a missing z counts as 0.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `number`. Dot product.

**Example**

```lua
local d = caffeine.math.dot(a, b)
```

## cross

Lua: `caffeine.math.cross`

```
cross(a, b) -> table
```

Cross product; the result is always 3D.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `table`. {x, y, z} vector.

**Example**

```lua
local n = caffeine.math.cross(a, b)
```

## length

Lua: `caffeine.math.length`

```
length(v) -> number
```

Length of a vector.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `number`. Vector length.

**Example**

```lua
local l = caffeine.math.length(v)
```

## lengthSquared

Lua: `caffeine.math.lengthSquared`

```
lengthSquared(v) -> number
```

Squared length of a vector, without the square root.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `number`. Squared length.

**Example**

```lua
local l2 = caffeine.math.lengthSquared(v)
```

## distance

Lua: `caffeine.math.distance`

```
distance(a, b) -> number
```

Distance between two points.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `number`. Distance between the points.

**Example**

```lua
local d = caffeine.math.distance(a, b)
```

## normalize

Lua: `caffeine.math.normalize`

```
normalize(v) -> table
```

Returns the vector scaled to length 1.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
</tbody>
</table>

**Returns:** `table`. Unit vector, or zeros when the length is at most 0.0001.

**Example**

```lua
local dir = caffeine.math.normalize(caffeine.math.sub(b, a))
```

## lerpVec

Lua: `caffeine.math.lerpVec`

```
lerpVec(a, b, t) -> table
```

Linear interpolation between two vectors.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Vector table {x, y[, z]}.</td></tr>
<tr><td><code>t</code></td><td>number</td><td>Blend factor; not clamped.</td></tr>
</tbody>
</table>

**Returns:** `table`. Vector table; has z only when an operand has z.

**Example**

```lua
local mid = caffeine.math.lerpVec(a, b, 0.5)
```

## clamp

Lua: `caffeine.math.clamp`

```
clamp(v, lo, hi) -> number
```

Limits a value to a range; swapped bounds are accepted.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Value.</td></tr>
<tr><td><code>lo</code></td><td>number</td><td>Lower bound.</td></tr>
<tr><td><code>hi</code></td><td>number</td><td>Upper bound.</td></tr>
</tbody>
</table>

**Returns:** `number`. Clamped value.

**Example**

```lua
local hp = caffeine.math.clamp(hp, 0, 100)
```

## clamp01

Lua: `caffeine.math.clamp01`

```
clamp01(v) -> number
```

Limits a value to 0..1.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Value.</td></tr>
</tbody>
</table>

**Returns:** `number`. Value limited to 0..1.

**Example**

```lua
local t = caffeine.math.clamp01(t)
```

## lerp

Lua: `caffeine.math.lerp`

```
lerp(a, b, t) -> number
```

Linear interpolation between two numbers.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>number</td><td>Start.</td></tr>
<tr><td><code>b</code></td><td>number</td><td>End.</td></tr>
<tr><td><code>t</code></td><td>number</td><td>Blend factor; not clamped.</td></tr>
</tbody>
</table>

**Returns:** `number`. a + (b - a) * t

**Example**

```lua
local x = caffeine.math.lerp(0, 10, 0.25)
```

## inverseLerp

Lua: `caffeine.math.inverseLerp`

```
inverseLerp(a, b, v) -> number
```

The inverse of lerp; the result is not clamped.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>number</td><td>Start.</td></tr>
<tr><td><code>b</code></td><td>number</td><td>End.</td></tr>
<tr><td><code>v</code></td><td>number</td><td>Value.</td></tr>
</tbody>
</table>

**Returns:** `number`. Position of v between a and b; 0 when a and b are equal.

**Example**

```lua
local t = caffeine.math.inverseLerp(0, 10, 5)
```

## remap

Lua: `caffeine.math.remap`

```
remap(v, inLo, inHi, outLo, outHi) -> number
```

Maps a value from one range to another.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Value.</td></tr>
<tr><td><code>inLo</code></td><td>number</td><td>Input range start.</td></tr>
<tr><td><code>inHi</code></td><td>number</td><td>Input range end.</td></tr>
<tr><td><code>outLo</code></td><td>number</td><td>Output range start.</td></tr>
<tr><td><code>outHi</code></td><td>number</td><td>Output range end.</td></tr>
</tbody>
</table>

**Returns:** `number`. Remapped value (not clamped).

**Example**

```lua
local pct = caffeine.math.remap(hp, 0, 100, 0, 1)
```

## smoothstep

Lua: `caffeine.math.smoothstep`

```
smoothstep(e0, e1, v) -> number
```

Smooth Hermite interpolation between two edges.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>e0</code></td><td>number</td><td>Lower edge.</td></tr>
<tr><td><code>e1</code></td><td>number</td><td>Upper edge.</td></tr>
<tr><td><code>v</code></td><td>number</td><td>Value.</td></tr>
</tbody>
</table>

**Returns:** `number`. Smooth value in 0..1.

**Example**

```lua
local s = caffeine.math.smoothstep(0, 1, t)
```

## approach

Lua: `caffeine.math.approach`

```
approach(cur, target, step) -> number
```

Moves a value toward a target by at most step.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>cur</code></td><td>number</td><td>Current value.</td></tr>
<tr><td><code>target</code></td><td>number</td><td>Target value.</td></tr>
<tr><td><code>step</code></td><td>number</td><td>Maximum change; its absolute value is used.</td></tr>
</tbody>
</table>

**Returns:** `number`. New value, never past the target.

**Example**

```lua
speed = caffeine.math.approach(speed, 0, 20 * caffeine.time.delta())
```

## sign

Lua: `caffeine.math.sign`

```
sign(v) -> number
```

Sign of a number.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Value.</td></tr>
</tbody>
</table>

**Returns:** `number`. -1, 0 or 1.

**Example**

```lua
local s = caffeine.math.sign(-3)
```

## radians

Lua: `caffeine.math.radians`

```
radians(deg) -> number
```

Converts degrees to radians.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>deg</code></td><td>number</td><td>Degrees.</td></tr>
</tbody>
</table>

**Returns:** `number`. Radians.

**Example**

```lua
local r = caffeine.math.radians(90)
```

## degrees

Lua: `caffeine.math.degrees`

```
degrees(rad) -> number
```

Converts radians to degrees.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>rad</code></td><td>number</td><td>Radians.</td></tr>
</tbody>
</table>

**Returns:** `number`. Degrees.

**Example**

```lua
local d = caffeine.math.degrees(caffeine.math.pi)
```
