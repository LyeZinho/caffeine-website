# Interface

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">UI</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 0</span>
</div>

<p class="doc-lede">Criar canvases, rótulos e botões, atualizá-los e testar acertos em posições do ecrã.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.ui`

## createCanvas

Lua: `caffeine.ui.createCanvas`

```
createCanvas([w, h]) -> integer
```

Cria uma entidade de canvas de UI.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>w</code></td><td>number</td><td>Largura (por omissão 1280).</td></tr>
<tr><td><code>h</code></td><td>number</td><td>Altura (por omissão 720).</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade do canvas, ou 0 sem sistema de UI ou mundo.

**Exemplo**

```lua
local canvas = caffeine.ui.createCanvas(1280, 720)
```

## createLabel

Lua: `caffeine.ui.createLabel`

```
createLabel(parent, text, pos) -> integer
```

Cria um rótulo de texto sob um pai.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>parent</code></td><td>integer</td><td>Id do canvas ou widget pai.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>Texto do rótulo.</td></tr>
<tr><td><code>pos</code></td><td>table</td><td>Posição {x, y}.</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade do rótulo, ou 0.

**Exemplo**

```lua
local l = caffeine.ui.createLabel(canvas, 'Score: 0', { x = 10, y = 10 })
```

## createButton

Lua: `caffeine.ui.createButton`

```
createButton(parent, text, pos[, w, h]) -> integer
```

Cria um botão sob um pai.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>parent</code></td><td>integer</td><td>Id do canvas ou widget pai.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>Texto do botão.</td></tr>
<tr><td><code>pos</code></td><td>table</td><td>Posição {x, y}.</td></tr>
<tr><td><code>w</code></td><td>number</td><td>Largura (por omissão 120).</td></tr>
<tr><td><code>h</code></td><td>number</td><td>Altura (por omissão 40).</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade do botão, ou 0.

**Exemplo**

```lua
local b = caffeine.ui.createButton(canvas, 'Play', { x = 20, y = 60 })
```

## hitTest

Lua: `caffeine.ui.hitTest`

```
hitTest(sx, sy) -> integer
```

Encontra o elemento de UI numa posição do ecrã.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>sx</code></td><td>number</td><td>x do ecrã.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>y do ecrã.</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade de UI sob o ponto, ou 0.

**Exemplo**

```lua
local hit = caffeine.ui.hitTest(100, 80)
```

## setLabel

Lua: `caffeine.ui.setLabel`

```
setLabel(entity, text)
```

Muda o texto de um rótulo. Não faz nada se a entidade não tiver rótulo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>Novo texto (até 255 caracteres).</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.ui.setLabel(l, 'Score: 10')
```

## setProgress

Lua: `caffeine.ui.setProgress`

```
setProgress(entity, normalized)
```

Define uma barra de progresso entre o mínimo e o máximo. Não faz nada se a entidade não tiver barra de progresso.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>normalized</code></td><td>number</td><td>0..1; é limitado.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.ui.setProgress(bar, 0.5)
```
