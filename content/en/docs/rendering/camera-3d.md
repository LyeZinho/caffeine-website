# Camera 3D

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/Camera3D.hpp"><code>render/Camera3D.hpp</code></a></span>
</div>

<p class="doc-lede">Perspective camera used by the 3D viewport and runtime: view and
projection matrices, screen/world conversion, a frustum for culling, and FPS/orbital/follow
controls.</p>

---

## Overview

`Camera3D` provides a perspective projection for 3D rendering and coexists with `Camera2D`:
the same frame can render 2D (HUD, sprites) and 3D (environment, characters) with different
cameras.

---

## API

```cpp
namespace Caffeine::Render {

class Camera3D {
public:
    Camera3D() = default;

    // ── Matrices ───────────────────────────────────────────────
    Mat4 viewMatrix()           const;
    Mat4 projectionMatrix()     const;
    Mat4 viewProjectionMatrix() const;   // cached, recalculated when dirty

    // Frustum for culling
    Spatial::Frustum frustum() const;

    // ── Space conversion ──────────────────────────────────────
    Vec3 worldToScreen(Vec3 worldPos) const;              // pixels + depth 0..1
    Vec3 screenToWorld(Vec2 screenPos, f32 depth = 0.5f) const;
    bool isVisible(const Spatial::AABB3D& bounds) const;

    // ── Perspective configuration ─────────────────────────────
    void setFOV(f32 fovYDegrees);      // clamped to 1..179
    void setAspect(f32 aspect);
    void setNearFar(f32 nearPlane, f32 farPlane);
    void setViewport(Rect2D viewport);

    // ── Transform ─────────────────────────────────────────────
    void setPosition(Vec3 pos);
    void setRotation(Quat rot);
    void lookAt(Vec3 eye, Vec3 target, Vec3 up = {0, 1, 0});

    // ── FPS mode ──────────────────────────────────────────────
    void rotateFPS(f32 deltaPitch, f32 deltaYaw);  // degrees; pitch clamped to ±89
    void moveFPS(Vec3 localDelta);                 // local space

    // ── Orbital mode ──────────────────────────────────────────
    void orbit(f32 deltaAzimuth, f32 deltaElevation);
    void setOrbitTarget(Vec3 target);
    void setOrbitDistance(f32 distance);
    void zoom(f32 delta);

    // ── Follow mode ───────────────────────────────────────────
    void follow(ECS::Entity target, Vec3 offset = {0, 2, -5}, f32 smoothing = 0.05f);
    void stopFollowing();
    void update(f64 dt, const ECS::World& world);

    // ── Getters ───────────────────────────────────────────────
    Vec3 position()    const;
    Quat rotation()    const;
    f32  fov()         const;
    f32  aspect()      const;
    f32  nearPlane()   const;
    f32  farPlane()    const;
    Rect2D viewport()  const;
    Vec3 forward()     const;
    Vec3 right()       const;
    Vec3 up()          const;
};

}  // namespace Caffeine::Render
```

Defaults: FOV 60°, 16:9, near 0.1, far 1000, position `(0, 0, -5)`.

---

## Perspective projection mathematics

```text
Projection Matrix (perspective):
    f = 1 / tan(fovY/2)

    [f/aspect,  0,      0,                0]
    [0,         f,      0,                0]
    [0,         0,  far/(far-near),       1]
    [0,         0, -far*near/(far-near),  0]

View Matrix (from the rotation quaternion):
    view = inverse(rotation) * translate(-position)
```

`viewProjectionMatrix()` returns `projection * view` and only recomputes when a setter marked
the camera dirty.

---

## Frustum culling integration

```cpp
// Camera3D builds the frustum from its own parameters:
Spatial::Frustum frustum = camera3D.frustum();

// The GPU scene renderer tests every mesh AABB against it:
if (!frustum.intersects(aabb)) return;  // no draw
```

---

## Usage examples

```cpp
// ── Perspective setup ─────────────────────────────────────────
Caffeine::Render::Camera3D camera;
camera.setFOV(60.0f);
camera.setAspect(1280.0f / 720.0f);
camera.setNearFar(0.1f, 1000.0f);
camera.setViewport({ {0, 0}, {1280, 720} });
camera.lookAt({0, 5, -10}, {0, 0, 0});

// ── FPS camera ────────────────────────────────────────────────
camera.rotateFPS(input.axisValue(Axis::LookY) * sensitivity,
                 input.axisValue(Axis::LookX) * sensitivity);

Vec3 moveDir = {
    input.axisValue(Axis::MoveX),
    0,
    input.axisValue(Axis::MoveY)
};
camera.moveFPS(moveDir * moveSpeed * dt);

// ── Follow (third person) ─────────────────────────────────────
camera.follow(playerEntity, {0, 3, -6}, 0.05f);
camera.update(dt, world);

// ── Orbital (editor/strategy) ─────────────────────────────────
camera.setOrbitTarget({0, 0, 0});
camera.setOrbitDistance(15.0f);
camera.orbit(deltaX * 0.5f, deltaY * 0.5f);
camera.zoom(scrollDelta);
```

---

## Coexistence with Camera2D

```cpp
// 2D + 3D in the same frame:

// 3D (world) — linear HDR scene + post-processing into colorTarget
renderer.renderWithCamera(cmd, world, camera, colorTarget, depthTarget,
                          width, height, projectRoot, options);

// 2D (HUD on top)
cmd->beginRenderPass(hudPassDesc);
batchRenderer.setCamera(camera2D);  // orthographic
batchRenderer.endFrame(cmd);
cmd->endRenderPass();
```

---

## Behaviour notes

- `rotateFPS` clamps pitch to `[-89, +89]` and keeps roll at zero.
- `orbit` clamps elevation the same way and recomputes the position around the orbit target.
- `follow` lerps the position towards the target's `Position3D` plus a local offset; `dt` is
  currently unused, so smoothing is per call.
- `screenToWorld` unprojects with the inverse view-projection at the requested depth.

---

## Dependencies

- **Upstream:** [3D Math](../math/vectors.md), [Spatial Partitioning](../physics/spatial-partitioning.md), [ECS](../ecs/core.md)
- **Downstream:** [Mesh Loading](../assets/mesh-loading.md), [Skeletal Animation](../animation/skeletal-animation.md)

---

## References

- [`architecture_specs.md`](../architecture_specs.md) — §10 Camera System, RF5.5-5.6
- [`camera-2d.md`](camera-2d.md) — Camera2D (for coexistence)
- [`../physics/spatial-partitioning.md`](../physics/spatial-partitioning.md) — frustum culling via Octree
