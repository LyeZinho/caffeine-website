# Game state

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 0</span>
</div>

<p class="doc-lede">An optional push/pop stack of named game states.</p>

[All namespaces](index.md)

Namespace: `caffeine.gameState`

## push

Lua: `caffeine.gameState.push`

```
push(id)
```

Pushes a game state onto the stack.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>string</td><td>State id.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.gameState.push('pause_menu')
```

## pop

Lua: `caffeine.gameState.pop`

```
pop() -> boolean
```

Pops the top game state.

**Returns:** `boolean`. The result of the stack pop (see GameStateStack::pop).

**Example**

```lua
caffeine.gameState.pop()
```

## top

Lua: `caffeine.gameState.top`

```
top() -> string
```

Returns the id of the top game state.

**Returns:** `string`. Id of the top state.

**Example**

```lua
local id = caffeine.gameState.top()
```

## pause

Lua: `caffeine.gameState.pause`

```
pause() -> boolean
```

Pauses the top game state.

**Returns:** `boolean`. Result of pausing the top state.

**Example**

```lua
caffeine.gameState.pause()
```

## resume

Lua: `caffeine.gameState.resume`

```
resume() -> boolean
```

Resumes the top game state.

**Returns:** `boolean`. Result of resuming the top state.

**Example**

```lua
caffeine.gameState.resume()
```
