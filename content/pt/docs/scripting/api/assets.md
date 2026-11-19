# Recursos

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Ler recursos do projeto a partir de scripts.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.assets`

## loadText

Lua: `caffeine.assets.loadText`

```
loadText(path) -> string
```

Carrega um ficheiro de texto. Uma falha devolve o texto do erro em vez de lançar erro, por isso verifique o que recebe.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>Caminho do recurso; também é procurado na raiz do projeto, em assets/, data/ e data/assets/.</td></tr>
</tbody>
</table>

**Devolve:** `string`. O texto do ficheiro (em cache); em caso de falha a mensagem de erro; nil sem carregador.

**Exemplo**

```lua
local json = caffeine.assets.loadText('data/items.json')
```
