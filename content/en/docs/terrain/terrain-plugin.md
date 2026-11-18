# Terrain Generator Plugin

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Plugin</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/doppio-plugins/plugins/terrain-generator/src/main.cpp"><code>doppio-plugins/plugins/terrain-generator</code></a></span>
</div>

<div class="doc-callout doc-callout--note">
  <p><strong>Current path.</strong> The Rust Doppio has a native <strong>Terrain</strong> tab
  (C ABI v8). This page documents the legacy <code>terrain_plugin</code> for the C++/ImGui host.</p>
</div>

<p class="doc-lede">The editor plugin that runs the Node.js terrain algorithm and imports the
resulting heightmap into a <code>TerrainComponent</code>; sculpting and painting stay in the
engine.</p>

> **Type:** editor plugin (`terrain_plugin.so`)
> **Algorithm:** `assets/general-ultra-realistic-terrain-algorithm`
> **Services:** `terrain.generateUltra`, `terrain.importHeightmap`

---

## Overview

The **Terrain Generator** plugin moves procedural generation out of the core. It uses the
Node.js pipeline with **domain warping** and **geomorphological PDEs** (a more complete version
than the old C++ generator removed from the engine).

**Flow:**

1. The user selects an entity with a `TerrainComponent`.
2. Panel **Terrain Generator** → preset + world size + grid + seed.
3. The plugin runs `node caffeine-export.js` in the algorithm directory.
4. `heightmap.txt` + `meta.json` are imported via `TerrainHeightmapImporter`.
5. `TerrainCache` rebuilds the render mesh, LOD and collision mesh.

---

> **Editing is native.** The **Terrain Editor** panel (sculpt, splat paint, undo and
> `.cterrain` I/O) is part of Caffeine core. This plugin only generates terrain procedurally
> and imports heightmaps; it registers a generator panel, not the terrain editor.

## Presets

| Preset | Description |
|--------|-------------|
| `default` | Erosion + balanced tectonic |
| `alpine` | Tectonic + ice |
| `mesa` | Caprock + landslides |
| `volcanic` | Cone + caldera |
| `glacial` | U-shaped valleys |
| `blend` | Alpine ⊕ mesa mix |

---

## Export CLI (Caffeine)

```bash
cd assets/general-ultra-realistic-terrain-algorithm
npm install          # first run (simplex-noise)
node caffeine-export.js alpine \
  --out /tmp/heightmap.txt \
  --meta /tmp/meta.json \
  --world-size 256 \
  --grid-size 257 \
  --seed 42
```

`meta.json` contains `minHeight`, `maxHeight`, `worldSize` and `gridSize` for the importer.

---

## Host API (plugins)

The plugin registers two named services through `PluginHostApi::registerService`; callers use
`invokeService` with the request structs from `include/caffeine/plugin/PluginServices.hpp`:

```cpp
struct TerrainGenerateUltraRequest {
    CaffeinePluginU32 entityId = 0;
    char preset[64] = "default";
    CaffeinePluginU32 seed = 42;
    float worldSizeMeters = 256.0f;
    CaffeinePluginU32 gridSize = 257;
};

struct TerrainImportHeightmapRequest {
    CaffeinePluginU32 entityId = 0;
    char heightmapPath[512] = {};
    float worldSizeX = 0.0f;
    float worldSizeZ = 0.0f;
};
```

`terrain.generateUltra` and `terrain.importHeightmap` return a `bool` through the service
handler; both run on the active world (`PluginActiveWorld`) and mark the scene dirty.

---

## Development

| File | Description |
|------|-------------|
| `doppio-plugins/plugins/terrain-generator/src/main.cpp` | ImGui plugin panel |
| `doppio-plugins/plugins/terrain-generator/src/TerrainBridge.cpp` | Spawns Node + imports (not in the Doppio core) |
| `doppio-plugins/plugins/terrain-generator/src/TerrainPluginServices.cpp` | Service handlers |
| `src/caffeine/terrain/TerrainHeightmapImporter.cpp` | Parses `.txt` → heightmap |

Build: `terrain_plugin` is built from `doppio-plugins`, installed in a `plugins/` directory, and
enabled in the Plugin Manager.

---

## Legacy core migration

Removed from `caffeine-core`:

- The old procedural generator inside `src/caffeine/terrain/` (`TerrainGenerator`, noise,
  hydrology, geo simulation) — the mesh, cache, sculpt, paint and `.cterrain` code remains
- Procedural generation moved out of the native Terrain Editor; sculpt/paint remains in the core
- Field `TerrainComponent::generation`

Older scenes with blob v2–v8 still load; generation parameters are ignored. Re-generate terrain
with the plugin if necessary.
