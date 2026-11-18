# Reflexos

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/RenderFeatures.hpp"><code>render/RenderFeatures.hpp</code></a></span>
</div>

<p class="doc-lede">Os quatro modos de reflexão que o passe forward suporta — off, planar,
screen-space e probes por objecto — e como o renderer recorre ao céu.</p>

> **Resolver:** `Render::resolveForwardRenderFeatures`
> **GPU:** `GpuSceneRenderer` (planar, SSR, probes por objecto)
> **Shader:** `scene_lit.frag` (slots environment + probe + SSR)

Configura-se no componente **Forward Render Features** (Inspector) ou via
`caffeine.forwardrender.*`. **Sem componente na cena**, `budgetSafeForwardDefaults()` usa o
modo **Probe** com screen-space tracing ligado.

| Modo | O que faz | Custo |
|------|-----------|-------|
| **Off** | Apenas céu/IBL | Mínimo |
| **Planar** | Redesenho espelhado em Y (`planeY`), alvo HDR, `resolutionScale` | +1 passe de cena (sem sombras no espelho) |
| **Screen-space** | SSR no shader (histórico de cor/profundidade) | Taps por pixel |
| **Probe** (default) | Cubemap HDR por objecto polido (LRU, ≤ `maxReflectionProbes` por frame, 1 captura/frame) | 6 faces × resolução do probe |

**Only when camera settled** adia as capturas caras enquanto a câmara se move (o TAA continua
a convergir).

## Probes por objecto

- Objectos com roughness baixa entram na fila; os mais próximos da câmara recebem probe.
- Cubemap `RGBA16F` com mips; amostragem por draw no shader (slot 9).
- A entidade capturada é excluída do próprio cubemap (`excludeEntity`) para evitar
  auto-reflexo.
- As faces do cubemap usam a projecção NDC da SDL com Y invertido (top-left, y-up).

## SSR

- Lê a cor e a profundidade do frame anterior (por `viewId`).
- Os parâmetros vêm de `PostProcessComponent.screenSpaceReflections` ou do bloco Reflections
  das forward features.

## Céu (environment map)

`GpuEnvironmentMap` — equirectangular + mips (slot 11):

- Fonte: um `SkyboxComponent` activo ou `GpuSceneRenderOptions::environmentPath`.
- Especular: sempre que o skybox está ligado (metais). Difuso: só com IBL difuso activo.

Onde o passe de probe/planar não tem geometria, o shader recorre ao céu.

## Material Editor

`MaterialPreviewRenderer`: um mundo mínimo + `GpuSceneRenderer` + um probe. Ver
[`../editor/material-editor.md`](../editor/material-editor.md).

## Ver também

- [`forward-render-features.md`](forward-render-features.md)
- [`materials-pbr.md`](materials-pbr.md)
- [`render-snapshot.md`](render-snapshot.md)
