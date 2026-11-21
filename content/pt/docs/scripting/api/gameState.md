# Estado de jogo

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 0</span>
</div>

<p class="doc-lede">Uma pilha opcional de estados de jogo nomeados.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.gameState`

## push

Lua: `caffeine.gameState.push`

```
push(id)
```

Empilha um estado de jogo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>string</td><td>Id do estado.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.gameState.push('pause_menu')
```

## pop

Lua: `caffeine.gameState.pop`

```
pop() -> boolean
```

Remove o estado de jogo do topo.

**Devolve:** `boolean`. O resultado da remoção do topo (ver GameStateStack::pop).

**Exemplo**

```lua
caffeine.gameState.pop()
```

## top

Lua: `caffeine.gameState.top`

```
top() -> string
```

Devolve o id do estado de jogo do topo.

**Devolve:** `string`. Id do estado do topo.

**Exemplo**

```lua
local id = caffeine.gameState.top()
```

## pause

Lua: `caffeine.gameState.pause`

```
pause() -> boolean
```

Pausa o estado de jogo do topo.

**Devolve:** `boolean`. Resultado de pausar o estado do topo.

**Exemplo**

```lua
caffeine.gameState.pause()
```

## resume

Lua: `caffeine.gameState.resume`

```
resume() -> boolean
```

Retoma o estado de jogo do topo.

**Devolve:** `boolean`. Resultado de retomar o estado do topo.

**Exemplo**

```lua
caffeine.gameState.resume()
```
