# ☕ Caffeine Engine — Master Documentation

**Versão:** 1.1.0
**Status:**Alpha (Pre-production)
** Last Update:** 2026-09-22
**Mantido por:** Codex Studio Guild

---

## General Index

### 📚 Guias Principal

| Documento | Description | Link |
|-----------|-----------|------|
| **MASTER.md** (este) | Complete unified documentation | — |
| **HISTORY.md** | Development history (roadmap, plans, revisions) | [`docs/HISTORY.md`](docs/HISTORY.md) |
| **architecture_specs.md** | Detailed technical specifications | [`docs/architecture_specs.md`](docs/architecture_specs.md) |
| **Functional Index** | Documentation by module | [`docs/README.md`](docs/README.md) |
| **Engine Pillars** | Fundamental engineering pillars (Phong, Bullet3, OpenAL, ECS, networking, PBR...) | [`docs/plans/2026-09-22-engine-pillars-roadmap.md`](docs/plans/2026-09-22-engine-pillars-roadmap.md) |
| **Rendering Roadmap** | Technical 3D rendering plan (P0–P6) | [`docs/plans/2026-09-21-rendering-roadmap.md`](docs/plans/2026-09-21-rendering-roadmap.md) |

---

## 🗂️ Documentation Structure

- `docs/`
  - `README.md # Índice funcional da documentação`
  - `MASTER.md # Documentação unificada (este arquivo)`
  - `HISTORY.md # Histórico de desenvolvimento`
  - `architecture_specs.md # Especificações técnicas`
  - `api/`
    - `README.md # 📖 Referência da API`
  - `core/ # 🔧 Módulo Core (types, timer, game-loop, events)`
  - `memory/ # 💾 Módulo Memory (allocators, memory-model, containers)`
  - `math/ # 📐 Módulo Math (vectors, quaternions)`
  - `concurrency/ # ⚡ Concurrency (job-system)`
  - `input/ # 🎮 Input (input-system)`
  - `rendering/ # 🎨 Rendering (rhi, batch-renderer, camera-2d, camera-3d)`
  - `assets/ # 📦 Assets (asset-manager, caf-format, mesh-loading, asset-pipeline)`
  - `ecs/ # 🧩 ECS (core, scene, examples)`
  - `terrain/ # 🏔️ Terrain (heightmap, LOD, plugin de geração)`
  - `physics/ # 🌌 Physics (physics-2d, spatial-partitioning)`
  - `animation/ # 🎬 Animation (animation-2d, skeletal-animation)`
  - `audio/ # 🔊 Audio (audio-system)`
  - `ui/ # 🖥️ UI (game-ui, editor-ui)`
  - `editor/ # 🛠️ Editor (scene-editor)`
  - `scripting/ # 📜 Scripting`
  - `debug/ # 🐛 Debug (debug-tools, testing)`


---

> The complete history of development (phases, status, plans and revisions) was moved to [`HISTORY.md`](HISTORY.md).

---

## 🏗️ Implemented Modules (Phase 1)

### File Structure vs Documentation

| Module | Header File | Documentation Architecture | API Reference |
|--------|---------------|-------------------------|----------------|
| **Core** | [`src/core/Types.hpp`](src/core/Types.hpp) | [`docs/core/types.md`](docs/core/types.md) | §1.1 |
| | [`src/core/Platform.hpp`](src/core/Platform.hpp) | | |
| | [`src/core/Compiler.hpp`](src/core/Compiler.hpp) | | |
| | [`src/core/Assertions.hpp`](src/core/Assertions.hpp) | | |
| **Memory** | [`src/memory/Allocator.hpp`](src/memory/Allocator.hpp) | [`docs/memory/allocators.md`](docs/memory/allocators.md) | §1.2 |
| | [`src/memory/LinearAllocator.hpp`](src/memory/LinearAllocator.hpp) | [`docs/memory/memory-model.md`](docs/memory/memory-model.md) | |
| | [`src/memory/PoolAllocator.hpp`](src/memory/PoolAllocator.hpp) | | |
| | [`src/memory/StackAllocator.hpp`](src/memory/StackAllocator.hpp) | | |
| **Containers** | [`src/containers/Vector.hpp`](src/containers/Vector.hpp) | [`docs/memory/containers.md`](docs/memory/containers.md) | §1.3 |
| | [`src/containers/HashMap.hpp`](src/containers/HashMap.hpp) | | |
| | [`src/containers/StringView.hpp`](src/containers/StringView.hpp) | | |
| | [`src/containers/FixedString.hpp`](src/containers/FixedString.hpp) | | |
| **Math** | [`src/math/Vec2.hpp`](src/math/Vec2.hpp) | [`docs/math/vectors.md`](docs/math/vectors.md) | §1.4 |
| | [`src/math/Vec3.hpp`](src/math/Vec3.hpp) | | |
| | [`src/math/Vec4.hpp`](src/math/Vec4.hpp) | | |
| | [`src/math/Mat4.hpp`](src/math/Mat4.hpp) | | |
| | [`src/math/Math.hpp`](src/math/Math.hpp) | | |

