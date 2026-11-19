# Navegação

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">World</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 0</span>
</div>

<p class="doc-lede">Agentes de navegação: destinos, pontos de patrulha, alvos a seguir e scripts de comportamento.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.navigation`

## setDestination

Lua: `caffeine.navigation.setDestination`

```
setDestination(entity, x, y, z) -> boolean
```

Define o destino do agente no espaço do mundo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X no mundo.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y no mundo.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z no mundo.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.navigation.setDestination(npc, 10, 0, 5)
```

## setMode

Lua: `caffeine.navigation.setMode`

```
setMode(entity, mode) -> boolean
```

Define o modo de navegação do agente.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>mode</code></td><td>string</td><td>"patrol", "follow" ou "scripted"; qualquer outro valor significa idle.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.navigation.setMode(npc, 'patrol')
```

## addPatrolPoint

Lua: `caffeine.navigation.addPatrolPoint`

```
addPatrolPoint(entity, x, y, z) -> boolean
```

Acrescenta um ponto à rota de patrulha do agente.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X no mundo.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y no mundo.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z no mundo.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.navigation.addPatrolPoint(npc, 0, 0, 0)
```

## setFollowTarget

Lua: `caffeine.navigation.setFollowTarget`

```
setFollowTarget(entity, targetId) -> boolean
```

Define a entidade que o agente segue.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>targetId</code></td><td>number</td><td>Id da entidade a seguir.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.navigation.setFollowTarget(npc, player)
```

## setBehaviorScript

Lua: `caffeine.navigation.setBehaviorScript`

```
setBehaviorScript(entity, path) -> boolean
```

Define o script que controla o agente no modo scripted.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Caminho do script de comportamento.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.navigation.setBehaviorScript(npc, 'scripts/ai.lua')
```
