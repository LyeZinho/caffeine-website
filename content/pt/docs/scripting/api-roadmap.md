# API de scripting: paridade e roadmap

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Última atualização: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/script"><code>src/caffeine/script</code></a></span>
</div>

<p class="doc-lede">Uma superfície de scripting, duas linguagens: o que Lua e Dryad fazem hoje, o que foi adicionado
nesta passagem e o plano ordenado para crescer a API sem deixar as duas divergir.</p>

## 1. Regras de desenho

1. **Um nome, um significado.** Cada capacidade existe nas duas linguagens com nomes paralelos:
   Lua `caffeine.<área>.<verbo>`, Dryad `caffeine_<área>_<verbo>`. As tabelas de nomes (teclas, eixos e ações)
   são C++ partilhado (`ScriptInputNames.hpp`), por isso ambas aceitam as mesmas strings.
2. **Bindings finos.** A lógica vive nos módulos do engine; um binding valida argumentos, chama-a e regista
   erros. Os natives nunca falham com um id inválido, sem mundo ou com um nome desconhecido.
3. **Reflexão primeiro.** Os dados de componentes passam por `caffeine.component` / `caffeine_component_*`,
   guiados pelo registo de reflexão, por isso novos componentes ficam scriptáveis sem novos bindings.
4. **As mensagens continuam o único caminho de mutação do editor.** Os scripts atuam no mundo de jogo, não no estado do editor.
5. **Uma funcionalidade está pronta quando tem teste nas duas linguagens** (`tests/test_script.cpp`, `tests/test_dryad_host.cpp`).

## 2. Matriz de paridade

| Área | Lua | Dryad |
|---|---|---|
| Lifecycle `onCreate`, `onUpdate`, `onFixedUpdate` | sim | yes |
| `onDestroy`, `onCollision`, `onPostProcess` | sim | **não** |
| Position and scale | sim | sim (`caffeine_get/set_position`, scale, `translate`) |
| Generic components (reflection) | sim | yes |
| Time (`delta`, `time`, `fixedDelta`, scale, pause, frame) | sim | **novo** (`caffeine_time_*`) |
| Input (keys, axes, actions, mouse) | sim | **novo** (`caffeine_input_*`) |
| World create, destroy, alive, distance | parcial | **novo** (`caffeine_world_*`) |
| Math: 2D and 3D vectors, scalar helpers | **new 3D** | Dryad stdlib |
| Events, UI, draw2d, picking, assets, native modules | sim | não |
| Post-process, animation, effects, navigation | sim | não |

## 3. Adicionado nesta passagem

### Natives do Dryad

| Native | Devolve |
|---|---|
| `caffeine_time_delta()`, `_unscaled_delta()`, `_total()`, `_fixed_delta()`, `_scale()`, `_frame()` | segundos / escala / número do frame |
| `caffeine_time_set_scale(s)`, `caffeine_time_paused()`, `caffeine_time_set_paused(b)` | controlo do tempo |
| `caffeine_input_key_down(name)` | bool |
| `caffeine_input_axis(name)` | -1..1 (`Horizontal`, `Vertical`, `LookX`, `LookY`) |
| `caffeine_input_action_down(name)`, `_action_pressed(name)` | bool (premida, acabou de premir) |
| `caffeine_input_mouse_x()`, `_y()`, `_dx()`, `_dy()`, `_mouse_down(button)` | posição, delta, 1/2/3 |
| `caffeine_world_create([name])`, `_destroy(e)`, `_is_alive(e)`, `_distance(a, b)` | id, nada, bool, metros (1e9 se desconhecido) |

### Lua math (`caffeine.math`)

`vec2`, `vec3`, `add`, `sub`, `mul`, `scale`, `dot`, `cross`, `length`, `lengthSquared`, `distance`,
`normalize`, `lerpVec`, `clamp`, `clamp01`, `lerp`, `inverseLerp`, `remap`, `smoothstep`, `approach`, `sign`,
`radians`, `degrees`, `pi`, `epsilon`. As funções de vetor aceitam `{x, y}` ou `{x, y, z}`; o resultado só tem `z`
quando um operando o tem, por isso os scripts 2D existentes não mudam.

## 3b. O componente Script

O `ScriptComponent` já não é só um caminho. Campos (todos no Inspector por reflexão e guardados na cena;
cenas antigas carregam com os valores por omissão):

| Campo | Omissão | Significado |
|---|---|---|
| `Script` | vazio | caminho `.lua` ou `.dyd`, relativo ao projeto |
| `Enabled` | ligado | um script desativado é ignorado por completo: sem `onCreate`, sem updates |
| `Order` | 0 | o menor corre primeiro no frame; empates mantêm a ordem das entidades (estável) |
| `Properties` | vazio | overrides por entidade das variáveis expostas do script, ex.: `speed=4.5; god=true; label=hi` (Lua e Dryad) |
| `Isolated` | desligado | Lua: esta entidade corre a sua própria cópia do script, com globais privadas |

As entradas de `Properties` separam-se com `;` ou nova linha. O valor é booleano para `true`/`false`, número
quando converte por inteiro e texto caso contrário; entradas malformadas são ignoradas. São aplicadas
antes de cada hook dessa entidade. Limites: sem `Isolated`, o estado Lua é partilhado por ficheiro, por isso
os overrides definem entradas, não dão globais privadas; o estado Dryad é sempre partilhado por ficheiro. As cópias
isoladas ainda não são libertadas quando a entidade é destruída.