---

## 📖 Section Navigation

### 1. Overview & Development

- [**HISTORY.md**](HISTORY.md) — Histórico completo de desenvolvimento
- [**Engine Pillars**](plans/2026-09-22-engine-pillars-roadmap.md) — Roadmap of fundamental systems (Phong, Bullet3, OpenAL, ECS, networking, PBR, animation...)
- [**Rendering Roadmap**](plans/2026-09-21-rendering-roadmap.md) — Technical rendering plan High volume 3D
- [**architecture specs.md**](architecture specs.md) — Detailed technical specifications

### 2. Module Documentation

| Module | Documentation | API |
|--------|-------------|-----|
| **Core** | [`core/types.md`](core/types.md), [`core/timer.md`](core/timer.md), [`core/game-loop.md`](core/game-loop.md), [`core/events.md`](core/events.md) | [`api/README.md`](docs/api/README.md) |
| **Memory** | [`memory/allocators.md`](memory/allocators.md), [`memory/memory-model.md`](memory/memory-model.md), [`memory/containers.md`](memory/containers.md) | [`api/README.md`](docs/api/README.md) |
| **Math** | [`math/vectors.md`](math/vectors.md), [`math/quaternions.md`](math/quaternions.md) | [`api/README.md`](docs/api/README.md) |
| **Concurrency** | [`concurrency/job-system.md`](concurrency/job-system.md) | [`api/README.md`](docs/api/README.md) |
| **Input** | [`input/input-system.md`](input/input-system.md) | [`api/README.md`](docs/api/README.md) |
| **Rendering** | [`rendering/rhi.md`](rendering/rhi.md), [`rendering/batch-renderer.md`](rendering/batch-renderer.md), [`rendering/camera-2d.md`](rendering/camera-2d.md), [`rendering/camera-3d.md`](rendering/camera-3d.md) | [`api/README.md`](docs/api/README.md) |
| **Assets** | [`assets/asset-manager.md`](assets/asset-manager.md), [`assets/caf-format.md`](assets/caf-format.md), [`assets/mesh-loading.md`](assets/mesh-loading.md), [`assets/asset-pipeline.md`](assets/asset-pipeline.md) | [`api/README.md`](docs/api/README.md) |
| **ECS** | [`ecs/README.md`](ecs/README.md), [`ecs/core.md`](ecs/core.md), [`ecs/scene.md`](ecs/scene.md), [`ecs/examples.md`](ecs/examples.md) | [`api/README.md`](docs/api/README.md) |
| **Physics** | [`physics/physics-2d.md`](physics/physics-2d.md), [`physics/spatial-partitioning.md`](physics/spatial-partitioning.md) | [`api/README.md`](docs/api/README.md) |
| **Animation** | [`animation/animation-2d.md`](animation/animation-2d.md), [`animation/skeletal-animation.md`](animation/skeletal-animation.md) | [`api/README.md`](docs/api/README.md) |
| **Audio** | [`audio/audio-system.md`](audio/audio-system.md) | [`api/README.md`](docs/api/README.md) |
| **UI** | [`ui/game-ui.md`](ui/game-ui.md), [`ui/editor-ui.md`](ui/editor-ui.md) | [`api/README.md`](docs/api/README.md) |
| **Editor** | [`editor/scene-editor.md`](editor/scene-editor.md) | [`api/README.md`](docs/api/README.md) |
| **Scripting** | [`scripting/scripting.md`](scripting/scripting.md) | [`api/README.md`](docs/api/README.md) |
| **Debug** | [`debug/debug-tools.md`](debug/debug-tools.md), [`debug/testing.md`](debug/testing.md) | [`api/README.md`](docs/api/README.md) |

