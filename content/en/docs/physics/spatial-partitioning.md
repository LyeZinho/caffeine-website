# Spatial Partitioning

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span><strong>Namespace:</strong> `Caffeine::Spatial`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/spatial/Octree.hpp"><code>spatial/Octree.hpp</code></a></span>
</div>

<p class="doc-lede">The octree, AABB and frustum types used for broad-phase queries, frustum
culling and ray or radius lookups in 3D.</p>

---

## Overview

Spatial partitioning divides 3D space into regions to accelerate spatial queries (broad-phase
collection, frustum culling, raycasts). Caffeine ships a 3D **Octree**; there is no 2D
quadtree, and `Physics2D` uses its own spatial hash grid.

---

## API

```cpp
namespace Caffeine::Spatial {

// ============================================================================
// @brief  AABB 3D — axis-aligned box.
// ============================================================================
struct AABB3D {
    Vec3 min = {0, 0, 0};
    Vec3 max = {0, 0, 0};

    Vec3 center() const;
    Vec3 size()   const;
    bool contains(Vec3 p) const;
    bool contains(const AABB3D& o) const;
    bool intersects(const AABB3D& o) const;
    bool intersectsRay(Vec3 origin, Vec3 dir, f32* tMin = nullptr) const;
};

// ============================================================================
// @brief  Frustum for culling.
//
//  Planes stored as (A,B,C,D); d <= 0 is inside.
// ============================================================================
struct Frustum {
    enum Plane { Left = 0, Right, Bottom, Top, Near, Far, PlaneCount };
    Vec4 planes[PlaneCount];

    static Frustum fromMatrix(const Mat4& viewProj);
    static Frustum fromCamera(Vec3 eye, Vec3 target, Vec3 up,
                              f32 fovY, f32 aspect, f32 nearZ, f32 farZ);

    bool contains(Vec3 point)      const;
    bool intersects(const AABB3D& aabb) const;
    bool containsSphere(Vec3 center, f32 radius) const;
};

// ============================================================================
// @brief  Octree for 3D spatial partitioning.
//
//  - Each node subdivides into 8 children past maxEntitiesPerNode
//  - Configurable max depth (default: 8)
//  - Entities are stored by their AABB centre in leaf nodes
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
    void rebuild();

    // ── Queries ────────────────────────────────────────────────
    void queryAABB(const AABB3D& bounds, std::vector<ECS::Entity>& out) const;
    void queryFrustum(const Frustum& frustum, std::vector<ECS::Entity>& out) const;
    void queryRay(Vec3 origin, Vec3 dir, f32 maxDist,
                  std::vector<ECS::Entity>& out) const;
    void queryRadius(Vec3 center, f32 radius,
                     std::vector<ECS::Entity>& out) const;

    // ── Stats ──────────────────────────────────────────────────
    u32 nodeCount()   const;
    u32 entityCount() const;
    u32 depth()       const;
};

}  // namespace Caffeine::Spatial
```

---

## Frustum culling

- `Camera3D`
  - `viewProjectionMatrix()` or `frustum()`
- `▼`
- `Frustum::fromMatrix(viewProj)` / `Frustum::fromCamera(...)`
- `▼`
- `Octree::queryFrustum(frustum, visibleEntities)`
- `▼`
- Only entities inside the frustum reach the renderer
- (entities outside produce no draw calls)


**Benefit:** in a scene with 10K objects, only the ~100 visible ones generate draw calls.

`GpuSceneRenderer::gatherMeshDraws` currently tests each mesh AABB against the camera frustum
directly; the octree is available for callers that need broad-phase queries.

---

## No 2D quadtree

`Physics2D` does its broad phase with a spatial hash grid (`kGridCellSize = 128`) instead of a
quadtree. The octree is 3D-only; there is no `Quadtree` type in the engine.

---

## Usage examples

```cpp
// ── Setup ─────────────────────────────────────────────────────
Caffeine::Spatial::Octree octree({
    .rootBounds = { {-1000,-1000,-1000}, {1000,1000,1000} },
    .maxEntitiesPerNode = 8,
    .maxDepth = 8
});

// ── Populate ──────────────────────────────────────────────────
world.forEach<ECS::MeshFilterComponent>(meshQuery, [&](ECS::Entity e, ECS::MeshFilterComponent&) {
    AABB3D bounds = computeBounds(e);
    octree.insert(e, bounds);
});

// ── Frustum culling ───────────────────────────────────────────
Frustum frustum = camera3D.frustum();
std::vector<ECS::Entity> visible;
octree.queryFrustum(frustum, visible);

// ── Update when entities move ────────────────────────────────
if (entityMoved) {
    octree.update(entity, newBounds);
}
```

---

## Behaviour notes

- `insert` descends to a leaf using the AABB centre; an AABB that straddles a split still goes
  to one child, so queries also test the stored bounds.
- `update` is `remove` + `insert`; `rebuild` re-inserts every stored entry after a full reset.
- Query methods append to `out`; clear the vector first.

---

## Dependencies

- **Upstream:** [ECS](../ecs/core.md), [3D Math](../math/vectors.md)
- **Downstream:** [Camera3D](../rendering/camera-3d.md) (provides the frustum), [Mesh Loading](../assets/mesh-loading.md)

---

## References

- [`architecture_specs.md`](../architecture_specs.md) — RF5.4 Octree spatial
- [`camera-3d.md`](../rendering/camera-3d.md) — provides the frustum for `queryFrustum`
