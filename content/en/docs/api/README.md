# API Reference

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Module-by-module entry points into the engine API, with links to the headers and the matching documentation page.</p>

> Complete API documentation for Caffeine Engine


**Headless use:** [Build scenes and render images without the editor](headless-engine-api.md)

## Module Index

### Core Module

| Type/Function | Description | Header |
|---------------|-------------|--------|
| `u8` , `u16` , `u32` , `u64` | Unsigned integers | [`src/caffeine/core/Types.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Types.hpp) |
| `i8` , `i16` , `i32` , `i64` | Signed integers | [`src/caffeine/core/Types.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Types.hpp) |
| `f32` , `f64` | Floating point | [`src/caffeine/core/Types.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Types.hpp) |
| `CF_ASSERT(condition, msg)` | Debug assertion | [`src/caffeine/core/Assertions.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Assertions.hpp) |
| `CF_PLATFORM_WINDOWS` | Windows platform macro | [`src/caffeine/core/Platform.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Platform.hpp) |
| `CF_PLATFORM_LINUX` | Linux platform macro | [`src/caffeine/core/Platform.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Platform.hpp) |
| `CF_PLATFORM_MACOS` | macOS platform macro | [`src/caffeine/core/Platform.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Platform.hpp) |

**Documentation:** [`docs/core/types.md`](../core/types.md)

### Memory Module

| Class | Description | Header |
|-------|-------------|--------|
| `IAllocator` | Base allocator interface | [`src/caffeine/memory/Allocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/Allocator.hpp) |
| `LinearAllocator` | O(1) allocation, reset() clears all | [`src/caffeine/memory/LinearAllocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/LinearAllocator.hpp) |
| `PoolAllocator` | Fixed-size slot allocator | [`src/caffeine/memory/PoolAllocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/PoolAllocator.hpp) |
| `StackAllocator` | Marker-based allocator | [`src/caffeine/memory/StackAllocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/StackAllocator.hpp) |

**Documentation:** [`docs/memory/allocators.md`](../memory/allocators.md) | [`docs/memory/memory-model.md`](../memory/memory-model.md)

### Containers Module

| Class | Description | Header |
|-------|-------------|--------|
| `Vector<T>` | Dynamic array | [`src/caffeine/containers/Vector.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/Vector.hpp) |
| `HashMap<K, V>` | Hash table | [`src/caffeine/containers/HashMap.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/HashMap.hpp) |
| `StringView` | Non-owning string | [`src/caffeine/containers/StringView.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/StringView.hpp) |
| `FixedString<N>` | Fixed-size string | [`src/caffeine/containers/FixedString.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/FixedString.hpp) |

**Documentation:** [`docs/memory/containers.md`](../memory/containers.md)

### Math Module

| Class/Function | Description | Header |
|----------------|-------------|--------|
| `Vec2` | 2D vector | [`src/caffeine/math/Vec2.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Vec2.hpp) |
| `Vec3` | 3D vector | [`src/caffeine/math/Vec3.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Vec3.hpp) |
| `Vec4` | 4D vector | [`src/caffeine/math/Vec4.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Vec4.hpp) |
| `Mat4` | 4x4 matrix | [`src/caffeine/math/Mat4.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Mat4.hpp) |
| `Math::lerp()` | Linear interpolation | [`src/caffeine/math/Math.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Math.hpp) |
| `Math::clamp()` | Clamp value | [`src/caffeine/math/Math.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Math.hpp) |
| `Math::isPowerOfTwo()` | Power of two check | [`src/caffeine/math/Math.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Math.hpp) |

**Documentation:** [`docs/math/vectors.md`](../math/vectors.md)

## Quick Start

```cpp
#include <Caffeine.hpp>

// Using types
Caffeine::u32 count = 42;
Caffeine::f32 health = 100.0f;

// Using containers
Caffeine::Vector<Caffeine::f32> positions;
positions.pushBack(1.0f);
positions.pushBack(2.0f);

// Using math
Caffeine::Vec3 pos(1.0f, 2.0f, 3.0f);
Caffeine::Mat4 transform = Caffeine::Mat4::translation(pos);
```

## Cross-Module References

| From | To | Reference |
|------|-----|-----------|
| Vector | Memory | Uses IAllocator for allocation |
| All | Core | Uses types (u32, f32, etc.) |
| Math | Core | Uses types in vector/matrix operations |
| Containers | Core | Uses types for indices and sizes |

## See Also

- [MASTER.md](../MASTER.md) - Complete documentation
- [Core Types](../core/types.md)
- [Memory Allocators](../memory/allocators.md)
- [Memory Containers](../memory/containers.md)
- [Math Vectors](../math/vectors.md)
- [HISTORY.md](../HISTORY.md) - Development history
