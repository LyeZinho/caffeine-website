# Material Editor

> ** Panel:** Doppio → Material Editor
> **Core:** `Assets::MaterialSurface` , `MaterialFile` ( `.mat` ), `MaterialCache` , `Render::MaterialPreviewRenderer` 
> **Shader:** `scene_lit.frag` / `terrain_lit.frag`

The material editor lives in the**core** engine. Doppio only opens the panel, publishes changes in `MaterialCache` e mostra a textura GPU devolvida pelo preview renderer.

---

## Fluxo de dados

1. Abrir ou criar um `.mat` ( `CAFMAT2` ).
2. Sliders e combos alteram `MaterialSurface` in memory.
3. `publishLive()` grava no `MaterialCache` com a chave do ficheiro (ou `__caffeine_material_preview__.mat` during editing).
4. Viewport and preview read the cache revision; the scene stamp ( `EditorPanelUtils` ) includes bytes of the material to redesign without moving the camera.
5. **File → Save** serializes `CAFMAT2` no disco.

Browse de texturas usa `Widgets::AssetField` + `BrowseSession` (mesmo fluxo que o Asset Browser).

---

## Panel sections

| Section | Campos |
|--------|--------|
| **Preset** | Lista agrupada por categoria ( `MaterialPresets.hpp` Mirror, Chrome, Gold, Clear Glass, ...) |
| **Surface** | Albedo (RGBA), metallic, roughness, reflectance |
| **Maps & UV** | Albedo / normal / ORM / emission maps; normal strength; AO strength; UV tiling & offset |
| **Transparency** | Alpha mode (Opaque / Cutout / Blend), cutoff, transmission, IOR |
| **Clear coat** | Clearcoat, coat roughness |
| **Sheen** | Cor, roughness (tecido/veludo) |
| **Iridescence** | Strength, film thickness (nm), film IOR |
| **Emission** | Colour, strength, emission map |

Albedo in the editor is **sRGB**; the renderer linearizes in the GPU.

---

## GPU Preview

`MaterialPreviewRenderer` monta um `World` minimum (optional sphere + floor, directional light, active scene sky) and flame `GpuSceneRenderer` com:

- HDR + post-processing stack (default AAA)
- ** Reflection probes** (up to 1 probe, resolution 32–256)
- Mesmo `scene_lit` que o viewport

Controles **Orbit**, **Height** e **Floor** no painel. O renderer pede frames extra enquanto `needsAnotherFrame()` (TAA, probes, auto-exposure).

Ver [`../rendering/materials-pbr.md`](../rendering/materials-pbr.md) e [`../rendering/reflections.md`](../rendering/reflections.md).

---

## Ficheiros

| Ficheiro | Function |
|----------|--------|
| `src/assets/MaterialTypes.hpp` | `MaterialSurface` , `MaterialAlphaMode` |
| `src/assets/MaterialFile.cpp` | Leitura/escrita `CAFMAT2` , `sanitizeMaterialSurface` |
| `src/assets/MaterialPresets.hpp` | Presets nomeados |
| `src/render/MaterialPreviewRenderer.cpp` | Preview offscreen |
| `src/editor/MaterialEditorPanel.cpp` | UI ImGui |
