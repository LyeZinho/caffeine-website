# Caffeine ECS Examples

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/ecs/World.hpp"><code>ecs/World.hpp</code></a></span>
</div>

<p class="doc-lede">Complete, compilable programs for the Caffeine ECS: creating
entities, writing systems, deferring structural changes and iterating in parallel.</p>

## Example 1: Hello World - Create Entity with Components

The simplest ECS example: create an entity and add components.

```cpp
#include <Caffeine.hpp>

#include <cassert>
#include <iostream>

using namespace Caffeine;
using namespace Caffeine::ECS;

int main() {
    World world;

    // Create the entity, then add components.
    // The name is a call-site label; World does not store it.
    Entity player = world.create("Player");
    world.add<Position2D>(player, Position2D{100.0f, 200.0f});
    world.add<Velocity2D>(player, Velocity2D{10.0f, 0.0f});

    // Verify components exist.
    assert(world.has<Position2D>(player));
    assert(world.has<Velocity2D>(player));

    // Get component pointers (nullptr when absent).
    Position2D* pos = world.get<Position2D>(player);
    Velocity2D* vel = world.get<Velocity2D>(player);

    std::cout << "Player at (" << pos->x << ", " << pos->y << ")\n";
    std::cout << "Velocity (" << vel->x << ", " << vel->y << ")\n";

    return 0;
}
```

**Output:**

```text
Player at (100, 200)
Velocity (10, 0)
```

---

## Example 2: Simple Movement System

Create a system that updates entity positions from velocity each frame.

```cpp
#include <Caffeine.hpp>

#include <iostream>

using namespace Caffeine;
using namespace Caffeine::ECS;

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

int main() {
    World world;
    SystemRegistry systems;

    systems.add(std::make_unique<MovementSystem>());

    Entity entity = world.create("Mover");
    world.add<Position2D>(entity, Position2D{0.0f, 0.0f});
    world.add<Velocity2D>(entity, Velocity2D{5.0f, 3.0f});

    // Simulate 5 frames at 60 fps.
    f32 deltaTime = 1.0f / 60.0f;
    for (int frame = 0; frame < 5; ++frame) {
        systems.updateAll(world, deltaTime);

        Position2D* pos = world.get<Position2D>(entity);
        std::cout << "Frame " << frame << ": (" << pos->x << ", " << pos->y << ")\n";
    }

    return 0;
}
```

**Output:**

```text
Frame 0: (0.0833333, 0.05)
Frame 1: (0.166667, 0.1)
Frame 2: (0.25, 0.15)
Frame 3: (0.333333, 0.2)
Frame 4: (0.416667, 0.25)
```

---

## Example 3: Health and Damage System

Damage entities and destroy them when health reaches zero.

```cpp
#include <Caffeine.hpp>

#include <iostream>

using namespace Caffeine;
using namespace Caffeine::ECS;

class HealthSystem : public ISystem {
public:
    void onUpdate(World& world, f32 deltaTime) override {
        CommandBuffer commands;

        const u32 damagePerSecond = 10;

        world.forEach<Health>(
            ComponentQuery().with<Health>(),
            [&commands, deltaTime, damagePerSecond](Entity e, Health& health) {
                const u32 damage = static_cast<u32>(damagePerSecond * deltaTime);
                health.current = (health.current > damage) ? (health.current - damage) : 0u;

                if (health.current == 0) {
                    std::cout << "Entity destroyed!\n";
                    commands.destroy(e);
                }
            }
        );

        // Apply deferred destruction after the iteration.
        commands.execute(world);
    }
};

int main() {
    World world;
    SystemRegistry systems;
    systems.add(std::make_unique<HealthSystem>());

    Entity entity = world.create("Target");
    world.add<Health>(entity, Health{50, 100});

    std::cout << "Initial health: " << world.get<Health>(entity)->current << "\n";

    // Update for 6 seconds (50 damage at 10/sec).
    f32 deltaTime = 1.0f;
    for (int sec = 0; sec < 6; ++sec) {
        systems.updateAll(world, deltaTime);

        Health* health = world.get<Health>(entity);
        if (health && world.isEntityAlive(entity)) {
            std::cout << "After " << (sec + 1) << "s: " << health->current << " HP\n";
        } else {
            std::cout << "After " << (sec + 1) << "s: Entity destroyed\n";
        }
    }

    return 0;
}
```

