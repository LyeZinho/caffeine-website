# Forward render features

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/ForwardRenderFeatures.cpp"><code>render/ForwardRenderFeatures.cpp</code></a></span>
</div>

<p class="doc-lede">Scene-level switches for instancing, IBL, coarse occlusion, reflections and
volumetrics, resolved every frame from one ECS component.</p>

> **Componente:** `ForwardRenderFeaturesComponent`
> **Resolver:** `Render::resolveForwardRenderFeatures`
> **Lua:** `caffeine.forwardrender.*`
> **GPU:** `GpuSceneRenderer` (`resolveFeaturesFromScene` by default)

Instancing, IBL, CPU occlusion, reflections and volumetrics **do not** live in editor
preferences. They are capabilities of the scene — like the post-processing stack — that the
renderer resolves every frame.

## ECS component

Add **Rendering → Forward Render Features** to an environment entity (for example
`RenderEnvironment` in the `dense_outdoor.caf` scene).

Sub-blocks:

| Block | Function |
|-------|----------|
| Instancing | `drawIndexedInstanced`, up to 256 per batch (on by default) |
| IBL | Diffuse from the sky (**off by default** — the skybox does not illuminate). Specular (metals) still reflects the sky. |
| Occlusion | CPU coarse occlusion (default off) |
| Reflections | Planar, screen-space, probe |
| Volumetrics | Analytical fog in the forward shader |

With no component in the scene, `budgetSafeForwardDefaults()` returns `RenderFeatureSettings`
with:

| Capability | Default |
|------------|---------|
| Instancing | on (256/batch) |
| Diffuse IBL | Off (skybox = background + reflections; enable to use the sky as a light) |
| Occlusion | off |
| Reflections | **Probe** + screen-space trace |
| Volumetrics | off |

The component is recorded in `.caf` (type 45).

## Lua

```lua
caffeine.forwardrender.ensure(entityId)
caffeine.forwardrender.setReflections(entityId, true, 1) -- planar
caffeine.forwardrender.setVolumetrics(entityId, true, 2) -- medium
caffeine.forwardrender.setOcclusion(entityId, true)
```

## C++

```cpp
auto& fx = world.add<ECS::ForwardRenderFeaturesComponent>(entity);
fx.reflections.enabled = true;
fx.reflections.mode = Render::ReflectionMode::Planar;

Render::RenderFeatureSettings settings = Render::resolveForwardRenderFeatures(world);
```

For tests or tools that manually inject parameters, `GpuSceneRenderOptions::resolveFeaturesFromScene = false` e preenche `features` by hand.

## See also

- [`reflections.md`](reflections.md)
- [`volumetric-lighting.md`](volumetric-lighting.md)
- [`post-processing.md`](post-processing.md)
