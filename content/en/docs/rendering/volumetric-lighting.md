# Volumetric light

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/RenderFeatures.hpp"><code>render/RenderFeatures.hpp</code></a></span>
</div>

<p class="doc-lede">Analytical height fog computed inside the forward shader: what each
quality level costs, and what the engine still does not do (froxel volumes, god rays).</p>

Active in **Forward Render Features → Volumetrics** (or `caffeine.forwardrender.setVolumetrics`).
By default it is **Off**.

There is no second geometry draw. The fog marches from the camera to the surface inside the
already running shader:

- **Low** — 6 steps
- **Medium** — 12 steps
- **High** — 24 steps
- **Density** and **Height** control density and the falloff with altitude
- **Anisotropy** turns the fog towards the sun
- **Sample shadows** reads the shadow map at each step (more expensive; leave it off if the
  frame goes over 16 ms)

A froxel volume does not exist yet, and neither do god rays. See
[`forward-render-features.md`](forward-render-features.md) for the component and the Lua API.

A volumetric-cloud component with a non-zero mist density forces the scene fog to **Low** when
volumetrics are otherwise off, so ground geometry sits in the same mist as the sky.
