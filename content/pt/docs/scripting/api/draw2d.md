# Desenho 2D

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">UI</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 0</span>
</div>

<p class="doc-lede">Formas 2D de sobreposição em modo imediato (linhas, círculos, retângulos, polilinhas) em espaço de mundo ou de ecrã.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.draw2d`

## beginFrame

Lua: `caffeine.draw2d.beginFrame`

```
beginFrame()
```

Inicia um novo frame de sobreposição, limpando as formas draw2d anteriores. Chame-o uma vez no início do desenho.

**Devolve:** nada

**Exemplo**

```lua
caffeine.draw2d.beginFrame()
```

## line

Lua: `caffeine.draw2d.line`

```
line(a, b, color[, thickness[, space]])
```

Desenha uma linha na sobreposição 2D.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Início {x, y}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Fim {x, y}.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} em 0..1 (cada um com 1 por omissão).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Espessura da linha (por omissão 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (por omissão) ou "screen".</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.draw2d.line({x=0,y=0},{x=5,y=5},{r=1,g=0,b=0,a=1}, 2)
```

## circle

Lua: `caffeine.draw2d.circle`

```
circle(center, radius, color[, thickness[, space]])
```

Desenha o contorno de um círculo (32 segmentos).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>center</code></td><td>table</td><td>Centro {x, y}.</td></tr>
<tr><td><code>radius</code></td><td>number</td><td>Raio.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} em 0..1 (cada um com 1 por omissão).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Espessura da linha (por omissão 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (por omissão) ou "screen".</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.draw2d.circle({x=0,y=0}, 3, {r=0,g=1,b=0,a=1})
```

## rect

Lua: `caffeine.draw2d.rect`

```
rect(min, max, color[, thickness[, space]])
```

Desenha o contorno de um retângulo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>min</code></td><td>table</td><td>Canto {x, y}.</td></tr>
<tr><td><code>max</code></td><td>table</td><td>Canto oposto {x, y}.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} em 0..1 (cada um com 1 por omissão).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Espessura da linha (por omissão 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (por omissão) ou "screen".</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.draw2d.rect({x=-1,y=-1},{x=1,y=1},{r=1,g=1,b=0,a=1})
```

## poly

Lua: `caffeine.draw2d.poly`

```
poly(points, color[, closed[, thickness[, space]]])
```

Desenha uma polilinha ou o contorno de um polígono.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>points</code></td><td>table</td><td>Lista de {x, y}; pelo menos 2 pontos, senão nada é desenhado.</td></tr>
<tr><td><code>color</code></td><td>table</td><td>{r, g, b, a} em 0..1 (cada um com 1 por omissão).</td></tr>
<tr><td><code>closed</code></td><td>boolean</td><td>Fechar a forma (por omissão false).</td></tr>
<tr><td><code>thickness</code></td><td>number</td><td>Espessura da linha (por omissão 1).</td></tr>
<tr><td><code>space</code></td><td>string</td><td>"world" (por omissão) ou "screen".</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.draw2d.poly({{x=0,y=0},{x=2,y=0},{x=1,y=2}}, {r=1,g=1,b=1,a=1}, true)
```
