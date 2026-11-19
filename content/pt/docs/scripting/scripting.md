# Scripting

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span class="doc-badge">Doppio</span>
  <span>Verificado em: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Fonte: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/script/ScriptEngine.hpp"><code>script/ScriptEngine.hpp</code></a></span>
</div>

<p class="doc-lede">A Caffeine faz scripting de gameplay em Lua 5.4 através de sol2,
corre lógica visual como scripts Dryad e mantém hooks C++/nativos para caminhos
quentes. Um único <code>ScriptSystem</code> conduz os quatro tipos em play mode.</p>

## O que está implementado

<table class="doc-table">
  <thead>
    <tr><th>Tipo</th><th>Componente</th><th>Fonte</th></tr>
  </thead>
  <tbody>
    <tr><td>Script Lua</td><td><code>ScriptComponent { scriptPath }</code></td><td>Ficheiro <code>.lua</code>, um ambiente por caminho</td></tr>
    <tr><td>Script Dryad</td><td><code>ScriptComponent</code> com um caminho <code>.dyd</code></td><td>Grafo compilado e hospedado por <code>DryadHost</code></td></tr>
    <tr><td>Script nativo</td><td><code>NativeScriptComponent</code></td><td>Callbacks C++ registados em runtime</td></tr>
    <tr><td>Classe C++</td><td><code>CppScriptComponent</code></td><td><code>CppScriptRegistry</code> / <code>CppScript</code></td></tr>
    <tr><td>Driver de post-process</td><td><code>PostProcessComponent</code> + script</td><td><code>onPostProcess(entityId, dt, api)</code>, com fallback para <code>onUpdate</code></td></tr>
  </tbody>
</table>

O build do motor ativa scripting com `CAFFEINE_ENABLE_SCRIPTING=ON` (o padrão). Lua 5.4
e sol2 são descarregados durante a configuração.

## Ciclo de vida

`ScriptSystem::onUpdate` corre uma vez por frame de play mode. Para cada entidade com
um componente de script chama, quando existir:

| Hook | Quando |
|---|---|
| `onCreate(entityId)` | Primeiro frame após o script ser associado |
| `onUpdate(entityId, dt)` | Cada frame de play mode escalado |
| `onFixedUpdate(entityId, dt)` | Passo fixo de simulação (60 Hz por padrão) |
| `onCollision(entityId, otherId)` | Colisão de física 2D |
| `onDestroy(entityId)` | Antes da entidade ser destruída |
| `onPostProcess(entityId, dt, api)` | Driver de post-process; fallback para `onUpdate` |

Hooks em falta são no-op. Erros Lua são apanhados e registados; não rebentam a
aplicação. `ScriptSystem::resetPlayState()` limpa as listas de entidades inicializadas
quando o play mode recomeça.

## Lua

A tabela global `caffeine` é registada uma vez em `ScriptEngine::init()` e partilhada
por scripts de jogo e plugins do editor. Destaques:

- `caffeine.time` — delta, unscaled delta, fixed delta, time scale, pause, frame, seed.
- `caffeine.pick` — picking mundo/ecrã, rato, raycast 3D, pickers personalizados.
- `caffeine.draw2d` — linhas, círculos, retângulos e polígonos em mundo/ecrã.
- `caffeine.ui` — UI retida de runtime.
- `caffeine.assets` — assets de texto.
- `caffeine.events` — subscribe/emit de eventos de jogo.
- `caffeine.component` — acesso genérico a componentes por reflexão (Lua e Dryad).
- Referência completa de cada função, agrupada por namespace: [Referência da API](api/index.md).
- Paridade Lua/Dryad, os novos helpers 3D de `caffeine.math`, os natives Dryad `caffeine_time_*`, `caffeine_input_*` e `caffeine_world_*`, e o roadmap: [api-roadmap.md](api-roadmap.md).
- `caffeine.map`, `caffeine.native`, `caffeine.postprocess`,
  `caffeine.forwardrender`, `caffeine.material`.

Veja [APIs de runtime Lua](runtime-apis.md) para assinaturas e exemplos, e
[acesso genérico a componentes](../api/scripting-components.md) para a API de reflexão.

```lua
function onCreate(entity)
    caffeine.debug.log("spawned " .. entity)
end

function onUpdate(entity, dt)
    local body = caffeine.component.get(entity, "Rigid Body 2D")
    if body then
        body["Linear velocity"] = { x = 4.0, y = body["Linear velocity"].y }
        caffeine.component.set(entity, "Rigid Body 2D", body)
    end
end
```

## Dryad

Dryad é um script visual de nós (`.dyd`) interpretado por `DryadHost`. O separador
**Dryad Nodes** do Doppio edita o grafo e faz round-trip; o motor compila e corre com
os mesmos hooks de ciclo de vida. O catálogo de nós e o emitter vivem em
`src/caffeine/script/nodes/`.

Veja o [plano dos scripts Dryad](../plans/2026-10-19-dryad-node-scripts.md) para o
modelo do grafo e as notas do editor.

## Caminhos e hot reload

`ScriptEngine::setSearchRoot` e `ScriptSystem::setProjectRoot` resolvem caminhos
relativos ao projeto como `scripts/player.lua` ou `scripts/player.dyd`.
`loadScriptAs(key, path)` carrega um ficheiro num ambiente separado, para o mesmo
ficheiro servir vários papéis sem partilhar globais. `reloadScript` /
`DryadHost::reloadIfChanged` recarregam do disco sem reiniciar o motor; o editor
chama-os quando o ficheiro muda.

## Sandboxing

Os scripts devem correr com a biblioteca padrão restrita: `os.*`, `io.*`,
`load`/`loadstring` e `debug.*` não fazem parte da superfície de gameplay. O código de
jogo usa as APIs `caffeine.*`, `math`, `string`, `table`, `require` e
`pcall`/`xpcall`. Código só de editor (ferramentas de build, importadores) pode optar
por acesso mais amplo; scripts de gameplay não devem depender disso.

## Mapa de ficheiros

| Ficheiro | Função |
|---|---|
| `ScriptEngine.hpp` / `.cpp` | VM Lua, registo de bindings, load/reload e chamadas de ciclo de vida |
| `ScriptSystem.hpp` / `.cpp` | Dispatch por frame para Lua, Dryad, nativo, C++ e post-process |
| `RuntimeScriptBindings.cpp` | `caffeine.time`, `pick`, `draw2d`, `ui`, `assets`, `events`, `map`, `native` |
| `ComponentBindings.cpp` | Bridge de reflexão genérica de componentes |
| `DryadHost.hpp` / `.cpp` | Host do interpretador Dryad |
| `ScriptTypes.hpp` | `ScriptComponent`, `NativeScriptComponent`, `CppScriptComponent` |
| `nodes/` | Catálogo, grafo, emitter e round-trip do Dryad |
| `ScriptWatcher.cpp` | Deteção de alterações para hot reload |

## Páginas relacionadas

- [APIs de runtime Lua](runtime-apis.md)
- [Acesso genérico a componentes](../api/scripting-components.md)
- [Módulos nativos](native-modules.md)
- [ECS core](../ecs/core.md)
- [Plano dos scripts Dryad](../plans/2026-10-19-dryad-node-scripts.md)
