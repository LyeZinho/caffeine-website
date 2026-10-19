# 🌳 Spatial Partitioning

> **Phase:**5 — Dimensional Transition
> **Namespace:** `Caffeine::Spatial` 
> **File:** `src/spatial/Octree.hpp` 
> ** Status:** 
> **RF:** RF5.4

---

## Overview

Spatial partitioning divides 3D space into regions to accelerate spatial Queries (broad-phase collection, frustum cooking, raycasts). Migra do **Quadtree** 2D (Phase 4, if implemented) for **Octree** 3D.

---

## API Planejada

```cpp
namespace Caffeine::Spatial {

// ============================================================================
// @brief  AABB 3D — caixa alinhada por eixos.
// ============================================================================
struct AABB3D {
    Vec3 min = {0, 0, 0};
    Vec3 max = {0, 0, 0};

    Vec3 center() const { return (min + max) * 0.5f; }
    Vec3 size()   const { return max - min; }
    bool contains(Vec3 p) const;
    bool intersects(const AABB3D& o) const;
    bool intersectsRay(Vec3 origin, Vec3 dir, f32* tMin = nullptr) const;
};

// ============================================================================
// @brief  Frustum para culling.
//
//  Derivado da view-projection matrix.
//  Planos: Near, Far, Left, Right, Top, Bottom.
// ============================================================================
struct Frustum {
    Vec4 planes[6];   // Ax + By + Cz + D = 0 (normalizados)

    static Frustum fromMatrix(const Math::Mat4& viewProj);

    bool contains(Vec3 point)      const;
    bool intersects(const AABB3D& aabb) const;
    bool containsSphere(Vec3 center, f32 radius) const;
};

// ============================================================================
// @brief  Octree para particionamento 3D.
//
//  - Cada nó divide em 8 sub-nós quando excede maxEntities
//  - Depth máxima configurável (default: 8)
//  - Entidades inseridas por AABB
// ============================================================================
class Octree {
public:
    struct Config {
        AABB3D rootBounds;
        u32    maxEntitiesPerNode = 8;
        u32    maxDepth           = 8;
    };

    explicit Octree(const Config& cfg);

    // ── Insert / Remove ────────────────────────────────────────
    void insert(ECS::Entity entity, const AABB3D& bounds);
    void remove(ECS::Entity entity);
    void update(ECS::Entity entity, const AABB3D& newBounds);
    void rebuild();   // rebuild completo (para quando muitas entidades moveram)

    // ── Queries ────────────────────────────────────────────────
    void queryAABB(const AABB3D& bounds,
                   std::vector<ECS::Entity>& out) const;

    void queryFrustum(const Frustum& frustum,
                      std::vector<ECS::Entity>& out) const;   // RF5.6

    void queryRay(Vec3 origin, Vec3 dir, f32 maxDist,
                  std::vector<ECS::Entity>& out) const;

    void queryRadius(Vec3 center, f32 radius,
                     std::vector<ECS::Entity>& out) const;

    // ── Stats ──────────────────────────────────────────────────
    u32 nodeCount()   const;
    u32 entityCount() const;
    u32 depth()       const;

private:
    struct Node {
        AABB3D bounds;
        std::vector<ECS::Entity>      entities;
        std::unique_ptr<Node>          children[8];
        bool                           isLeaf = true;
        u32                            depth  = 0;

        void subdivide();
        int  childIndex(Vec3 point) const;
    };

    Node m_root;
    Config m_config;
};

}  // namespace Caffeine::Spatial
```

---

## Frustum Culling (RF5.6)

- `Camera3D`
  - `viewProjectionMatrix()`
- `▼`
- `Frustum::fromMatrix(viewProj)`
- `▼`
- `Octree::queryFrustum(frustum, visibleEntities)`
- `▼`
- `Apenas entidades DENTRO do frustum são enviadas ao MeshSystem`
- `(entidades fora não geram draw calls)`


**Benefício:** Em uma cena com 10K objetos, apenas os ~100 visíveis geram draw calls.

---

## Quadtree 2D (Phase 4 → 5)

Phase 4 can use a **Quadtree**2D for broad-phase collection 2D:

```cpp
// Fase 4 (opcional, para otimizar Physics2D com muitas entidades):
class Quadtree {
    void insert(ECS::Entity, Rect2D bounds);
    void query(Rect2D area, std::vector<ECS::Entity>& out);
};

// Fase 5: Octree substitui/estende para 3D
```

---

## Exemplos de Uso

```cpp
// ── Setup ─────────────────────────────────────────────────────
Caffeine::Spatial::Octree octree({
    .rootBounds = { {-1000,-1000,-1000}, {1000,1000,1000} },
    .maxEntitiesPerNode = 8,
    .maxDepth = 8
});

// ── Popular com entidades ─────────────────────────────────────
world.query(meshQuery, [&](ECS::Entity e, Position3D& pos, MeshRenderer& mr) {
    AABB3D bounds = computeBounds(mr.mesh, pos);
    octree.insert(e, bounds);
});

// ── Frustum culling ───────────────────────────────────────────
Frustum frustum = Frustum::fromMatrix(camera3D.viewProjectionMatrix());
std::vector<ECS::Entity> visible;
octree.queryFrustum(frustum, visible);

// Apenas renderizar entidades visíveis:
for (ECS::Entity e : visible) {
    auto* mr = world.get<MeshRenderer>(e);
    meshSystem.submitMesh(*mr->mesh, getWorldMatrix(e), cmd);
}

// ── Update quando entidades movem ────────────────────────────
if (entity.get<Position3D>().changed) {
    octree.update(entity, newBounds);
}
```

---

## Acceptance Criteria

- [ ] `queryFrustum` exclui corretamente entidades fora do frustum
- [ ] Performance: 10K entidades, query em < 1ms
- [ ] `insert` / `remove` correct without corruption
- [ ] Frustum cooking: entities outside the camera do not generate draw calls

---

## Dependencies

- **Upstream:** [Phase 4 — ECS](../ecs/core.md), [3D Math](3d-math.md)
- **Downstream:** [Camera3D](camera3d.md) (fornece Frustum), [Mesh Loading](mesh-loading.md)

---

## References

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Rendering & Pipeline]() | Frustum culling com Octree |
| [Sistemas de Jogo]() | Broad-phase for 3D physics |

## References

- [`docs/architecture_specs.md`](../architecture specs.md) — RF5.4 Octree spatial
- [`docs/rendering/camera-3d.md`](../rendering/camera-3d.md) — provides Frustum for QueryFrustum
- [Transversal Topic Index]()
