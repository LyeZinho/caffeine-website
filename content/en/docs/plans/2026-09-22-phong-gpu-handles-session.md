# Session 2026-09-22 — Phong GPU, Handles and Shadows

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

> **Branch:** `feature/editor-plugin-sdk` 
> **Objective:** advance P0 pillars (rendering Phong + handles) and P1 tasks (point GPU shadows, normal maps on the ground).
> **Build verificado:** `caffeine-core` , `caffeine-runtime` , `doppio` compilam com sucesso.

---

## Resumo executivo

| Prioridade | Item | Estado |
|------------|------|--------|
| P0 | Remover fallback CPU shadows no editor ( `SceneViewport` ) | ✅ |
| P0 | Inspector UI para `customNormalPath` e `shininess` (mesh + terreno) | ✅ |
| P1 | Point light shadows GPU | ✅ |
| P1 | Terreno com normal maps em `terrain_lit.frag` | ✅ |
| P0 | Asset handles com generation + LRU + invalidation callbacks | ✅ |

---

## 1. Asset handles (Pilar 6)

### O que mudou

- `AssetHandle<T>` passou a guardar `{ id, generation }` . `get()` devolve `nullptr` If the generation doesn't match.
- `LoadStatus::Invalid` quando o slot foi invalidado (LRU ou GC).
- **Hot-reload** ( `clearEntryData` ): recharges payload ** without** increasing generation — active handsles remain valid.
- **Invalidation** ( `invalidateEntry` ): increase generation, clean payload, notify callbacks.
- **LRU eviction**: quando `m_cachedBytes > m_maxCacheBytes` , removes unreferenced entries in order `lastAccessFrame` .
- `registerInvalidationCallback` / `unregisterInvalidationCallback` to release GPU features when an asset is evicted.
- `CacheStats::evictedCount` para telemetria.

### Ficheiros

- `src/caffeine/assets/AssetHandle.hpp` , `AssetTypes.hpp` , `AssetManager.{hpp,cpp}`
- `tests/test_assetmanager.cpp` — generation tests, LRU, callbacks

### Documentation

- [`assets/asset-manager.md`](../assets/asset-manager.md)

---

## 2. Rendering Phong + sombras GPU (Pilar 1)

### Meshes ( `scene_lit.*` )

- Shader Phong: ambient + diffuse + specular com `shininess` .
- Normal mapping via TBN ( `scene_lit.vert` exporta tangent/bitangent).
- Tangentes calculadas em `MeshLoader::computeMeshTangents()` para OBJ e glTF.
- `MeshFilterComponent` : `customNormalPath` , `shininess` (default 32).
- Directional shadows: depth pass + PCF 3×3 in fragment shadow.
- Pointy shadows: up to 2 lights, cubemap Depth ( `GpuPointShadowMap` ), sample no `scene_lit.frag` .

### Terreno ( `terrain_lit.frag` )

- Mesmo modelo Phong que meshes.
- Normal map triplanar via `uNormalMap` (sampler slot 5).
- `TerrainComponent` : `normalMapPath` , `shininess` (default 16).
- `TerrainGpuTextureCache` carrega e invalida `normalMap` em sync com `texturePath` .
- Shadows: directional (slots 6–7) + point (slots 8–9).
- `castShadows` / `receiveShadows` respeitados no gather GPU.

### Editor viewport

- Com GPU 3D texturizado activo, `gatherSceneLighting(..., buildCpuShadowMaps = false)` .
- `drawSceneMeshesForCamera` usa `collectSceneLights` only — no CPU shadow maps.
- CPU raster remains for wireless/debug and empty entities when GPU is not active.

### Inspector + serialization

| Componente | Campos novos | Blob |
|------------|--------------|------|
| `MeshFilterComponent` | Normal Map, Shininess | append after `customMaterialPath` |
| `TerrainComponent` | Normal Map, Shininess | blob version **10** |

### Ficheiros principais

- `src/caffeine/render/GpuSceneRenderer.cpp` , `GpuPointShadowMap.{hpp,cpp}`
- `src/caffeine/render/shaders/scene_lit.vert` / `.frag` , `terrain_lit.frag`
- `src/scene/LightingSystem.{hpp,cpp}`
- `doppio-archived/src/doppio/editor/SceneViewport.cpp` , `InspectorPanel.cpp` , `SceneSerializer.cpp`
- `src/caffeine/terrain/TerrainGpuTextures.cpp` , `src/caffeine/ecs/TerrainComponents.hpp`

### Documentation

- [`rendering/materials-phong.md`](../rendering/materials-phong.md)
- [`rendering/shadow-mapping.md`](../rendering/shadow-mapping.md)
- [`terrain/terrain-system.md`](../terrain/terrain-system.md)
- [`assets/mesh-loading.md`](../assets/mesh-loading.md)

---

## 3. Continuation (same branch)

| Item | Estado |
|------|--------|
| Runtime GPU shadows | ✅ `RuntimeSceneRenderer` integra `GpuSceneRenderer` |
| CSM 4 cascatas (luz dir 0) | ✅ atlas 1024², splits práticos |
| Spot shadows GPU (2 luzes) | ✅ `GpuSpotShadowMap` + loop spot nos shaders |
| `test_scenemanager.cpp` | ✅ usa `Transform` / `Acceleration2D` ; compila |
| ECS components missing in the tests | ✅ `Position2D` , `Velocity2D` , `Scale2D` , `Rotation` , `Health` |

## 4. Next suggested steps

1. **PCSS / bark blending** — visual quality of shadows.
2. **PBR** — metallic/roughness on the base Phong.
3. **Full suite** — other tests ( `test_cap_loader` , editor integration) still with pre-existing errors.

---

## Links

- [Engine Pillars Roadmap](2026-09-22-engine-pillars-roadmap.md)
- [Rendering Roadmap P0–P6](2026-09-21-rendering-roadmap.md)