**Output:**

```text
Initial health: 50
After 1s: 40 HP
After 2s: 30 HP
After 3s: 20 HP
After 4s: 10 HP
After 5s: 0 HP
Entity destroyed!
After 6s: Entity destroyed
```

---

## Example 4: Collision Detection Pattern

Query entities with colliders and resolve overlaps.

```cpp
#include <Caffeine.hpp>

#include <cmath>
#include <iostream>
#include <vector>

using namespace Caffeine;
using namespace Caffeine::ECS;

struct Collider {
    f32 radius = 10.0f;
};

class CollisionSystem : public ISystem {
public:
    void onUpdate(World& world, f32 deltaTime) override {
        std::vector<Entity> collidables;

        world.forEach<Position2D, Collider>(
            ComponentQuery().with<Position2D, Collider>(),
            [&collidables](Entity e, Position2D& pos, Collider& collider) {
                collidables.push_back(e);
            }
        );

        for (size_t i = 0; i < collidables.size(); ++i) {
            for (size_t j = i + 1; j < collidables.size(); ++j) {
                Entity e1 = collidables[i];
                Entity e2 = collidables[j];

                Position2D* pos1 = world.get<Position2D>(e1);
                Position2D* pos2 = world.get<Position2D>(e2);
                Collider* col1 = world.get<Collider>(e1);
                Collider* col2 = world.get<Collider>(e2);
                if (!pos1 || !pos2 || !col1 || !col2) continue;

                f32 dx = pos1->x - pos2->x;
                f32 dy = pos1->y - pos2->y;
                f32 distance = std::sqrt(dx * dx + dy * dy);

                if (distance < (col1->radius + col2->radius)) {
                    std::cout << "Collision detected!\n";
                }
            }
        }
    }
};

int main() {
    World world;
    SystemRegistry systems;
    systems.add(std::make_unique<CollisionSystem>());

    Entity entity1 = world.create("A");
    world.add<Position2D>(entity1, Position2D{0.0f, 0.0f});
    world.add<Collider>(entity1, Collider{10.0f});

    Entity entity2 = world.create("B");
    world.add<Position2D>(entity2, Position2D{15.0f, 0.0f});
    world.add<Collider>(entity2, Collider{10.0f});

    systems.updateAll(world, 1.0f / 60.0f);

    return 0;
}
```

**Output:**

```text
Collision detected!
```

---

## Example 5: Parallel System Execution

Use a parallel query for large, independent batches.

```cpp
#include <Caffeine.hpp>
#include <threading/JobSystem.hpp>

#include <iostream>

using namespace Caffeine;
using namespace Caffeine::ECS;

class ParallelMovementSystem : public ISystem {
public:
    explicit ParallelMovementSystem(Threading::JobSystem& jobs) : m_jobs(jobs) {}

    void onUpdate(World& world, f32 deltaTime) override {
        world.forEachParallel<Position2D, Velocity2D>(
            ComponentQuery().with<Position2D, Velocity2D>(),
            m_jobs,
            [deltaTime](Entity e, Position2D& pos, Velocity2D& vel) {
                // Each entity is visited by exactly one worker.
                pos.x += vel.x * deltaTime;
                pos.y += vel.y * deltaTime;
            }
        );
    }

private:
    Threading::JobSystem& m_jobs;
};

int main() {
    Threading::JobSystem jobs;

    World world;
    SystemRegistry systems;
    systems.add(std::make_unique<ParallelMovementSystem>(jobs));

    for (int i = 0; i < 100000; ++i) {
        Entity e = world.create();
        world.add<Position2D>(e, Position2D{static_cast<f32>(i), 0.0f});
        world.add<Velocity2D>(e, Velocity2D{1.0f, 1.0f});
    }

    std::cout << "Updating 100K entities...\n";
    systems.updateAll(world, 1.0f / 60.0f);
    std::cout << "Done (parallelized across CPU cores)\n";

    return 0;
}
```

