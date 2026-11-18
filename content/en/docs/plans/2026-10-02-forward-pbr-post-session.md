# 2026-10-02 — Forward PBR, reflection, post-processing GPU

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

> Technical summary of the rendering block and materials for **core** ( `caffeine-core` ), com o Doppio como cliente.

---

## Rendering Pipeline

- Cena **HDR linear** ( `RGBA16F` ) → `PostProcessStack` → exit `RGBA8` .
- **TAA** por defeito ( `PostProcessStack::defaults` , `antiAliasing.mode = 1` ); jitter on projection.
- **SSAO** soft in defaults when there is no `PostProcessComponent` On camera.
- Ping-pong targets for TAA/SSR history; `renderScale` 0.25–2× in the editor.
- GPU Sky ( `sky.frag` ), grelha GPU ( `grid.frag` ), without overlays ImGui from “fake post”.
- Shadows: directional atlas 4096, waterfalls 2048, spot 1024, point faces 512; remapped z projection for SDL `[0,1]` ; PCF 12-tap com bias por texel.

## Materiais PBR ( `scene_lit.frag` )

- Metallic-roughness + clearcoat, sheen, iridescence, transmission/IOR, alpha modes.
- Translucent Pass: opaque copy + blend / transmission.
- SRGB→linear textures on CPU; ORM, normal strength, emission map.

## Reflexos ( `ReflectionMode::Probe` por defeito)

- Probes por objeto (LRU, captura incremental, cubemap HDR com mips).
- Optional SSR (post + features); HDR planar reflection; `excludeEntity` na captura.
- Material preview e snapshot usam a mesma stack.

## Optional ECS (not editor settings)

- `ForwardRenderFeaturesComponent` — instancing, IBL, coarse occlusion, reflexes, volumetric.
- `PostProcessComponent` — modular stack run on the GPU.
- `PostProcessFields.hpp` — reflection `effect.field` para Lua/C++.

## Scripting Lua

- `caffeine.postprocess.*` completo ( `get` / `set` / `getValue` / `setValue` / `effects` / `fields` / `blend` / `handle` ).
- `customEffectScript` → `onPostProcess(entityId, dt, api)` em play mode ( `ScriptSystem` ).
- `caffeine.forwardrender.*` ( `ForwardRenderBindings.cpp` ).

## Editor (Doppio)

- Material Editor: presets, all PBR sections, `AssetField` reusable.
- `MaterialPreviewRenderer` substitui `PreviewRenderer` CPU.
- Settings → Viewport → **Render scale** (persisted).
- `cameraFarPlane()` dynamic; framebuffer cap 3840.
- Inspector: Forward Render Features + Post Process (UI partilhada em `PostProcessEditorUI.hpp` ).

## Tools and tests

- `caffeine-render-snapshot` — Regression PNG.
- Tests: `[material]` , `[forwardrender]` , `[render]` , `test_mesh_lod` , `test_physics3d` , etc.

## Documentation

- `docs/rendering/*` (PBR, reflexes, forward features, post, snapshot, mesh LOD, volumetric).
- `docs/editor/material-editor.md`
- `docs/physics/physics-3d.md`
