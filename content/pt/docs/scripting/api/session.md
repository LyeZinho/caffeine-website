# Sessão

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 5</span>
</div>

<p class="doc-lede">Um armazenamento chave-valor que sobrevive às mudanças de cena enquanto o jogo corre (pontuação, definições, escolhas). Os valores são números, booleanos ou texto. Não é gravado em disco.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.session` · Dryad prefix: `caffeine_session_`

## set

Lua: `caffeine.session.set` · Dryad: `caffeine_session_set`

```
set(key, value)
```

Guarda um valor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Nome do valor.</td></tr>
<tr><td><code>value</code></td><td>number | boolean | string | nil</td><td>O valor a guardar; nil remove a chave.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.session.set("coins", 12)
```

## get

Lua: `caffeine.session.get` · Dryad: `caffeine_session_get`

```
get(key) -> any
```

Lê um valor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Nome do valor.</td></tr>
</tbody>
</table>

**Devolve:** `number | boolean | string | nil`. O valor guardado, ou nil quando a chave não existe.

**Exemplo**

```lua
local coins = caffeine.session.get("coins") or 0
```

## has

Lua: `caffeine.session.has` · Dryad: `caffeine_session_has`

```
has(key) -> boolean
```

Indica se uma chave existe.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Nome do valor.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true quando a chave existe.

**Exemplo**

```lua
if caffeine.session.has("checkpoint") then end
```

## remove

Lua: `caffeine.session.remove` · Dryad: `caffeine_session_remove`

```
remove(key) -> boolean
```

Apaga uma chave.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>string</td><td>Nome do valor.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true quando a chave existia.

**Exemplo**

```lua
caffeine.session.remove("checkpoint")
```

## clear

Lua: `caffeine.session.clear` · Dryad: `caffeine_session_clear`

```
clear()
```

Apaga todas as chaves.

**Devolve:** nada

**Exemplo**

```lua
caffeine.session.clear() -- new game
```
