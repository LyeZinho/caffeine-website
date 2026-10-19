# 📜 Developer History

> Compressed development artifacts — phases, roadmaps, plans and revisions.
> For actual engine technical documentation, see [`README.md`](README.md).
> For the full chronological record of commits, see the [`CHANGELOG.md`](../CHANGELOG.md) at the root of the repository.

---

## Forward PBR, reflections and post-processing GPU (2026-10-02)

Block that consolidates rendering in **core**: pipeline HDR + `PostProcessStack` (TAA, SSAO, bloom, DoF, ...), PBR materials in `scene_lit` , reflection probes per object, Editor Material with GPU preview, full Lua API post-processing and execution of `customEffectScript` em play mode. Doppio deixa de simular efeitos com overlays ImGui.

* *Documentation:** [`plans/2026-10-02-forward-pbr-post-session.md`](plans/2026-10-02-forward-pbr-post-session.md)

---

## Performance — Viewport editor (2026-09-23)

Research of FPS in Doppio: **~10 FPS → ~100 FPS** after fixing redundancy in `GpuSceneRenderer::draw` (shadow UBO + bids per ground chunk), LOD/cap resolution, skybox throttle, GPU/CPU frame separation.

* *Documentation:** [`performance/editor-viewport-performance.md`](performance/editor-viewport-performance.md)

---

## Pilares Fundamentais (2026-09-22)

Subsystems that the engine must have in a solid way** — Phong 3D, events with timers, Bullet3, OpenAL, ECS integrated, handsles with refcount, networking, deferred PBR, animation, scene management, future scripting (C#/Python) and Android (maybe) — are documented in:

**[`plans/2026-09-22-engine-pillars-roadmap.md`](plans/2026-09-22-engine-pillars-roadmap.md)**

This roadmap complements the steps below with acceptance criteria by pillar and suggested order of implementation.

---

## Fases de Desenvolvimento

The project was structured in 6 progressive phases. Below is the summary of each phase and its current status.

| Phase | Nome | Description | Status |
|:----:|------|-----------|:------:|
| 0 | Setup & Docs | Infrastructure, repository, IC, basic documentation | ✅ Completo |
| 1 | Atomic Foundation | Core types, custom allocators, containers, math library | ✅ Completo |
| 2 | Competition | Timer, Job System, Game Loop, Input, Debug Tools | Pending |
| 3 | RHI & 2D | RHI (SDL_GPU), Batch Renderer, Camera 2D, Asset Manager | Pending |
| 4 | ECS & Sistemas | ECS Archetype, Scene, Events, Physics, Animation, Audio, UI | Pending |
| 5 | 3D Transition | Quaternions, Mesh Loading, Camera 3D, Spatial Partitioning | 📅 Futuro |
| 6 | Caffeine Studio | Embedded UI (ImGui), Scene Editor, Asset Pipeline, Scripting | Pending |

### Phase 0 — Setup & Documentation
- GitHub Repository, branch structure, CI (GitHub Actions)
- Build system CMake with tests
- Documentation: MASTER.md, ROADMAP.md, SPECS.md, architecture specs. md
- Style guide and code conventions

### Phase 1 — Atomic Foundation
- Tipos de largura fixa ( `u8..u64` , `f32` , `f64` , `usize` )
- Custom allocators (Linear, Pool, Stack) com interface `IAllocator`
- Containers (Vector, HashMap, StringView, FixedString)
- Math library (Vec2, Vec3, Vec4, Mat4)
- Tests: `test_core.cpp` (8), `test_allocators.cpp` (16+3), `test_containers.cpp` (14+1), `test_math.cpp` (18)

### Phase 2 — Competition * (planned)*
- High-Resolution Timer with microsecond precision
- Job System with work-stealing, lock-free queue, 3 priority levels
- Fiber-based jobs (jobs podem suspender sem bloquear OS thread)
- Game Loop with fixed timestep (60 updates/s) + interpolation
- Input System with remapable action mapping
- Debug Tools: LogSystem, Profiler, DebugDraw

### Phase 3 — RHI & 2D *(planned)*
- RHI: SDL GPU abstraction with triple buffering
- Batch Renderer: 50K sprites em 1 draw call
- Texture Atlas com bin-packing
- Camera 2D com follow e shake
- Asset Manager com async loading e hot-reload
- Formato `.caf` (Caffeine Asset Format) — zero-parsing, zero-copy

### Phase 4 — ECS & Systems * (planned)*
- ECS Archetype-based com cache locality
- Deferred Command Buffer (create/destroy secure during iteration)
- Scene Manager with parent/child hierarchy and serialization `.caf`
- Event Bus pub/sub com `Event<T>` tipado
- Physics 2D (AABB/circle collision, rigid body)
- Animation 2D (sprite clips, state machine)
- Audio System (SDL_AudioStream, spatial 2D)
- UI System retained mode (widgets ECS, bindValue)
- Scripting bindings iniciais (Lua/AngelScript)

### Phase 5 — 3D Transition*(future away)*
- Quaternion + SLERP for 3D rotations
- Mesh loading (.obj, .gltf) via Asset Manager
- Shader system (HLSL/GLSL)
- Octree para spatial partitioning + frustum culling
- Camera 3D (perspectiva, lookAt, FPS e orbital)
- Skeletal Animation (bones, skinning, blend trees)

### Phase 6 — Caffeine Studio IDE* (planned)*
- Dear ImGui integrado ao SDL3
- Scene Editor com drag-and-drop, inspector, hierarchy
- Transform gizmos (Translate/Rotate/Scale)
- Asset Pipeline CLI (PNG/WAV/OBJ → `.caf` )
- Scripting (Lua/AngelScript, hot-reload)

---

## Conventions and Development Standards

Extracted from `SPECS.md` — rules guiding development:

### Principles
- **DOD** — Data-Oriented Design: organized data for cache location
- **YAGNI** — You Ain't Gonna Need It: not implementing what isn't necessary
- ** KISS** — Keep It Simple, Stupid: simplicity above all
- **Lock-free** where possible, mutex where needed
- **Zero-dependency**: reduce to maximum std dependency, create own stdlib

### Code Conventions
- C++20, namespaces aninhados ( `Caffeine::Module` )
- Nomenclature: PascalCase for types, camelCase for methods/members
- Headers with Doxygen documentation
- Sem `new` / `delete` Loose — Use Custom Allocators
- No RTTI, no exceptions, no virtual on hot paths

### Fluxo de Trabalho (R.I.C.O.)
1. **Research** — Search patterns and references
2. **Idea** — Propose solution
3. **Conflict** — Debate trade-offs
4. ** Order** — Implement and document

---

## Previous Plans and Revisions

Detailed planning documents and reviews were maintained during development. They are available in git history.

---

> i This document replaces the old ones `ROADMAP.md` , `SPECS.md` , templates and phase readmes.
> For up-to-date technical documentation, see functional directories on [`docs/`](README.md).
