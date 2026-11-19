# Entidade

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 4</span>
</div>

<p class="doc-lede">Nomes e procura. As entidades são ids numéricos; o nome é opcional e não tem de ser único.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.entity` · Dryad prefix: `caffeine_entity_`

## name

Lua: `caffeine.entity.name` · Dryad: `caffeine_entity_name`

```
name(entity) -> string
```

Lê o nome de editor de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `string`. O nome, ou texto vazio se não tiver nome ou estiver morta.

**Exemplo**

```lua
print(caffeine.entity.name(eid))
```

## setName

Lua: `caffeine.entity.setName` · Dryad: `caffeine_entity_set_name`

```
setName(entity, name) -> boolean
```

Dá um nome a uma entidade para a poder encontrar depois.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Novo nome, até 63 caracteres.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se a entidade não estiver viva.

**Exemplo**

```lua
caffeine.entity.setName(eid, "Boss")
```

## find

Lua: `caffeine.entity.find` · Dryad: `caffeine_entity_find`

```
find(name) -> number
```

Encontra uma entidade pelo nome.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Nome exato a procurar.</td></tr>
</tbody>
</table>

**Devolve:** `number`. O menor id que corresponde, ou 0 se nenhum.

**Exemplo**

```lua
local boss = caffeine.entity.find("Boss")
```

## findAll

Lua: `caffeine.entity.findAll` · Dryad: `caffeine_entity_find_all`

```
findAll(name) -> table
```

Encontra todas as entidades com um nome.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Nome exato a procurar.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Array de ids que correspondem, por ordem crescente (vazio se nenhum).

**Exemplo**

```lua
for _, id in ipairs(caffeine.entity.findAll("Coin")) do caffeine.world.destroy(id) end
```

## isAlive

Lua: `caffeine.entity.isAlive`

```
isAlive(entity) -> boolean
```

Indica se um id ainda refere uma entidade viva. Dryad: usar caffeine_world_is_alive.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>O id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true se a entidade existir.

**Exemplo**

```lua
if caffeine.entity.isAlive(target) then end
```
