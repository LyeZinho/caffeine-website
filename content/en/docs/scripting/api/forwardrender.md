# Forward render

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 0</span>
</div>

<p class="doc-lede">Per-entity forward renderer features: instancing, image-based lighting, occlusion, reflections and volumetrics.</p>

[All namespaces](index.md)

Namespace: `caffeine.forwardrender`

## ensure

Lua: `caffeine.forwardrender.ensure`

```
ensure(entity) -> boolean
```

Adds the forward-render features component to the entity if missing. The setters below do nothing without it.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false if the entity is invalid.

**Example**

```lua
caffeine.forwardrender.ensure(cam)
```

## setInstancing

Lua: `caffeine.forwardrender.setInstancing`

```
setInstancing(entity, enabled, maxBatch)
```

Configures GPU instancing.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Turns the feature on or off.</td></tr>
<tr><td><code>maxBatch</code></td><td>number</td><td>Maximum instances per batch. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.forwardrender.setInstancing(cam, true, 256)
```

## setIbl

Lua: `caffeine.forwardrender.setIbl`

```
setIbl(entity, enabled, diffuse, specular)
```

Configures image-based lighting.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Turns the feature on or off.</td></tr>
<tr><td><code>diffuse</code></td><td>number</td><td>Diffuse strength. Optional.</td></tr>
<tr><td><code>specular</code></td><td>number</td><td>Specular strength. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.forwardrender.setIbl(cam, true, 1.0, 1.0)
```

## setOcclusion

Lua: `caffeine.forwardrender.setOcclusion`

```
setOcclusion(entity, enabled)
```

Turns occlusion on or off.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Turns the feature on or off.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.forwardrender.setOcclusion(cam, true)
```

## setReflections

Lua: `caffeine.forwardrender.setReflections`

```
setReflections(entity, enabled, mode)
```

Configures reflections and their mode.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Turns the feature on or off.</td></tr>
<tr><td><code>mode</code></td><td>number</td><td>0 Off, 1 Planar, 2 ScreenSpace, 3 Probe; clamped to 0..3. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.forwardrender.setReflections(cam, true, 2)
```

## setVolumetrics

Lua: `caffeine.forwardrender.setVolumetrics`

```
setVolumetrics(entity, enabled, quality)
```

Configures volumetric fog and its quality.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Turns the feature on or off.</td></tr>
<tr><td><code>quality</code></td><td>number</td><td>0 Off, 1 Low, 2 Medium, 3 High; clamped to 0..3. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.forwardrender.setVolumetrics(cam, true, 2)
```
