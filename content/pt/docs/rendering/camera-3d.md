# Camera 3D

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/Camera3D.hpp"><code>render/Camera3D.hpp</code></a></span>
</div>

<p class="doc-lede">Câmara perspectiva usada pelo viewport 3D e pelo runtime: matrizes de view
e projecção, conversão ecrã/mundo, um frustum para culling e controlos FPS/orbital/follow.</p>

---

## Visão Geral

A `Camera3D` fornece projecção perspectiva para render 3D e coexiste com a `Camera2D`: o mesmo
frame pode desenhar 2D (HUD, sprites) e 3D (ambiente, personagens) com câmaras diferentes.

---

## API

```cpp
namespace Caffeine::Render {

class Camera3D {
public:
    Camera3D() = default;

    // ── Matrizes ──────────────────────────────────────────────
    Mat4 viewMatrix()           const;
    Mat4 projectionMatrix()     const;
    Mat4 viewProjectionMatrix() const;   // em cache, recalculada quando dirty

    // Frustum para culling
    Spatial::Frustum frustum() const;

    // ── Conversão de espaço ───────────────────────────────────
    Vec3 worldToScreen(Vec3 worldPos) const;              // pixels + profundidade 0..1
    Vec3 screenToWorld(Vec2 screenPos, f32 depth = 0.5f) const;
    bool isVisible(const Spatial::AABB3D& bounds) const;

    // ── Configuração perspectiva ──────────────────────────────
    void setFOV(f32 fovYDegrees);      // limitado a 1..179
    void setAspect(f32 aspect);
    void setNearFar(f32 nearPlane, f32 farPlane);
    void setViewport(Rect2D viewport);

    // ── Transform ─────────────────────────────────────────────
    void setPosition(Vec3 pos);
    void setRotation(Quat rot);
    void lookAt(Vec3 eye, Vec3 target, Vec3 up = {0, 1, 0});

    // ── Modo FPS ──────────────────────────────────────────────
    void rotateFPS(f32 deltaPitch, f32 deltaYaw);  // graus; pitch limitado a ±89
    void moveFPS(Vec3 localDelta);                 // espaço local

    // ── Modo orbital ──────────────────────────────────────────
    void orbit(f32 deltaAzimuth, f32 deltaElevation);
    void setOrbitTarget(Vec3 target);
    void setOrbitDistance(f32 distance);
    void zoom(f32 delta);

    // ── Modo follow ───────────────────────────────────────────
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

Defaults: FOV 60°, 16:9, near 0.1, far 1000, posição `(0, 0, -5)`.

---

## Matemática da projecção perspectiva

```text
Matriz de projecção (perspectiva):
    f = 1 / tan(fovY/2)

    [f/aspect,  0,      0,                0]
    [0,         f,      0,                0]
    [0,         0,  far/(far-near),       1]
    [0,         0, -far*near/(far-near),  0]

Matriz de view (a partir do quaternion de rotação):
    view = inverse(rotation) * translate(-position)
```

`viewProjectionMatrix()` devolve `projection * view` e só recalcula quando um setter marcou a
câmara como dirty.

---

## Integração do frustum culling

```cpp
// A Camera3D constrói o frustum a partir dos seus próprios parâmetros:
Spatial::Frustum frustum = camera3D.frustum();

// O GPU scene renderer testa cada AABB de mesh contra ele:
if (!frustum.intersects(aabb)) return;  // sem draw
```

---

## Exemplos de uso

```cpp
// ── Setup perspectiva ─────────────────────────────────────────
Caffeine::Render::Camera3D camera;
camera.setFOV(60.0f);
camera.setAspect(1280.0f / 720.0f);
camera.setNearFar(0.1f, 1000.0f);
camera.setViewport({ {0, 0}, {1280, 720} });
camera.lookAt({0, 5, -10}, {0, 0, 0});

// ── Câmara FPS ────────────────────────────────────────────────
camera.rotateFPS(input.axisValue(Axis::LookY) * sensitivity,
                 input.axisValue(Axis::LookX) * sensitivity);

Vec3 moveDir = {
    input.axisValue(Axis::MoveX),
    0,
    input.axisValue(Axis::MoveY)
};
camera.moveFPS(moveDir * moveSpeed * dt);

// ── Follow (terceira pessoa) ──────────────────────────────────
camera.follow(playerEntity, {0, 3, -6}, 0.05f);
camera.update(dt, world);

// ── Orbital (editor/estratégia) ───────────────────────────────
camera.setOrbitTarget({0, 0, 0});
camera.setOrbitDistance(15.0f);
camera.orbit(deltaX * 0.5f, deltaY * 0.5f);
camera.zoom(scrollDelta);
```

---

## Coexistência com a Camera2D

```cpp
// 2D + 3D no mesmo frame:

// 3D (mundo) — cena HDR linear + pós-processamento para colorTarget
renderer.renderWithCamera(cmd, world, camera, colorTarget, depthTarget,
                          width, height, projectRoot, options);

// 2D (HUD por cima)
cmd->beginRenderPass(hudPassDesc);
batchRenderer.setCamera(camera2D);  // ortográfica
batchRenderer.endFrame(cmd);
cmd->endRenderPass();
```

---

## Notas de comportamento

- `rotateFPS` limita o pitch a `[-89, +89]` e mantém o roll a zero.
- `orbit` limita a elevação da mesma forma e recalcula a posição em torno do alvo orbital.
- `follow` interpola a posição para o `Position3D` do alvo mais um offset local; o `dt` ainda
  não é usado, pelo que a suavização é por chamada.
- `screenToWorld` desprojeta com a inversa da view-projecção na profundidade pedida.

---

## Dependências

- **Upstream:** [3D Math](../math/vectors.md), [Spatial Partitioning](../physics/spatial-partitioning.md), [ECS](../ecs/core.md)
- **Downstream:** [Mesh Loading](../assets/mesh-loading.md), [Skeletal Animation](../animation/skeletal-animation.md)

---

## Referências

- [`architecture_specs.md`](../architecture_specs.md) — §10 Camera System, RF5.5-5.6
- [`camera-2d.md`](camera-2d.md) — Camera2D (para coexistência)
- [`../physics/spatial-partitioning.md`](../physics/spatial-partitioning.md) — frustum culling via Octree
