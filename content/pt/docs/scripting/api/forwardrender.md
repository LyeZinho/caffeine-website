# Render forward

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 0</span>
</div>

<p class="doc-lede">Funcionalidades do renderer forward por entidade: instancing, iluminação baseada em imagem, oclusão, reflexos e volumétricos.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.forwardrender`

## ensure

Lua: `caffeine.forwardrender.ensure`

```
ensure(entity) -> boolean
```

Adiciona à entidade o componente de funcionalidades do render forward, se faltar. Os setters abaixo não fazem nada sem ele.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se a entidade for inválida.

**Exemplo**

```lua
caffeine.forwardrender.ensure(cam)
```

## setInstancing

Lua: `caffeine.forwardrender.setInstancing`

```
setInstancing(entity, enabled, maxBatch)
```

Configura o instancing na GPU.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Liga ou desliga a funcionalidade.</td></tr>
<tr><td><code>maxBatch</code></td><td>number</td><td>Máximo de instâncias por lote. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.forwardrender.setInstancing(cam, true, 256)
```

## setIbl

Lua: `caffeine.forwardrender.setIbl`

```
setIbl(entity, enabled, diffuse, specular)
```

Configura a iluminação baseada em imagem.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Liga ou desliga a funcionalidade.</td></tr>
<tr><td><code>diffuse</code></td><td>number</td><td>Intensidade difusa. Opcional.</td></tr>
<tr><td><code>specular</code></td><td>number</td><td>Intensidade especular. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.forwardrender.setIbl(cam, true, 1.0, 1.0)
```

## setOcclusion

Lua: `caffeine.forwardrender.setOcclusion`

```
setOcclusion(entity, enabled)
```

Liga ou desliga a oclusão.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Liga ou desliga a funcionalidade.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.forwardrender.setOcclusion(cam, true)
```

## setReflections

Lua: `caffeine.forwardrender.setReflections`

```
setReflections(entity, enabled, mode)
```

Configura os reflexos e o respetivo modo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Liga ou desliga a funcionalidade.</td></tr>
<tr><td><code>mode</code></td><td>number</td><td>0 Off, 1 Planar, 2 ScreenSpace, 3 Probe; limitado a 0..3. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.forwardrender.setReflections(cam, true, 2)
```

## setVolumetrics

Lua: `caffeine.forwardrender.setVolumetrics`

```
setVolumetrics(entity, enabled, quality)
```

Configura o nevoeiro volumétrico e a respetiva qualidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Liga ou desliga a funcionalidade.</td></tr>
<tr><td><code>quality</code></td><td>number</td><td>0 Off, 1 Low, 2 Medium, 3 High; limitado a 0..3. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.forwardrender.setVolumetrics(cam, true, 2)
```
