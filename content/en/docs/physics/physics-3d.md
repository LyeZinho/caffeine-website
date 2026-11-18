# Physics 3D (Bullet3)

<div class="doc-meta">
  <span class="doc-badge doc-badge--planned">Planned</span>
  <span><strong>Namespace:</strong> `Caffeine::Physics3D`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/physics/PhysicsWorld3D.hpp"><code>physics/PhysicsWorld3D.hpp</code></a></span>
</div>

<p class="doc-lede">The rigid-body components and the Bullet3 world exist, but no play-mode
system steps them yet: the page records the implemented slice and what is still missing.</p>

> **Files:** `src/caffeine/physics/PhysicsComponents3D.hpp`, `PhysicsWorld3D.cpp`,
> `PhysicsSystem3D.hpp`
> **State:** components + Bullet backend implemented; runtime integration planned

The ECS does not include Bullet headers. `RigidBody3D` and `Collider3D` are serializable PODs.
The `btRigidBody` instances live in `PhysicsWorld3D`, indexed by entity id.

## Components

| Component | Fields |
|-----------|--------|
| `RigidBody3D` | `mass`, linear/angular damping, `friction`, `restitution`, `bodyType` (Dynamic / Kinematic / Static), `lockRotation` |
| `Collider3D` | `Box` (half extents), `Sphere` (`halfExtents.x` = radius), `Capsule` (`x` radius, `y` total height), `offset`, `isTrigger` |

Both are required for a body. In Doppio: **Add Component → Physics 3D**. The components are
reflected (type ids 8 and 9) and serialized in the scene blob, so they survive save/load.

## Integration status

`PhysicsSystem3D` is a plain `ECS::ISystem` that upserts bodies, calls `PhysicsWorld3D::step`
and writes the results back to `Position3D`, `Transform`, `Rotation3D` and `WorldTransform`.
Nothing registers it yet: neither the Doppio play mode nor `caffeine-runtime` creates a 3D
physics system, so editing a `RigidBody3D` in the Inspector does not simulate.

| Piece | Status |
|-------|--------|
| Components, reflection, serialization | Implemented |
| Bullet3 world (`upsertBody`, `step`, `stateOf`) | Implemented |
| `PhysicsSystem3D` ECS driver | Implemented, not registered |
| Play-mode tick, debug draw, joints, heightfield/mesh colliders | Not implemented |

## Policy

- Default gravity: `(0, -9.81, 0)`.
- Dynamic bodies: physics writes `Position3D`, `Transform` and `Rotation3D`.
- Static and kinematic bodies: the ECS pose is pushed into Bullet every step.
- `Scale3D` / `Transform.scale` feed the collider size.
- `PhysicsWorld3D::step` uses Bullet's `stepSimulation(dt, 4, 1/60)` — at most 4 substeps of
  1/60 s.

Build: `CAFFEINE_ENABLE_BULLET3=ON` (default). Without the flag, `PhysicsWorld3D::isAvailable()`
returns false and the system is a no-op.
