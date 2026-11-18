# Performance — Viewport & GPU Scene Editor

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Historical record of the C++ editor viewport optimisation session: the
measurements, the GPU/CPU rules it produced, and which constraints still apply.</p>

> **Data:** 2026-09-23
> **Context:** Research of FPS falls in Doppio (~12 FPS, ~77 ms in `SceneEditor::render` ) 
---

<div class="doc-callout doc-callout--note">
  <p><strong>Historical.</strong> This page records the C++ editor optimisation session. The current Rust viewport uses offscreen <code>render_begin</code>/<code>render_poll</code> readback; see <a href="../editor/scene-viewport.md">Scene viewport</a>.</p>
</div>

## Resumo

The editor rendered the same geometry in **CPU and GPU** in the same frame, performed several GPU passes** (viewport + previews) with redundant shadows and binds, and rasterized the **skybox in CPU** the almost total resolution of the panel to each camera micro-movement.

The corrections follow two rules:

1. **Meshes/land:**GPU ** CPU per frame — never both.
2. **Shadow passes**(redraw from scene) are independent of the **shadow samples**(textures connected in shadow).

---

## Resultado validado

| Metric | Antes | Depois |
|---------|-------|--------|
| **FPS** | **~10** | **~100** |
| Frame time | ~77–213 ms | ~10 ms |

Gain measured in Doppio with 3D scene + ground chunked, after the package of corrections below.

---

## Sintomas observados (profiler, antes)

| Metric | Valor | Interpretation |
|---------|-------|-----------------|
| Frame time | ~77–213 ms | Low CPU (~5%), GPU ~30% → Draw calls neck / driver |
| `SceneEditor::render` | ~55 ms avg | Single Scope Swallowed All Panels |
| `GpuSceneRenderer::draw` | ~54 ms avg | Pass principal da cena (terreno + meshes) |
| `SceneViewport::skybox` | 0.9 ms avg, **80 ms max** | Picos ao re-rasterizar equirect em CPU |
| `cameraPreview` / `gameplayPreview` | ~0 ms after throttle | Previews deixaram de competir com o viewport |

---

## Arquitetura: um caminho de render por frame

### Scene Viewport (3D)

| Camada | Responsible |
|--------|-------------|
| Meshes + terreno | **GPU** ( `GpuSceneRenderer` ) quando `m_useGpuScene` ativo |
| Skybox | CPU ( `SkyboxRenderer` ) como fundo; GPU limpa com alpha 0 |
| Grid, gizmos, frustums, marcadores | CPU ( `ImDrawList` ) — editor overlays |

Quando `gpuOwnsSceneMeshes` is active, `drawEmptyEntities()` ** does not rasterize meshes in CPU (includes terrain and selection). Just empty entity markers and chunk debug.

### Camera / Gameplay Preview

- **GPU path:** `renderCameraPreviewGpu()` ou `GameplayPreviewPanel::m_renderer` — sem `drawSceneMeshesForCamera()` no mesmo frame.
- **CPU fallback:**only when GPU pass fails or is not available ( `#ifdef CF_HAS_SDL3` ).
- Throttle: `editorPanelWorthGpuRender(..., frameInterval=2)` — re-render GPU every 2 frames; reuses previous texture.

---

## Causa raiz em `GpuSceneRenderer::draw`

Para **cada chunk de terreno**, o loop fazia trabalho que deveria ser **uma vez por pass** ou **uma vez por entidade**:

| Operation | Problema |
|----------|----------|
| `pushUniformData(shadowUbo)` | Mesmo UBO repetido com sombras desligadas |
| `bindShadowTextures()` | 6+ samplers por chunk |
| `texCache.acquire()` | Lookup de splat/albedo/normal por chunk |

With **50–200 Chunks ** Visible → **000 frame redundant operations**.

---

## Corrections applied (10 → 100 FPS)

| # | Correction | Impacto |
|---|----------|---------|
| 1 | `shadowUbo` ** once per pass** (not by draw) | Menos uploads de uniform por frame |
| 2 | Shadow **passes** off no editor; **samplers** sempre ligados | No redraw × waterfalls; no SIGSEGV NVIDIA |
| 3 | **Cache of land textures** — bind only on the first time per entity | From O(chunks) → The texture binds |
| 4 | `terrainLodDistanceScale = 2` no editor | Less visible Chunks / Less Draws |
| 5 | GPU cap resolution **1280 px** in viewport | Menos pixels no offscreen target |
| 6 | `textureQuality.enabled = false` no editor | Menos churn de mip/tier por draw |
| 7 | Skybox cap **512–1024 px**(without frameThrottle) | Cheapest CPU Raster without sky/land desync |

Complementary (same session): GPU/CPU frame separation, skip GPU in hidden previews, granular profiler.

---

## Optimizations in `GpuSceneRenderer`

### 1. Shadow passes vs shadow samplers

| Conceito | Editor | Runtime / play |
|----------|--------|----------------|
| **Shadow passes** ( `renderDirectionalShadows` , etc.) | Off | When `enableShadows=true` |
| **Shadow samplers** ( `bindShadowTextures` ) | ** Always on (white/dummy) | Always |

**⚠️ Regra crítica (SIGSEGV NVIDIA):**
Desligar `enableShadows` * Can't miss * `bindShadowTextures()` . Os shaders `scene_lit.frag` / `terrain_lit.frag` declare shade samplers; unconnected slots → crash on the driver.

```cpp
// Correto: passes condicionais, binds sempre
if (options.enableShadows) {
    renderDirectionalShadows(...);
}
bindShadowTextures(2, 4, 6);  // início do pass + ao trocar mesh ↔ terreno
```