### Agrupar scripts

Os scripts classificam-se em grupos e subgrupos, de duas formas (`ScriptCatalog.hpp`):

1. **Etiquetas no cabeçalho**, nas primeiras 40 linhas, após `--`, `//` ou `#`:
   `@group Gameplay/Combat/Melee`, `@name Sword swing`, `@description ...`, `@tags weapon, player`.
2. **Pastas**: sem `@group`, `scripts/Gameplay/AI/patrol.lua` fica no grupo `Gameplay/AI`.

`scanScripts(projectRoot)` lê todos os `.lua` e `.dyd` em `scripts/`; `buildScriptTree` devolve uma árvore
ordenada (`find("Gameplay/Combat")`, `totalScripts()`), com os soltos em **Ungrouped**. Ainda não está ligado ao
painel Assets nem ao seletor de componentes; ver o roadmap.

## 3c. Cobertura: o que o engine tem e os scripts não alcançam

O registo documenta agora todos os bindings (**210 funções, 26 namespaces**, ver a
[Referência da API](api/index.md)). Comparada com os módulos do engine, a superfície scriptável ainda não tem:

| Módulo do engine | Scripts hoje | Em falta |
|---|---|---|
| Física 3D (`PhysicsWorld3D`) | `caffeine.physics3d`: raycast, forças, impulso, velocidade, gravidade | consultas de overlap e callbacks de colisão/trigger. O runtime passa a correr o `PhysicsSystem3D` (antes não corria) |
| Áudio (`AudioSystem`) | nenhum | play, stop, volume, emissores 3D |
| Cenas (`SceneManager`) | nenhum | carregar, recarregar, carregar aditivo |
| Câmara e luzes | componentes via `caffeine.component` | helpers: `screenToRay`, `worldToScreen`, look-at |
| Terreno, água, fluidos | só componentes | consultas de altura, `water_height`, pintura de splat |
| Prefabs | nenhum | instanciar com overrides |
| Assets | só texto | carregar texturas, malhas, materiais; hooks de hot reload |
| Photon e render features | forward-render e post-process | qualidade do Photon, controlos de reflexos e probes |
| Corrotinas e temporizadores | nenhum | `after`, `every`, `wait` |
| Dados de save, JSON, utilitários de texto | nenhum | armazenamento persistente, parsing |

Acrescentado até agora: `caffeine.entity` (nomes, procura), `caffeine.hierarchy` (pai, filhos, raiz, sem ciclos),
`caffeine.random` (determinístico), cada um em Lua e Dryad a partir de uma implementação partilhada.

## 4. Roadmap

Cada passo chega com testes nas duas linguagens e uma página nesta secção.

### Fase S1 — Fechar as lacunas de paridade

- [ ] `onDestroy`, `onCollision(entity, other)` e `onPostProcess` no Dryad; despacho a partir do `ScriptSystem`.
- [ ] Eventos no Dryad: `caffeine_events_emit/on/off` sobre o `EventBus`.
- [ ] `caffeine.world.hasComponent` do Lua via registo de reflexão (hoje só conhece quatro nomes).
- [x] Procura por nome e hierarquia (`caffeine.entity`, `caffeine.hierarchy`); falta `findWith(component)`.
- [ ] Prefabs: `instantiate(prefab, position)`, `destroyAfter(entity, seconds)`.

### Fase S2 — Estrutura e ergonomia

- [ ] Objeto de entidade no Lua (`local e = caffeine.entity(id)`, `e:position()`, `e:get("Light")`) sobre os
      mesmos natives, mais userdata `Vec3` e `Quat` com operadores, em vez de tabelas simples.
- [ ] Temporizadores e corrotinas: `caffeine.timer.after/every/cancel`, `caffeine.wait(seconds)` num
      agendador de corrotinas movido pelo `ScriptSystem`; o equivalente Dryad como natives.
- [x] Overrides por entidade das variáveis expostas (`Properties`), só Lua; falta o Dryad.
- [ ] Sistema de módulos para o Dryad (`import`) resolvido a partir da raiz do projeto, como o `caffeine.require`.
- [ ] Relatório de erros: nome do script, linha e uma entrada na Consola por cada falha, nunca um no-op silencioso.

### Fase S3 — Superfície de gameplay 3D

- [ ] Física 3D: `raycast`, `overlapSphere`, `addForce`, `setVelocity`, callbacks de colisão e trigger.
- [ ] Câmara e picking em 3D: `screenToRay`, `worldToScreen`, `pick3d`.
- [ ] Áudio: `play`, `stop`, `setVolume`, fontes 3D.
- [ ] Paridade de animação, navegação e efeitos no Dryad.
- [ ] Controlo de cenas: `loadScene`, `reloadScene`, valores persistentes entre cenas.

### Fase S4 — Ferramentas

- [x] Referência da API gerada a partir de um registo (`src/caffeine/script/api/*.json`), verificado por um teste;
      faltam o autocompletar no editor e a matriz de paridade gerada.
- [ ] Limites de sandbox: orçamento de instruções por frame, limite de memória, watchdog de scripts presos.
- [ ] Hot reload que mantém o estado do script onde as variáveis expostas o permitem.
- [ ] Depuração: breakpoints e vista de variáveis no editor de scripts (Lua primeiro).
- [ ] Mostrar a árvore de grupos de scripts no painel Assets e no seletor Add Component; filtro por grupo e pesquisa por etiqueta.
