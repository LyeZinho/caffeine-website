# Módulos nativos

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 2 · Dryad 0</span>
</div>

<p class="doc-lede">Carregar e chamar módulos nativos através de JSON.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.native`

## load

Lua: `caffeine.native.load`

```
load(name) -> boolean
```

Carrega um módulo nativo. O erro de carregamento não é devolvido ao script.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Nome do módulo nativo.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro se o módulo foi carregado.

**Exemplo**

```lua
caffeine.native.load('mymodule')
```

## call

Lua: `caffeine.native.call`

```
call(module, fn[, argsJson]) -> string
```

Chama uma função de um módulo nativo carregado com argumentos JSON.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>module</code></td><td>string</td><td>Nome do módulo.</td></tr>
<tr><td><code>fn</code></td><td>string</td><td>Nome da função.</td></tr>
<tr><td><code>argsJson</code></td><td>string</td><td>Argumentos em JSON (por omissão "{}").</td></tr>
</tbody>
</table>

**Devolve:** `string`. O texto do resultado; em caso de falha devolve-se a mensagem de erro.

**Exemplo**

```lua
local out = caffeine.native.call('mymodule', 'ping', '{}')
```
