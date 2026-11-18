# Session 2026-09-22 — Viewport 3D, Visual Quality and Performance

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

> **Objective:** fix visual artifacts in Scene Viewport (shading edges, 2.5D aspect, sawing), improve FPS in fast camera motion and introduce LOD of textures by distance to viewers.
> **Build verificado:** `doppio` compile after changes.

---

## Resumo executivo

| Area | Item | Estado |
|------|------|--------|
| Meshes procedurais | Remover `computeSmoothNormals()` in primitives with analytical normals | ✅ |
| Viewport HiDPI | Render offscreen in framebuffer resolution (with cap 1920px) | ✅ |
| Linhas 3D | Clipping no near plane ( `drawViewportWorldLine` ) | ✅ |
| Wireframe GPU | Pipeline `SDL_GPU_FILLMODE_LINE` com depth test | ✅ |
| Anti-aliasing UI | `AntiAliasedLines` / `AntiAliasedFill` no draw list do viewport | ✅ |
| FPS camera | Suspend shadow passes during fast movement | ✅ |
| LOD texturas | Quality by distance to viewers (viewport + Camera 3D) | ✅ |
| Preferences | Sliders in Settings → Viewport | ✅ |

---

## 1. Costuras de shading em primitivas curvas

### Problema

Sphere, torus and capsule showed a vertical line** in the illumination — longitudinal seam.

### Causa

`finishCurvedPrimitive()` chamava `Assets::computeSmoothNormals()` ** After the meshes already have correct analytical normals. Duplicate seam vertices ( `lon=0` vs `lon=segments` , same position, different indices) received means of different faces.

### Correction

Removido `finishCurvedPrimitive()` and dependence on `MeshNormals.hpp` em `GpuProceduralMeshes.cpp` . Primitive curves (sphere, cylinder, capsule, cone, torus) keep only normal analytical.

### Shading Policy

| Tipo | Shading |
|------|---------|
| Sphere, cylinder, capsule, cone, torus | Smooth (analytical normals) |
| Cube, plane, pyramid | Facetado |
| Terreno | Facetado por chunk (LOD de geometria) |
| GLB sem normais | `computeSmoothNormals()` em `MeshLoader.cpp` (mantido) |

### Ficheiros

- `src/caffeine/render/GpuProceduralMeshes.cpp`
- `src/caffeine/assets/MeshNormals.hpp` (utilitarian; not used in GPU procedures)
- `src/caffeine/ecs/MeshComponents.hpp` — `meshPrimitiveUsesSmoothShading()`

---

## 2. Viewport HiDPI and Offscreen Resolution

### Problema

Viewport rendered in pixels**logical** of ImGui while the window uses `SDL_WINDOW_HIGH_PIXEL_DENSITY` — half of the actual resolution, upscale visible (serring).

### Correction

`imguiFramebufferSize()` em `ImGuiGpuTexture.hpp` multiplica por `ImGui::GetIO().DisplayFramebufferScale` .

**Cap:** maior lado limitado a **1920px** para evitar targets 4K+ no editor.

Aplicado em:

- `SceneViewport` (canvas principal)
- `GameplayPreviewPanel`
- `CameraPreviewPanel`

---

## 3. Stable 3D lines (grid, frustums, wireless CPU)

### Problema

Grid, camera frustum and CPU wirelesss drew segments with an endpoint behind the near plane designed for `(-10000, -10000)` — broken lines and dependent on the camera angle.

### Correction

Novos helpers em `SceneViewport` :

- `projectWorldToViewport()` — projects world → pixels; fails only behind the near plane
- `drawViewportWorldLine()` — clip no near plan in clip space (same logic as grid)

Usados em: `drawGrid3D` , `drawCameraFrustums` , `drawSegment` (wireframe CPU em 3D).

---

## 4. Wireframe GPU com profundidade real

### Problema

Mode **Wireframe** turned off the GPU and drew only overlay ImGui without Z-buffer — objects crossed, aspect 2.5D.

### Correction

