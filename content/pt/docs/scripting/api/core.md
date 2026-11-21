# Núcleo

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Auxiliares de topo da tabela caffeine.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine`

## require

Lua: `caffeine.require`

```
require(name)
```

Carrega e executa outro módulo de script da pasta scripts/ do projeto. Não devolve nada; é lançado um erro se o carregamento falhar.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Nome do módulo; os pontos tornam-se pastas, por isso 'util.maths' carrega scripts/util/maths.lua.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.require('util.maths')
```
