# Eventos

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 3 · Dryad 0</span>
</div>

<p class="doc-lede">Um barramento simples de eventos nomeados: subscrever, emitir e cancelar a subscrição.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.events`

## on

Lua: `caffeine.events.on`

```
on(eventName, callback) -> integer
```

Subscreve um callback a um evento nomeado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>eventName</code></td><td>string</td><td>Nome do evento.</td></tr>
<tr><td><code>callback</code></td><td>function</td><td>Chamada com os argumentos passados a emit.</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Handle do handler para off.

**Exemplo**

```lua
local h = caffeine.events.on('hit', function(dmg) end)
```

## emit

Lua: `caffeine.events.emit`

```
emit(eventName, ...)
```

Chama todos os handlers do evento por ordem de registo. Um erro num handler é registado e não impede os outros.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>eventName</code></td><td>string</td><td>Nome do evento.</td></tr>
<tr><td><code>...</code></td><td>any</td><td>Argumentos passados a cada handler.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.events.emit('hit', 10)
```

## off

Lua: `caffeine.events.off`

```
off(handle)
```

Remove um handler.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>integer</td><td>Handle devolvido por on.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.events.off(h)
```