For the full index with detailed descriptions, see [`docs/README.md`](README.md).

### 4. Tests

The tests are located in [`tests/`](../tests/) e cobrem:

| File | Cobertura |
|---------|-----------|
| [`tests/test_core.cpp`](../tests/test_core.cpp) | 8 tests (Types, Platform, Compiler, Assertions) |
| [`tests/test_allocators.cpp`](../tests/test_allocators.cpp) | 16 tests + 3 stress tests |
| [`tests/test_containers.cpp`](../tests/test_containers.cpp) | 14 tests + 1 stress test |
| [`tests/test_math.cpp`](../tests/test_math.cpp) | 18 tests |

---

## 🔗 Cross-Reference Index

### Module Dependencies

- `Caffeine.hpp`
  - `Core (types, platform, assertions)`
    - `Dependency: NONE (base)`
  - `Memory (allocators)`
    - `Dependency: Core`
  - `Containers (Vector, HashMap, String)`
    - `Dependency: Core, Memory (optional)`
  - `Math (Vec2, Vec3, Vec4, Mat4, Quat)`
    - `Dependency: Core`
  - `[Fase 2] Threading, Core Runtime`
    - `Timer → Core`
    - `Job System → Core, Threading`
    - `Game Loop → Timer, Job System`
    - `Input → Core, Events (Fase 4)`
    - `Debug Tools → Core, Containers`
  - `[Fase 3] RHI & Rendering`
    - `RHI → Core, Math`
    - `Batch Renderer → RHI, Math, Containers`
    - `Camera 2D → Math`
    - `Asset Manager → Core, Containers, Threading`
    - `CAF Format → Asset Manager`
  - `[Fase 4] ECS & Game Systems`
    - `ECS → Core, Memory, Containers`
    - `Scene Manager → ECS, Asset Manager`
    - `Events → Core, Containers`
    - `Audio → Asset Manager, ECS`
    - `Animation → ECS, Asset Manager`
    - `Physics 2D → ECS, Math`
    - `UI System → RHI, Input, Events`
  - `[Fase 5] 3D Extension`
    - `3D Math → Math (Vec3, Mat4, Quat)`
    - `Mesh Loading → Asset Manager, RHI`
    - `Spatial / Octree → Math, Physics 2D`
    - `Camera 3D → 3D Math`
    - `Skeletal Anim → Animation, ECS, 3D Math`
  - `[Fase 6] Caffeine Studio IDE`
  - `Embedded UI → RHI, Debug Tools, Asset Manager`
  - `Scene Editor → ECS, Scene, Embedded UI, RHI`
  - `Asset Pipeline → Asset Manager, CAF Format (CLI tool)`
  - `Scripting → ECS, Input, Events, Debug Tools`


### Quick Links by Topic

