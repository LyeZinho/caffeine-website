# API do motor sem editor: criar cenas e renderizar imagens

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Última atualização: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Automatize o motor através da C ABI: construa cenas, adicione componentes, escreva materiais, gere terreno e água, e renderize imagens RGBA offscreen sem janela.</p>

Tudo o que o Doppio faz ao motor passa por uma única C ABI, `libcaffeine-capi`
(`include/caffeine/capi/EngineAPI.h`, `CAFFEINE_CAPI_VERSION` 8). O que o editor faz, um script
também faz: criar entidades, adicionar componentes, escrever materiais, gerar terreno e água, mover a
câmara e **renderizar a cena para pixéis RGBA, fora do ecrã, sem janela**. Esta página serve para
automatizar isso: cenas de teste, imagens geradas, miniaturas, imagens de regressão, renders em lote.

## A forma da API

| Ideia | O que significa |
|---|---|
| **Sessão** | `caffeine_session_create()` cria uma cena (o seu próprio mundo ECS). Tudo o resto recebe a sessão. Destrói-se com `caffeine_session_destroy`. |
| **Entidades** | ids `uint32_t`. `caffeine_session_create_entity(session, nome)` devolve `CAFFEINE_ENTITY_NONE` se falhar. A transformação é posição, rotação (graus de Euler) e escala. Hierarquia com `caffeine_session_set_entity_parent`. |
| **Componentes por nome** | Os componentes são descritos em execução. Lista-os com `caffeine_component_type_count/at` e os campos com `caffeine_component_type_field_at`; adiciona com `caffeine_session_add_component(session, entidade, type_id)` e define um campo com `caffeine_session_entity_component_field_set`. Tipos de campo: f32, bool, i32, u32, vec2/3/4, texto, enum (pelo índice da opção), cor. É a mesma reflexão do Inspector, por isso um componente novo aparece aqui sem mudar a API. |
| **Ativos** | `caffeine_session_set_asset_root(session, pasta)` define a pasta do projeto. Os caminhos nos componentes são relativos a ela (`nature/materials/oak.mat`). `caffeine_session_asset_project_path` e `caffeine_session_resolve_path` convertem entre formas. |
| **Materiais** | Ficheiros `.mat`. `caffeine_material_default/load/save` editam-nos; `caffeine_session_apply_material(session, entidade, caminho)` atribui um. Um material é um ativo, nunca parte de uma malha. |
| **Resultados** | Todas as chamadas devolvem `CaffeineResult`: `OK`, `ERROR`, `INVALID_ARGUMENT`, `NOT_FOUND`. Verifica-o. |
| **Versão** | `caffeine_capi_version()` diz o que a biblioteca carregada suporta. O terreno precisa de 8, a água de 7. |

## Renderizar uma imagem (o ciclo completo)

```text
criar sessão -> pasta de ativos -> criar entidades + componentes -> atribuir materiais
-> câmara -> (opcional) definições da viewport -> render -> escrever PNG
```

`caffeine_session_render(session, largura, altura, pixels, pixel_bytes)` preenche `largura * altura * 4`
bytes RGBA8 e bloqueia até terminar. Para uso interativo, `caffeine_session_render_begin` e depois
`caffeine_session_render_poll` até `CAFFEINE_RENDER_READY` não bloqueia. Chama
`caffeine_session_tick(session, dt)` entre renders quando algo anima (água, partículas).

A câmara é orbital (`CaffeineCamera`): `yaw` e `pitch` em **radianos**, `distance` em metros, `focus` o
ponto para onde olha. `CaffeineViewportSettings` tem `show_grid` (**ligado por defeito**: desliga-o para
uma imagem limpa), `anti_aliasing` (0 desligado, 1 FXAA, 2 TAA) e `render_scale` (0,5 a 2,0, supersampling).

### Exemplo executável (Rust)

`doppio/crates/engine/examples/render_scene.rs` cria um chão, um cubo, uma esfera e um sol, escreve três
`.mat`, atribui-os, aponta a câmara e grava um PNG:

