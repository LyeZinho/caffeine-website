# 📐 3D Math Extension

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine</code> (types) / <code>Caffeine::Math</code> (functions)</span>
  <span><strong>Files:</strong> <code>src/caffeine/math/Quat.hpp</code>, <code>src/caffeine/math/Mat4.hpp</code> (perspective, lookAt)</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">How quaternions represent 3D rotations in Caffeine: the
<code>Quat</code> API, interpolation, conversion to matrices, and the ECS
components that store rotation data.</p>

> **Tests:** `tests/test_math.cpp` (49 cases, including slerp/toMatrix/fromMatrix)
> **RF:** RF5.1

---

## Overview

`Quat` adds quaternion rotations to the math library for stable 3D orientation
without gimbal lock. `Vec2`, `Vec3`, `Vec4` and `Mat4` already provide the
vector and matrix types; `Mat4` also supplies `rotationX/Y/Z`, `perspective` and
`lookAt`.

---

## API

```cpp
namespace Caffeine {

// Quaternion for 3D rotations.
// Representation: (x, y, z, w), where w is the scalar part.
// Benefits: no gimbal lock, smooth SLERP, conversion to/from Matrix and Euler.
struct Quat {
    f32 x = 0, y = 0, z = 0, w = 1;  // identity

    // ── Static constructors ─────────────────────────────────────
    static Quat identity()   { return {0, 0, 0, 1}; }
    static Quat fromAxisAngle(Vec3 axis, f32 angleRad);  // axis normalized internally
    static Quat fromEuler(f32 pitchRad, f32 yawRad, f32 rollRad);  // ZYX convention
    static Quat lookAt(Vec3 forward, Vec3 up);  // NO default: pass up explicitly
    static Quat fromMatrix(const Mat4& m);      // Shoemake (1987) algorithm

    // ── Interpolation ───────────────────────────────────────────
    static Quat slerp(Quat a, Quat b, f32 t);   // spherical (shortest arc; linear fallback when a·b > 0.9999)
    static Quat nlerp(Quat a, Quat b, f32 t);   // normalized linear (faster, not constant angular velocity)

    // ── Conversions ─────────────────────────────────────────────
    Vec3 toEuler()  const;   // ZYX, inverse of fromEuler()
    Mat4 toMatrix() const;   // column-major rotation (v' = q·v·q⁻¹)

    // ── Operations ──────────────────────────────────────────────
    Vec3 rotate(Vec3 v) const;          // rotates a vector (2 cross products)
    Quat conjugate()    const { return {-x, -y, -z, w}; }
    Quat inverse()      const;          // conjugate / |q|²
    Quat normalized()   const;          // identity when length is zero (silent)
    f32  length()       const;
    f32  lengthSquared() const;
    f32  dot(Quat o)    const { return x*o.x + y*o.y + z*o.z + w*o.w; }

    Quat operator*(Quat o)  const;   // composition (applies o first, then this)
    Vec3 operator*(Vec3 v)  const { return rotate(v); }
    bool operator==(Quat o) const;   // EXACT float equality
};

// 3D Mat4 methods (all implemented):
// identity, zero, translation, scale, rotationX/Y/Z, ortho, perspective,
// lookAt. There is NO Mat4::fromQuat — use Quat::toMatrix() for
// quaternion → matrix.

}  // namespace Caffeine
```

---

## Quaternion vs Euler vs Rotation Matrix

| Representation | Memory | Composition | Interpolation | Problem |
|---------------|---------|------------|--------------|---------|
| **Euler** (pitch/yaw/roll) | 12B | Yes | Lerp (with artifacts) | Gimbal lock |
| **Quaternion** | 16B | O(1) | Smooth SLERP | Unintuitive view |
| **Rotation Matrix** | 64B | O(n²) | Difficult | Redundant |

**Caffeine represents rotations with quaternions** (`Quat`) and converts to a
matrix only when uploading to the shader. The ECS `Rotation3D` component stores
the same x/y/z/w components in a `Vec4`, not a `Quat`; convert explicitly when
crossing that boundary.

---

## Usage Examples

```cpp
// ── Rotation around an axis ───────────────────────────────────
Caffeine::Quat rot = Caffeine::Quat::fromAxisAngle({0, 1, 0}, Caffeine::Math::PI_HALF);  // 90° around Y
Caffeine::Vec3 rotated = rot * Caffeine::Vec3{1, 0, 0};  // → {0, 0, -1}

// ── Euler to quaternion ───────────────────────────────────────
Caffeine::Quat camRot = Caffeine::Quat::fromEuler(pitch, yaw, 0);

// ── SLERP for a smooth camera ─────────────────────────────────
Caffeine::Quat current = /* current orientation */;
Caffeine::Quat target  = Caffeine::Quat::lookAt(direction, {0, 1, 0});
Caffeine::Quat smooth  = Caffeine::Quat::slerp(current, target, 0.1f * dt * 60);

// ── Convert for the shader ────────────────────────────────────
Caffeine::Mat4 modelMatrix = Caffeine::Mat4::translation(pos) * quat.toMatrix() * Caffeine::Mat4::scale(scale);
// upload modelMatrix to the shader through a uniform buffer
```

---

## 3D ECS Components (real)

```cpp
namespace Caffeine::ECS {

struct Position3D { Vec3 position; };
// ⚠️ Rotation3D stores a Vec4 (x, y, z, w), NOT a Quat — convert manually:
struct Rotation3D { Vec4 quaternion = Vec4(0.0f, 0.0f, 0.0f, 1.0f); };
struct Scale3D    { Vec3 scale = Vec3(1.0f, 1.0f, 1.0f); };

}  // namespace Caffeine::ECS
```

> There are no `Velocity3D` or `WorldTransform3D` components in the code. See
> `src/caffeine/ecs/Components3D.hpp`.

---

## Acceptance Criteria

- [x] `Quat::slerp` interpolates correctly (`tests/test_math.cpp`: same quat, t=0/t=1)
- [x] `quat.toMatrix()` equals `Mat4::rotationY(angle)` for the same angle (tested)
- [x] `fromMatrix(identity)` equals identity; `fromEuler` / `toEuler` round-trip tested
- [x] `Quat * Vec3` rotates correctly (`rotate` preserves length)
- [ ] `Mat4::fromQuat` — does not exist (use `toMatrix()`); decide whether to add the helper
- [ ] SIMD (`CF_SIMD`, `simdAdd`...) — does not exist in the code; section removed
- [ ] `Rotation3D` stores `Quat` instead of `Vec4` (API improvement)

---

## Dependencies

- **Upstream:** [Vec3, Vec4, Mat4](vectors.md)
- **Downstream:** [Camera 3D](../rendering/camera-3d.md), [Skeletal Animation](../animation/skeletal-animation.md), [Mesh Loading](../assets/mesh-loading.md)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Rendering & Pipeline]() | Quaternions and Mat4 in the 3D pipeline |
| [Memory & Data]() | Mathematical types as fundamental data |

## References

- [`docs/architecture_specs.md`](../architecture_specs.md) — §15 Math Library
- [`docs/math/vectors.md`](../math/vectors.md) — existing Vec/Mat documentation
- [Transversal Topic Index]()