### 2. Uniform de sombra uma vez por pass

`SceneShadowUBO` is sent ** once** before the draw loop (not by mesh/chunk).

### 3. Cache de texturas de terreno

Splat/Albedo/normal textures are connected ** once per land entity**, not by Chunk LOD.

### 4. LOD de terreno no editor

`GpuSceneRenderOptions::terrainLodDistanceScale = 2.0f` in Scene Viewport — folded effective distance → LOD coarser, less visible Chunks.

---

## Optimizations in Scene Viewport

| Option | Valor no editor | Motivo |
|-------|-----------------|--------|
| `enableShadows` | `false` | Evita 4+ redraws da cena por cascata |
| `terrainLodDistanceScale` | `2.0` | Menos chunks GPU |
| `textureQuality.enabled` | `false` | Menos churn de mips/tiers por draw |
| `imguiFramebufferSize` cap | **1280** px | Menos pixels no offscreen target |
| Skybox `maxRasterDim` | 512–1024 | Raster CPU cheaper; re-rasterizes every camera move |

---

## Optimizations in previews

Helper: `editorPanelWorthGpuRender()` em `EditorPanelUtils.hpp`

- Ignores collapsed panels, &lt; 32 px, or outside `IsRectVisible`
- Skybox desenhado **todo frame** nos previews (antes do `AddImage` GPU)
- GPU is only jumped when the panel is collapsed / invisible / &lt; 32 px
- GPU cap resolution **960** px in previews
- Canvas sempre inicializado antes do primeiro draw ( `resizeCanvas` se targets nulos)

---

## Instrumentation ( `CF_PROFILE_SCOPE` )

The profiler maintains a hierarchical tree** of strips (consumer stack trace). Each node records:

| Metric | Significado |
|---------|-------------|
| **self ms** | Exclusive time (no children) — where to look for bottlenecks |
| **total ms** | Tempo inclusivo (scope + filhos) |
| ** %frame** | `avg self` vs last frame time |
| **%parent** | `avg self` vs `avg total` do pai |

Scopes added for diagnosis in the panel **Profiler**:

### SceneEditor

- `SceneEditor::render` (raiz do frame do editor)
- `SceneEditor::propagateTransforms`
- `SceneEditor::hierarchy` , `inspector` , `viewport` , `assetBrowser` , `console` , `profiler`
- `SceneEditor::cameraPreview` , `gameplayPreview` , `materialEditor` , `terrainEditor` , `plugins` , …

### SceneViewport

- `SceneViewport::render`
- `SceneViewport::gpuPass`
- `SceneViewport::skybox`
- `SceneViewport::sprites` , `SceneViewport::entities`

### GpuSceneRenderer

- `GpuSceneRenderer::renderWithCamera`
- `GpuSceneRenderer::gather`
- `GpuSceneRenderer::shadows` (quando passes activos)
- `GpuSceneRenderer::draw`

* *How to use:** open Profiler → **Reset Stats** → orbit camera / open previews → expand tree in **Scope tree** → sort by **self ms** (default active). Passing the mouse over a scope shows the full path ( `SceneEditor::render > SceneEditor::viewport > …` ).

---

## Pipeline actual (3D)

- `1. imguiFramebufferSize(viewportSize, 1280)`
- `2. syncTerrainMeshes(world) // só se resolução/revisão mudou`
- `3. GpuSceneRenderer::render(...)`
  - `gatherMeshDraws (frustum + LOD terreno ×2)`
  - `(sem shadow passes no editor)`
  - `renderMeshes — bind samplers dummy, 1× shadow UBO`
- `4. ImGui: skybox (CPU, cap resolução) → AddImage(GPU) → grid → overlays CPU`


---

## Ficheiros principais

| Ficheiro | Amendments |
|----------|------------|
| `src/caffeine/render/GpuSceneRenderer.cpp` | Shadow UBO 1×, ground cache, mandatory binds |
| `src/caffeine/render/GpuSceneRenderer.hpp` | `terrainLodDistanceScale` |
| `doppio-archived/src/doppio/editor/SceneViewport.cpp` | GPU-only meshes, editor options, scopes |
| `doppio-archived/src/doppio/editor/CameraPreviewPanel.cpp` | GPU-only / CPU fallback, throttle |
| `doppio-archived/src/doppio/editor/GameplayPreviewPanel.cpp` | Idem + resizeCanvas seguro |
| `doppio-archived/src/doppio/editor/EditorPanelUtils.hpp` | `editorPanelWorthGpuRender()` |
| `src/caffeine/render/SkyboxRenderer.cpp` | Cap resolution; raster synchronized with camera |
| `src/caffeine/terrain/TerrainLodSystem.cpp` | `lodDistanceScale` no gather |

---

## Limitations and future work

| Item | Notas |
|------|-------|
| `GpuSceneRenderer::draw` ainda domina frame time em cenas com muito terreno | Next step: flashing/batching |
| Skybox continua CPU | Migrar para cubemap GPU ou shader fullscreen |
| MSAA no pass GPU | Pendente |
| Profiler itself can sting ~30 ms | `SceneEditor::profiler` ao redesenhar tabela |

---

## See also

- [Scene Viewport](../editor/scene-viewport.md)
- [Shadow Mapping](../rendering/shadow-mapping.md)
- [Texture Quality LOD](../rendering/texture-quality-lod.md)
- [Session 2026-09-22 — Viewport](../plans/2026-09-22-viewport-rendering-quality-session.md)
