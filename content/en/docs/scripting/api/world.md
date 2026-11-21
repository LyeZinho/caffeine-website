# World

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 17 · Dryad 13</span>
</div>

<p class="doc-lede">Create and destroy entities, move them, and read or write transforms, 2D physics, sprites and particle emitters. Dryad adds position and scale natives.</p>

[All namespaces](index.md)

Namespace: `caffeine.world` · Dryad prefix: `caffeine_world_`

## create

Lua: `caffeine.world.create` · Dryad: `caffeine_world_create`

```
create() -> integer
```

Creates an entity named "LuaEntity".

**Returns:** `integer`. The new entity id, or 0 when there is no world.

**Example**

```lua
local e = caffeine.world.create()
```

## destroy

Lua: `caffeine.world.destroy` · Dryad: `caffeine_world_destroy`

```
destroy(entity)
```

Destroys an entity. Does nothing when there is no world.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.destroy(e)
```

## hasComponent

Lua: `caffeine.world.hasComponent`

```
hasComponent(entity, type) -> boolean
```

Checks one of four built-in component types. "Transform" is also true for a Position3D. For other components use `caffeine.component.has`.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>type</code></td><td>string</td><td>One of "Transform", "Sprite", "RigidBody2D", "Collider2D".</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True when the entity has it; false for any other type name.

**Example**

```lua
if caffeine.world.hasComponent(e, 'Sprite') then end
```

## getTransform

Lua: `caffeine.world.getTransform`

```
getTransform(entity) -> table
```

Reads the position of the entity (from Position3D or Transform); rotation and scale come from Transform.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. {x, y, z, rotation, scaleX, scaleY}; defaults 0 and scale 1.

**Example**

```lua
local t = caffeine.world.getTransform(e)
caffeine.debug.log(t.x .. ', ' .. t.y)
```

## setTransform

Lua: `caffeine.world.setTransform`

```
setTransform(entity, t)
```

Writes position (and rotation/scale on a Transform). Creates a Transform when the entity has neither Transform nor Position3D.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Fields x, y, z, rotation, scaleX, scaleY; missing fields keep the current value.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.setTransform(e, { x = 1, y = 2 })
```

## addTransform

Lua: `caffeine.world.addTransform`

```
addTransform(entity, t)
```

Alias of `caffeine.world.setTransform`.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Same fields as setTransform.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.addTransform(e, { x = 0, y = 0 })
```

## distanceTo

Lua: `caffeine.world.distanceTo` · Dryad: `caffeine_world_distance`

```
distanceTo(a, b) -> number
```

Straight-line distance between two entities.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>integer</td><td>First entity id.</td></tr>
<tr><td><code>b</code></td><td>integer</td><td>Second entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Distance in world units; 1e9 when either entity has no position or there is no world.

**Example**

```lua
local d = caffeine.world.distanceTo(e, target)
```

## findNearest

Lua: `caffeine.world.findNearest`

```
findNearest(from, maxDist) -> integer
```

Finds the closest other entity that has a Position3D or Transform within maxDist.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>from</code></td><td>integer</td><td>Entity to search around.</td></tr>
<tr><td><code>maxDist</code></td><td>number</td><td>Search radius; must be greater than 0.</td></tr>
</tbody>
</table>

**Returns:** `integer`. Id of the nearest other entity with a position, or 0.

**Example**

```lua
local near = caffeine.world.findNearest(e, 10)
```

## setYawPitch

Lua: `caffeine.world.setYawPitch`

```
setYawPitch(entity, yaw, pitch)
```

Sets a 3D rotation (Rotation3D quaternion, roll 0). When the entity has a Transform its rotation x/y are also written in degrees.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>yaw</code></td><td>number</td><td>Yaw in radians.</td></tr>
<tr><td><code>pitch</code></td><td>number</td><td>Pitch in radians.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.setYawPitch(e, caffeine.math.radians(90), 0)
```

## getRigidBody2D

Lua: `caffeine.world.getRigidBody2D`

```
getRigidBody2D(entity) -> table
```

Reads the 2D rigid body of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. {mass, restitution, friction, linearDamping, isKinematic, lockRotation, velocityX, velocityY}; empty when there is no RigidBody2D.

**Example**

```lua
local rb = caffeine.world.getRigidBody2D(e)
```

## setRigidBody2D

Lua: `caffeine.world.setRigidBody2D`

```
setRigidBody2D(entity, t)
```

Adds a RigidBody2D when missing and writes it. Fields you omit are reset to the defaults listed, except velocityX/velocityY, which keep their value.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Fields mass (1), restitution (0.3), friction (0.5), linearDamping (0), isKinematic (false), lockRotation (true), velocityX, velocityY.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.setRigidBody2D(e, { mass = 2, friction = 0.8 })
```

## getVelocity

Lua: `caffeine.world.getVelocity`

```
getVelocity(entity) -> table
```

Reads the 2D velocity of the rigid body.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. {x, y}; 0 when there is no RigidBody2D.

**Example**

```lua
local v = caffeine.world.getVelocity(e)
```

## setVelocity

Lua: `caffeine.world.setVelocity`

```
setVelocity(entity, v)
```

Sets the 2D velocity (adds a RigidBody2D when missing) and wakes the body.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>v</code></td><td>table</td><td>{x, y}; missing fields keep the current value.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.setVelocity(e, { x = 5, y = 0 })
```

