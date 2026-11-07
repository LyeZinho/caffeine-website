# 🌋 Terrain Generator Plugin

> **Tipo:** plugin do editor ( `terrain_plugin.so` ) 
> **Algoritmo:** `assets/general-ultra-realistic-terrain-algorithm` 
> **Host API:** `PluginHostApi::terrainGenerateUltra` , `terrainImportHeightmap`

---

## Overview

The plugin **Terrain Generator** moves the procedural generation out of the core. It uses the Node.js pipeline with **domain warping** and **Geomorphological PDS** (more complete version than the old C++ generator removed from the engine).

**Fluxo:**

1. Utilizador seleciona entidade com `TerrainComponent` .
2. Panel **Terrain Generator** → preset + world size + grid + seed.
3. Host executa `node caffeine-export.js` in the algorithm directory.
4. `heightmap.txt` + `meta.json` are imported via `TerrainHeightmapImporter` .
5. `TerrainCache` reconstructs mesh render, LOD and collision mesh.

---

## Presets

| Preset | Description |
|--------|-----------|
| `default` | Erosion + balanced tectonic |
| `alpine` | Tectonic + ice |
| `mesa` | Caprock + deslizamentos |
| `volcanic` | Cone + caldeira |
| `glacial` | Vales em U |
| `blend` | Alpine mix  |

---

## Export CLI (Caffeine)

```bash
cd assets/general-ultra-realistic-terrain-algorithm
npm install          # primeira vez (simplex-noise)
node caffeine-export.js alpine \
  --out /tmp/heightmap.txt \
  --meta /tmp/meta.json \
  --world-size 256 \
  --grid-size 257 \
  --seed 42
```

`meta.json` inclui `minHeight` , `maxHeight` , `worldSize` , `gridSize` para o importador.

---

## Host API (plugins)

```cpp
struct PluginHostApi {
    bool (*terrainGenerateUltra)(void* ctx, u32 entityId, const char* preset, u32 seed,
                               float worldSizeMeters, u32 gridSize);
    bool (*terrainImportHeightmap)(void* ctx, u32 entityId, const char* heightmapPath,
                                   float worldSizeX, float worldSizeZ);
};
```

Implementation: `TerrainBridge` exposed via service `terrain.generateUltra` ( `PluginServiceRegistry` ).

---

## Desenvolvimento

| Ficheiro | Description |
|----------|-----------|
| `doppio-plugins/plugins/terrain-generator/src/main.cpp` | UI ImGui do plugin |
| `doppio-plugins/plugins/terrain-generator/src/TerrainBridge.cpp` | Spawn Node + import (no Doppio core) |
| `src/terrain/TerrainHeightmapImporter.cpp` | Parse `.txt` → heightmap |

Build: `terrain_plugin` is built from `doppio-plugins`, installed in a `plugins/` directory, and enabled in the Plugin Manager.

---

## Ancient core migration

Removido de `caffeine-core` :

- `src/terrain/generation/*` (TerrainGenerator, noise, hydrology, geo sim)
- Tab **Generate** do Terrain Editor (graph imnodes)
- Campo `TerrainComponent::generation`

Ancient scenes with blob v2–v8 still carry; generation parameters are ignored. Re-generate terrain with the plugin if necessary.
