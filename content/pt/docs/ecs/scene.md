# 🗺️ Scene Manager

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Scene</code></span>
  <span>Atualizado em: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Fonte: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/SceneManager.hpp"><code>scene/SceneManager.hpp</code></a></span>
</div>

<p class="doc-lede">A camada de cena acrescenta ao ECS uma hierarquia parent/child,
world transforms e uma pilha de cenas, além dos serializadores que escrevem um world
num ficheiro <code>.caf</code>.</p>

---

## Visão Geral

A camada de cena são algumas peças pequenas por cima de `ECS::World`:

- `Scene::Parent` — o link de parent usado pela hierarquia.
- `Scene::WorldTransform` — a matriz resolvida de cada entidade.
- `Scene::EntityLayer` — a camada de render herdada.
- `Scene::propagateTransforms` — recalcula as matrizes globais e as camadas herdadas.
- `Scene::SceneManager` — uma pilha de worlds e um temporizador de transição.
- `Scene::SceneSerializer` — o serializador mínimo de cena (binário/JSON).
- `Editor::SceneSerializer` — o serializador completo de projeto usado pelo Doppio,
  pelo runtime e pela C ABI.

<dl>
  <dt><code>Parent</code></dt>
  <dd>Guarda a entidade pai e uma flag <code>dirty</code>. A flag é serializada, mas
  <code>propagateTransforms</code> recalcula todas as entidades em cada chamada; não
  salta entradas limpas.</dd>
  <dt><code>WorldTransform</code></dt>
  <dd>Uma <code>Mat4</code> por entidade, escrita por <code>propagateTransforms</code>.
  Os componentes <code>Transform</code> locais nunca são reescritos pela herança.</dd>
  <dt><code>EntityLayer</code></dt>
  <dd>Uma camada <code>u8</code> herdada do pai quando o filho não tem camada própria.</dd>
</dl>

---

## API

```cpp
namespace Caffeine::Scene {

// ── Components ───────────────────────────────────────────────────────────────

struct Parent {
    ECS::Entity parent = ECS::Entity::INVALID;
    bool        dirty  = true;
};

struct WorldTransform {
    Mat4 matrix = Mat4::identity();
};

struct EntityLayer {
    u8 layer = 0;
};

// ── Hierarchy ────────────────────────────────────────────────────────────────

Mat4 buildLocalTRS(const ECS::Transform& t);
Mat4 buildLocalTRS_3D(const ECS::Position3D* p,
                      const ECS::Rotation3D* r,
                      const ECS::Scale3D* s);
Mat4 localMatrix(ECS::World& world, ECS::Entity e);
Mat4 computeWorldMatrix(ECS::World& world, ECS::Entity e, int depth = 0);

// Recomputes WorldTransform for every entity and inherits EntityLayer.
void propagateTransforms(ECS::World& world);

// True when the entity or any ancestor has ECS::DisabledTag.
bool isEffectivelyDisabled(ECS::World& world, ECS::Entity e);

// ── Minimal scene serializer (Scene::) ───────────────────────────────────────

class SceneSerializer {
public:
    explicit SceneSerializer(ECS::World& world);

    bool serialize(const char* path) const;    // binary .caf via CafWriter
    bool deserialize(const char* path);

    bool serializeJson(const char* path) const;  // debug dump
    bool deserializeJson(const char* path);      // currently returns false

    bool serializeToMemory(std::vector<u8>& out) const;
    bool deserializeFromMemory(const std::vector<u8>& data);

private:
    ECS::World& m_world;
};

// ── Scene manager ────────────────────────────────────────────────────────────

struct Color {
    u8 r = 0, g = 0, b = 0, a = 255;
};

enum class TransitionType : u8 { None, Fade, Slide, Custom };

struct TransitionConfig {
    TransitionType type      = TransitionType::Fade;
    f32            duration  = 0.5f;
    Color          fadeColor = {};
};

class SceneManager {
public:
    using SceneHandle = u32;
    static constexpr SceneHandle kInvalidHandle = ~u32(0);

    SceneHandle loadScene(const char* path, bool async = false);
    bool        switchScene(const char* path, TransitionConfig trans = {});
    bool        pushScene(const char* path);
    void        popScene();

    void setActiveWorld(std::unique_ptr<ECS::World> world);
    void pushWorld(std::unique_ptr<ECS::World> world);

    ECS::World* activeWorld() const;
    bool        isTransitioning() const;
    f32         transitionProgress() const;

    void update(f64 dt);
};

}  // namespace Caffeine::Scene
```

### O que o manager faz na prática

