# Scene Viewport — 3D surrender

> **Namespace:** `Caffeine::Editor::SceneViewport` 
> **Ficheiro:** `src/editor/SceneViewport.cpp` 
> ** Status:** Implemented (GPU-first in 3D)
> * *Performance:** ~10 → ~100 FPS in the editor (see [performance](../performance/editor-viewport-performance.md))

---

## Overview

**Scene Viewport** renders the 3D scene into an offscreen GPU target and composes the result in an ImGui window. Overlays use `ImDrawList` with consistent 3D projection.

---

## Modos de preview de mesh

| Modo | GPU | CPU overlay |
|------|-----|-------------|
| **Textured** | `GpuSceneRenderer` PBR forward + HDR + `PostProcessStack` (TAA/SSAO defaults) | Gizmos, frustums — **not** redesigns meshes or CPU sky if GPU covers viewport |
| **Wireframe** | `GpuSceneRenderer` pipeline `FillMode::Line` | Idem |

Toggle: **Textured / Wireframe** button in the viewport bar.

**Importante:** com GPU activo ( `gpuOwnsSceneMeshes` ), the CPU does not rasterize meshes or terrain in the same frame. See [viewport performance](../performance/editor-viewport-performance.md).

---

## Pipeline por frame (3D)

- `1. resizeCanvasIfNeeded(imguiFramebufferSize(viewportSize, 3840))`
- `2. syncTerrainMeshes(world)`
- `3. GpuSceneRenderer::renderWithCamera / render (HDR scene → PostProcessStack → RGBA8)`
  - `resolveForwardRenderFeatures + PostProcessComponent (câmara selecionada ou defaults)`
  - `planar reflection + reflection probes (top-level pass)`
  - `shadow passes (runtime / quando enableShadows)`
  - `opaque → sky GPU → grid GPU → translucent (copy opaco + blend)`
  - `TAA jitter, SSR history, needsAnotherFrame até convergir`
- `4. ImGui: AddImage(GPU) → overlays (sem fake post ImGui)`
  - `drawEmptyEntities, drawCameraFrustums, drawLightGizmos, TransformGizmo`
  - `CPU sky/grid só se gpuImageCoversViewport == false`


`renderScale` (Settings → Viewport → Rendering) multiplies the internal resolution of the scene.

---

## Editor camera

| Parameter | Fonte |
|-----------|--------|
| Position | `editorCameraPosition(camYaw, camPitch, camDistance, camFocus)` |
| View | `Mat4::lookAt(camPos, camFocus, up)` |
| FOV | 60° (1.0472 rad) — aligned with `GpuSceneRenderer` |
| Overlay projection | `computeVP3D(viewportSize, ctx)` |

Ver [`EditorCameraMath.hpp`](../../src/editor/EditorCameraMath.hpp).

---

## 3D Line Projection

Static functions in `SceneViewport` :

```cpp
static bool projectWorldToViewport(const Mat4& vp, Vec3 worldPos,
                                   ImVec2 origin, ImVec2 viewportSize, ImVec2& screenOut);
static void drawViewportWorldLine(ImDrawList* dl, const Mat4& vp, ImVec2 origin,
                                  ImVec2 viewportSize, Vec3 a, Vec3 b,
                                  ImU32 color, float thickness);
```

- Off-screen endpoints are allowed (ImGui clip)
- If an endpoint is behind the near plane ( `w <= 0.1` ), the segment is **clipped** in clip space — avoid lines for invalid coordinates

Usado por: grid 3D, frustums `Camera3D` , CPU wireless, primitive rings.

---

## HiDPI and resolution

```cpp
// ImGuiGpuTexture.hpp
ImVec2 fb = imguiFramebufferSize(viewportSize, 3840);
resizeCanvasIfNeeded((u32)fb.x, (u32)fb.y);
```

