# Scripting: generic component access

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">The reflection registry that exposes every engine component to Lua, Dryad, the Inspector and the C ABI.</p>

Every component the engine can describe is scriptable, in **Lua** and in **Dryad**, through one shared
reflection registry (`src/caffeine/scene/ComponentReflection.*`). The editor inspector, the C ABI and both
languages read the same table, so a component registered once is available everywhere, with its fields,
ranges and enum options. `ComponentAccess.*` is the language-neutral layer the scripting hosts use.

Component and field names are matched **case-insensitively and ignoring spaces, `_` and `-`**:
`"Rigid Body 3D"`, `"rigidbody3d"` and `"rigid_body_3d"` are the same component.

## Lua: `caffeine.component`

| Function | Result |
|---|---|
| `list()` | every component type: `{ name, id, fields = { { name, kind, min, max, options } } }` |
| `names(entity)` | the names of the components the entity has |
| `has(entity, name)` / `add(entity, name)` / `remove(entity, name)` | presence; `add` is a no-op when present, `remove` returns whether it removed |
| `get(entity, name)` | a table of every field, or `nil` when the entity lacks the component |
| `getField(entity, name, field)` | one field's value |
| `setField(entity, name, field, value)` | writes one field |
| `set(entity, name, { Field = value, ... })` | adds the component when missing and writes the given fields; the others keep their value |

Values: numbers, booleans and strings as themselves; **enums are option names** (`"Sphere"`, a number index is also
accepted); **vectors are tables** (`{x=, y=, z=}`, or `{1, 2, 3}`); **colours** accept `x y z w` or `r g b a`.

```lua
local C = caffeine.component
C.add(eid, "Rigid Body 3D")
C.set(eid, "Rigid Body 3D", { Mass = 12.5, ["Body type"] = "Static" })
C.set(eid, "Mesh Filter", { Primitive = "Sphere" })
local p = C.getField(eid, "Position 3D", "Position")      -- { x=, y=, z= }
```

Mistakes raise Lua errors that say what to do: unknown component (and where to find the list), unknown field (with
the valid ones), wrong value type, an enum option that does not exist (with the options), a dead entity.

## Dryad natives

The same operations, with Dryad's value model (numbers, booleans, strings, arrays, objects). Errors are logged and
the native returns `null` / `false`.

| Native | Purpose |
|---|---|
| `caffeine_component_list()` / `caffeine_component_names(entity)` | arrays of names |
| `caffeine_component_has / _add / _remove(entity, name)` | presence |
| `caffeine_component_get(entity, name)` | an object of every field |
| `caffeine_component_get_field(entity, name, field)` / `caffeine_component_set_field(entity, name, field, value)` | one field |
| `caffeine_component_set(entity, name, object)` | add and write the given fields |
| `caffeine_component_get_number(entity, name, field[, index])` / `caffeine_component_set_number(entity, name, field, value[, index])` | numbers, bools, enum indices and vector parts (`index` 0-3); integers, enums and bools come back as integers/booleans |
| `caffeine_component_set_vec(entity, name, field, x, y[, z[, w]])` | a whole vector or colour |
| `caffeine_component_get_text / caffeine_component_set_text(entity, name, field[, text])` | strings and enum labels |

## Registering a new component

Hand-written entries (the first 16, with curated ranges) live in `componentRegistry()` in `ComponentReflection.cpp`.
Everything else is **generated from the component headers**: add the struct to the `COMPONENTS` list in
`scripts/gen-component-reflection.py` (with a fixed id) and run it:

```bash
python3 scripts/gen-component-reflection.py --list   # what it found and what it skipped
python3 scripts/gen-component-reflection.py          # rewrites ComponentReflectionGenerated.*.inc
```

The generator understands floats, bools, ints, `Vec2/3/4`, `std::string`, `char[N]`, `char[N][M]` (as numbered
fields), `FixedString`, dense `enum class` types (as option lists) and nested plain structs, which are flattened as
`"Bloom: Intensity"`. It skips runtime caches (revision counters, dirty flags), vectors and non-text arrays. A
component then appears in the Doppio inspector, the C ABI and both languages with no binding code.

## Status

The registry covers **43 components and ~350 fields**: transforms (3D and legacy 2D), cameras (2D, 3D, controller),
lights, meshes and skinned meshes, bodies and colliders (2D and 3D), script, sprite and sprite LOD, particles,
health, audio emitter, **terrain** (size, height, resolution, the four splat layer textures), **natural fluids /
water**, nav agent, effects, skybox, environment effects (day/night), post-processing (every effect, flattened),
forward-render features, procedural world and map surface. A test adds, reads, writes back, and removes *every*
registered component and field, and checks ids and names stay unique.

Not reflected yet (the state does not fit plain fields): animator state machines and clips, nav volumes, the water
wave list, and runtime data such as active particles and meshes. Those need dedicated APIs (phase 3).
