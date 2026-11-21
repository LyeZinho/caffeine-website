# Particles

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 1 · Dryad 0</span>
</div>

<p class="doc-lede">Manual particle emission on entities that have a particle emitter.</p>

[All namespaces](index.md)

Namespace: `caffeine.particles`

## emit

Lua: `caffeine.particles.emit`

```
emit(entity, count)
```

Spawns particles immediately at the entity position with random velocities. Does nothing if the entity has no emitter.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>count</code></td><td>number</td><td>Number of particles to spawn; stops at the emitter's maximum.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.particles.emit(e, 20)
```
