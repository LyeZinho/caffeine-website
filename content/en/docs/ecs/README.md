# Caffeine ECS Core Documentation

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/ecs/World.hpp"><code>ecs/World.hpp</code></a></span>
</div>

<p class="doc-lede">Caffeine is an archetype ECS: entities are numeric ids, components
are plain structs, and every entity with the same component set shares one dense
archetype that queries can walk linearly.</p>

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Components](#components)
4. [Entities](#entities)
5. [Queries](#queries)
6. [Systems](#systems)
7. [Command Buffer](#command-buffer)
8. [Performance](#performance)
9. [API Reference](#api-reference)
10. [Common Patterns](#common-patterns)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

The ECS stores game state as data and runs behaviour in systems. An **entity** is a
`u32` id plus a `World*`; a **component** is a plain struct registered by type; a
**system** is an object with `onUpdate(World&, f32)`.

### Why ECS?

Traditional object-oriented game code puts state and behaviour in deep class
hierarchies. That makes behaviour hard to combine, scatters related data across
memory and makes safe parallel iteration difficult.

The Caffeine ECS composes instead:

- **Components** hold data only (`Position2D`, `Velocity2D`, `Health`, your own structs).
- **Entities** are ids that group components; they have no data of their own.
- **Queries** select every entity with a component signature.
- **Systems** receive the matching components and mutate them.

Result: contiguous component arrays, cheap archetype matching and a clear place for
each piece of logic.

### Design goals

- Fast query iteration over dense component arrays.
- Structural changes are explicit (`add`, `remove`, `destroy`) and never hidden in a
  getter.
- Parallel iteration is opt-in and does not require locks around component storage.
- No global system registry: the host decides which systems run and in what order.

The correctness suite lives in `tests/test_phase2_3.cpp`; measure frame budgets on
your own scene rather than relying on a fixed number.

---

## Architecture Overview

```text
World
├── EntityData[]              one entry per id: archetype index + index in archetype
└── Archetype[]               one archetype per distinct ComponentSet
    ├── EntityID[]            dense entity ids
    └── ComponentPool<T>[]    one dense array per component type

Query (with Position2D, Velocity2D, without Disabled)
    └── archetype.ComponentSet.matches(query) → iterate that archetype's arrays
```

### Key Concepts

**World**: owns entity ids, archetypes and component storage. It creates and destroys
entities, migrates entities between archetypes when components are added or removed,
and runs `forEach` / `forEachParallel`.

**Archetype**: groups entities with an identical component signature. For example:

- `[Transform]`: static scene objects
- `[Transform, Position3D, Rotation3D, Scale3D]`: 3D transforms
- `[Position2D, Velocity2D]`: moving 2D entities

All entities in an archetype store components in dense arrays, one array per type.

**ComponentID**: a `u32` assigned the first time `ComponentID::get<T>()` runs. The
counter is an atomic; the maximum is 256 component types (`ComponentID::MAX_COMPONENTS`).

**ComponentSet**: a 256-bit bitset of component ids. Archetype lookup hashes the set;
query matching ANDs the bitsets, so it is O(1) per archetype rather than per entity.

**Entity**: a lightweight handle (`u32` id + `World*`). It can query, add, remove and
destroy through the world that created it.

**ComponentQuery**: a builder with `with<A, B>()`, `without<C>()` and `any<D, E>()`.
`matches(const Archetype*)` is what `World::forEach` uses.

**System**: implements `ISystem`; the host calls `onUpdate(World&, f32 deltaTime)`.
Movement, rendering and physics are ordinary systems.

---

## Components

Components are small plain structs containing state only.

### Predefined components

`ecs/Components.hpp` ships the shared transform plus a small 2D set:

```cpp
// Shared 3D transform, also used by the scene hierarchy.
struct Transform {
    Vec3 position = {0.0f, 0.0f, 0.0f};
    Vec3 rotation = {0.0f, 0.0f, 0.0f};  // Euler degrees in the hierarchy helper
    Vec3 scale    = {1.0f, 1.0f, 1.0f};
};

// Position in 2D space.
struct Position2D {
    f32 x = 0.0f;
    f32 y = 0.0f;
    Position2D() = default;
    Position2D(f32 x_, f32 y_) : x(x_), y(y_) {}
};

// Velocity (rate of change).
struct Velocity2D {
    f32 x = 0.0f;
    f32 y = 0.0f;
    Velocity2D() = default;
    Velocity2D(f32 x_, f32 y_) : x(x_), y(y_) {}
};

// Acceleration.
struct Acceleration2D {
    f32 x = 0.0f;
    f32 y = 0.0f;
};

// Rotation angle (radians).
struct Rotation {
    f32 angle = 0.0f;
    Rotation() = default;
    explicit Rotation(f32 angle_) : angle(angle_) {}
};

// Scale factors.
struct Scale2D {
    f32 x = 1.0f;
    f32 y = 1.0f;
    Scale2D() = default;
    Scale2D(f32 x_, f32 y_) : x(x_), y(y_) {}
};

// Visual representation.
struct Sprite {
    std::string name;      // texture/sprite name
    u32 frameIndex = 0;    // for sprite sheets
};

// Health system.
struct Health {
    u32 current = 100;
    u32 max     = 100;
    Health() = default;
    Health(u32 current_, u32 max_) : current(current_), max(max_) {}
};

// Zero-cost marker component for tagging.
struct Tag { };
```

`Components.hpp` also declares `ParticleEmitterComponent`, `PersistentComponent` and
`DisabledTag`, and includes the 3D, camera, light, mesh, skybox and terrain component
headers. `Transform` is the component the scene hierarchy composes; `Position3D`,
`Rotation3D` and `Scale3D` live in `ecs/Components3D.hpp`.

### Custom components

Define your own components for game-specific data:

```cpp
// Damage-dealing weapon.
struct DamageDealer {
    u32 damagePerHit = 10;
    f32 cooldownTime = 0.2f;
    f32 timeSinceLastHit = 0.0f;
};

// Inventory system.
struct Inventory {
    std::vector<Item> items;
    u32 maxCapacity = 20;
};

// AI state machine.
struct AIController {
    enum State { Idle, Chasing, Attacking } state = Idle;
    Entity target = Entity();
    f32 visionRange = 100.0f;
};
```

### Component guidelines

- **Data only**: behaviour belongs in systems.
- **Copyable**: components are copied when an entity migrates between archetypes.
- **Small**: cache locality matters; aim for well under 64 bytes.
- **Default-constructible**: `Entity::getOrAdd<T>()` and `World::add<T>(e)` default it.
- **No heavy destructors or owning pointers**: prefer handles or asset ids.

---

## Entities

An entity is an id that aggregates components.

### Entity lifecycle

```cpp
// Create an entity. The name argument is accepted but not stored by the
// world; the editor keeps names in Editor::NameComponent.
Entity player = world.create("Player");

// Add components later.
world.add<Position2D>(player, Position2D{10.0f, 20.0f});
world.add<Velocity2D>(player, Velocity2D{5.0f, 0.0f});
world.add<Health>(player, Health{100, 100});

// Check and read.
if (world.has<Position2D>(player)) {
    Position2D* pos = world.get<Position2D>(player);
    pos->x += 5.0f;  // modify in place
}

// Add-or-get through the handle.
Health& health = player.getOrAdd<Health>();
health.current = 80;

// Remove a component (the entity migrates to a new archetype).
world.remove<Velocity2D>(player);

// Destroy the entity.
world.destroy(player);
```

### Important notes

- **Entity ids are 32-bit**; copy the handle freely.
- **`Entity::isValid()` only rejects the default `INVALID` id.** It does not prove the
  entity is still alive after `destroy`, so re-check with `world.isEntityAlive(e)`
  after structural changes.
- **Ids are not recycled** (`World::create` increments a counter), but stale handles
  still address the old slot; do not keep handles across destruction.
- **Component access is O(1)** after the entity's archetype is known.
- **Archetype migration is automatic** on add/remove and invalidates references
  returned earlier by `get<T>()`.
- **`World::create()` does not take component arguments.** Create, then `add<T>`.
- **The name argument is ignored.** `World::create("Player")` reads well at the call
  site, but the world stores no name; the editor uses `Editor::NameComponent`.

---

## Queries

Queries select entities matching a component signature.

### Query builder

```cpp
// Require Position2D and Velocity2D.
ComponentQuery moving;
moving.with<Position2D, Velocity2D>();

// Require Position2D, exclude a Disabled tag.
ComponentQuery visible;
visible.with<Position2D>().without<DisabledTag>();

// Require one of several components.
ComponentQuery armed;
armed.with<Health>().any<Shield, Armor>();  // Health AND (Shield OR Armor)
```

### Single-threaded iteration

The template arguments must match the callback's component parameters (after the
entity). The query can be narrower than the callback signature:

```cpp
world.forEach<Position2D, Velocity2D>(
    ComponentQuery().with<Position2D, Velocity2D>(),
    [deltaTime](Entity e, Position2D& pos, Velocity2D& vel) {
        pos.x += vel.x * deltaTime;
        pos.y += vel.y * deltaTime;
    }
);
```

### Parallel iteration

`forEachParallel` takes the job system by reference, then the callback:

```cpp
world.forEachParallel<Position2D, Velocity2D>(
    ComponentQuery().with<Position2D, Velocity2D>(),
    jobSystem,
    [deltaTime](Entity e, Position2D& pos, Velocity2D& vel) {
        pos.x += vel.x * deltaTime;  // each entity is visited by one worker
        pos.y += vel.y * deltaTime;
    }
);
```

The callback must be safe to run concurrently and must not add, remove or destroy
entities.

### Query performance

- **Archetype filtering** is one bitset match per archetype.
- **Entity iteration** inside an archetype is dense array access.
- **No sorting or searching** is required.
- **Work is split in batches of 1000 entities** per archetype for parallel queries.

---

## Systems

Systems encapsulate game logic over matching entities.

### Basic system

```cpp
class MovementSystem : public ISystem {
public:
    void onUpdate(World& world, f32 deltaTime) override {
        world.forEach<Position2D, Velocity2D>(
            ComponentQuery().with<Position2D, Velocity2D>(),
            [deltaTime](Entity e, Position2D& pos, Velocity2D& vel) {
                pos.x += vel.x * deltaTime;
                pos.y += vel.y * deltaTime;
            }
        );
    }
};
```

### System registry

`SystemRegistry` is a convenience owner; the engine and runtime are not required to
use it.

```cpp
SystemRegistry systems;
systems.add(std::make_unique<MovementSystem>());
systems.add(std::make_unique<PhysicsSystem>());
systems.add(std::make_unique<RenderSystem>());

// Game loop
while (running) {
    systems.updateAll(world, deltaTime);
    render();
}
```

`ISystem` has only `onUpdate`; there is no priority field. Registration order is
execution order.

### Deferred operations in systems

Do not modify the world directly inside `forEach` callbacks. Use `CommandBuffer`:

```cpp
class HealthSystem : public ISystem {
public:
    void onUpdate(World& world, f32 deltaTime) override {
        CommandBuffer commands;

        world.forEach<Health>(
            ComponentQuery().with<Health>(),
            [&commands](Entity e, Health& health) {
                if (health.current == 0) {
                    commands.destroy(e);  // queued until after iteration
                }
            }
        );

        commands.execute(world);  // apply all changes
    }
};
```

---

## Command Buffer

`CommandBuffer` defers entity modifications, enabling safe changes during query
iteration.

### Operations

```cpp
CommandBuffer commands;

// Create an entity, optionally with one or two components.
Entity empty  = commands.create();
Entity mover  = commands.create(Position2D{0.0f, 0.0f});
Entity walker = commands.create(Position2D{0.0f, 0.0f}, Velocity2D{10.0f, 0.0f});

// Add a component to an existing entity.
commands.addComponent<Velocity2D>(myEntity, Velocity2D{10.0f, 0.0f});

// Remove a component.
commands.removeComponent<Velocity2D>(myEntity);

// Destroy an entity.
commands.destroy(myEntity);

// Execute all queued operations in order.
commands.execute(world);
```

`create` accepts zero, one or two components; add further components with
`addComponent<T>`.

<div class="doc-callout doc-callout--warning">
  <p><strong>Placeholder handle.</strong> The <code>Entity</code> returned by
  <code>CommandBuffer::create</code> is not remapped by <code>execute</code>: the real
  entity is created by <code>World::create()</code> and the pending id is discarded. Do not
  pass that handle to <code>addComponent</code> or <code>get</code>; use the one/two-component
  overloads, or create the entity directly on the world outside iteration.</p>
</div>

### Why CommandBuffer?

Without deferred operations:

```cpp
// DANGEROUS: adding/removing components or destroying entities
// while an archetype is being iterated invalidates the iteration.
world.forEach<Position2D>([&](Entity e, Position2D& pos) {
    if (shouldDestroy(e)) {
        world.destroy(e);
    }
});
```

With CommandBuffer:

```cpp
// SAFE: changes are applied after the iteration completes.
CommandBuffer commands;
world.forEach<Position2D>([&](Entity e, Position2D& pos) {
    if (shouldDestroy(e)) {
        commands.destroy(e);
    }
});
commands.execute(world);
```

---

## Performance

### Practical guidance

1. **Use `forEachParallel`** for large, independent batches (roughly 1000+ entities).
2. **Batch structural changes** to reduce archetype migrations.
3. **Keep components small** for cache efficiency.
4. **Narrow the query** with `with` / `without` so fewer archetypes match.
5. **Measure your scene**: the test suite (`tests/test_phase2_3.cpp`) covers
   correctness; `tests/benchmarks.cpp` covers allocators and containers, not the ECS.

### Parallel scaling

`forEachParallel` builds one work item per archetype, or one per 1000-entity chunk
for larger archetypes, and waits on a `JobBarrier`. Each chunk touches a disjoint
index range, so component writes do not race. Structural changes are not allowed
inside the callback.

---

## API Reference

### World class

```cpp
class World {
public:
    // Entity lifecycle
    Entity create(const char* name = nullptr);
    void   destroy(Entity e);
    void   destroyAll();

    // Counts and validity
    u32 entityCount() const;
    u32 archetypeCount() const;
    bool isEntityAlive(Entity e) const;

    struct EntityLocation {
        u32 archetypeIndex = u32_max;
        u32 indexInArchetype = u32_max;
        bool alive = false;
    };
    EntityLocation getEntityLocation(Entity e) const;

    // Component access
    template<typename T, typename... Args>
    T& add(Entity e, Args&&... args);      // returns the stored component

    template<typename T>
    void remove(Entity e);

    template<typename T>
    bool has(Entity e) const;

    template<typename T>
    T* get(Entity e);                      // nullptr if absent

    template<typename T>
    const T* get(Entity e) const;

    // Query execution
    template<typename... Ts, typename Callback>
    void forEach(const ComponentQuery& query, Callback cb);

    template<typename... Ts, typename Callback>
    void forEachParallel(const ComponentQuery& query,
                         Threading::JobSystem& jobSystem,
                         Callback cb);
};
```

### Entity class

```cpp
class Entity {
public:
    static const Entity INVALID;

    u32  id() const;
    bool isValid() const;                  // id != u32_max

    template<typename T, typename... Args>
    T& add(Args&&... args);

    template<typename T>
    void remove();

    template<typename T>
    bool has() const;

    template<typename T>
    T* get();

    template<typename T>
    T& getOrAdd();                         // default-constructs when absent

    void destroy();

    explicit operator bool() const;
    bool operator==(const Entity& other) const;
};
```

### ComponentQuery class

```cpp
class ComponentQuery {
public:
    template<typename T, typename... Ts>
    ComponentQuery& with();                // all required

    template<typename T, typename... Ts>
    ComponentQuery& without();             // none present

    template<typename T, typename... Ts>
    ComponentQuery& any();                 // at least one present per call

    bool matches(const Archetype* archetype) const;
};
```

### ISystem interface

```cpp
class ISystem {
public:
    virtual ~ISystem() = default;
    virtual void onUpdate(World& world, f32 deltaTime) = 0;
};
```

### SystemRegistry class

```cpp
class SystemRegistry {
public:
    void add(std::unique_ptr<ISystem> system);
    void updateAll(World& world, f32 deltaTime);
    usize count() const;
};
```

### CommandBuffer class

```cpp
class CommandBuffer {
public:
    Entity create();
    template<typename T>   Entity create(const T& component);
    template<typename T1, typename T2>
    Entity create(const T1& c1, const T2& c2);

    template<typename T> void addComponent(Entity e, const T& component);
    template<typename T> void removeComponent(Entity e);

    void destroy(Entity e);
    void execute(World& world);
};
```

---

## Common Patterns

### Pattern 1: Movement system

```cpp
class MovementSystem : public ISystem {
    void onUpdate(World& world, f32 deltaTime) override {
        world.forEach<Position2D, Velocity2D>(
            ComponentQuery().with<Position2D, Velocity2D>(),
            [deltaTime](Entity e, Position2D& pos, Velocity2D& vel) {
                pos.x += vel.x * deltaTime;
                pos.y += vel.y * deltaTime;
            }
        );
    }
};
```

### Pattern 2: Damage and destruction

```cpp
class HealthSystem : public ISystem {
    void onUpdate(World& world, f32 deltaTime) override {
        CommandBuffer commands;

        world.forEach<Health>(
            ComponentQuery().with<Health>(),
            [&commands](Entity e, Health& health) {
                if (health.current <= 0) {
                    commands.destroy(e);
                }
            }
        );

        commands.execute(world);
    }
};
```

### Pattern 3: Conditional processing

```cpp
// Process entities that have Health and at least one of Shield/Armor.
world.forEach<Health>(
    ComponentQuery().with<Health>().any<Shield, Armor>(),
    [](Entity e, Health& health) {
        // ...
    }
);
```

### Pattern 4: Filtering with without

```cpp
// Update only active entities (no DisabledTag).
world.forEach<Position2D, Velocity2D>(
    ComponentQuery()
        .with<Position2D, Velocity2D>()
        .without<DisabledTag>(),
    [deltaTime](Entity e, Position2D& pos, Velocity2D& vel) {
        pos.x += vel.x * deltaTime;
        pos.y += vel.y * deltaTime;
    }
);
```

---

## Troubleshooting

### Issue: "Entity is not valid"

**Cause**: the handle is default-constructed (`Entity()` / `Entity::INVALID`).

**Solution**: check `isValid()` before use. After `destroy` or an archetype change,
also check `world.isEntityAlive(entity)`.

```cpp
if (entity.isValid()) {
    // Safe to query components; use isEntityAlive after structural changes.
}
```

### Issue: "Component not found"

**Cause**: the entity does not have that component.

**Solution**: check `has<T>()`, or use `get<T>()`, which returns `nullptr`.

```cpp
if (world.has<Position2D>(entity)) {
    auto* pos = world.get<Position2D>(entity);
}
```

### Issue: iteration breaks or crashes

**Cause**: `add`, `remove`, `create` or `destroy` inside `forEach`.

**Solution**: queue the change in `CommandBuffer` and execute it after the loop.

```cpp
// WRONG:
world.forEach<Position2D>([&](Entity e, Position2D& pos) {
    if (condition) world.destroy(e);
});

// CORRECT:
CommandBuffer commands;
world.forEach<Position2D>([&](Entity e, Position2D& pos) {
    if (condition) commands.destroy(e);
});
commands.execute(world);
```

### Issue: performance degradation

**Cause**: many tiny queries, frequent structural changes, or sequential iteration
of a large batch.

**Solution**:

- Batch structural changes to reduce archetype migrations.
- Use `forEachParallel` for large independent batches.
- Narrow queries so fewer archetypes are visited.
- Profile your own scene; do not assume a fixed budget.

---

## Next Steps

- Read [ECS examples](./examples.md) for complete programs.
- See [ECS core](./core.md) for the short API summary.
- See [Scene manager](./scene.md) for the hierarchy and scene serializer built on top.
- Check `tests/test_phase2_3.cpp` for the correctness suite.
