# Mesh LOD

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`, `Caffeine::Assets::MeshLOD`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/GpuSceneRenderer.cpp"><code>render/GpuSceneRenderer.cpp</code></a></span>
</div>

<p class="doc-lede">Como o <code>GpuSceneRenderer</code> troca uma mesh por um LOD agrupado
conforme ela se afasta da câmara, e onde o LOD de terreno é tratado.</p>

Malhas com pelo menos 600 índices recebem dois LODs agrupados (vertex clustering de
Rossignac, `Assets::MeshLOD::buildClusteredLod`) no `GpuSceneRenderer`. A malha original
nunca é reescrita.

| Distância (unidades de mundo ÷ maior escala da entidade) | LOD |
|----------------------------------------------------------|-----|
| < 120 | original |
| 120–350 | célula = 3% da diagonal da AABB |
| > 350 | célula = 8% da diagonal da AABB |

A troca usa histerese de 12% para não oscilar na fronteira. O terreno continua no
`TerrainLodSystem`.

GPU instancing existe: `CommandBuffer::drawIndexedInstanced` e a funcionalidade **Instancing**
do forward pass (ligada por defeito, até 256 draws por batch; ver
[`forward-render-features.md`](forward-render-features.md)). A oclusão grosseira em CPU é
opcional e está desligada por defeito (`Render::OcclusionMode`); o frustum culling está
sempre activo.
