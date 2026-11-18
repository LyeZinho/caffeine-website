# ECS core

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Verificado em: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Fonte: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/ecs/World.hpp"><code>ecs/World.hpp</code></a></span>
</div>

<p class="doc-lede">A Caffeine usa um ECS baseado em arquétipos: entidades com o mesmo
conjunto de componentes vivem em memória contígua, e as queries iteram os arquétipos
correspondentes em vez de varrer todas as entidades.</p>

## Conceitos

| Termo | Significado |
|---|---|
| **Entity** | Um id `u32` mais um `World*`. Sem dados, sem lógica, sem virtuals. |
| **Component** | Uma struct simples registada por tipo; sem métodos, sem classe base. |
| **Archetype** | O conjunto de entidades com um `ComponentSet` idêntico; os arrays de componentes são contíguos por tipo. |
| **Query** | Um `ComponentQuery` com componentes obrigatórios, excluídos e qualquer-um. |
| **World** | Detém entidades, arquétipos e o armazenamento de componentes. |
| **System** | Um objeto com `onUpdate(World&, f32)`; o motor ou o jogo chama-o. |

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

`Entity::INVALID` é o valor por omissão. Um id destruído pode ser reutilizado; handles
antigos não têm verificação de geração, por isso trate-os como curtos e volte a
consultar após mudanças estruturais.

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

`ComponentQuery` suporta:

- `with<T...>()` — o arquétipo tem de conter todos os componentes listados.
- `without<T...>()` — o arquétipo não pode conter nenhum deles.
- `any<T...>()` — pelo menos um dos componentes listados tem de estar presente.
- `matches(const Archetype*)` — usado por `World::forEach`.

O callback recebe os componentes pedidos pela query mais o id da entidade. A ordem dos
argumentos segue a query; confirme as overloads em `World.hpp`.

### Iteração paralela

```cpp
world.forEachParallel(query, jobSystem,
    [](Entity entity, Position3D& position, const Velocity3D& velocity) {
        position.value += velocity.value;
    });
```

`forEachParallel` divide intervalos de arquétipos pelo job system. O callback tem de ser
seguro para correr em paralelo e não pode alterar a estrutura do world.

## Alterações estruturais

`add`, `remove`, `destroy` e `create` movem entidades entre arquétipos. **Não** os chame
dentro de `forEach` / `forEachParallel`; recolha as entidades primeiro e aplique as
mudanças depois da iteração. Use `CommandBuffer` para create/destroy diferido quando um
sistema precisa de enfileirar trabalho estrutural.

## Sistemas

`ISystem` é intencionalmente pequeno:

```cpp
class ISystem {
public:
    virtual ~ISystem() = default;
    virtual void onUpdate(World& world, f32 deltaTime) = 0;
};
```

O motor detém a lista de sistemas (renderer, física, animação, scripting, código de
jogo). Não há um registo global escondido; um sistema é um objeto que o host cria e
chama por ordem. `ScriptSystem` é um exemplo (`src/caffeine/script/ScriptSystem.hpp`).

## Armazenamento e iteração

- As entidades vivem em `Vector<EntityData>`; cada entrada guarda o índice do arquétipo
  e o índice dentro desse arquétipo.
- Remover uma entidade troca o último elemento para o slot livre; a localização da
  entidade movida é corrigida.
- Adicionar/remover um componente copia os componentes da entidade para um novo
  arquétipo e remove-a do antigo.
- As queries iteram arquétipos, por isso arquétipos vazios custam quase nada.

## Exemplo: um sistema de movimento mínimo

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

## Testes

A suite ECS vive em `tests/test_phase2_3.cpp` e ficheiros relacionados. Cobre criação e
destruição de entidades, add/remove de componentes, migração de arquétipos, matching de
queries, iteração paralela e a integração com o scene manager.

## Páginas relacionadas

- [Scene manager](scene.md) — hierarquia pai/filho e serialização de cenas.
- [Exemplos de ECS](examples.md)
- [Reflexão de componentes](../api/scripting-components.md)
- [Job system](../concurrency/job-system.md)
