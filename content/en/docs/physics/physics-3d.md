# Physics 3D (Bullet3)

> **Namespace:** `Caffeine::Physics3D` 
> **Ficheiros:** `src/physics/PhysicsComponents3D.hpp` , `PhysicsWorld3D.cpp` , `PhysicsSystem3D.hpp` 
> **Estado:** 🟡 Primeira fatia — box, sphere, capsule, sync ECS no play mode
> **Pilar:** [`plans/2026-09-22-engine-pillars-roadmap.md`](.../plans/2026-09-22-engine-pillars-roadmap.md) §3

ECS does not include Bullet headers. `RigidBody3D` e `Collider3D` They're serializable PDs. The `btRigidBody` vivem em `PhysicsWorld3D` , indexados pelo id da entidade.

## Componentes

| Componente | Campos |
|------------|--------|
| `RigidBody3D` | `mass` , damping, `friction` , `restitution` , `bodyType` (Dynamic / Kinematic / Static), `lockRotation` |
| `Collider3D` | `Box` (half extents), `Sphere` ( `halfExtents.x` = raio), `Capsule` ( `x` raio, `y` altura total), `offset` , `isTrigger` |

Both are necessary. In Doppio: **Add Component → Physics 3D**. Step runs only in play mode ( `SceneEditor::tickSystems` ), at 1/60 s with a maximum of 4 substeps. When leaving the play mode the Bullet world is destroyed; the scene edited back by the already existing snapshot.

## Policy

- Gravidade por defeito: `(0, -9.81, 0)` .
- Dynamic bodies: physics writes `Position3D` , `Transform` e `Rotation3D` .
- Static and kinematic bodies: ECS pose is pushed into Bullet in each frame.
- Escala de `Scale3D` / `Transform.scale` entra no tamanho do collider.
- Ground heightfield, mesh convex, debug draw and joints are still not connected.

Build: `CAFFEINE_ENABLE_BULLET3=ON` (defeito). Sem a flag, `PhysicsWorld3D::isAvailable()` It returns false and the system is no-op.