- `loadScene` deserializa de imediato, guarda o world num mapa de pré-carregamento e
  devolve um handle. O argumento `async` é aceite mas ignorado, e ainda não existe uma
  chamada pública que ative um handle pré-carregado; usa `switchScene` ou `pushScene`.
- `switchScene` limpa a pilha de worlds e empilha o world recém-carregado. Devolve
  `false` quando não consegue ler o ficheiro.
- `pushScene` carrega e empilha um world sem limpar a pilha; `popScene` remove o world do
  topo.
- `update(dt)` apenas avança o temporizador de transição e limpa-o em 1.0. Nenhum
  renderer da engine consome `TransitionType` ou `fadeColor`; um frontend que queira um
  fade desenha-o a partir de `transitionProgress()`.
- `activeWorld()` é o topo da pilha, ou `nullptr` quando a pilha está vazia.
- `SceneSerializer::deserialize` acrescenta ao world que recebe; não o limpa primeiro.
  Usa um `ECS::World` novo (como o `SceneManager` faz) ou chama `destroyAll()`.

---

## Formato de Serialização (.caf Scene)

O formato de cena usa o `CafHeader` interno da engine (`magic = 0xCAFECAFE`), não o
formato de asset do caf-pack (`magic = 0x43414621`).

```text
[CafHeader]       32 bytes: magic, version, type=Scene, flags, crc32,
                  metadataSize, dataSize
[SceneMetadata]   entityCount, archetypeCount, stringTableOffset,
                  assetRefTableOffset, reserved
[Payload]         a sequence of sections:
                    u32 typeId
                    u32 count
                    count × (u32 entityId + component bytes)
[CRC32]           4-byte whole-file checksum (memory serializer)
```

`Scene::SceneSerializer` escreve exatamente quatro tipos de secção:

| Type id | Component | Size per entity |
|--------:|-----------|-----------------|
| 0 | `ECS::Transform` | `sizeof(Transform)` |
| 1 | `ECS::Acceleration2D` | `sizeof(Acceleration2D)` |
| 2 | `Scene::Parent` | `u32 parentId + u8 dirty` |
| 3 | `Scene::WorldTransform` | `sizeof(WorldTransform)` |

<mark>Limites.</mark> Os nomes das entidades não são escritos (o header guarda
`stringTableOffset = 0`), não existe tabela de referências a assets e todos os outros
tipos de componente são descartados. `serializeJson` escreve apenas um dump de debug de
transforms e `deserializeJson` devolve `false`.

Para projetos reais usa `Editor::SceneSerializer`
(`src/caffeine/scene/EditorSceneSerializer.hpp`). É o serializador por trás de
`caffeine_session_save_scene` / `load_scene`, cobre os ids de componente listados nesse
header (nomes, transforms, luzes, meshes, física, scripts, UI, terreno, skinned poses e
mais) e preserva nomes de entidades e links de parent.

---

## Sistema de Hierarquia (TransformSystem)

A hierarquia é uma função livre, não uma subclasse de `ISystem`. Chama-a uma vez por
frame antes do rendering:

```cpp
#include "scene/HierarchySystem.hpp"

// Local transform sources:
//   ECS::Position3D + Rotation3D + Scale3D   (3D, quaternion rotation)
//   ECS::Transform                           (position + Euler degrees + scale)
Caffeine::Scene::propagateTransforms(world);

// The resolved matrix is now on every entity that has a Transform/Position3D.
Mat4 worldMatrix = world.get<Caffeine::Scene::WorldTransform>(entity)->matrix;
```

Como resolve:

1. Todas as entidades com `ECS::Transform` ou `ECS::Position3D` recebem um
   `WorldTransform` com a matriz local.
2. Até `MAX_DEPTH` (8) passagens compõem a matriz local de cada filho com a matriz
   global do pai. Os pais podem aparecer depois dos filhos na lista de entidades.
3. Um segundo conjunto de passagens copia a `EntityLayer` do pai para os filhos que
   ainda não têm uma.
4. Adicionar `WorldTransform` durante a iteração invalidaria a iteração, por isso as
   atualizações são recolhidas primeiro e escritas depois. É isto que torna a função
   segura em filhos que nunca tiveram world transform.

`Parent.dirty` não é consultado; remover um `Parent` e chamar `propagateTransforms`
outra vez devolve o filho ao espaço local.

`isEffectivelyDisabled` percorre a cadeia de pais, pelo que uma raiz desativada desativa
a subárvore sem tocar em cada filho.

---

## Exemplos de Uso

