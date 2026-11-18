# ECS core

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/ecs/World.hpp"><code>ecs/World.hpp</code></a></span>
</div>

<p class="doc-lede">Caffeine uses an archetype-based ECS: entities with the same
component set live in contiguous storage, and queries iterate matching archetypes
instead of scanning every entity.</p>

## Concepts

| Term | Meaning |
|---|---|
| **Entity** | A `u32` id plus a `World*`. No data, no logic, no virtuals. |
| **Component** | A plain struct registered by type; no methods, no base class. |
| **Archetype** | The set of entities with an identical `ComponentSet`; component arrays are contiguous by type. |
| **Query** | A `ComponentQuery` describing required, excluded and any-of components. |
| **World** | Owns entities, archetypes and the component storage. |
| **System** | An object with `onUpdate(World&, f32)`; the engine or game calls it. |

## Entity

```cpp
Caffeine::ECS::Entity entity = world.create("Player");

entity.id();        // u32
entity.isValid();   // id != u32_max
entity.add<Position3D>({0, 1, 0});
entity.has<Position3D>();
entity.get<Position3D>();
entity.getOrAdd<Health>(100);
entity.remove<Health>();
entity.destroy();
```

`Entity::INVALID` is the default-constructed value. A destroyed entity id may be
reused; stale handles are not generation-checked, so treat handles as short-lived
and re-query after structural changes.

## World

```cpp
Caffeine::ECS::World world;

Entity e = world.create("Cube");
world.add<Transform>(e, Transform{});
world.destroy(e);
world.destroyAll();

world.entityCount();
world.archetypeCount();

auto location = world.getEntityLocation(e);
bool alive = world.isEntityAlive(e);
```

### Queries

```cpp
Caffeine::ECS::ComponentQuery query;
query.with<Position3D, Velocity3D>().without<Disabled>();

world.forEach(query, [](Entity entity, Position3D& position, const Velocity3D& velocity) {
    position.value += velocity.value;
});
```

`ComponentQuery` supports:

- `with<T...>()` — the archetype must contain every listed component.
- `without<T...>()` — the archetype must contain none of them.
- `any<T...>()` — at least one of the listed components must be present.
- `matches(const Archetype*)` — used by `World::forEach`.

The callback receives the components requested by the query plus the entity id. The
order of arguments follows the query; check the overloads in `World.hpp` for the exact
form.

### Parallel iteration

```cpp
world.forEachParallel(query, jobSystem,
    [](Entity entity, Position3D& position, const Velocity3D& velocity) {
        position.value += velocity.value;
    });
```

`forEachParallel` splits archetype ranges across the job system. The callback must be
safe to run concurrently and must not mutate the world structurally.

## Structural changes

`add`, `remove`, `destroy` and `create` move entities between archetypes. Do **not**
call them inside `forEach` / `forEachParallel`; collect the entities first and apply
the changes after iteration. Use `CommandBuffer` for deferred create/destroy when a
system needs to queue structural work.

## Systems

`ISystem` is intentionally small:

```cpp
class ISystem {
public:
    virtual ~ISystem() = default;
    virtual void onUpdate(World& world, f32 deltaTime) = 0;
};
```

The engine owns the system list (renderer, physics, animation, scripting, game code).
There is no hidden global registry; a system is an object the host creates and calls
in order. `ScriptSystem` is one example (`src/caffeine/script/ScriptSystem.hpp`).

## Storage and iteration

- Entities are stored in `Vector<EntityData>`; each entry records the archetype index
  and the index inside that archetype.
- Removing an entity swaps the last element into the freed slot; the moved entity's
  location is patched.
- Adding/removing a component copies the entity's components into a new archetype,
  then removes it from the old one.
- Queries iterate archetypes, so empty archetypes cost almost nothing.

## Example: a tiny movement system

```cpp
struct Position3D { Vec3 value; };
struct Velocity3D { Vec3 value; };

World world;
Entity mover = world.create("Mover");
world.add<Position3D>(mover, Position3D{{0, 0, 0}});
world.add<Velocity3D>(mover, Velocity3D{{1, 0, 0}});

ComponentQuery moving;
moving.with<Position3D, Velocity3D>();

world.forEach(moving, [dt](Position3D& position, const Velocity3D& velocity) {
    position.value += velocity.value * dt;
});
```

## Tests

The ECS suite lives in `tests/test_phase2_3.cpp` and related files. It covers entity
creation/destruction, component add/remove, archetype migration, query matching,
parallel iteration and the scene manager integration.

## Related pages

- [Scene manager](scene.md) — parent/child hierarchy and scene serialization.
- [ECS examples](examples.md)
- [Component reflection](../api/scripting-components.md)
- [Job system](../concurrency/job-system.md)
