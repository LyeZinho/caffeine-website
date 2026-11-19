# Animação

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 7 · Dryad 0</span>
</div>

<p class="doc-lede">Controlo de animação por clips, máquina de estados, malhas com skin e sprite sheets.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.animation`

## playClip

Lua: `caffeine.animation.playClip`

```
playClip(entity, path) -> boolean
```

Reproduz um clip de animação na entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Caminho do asset do clip.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.animation.playClip(e, 'clips/run.anim')
```

## playSkinnedClip

Lua: `caffeine.animation.playSkinnedClip`

```
playSkinnedClip(entity, meshPath, clipIndex) -> boolean
```

Reproduz um clip de uma malha com skin pelo índice.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>meshPath</code></td><td>string</td><td>Caminho da malha com skin.</td></tr>
<tr><td><code>clipIndex</code></td><td>number</td><td>Índice do clip na malha.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.animation.playSkinnedClip(e, 'models/hero.glb', 0)
```

## playState

Lua: `caffeine.animation.playState`

```
playState(entity, state) -> boolean
```

Muda o animator para um estado com nome.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>state</code></td><td>string</td><td>Nome do estado.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.animation.playState(e, 'Idle')
```

## setBool

Lua: `caffeine.animation.setBool`

```
setBool(entity, name, value) -> boolean
```

Define um parâmetro booleano do animator.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do parâmetro.</td></tr>
<tr><td><code>value</code></td><td>boolean</td><td>Novo valor.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.animation.setBool(e, 'grounded', true)
```

## setFloat

Lua: `caffeine.animation.setFloat`

```
setFloat(entity, name, value) -> boolean
```

Define um parâmetro float do animator.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do parâmetro.</td></tr>
<tr><td><code>value</code></td><td>number</td><td>Novo valor.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.animation.setFloat(e, 'speed', 3.5)
```

## setTrigger

Lua: `caffeine.animation.setTrigger`

```
setTrigger(entity, name) -> boolean
```

Dispara um trigger do animator.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do trigger.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.animation.setTrigger(e, 'jump')
```

## setSpriteSheet

Lua: `caffeine.animation.setSpriteSheet`

```
setSpriteSheet(entity, columns, rows, frameCount) -> boolean
```

Configura a animação por sprite sheet na entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>columns</code></td><td>number</td><td>Colunas na folha.</td></tr>
<tr><td><code>rows</code></td><td>number</td><td>Linhas na folha.</td></tr>
<tr><td><code>frameCount</code></td><td>number</td><td>Número total de frames.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.animation.setSpriteSheet(e, 4, 4, 16)
```