- `RHI::FillMode::Line` → `SDL_GPU_FILLMODE_LINE` em `RenderDevice`
- Pipeline `m_wireframePipeline` em `GpuSceneRenderer`
- Scene Viewport activates GPU in **Textured and Wireframe**; overlay CPU only for selection/display

`GpuSceneRenderOptions::wireframeMeshes` selecciona o pipeline.

---

## 5. Performance — fast camera movement

### Problema

Quick Orbit/zoom caused falls of FPS (profiler: peaks up to ~850 ms).

### Causas

1. Shadow passes redesenham a cena inteira (4 cascatas direcionais + cubemaps point + spot)
2. High Offscreen Resolution on HiDPI

### Corrections

| Medida | Implementation |
|--------|----------------|
| Skip shadows em movimento | `m_editorCamMotion` em `SceneViewport` ; `enableShadows = false` se motion > 1.25 |
| Cap Resolution | `imguiFramebufferSize(..., maxDim=1920)` |
| GPU only in Textured (previous) | Wireframe also uses GPU since this session |

### API

```cpp
struct GpuSceneRenderOptions {
    bool wireframeMeshes = false;
    bool enableShadows   = true;
    TextureQualitySettings textureQuality{};
    std::vector<Vec3>      textureQualityViewers;
};
```

---

## 6. LOD of remote textures to viewers

### Comportamento

- * *Do not remove** Textures — Reduces GPU cache resolution
- Distance = minimum between the position of the object and each viewer**:
  - Camera of the Scene Viewport (orbit)
  - Todas as entidades com `Camera3DComponent`
  - Camera Preview only uses panel camera
- Dentro de `fullRadius` → Tier 0 (100%)
- Beyond the radius → linear decay to `minScale` ao longo de `falloffDistance`
- Cached Tiers: 100% → 50% → 25% → 12.5% (min. 16px)

### Settings (Settings → Viewport → Texture quality)

| Campo | Default | Description |
|-------|---------|-----------|
| `texture_quality_enabled` | true | Liga/desliga LOD |
| `texture_quality_radius` | 35 m | Total resolution radius |
| `texture_quality_falloff` | 100 m | Decay distance |
| `texture_quality_min_scale` | 0.25 | Minimum scale (1/4 res) |

Persistido em `~/.config/caffeine/editor_preferences.json` .

### Ficheiros

- `src/caffeine/render/TextureQuality.hpp`
- `src/caffeine/render/GpuTextureCache.hpp` / `.cpp` — `acquire(..., qualityTier)`
- `src/caffeine/render/GpuSceneRenderer.cpp` — `MeshDraw::viewerDistance`
- `src/caffeine/scene/EditorContext.hpp` , `EditorPreferences.{hpp,cpp}`
- `doppio-archived/src/doppio/editor/SettingsPanel.cpp`

### Technical documentation

- [`rendering/texture-quality-lod.md`](../rendering/texture-quality-lod.md)
- [`editor/scene-viewport.md`](../editor/scene-viewport.md)

---

## 7. Primitives and editor (related previous session)

Items of the same line of work already in the code (reference):

| Item | Ficheiros |
|------|-----------|
| Capsule cylinder | `GpuProceduralMeshes.cpp` — `buildCapsule()` |
| Cone, pyramid, torus | `MeshComponents.hpp` , `HierarchyPanel` , `InspectorPanel` |
| Fix orbit camera Y axis | `EditorCameraMath.hpp` , `SceneViewport.cpp` |
| Menu Create no Hierarchy | `HierarchyPanel.cpp` |
| GPU shutdown / ASan | `apps/doppio/main.cpp` , cleanup ordem em `SceneEditor` |

---

## Links

- [Scene Viewport](../editor/scene-viewport.md)
- [Texture Quality LOD](../rendering/texture-quality-lod.md)
- [Engine Pillars Roadmap](2026-09-22-engine-pillars-roadmap.md)
- [Rendering Roadmap](2026-09-21-rendering-roadmap.md)
- [Phong GPU Session](2026-09-22-phong-gpu-handles-session.md)
