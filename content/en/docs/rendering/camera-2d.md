# 🎥 Camera System

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span><strong>Phase:</strong> 3 — The Eye of Engine</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span><strong>File:</strong> `src/caffeine/render/Camera2D.hpp`</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">The orthographic 2D camera: world/screen conversion, follow, shake and
map bounds for sprites and HUD layers.</p>

---

## Overview

The Camera System provides the mathematical projection between **world space** (game
coordinates) and **screen space** (pixels). `Camera2D` uses an orthographic projection for 2D
games; [`Camera3D`](camera-3d.md) handles the perspective path.

---

## API

```cpp
namespace Caffeine::Render {

// ============================================================================
// @brief  Câmera 2D com projeção ortográfica.
//
//  Funcionalidades:
//  - View matrix (posição + rotação da câmera)
//  - Projection matrix (ortográfica — sem perspectiva)
//  - worldToScreen / screenToWorld
//  - Follow entity com smoothing
//  - Camera shake
//  - World bounds clamp
// ============================================================================
class Camera2D {
public:
    Camera2D();

    // ── Matrizes ───────────────────────────────────────────────
    Mat4 viewMatrix()           const;
    Mat4 projectionMatrix()     const;
    Mat4 viewProjectionMatrix() const;  // cached, recalculated se dirty

    // ── Conversão de espaço ────────────────────────────────────
    Vec2 worldToScreen(Vec2 worldPos)   const;
    Vec2 screenToWorld(Vec2 screenPos)  const;
    bool isVisible(Rect2D worldRect)    const;  // frustum culling básico

    // ── Configuração ───────────────────────────────────────────
    void setPosition(Vec2 pos);
    void setZoom(f32 zoom);             // 1.0 = normal, 2.0 = 2x zoom in
    void setRotation(f32 degrees);
    void setViewport(Rect2D viewport);  // pixels (x, y, width, height)

    // ── Follow ─────────────────────────────────────────────────
    void follow(ECS::Entity target, f32 smoothing = 0.1f);  // lerp per frame
    void stopFollowing();
    void update(f64 dt, const ECS::World& world);           // processa follow + shake

    // ── Shake ──────────────────────────────────────────────────
    void shake(Vec2 intensity, f32 duration);  // em pixels

    // ── Bounds ─────────────────────────────────────────────────
    void setBounds(Rect2D worldBounds);
    void clearBounds();

    // ── Getters ────────────────────────────────────────────────
    Vec2   position()  const { return m_position; }
    f32    zoom()      const { return m_zoom; }
    f32    rotation()  const { return m_rotation; }
    Rect2D viewport()  const { return m_viewport; }
    Vec2   size()      const { return {m_viewport.size.x / m_zoom,
                                        m_viewport.size.y / m_zoom}; }

private:
    Mat4  calculateViewMatrix()       const;
    Mat4  calculateProjectionMatrix() const;
    Vec2  applyBounds(Vec2 pos)       const;

    Vec2   m_position    = {0, 0};
    f32    m_zoom        = 1.0f;
    f32    m_rotation    = 0.0f;
    Rect2D m_viewport    = {{0, 0}, {1280, 720}};
    f32    m_aspect      = 1280.0f / 720.0f;

    // Follow
    ECS::Entity m_followTarget    = ECS::Entity::INVALID;
    f32          m_followSmoothing = 0.1f;

    // Shake
    Vec2 m_shakeIntensity = {0, 0};
    f32  m_shakeTime      = 0.0f;
    f32  m_shakeDuration  = 0.0f;
    Vec2 m_shakeOffset    = {0, 0};

    // Bounds
    bool   m_hasBounds   = false;
    Rect2D m_worldBounds = {};

    mutable Mat4 m_cachedViewProj;
    mutable bool m_dirty = true;
};

}  // namespace Caffeine::Render
```

---

## Ortographic Projection Mathematics

```
Projection Matrix (ortho):
    left   = -viewport.width  / 2 / zoom
    right  = +viewport.width  / 2 / zoom
    bottom = -viewport.height / 2 / zoom
    top    = +viewport.height / 2 / zoom
    near   = -1000
    far    = +1000

    Mat4::ortho(left, right, bottom, top, near, far)

View Matrix:
    Mat4::rotationZ(-rotation) * Mat4::translation(-position)
```