| Topic | Main Documentation |
|--------|------------------------|
| **Tipos fundamentais** | [`src/core/Types.hpp`](src/core/Types.hpp) + [`docs/core/types.md`](docs/core/types.md) |
| **Allocators** | [`docs/memory/memory-model.md`](docs/memory/memory-model.md) + [`docs/memory/allocators.md`](docs/memory/allocators.md) |
| **Vector<T>** | [`src/containers/Vector.hpp`](src/containers/Vector.hpp) + [`docs/memory/containers.md`](docs/memory/containers.md) |
| **HashMap<K,V>** | [`src/containers/HashMap.hpp`](src/containers/HashMap.hpp) + [`docs/memory/containers.md`](docs/memory/containers.md) |
| **Vec2/Vec3/Vec4** | [`src/math/Vec2.hpp`](src/math/Vec2.hpp) + [`docs/math/vectors.md`](docs/math/vectors.md) |
| **Mat4** | [`src/math/Mat4.hpp`](src/math/Mat4.hpp) + [`docs/math/vectors.md`](docs/math/vectors.md) |
| **Timer** | [`core/timer.md`](core/timer.md) |
| **Game Loop** | [`core/game-loop.md`](core/game-loop.md) |
| **Job System** | [`concurrency/job-system.md`](concurrency/job-system.md) |
| **Input** | [`input/input-system.md`](input/input-system.md) |
| **Debug / Profiler** | [`debug/debug-tools.md`](debug/debug-tools.md) |
| **RHI** | [`rendering/rhi.md`](rendering/rhi.md) |
| **Batch Renderer** | [`rendering/batch-renderer.md`](rendering/batch-renderer.md) |
| **Asset Manager** | [`assets/asset-manager.md`](assets/asset-manager.md) |
| **CAF Format** | [`assets/caf-format.md`](assets/caf-format.md) |
| **ECS** | [`ecs/core.md`](ecs/core.md) |
| **Scene Manager** | [`ecs/scene.md`](ecs/scene.md) |
| **Events** | [`core/events.md`](core/events.md) |
| **Audio** | [`audio/audio-system.md`](audio/audio-system.md) |
| **Animation** | [`animation/animation-2d.md`](animation/animation-2d.md) |
| **Physics 2D** | [`physics/physics-2d.md`](physics/physics-2d.md) |
| **UI (game HUD)** | [`ui/game-ui.md`](ui/game-ui.md) |
| **Quaternions / 3D Math** | [`math/quaternions.md`](math/quaternions.md) |
| **Mesh Loading** | [`assets/mesh-loading.md`](assets/mesh-loading.md) |
| **Spatial / Octree** | [`physics/spatial-partitioning.md`](physics/spatial-partitioning.md) |
| **Camera 3D** | [`rendering/camera-3d.md`](rendering/camera-3d.md) |
| **Skeletal Animation** | [`animation/skeletal-animation.md`](animation/skeletal-animation.md) |
| **Embedded ImGui** | [`ui/editor-ui.md`](ui/editor-ui.md) |
| **Scene Editor** | [`editor/scene-editor.md`](editor/scene-editor.md) |
| **Asset Pipeline CLI** | [`assets/asset-pipeline.md`](assets/asset-pipeline.md) |
| **Scripting (Lua)** | [`scripting/scripting.md`](scripting/scripting.md) |

---

## 🧭 Contribution Guide

### For Architects (Implementation)

1. **Consultar HISTÓRICO:** Verificar contexto do desenvolvimento em [`HISTORY.md`](HISTORY.md)
2. **Consultar SPECS:** Ler regras em [`architecture_specs.md`](architecture_specs.md)
3. * *Implement:** Create code on `src/`
4. **Document:** Update corresponding documentation on `docs/<modulo>/`
5. * *Test:** Ensure that tests pass in IC
6. **Code Review:** Pull Request with approval

### For Scribes (Documentation)

1. * *Before encoding:** Documentation must exist in `docs/<modulo>/` (ex: `docs/concurrency/job-system.md` )
2. == sync, corrected by elderman == @elder man
3. ** Clearness:** If explanation > code, simplify
4. **AGNOSTICISM:** Toda spec deve prever 2D e 3D

---

## 📋 External References

### Documentation
- [SDL3 Documentation](https://wiki.libsdl.org/)
- [SDL_GPU API](https://github.com/libsdl-org/SDL_gpu/)
- [C++20 Standard](https://en.cppreference.com/)

### Livros e Conceitos
- [Data-Oriented Design — Richard Fabian](https://www.dataorienteddesign.com/)
- [Game Programming Patterns — Robert Nystrom](https://gameprogrammingpatterns.com/)
- [Game Engine Architecture — Jason Gregory](https://www.gameenginebook.com/)

### Reference Engines
- [flecs](https://github.com/SanderMertens/flecs) — ECS archetype-based
- [EnTT](https://github.com/skypjack/entt) — ECS patterns
- [Jolt Physics](https://github.com/jrouwe/JoltPhysics) — Job System

---

## 📦 Main Inclusion Header

```cpp
#include <Caffeine.hpp>

// Agora disponíveis:
// - Tipos: Caffeine::u32, Caffeine::f32, etc.
// - Containers: Caffeine::Vector<T>, Caffeine::HashMap<K,V>, etc.
// - Math: Caffeine::Vec2, Caffeine::Mat4, etc.
// - Memory: Caffeine::LinearAllocator, etc.
```

---

> *Caffeine: Because great games are built on strong code and a lot of coffee. *