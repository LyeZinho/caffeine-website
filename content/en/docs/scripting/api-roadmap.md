# Scripting API: parity and roadmap

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/script"><code>src/caffeine/script</code></a></span>
</div>

<p class="doc-lede">One scripting surface, two languages: what Lua and Dryad can do today, what was added in this
pass, and the ordered plan to grow the API without letting the two drift apart.</p>

## 1. Design rules

1. **One name, one meaning.** A capability exists in both languages under parallel names:
   Lua `caffeine.<area>.<verb>`, Dryad `caffeine_<area>_<verb>`. Lookup tables (key, axis and action names)
   are shared C++ (`ScriptInputNames.hpp`), so both accept the same strings.
2. **Bindings are thin.** Logic lives in engine modules; a binding validates arguments, calls it and logs
   errors. Natives never crash on a bad id, a missing world or an unknown name.
3. **Reflection first.** Component data goes through `caffeine.component` / `caffeine_component_*`, driven by
   the reflection registry, so new components are scriptable without new bindings.
4. **Messages stay the only editor mutation path.** Scripts act on the play world, not on editor state.
5. **A feature is done when it has a test in both languages** (`tests/test_script.cpp`, `tests/test_dryad_host.cpp`).

## 2. Parity matrix

| Area | Lua | Dryad |
|---|---|---|
| Lifecycle `onCreate`, `onUpdate`, `onFixedUpdate` | yes | yes |
| `onDestroy`, `onCollision`, `onPostProcess` | yes | **no** |
| Position and scale | yes | yes (`caffeine_get/set_position`, scale, `translate`) |
| Generic components (reflection) | yes | yes |
| Time (`delta`, `time`, `fixedDelta`, scale, pause, frame) | yes | **new** (`caffeine_time_*`) |
| Input (keys, axes, actions, mouse) | yes | **new** (`caffeine_input_*`) |
| World create, destroy, alive, distance | partly | **new** (`caffeine_world_*`) |
| Math: 2D and 3D vectors, scalar helpers | **new 3D** | Dryad stdlib |
| Events, UI, draw2d, picking, assets, native modules | yes | no |
| Post-process, animation, effects, navigation | yes | no |

## 3. Added in this pass

### Dryad natives

| Native | Returns |
|---|---|
| `caffeine_time_delta()`, `_unscaled_delta()`, `_total()`, `_fixed_delta()`, `_scale()`, `_frame()` | seconds / scale / frame number |
| `caffeine_time_set_scale(s)`, `caffeine_time_paused()`, `caffeine_time_set_paused(b)` | time control |
| `caffeine_input_key_down(name)` | bool |
| `caffeine_input_axis(name)` | -1..1 (`Horizontal`, `Vertical`, `LookX`, `LookY`) |
| `caffeine_input_action_down(name)`, `_action_pressed(name)` | bool (held, just pressed) |
| `caffeine_input_mouse_x()`, `_y()`, `_dx()`, `_dy()`, `_mouse_down(button)` | position, delta, 1/2/3 |
| `caffeine_world_create([name])`, `_destroy(e)`, `_is_alive(e)`, `_distance(a, b)` | id, nothing, bool, metres (1e9 if unknown) |

### Lua math (`caffeine.math`)

`vec2`, `vec3`, `add`, `sub`, `mul`, `scale`, `dot`, `cross`, `length`, `lengthSquared`, `distance`,
`normalize`, `lerpVec`, `clamp`, `clamp01`, `lerp`, `inverseLerp`, `remap`, `smoothstep`, `approach`, `sign`,
`radians`, `degrees`, `pi`, `epsilon`. Vector functions accept `{x, y}` or `{x, y, z}`; the result has `z`
only when an operand does, so existing 2D scripts are unchanged.

## 3b. The Script component

`ScriptComponent` is no longer just a path. Fields (all in the Inspector through reflection, all saved in
the scene; older scenes load with the defaults):

| Field | Default | Meaning |
|---|---|---|
| `Script` | empty | `.lua` or `.dyd` path, relative to the project |
| `Enabled` | on | a disabled script is skipped entirely: no `onCreate`, no updates |
| `Order` | 0 | lower runs first within a frame; ties keep entity order (stable) |
| `Properties` | empty | per-entity overrides of the script's exposed variables, e.g. `speed=4.5; god=true; label=hi` (Lua and Dryad) |
| `Isolated` | off | Lua: this entity runs its own copy of the script, with private globals |

`Properties` entries are separated by `;` or a new line. A value is a boolean for `true`/`false`, a number when
it parses fully, and text otherwise; malformed entries are skipped. They are applied before every hook
of that entity. Limits: without `Isolated`, Lua state is shared per script file, so overrides set inputs, they
do not give each entity private globals; Dryad state is always shared per file. Isolated copies are not freed when
their entity is destroyed yet.

