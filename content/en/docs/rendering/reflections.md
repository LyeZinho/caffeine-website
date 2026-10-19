# Reflexos

> **Resolver:** `Render::resolveForwardRenderFeatures` 
> **GPU:** `GpuSceneRenderer` (planar, SSR, probes por objeto)
> **Shader:** `scene_lit.frag` (slots environment + probe + SSR)

Configura no componente **Forward Render Features** (Inspector) ou via `caffeine.forwardrender.*` . 
**Sem componente na cena**, `budgetSafeForwardDefaults()` usa **Probe** + screen-space trace ligado.

| Modo | O que faz | Custo |
|------|-----------|--------|
| **Off** | IBL/sky only | Minimum |
| **Planar** | Redesenho espelhado em Y ( `planeY` ), alvo HDR, `resolutionScale` | +1 cena (sem sombras no espelho) |
| **Screen-space** | SSR in shader (Color/Deep History) | Taps por pixel |
| **Probe** (default) | Cubemap HDR by glossy object (LRU, ≤ `maxReflectionProbes` por frame, 1 captura/frame) | 6 faces × probe resolution |

**Only when camera settled** postpones expensive catches while the camera moves (TAA still converges).

## Probes por objeto

- Objects with low roughness enter the queue; the closest to the chamber receive probe.
- Cubemap `RGBA16F` com mips; amostragem no shader por draw (slot 9).
- Captured entity excluded from cubemap ( `excludeEntity` ) para evitar auto-reflexo.
- Cubemap faces: projection with flip Y for NDC SDL (top-left, y-up).

## SSR

- Reads color and depth of the previous frame** (by `viewId` ).
- Parameters `PostProcessComponent.screenSpaceReflections` ou no bloco Reflections do forward features.

## Sky (environment map)

`GpuEnvironmentMap` — equirectangular + mips (slot 11):

- Fonte: `SkyboxComponent` ativo ou `GpuSceneRenderOptions::environmentPath` .
- Speculate: whenever the skybox is turned on (metals). Diffuse: Only with diffuse IBL on.

Where probe/planar has no geometry, it falls to the sky.

## Material Editor

`MaterialPreviewRenderer` : minimum world + `GpuSceneRenderer` + 1 probe. Ver [`../editor/material-editor.md`](../editor/material-editor.md).

## See also

- [`forward-render-features.md`](forward-render-features.md)
- [`materials-pbr.md`](materials-pbr.md)
- [`render-snapshot.md`](render-snapshot.md)