```bash
cmake --build build --target caffeine-capi -j
cd doppio
cargo run -p doppio-engine --example render_scene -- /tmp/scene.png
```

O crate `doppio-engine` é um invólucro seguro fino das funções C; é o único crate Rust que carrega a
biblioteca, e `CAFFEINE_CAPI_LIB` muda onde ela procura.

### Em Python (sem compilar)

```python
import ctypes as C
lib = C.CDLL("build/libcaffeine-capi.so")          # .dylib / .dll noutros sistemas
lib.caffeine_session_create.restype = C.c_void_p
lib.caffeine_session_create_entity.restype = C.c_uint32
lib.caffeine_session_create_entity.argtypes = [C.c_void_p, C.c_char_p]
lib.caffeine_session_render.argtypes = [C.c_void_p, C.c_uint32, C.c_uint32, C.c_void_p, C.c_size_t]

session = lib.caffeine_session_create()
lib.caffeine_session_create_entity(session, b"Thing")
w, h = 640, 360
pixels = (C.c_uint8 * (w * h * 4))()
assert lib.caffeine_session_render(session, w, h, pixels, len(pixels)) == 0
# bytes(pixels) é RGBA8; passa-o ao Pillow / numpy / imageio
```

Qualquer linguagem com FFI para C funciona igual: declara as funções que usas e passa estruturas simples.

## Gerar conteúdo e renderizá-lo

* **Terreno.** `caffeine_session_set_terrain(session, entidade, &CaffeineTerrain, heights, splat_rgba)` recebe
  uma grelha de alturas normalizada (0..1) e pesos de splat opcionais (relva, rocha, terra, lama). As quatro
  camadas são os campos de texto `Splat Layer Paths 1..4` do componente: aponta-os a texturas do projeto
  (o gerador de terreno escreve `terrain/layers/<camada>.png` mais um `.mat` por camada e preenche os caminhos
  com o mapa de albedo de cada material). `caffeine_session_terrain_height` amostra-o.
* **Água.** `caffeine_session_set_water(session, entidade, &water)` cria uma superfície animada; atribui um
  `.mat` à entidade e a água é desenhada com ele. `caffeine_session_water_height` amostra a superfície no tempo,
  por isso faz tick antes de amostrar.
* **Natureza e malhas.** Escreve `.obj` no projeto e põe o `Mesh Filter` em `Custom` com o caminho em `Mesh`
  (é o que *Place in scene* faz com árvores e rochas).
* **Cenas.** `caffeine_session_save_scene` / `load_scene` leem e escrevem `.caf`, por isso uma cena gerada
  reabre no Doppio ou carrega no runtime. `snapshot` / `restore` dão pontos de desfazer baratos.

## Texturas e pré-visualizações de material sem cena

`caffeine_texture_generate_map`, `caffeine_texture_pack_maps` (ORM e empacotamentos do motor),
`caffeine_texture_save_rgba/rgba16` e `caffeine_texture_load_rgba` trabalham diretamente em imagens.
`caffeine_session_render_material_preview(_ex)` renderiza uma esfera, cubo ou plano iluminado para um `.mat`
sem montar cena, que é como se fazem miniaturas e a galeria de materiais (`scripts/render-material-gallery.sh`).

## Notas práticas

* O render usa um dispositivo SDL GPU e desenha fora do ecrã: as chamadas não abrem janela. Foi verificado num desktop Linux com GPU; uma máquina sem GPU não foi testada.
* Usa uma sessão numa só thread de cada vez; a API não promete acesso concorrente a uma sessão.
* Para imagens de regressão compara com tolerância: o resultado pode variar ligeiramente entre GPUs e drivers.
* Os ativos são referenciados por caminho: define primeiro a pasta de ativos e prefere caminhos relativos para
  a cena acompanhar o projeto.
* Os geradores do Doppio só chamam esta API, por isso tudo o que colocam pode ser reproduzido por um script.
