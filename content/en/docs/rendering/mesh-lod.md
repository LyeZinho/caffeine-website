# Mesh LOD

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`, `Caffeine::Assets::MeshLOD`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/GpuSceneRenderer.cpp"><code>render/GpuSceneRenderer.cpp</code></a></span>
</div>

<p class="doc-lede">How <code>GpuSceneRenderer</code> swaps a mesh for a clustered LOD as it
moves away from the camera, and where terrain LOD is handled instead.</p>

Meshes with at least 600 indices get two clustered LODs (Rossignac vertex clustering,
`Assets::MeshLOD::buildClusteredLod`) in `GpuSceneRenderer`. The source mesh is never rewritten.

| Distance (world units ÷ largest entity scale) | LOD |
|-----------------------------------------------|-----|
| < 120 | original |
| 120–350 | cell = 3% of the AABB diagonal |
| > 350 | cell = 8% of the AABB diagonal |

The swap uses 12% hysteresis so it does not oscillate at the border. Terrain stays in
`TerrainLodSystem`.

GPU instancing exists: `CommandBuffer::drawIndexedInstanced` and the forward **Instancing**
feature (on by default, up to 256 draws per batch; see
[`forward-render-features.md`](forward-render-features.md)). Coarse occlusion culling is
optional and off by default (`Render::OcclusionMode`); frustum culling is always on.