## getSprite

Lua: `caffeine.world.getSprite`

```
getSprite(entity) -> table
```

Reads the sprite name and frame index.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. {name, frameIndex}; empty when there is no Sprite.

**Example**

```lua
local s = caffeine.world.getSprite(e)
```

## setSprite

Lua: `caffeine.world.setSprite`

```
setSprite(entity, t)
```

Adds a Sprite when missing and writes name and frame index.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Fields name (string, default "") and frameIndex (default 0).</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.setSprite(e, { name = 'hero', frameIndex = 2 })
```

## addSprite

Lua: `caffeine.world.addSprite`

```
addSprite(entity, t)
```

Alias of `caffeine.world.setSprite`.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Same fields as setSprite.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.addSprite(e, { name = 'hero' })
```

## addParticleEmitter

Lua: `caffeine.world.addParticleEmitter`

```
addParticleEmitter(entity, t)
```

Adds a particle emitter component to the entity (and a Transform when missing).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Fields maxParticles (100), emissionRate (10), lifetime (2), startSize (1), endSize (0), startColor and endColor ({r,g,b,a} in 0..1).</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.world.addParticleEmitter(e, { emissionRate = 30, lifetime = 1.5 })
```

## caffeine_world_is_alive

Lua: not available · Dryad: `caffeine_world_is_alive`

```
caffeine_world_is_alive(entity) -> boolean
```

Dryad only: checks that an entity id still refers to a live entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True when the entity exists.

**Example**

```dryad
function onUpdate(entity, dt) {
  if (caffeine_world_is_alive(entity)) { caffeine_translate(entity, 0, dt, 0); }
}
```

## caffeine_set_position

Lua: not available · Dryad: `caffeine_set_position`

```
caffeine_set_position(entity, x, y, z)
```

Dryad only: sets the position of an entity (Position3D and/or Transform; a Transform is created when it has neither).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```dryad
caffeine_set_position(entity, 0, 1, 0);
```

## caffeine_translate

Lua: not available · Dryad: `caffeine_translate`

```
caffeine_translate(entity, dx, dy, dz)
```

Dryad only: moves an entity by an offset.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>dx</code></td><td>number</td><td>Offset on X.</td></tr>
<tr><td><code>dy</code></td><td>number</td><td>Offset on Y.</td></tr>
<tr><td><code>dz</code></td><td>number</td><td>Offset on Z.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```dryad
caffeine_translate(entity, 1 * dt, 0, 0);
```

## caffeine_get_position_x

Lua: not available · Dryad: `caffeine_get_position_x`

```
caffeine_get_position_x(entity) -> number
```

Dryad only: reads the X position of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Position on X; 0 when the entity has none.

**Example**

```dryad
let p = caffeine_get_position_x(entity);
```

## caffeine_get_position_y

Lua: not available · Dryad: `caffeine_get_position_y`

```
caffeine_get_position_y(entity) -> number
```

Dryad only: reads the Y position of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Position on Y; 0 when the entity has none.

**Example**

```dryad
let p = caffeine_get_position_y(entity);
```

## caffeine_get_position_z

Lua: not available · Dryad: `caffeine_get_position_z`

```
caffeine_get_position_z(entity) -> number
```

Dryad only: reads the Z position of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Position on Z; 0 when the entity has none.

**Example**

```dryad
let p = caffeine_get_position_z(entity);
```

## caffeine_set_scale

Lua: not available · Dryad: `caffeine_set_scale`

```
caffeine_set_scale(entity, x, y, z)
```

Dryad only: sets the scale of an entity (Scale3D or Transform).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>Scale on X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Scale on Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Scale on Z.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```dryad
caffeine_set_scale(entity, 2, 2, 2);
```

## caffeine_get_scale_x

Lua: not available · Dryad: `caffeine_get_scale_x`

```
caffeine_get_scale_x(entity) -> number
```

Dryad only: reads the X scale of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Scale on X; 1 when the entity has none.

**Example**

```dryad
let s = caffeine_get_scale_x(entity);
```

## caffeine_get_scale_y

Lua: not available · Dryad: `caffeine_get_scale_y`

```
caffeine_get_scale_y(entity) -> number
```

Dryad only: reads the Y scale of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Scale on Y; 1 when the entity has none.

**Example**

```dryad
let s = caffeine_get_scale_y(entity);
```

## caffeine_get_scale_z

Lua: not available · Dryad: `caffeine_get_scale_z`

```
caffeine_get_scale_z(entity) -> number
```

Dryad only: reads the Z scale of an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `number`. Scale on Z; 1 when the entity has none.

**Example**

```dryad
let s = caffeine_get_scale_z(entity);
```
