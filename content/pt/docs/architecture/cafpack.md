# Cafpack — Camada Unificada de Assets

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `CafPack`</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Como o caf-pack transforma assets brutos em ficheiros .caf alinhados e packs .cap, e como a engine os consome.</p>

> **Repositório:** [caf-pack](https://github.com/devscafecommunity/caf-pack) (submodule)
> **Status:** 🟡 Fase 1 — biblioteca activa; migração de tipos em curso

---

## Visão

O **Cafpack** é o "fio condutor" do ecossistema Caffeine Studio (estilo Adobe Creative Suite):

- `Ferramentas de arte externas  ──┐`
- `Ferramentas de áudio externas ──┼──► Cafpack ──► .caf / .cap ──► Doppio / Runtime`
- `Doppio / CI ────────────────────┘         ▲`
- `única fonte de verdade para leitura/escrita de dados`


**Regra central:** todo novo tipo de asset (mesh, textura, áudio, animação, scene, prefab…) é definido **primeiro no Cafpack**. Nenhuma app inventa formato interno — só consome a API.

---

## Contrato por aplicação

| App | Responsabilidade | API Cafpack |
|-----|------------------|-------------|
| **Ferramentas de arte externas** | Editar texturas/meshes (opcional) | CLI `caf-pack` ou `caf-pack-lib` |
| **Ferramentas de áudio externas** | Editar áudio (opcional) | CLI `caf-pack` ou `caf-pack-lib` |
| **Doppio** | IDE / preview / pack projeto | `Packer`, `HeaderGenerator` e os processors |
| **Runtime** | Carregar jogo | `Packer` / asset manager (zero parsing) |
| **caf-pack CLI** | CI / batch | `caf-pack --input raw --output game.cap` |

---

## Estrutura da biblioteca (`caf-pack-lib`)

- `caf-pack/`
  - `include/`
    - `caffeine/CafTypes.hpp   ← fonte de verdade (.caf + .cap)`
    - `caf-pack/AssetProcessor.hpp ← interface base dos processors`
    - `caf-pack/`
    - `Packer.hpp          ← descobrir, processar e escrever .cap`
    - `TextureProcessor / AudioProcessor / MeshProcessor ← conversores`
    - `HeaderGenerator.hpp ← IDs hash para C++`
    - `*Processor.hpp      ← PNG, WAV, OBJ → .caf`
  - `caf-pack/src/`


### Adicionar um novo tipo de asset

1. Adicionar valor em `CafAssetType` (`include/caffeine/CafTypes.hpp`)
2. Definir struct de metadata no mesmo ficheiro
3. Implementar `AssetProcessor` em `caf-pack/src/TextureProcessor.cpp`
4. Registar em `Packer::registerProcessors()` (`caf-pack/src/Packer.cpp`)
5. Consumir no asset manager da engine — **sem bypass**

---

## Formatos

| Extensão | Descrição | Magic |
|----------|-----------|-------|
| `.caf` | Asset binário individual | `0x43414621` ("CAF!") |
| `.cap` | Pack de assets (mmap) | `0x4341502F` ("CAP/") |

Documentação detalhada do pack: [`caf-pack/README.md`](https://github.com/devscafecommunity/caf-pack/blob/main/README.md).

### Dois headers CAF (migração)

| Header | Magic | Uso |
|--------|-------|-----|
| `caf-pack/include/caffeine/CafTypes.hpp` | `CAF!` | Assets importados + `.cap` |
| `src/caffeine/core/io/CafTypes.hpp` | `0xCAFECAFE` | Scene/Prefab engine-internal (legado) |

**Fase 2** unifica num único schema; até lá, runtime assets usam sempre caf-pack.

---

## Pipeline de projeto

- `my_game/`
  - `raw_assets/          ← PNG, WAV, OBJ (fonte)`
  - `processed/           ← opcional: .caf individuais`
  - `game.cap             ← pack final (mmap no runtime)`
  - `game_assets.hpp      ← IDs hash gerados pelo HeaderGenerator`


### Export manual (qualquer ferramenta)

```bash
./scripts/export-to-cap.sh raw_assets/ game.cap include/game_assets.hpp
```

Ferramentas externas devem invocar o mesmo script ou ligar `caf-pack-lib` diretamente.

---

## Integração CMake (monorepo)

```bash
git submodule update --init caf-pack
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
```

| Target | Origem |
|--------|--------|
| `caf-pack-lib` | Submodule caf-pack |
| `caf-pack` | CLI |
| `doppio` | IDE (liga `caf-pack-lib`, `CF_HAS_CAF_PACK=1`) |

Convoy e WaveShaper já não são submódulos nem targets CMake neste repositório.

---

## Fases de migração

| Fase | Entregável | Estado |
|------|------------|--------|
| **0** | Submodule caf-pack populado + `.gitmodules` | ✅ |
| **1** | `Reader`, `Registry`, CapLoader via Reader | ✅ |
| **2** | Unificar `CafTypes` engine ↔ caf-pack | 📅 |
| **3** | MeshLoader/AssetManager sem bypass PNG/OBJ | 📅 |
| **4** | Export de ferramentas externas → Cafpack (opcional) | 📅 |
| **5** | Deprecar `tools/caf-encode` | 📅 |

---

## Princípios

1. **Um tipo, um sítio** — schema + processor + reader no caf-pack
2. **Sem bypass** — loaders da engine leem `.caf`/`.cap`, não PNG cru em runtime
3. **Projeto unificado** — um `.cap` por jogo, partilhado por todas as apps
4. **Repo único** — a engine compila Doppio e caf-pack; ferramentas externas ficam fora do monorepo

---

## Ver também

- [`ECOSYSTEM_WORKFLOW.md`](../ECOSYSTEM_WORKFLOW.md)
- [`assets/caf-format.md`](../assets/caf-format.md) — formato engine-internal (legado)
- [`plans/2026-05-17-unified-ecosystem-build.md`](../plans/2026-05-17-unified-ecosystem-build.md)
