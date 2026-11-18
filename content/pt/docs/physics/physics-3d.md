# Physics 3D (Bullet3)

<div class="doc-meta">
  <span class="doc-badge doc-badge--planned">Planned</span>
  <span><strong>Namespace:</strong> `Caffeine::Physics3D`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/physics/PhysicsWorld3D.hpp"><code>physics/PhysicsWorld3D.hpp</code></a></span>
</div>

<p class="doc-lede">Os componentes de corpo rígido e o mundo Bullet3 existem, mas nenhum
sistema de play mode os avança: a página regista a fatia implementada e o que falta.</p>

> **Ficheiros:** `src/caffeine/physics/PhysicsComponents3D.hpp`, `PhysicsWorld3D.cpp`,
> `PhysicsSystem3D.hpp`
> **Estado:** componentes + backend Bullet implementados; integração no runtime planeada

O ECS não inclui headers do Bullet. `RigidBody3D` e `Collider3D` são PODs serializáveis. Os
`btRigidBody` vivem em `PhysicsWorld3D`, indexados pelo id da entidade.

## Componentes

| Componente | Campos |
|------------|--------|
| `RigidBody3D` | `mass`, damping linear/angular, `friction`, `restitution`, `bodyType` (Dynamic / Kinematic / Static), `lockRotation` |
| `Collider3D` | `Box` (half extents), `Sphere` (`halfExtents.x` = raio), `Capsule` (`x` raio, `y` altura total), `offset`, `isTrigger` |

Ambos são necessários para um corpo. No Doppio: **Add Component → Physics 3D**. Os componentes
são refletidos (ids 8 e 9) e serializados no blob da cena, por isso sobrevivem a save/load.

## Estado da integração

O `PhysicsSystem3D` é um `ECS::ISystem` normal que faz upsert dos corpos, chama
`PhysicsWorld3D::step` e escreve os resultados em `Position3D`, `Transform`, `Rotation3D` e
`WorldTransform`. Ninguém o registra ainda: nem o play mode do Doppio nem o `caffeine-runtime`
criam um sistema de física 3D, pelo que editar um `RigidBody3D` no Inspector não simula.

| Peça | Estado |
|------|--------|
| Componentes, reflexão, serialização | Implementado |
| Mundo Bullet3 (`upsertBody`, `step`, `stateOf`) | Implementado |
| Driver ECS `PhysicsSystem3D` | Implementado, não registado |
| Tick em play mode, debug draw, joints, colliders de heightfield/mesh | Não implementado |

## Política

- Gravidade por defeito: `(0, -9.81, 0)`.
- Corpos dinâmicos: a física escreve `Position3D`, `Transform` e `Rotation3D`.
- Corpos estáticos e cinemáticos: a pose do ECS é empurrada para o Bullet a cada passo.
- `Scale3D` / `Transform.scale` entram no tamanho do collider.
- `PhysicsWorld3D::step` usa `stepSimulation(dt, 4, 1/60)` do Bullet — no máximo 4 substeps de
  1/60 s.

Build: `CAFFEINE_ENABLE_BULLET3=ON` (default). Sem a flag, `PhysicsWorld3D::isAvailable()`
devolve false e o sistema é no-op.
