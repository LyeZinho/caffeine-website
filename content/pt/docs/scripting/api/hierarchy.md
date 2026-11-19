# Hierarquia

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 6</span>
</div>

<p class="doc-lede">Ligações pai e filho entre entidades. O transform do filho compõe-se com o do pai.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.hierarchy` · Dryad prefix: `caffeine_hierarchy_`

## parent

Lua: `caffeine.hierarchy.parent` · Dryad: `caffeine_hierarchy_parent`

```
parent(entity) -> number
```

Devolve o pai de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. O id do pai, ou 0 se não tiver.

**Exemplo**

```lua
local p = caffeine.hierarchy.parent(eid)
```

## setParent

Lua: `caffeine.hierarchy.setParent` · Dryad: `caffeine_hierarchy_set_parent`

```
setParent(entity, parent) -> boolean
```

Liga uma entidade por baixo de outra.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O filho.</td></tr>
<tr><td><code>parent</code></td><td>number</td><td>O novo pai; 0 desliga.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se uma das entidades estiver morta, o pai for a própria entidade ou a ligação criar um ciclo.

**Exemplo**

```lua
caffeine.hierarchy.setParent(wheel, car)
```

## detach

Lua: `caffeine.hierarchy.detach` · Dryad: `caffeine_hierarchy_detach`

```
detach(entity) -> boolean
```

Remove a ligação ao pai.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se a entidade estiver morta.

**Exemplo**

```lua
caffeine.hierarchy.detach(wheel)
```

## children

Lua: `caffeine.hierarchy.children` · Dryad: `caffeine_hierarchy_children`

```
children(entity) -> table
```

Lista os filhos diretos de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Array de ids dos filhos diretos, por ordem crescente.

**Exemplo**

```lua
for _, c in ipairs(caffeine.hierarchy.children(car)) do end
```

## childCount

Lua: `caffeine.hierarchy.childCount` · Dryad: `caffeine_hierarchy_child_count`

```
childCount(entity) -> number
```

Conta os filhos diretos.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Número de filhos diretos.

**Exemplo**

```lua
local n = caffeine.hierarchy.childCount(car)
```

## root

Lua: `caffeine.hierarchy.root` · Dryad: `caffeine_hierarchy_root`

```
root(entity) -> number
```

Sobe até ao topo da hierarquia.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. O antepassado de topo (a própria entidade se não tiver pai).

**Exemplo**

```lua
local top = caffeine.hierarchy.root(wheel)
```