**Note:** Spell projection has no perspective — distant objects are the same size as nearby objects. Correct for 2D games.

---

## Camera Follow

```cpp
// Smooth follow usando lerp:
void Camera2D::update(f64 dt, const ECS::World& world) {
    if (m_followTarget.isValid()) {
        if (auto* pos = world.get<Position2D>(m_followTarget)) {
            Vec2 target = {pos->x, pos->y};
            m_position = Vec2::lerp(m_position, target, m_followSmoothing);
            m_position = applyBounds(m_position);
            m_dirty = true;
        }
    }
    // Shake decay
    if (m_shakeTime > 0) {
        m_shakeTime -= dt;
        f32 t = m_shakeTime / m_shakeDuration;
        m_shakeOffset = m_shakeIntensity * t * randomDir();
        m_dirty = true;
    }
}
```

---

## Exemplos de Uso

```cpp
// ── Setup básico ─────────────────────────────────────────────
Caffeine::Render::Camera2D camera;
camera.setViewport({ {0, 0}, {1280, 720} });
camera.setZoom(1.0f);

// ── Follow jogador ────────────────────────────────────────────
camera.follow(playerEntity, 0.08f);  // 8% do caminho por frame
camera.setBounds({ {0, 0}, {5000, 3000} });  // limites do mapa

// ── Por frame ────────────────────────────────────────────────
camera.update(dt, world);
batchRenderer.setCamera(camera);

// ── Shake ao levar dano ───────────────────────────────────────
eventBus.subscribe<OnPlayerHit>([&](const OnPlayerHit& e) {
    camera.shake({5, 5}, 0.3f);  // 5px, 300ms
});

// ── Conversão de espaço para UI ───────────────────────────────
Vec2 screenPos = camera.worldToScreen(enemyWorldPos);
// Usa screenPos para renderizar health bar sobre o inimigo

// ── Culling manual ────────────────────────────────────────────
if (!camera.isVisible(entityBounds)) return;  // skip render
```

---

## Relationship to Camera 3D

`Camera3D` shares the same conventions with a perspective projection:

```cpp
class Camera3D {
    Mat4 viewMatrix()       const;  // lookAt(eye, target, up)
    Mat4 projectionMatrix() const;  // perspective(fovY, aspect, near, far)
    // ... same position/orientation setters; setFOV replaces setZoom
};
```

[`BatchRenderer`](batch-renderer.md) takes a `Camera2D` only; the 3D path uses
`GpuSceneRenderer` with a `GpuSceneCamera` (position, focus, view/projection). There is no
implicit conversion from `Camera3D` to `GpuSceneCamera`.

---

## Design Decisions

| Decision | Justificativa |
|---------|-------------|
| Ortho para 2D | No perspective distortion — right for 2D games |
| Cache `m_dirty` | Avoid recalculating VP matrix when camera did not move |
| Follow com lerp | Smooth, no snap for player position |
| `isVisible(Rect2D)` | Frustum cooking basic for 2D |
| `setBounds` | Camera never shows area off the map |

---

## Acceptance Criteria

- [x] Camera follows entity with `smoothing = 0.1f` sem jitter a 60fps
- [x] `worldToScreen` e `screenToWorld` are correct reverse operations
- [x] Camera shake decays correctly to zero
- [x] `setBounds` prevents camera from showing area off the map
- [x] VP matrix cached — does not recalculate when camera did not move

---

## Dependencies

- **Upstream:** [Phase 1 — Matt4, Vec2](../math/vectors.md), [Phase 4 — ECS Entity](../ecs/core.md)
- **Downstream:** [Batch Renderer](batch-renderer.md), [Phase 5 — Camera3D](../rendering/camera-3d.md)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Rendering & Pipeline]() | 2D camera on the rendering pipeline |

## References

- [`architecture_specs.md`](../architecture_specs.md) — §10 Camera System
- [`batch-renderer.md`](batch-renderer.md) — uses viewProjectionMatrix()
- [`camera-3d.md`](camera-3d.md) — extension to 3D
