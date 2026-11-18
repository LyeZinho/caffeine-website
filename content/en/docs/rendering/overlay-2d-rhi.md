# 2D vector overlays (RHI path)

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/Overlay2D.hpp"><code>render/Overlay2D.hpp</code></a></span>
</div>

<p class="doc-lede">Retained-mode debug and gameplay lines, circles and rectangles, drawn
through ImGui in the editor and tessellated for a future RHI overlay pass.</p>

Play-mode debug and gameplay primitives are batched in `Render::Overlay2D`
(`line`, `circle`, `circleFilled`, `rect`, `polyline`) and cleared by `beginFrame()`.

## ImGui path (editor + current runtime)

When `CF_HAS_IMGUI` is defined, `Overlay2D::draw(ImDrawList*, camera, screenOrigin, panelSize)`
renders after the world and before UI widgets.

## Shipping / no ImGui

1. Scripts record primitives via `caffeine.draw2d.*` (same buffer as ImGui).
2. `Overlay2D::buildRhiMesh(camera, screenOrigin, vertices)` tessellates the commands into
   screen-space `RhiVertex` values (`x`, `y`, `r`, `g`, `b`, `a`); world-space commands are
   transformed with the `Camera2D` first.
3. `Overlay2D::drawRhi(CommandBuffer*, camera, screenOrigin)` is the GPU submission entry
   point.

Shader sources live in `src/caffeine/render/shaders/overlay2d.vert` and `overlay2d.frag`.
`drawRhi` is compiled only with `CF_HAS_SDL3` and without `CF_HEADLESS`.

Until the pipeline is registered, tessellation still runs so gameplay logic can be tested;
the upload is a no-op (`drawRhi` tessellates, then discards the vertices).

## Coordinate spaces

- **world** — values in scene units; transformed with `Camera2D`.
- **screen** — pixel offsets relative to the viewport origin; converted via `screenToWorld` for
  world-space commands.