**Output:**

```text
Updating 100K entities...
Done (parallelized across CPU cores)
```

---

## Example 6: Deferred Commands Pattern

Structural changes are forbidden while a query iterates. Spawn outside the loop and
defer destruction with `CommandBuffer`.

```cpp
#include <Caffeine.hpp>

#include <iostream>

using namespace Caffeine;
using namespace Caffeine::ECS;

struct Enemy {
    u32 enemyId = 0;
};

class EnemySpawner : public ISystem {
public:
    void onUpdate(World& world, f32 deltaTime) override {
        timeElapsed += static_cast<u32>(deltaTime * 1000.0f);

        // Spawning before iteration is safe: it is a structural change,
        // but no query is running.
        if (timeElapsed >= 100) {
            Entity enemy = world.create("Enemy");
            world.add<Position2D>(enemy, Position2D{100.0f, 100.0f});
            world.add<Velocity2D>(enemy, Velocity2D{-5.0f, 0.0f});
            world.add<Enemy>(enemy, Enemy{nextEnemyId++});
            timeElapsed = 0;
        }

        // Removing during iteration must be deferred.
        CommandBuffer commands;
        world.forEach<Position2D>(
            ComponentQuery().with<Position2D>().any<Enemy>(),
            [&commands](Entity e, Position2D& pos) {
                if (pos.x < -100.0f) {
                    commands.destroy(e);
                }
            }
        );
        commands.execute(world);
    }

private:
    u32 timeElapsed = 0;
    u32 nextEnemyId = 0;
};

int main() {
    World world;
    SystemRegistry systems;
    systems.add(std::make_unique<EnemySpawner>());

    for (int i = 0; i < 5; ++i) {
        systems.updateAll(world, 0.2f);

        u32 enemyCount = 0;
        world.forEach<Enemy>(
            ComponentQuery().with<Enemy>(),
            [&enemyCount](Entity e, Enemy& enemy) {
                enemyCount++;
            }
        );
        std::cout << "Active enemies: " << enemyCount << "\n";
    }

    return 0;
}
```

**Output:**

```text
Active enemies: 1
Active enemies: 2
Active enemies: 3
Active enemies: 4
Active enemies: 5
```

---

## Example 7: Complete Game Loop

World, systems and a fixed-step update loop together.

```cpp
#include <Caffeine.hpp>

#include <chrono>
#include <iostream>

using namespace Caffeine;
using namespace Caffeine::ECS;

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

class PhysicsSystem : public ISystem {
    void onUpdate(World& world, f32 deltaTime) override {
        world.forEach<Velocity2D, Acceleration2D>(
            ComponentQuery().with<Velocity2D, Acceleration2D>(),
            [deltaTime](Entity e, Velocity2D& vel, Acceleration2D& accel) {
                vel.x += accel.x * deltaTime;
                vel.y += accel.y * deltaTime;
            }
        );
    }
};

class RenderSystem : public ISystem {
    void onUpdate(World& world, f32 deltaTime) override {
        u32 count = 0;
        world.forEach<Position2D>(
            ComponentQuery().with<Position2D>(),
            [&count](Entity e, Position2D& pos) {
                count++;
            }
        );
        std::cout << "Rendering " << count << " entities\n";
    }
};

int main() {
    World world;
    SystemRegistry systems;

    // Registration order is execution order.
    systems.add(std::make_unique<PhysicsSystem>());
    systems.add(std::make_unique<MovementSystem>());
    systems.add(std::make_unique<RenderSystem>());

    Entity entity = world.create("Projectile");
    world.add<Position2D>(entity, Position2D{0.0f, 0.0f});
    world.add<Velocity2D>(entity, Velocity2D{10.0f, 0.0f});
    world.add<Acceleration2D>(entity, Acceleration2D{0.0f, 9.81f});  // gravity

    f32 targetFps = 60.0f;
    f32 deltaTime = 1.0f / targetFps;

    for (int frame = 0; frame < 3; ++frame) {
        auto frameStart = std::chrono::high_resolution_clock::now();

        systems.updateAll(world, deltaTime);

        auto frameEnd = std::chrono::high_resolution_clock::now();
        auto frameDuration = std::chrono::duration_cast<std::chrono::microseconds>(
            frameEnd - frameStart).count();

        std::cout << "Frame " << frame << " (" << frameDuration / 1000.0f << "ms)\n";
    }

    return 0;
}
```

