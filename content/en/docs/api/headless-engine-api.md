# Headless Engine API: build scenes and render images without the editor

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Automate the engine through the C ABI: build scenes, add components, write materials, generate terrain and water, and render RGBA images offscreen with no window.</p>

Everything Doppio does to the engine goes through one C ABI, `libcaffeine-capi`
(`include/caffeine/capi/EngineAPI.h`, `CAFFEINE_CAPI_VERSION` 8). Anything the editor can do, a
script can do: create entities, add components, write materials, generate terrain and water, move
the camera and **render the scene to RGBA pixels, offscreen, with no window**. This page is for
automating that: test scenes, generated images, thumbnails, regression pictures, batch renders.

## The shape of the API

| Idea | What it means |
|---|---|
| **Session** | `caffeine_session_create()` makes one scene (its own ECS world). Everything else takes the session. Destroy it with `caffeine_session_destroy`. |
| **Entities** | `uint32_t` ids. `caffeine_session_create_entity(session, name)` returns `CAFFEINE_ENTITY_NONE` on failure. Transforms are position, rotation (Euler degrees) and scale. Parent with `caffeine_session_set_entity_parent`. |
| **Components by name** | Components are described at run time. List them with `caffeine_component_type_count/at`, their fields with `caffeine_component_type_field_at`, add one with `caffeine_session_add_component(session, entity, type_id)` and set a field with `caffeine_session_entity_component_field_set`. Field kinds: f32, bool, i32, u32, vec2/3/4, string, enum (by option index), colour. This is the same reflection the editor Inspector uses, so a new component shows up here without an API change. |
| **Assets** | `caffeine_session_set_asset_root(session, folder)` sets the project folder. Asset paths in components are relative to it (`nature/materials/oak.mat`). `caffeine_session_asset_project_path` and `caffeine_session_resolve_path` convert between forms. |
| **Materials** | `.mat` files. `caffeine_material_default/load/save` edit them; `caffeine_session_apply_material(session, entity, path)` assigns one. A material is an asset, never part of a mesh. |
| **Results** | Every call returns `CaffeineResult`: `OK`, `ERROR`, `INVALID_ARGUMENT`, `NOT_FOUND`. Check it. |
| **Version** | `caffeine_capi_version()` tells you what the library you loaded supports. Terrain needs 8, water 7. |

## Render an image (the whole loop)

```text
create session -> set asset root -> create entities + components -> assign materials
-> set camera -> (optional) viewport settings -> render -> write PNG
```

`caffeine_session_render(session, width, height, pixels, pixel_bytes)` fills `width * height * 4`
bytes of RGBA8 and blocks until done. For interactive use, `caffeine_session_render_begin` then
`caffeine_session_render_poll` until `CAFFEINE_RENDER_READY` does not block. Call
`caffeine_session_tick(session, dt)` between renders when something animates (water, particles).

The camera is an orbit camera (`CaffeineCamera`): `yaw` and `pitch` in **radians**, `distance` in
metres, `focus` the point it looks at. `CaffeineViewportSettings` has `show_grid` (**on by default**:
turn it off for a clean picture), `anti_aliasing` (0 off, 1 FXAA, 2 TAA) and `render_scale` (0.5 to 2.0,
supersampling).

### Runnable example (Rust)

`doppio/crates/engine/examples/render_scene.rs` builds a ground plane, a cube, a sphere and a sun,
writes three `.mat` files, assigns them, aims the camera and saves a PNG:

```bash
cmake --build build --target caffeine-capi -j
cd doppio
cargo run -p doppio-engine --example render_scene -- /tmp/scene.png
```

The `doppio-engine` crate is a thin safe wrapper over the C functions (`create_entity`,
`add_component`, `set_component_field`, `apply_material`, `set_camera`, `render`...); it is the only
Rust crate that loads the library, and `CAFFEINE_CAPI_LIB` overrides where it looks.

### From Python (no build step)

```python
import ctypes as C
lib = C.CDLL("build/libcaffeine-capi.so")          # .dylib / .dll elsewhere
lib.caffeine_session_create.restype = C.c_void_p
lib.caffeine_session_create_entity.restype = C.c_uint32
lib.caffeine_session_create_entity.argtypes = [C.c_void_p, C.c_char_p]
lib.caffeine_session_render.argtypes = [C.c_void_p, C.c_uint32, C.c_uint32, C.c_void_p, C.c_size_t]

session = lib.caffeine_session_create()
lib.caffeine_session_create_entity(session, b"Thing")
w, h = 640, 360
pixels = (C.c_uint8 * (w * h * 4))()
assert lib.caffeine_session_render(session, w, h, pixels, len(pixels)) == 0
# bytes(pixels) is RGBA8; hand it to Pillow / numpy / imageio
```

Any language with a C FFI works the same way: declare the functions you use, pass plain structs.

## Generate content, then render it

* **Terrain.** `caffeine_session_set_terrain(session, entity, &CaffeineTerrain, heights, splat_rgba)`
  takes a normalised height grid (0..1, row-major) and optional splat weights (ground, rock, dirt,
  mud). The four layers are the terrain component's `Splat Layer Paths 1..4` string fields: set them to
  project textures (the Terrain Generator writes `terrain/layers/<layer>.png` plus a `.mat` per layer
  and sets the paths from each material's albedo map). `caffeine_session_terrain_height` samples it.
* **Water.** `caffeine_session_set_water(session, entity, &water)` makes an animated surface; assign
  a `.mat` to the entity and the water is drawn with it. `caffeine_session_water_height` samples the
  surface at a time, so tick before you sample.
* **Nature and meshes.** Write `.obj` files into the project and set a `Mesh Filter` to `Custom`
  with the `Mesh` path (this is what *Place in scene* does for trees and rocks).
* **Scenes.** `caffeine_session_save_scene` / `load_scene` read and write `.caf`, so a generated scene
  can be reopened in Doppio or loaded by the runtime. `snapshot` / `restore` give cheap undo points.

## Textures and material previews without a scene

`caffeine_texture_generate_map`, `caffeine_texture_pack_maps` (ORM and engine packings),
`caffeine_texture_save_rgba/rgba16` and `caffeine_texture_load_rgba` work on pictures directly.
`caffeine_session_render_material_preview(_ex)` renders a lit sphere, cube or plane for a `.mat`
without building a scene, which is how thumbnails and the material gallery
(`scripts/render-material-gallery.sh`) are made.

## Practical notes

* Rendering uses an SDL GPU device and draws offscreen: the render calls open no window. It was checked on a Linux desktop with a GPU; a machine with no GPU at all is untested.
* Use one session from one thread at a time; the API makes no promise of concurrent access to a session.
* For regression pictures compare with a tolerance: results can differ slightly between GPUs and drivers.
* Assets are referenced by path: set the asset root first, and prefer relative paths so a scene moves
  with its project.
* The generators in Doppio only call this API, so anything they place can be reproduced from a script.
