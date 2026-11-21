# Effects

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 6 · Dryad 0</span>
</div>

<p class="doc-lede">Effect components on entities: particles, volumetric light, reflective surfaces, material shades and fog.</p>

[All namespaces](index.md)

Namespace: `caffeine.effects`

## set

Lua: `caffeine.effects.set`

```
set(entity, kind, quality) -> boolean
```

Assigns an effect kind and quality to the entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>kind</code></td><td>number</td><td>0 Particles, 1 VolumetricLight, 2 ReflectiveSurface, 3 MaterialShade, 4 Fog; clamped to 4.</td></tr>
<tr><td><code>quality</code></td><td>number</td><td>0 Performance, 1 Balanced, 2 Quality; clamped to 2.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.effects.set(e, 0, 1)
```

## particle

Lua: `caffeine.effects.particle`

```
particle(entity, domain) -> boolean
```

Turns the entity into a particle emitter for the given domain.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>domain</code></td><td>number</td><td>0 Both, 1 2D, 2 3D; clamped to 2.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.effects.particle(e, 2)
```

## particleParams

Lua: `caffeine.effects.particleParams`

```
particleParams(entity, rate, lifetime, maxParticles, startSize, endSize, gravityY) -> boolean
```

Sets the particle emitter parameters.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>rate</code></td><td>number</td><td>Emission rate.</td></tr>
<tr><td><code>lifetime</code></td><td>number</td><td>Particle lifetime.</td></tr>
<tr><td><code>maxParticles</code></td><td>number</td><td>Maximum live particles.</td></tr>
<tr><td><code>startSize</code></td><td>number</td><td>Size at birth.</td></tr>
<tr><td><code>endSize</code></td><td>number</td><td>Size at death.</td></tr>
<tr><td><code>gravityY</code></td><td>number</td><td>Vertical gravity.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.effects.particleParams(e, 30, 2, 200, 0.2, 0.0, -1)
```

## volumetric

Lua: `caffeine.effects.volumetric`

```
volumetric(entity) -> boolean
```

Makes the entity a volumetric light and ensures its volume mesh.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.effects.volumetric(lamp)
```

## volumetricShape

Lua: `caffeine.effects.volumetricShape`

```
volumetricShape(entity, shape, columns, rows) -> boolean
```

Sets the shape of a volumetric light.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>shape</code></td><td>number</td><td>0 Sphere, 1 Cone, 2 Box, 3 Cylinder, 4 Window; clamped to 4.</td></tr>
<tr><td><code>columns</code></td><td>number</td><td>Column count.</td></tr>
<tr><td><code>rows</code></td><td>number</td><td>Row count.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.effects.volumetricShape(lamp, 1, 8, 8)
```

## fog

Lua: `caffeine.effects.fog`

```
fog(entity, domain, style) -> boolean
```

Turns the entity into a fog effect with the given style.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>domain</code></td><td>number</td><td>0 Both, 1 2D, 2 3D; clamped to 2.</td></tr>
<tr><td><code>style</code></td><td>number</td><td>0 Fog, 1 Dust, 2 Mist, 3 Smoke; clamped to 3.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.effects.fog(e, 2, 2)
```
