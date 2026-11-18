# Reflections

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/RenderFeatures.hpp"><code>render/RenderFeatures.hpp</code></a></span>
</div>

<p class="doc-lede">The four reflection modes the forward pass supports — off, planar,
screen-space and per-object probes — and how the renderer falls back to the sky.</p>

> **Resolver:** `Render::resolveForwardRenderFeatures`
> **GPU:** `GpuSceneRenderer` (planar, SSR, per-object probes)
> **Shader:** `scene_lit.frag` (environment + probe + SSR slots)

Configure it in the **Forward Render Features** component (Inspector) or through
`caffeine.forwardrender.*`. **Without a component in the scene**, `budgetSafeForwardDefaults()`
uses **Probe** mode with screen-space tracing on.

| Mode | What it does | Cost |
|------|--------------|------|
| **Off** | Sky/IBL only | Minimum |
| **Planar** | Mirrored redraw in Y (`planeY`), HDR target, `resolutionScale` | +1 scene pass (no shadows in the mirror) |
| **Screen-space** | SSR in the shader (colour/depth history) | Taps per pixel |
| **Probe** (default) | HDR cubemap per glossy object (LRU, ≤ `maxReflectionProbes` per frame, 1 capture/frame) | 6 faces × probe resolution |

**Only when camera settled** postpones expensive captures while the camera moves (TAA keeps
converging).

## Per-object probes

- Low-roughness objects enter the queue; the closest to the camera get a probe.
- `RGBA16F` cubemap with mips; sampled per draw in the shader (slot 9).
- The captured entity is excluded from its own cubemap (`excludeEntity`) to avoid
  self-reflection.
- Cubemap faces use the SDL NDC projection with flipped Y (top-left, y-up).

## SSR

- Reads the colour and depth of the previous frame (keyed by `viewId`).
- Parameters come from `PostProcessComponent.screenSpaceReflections` or the Reflections block
  of the forward features.

## Sky (environment map)

`GpuEnvironmentMap` — equirectangular + mips (slot 11):

- Source: an active `SkyboxComponent` or `GpuSceneRenderOptions::environmentPath`.
- Specular: whenever the skybox is on (metals). Diffuse: only with diffuse IBL enabled.

Where a probe/planar pass has no geometry, the shader falls back to the sky.

## Material Editor

`MaterialPreviewRenderer`: a minimal world + `GpuSceneRenderer` + one probe. See
[`../editor/material-editor.md`](../editor/material-editor.md).

## See also

- [`forward-render-features.md`](forward-render-features.md)
- [`materials-pbr.md`](materials-pbr.md)
- [`render-snapshot.md`](render-snapshot.md)
