# Spatial Partitioning

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span><strong>Namespace:</strong> `Caffeine::Spatial`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/spatial/Octree.hpp"><code>spatial/Octree.hpp</code></a></span>
</div>

<p class="doc-lede">A octree e os tipos AABB e frustum usados para queries de broad phase,
frustum culling e pesquisas por raio ou raio de alcance em 3D.</p>

---

## Visão Geral

O particionamento espacial divide o espaço 3D em regiões para acelerar queries espaciais
(colecção de broad phase, frustum culling, raycasts). A Caffeine traz uma **Octree** 3D; não há
quadtree 2D, e a `Physics2D` usa a sua própria grelha de hash espacial.

---

## API

```cpp
namespace Caffeine::Spatial {

// ============================================================================
// @brief  AABB 3D — caixa alinhada por eixos.
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
// @brief  Frustum para culling.
//
//  Planos guardados como (A,B,C,D); d <= 0 é dentro.
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
// @brief  Octree para particionamento espacial 3D.
//
//  - Cada nó subdivide em 8 filhos depois de maxEntitiesPerNode
//  - Profundidade máxima configurável (default: 8)
//  - Entidades guardadas pelo centro da AABB nos nós folha
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
  - `viewProjectionMatrix()` ou `frustum()`
- `▼`
- `Frustum::fromMatrix(viewProj)` / `Frustum::fromCamera(...)`
- `▼`
- `Octree::queryFrustum(frustum, visibleEntities)`
- `▼`
- Só as entidades dentro do frustum chegam ao renderer
- (entidades fora não geram draw calls)


**Benefício:** numa cena com 10K objectos, só os ~100 visíveis geram draw calls.

O `GpuSceneRenderer::gatherMeshDraws` testa actualmente cada AABB de mesh directamente contra o
frustum da câmara; a octree está disponível para chamadores que precisem de queries de broad
phase.

---

## Sem quadtree 2D

A `Physics2D` faz a broad phase com uma grelha de hash espacial (`kGridCellSize = 128`) em vez
de uma quadtree. A octree é só 3D; não existe um tipo `Quadtree` no engine.

---

## Exemplos de uso

```cpp
// ── Setup ─────────────────────────────────────────────────────
Caffeine::Spatial::Octree octree({
    .rootBounds = { {-1000,-1000,-1000}, {1000,1000,1000} },
    .maxEntitiesPerNode = 8,
    .maxDepth = 8
});

// ── Popular ───────────────────────────────────────────────────
world.forEach<ECS::MeshFilterComponent>(meshQuery, [&](ECS::Entity e, ECS::MeshFilterComponent&) {
    AABB3D bounds = computeBounds(e);
    octree.insert(e, bounds);
});

// ── Frustum culling ───────────────────────────────────────────
Frustum frustum = camera3D.frustum();
std::vector<ECS::Entity> visible;
octree.queryFrustum(frustum, visible);

// ── Actualizar quando as entidades se movem ──────────────────
if (entityMoved) {
    octree.update(entity, newBounds);
}
```

---

## Notas de comportamento

- O `insert` desce até uma folha usando o centro da AABB; uma AABB que atravessa um split vai
  na mesma para um filho, por isso as queries também testam os bounds guardados.
- O `update` é `remove` + `insert`; o `rebuild` reinsere todas as entradas depois de um reset
  completo.
- Os métodos de query acrescentam a `out`; limpa o vector primeiro.

---

## Dependências

- **Upstream:** [ECS](../ecs/core.md), [3D Math](../math/vectors.md)
- **Downstream:** [Camera3D](../rendering/camera-3d.md) (fornece o frustum), [Mesh Loading](../assets/mesh-loading.md)

---

## Referências

- [`architecture_specs.md`](../architecture_specs.md) — RF5.4 Octree spatial
- [`camera-3d.md`](../rendering/camera-3d.md) — fornece o frustum para `queryFrustum`
