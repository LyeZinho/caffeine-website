# Time

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 11 · Dryad 9</span>
</div>

<p class="doc-lede">The play clock: scaled and unscaled frame time, the fixed step, pause and the deterministic random seed.</p>

[All namespaces](index.md)

Namespace: `caffeine.time` · Dryad prefix: `caffeine_time_`

## delta

Lua: `caffeine.time.delta` · Dryad: `caffeine_time_delta`

```
delta() -> number
```

Frame time to use for movement and timers in `onUpdate`.

**Returns:** `number`. Seconds since the previous frame, multiplied by the time scale (0 while paused).

**Example**

```lua
local speed = 5
function onUpdate(e, dt)
  local t = caffeine.world.getTransform(e)
  caffeine.world.setTransform(e, { x = t.x + speed * caffeine.time.delta(), y = t.y })
end
```

## setTimeScale

Lua: `caffeine.time.setTimeScale` · Dryad: `caffeine_time_set_scale`

```
setTimeScale(scale)
```

Changes how fast scaled time advances. Unscaled time and the UI are not affected.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>scale</code></td><td>number</td><td>1 = normal, 0.5 = half speed, 0 = frozen.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.time.setTimeScale(0.25) -- slow motion
```

## unscaledDelta

Lua: `caffeine.time.unscaledDelta` · Dryad: `caffeine_time_unscaled_delta`

```
unscaledDelta() -> number
```

Real frame time, unaffected by the time scale or pause. Use it for UI and effects that must keep running.

**Returns:** `number`. Seconds since the previous frame, ignoring the time scale.

**Example**

```lua
local real = caffeine.time.unscaledDelta()
```

## time

Lua: `caffeine.time.time` · Dryad: `caffeine_time_total`

```
time() -> number
```

Total play time accumulated by the play clock.

**Returns:** `number`. Scaled play time in seconds.

**Example**

```lua
caffeine.debug.log('t=' .. caffeine.time.time())
```

## fixedDelta

Lua: `caffeine.time.fixedDelta` · Dryad: `caffeine_time_fixed_delta`

```
fixedDelta() -> number
```

The fixed simulation step of the play clock.

**Returns:** `number`. The fixed step in seconds (1/60 by default).

**Example**

```lua
local step = caffeine.time.fixedDelta()
```

## timeScale

Lua: `caffeine.time.timeScale` · Dryad: `caffeine_time_scale`

```
timeScale() -> number
```

Returns the current time scale (1 is normal speed).

**Returns:** `number`. Current time scale.

**Example**

```lua
local s = caffeine.time.timeScale()
```

## paused

Lua: `caffeine.time.paused` · Dryad: `caffeine_time_paused`

```
paused() -> boolean
```

Tells whether the play clock is paused.

**Returns:** `boolean`. True while the play clock is paused.

**Example**

```lua
if caffeine.time.paused() then return end
```

## setPaused

Lua: `caffeine.time.setPaused` · Dryad: `caffeine_time_set_paused`

```
setPaused(paused)
```

Pauses or resumes the play clock; scaled delta is 0 while paused.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>paused</code></td><td>boolean</td><td>True to pause, false to resume.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.time.setPaused(true)
```

## frame

Lua: `caffeine.time.frame` · Dryad: `caffeine_time_frame`

```
frame() -> number
```

Returns the number of frames advanced by the play clock.

**Returns:** `number`. Frame counter of the play clock.

**Example**

```lua
local n = caffeine.time.frame()
```

## seed

Lua: `caffeine.time.seed`

```
seed() -> integer
```

Returns the deterministic random seed of the play clock.

**Returns:** `integer`. Current random seed.

**Example**

```lua
local s = caffeine.time.seed()
```

## setSeed

Lua: `caffeine.time.setSeed`

```
setSeed(seed)
```

Sets the deterministic random seed of the play clock.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>seed</code></td><td>integer</td><td>New seed.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.time.setSeed(1234)
```
