# Caffeine ECS Core Documentation

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span>Atualizado em: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Fonte: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/ecs/World.hpp"><code>ecs/World.hpp</code></a></span>
</div>

<p class="doc-lede">O Caffeine usa um ECS por arquétipos: entidades são ids numéricos,
componentes são structs simples e todas as entidades com o mesmo conjunto de
componentes partilham um arquétipo denso que as queries percorrem linearmente.</p>

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

O ECS guarda o estado do jogo como dados e executa comportamento em sistemas. Uma
**entidade** é um id `u32` mais um `World*`; um **componente** é uma struct simples
registada por tipo; um **sistema** é um objeto com `onUpdate(World&, f32)`.

### Why ECS?

Código orientado a objetos coloca estado e comportamento em hierarquias profundas de
classes. Isso dificulta a combinação de comportamentos, espalha dados relacionados
pela memória e torna a iteração paralela segura difícil.

O ECS do Caffeine compõe em vez de herdar:

- **Componentes** guardam apenas dados (`Position2D`, `Velocity2D`, `Health`, as tuas structs).
- **Entidades** são ids que agrupam componentes; não têm dados próprios.
- **Queries** selecionam todas as entidades com uma assinatura de componentes.
- **Sistemas** recebem os componentes correspondentes e alteram-nos.

Resultado: arrays de componentes contíguos, correspondência de arquétipos barata e um
lugar claro para cada parte da lógica.

### Design goals

- Iteração de queries rápida sobre arrays densos.
- Alterações estruturais explícitas (`add`, `remove`, `destroy`), nunca escondidas num getter.
- Iteração paralela opcional, sem locks em torno do armazenamento de componentes.
- Sem registo global de sistemas: o host decide que sistemas correm e por que ordem.

A suite de correção está em `tests/test_phase2_3.cpp`; mede o orçamento de frame na
tua própria cena em vez de confiar num número fixo.

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

**World**: detém os ids de entidades, os arquétipos e o armazenamento de componentes.
Cria e destrói entidades, migra entidades entre arquétipos quando componentes são
adicionados ou removidos e executa `forEach` / `forEachParallel`.

**Archetype**: agrupa entidades com uma assinatura de componentes idêntica. Por exemplo:

- `[Transform]`: objetos estáticos da cena
- `[Transform, Position3D, Rotation3D, Scale3D]`: transforms 3D
- `[Position2D, Velocity2D]`: entidades 2D em movimento

Todas as entidades de um arquétipo guardam componentes em arrays densos, um array por tipo.

**ComponentID**: um `u32` atribuído na primeira chamada a `ComponentID::get<T>()`. O
contador é atómico; o máximo é 256 tipos de componente (`ComponentID::MAX_COMPONENTS`).

**ComponentSet**: um bitset de 256 bits com os ids dos componentes. A procura de
arquétipos faz hash do conjunto; a correspondência de queries faz AND dos bitsets, pelo
que é O(1) por arquétipo e não por entidade.

**Entity**: um handle leve (`u32` id + `World*`). Pode consultar, adicionar, remover e
destruir através do world que a criou.

**ComponentQuery**: um builder com `with<A, B>()`, `without<C>()` e `any<D, E>()`.
`matches(const Archetype*)` é o que `World::forEach` usa.

**System**: implementa `ISystem`; o host chama `onUpdate(World&, f32 deltaTime)`.
Movimento, rendering e física são sistemas normais.

---

## Components

Componentes são structs simples que contêm apenas estado.

### Predefined components

`ecs/Components.hpp` traz o transform partilhado e um pequeno conjunto 2D:

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

`Components.hpp` declara ainda `ParticleEmitterComponent`, `PersistentComponent` e
`DisabledTag`, e inclui os headers de componentes 3D, câmara, luz, mesh, skybox e
terreno. `Transform` é o componente que a hierarquia da cena compõe; `Position3D`,
`Rotation3D` e `Scale3D` vivem em `ecs/Components3D.hpp`.

