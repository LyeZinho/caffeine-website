# 🌋 Terrain Generator Plugin

> **Tipo:** plugin do editor (`terrain_plugin.so`)  
> **Algoritmo:** `assets/general-ultra-realistic-terrain-algorithm`  
> **Host API:** `PluginHostApi::terrainGenerateUltra`, `terrainImportHeightmap`

---

## Visão Geral

O plugin **Terrain Generator** move a geração procedural para fora do core. Usa o pipeline Node.js com **domain warping** e **PDEs geomorfológicas** (versão mais completa que o gerador C++ antigo removido do engine).

**Fluxo:**

1. Utilizador seleciona entidade com `TerrainComponent`.
2. Painel **Terrain Generator** → preset + world size + grid + seed.
3. Host executa `node caffeine-export.js` no diretório do algoritmo.
4. `heightmap.txt` + `meta.json` são importados via `TerrainHeightmapImporter`.
5. `TerrainCache` reconstrói mesh render, LOD e mesh de colisão.

---

## Presets

| Preset | Descrição |
|--------|-----------|
| `default` | Erosão + tectônica balanceada |
| `alpine` | Tectônica + gelo |
| `mesa` | Caprock + deslizamentos |
| `volcanic` | Cone + caldeira |
| `glacial` | Vales em U |
| `blend` | Mistura alpine ⊕ mesa |

---

## CLI de exportação (Caffeine)

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

`meta.json` inclui `minHeight`, `maxHeight`, `worldSize`, `gridSize` para o importador.

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

Implementação: `TerrainBridge` exposto via serviço `terrain.generateUltra` (`PluginServiceRegistry`).

---

## Desenvolvimento

| Ficheiro | Descrição |
|----------|-----------|
| `doppio-plugins/plugins/terrain-generator/src/main.cpp` | UI ImGui do plugin |
| `doppio-plugins/plugins/terrain-generator/src/TerrainBridge.cpp` | Spawn Node + import (no Doppio core) |
| `src/terrain/TerrainHeightmapImporter.cpp` | Parse `.txt` → heightmap |

Build: o `terrain_plugin` é compilado a partir de `doppio-plugins`, instalado num diretório `plugins/` e ativado no Plugin Manager.

---

## Migração do core antigo

Removido de `caffeine-core`:

- `src/terrain/generation/*` (TerrainGenerator, noise, hydrology, geo sim)
- Tab **Generate** do Terrain Editor (graph imnodes)
- Campo `TerrainComponent::generation`

Cenas antigas com blob v2–v8 ainda carregam; parâmetros de geração são ignorados. Re-gerar terreno com o plugin se necessário.
