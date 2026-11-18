# 🗺️ Scene Manager

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Scene</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/SceneManager.hpp"><code>scene/SceneManager.hpp</code></a></span>
</div>

<p class="doc-lede">The scene layer adds a parent/child hierarchy, world transforms and a
scene stack on top of the ECS, plus the serializers that write a world to a
<code>.caf</code> file.</p>

---

## Overview

The scene layer is a handful of small pieces on top of `ECS::World`:

- `Scene::Parent` — the parent link used by the hierarchy.
- `Scene::WorldTransform` — the resolved matrix for each entity.
- `Scene::EntityLayer` — the inherited render layer.
- `Scene::propagateTransforms` — recomputes world matrices and inherited layers.
- `Scene::SceneManager` — a stack of worlds and a transition timer.
- `Scene::SceneSerializer` — the minimal binary/JSON scene serializer.
- `Editor::SceneSerializer` — the full project scene serializer used by Doppio, the
  runtime and the C ABI.

<dl>
  <dt><code>Parent</code></dt>
  <dd>Stores the parent entity and a <code>dirty</code> flag. The flag is serialized but
  <code>propagateTransforms</code> recomputes every entity each call; it does not skip
  clean entries.</dd>
  <dt><code>WorldTransform</code></dt>
  <dd>One <code>Mat4</code> per entity, written by <code>propagateTransforms</code>. Local
  <code>Transform</code> components are never rewritten by inheritance.</dd>
  <dt><code>EntityLayer</code></dt>
  <dd>A <code>u8</code> layer inherited from the parent when the child has no layer of
  its own.</dd>
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

### What the manager actually does

- `loadScene` deserializes immediately, stores the world in a preload map and returns a
  handle. The `async` argument is accepted but ignored, and there is no public call that
  activates a preloaded handle yet; use `switchScene` or `pushScene`.
- `switchScene` clears the world stack and pushes the newly loaded world. It returns
  `false` when the file cannot be read.
- `pushScene` loads and pushes a world without clearing the stack; `popScene` removes the
  top world.
- `update(dt)` only advances the transition timer and clears it at 1.0. No renderer
  consumes `TransitionType` or `fadeColor` in the engine; a frontend that wants a fade
  draws it from `transitionProgress()`.
- `activeWorld()` is the top of the stack, or `nullptr` when the stack is empty.
- `SceneSerializer::deserialize` appends to the world it was given; it does not clear
  it first. Use a fresh `ECS::World` (as `SceneManager` does) or call `destroyAll()`.

---

## Serialization Format (.caf Scene)

The scene format uses the engine-internal `CafHeader` (`magic = 0xCAFECAFE`), not the
caf-pack asset format (`magic = 0x43414621`).

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

`Scene::SceneSerializer` writes exactly four section types:

| Type id | Component | Size per entity |
|--------:|-----------|-----------------|
| 0 | `ECS::Transform` | `sizeof(Transform)` |
| 1 | `ECS::Acceleration2D` | `sizeof(Acceleration2D)` |
| 2 | `Scene::Parent` | `u32 parentId + u8 dirty` |
| 3 | `Scene::WorldTransform` | `sizeof(WorldTransform)` |

<mark>Limits.</mark> Entity names are not written (the header stores
`stringTableOffset = 0`), there is no asset-reference table, and every other component
type is dropped. `serializeJson` writes only a transform/world-transform debug dump and
`deserializeJson` returns `false`.

For real projects use `Editor::SceneSerializer`
(`src/caffeine/scene/EditorSceneSerializer.hpp`). It is the serializer behind
`caffeine_session_save_scene` / `load_scene`, covers the component ids listed in that
header (names, transforms, lights, meshes, physics, scripts, UI, terrain, skinned poses
and more), and keeps entity names and parent links.

---

## Sistema de Hierarquia (TransformSystem)

The hierarchy is a free function, not an `ISystem` subclass. Call it once per frame
before rendering:

```cpp
#include "scene/HierarchySystem.hpp"

// Local transform sources:
//   ECS::Position3D + Rotation3D + Scale3D   (3D, quaternion rotation)
//   ECS::Transform                           (position + Euler degrees + scale)
Caffeine::Scene::propagateTransforms(world);

// The resolved matrix is now on every entity that has a Transform/Position3D.
Mat4 worldMatrix = world.get<Caffeine::Scene::WorldTransform>(entity)->matrix;
```

How it resolves:

1. Every entity with `ECS::Transform` or `ECS::Position3D` gets a `WorldTransform`
   containing its local matrix.
2. Up to `MAX_DEPTH` (8) passes compose each child's local matrix with its parent's
   world matrix. Parents may appear after children in the entity list.
3. A second set of passes copies the parent's `EntityLayer` to children that do not
   already have one.
4. Adding `WorldTransform` while iterating would invalidate the iteration, so updates
   are collected first and written afterwards. This is why the function is safe on
   children that never had a world transform.

`Parent.dirty` is not consulted; removing a `Parent` and calling
`propagateTransforms` again resolves the child back to local space.

`isEffectivelyDisabled` walks the parent chain so a disabled root disables its subtree
without touching each child.

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

## Design Decisions

| Decision | Rationale |
|---------|-----------|
| Hierarchy on top of ECS components | Parent links are data; any system or frontend can read them |
| `WorldTransform` separate from local `Transform` | The inspector keeps editing local values while rendering uses resolved matrices |
| Up to 8 composition passes | Handles parents that appear after children without a topological sort |
| Collect-then-write updates | Adding components during iteration invalidates archetype iteration |
| Scene stack | Keeps a gameplay world alive under a menu world |
| Engine-internal `.caf` header | Scene files are versioned separately from caf-pack assets |
| Minimal `Scene::SceneSerializer` | Small, testable four-component round-trip; the full format lives in `Editor::SceneSerializer` |

---

## Acceptance Criteria

The `tests/test_scenemanager.cpp` suite covers:

- [x] `Parent` defaults to `Entity::INVALID` with `dirty = true`
- [x] `WorldTransform` defaults to identity
- [x] Empty-world and header round-trips through `serializeToMemory`
- [x] Round-trip of `Transform`, `Acceleration2D`, `WorldTransform` and `Parent`
- [x] `SceneManager` stack push/pop and `activeWorld()`
- [x] `propagateTransforms` composes three levels of parent/child transforms
- [x] Children with no `WorldTransform` are handled without invalidating iteration
- [x] Removing `Parent` resolves the child back to local space

The suite does not assert a 1K-entity load budget or a scene-stack leak count; measure
those in your own project if they matter.

---

## Dependencies

- **Upstream:** [ECS Core](./core.md), [CafTypes](../assets/caf-format.md), [Mat4](../math/vectors.md)
- **Downstream:** Doppio scene I/O and the C ABI (`caffeine_session_save_scene` / `load_scene`)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [ECS Core](./core.md) | Entities, components and queries used by the scene layer |
| [ECS examples](./examples.md) | Programs that use the world API |
| [Headless engine API](../api/headless-engine-api.md) | Saving and loading scenes through the C ABI |

## References

- [`src/caffeine/scene/HierarchySystem.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/HierarchySystem.hpp) — hierarchy composition
- [`src/caffeine/scene/SceneManager.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/SceneManager.hpp) — scene stack
- [`src/caffeine/scene/EditorSceneSerializer.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/scene/EditorSceneSerializer.hpp) — full project scene format
- [`tests/test_scenemanager.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_scenemanager.cpp) — hierarchy and serializer suite
