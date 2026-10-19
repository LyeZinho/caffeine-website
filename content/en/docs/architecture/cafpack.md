# Cafpack — Unified Asset Layer

> **Namespace:** `CafPack` 
> ** Repository:** [`caf-pack/`](../../caf-pack/) (submodule)
> **Status:** 

---

## View

The **Cafpack** is the driver wire of the Caffeine Studio ecosystem (Adobe Creative Suite style):

- `Convoy (arte) ──┐`
- `WaveShaper (áudio) ──┼──► Cafpack ──► .caf / .cap ──► Doppio / Runtime`
- `Ferramentas futuras──┘ ▲`
- `única fonte de verdade para leitura/escrita de dados`


* * Central rule:** Every new type of asset (mesh, texture, audio, animation, scene, prefab...) is defined first in Cafpack**. No app invents internal format — it only consumes the API.

---

## Contract by application

| App | Responsabilidade | API Cafpack |
|-----|------------------|-------------|
| **Convoy** | Editar texturas/meshes | Export → `.caf` ou append a `.cap` |
| **WaveShaper** | Edit Audio | Export → `.caf Audio` |
| **Doppio** | IDE / preview / pack projeto | `Packer` , `Reader` , `HeaderGenerator` |
| **Runtime** | Carregar jogo | `Reader::loadCap` (zero parsing) |
| **caf-pack CLI** | CI / batch | `caf-pack --input raw --output game.cap` |

---

## Estrutura da biblioteca ( `caf-pack-lib` )

- `caf-pack/`
  - `include/`
    - `caffeine/CafTypes.hpp ← fonte de verdade (.caf + .cap)`
    - `cafpack/Types.hpp ← alias público`
    - `caf-pack/`
    - `Reader.hpp ← ler .caf / .cap`
    - `Registry.hpp ← registo de processors`
    - `Packer.hpp ← agregar → .cap`
    - `HeaderGenerator.hpp ← IDs hash para C++`
    - `*Processor.hpp ← PNG, WAV, OBJ → .caf`
  - `src/`


### Adicionar um novo tipo de asset

1. Adicionar valor em `CafAssetType` ( `include/caffeine/CafTypes.hpp` )
2. Definir struct de metadata no mesmo ficheiro
3. Implementar `AssetProcessor` em `src/MyProcessor.cpp`
4. Registar em `makeDefaultRegistry()` ( `Registry.cpp` )
5. Consumir em Doppio/Runtime via `Reader` — **No bypass**

---

## Formatos

| Extension | Description | Magic |
|----------|-----------|-------|
| `.caf` | Asset individual binary | `0x43414621` ("CAF!") |
| `.cap` | Pack de assets (mmap) | `0x4341502F` ("CAP/") |

Detailed package documentation: [`caf-pack/README.md`](../../caf-pack/README.md).

### Two CAF heads (migration)

| Header | Magic | Uso |
|--------|-------|-----|
| `caf-pack/include/caffeine/CafTypes.hpp` | `CAF!` | Assets importados + `.cap` |
| `src/core/io/CafTypes.hpp` | `0xCAFECAFE` | Scene/Prefab engine-internal (legado) |

**Phase 2** unifies in a single schema; until then, runtime assets always use caf-pack.

---

## Pipeline de projeto

- `my_game/`
  - `raw_assets/ ← PNG, WAV, OBJ (fonte)`
  - `processed/ ← opcional: .caf individuais`
  - `game.cap ← pack final (mmap no runtime)`
  - `game_assets.hpp ← IDs hash gerados pelo HeaderGenerator`


### Export manual (qualquer ferramenta)

```bash
./scripts/export-to-cap.sh raw_assets/ game.cap include/game_assets.hpp
```

Convoy e WaveShaper devem invocar o mesmo script ou linkar `caf-pack-lib` directamente.

---

## CMake Integration (monorepo)

```bash
git submodule update --init --recursive caf-pack Convoy WaveShaper
cmake -B build -DCAFFEINE_BUILD_CONVOY=ON -DCAFFEINE_BUILD_WAVESHAPER=ON
cmake --build build
```

| Target | Origem |
|--------|--------|
| `caf-pack-lib` | Submodule caf-pack |
| `caf-pack` | CLI |
| `doppio` | IDE (liga `caf-pack-lib` , `CF_HAS_CAF_PACK=1` ) |
| `convoy` | Submodule Convoy |
| `waveshaper` | Submodule WaveShaper |

Desligar ferramentas: `-DCAFFEINE_BUILD_CONVOY=OFF` / `WAVESHAPER=OFF` .

---

## Migration phases

| Phase | Delivery | Estado |
|------|------------|--------|
| **0** | Submodule caf-pack populado + `.gitmodules` | ✅ |
| **1** | `Reader` , `Registry` , CapLoader via Reader | ✅ |
| **2** | Unificar `CafTypes` engine ↔ caf-pack | 📅 |
| **3** | MeshLoader/AssetManager sem bypass PNG/OBJ | 📅 |
| **4** | Convoy/WaveShaper native export → Cafpack | 📅 |
| **5** | Deprecar `tools/caf-encode` | 📅 |

---

## Principles

1. * *One type, one site** — schema + processor + reader in the caf-pack
2. **No bypass** — engine loaders read `.caf` / `.cap` , not raw PNG in runtime
3. ** Unified project** — one `.cap` por jogo, partilhado por todas as apps
4. **Even CMake root** — suite compiles joint at the root of the monorepo

---

## See also

- [`ECOSYSTEM_WORKFLOW.md`](../ECOSYSTEM_WORKFLOW.md)
- [`assets/caf-format.md`](../assets/caf-format.md) — engine-internal format (legated)
- [`plans/2026-05-17-unified-ecosystem-build.md`](../plans/2026-05-17-unified-ecosystem-build.md)