### Grouping scripts

Scripts are classified in groups and subgroups, two ways (`ScriptCatalog.hpp`):

1. **Header tags** in the first 40 lines, after `--`, `//` or `#`:
   `@group Gameplay/Combat/Melee`, `@name Sword swing`, `@description ...`, `@tags weapon, player`.
2. **Folders**: with no `@group`, `scripts/Gameplay/AI/patrol.lua` is in group `Gameplay/AI`.

`scanScripts(projectRoot)` reads every `.lua` and `.dyd` under `scripts/`; `buildScriptTree` returns a sorted tree
(`find("Gameplay/Combat")`, `totalScripts()`), with loose scripts under **Ungrouped**. Not wired into the Assets
panel or the component picker yet; see the roadmap.

## 3c. Coverage: what the engine has and scripts cannot reach

The registry now documents every binding (**210 functions, 26 namespaces**, see the
[API reference](api/index.md)). Measured against engine modules, the scriptable surface still misses:

| Engine module | Scripts today | Missing |
|---|---|---|
| 3D physics (`PhysicsWorld3D`) | `caffeine.physics3d`: raycast, forces, impulse, velocity, gravity | overlap queries and collision/trigger callbacks. The runtime now steps `PhysicsSystem3D` (it did not before) |
| Audio (`AudioSystem`) | none | play, stop, volume, 3D emitters |
| Scenes (`SceneManager`) | none | load, reload, additive load |
| Camera and lights | components via `caffeine.component` | helpers: `screenToRay`, `worldToScreen`, look-at |
| Terrain, water, fluids | components only | height queries, `water_height`, splat painting |
| Prefabs | none | instantiate with overrides |
| Assets | text only | load textures, meshes, materials; hot reload hooks |
| Photon and render features | forward-render and post-process | Photon quality, reflection and probe controls |
| Coroutines and timers | none | `after`, `every`, `wait` |
| Save data, JSON, string utilities | none | persistent storage, parsing |

Added so far in this pass: `caffeine.entity` (names, lookup), `caffeine.hierarchy` (parent, children, root, cycle-safe),
`caffeine.random` (deterministic), each in Lua and Dryad from one shared implementation.

## 4. Roadmap

Each step ships with tests in both languages and a page in this section.

### Phase S1 — Close the parity gaps

- [ ] Dryad `onDestroy`, `onCollision(entity, other)` and `onPostProcess`; dispatch from `ScriptSystem`.
- [ ] Dryad events: `caffeine_events_emit/on/off` over the `EventBus`.
- [ ] Lua `caffeine.world.hasComponent` through the reflection registry (it only knows four names today).
- [x] Entity lookup by name and hierarchy (`caffeine.entity`, `caffeine.hierarchy`); `findWith(component)` remains.
- [ ] Prefabs: `instantiate(prefab, position)`, `destroyAfter(entity, seconds)`.

### Phase S2 — Structure and ergonomics

- [ ] Lua entity handle object (`local e = caffeine.entity(id)`, `e:position()`, `e:get("Light")`) over the
      same natives, plus `Vec3` and `Quat` userdata with operators, replacing plain tables.
- [ ] Timers and coroutines: `caffeine.timer.after/every/cancel`, `caffeine.wait(seconds)` inside a
      coroutine scheduler ticked by `ScriptSystem`; the Dryad equivalent as natives.
- [x] Per-entity exposed-variable overrides (`Properties`), Lua only; Dryad support remains.
- [ ] Module system for Dryad (`import`) resolved against the project root, as `caffeine.require` does.
- [ ] Error reporting: script name, line and a Console entry for every failure, never a silent no-op.

### Phase S3 — 3D gameplay surface

- [ ] 3D physics: `raycast`, `overlapSphere`, `addForce`, `setVelocity`, collision and trigger callbacks.
- [ ] Camera and picking in 3D: `screenToRay`, `worldToScreen`, `pick3d`.
- [ ] Audio: `play`, `stop`, `setVolume`, 3D sources.
- [ ] Animation, navigation and effects parity in Dryad.
- [ ] Scene control: `loadScene`, `reloadScene`, persistent values across scenes.

### Phase S4 — Tooling

- [x] API reference generated from one registry (`src/caffeine/script/api/*.json`), checked by a test; editor
      autocompletion and a generated parity matrix remain.
- [ ] Sandbox limits: instruction budget per frame, memory cap, a stuck-script watchdog.
- [ ] Hot reload that keeps script state where the exposed variables allow it.
- [ ] Debugging: breakpoints and a variable view in the script editor (Lua first).
- [ ] Show the script group tree in the Assets panel and the Add Component picker; group filter and search by tag.