### Custom components

Define os teus componentes para dados específicos do jogo:

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

- **Apenas dados**: o comportamento pertence aos sistemas.
- **Copiável**: os componentes são copiados quando uma entidade migra de arquétipo.
- **Pequeno**: a localidade de cache importa; aponta para bem menos de 64 bytes.
- **Default-constructible**: `Entity::getOrAdd<T>()` e `World::add<T>(e)` usam o default.
- **Sem destrutores pesados nem ponteiros com posse**: prefere handles ou ids de assets.

---

## Entities

Uma entidade é um id que agrega componentes.

### Entity Lifecycle

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

### Important Notes

- **Os ids de entidade são de 32 bits**; copia o handle livremente.
- **`Entity::isValid()` apenas rejeita o id `INVALID` por omissão.** Não prova que a
  entidade continua viva depois de `destroy`; volta a verificar com
  `world.isEntityAlive(e)` após alterações estruturais.
- **Os ids não são reciclados** (`World::create` incrementa um contador), mas handles
  antigos continuam a apontar para o slot antigo; não guards handles depois de destruir.
- **O acesso a componentes é O(1)** depois de conhecido o arquétipo da entidade.
- **A migração de arquétipo é automática** em add/remove e invalida referências
  devolvidas antes por `get<T>()`.
- **`World::create()` não aceita componentes.** Cria a entidade e depois usa `add<T>`.
- **O argumento de nome é ignorado.** `World::create("Player")` lê bem no local da
  chamada, mas o world não guarda nome; o editor usa `Editor::NameComponent`.

---

## Queries

As queries selecionam entidades que correspondem a uma assinatura de componentes.

### Query Builder

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

### Single-Threaded Iteration

Os argumentos de template têm de corresponder aos parâmetros de componentes do
callback (depois da entidade). A query pode ser mais restrita que a assinatura:

```cpp
world.forEach<Position2D, Velocity2D>(
    ComponentQuery().with<Position2D, Velocity2D>(),
    [deltaTime](Entity e, Position2D& pos, Velocity2D& vel) {
        pos.x += vel.x * deltaTime;
        pos.y += vel.y * deltaTime;
    }
);
```

### Parallel Iteration

`forEachParallel` recebe o job system por referência e depois o callback:

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

O callback tem de ser seguro em execução concorrente e não pode adicionar, remover ou
destruir entidades.

### Query Performance

- **A filtragem por arquétipo** é uma comparação de bitsets por arquétipo.
- **A iteração de entidades** dentro de um arquétipo é acesso a arrays densos.
- **Não é necessário ordenar nem procurar.**
- **O trabalho é dividido em lotes de 1000 entidades** por arquétipo nas queries paralelas.

---

## Systems

Os sistemas encapsulam lógica de jogo sobre entidades correspondentes.

### Basic System

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

### System Registry

`SystemRegistry` é um proprietário de conveniência; a engine e o runtime não são
obrigados a usá-lo.

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

`ISystem` só tem `onUpdate`; não existe campo de prioridade. A ordem de registo é a
ordem de execução.

### Deferred Operations in Systems

Não alteres o world diretamente dentro de callbacks `forEach`. Usa `CommandBuffer`:

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

`CommandBuffer` adia modificações de entidades, permitindo alterações seguras durante a
iteração de queries.

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

`create` aceita zero, um ou dois componentes; adiciona os restantes com
`addComponent<T>`.

<div class="doc-callout doc-callout--warning">
  <p><strong>Handle provisório.</strong> O <code>Entity</code> devolvido por
  <code>CommandBuffer::create</code> não é remapeado por <code>execute</code>: a entidade
  real é criada por <code>World::create()</code> e o id pendente é descartado. Não passes
  esse handle a <code>addComponent</code> nem a <code>get</code>; usa as sobrecargas de um/dois
  componentes, ou cria a entidade diretamente no world fora da iteração.</p>
