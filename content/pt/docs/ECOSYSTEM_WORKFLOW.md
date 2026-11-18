# Fluxo unificado de assets

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Tooling</span>
  <span>Verificado em: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Fonte: <a href="https://github.com/devscafecommunity/caf-pack"><code>caf-pack</code></a></span>
</div>

<p class="doc-lede">De ficheiros PNG, WAV e OBJ brutos a um <code>.cap</code> que a
engine mapeia em memória: um pipeline partilhado pelo Doppio, caf-pack, runtime e CI.</p>

## Pipeline

```text
assets brutos ──► caf-pack ──► .caf / .cap ──► AssetManager ──► renderer / áudio / física
(PNG WAV OBJ)     (processa)    (binário)        (async, hot reload)
```

| Etapa | Ferramenta | Saída |
|---|---|---|
| Autor | Qualquer ferramenta de imagem, áudio ou DCC | `assets/raw/**` |
| Empacotar | `caf-pack --input <dir> --output <file.cap>` | Payloads `.caf` dentro de um `.cap` |
| Carregar | `Caffeine::Assets::AssetManager` | Handles tipados (`Texture`, `AudioClip`, `Mesh`, `Prefab`, `ShaderBlob`) |
| Usar | Renderer, áudio, física, scripting | Structs resolvidas |

## 1. Assets brutos

Mantenha os ficheiros-fonte na raiz de assets do projeto, normalmente `assets/raw/`:

```text
assets/raw/
  Textures/brick.png
  Audio/step.wav
  Models/crate.obj
  Materials/brick.mat
```

O Doppio cria as pastas padrão (`Textures`, `Models`, `Materials`, `Audio`,
`Animations`, `Prefabs`, `Sky`) através do assistente de assets.

## 2. Empacotar com caf-pack

```bash
caf-pack --input assets/raw --output build/game.cap --gen-ids build/game_assets.hpp
```

A CLI:

1. varre o diretório de entrada recursivamente;
2. converte PNG em RGBA/CAF, WAV em PCM/CAF e OBJ em mesh/CAF intercalada;
3. alinha cada payload a 32 bytes;
4. escreve o header CAP, a tabela de assets (hash, offset, size) e os blobs;
5. opcionalmente gera um header C++ com ids de hash estáveis.

`--compress` ativa compressão opcional (`zstd` é ligado pelo packer). Veja o
[README do caf-pack](https://github.com/devscafecommunity/caf-pack/blob/main/README.md)
para os formatos e a lista atual de processors.

No Doppio, o separador **Assets → Pack** corre a mesma CLI e escreve o `.cap` no
projeto. O binário é descoberto por `CAF_PACK`, `CAFFEINE_ENGINE_ROOT`,
`caf-pack/build/src` ou `PATH`.

## 3. Carregar na engine

`AssetManager` detém a cache e os jobs assíncronos:

```cpp
#include "assets/AssetManager.hpp"

Caffeine::Threading::JobSystem jobs;
Caffeine::Assets::AssetManager assets(&jobs, "assets/raw", 256);

auto texture = assets.loadAsync<Caffeine::Assets::Texture>("Textures/brick.caf");
auto mesh    = assets.loadAsync<Caffeine::Assets::Mesh>("Models/crate.caf");

// a cada frame
assets.tick(frameIndex);

if (texture.isReady()) {
    const auto* data = texture.get();
    // fazer upload ou bind dos dados
}

assets.collectGarbage();
```

Pontos-chave:

- `loadAsync<T>` / `loadSync<T>` devolvem um `AssetHandle<T>` com contador de geração.
- `tick()` processa jobs concluídos e verifica hot reload.
- `collectGarbage()` remove entradas LRU quando a cache excede o orçamento
  (`maxCacheMB`).
- `reloadAsset(path)` recarrega um asset já carregado do disco.
- `registerInvalidationCallback` notifica sistemas quando um asset muda.

O handle é invalidado se a entrada for removida ou recarregada; verifique `isValid()` /
`isReady()` antes de desreferenciar.

## Layout do projeto

```text
my_game/
  project.caffeine
  assets/raw/          # assets-fonte
  assets/processed/    # .caf individuais opcionais
  build/game.cap       # pack final
  build/game_assets.hpp
  scenes/
  materials/
  texture_sets/
```

## Runtime e Doppio

- O Doppio pré-visualiza assets brutos e empacota-os; não faz parsing de `.cap` em Rust.
- O `AssetManager` da engine carrega `.caf`/`.cap`; a C ABI expõe os mesmos metadados e
  caminhos de assets ao editor.
- O runtime usa o mesmo `AssetManager` e layout de projeto, por isso uma cena guardada
  no Doppio aponta para os mesmos caminhos relativos.

## Páginas relacionadas

- [Formato CAF](assets/caf-format.md)
- [Asset manager](assets/asset-manager.md)
- [Pipeline de assets](assets/asset-pipeline.md)
- [Arquitetura Cafpack](architecture/cafpack.md)
- [README do caf-pack](https://github.com/devscafecommunity/caf-pack/blob/main/README.md)
