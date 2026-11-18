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

## 4. Roadmap

Cada passo chega com testes nas duas linguagens e uma página nesta secção.

### Fase S1 — Fechar as lacunas de paridade

- [ ] `onDestroy`, `onCollision(entity, other)` e `onPostProcess` no Dryad; despacho a partir do `ScriptSystem`.
- [ ] Eventos no Dryad: `caffeine_events_emit/on/off` sobre o `EventBus`.
- [ ] `caffeine.world.hasComponent` do Lua via registo de reflexão (hoje só conhece quatro nomes).
- [ ] Procura de entidades: `find(name)`, `findAll(name)`, `findWith(component)`, `parent`, `children`.
- [ ] Prefabs: `instantiate(prefab, position)`, `destroyAfter(entity, seconds)`.

### Fase S2 — Estrutura e ergonomia

- [ ] Objeto de entidade no Lua (`local e = caffeine.entity(id)`, `e:position()`, `e:get("Light")`) sobre os
      mesmos natives, mais userdata `Vec3` e `Quat` com operadores, em vez de tabelas simples.
- [ ] Temporizadores e corrotinas: `caffeine.timer.after/every/cancel`, `caffeine.wait(seconds)` num
      agendador de corrotinas movido pelo `ScriptSystem`; o equivalente Dryad como natives.
- [ ] Variáveis expostas por script, editadas no Inspector, nas duas linguagens (o Lua tem `listExposedVars`).
- [ ] Sistema de módulos para o Dryad (`import`) resolvido a partir da raiz do projeto, como o `caffeine.require`.
- [ ] Relatório de erros: nome do script, linha e uma entrada na Consola por cada falha, nunca um no-op silencioso.

### Fase S3 — Superfície de gameplay 3D

- [ ] Física 3D: `raycast`, `overlapSphere`, `addForce`, `setVelocity`, callbacks de colisão e trigger.
- [ ] Câmara e picking em 3D: `screenToRay`, `worldToScreen`, `pick3d`.
- [ ] Áudio: `play`, `stop`, `setVolume`, fontes 3D.
- [ ] Paridade de animação, navegação e efeitos no Dryad.
- [ ] Controlo de cenas: `loadScene`, `reloadScene`, valores persistentes entre cenas.

### Fase S4 — Ferramentas

- [ ] Referência da API gerada a partir de uma tabela de bindings (nomes, assinaturas, docs) para as duas linguagens e
      autocompletar no editor; a matriz de paridade acima é gerada a partir dela.
- [ ] Limites de sandbox: orçamento de instruções por frame, limite de memória, watchdog de scripts presos.
- [ ] Hot reload que mantém o estado do script onde as variáveis expostas o permitem.
- [ ] Depuração: breakpoints e vista de variáveis no editor de scripts (Lua primeiro).
