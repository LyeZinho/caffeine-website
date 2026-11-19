# Seleção

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Input</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 8 · Dryad 0</span>
</div>

<p class="doc-lede">Encontrar a entidade sob um ponto, uma posição do ecrã, o rato ou um raio 3D, e registar seletores personalizados.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.pick`

## world

Lua: `caffeine.pick.world`

```
world(wx, wy) -> integer
```

Escolhe a entidade sob uma posição 2D do mundo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>wx</code></td><td>number</td><td>x do mundo.</td></tr>
<tr><td><code>wy</code></td><td>number</td><td>y do mundo.</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade, ou 0 se nada for atingido.

**Exemplo**

```lua
local e = caffeine.pick.world(3, 4)
```

## screen

Lua: `caffeine.pick.screen`

```
screen(sx, sy) -> integer
```

Converte uma posição do ecrã para o mundo usando a câmara do modo de jogo e escolhe a entidade aí.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>sx</code></td><td>number</td><td>x do ecrã.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>y do ecrã.</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade, ou 0 se nada for atingido.

**Exemplo**

```lua
local e = caffeine.pick.screen(400, 300)
```

## atMouse

Lua: `caffeine.pick.atMouse`

```
atMouse() -> integer
```

Escolhe a entidade sob o cursor do rato; 0 sem mundo ou entrada.

**Devolve:** `integer`. Id da entidade, ou 0 se nada for atingido.

**Exemplo**

```lua
local e = caffeine.pick.atMouse()
```

## screenToWorld

Lua: `caffeine.pick.screenToWorld`

```
screenToWorld(sx, sy) -> table
```

Converte uma posição do ecrã numa posição 2D do mundo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>sx</code></td><td>number</td><td>x do ecrã.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>y do ecrã.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {x, y} em unidades do mundo.

**Exemplo**

```lua
local w = caffeine.pick.screenToWorld(400, 300)
```

## register

Lua: `caffeine.pick.register`

```
register(fn) -> integer
```

Regista um seletor personalizado consultado pelas pesquisas de seleção.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>fn</code></td><td>function</td><td>Chamada como fn(worldX, worldY); devolva um id de entidade (maior que 0) para um acerto, ou false/nil para nenhum.</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Handle para unregister.

**Exemplo**

```lua
local h = caffeine.pick.register(function(x, y) return 0 end)
```

## unregister

Lua: `caffeine.pick.unregister`

```
unregister(handle)
```

Remove um seletor personalizado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>integer</td><td>Handle devolvido por register.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.pick.unregister(h)
```

## query

Lua: `caffeine.pick.query`

```
query(wx, wy) -> table
```

Pesquisa de seleção completa numa posição do mundo, incluindo seletores personalizados.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>wx</code></td><td>number</td><td>x do mundo.</td></tr>
<tr><td><code>wy</code></td><td>number</td><td>y do mundo.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {kind = "entity", entityId}, {kind = "custom", customId} ou {kind = "none"}; vazia sem mundo.

**Exemplo**

```lua
local hit = caffeine.pick.query(3, 4)
if hit.kind == 'entity' then caffeine.debug.log(hit.entityId) end
```

## raycast

Lua: `caffeine.pick.raycast`

```
raycast(origin, dir) -> integer
```

Lança um raio 3D e devolve a entidade atingida.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>origin</code></td><td>table</td><td>{x, y, z}; partes em falta são 0.</td></tr>
<tr><td><code>dir</code></td><td>table</td><td>Direção {x, y, z}; é normalizada por si (z = 1 por omissão).</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade, ou 0 se nada for atingido.

**Exemplo**

```lua
local e = caffeine.pick.raycast({x=0,y=1,z=0}, {x=0,y=0,z=1})
```