</div>

### Why CommandBuffer?

Sem operações adiadas:

```cpp
// DANGEROUS: adding/removing components or destroying entities
// while an archetype is being iterated invalidates the iteration.
world.forEach<Position2D>([&](Entity e, Position2D& pos) {
    if (shouldDestroy(e)) {
        world.destroy(e);
    }
});
```

Com CommandBuffer:

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

1. **Usa `forEachParallel`** para lotes grandes e independentes (cerca de 1000+ entidades).
2. **Agrupa alterações estruturais** para reduzir migrações de arquétipo.
3. **Mantém os componentes pequenos** para eficiência de cache.
4. **Restringe a query** com `with` / `without` para corresponder a menos arquétipos.
5. **Mede a tua cena**: a suite (`tests/test_phase2_3.cpp`) cobre correção;
   `tests/benchmarks.cpp` cobre allocators e containers, não o ECS.

### Parallel Scaling

`forEachParallel` cria um item de trabalho por arquétipo, ou um por bloco de 1000
entidades nos arquétipos maiores, e espera por uma `JobBarrier`. Cada bloco toca num
intervalo de índices disjunto, pelo que as escritas de componentes não colidem.
Alterações estruturais não são permitidas dentro do callback.

---

## API Reference

### World Class

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

### Entity Class

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

### ComponentQuery Class

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

### ISystem Interface

```cpp
class ISystem {
public:
    virtual ~ISystem() = default;
    virtual void onUpdate(World& world, f32 deltaTime) = 0;
};
```

### SystemRegistry Class

```cpp
class SystemRegistry {
public:
    void add(std::unique_ptr<ISystem> system);
    void updateAll(World& world, f32 deltaTime);
    usize count() const;
};
```

### CommandBuffer Class

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

### Pattern 1: Movement System

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

### Pattern 2: Damage and Destruction

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

### Pattern 3: Conditional Processing

```cpp
// Process entities that have Health and at least one of Shield/Armor.
world.forEach<Health>(
    ComponentQuery().with<Health>().any<Shield, Armor>(),
    [](Entity e, Health& health) {
        // ...
    }
);
```

### Pattern 4: Filtering with Without

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

**Causa**: o handle foi construído por omissão (`Entity()` / `Entity::INVALID`).

**Solução**: verifica `isValid()` antes de usar. Depois de `destroy` ou de uma mudança
de arquétipo, verifica também `world.isEntityAlive(entity)`.

```cpp
if (entity.isValid()) {
    // Safe to query components; use isEntityAlive after structural changes.
}
```

### Issue: "Component not found"

**Causa**: a entidade não tem esse componente.

**Solução**: verifica `has<T>()` ou usa `get<T>()`, que devolve `nullptr`.

```cpp
if (world.has<Position2D>(entity)) {
    auto* pos = world.get<Position2D>(entity);
}
```

### Issue: iteration breaks or crashes

**Causa**: `add`, `remove`, `create` ou `destroy` dentro de `forEach`.

**Solução**: enfileira a alteração num `CommandBuffer` e executa-a depois do ciclo.

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

**Causa**: muitas queries pequenas, alterações estruturais frequentes ou iteração
sequencial de um lote grande.

**Solução**:

- Agrupa alterações estruturais para reduzir migrações de arquétipo.
- Usa `forEachParallel` em lotes grandes e independentes.
- Restringe as queries para visitar menos arquétipos.
- Faz profiling da tua cena; não assumas um orçamento fixo.

---

## Next Steps

- Lê [ECS examples](./examples.md) para programas completos.
- Vê [ECS core](./core.md) para o resumo curto da API.
- Vê [Scene manager](./scene.md) para a hierarquia e o serializador de cenas.
- Consulta `tests/test_phase2_3.cpp` para a suite de correção.
