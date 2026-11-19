# Depuração

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 3 · Dryad 1</span>
</div>

<p class="doc-lede">Registo na consola do motor.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.debug` · Dryad prefix: `caffeine_log`

## log

Lua: `caffeine.debug.log` · Dryad: `caffeine_log`

```
log(msg)
```

Escreve uma mensagem informativa no registo do motor (origem "Lua"). Em Dryad `caffeine_log(valor)` regista o primeiro argumento como texto sob "Dryad".

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>msg</code></td><td>string</td><td>Texto da mensagem.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.debug.log('hello')
```

## warn

Lua: `caffeine.debug.warn`

```
warn(msg)
```

Escreve um aviso no registo do motor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>msg</code></td><td>string</td><td>Texto da mensagem.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.debug.warn('low health')
```

## error

Lua: `caffeine.debug.error`

```
error(msg)
```

Escreve uma mensagem de erro no registo do motor. Não interrompe o script.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>msg</code></td><td>string</td><td>Texto da mensagem.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.debug.error('missing target')
```
