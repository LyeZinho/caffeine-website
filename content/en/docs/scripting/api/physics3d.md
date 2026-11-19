# Physics 3D

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Physics</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 7 · Dryad 7</span>
</div>

<p class="doc-lede">Ray queries and forces on the Bullet 3D world. Everything is a safe no-op (false or nil) when the host runs without 3D physics. Forces and velocity only affect dynamic bodies.</p>

[All namespaces](index.md)

Namespace: `caffeine.physics3d` · Dryad prefix: `caffeine_physics3d_`

## isAvailable

Lua: `caffeine.physics3d.isAvailable` · Dryad: `caffeine_physics3d_available`

```
isAvailable() -> boolean
```

Tells whether 3D physics can be used at all.

**Returns:** `boolean`. true when a 3D physics world is attached and the Bullet backend is built in.

**Example**

```lua
if not caffeine.physics3d.isAvailable() then caffeine.debug.warn("no 3D physics") end
```

## setGravity

Lua: `caffeine.physics3d.setGravity` · Dryad: `caffeine_physics3d_set_gravity`

```
setGravity(x, y, z)
```

Sets the gravity vector in metres per second squared (default 0, -9.81, 0).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X component.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y component.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z component.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.physics3d.setGravity(0, -3.7, 0) -- Mars
```

## raycast

Lua: `caffeine.physics3d.raycast` · Dryad: `caffeine_physics3d_raycast`

```
raycast(ox, oy, oz, dx, dy, dz, maxDistance) -> table | nil
```

Casts a ray and returns the first solid body it hits, with the hit point and surface normal.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>ox, oy, oz</code></td><td>number</td><td>Ray origin in world space.</td></tr>
<tr><td><code>dx, dy, dz</code></td><td>number</td><td>Direction; it does not need to be normalised.</td></tr>
<tr><td><code>maxDistance</code></td><td>number</td><td>Maximum length in metres.</td></tr>
</tbody>
</table>

**Returns:** `table | nil`. { entity, x, y, z, nx, ny, nz, distance } for the nearest body hit, or nil. Triggers are ignored.

**Example**

```lua
local hit = caffeine.physics3d.raycast(0, 10, 0, 0, -1, 0, 100)
if hit then caffeine.debug.log(hit.entity .. " at " .. hit.distance) end
```

## addForce

Lua: `caffeine.physics3d.addForce` · Dryad: `caffeine_physics3d_add_force`

```
addForce(entity, x, y, z) -> boolean
```

Applies a force (newtons) at the centre of mass for the next physics step.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>A body with a RigidBody3D and Collider3D.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X component.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y component.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z component.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false for an unknown or non-dynamic body.

**Example**

```lua
caffeine.physics3d.addForce(eid, 0, 50, 0)
```

## addImpulse

Lua: `caffeine.physics3d.addImpulse` · Dryad: `caffeine_physics3d_add_impulse`

```
addImpulse(entity, x, y, z) -> boolean
```

Applies an instant change of momentum (newton-seconds) at the centre of mass, e.g. a jump.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>A body with a RigidBody3D and Collider3D.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X component.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y component.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z component.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false for an unknown or non-dynamic body.

**Example**

```lua
caffeine.physics3d.addImpulse(eid, 0, 6, 0)
```

## setVelocity

Lua: `caffeine.physics3d.setVelocity` · Dryad: `caffeine_physics3d_set_velocity`

```
setVelocity(entity, x, y, z) -> boolean
```

Sets the linear velocity in metres per second.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>A body with a RigidBody3D and Collider3D.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X component.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y component.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z component.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false for an unknown or non-dynamic body.

**Example**

```lua
caffeine.physics3d.setVelocity(eid, 4, 0, 0)
```

## velocity

Lua: `caffeine.physics3d.velocity` · Dryad: `caffeine_physics3d_velocity`

```
velocity(entity) -> table | nil
```

Reads the linear velocity of a body.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>A body with a RigidBody3D and Collider3D.</td></tr>
</tbody>
</table>

**Returns:** `table | nil`. { x, y, z } in metres per second, or nil for an unknown or non-dynamic body.

**Example**

```lua
local v = caffeine.physics3d.velocity(eid)
```
