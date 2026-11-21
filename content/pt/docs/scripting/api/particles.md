# Partículas

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Emissão manual de partículas em entidades com um emissor de partículas.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.particles`

## emit

Lua: `caffeine.particles.emit`

```
emit(entity, count)
```

Cria partículas de imediato na posição da entidade com velocidades aleatórias. Não faz nada se a entidade não tiver emissor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>count</code></td><td>number</td><td>Número de partículas a criar; pára no máximo do emissor.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.particles.emit(e, 20)
```
