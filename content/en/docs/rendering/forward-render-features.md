# Forward render features

> **Componente:** `ForwardRenderFeaturesComponent` 
> **Resolver:** `Render::resolveForwardRenderFeatures` 
> **Lua:** `caffeine.forwardrender.*` 
> **GPU:** `GpuSceneRenderer` ( `resolveFeaturesFromScene` por defeito)

Installing, IBL, CPU occlusion, reflexes and volumetric** do not live in the editor preferences. They are the capabilities of the scene — like the post-processing stack — that the renderer solves at each frame.

## Componente ECS

Add **Rendering → Forward Render Features** to an environment entity (e.g. `RenderEnvironment` na cena `dense_outdoor.caf` ).

Sub-blocos:

| Bloco | Function |
|-------|--------|
| Instancing | `drawIndexedInstanced` , up to 256 per batch (default connected) |
| IBL | Diffuse from the sky (**disconnected by default** — the skybox does not illuminate). Speccular (metals) continue to reflect the sky. |
| Occlusion | CPU coarse occlusion (default off) |
| Reflections | Planar, screen-space, probe |
| Volumetrics | Analytical Fog in Forward Shader |

Sem componente na cena, `budgetSafeForwardDefaults()` devolve `RenderFeatureSettings` com:

| Capacidade | Default |
|------------|---------|
| Instancing | ligado (256/batch) |
| IBL difuso | Off (skybox = background + reflections; turn to sky to light) |
| Occlusion | desligado |
| Reflections | **Probe** + screen-space trace |
| Volumetrics | desligado |

The component is recorded in `.caf` (tipo 45).

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
