# Random

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 5</span>
</div>

<p class="doc-lede">A deterministic generator: the same seed always gives the same sequence, on every platform.</p>

[All namespaces](index.md)

Namespace: `caffeine.random` · Dryad prefix: `caffeine_random_`

## setSeed

Lua: `caffeine.random.setSeed` · Dryad: `caffeine_random_set_seed`

```
setSeed(seed)
```

Restarts the sequence.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>seed</code></td><td>number</td><td>Any whole number; 0 is replaced by a fixed value.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.random.setSeed(1234)
```

## value

Lua: `caffeine.random.value` · Dryad: `caffeine_random_value`

```
value() -> number
```

Next random number.

**Returns:** `number`. A number in [0, 1).

**Example**

```lua
local r = caffeine.random.value()
```

## range

Lua: `caffeine.random.range` · Dryad: `caffeine_random_range`

```
range(min, max) -> number
```

A random number in a range.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>min</code></td><td>number</td><td>Lower bound (inclusive).</td></tr>
<tr><td><code>max</code></td><td>number</td><td>Upper bound (exclusive).</td></tr>
</tbody>
</table>

**Returns:** `number`. A number in [min, max).

**Example**

```lua
local x = caffeine.random.range(-5, 5)
```

## int

Lua: `caffeine.random.int` · Dryad: `caffeine_random_int`

```
int(min, max) -> number
```

A random whole number, both ends included.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>min</code></td><td>number</td><td>Lower bound (inclusive).</td></tr>
<tr><td><code>max</code></td><td>number</td><td>Upper bound (inclusive); reversed bounds are swapped.</td></tr>
</tbody>
</table>

**Returns:** `number`. A whole number in [min, max].

**Example**

```lua
local roll = caffeine.random.int(1, 6)
```

## chance

Lua: `caffeine.random.chance` · Dryad: `caffeine_random_chance`

```
chance(p) -> boolean
```

A weighted coin flip.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>p</code></td><td>number</td><td>Probability from 0 to 1.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true with probability p.

**Example**

```lua
if caffeine.random.chance(0.25) then end
```
