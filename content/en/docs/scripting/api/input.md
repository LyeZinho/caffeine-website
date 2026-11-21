# Input

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Input</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 7 · Dryad 9</span>
</div>

<p class="doc-lede">Keyboard, mapped axes and actions, and the mouse. Dryad mirrors them with caffeine_input_* natives.</p>

[All namespaces](index.md)

Namespace: `caffeine.input` · Dryad prefix: `caffeine_input_`

## isKeyDown

Lua: `caffeine.input.isKeyDown` · Dryad: `caffeine_input_key_down`

```
isKeyDown(name) -> boolean
```

Checks whether a keyboard key is held.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Key name such as "Space", "W", "Up", "LShift", "Escape", "0"-"9".</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True while the key is held; false for an unknown name or without input.

**Example**

```lua
if caffeine.input.isKeyDown('Space') then end
```

## getAxis

Lua: `caffeine.input.getAxis` · Dryad: `caffeine_input_axis`

```
getAxis(name) -> number
```

Reads a mapped input axis.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Axis: Horizontal, Vertical, LookX, LookY.</td></tr>
</tbody>
</table>

**Returns:** `number`. Axis value; 0 for an unknown name or without input.

**Example**

```lua
local h = caffeine.input.getAxis('Horizontal')
```

## isActionDown

Lua: `caffeine.input.isActionDown` · Dryad: `caffeine_input_action_down`

```
isActionDown(name) -> boolean
```

Checks whether a mapped action is held.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Action: MoveUp, MoveDown, MoveLeft, MoveRight, Jump, Attack, Interact, Pause.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True while the action is held.

**Example**

```lua
if caffeine.input.isActionDown('Jump') then end
```

## isActionPressed

Lua: `caffeine.input.isActionPressed` · Dryad: `caffeine_input_action_pressed`

```
isActionPressed(name) -> boolean
```

Checks whether a mapped action was just pressed this frame.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Action: MoveUp, MoveDown, MoveLeft, MoveRight, Jump, Attack, Interact, Pause.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True only on the frame the action started.

**Example**

```lua
if caffeine.input.isActionPressed('Attack') then end
```

## mouseDelta

Lua: `caffeine.input.mouseDelta`

```
mouseDelta() -> number, number
```

Mouse movement since the previous frame. Returns two values, not a table.

**Returns:** `number, number`. dx, dy (two return values).

**Example**

```lua
local dx, dy = caffeine.input.mouseDelta()
```

## mousePosition

Lua: `caffeine.input.mousePosition`

```
mousePosition() -> number, number
```

Mouse position as reported by the input manager. Returns two values, not a table.

**Returns:** `number, number`. x, y (two return values).

**Example**

```lua
local mx, my = caffeine.input.mousePosition()
```

## isMouseButtonDown

Lua: `caffeine.input.isMouseButtonDown` · Dryad: `caffeine_input_mouse_down`

```
isMouseButtonDown(button) -> boolean
```

Checks whether a mouse button is held.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>button</code></td><td>integer</td><td>1 left, 2 middle, 3 right.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True while held; false for any other number.

**Example**

```lua
if caffeine.input.isMouseButtonDown(1) then end
```

## caffeine_input_mouse_x

Lua: not available · Dryad: `caffeine_input_mouse_x`

```
caffeine_input_mouse_x() -> number
```

Dryad only: mouse x position.

**Returns:** `number`. Mouse x position; 0 without input.

**Example**

```dryad
let v = caffeine_input_mouse_x();
```

## caffeine_input_mouse_y

Lua: not available · Dryad: `caffeine_input_mouse_y`

```
caffeine_input_mouse_y() -> number
```

Dryad only: mouse y position.

**Returns:** `number`. Mouse y position; 0 without input.

**Example**

```dryad
let v = caffeine_input_mouse_y();
```

## caffeine_input_mouse_dx

Lua: not available · Dryad: `caffeine_input_mouse_dx`

```
caffeine_input_mouse_dx() -> number
```

Dryad only: mouse x movement since the previous frame.

**Returns:** `number`. Mouse x movement since the previous frame; 0 without input.

**Example**

```dryad
let v = caffeine_input_mouse_dx();
```

## caffeine_input_mouse_dy

Lua: not available · Dryad: `caffeine_input_mouse_dy`

```
caffeine_input_mouse_dy() -> number
```

Dryad only: mouse y movement since the previous frame.

**Returns:** `number`. Mouse y movement since the previous frame; 0 without input.

**Example**

```dryad
let v = caffeine_input_mouse_dy();
```
