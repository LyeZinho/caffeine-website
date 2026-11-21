# Scripting

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span class="doc-badge">Doppio</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/script/ScriptEngine.hpp"><code>script/ScriptEngine.hpp</code></a></span>
</div>

<p class="doc-lede">Caffeine scripts gameplay in Lua 5.4 through sol2, runs visual
logic as Dryad node scripts, and keeps C++/native hooks available for hot paths. One
<code>ScriptSystem</code> drives all four kinds in play mode.</p>

## What is implemented

<table class="doc-table">
  <thead>
    <tr><th>Kind</th><th>Component</th><th>Source</th></tr>
  </thead>
  <tbody>
    <tr><td>Lua script</td><td><code>ScriptComponent { scriptPath }</code></td><td><code>.lua</code> file, one environment per script path</td></tr>
    <tr><td>Dryad node script</td><td><code>ScriptComponent</code> with a <code>.dyd</code> path</td><td>Node graph compiled and hosted by <code>DryadHost</code></td></tr>
    <tr><td>Native script</td><td><code>NativeScriptComponent</code></td><td>C++ callbacks registered at runtime</td></tr>
    <tr><td>C++ script class</td><td><code>CppScriptComponent</code></td><td><code>CppScriptRegistry</code> / <code>CppScript</code></td></tr>
    <tr><td>Post-process driver</td><td><code>PostProcessComponent</code> + script</td><td><code>onPostProcess(entityId, dt, api)</code>, falls back to <code>onUpdate</code></td></tr>
  </tbody>
</table>

The engine build enables scripting with `CAFFEINE_ENABLE_SCRIPTING=ON` (the default).
Lua 5.4 and sol2 are fetched during configure.

## Lifecycle

`ScriptSystem::onUpdate` runs once per play-mode frame. For each entity with a script
component it calls, when present:

| Hook | When |
|---|---|
| `onCreate(entityId)` | First frame after the script is attached |
| `onUpdate(entityId, dt)` | Every scaled play-mode frame |
| `onFixedUpdate(entityId, dt)` | Fixed simulation step (default 60 Hz) |
| `onCollision(entityId, otherId)` | 2D physics collision |
| `onDestroy(entityId)` | Before the entity is destroyed |
| `onPostProcess(entityId, dt, api)` | Post-process driver; falls back to `onUpdate` |

Missing hooks are a no-op. Lua errors are caught and logged; they do not crash the
application. `ScriptSystem::resetPlayState()` clears the initialized entity lists when
play mode restarts.

## Lua

The global `caffeine` table is registered once in `ScriptEngine::init()` and shared by
game scripts and editor plugins. Highlights:

- `caffeine.time` — delta, unscaled delta, fixed delta, time scale, pause, frame, seed.
- `caffeine.pick` — world/screen picking, mouse, 3D raycast, custom pickers.
- `caffeine.draw2d` — world/screen lines, circles, rectangles and polygons.
- `caffeine.ui` — runtime retained UI.
- `caffeine.assets` — text assets.
- `caffeine.events` — subscribe/emit game events.
- `caffeine.component` — generic reflection-based component access (Lua and Dryad).
- Full reference of every function, grouped by namespace: [API reference](api/index.md).
- Lua/Dryad parity, the new `caffeine.math` 3D helpers, the Dryad `caffeine_time_*`, `caffeine_input_*` and `caffeine_world_*` natives, and the roadmap: [api-roadmap.md](api-roadmap.md).
- `caffeine.map`, `caffeine.native`, `caffeine.postprocess`, `caffeine.forwardrender`,
  `caffeine.material`.

See [Lua runtime APIs](runtime-apis.md) for signatures and examples, and
[generic component access](../api/scripting-components.md) for the reflection API.

```lua
function onCreate(entity)
    caffeine.debug.log("spawned " .. entity)
end

function onUpdate(entity, dt)
    local body = caffeine.component.get(entity, "Rigid Body 2D")
    if body then
        body["Linear velocity"] = { x = 4.0, y = body["Linear velocity"].y }
        caffeine.component.set(entity, "Rigid Body 2D", body)
    end
end
```

## Dryad

Dryad is a visual node script (`.dyd`) interpreted by `DryadHost`. The Doppio **Dryad
Nodes** tab edits the graph and can round-trip it; the engine compiles and runs it with
the same lifecycle hooks. The node catalogue and emitter live in
`src/caffeine/script/nodes/`.

See the [Dryad node scripts plan](../plans/2026-10-19-dryad-node-scripts.md) for the
graph model and the Doppio editor notes.

## Paths and hot reload

`ScriptEngine::setSearchRoot` and `ScriptSystem::setProjectRoot` resolve project-relative
paths such as `scripts/player.lua` or `scripts/player.dyd`. `loadScriptAs(key, path)`
loads one file into a separate environment, so the same file can back several roles
without sharing globals. `reloadScript` / `DryadHost::reloadIfChanged` reload from disk
without restarting the engine; the editor calls them when the file changes.

## Sandboxing

Scripts are intended to run with a restricted standard library: `os.*`, `io.*`,
`load`/`loadstring` and `debug.*` are not part of the gameplay surface. Game code uses
the `caffeine.*` APIs, `math`, `string`, `table`, `require` and `pcall`/`xpcall`.
Editor-only code (build tools, asset importers) may opt into broader access; gameplay
scripts should not depend on it.

## File map

| File | Purpose |
|---|---|
| `ScriptEngine.hpp` / `.cpp` | Lua VM, binding registration, load/reload and lifecycle calls |
| `ScriptSystem.hpp` / `.cpp` | Per-frame dispatch for Lua, Dryad, native, C++ and post-process scripts |
| `RuntimeScriptBindings.cpp` | `caffeine.time`, `pick`, `draw2d`, `ui`, `assets`, `events`, `map`, `native` |
| `ComponentBindings.cpp` | Generic component reflection bridge |
| `DryadHost.hpp` / `.cpp` | Dryad interpreter host |
| `ScriptTypes.hpp` | `ScriptComponent`, `NativeScriptComponent`, `CppScriptComponent` |
| `nodes/` | Dryad node catalogue, graph, emitter and round-trip |
| `ScriptWatcher.cpp` | File-change detection for hot reload |

## Related pages

- [Lua runtime APIs](runtime-apis.md)
- [Generic component access](../api/scripting-components.md)
- [Native modules](native-modules.md)
- [ECS core](../ecs/core.md)
- [Dryad node scripts plan](../plans/2026-10-19-dryad-node-scripts.md)
