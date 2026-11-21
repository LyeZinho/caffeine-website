# Scene

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 4 · Dryad 4</span>
</div>

<p class="doc-lede">Switching between scenes. A request is deferred: the world is replaced after the current frame's scripts finish, so call it freely from any hook. The runtime app handles requests; other hosts may not. A scene change removes every entity, so keep data you need in `caffeine.session`.</p>

[All namespaces](index.md)

Namespace: `caffeine.scene` · Dryad prefix: `caffeine_scene_`

## load

Lua: `caffeine.scene.load` · Dryad: `caffeine_scene_load`

```
load(path)
```

Asks the host to load a scene, replacing the current one. A missing or unreadable file is reported and the current scene stays.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>Scene file, relative to the project root or absolute.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
if caffeine.session.get("coins") >= 10 then caffeine.scene.load("scenes/win.scene") end
```

## reload

Lua: `caffeine.scene.reload` · Dryad: `caffeine_scene_reload`

```
reload()
```

Reloads the current scene from disk, resetting it to its saved state.

**Returns:** none

**Example**

```lua
caffeine.scene.reload() -- restart the level
```

## current

Lua: `caffeine.scene.current` · Dryad: `caffeine_scene_current`

```
current() -> string
```

Returns the loaded scene.

**Returns:** `string`. The path of the loaded scene as given to the host (empty when unknown).

**Example**

```lua
caffeine.debug.log(caffeine.scene.current())
```

## isLoading

Lua: `caffeine.scene.isLoading` · Dryad: `caffeine_scene_is_loading`

```
isLoading() -> boolean
```

Tells whether a scene change is waiting to happen.

**Returns:** `boolean`. true after load or reload was requested and before the host handled it.

**Example**

```lua
if caffeine.scene.isLoading() then return end
```