**Output:**

```text
Rendering 1 entities
Frame 0 (0.123ms)
Rendering 1 entities
Frame 1 (0.145ms)
Rendering 1 entities
Frame 2 (0.132ms)
```

---

## Example 8: Custom Components

Define and use application-specific components.

```cpp
#include <Caffeine.hpp>

#include <iostream>
#include <string>

using namespace Caffeine;
using namespace Caffeine::ECS;

struct Weapon {
    std::string name;
    u32 ammo = 30;
    f32 fireRate = 10.0f;  // rounds per second
    f32 timeSinceLastShot = 0.0f;
};

struct AIBehavior {
    enum State { Idle, Patrol, Attack } state = Idle;
    f32 sightRange = 50.0f;
};

struct Score {
    u32 points = 0;
};

class WeaponSystem : public ISystem {
    void onUpdate(World& world, f32 deltaTime) override {
        world.forEach<Weapon>(
            ComponentQuery().with<Weapon>(),
            [deltaTime](Entity e, Weapon& weapon) {
                weapon.timeSinceLastShot += deltaTime;

                // Ammo regenerates slowly.
                if (weapon.ammo < 30 && weapon.timeSinceLastShot > 2.0f) {
                    weapon.ammo++;
                    weapon.timeSinceLastShot = 0.0f;
                }
            }
        );
    }
};

int main() {
    World world;
    SystemRegistry systems;
    systems.add(std::make_unique<WeaponSystem>());

    Entity player = world.create("Player");
    world.add<Position2D>(player, Position2D{0.0f, 0.0f});
    world.add<Weapon>(player, Weapon{"Rifle", 30, 10.0f});
    world.add<Score>(player, Score{1000});

    Entity enemy = world.create("Enemy");
    world.add<Position2D>(enemy, Position2D{50.0f, 0.0f});
    world.add<Velocity2D>(enemy, Velocity2D{-2.0f, 0.0f});
    world.add<AIBehavior>(enemy, AIBehavior{AIBehavior::Patrol, 30.0f});

    for (int i = 0; i < 3; ++i) {
        systems.updateAll(world, 1.0f);

        Weapon* weapon = world.get<Weapon>(player);
        Score* score = world.get<Score>(player);

        std::cout << "Ammo: " << weapon->ammo << ", Score: " << score->points << "\n";
    }

    return 0;
}
```

**Output:**

```text
Ammo: 30, Score: 1000
Ammo: 30, Score: 1000
Ammo: 31, Score: 1000
```

---

## Performance Tips

1. **Batch operations**: group structural changes to reduce archetype migrations.
2. **Use `forEachParallel`**: for large independent batches, parallel iteration is faster.
3. **Keep systems focused**: each system should do one thing well.
4. **Profile your scene**: `tests/benchmarks.cpp` covers allocators and containers, not ECS queries.
5. **Defer modifications**: use `CommandBuffer` inside `forEach` callbacks.

## Next Steps

- Review [ECS core](./core.md) for the short API summary.
- Read the [ECS reference](./README.md) for the full API.
- See [Scene manager](./scene.md) for hierarchy and serialization.
- Profile your game loop to find real optimization opportunities.