- `DisplayFramebufferScale` do ImGui reflecte DPI do monitor
- Cap **3840** px on the largest side (viewport); camera preview up to **1920**; gameplay preview up to **2560**
- `ctx.renderScale` (0.25–2×) applied in `GpuSceneRenderOptions::renderScale`
- `cameraFarPlane()` dynamic from camera distance to focus

---

## GPU Options ( `GpuSceneRenderOptions` )

Built in `SceneViewport::render()` :

| Campo | Comportamento no viewport |
|-------|---------------------------|
| `wireframeMeshes` | `true` em modo Wireframe |
| `enableShadows` | Conforme contexto (editor pode omitir passes; shader suporta PCF atlas) |
| `renderScale` | De `EditorContext` / preferences |
| `viewId` | `1` viewport, `2` camera preview (separate TAA/SSR history) |
| `postProcessCamera` | Entidade com `PostProcessComponent` (viewport camera selected) |
| `environmentPath` | Vazio se skybox desligado na toolbar |
| `grid` | Space derived from camera distance; drawn in GPU |
| `terrainLodDistanceScale` | ** `2.0` ** no editor |
| `textureQuality.enabled` | ** `false` ** no viewport (menos churn) |

> **Nota:** `enableShadows=false` Turn off only the shadow **passes**. Samplers remain connected — see [shadow-mapping.md](../rendering/shadow-mapping.md#editor-vs-runtime).

---

## Anti-aliasing de overlays

At the start of viewport draw:

```cpp
drawList->Flags |= ImDrawListFlags_AntiAliasedLines;
drawList->Flags |= ImDrawListFlags_AntiAliasedFill;
```

Afecta gizmos e linhas ImGui. Silhuetas da cena usam **TAA** no `PostProcessStack` (not MSAA hardware).

---

## Camera / Gameplay Preview GPU

- `renderCameraPreviewGpu()` — sharing `GpuSceneRenderer` do viewport; targets `m_previewColorTarget`
- `GameplayPreviewPanel` — own renderer, even command buffer
- **Um caminho por frame:** GPU **ou** `drawSceneMeshesForCamera()` (CPU), nunca ambos
- Throttle: `editorPanelWorthGpuRender(origin, size, 2)` — ver `EditorPanelUtils.hpp`

---

## Related Preferences

**Settings → Viewport:**

- Move speed / Orbit sensitivity
- Show grid
- **Render scale** (internal HDR resolution)
- **Texture quality**(radio, falloff, minimum) — see [`texture-quality-lod.md`](../rendering/texture-quality-lod.md)

Campos em `EditorContext` sincronizados via `SettingsPanel::applyPreferencesToContext()` .

---

## Ficheiros principais

| Ficheiro | Responsabilidade |
|----------|------------------|
| `src/editor/SceneViewport.cpp` | UI, input camera, composition |
| `src/editor/SceneViewport.hpp` | Public API, auxiliary CPU raster |
| `src/editor/ImGuiGpuTexture.hpp` | `imguiFramebufferSize()` |
| `src/render/GpuSceneRenderer.cpp` | Pass GPU cena |
| `src/editor/EditorCameraMath.hpp` | Orbit / look direction |

---

## Known limitations

| Item | Notas |
|------|-------|
| MSAA hardware | Not used; TAA + render scale > 1 improve edges |
| Gizmos ImGui | No depth test against scene GPU (intentional — always visible) |
| Runtime play | `enableShadows` conforme contexto; ver `RuntimeSceneRenderer` |

---

## See also

- [**Performance — Viewport Editor**](../performance/editor-viewport-performance. md)
- [Session 2026-09-22 — Viewport & Quality](../plans/2026-09-22-viewport-rendering-quality-session.md)
- [Texture Quality LOD](../rendering/texture-quality-lod.md)
- [Materials PBR](../rendering/materials-pbr.md)
- [Post-processing](../rendering/post-processing.md)
- [Material Editor](material-editor.md)
- [Shadow Mapping](../rendering/shadow-mapping.md)
