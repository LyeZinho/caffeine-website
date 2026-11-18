# 🎲 Procedural Tools Plugin

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Plugin</span>
  <span><strong>Plugin:</strong> `procedural_tools_plugin.so`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/procedural/ProceduralWorldSystem.hpp"><code>procedural/ProceduralWorldSystem.hpp</code></a></span>
</div>

<p class="doc-lede">Streaming tools for endless worlds: chunk terrain heights, optional
structures, a Lua director and a noise API over the <code>ProceduralWorldComponent</code>.</p>
> **Scripts:** `assets/plugins/procedural/scripts/` 
> **Runtime API:** `caffeine.procedural.*` (Lua)

---

## Overview

**Modular** streaming tools for procedural streaming — is not a “game types” system. Matches:

| Ferramenta | Options | Function |
|------------|--------|--------|
| **Terrain height** | `flat` , `hills` , `fbm` | Perfil de altura por chunk |
| **Structure spawner** | `none` , `markers` , `rooms` , `track` | Cubos opcionais por chunk |
| **Lua director** | qualquer `.lua` | streaming logic in play mode |
| **Noise API** | `hash` , `noise2d` , `fbm2d` | Dados para scripts custom |

Exploration, backrooms and endless running are **benchmarks** (reference examples), not required archetypes.

---

## Setup (Editor)

1. Abrir painel **Procedural Tools**
2. Configurar **Streaming** (seed, chunk size, view radius)
3. Escolher **Terrain height** e **Structure spawner** (ou `none` + Lua)
4. Definir **Script path** (default: `custom_director.lua` )
5. **Install Lua scripts** → copies templates to `scripts/procedural/`
6. **Create Streaming Setup** → creates a terrain entity plus a director entity with
   `ProceduralWorldComponent` and a `ScriptComponent`
7. **Play** — chunks stream around the camera

### Benchmarks

In section **Benchmarks (examples)** — loads a reference scene to study or duplicate. It doesn't limit what you can build.

| Benchmark | Terrain | Structures | Script |
|-----------|---------|------------|--------|
| Exploration | hills | markers | `exploration_director.lua` |
| Backrooms | flat | rooms | `backrooms_director.lua` |
| Endless race | flat | track | `endless_race_director.lua` |

---

## Lua API ( `caffeine.procedural` )

```lua
-- Noise / coords
caffeine.procedural.hash(x, z, seed, salt)
caffeine.procedural.noise2d(x, z, seed)
caffeine.procedural.fbm2d(x, z, seed, octaves, lacunarity, persistence)
caffeine.procedural.worldToChunk(worldCoord, chunkSize)

-- Streaming
local focus = caffeine.procedural.getFocusChunk(directorId, chunkSize)
caffeine.procedural.stream(directorId, terrainId, focus.cx, focus.cz)
caffeine.procedural.isChunkLoaded(directorId, cx, cz)
caffeine.procedural.unloadChunk(directorId, cx, cz)

-- Terrain bake
caffeine.procedural.fillTerrainNoise(terrainId, seed, amplitude)
caffeine.procedural.generateTerrainChunk(terrainId, cx, cz, seed, "hills")

-- Structures
caffeine.procedural.spawnCube(directorId, cx, cz, x, y, z, sx, sy, sz)
```

---

## Director script (template)

```lua
local state = { chunkSize = 64 }

function onCreate(directorId)
  state.id = directorId
  state.terrain = caffeine.procedural.findTerrain()
end

function onUpdate(directorId, dt)
  local f = caffeine.procedural.getFocusChunk(state.id, state.chunkSize)
  caffeine.procedural.stream(state.id, state.terrain, f.cx, f.cz)
end
```

---

## ECS components

`ProceduralWorldComponent` on the director entity:

| Field | Function |
|-------|----------|
| `terrainProfile` | `flat`, `hills`, `fbm` |
| `structureProfile` | `none`, `markers`, `rooms`, `track` |
| `customScriptPath` | Lua director |
| `seed`, `chunkSize`, `viewRadius` | Streaming |
| `terrainEntityId`, `focusEntityId` | Bindings to the terrain and the follow target |
| `ProceduralSpawnTag` | Marks entities removed on unload |

---

## Services (SdK Plugin)

| Service | Uso |
|---------|-----|
| `procedural.installScripts` | Copia templates Lua |
| `procedural.createStreamingSetup` | Cria cena com ferramentas escolhidas |
| `procedural.loadBenchmark` | Load reference benchmark |

---

## Core (engine)

| Module | Ficheiro |
|--------|----------|
| Profiles | `src/caffeine/procedural/ProceduralProfiles.hpp` |
| Noise | `src/caffeine/procedural/ProceduralNoise.hpp` |
| Geradores | `src/caffeine/procedural/ProceduralGenerator.hpp` |
| Streaming | `src/caffeine/procedural/ProceduralStreamer.hpp` |
| Tick play mode | `src/caffeine/procedural/ProceduralWorldSystem.hpp` |
