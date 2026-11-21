# Efeitos

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 0</span>
</div>

<p class="doc-lede">Componentes de efeitos em entidades: partículas, luz volumétrica, superfícies refletoras, sombreados de material e nevoeiro.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.effects`

## set

Lua: `caffeine.effects.set`

```
set(entity, kind, quality) -> boolean
```

Atribui um tipo de efeito e uma qualidade à entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>kind</code></td><td>number</td><td>0 Particles, 1 VolumetricLight, 2 ReflectiveSurface, 3 MaterialShade, 4 Fog; limitado a 4.</td></tr>
<tr><td><code>quality</code></td><td>number</td><td>0 Performance, 1 Balanced, 2 Quality; limitado a 2.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.effects.set(e, 0, 1)
```

## particle

Lua: `caffeine.effects.particle`

```
particle(entity, domain) -> boolean
```

Transforma a entidade num emissor de partículas para o domínio indicado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>domain</code></td><td>number</td><td>0 Both, 1 2D, 2 3D; limitado a 2.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.effects.particle(e, 2)
```

## particleParams

Lua: `caffeine.effects.particleParams`

```
particleParams(entity, rate, lifetime, maxParticles, startSize, endSize, gravityY) -> boolean
```

Define os parâmetros do emissor de partículas.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>rate</code></td><td>number</td><td>Taxa de emissão.</td></tr>
<tr><td><code>lifetime</code></td><td>number</td><td>Tempo de vida da partícula.</td></tr>
<tr><td><code>maxParticles</code></td><td>number</td><td>Máximo de partículas vivas.</td></tr>
<tr><td><code>startSize</code></td><td>number</td><td>Tamanho ao nascer.</td></tr>
<tr><td><code>endSize</code></td><td>number</td><td>Tamanho ao fim da vida.</td></tr>
<tr><td><code>gravityY</code></td><td>number</td><td>Gravidade vertical.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.effects.particleParams(e, 30, 2, 200, 0.2, 0.0, -1)
```

## volumetric

Lua: `caffeine.effects.volumetric`

```
volumetric(entity) -> boolean
```

Torna a entidade uma luz volumétrica e garante a respetiva malha de volume.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.effects.volumetric(lamp)
```

## volumetricShape

Lua: `caffeine.effects.volumetricShape`

```
volumetricShape(entity, shape, columns, rows) -> boolean
```

Define a forma de uma luz volumétrica.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>shape</code></td><td>number</td><td>0 Sphere, 1 Cone, 2 Box, 3 Cylinder, 4 Window; limitado a 4.</td></tr>
<tr><td><code>columns</code></td><td>number</td><td>Número de colunas.</td></tr>
<tr><td><code>rows</code></td><td>number</td><td>Número de linhas.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.effects.volumetricShape(lamp, 1, 8, 8)
```

## fog

Lua: `caffeine.effects.fog`

```
fog(entity, domain, style) -> boolean
```

Transforma a entidade num efeito de nevoeiro com o estilo indicado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>domain</code></td><td>number</td><td>0 Both, 1 2D, 2 3D; limitado a 2.</td></tr>
<tr><td><code>style</code></td><td>number</td><td>0 Fog, 1 Dust, 2 Mist, 3 Smoke; limitado a 3.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.effects.fog(e, 2, 2)
```
