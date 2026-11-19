# Mapa

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">World</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Ganchos para pedidos de chunks de superfícies de mapa.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.map`

## onChunkRequest

Lua: `caffeine.map.onChunkRequest`

```
onChunkRequest(callback) -> number
```

Regista um handler para o evento `mapChunkRequest`, gerado quando uma superfície de mapa pede um chunk.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>callback</code></td><td>function</td><td>Chamada com uma tabela: `surfaceEntityId`, `chunkX`, `chunkY`, `worldMinX`, `worldMinY`, `chunkSize`.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Handle do handler de evento.

**Exemplo**

```lua
caffeine.map.onChunkRequest(function(req)
  print(req.chunkX, req.chunkY)
end)
```
