# Terrain Generator Plugin

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Plugin</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/doppio-plugins/plugins/terrain-generator/src/main.cpp"><code>doppio-plugins/plugins/terrain-generator</code></a></span>
</div>

<div class="doc-callout doc-callout--note">
  <p><strong>Caminho atual.</strong> O Doppio Rust tem um separador <strong>Terrain</strong>
  nativo (C ABI v8). Esta página documenta o <code>terrain_plugin</code> legado para o host C++/ImGui.</p>
</div>

<p class="doc-lede">O plugin do editor que corre o algoritmo Node.js de terreno e importa o
heightmap resultante para um <code>TerrainComponent</code>; a escultura e a pintura ficam no
engine.</p>

> **Tipo:** plugin do editor (`terrain_plugin.so`)
> **Algoritmo:** `assets/general-ultra-realistic-terrain-algorithm`
> **Serviços:** `terrain.generateUltra`, `terrain.importHeightmap`

---

## Visão Geral

O plugin **Terrain Generator** move a geração procedural para fora do core. Usa o pipeline
Node.js com **domain warping** e **PDEs geomorfológicas** (versão mais completa que o gerador
C++ antigo removido do engine).

**Fluxo:**

1. O utilizador selecciona uma entidade com `TerrainComponent`.
2. Painel **Terrain Generator** → preset + world size + grid + seed.
3. O plugin executa `node caffeine-export.js` no diretório do algoritmo.
4. `heightmap.txt` + `meta.json` são importados via `TerrainHeightmapImporter`.
5. `TerrainCache` reconstrói a mesh de render, o LOD e a mesh de colisão.

---

> **A edição é nativa.** O painel **Terrain Editor** (escultura, splat paint, undo e I/O
> `.cterrain`) faz parte do core da Caffeine. Este plugin apenas gera terreno proceduralmente e
> importa heightmaps; registra um painel de gerador, não o editor de terreno.

## Presets

| Preset | Descrição |
|--------|-----------|
| `default` | Erosão + tectónica equilibrada |
| `alpine` | Tectónica + gelo |
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

O `meta.json` inclui `minHeight`, `maxHeight`, `worldSize` e `gridSize` para o importador.

---

## Host API (plugins)

O plugin registra dois serviços nomeados com `PluginHostApi::registerService`; os chamadores usam
`invokeService` com os structs de pedido de
`include/caffeine/plugin/PluginServices.hpp`:

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

`terrain.generateUltra` e `terrain.importHeightmap` devolvem um `bool` através do handler do
serviço; ambos correm sobre o mundo activo (`PluginActiveWorld`) e marcam a cena como dirty.

---

## Desenvolvimento

| Ficheiro | Descrição |
|----------|-----------|
| `doppio-plugins/plugins/terrain-generator/src/main.cpp` | Painel ImGui do plugin |
| `doppio-plugins/plugins/terrain-generator/src/TerrainBridge.cpp` | Lança o Node + importa (fora do core do Doppio) |
| `doppio-plugins/plugins/terrain-generator/src/TerrainPluginServices.cpp` | Handlers dos serviços |
| `src/caffeine/terrain/TerrainHeightmapImporter.cpp` | Parse `.txt` → heightmap |

Build: o `terrain_plugin` é construído a partir de `doppio-plugins`, instalado numa pasta
`plugins/` e activado no Plugin Manager.

---

## Migração do core antigo

Removido do `caffeine-core`:

- O gerador procedural antigo dentro de `src/caffeine/terrain/` (`TerrainGenerator`, noise,
  hidrologia, simulação geológica) — o código de mesh, cache, sculpt, paint e `.cterrain`
  permanece
- A geração procedural saiu do Terrain Editor nativo; sculpt/paint continua no core
- O campo `TerrainComponent::generation`

Cenas antigas com blob v2–v8 ainda carregam; os parâmetros de geração são ignorados. Regenera o
terreno com o plugin se for necessário.