```cpp
#include "debug/LogSystem.hpp"
#include "scene/HierarchySystem.hpp"
#include "scene/SceneManager.hpp"
#include "scene/SceneSerializer.hpp"

// ── Save and load a minimal scene ─────────────────────────────
Caffeine::Scene::SceneSerializer serializer(world);
if (!serializer.serialize("saves/level1.caf")) {
    CF_ERROR("Scene", "Failed to save level1");
}

// ── Load into the manager ─────────────────────────────────────
Caffeine::Scene::SceneManager sceneManager;

// Replace the current world with level2, with a 0.5 s timer.
Caffeine::Scene::TransitionConfig transition;
transition.type     = Caffeine::Scene::TransitionType::Fade;
transition.duration = 0.5f;
if (!sceneManager.switchScene("assets/scenes/level2.caf", transition)) {
    CF_ERROR("Scene", "Could not load level2");
}

// Push a pause menu over the gameplay world, then pop it.
if (!sceneManager.pushScene("assets/scenes/pause_menu.caf")) {
    CF_ERROR("Scene", "Could not load pause_menu");
}
// ...later
sceneManager.popScene();

// Advance the transition timer once per frame.
sceneManager.update(dt);
float fade = sceneManager.transitionProgress();

// ── Hierarchy ────────────────────────────────────────────────
Entity player = world.create("Player");
world.add<Caffeine::ECS::Transform>(player).position = {0.0f, 0.0f, 0.0f};

Entity sword = world.create("Sword");
// Local position relative to the player.
world.add<Caffeine::ECS::Transform>(sword).position = {1.5f, 0.0f, 0.0f};
world.add<Caffeine::Scene::Parent>(sword).parent = player;

Caffeine::Scene::propagateTransforms(world);
// sword's WorldTransform = player's WorldTransform * sword's local transform.
```

---

## Decisões de Design

| Decisão | Justificativa |
|---------|-------------|
| Hierarquia sobre componentes ECS | Links de parent são dados; qualquer sistema ou frontend os pode ler |
| `WorldTransform` separado do `Transform` local | O inspector continua a editar valores locais enquanto o rendering usa matrizes resolvidas |
| Até 8 passagens de composição | Trata pais que aparecem depois dos filhos sem uma ordenação topológica |
| Atualizações recolher-depois-escrever | Adicionar componentes durante a iteração invalida a iteração de arquétipos |
| Pilha de cenas | Mantém um world de gameplay vivo por baixo de um world de menu |
| Header `.caf` interno da engine | Os ficheiros de cena são versionados separadamente dos assets do caf-pack |
| `Scene::SceneSerializer` mínimo | Round-trip pequeno e testável de quatro componentes; o formato completo vive em `Editor::SceneSerializer` |

---

## Critério de Aceitação

A suite `tests/test_scenemanager.cpp` cobre:

- [x] `Parent` começa com `Entity::INVALID` e `dirty = true`
- [x] `WorldTransform` começa como identidade
- [x] Round-trip de world vazio e do header via `serializeToMemory`
- [x] Round-trip de `Transform`, `Acceleration2D`, `WorldTransform` e `Parent`
- [x] Push/pop da pilha do `SceneManager` e `activeWorld()`
- [x] `propagateTransforms` compõe três níveis de transforms parent/child
- [x] Filhos sem `WorldTransform` são tratados sem invalidar a iteração
- [x] Remover `Parent` devolve o filho ao espaço local

A suite não impõe um orçamento de carregamento de 1K entidades nem uma contagem de
leaks da pilha de cenas; mede isso no teu próprio projeto se for relevante.

---

## Dependências

- **Upstream:** [ECS Core](./core.md), [CafTypes](../assets/caf-format.md), [Mat4](../math/vectors.md)
- **Downstream:** I/O de cenas do Doppio e a C ABI (`caffeine_session_save_scene` / `load_scene`)

---

## 🔗 Tópicos Relacionados

| Tópico | Descrição |
|--------|-----------|
| [ECS Core](./core.md) | Entidades, componentes e queries usados pela camada de cena |
| [ECS examples](./examples.md) | Programas que usam a API do world |
| [Headless engine API](../api/headless-engine-api.md) | Guardar e carregar cenas através da C ABI |

## Referências

- [`src/caffeine/scene/HierarchySystem.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/HierarchySystem.hpp) — composição da hierarquia
- [`src/caffeine/scene/SceneManager.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/SceneManager.hpp) — pilha de cenas
- [`src/caffeine/scene/EditorSceneSerializer.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/EditorSceneSerializer.hpp) — formato completo de cena de projeto
- [`tests/test_scenemanager.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_scenemanager.cpp) — suite de hierarquia e serialização
