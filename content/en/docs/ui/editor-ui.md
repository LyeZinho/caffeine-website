# 🖥️ Embedded UI — Dear ImGui

> **Phase:**6 — The Olympus
> **Namespace:** `Caffeine::Editor` 
> **Status: ** Implemented
> **RFs:** RF6.1, RF6.2, RF6.6

---

## Overview

Integration of **Dear ImGui** to the Caffeine Studio IDE interface. ImGui is an immediate mode UI library (immediate mode) — each frame redesigns all widgets. Ideal for development tools.

**Destination of Phase 4:**
- [UI System](../ui/game-ui.md) — UI **retained** for games (HUD, menus, HealthBar)
- **Embedded ImGui** — UI **immediate** for development tools (editor, profiler, console)

---

## API Implementada

```cpp
namespace Caffeine::Editor {

// ============================================================================
// @brief  FrameStats — metrics de frame para StatsOverlay.
// ============================================================================
struct FrameStats {
    f64 deltaTime   = 0.0;
    f64 fps         = 0.0;
    u64 frameCount  = 0;
    f64 elapsedTime = 0.0;
};

// ============================================================================
// @brief  Integração ImGui com SDL3 + RHI da Caffeine.
//         Disponível apenas quando CF_HAS_SDL3 e CF_HAS_IMGUI estão definidos.
// ============================================================================
class ImGuiIntegration {
public:
    bool init(SDL_Window* window, RHI::RenderDevice* device);
    void shutdown();

    void beginFrame();
    void endFrame(RHI::CommandBuffer* cmd);

    bool processEvent(const SDL_Event& event);

    bool wantsKeyboard() const;
    bool wantsMouse()    const;
};

// ============================================================================
// @brief  Janela de profiler — visualiza dados do Profiler da Fase 2.
//         Renderização ImGui disponível via CF_HAS_IMGUI.
// ============================================================================
class ProfilerWindow {
public:
    void pushFrameTime(f32 ms);
    void pause();
    void resume();
    bool isPaused() const;
    bool isOpen()   const;
    void close();
    void open();

    f32 lastFrameTime() const;
    const std::array<f32, 120>& frameTimes() const;
    u32 frameIndex() const;

#ifdef CF_HAS_IMGUI
    void render(const Debug::Profiler& profiler);
#endif
};

// ============================================================================
// @brief  Console window — exibe logs e aceita comandos.
//         Renderização ImGui disponível via CF_HAS_IMGUI.
// ============================================================================
class ConsoleWindow {
public:
    void addLog(Debug::LogLevel level, const char* category,
                const char* message);
    void clear();

    usize entryCount() const;
    const LogEntry& entry(usize i) const;

    bool isOpen()     const;
    bool autoScroll() const;
    void setAutoScroll(bool v);
    void close();
    void open();

    Debug::LogLevel filterLevel() const;
    void setFilterLevel(Debug::LogLevel lvl);

#ifdef CF_HAS_IMGUI
    void render();
#endif

    struct LogEntry {
        Debug::LogLevel level;
        FixedString<32>  category;
        FixedString<256> message;
    };
};

// ============================================================================
// @brief  Stats overlay — frame time, FPS, cache stats.
//         Renderização ImGui disponível via CF_HAS_IMGUI.
// ============================================================================
class StatsOverlay {
public:
    bool isOpen()  const;
    void close();
    void open();

#ifdef CF_HAS_IMGUI
    void render(const FrameStats& stats,
                const Assets::CacheStats& cache);
#endif
};

}  // namespace Caffeine::Editor
```

---

## Janelas do Editor

### ProfilerWindow
- `┌──────────────────────────────────────────┐`
    - `🔬 Profiler [Pause] [X] │`
  - `┤`
    - `Frame: 16.7ms | FPS: 60 │`
    - `████████████████████████ (frame graph) │`
    - `Scope avg max │`
    - `ECS::PhysicsSystem 2.1ms 4.3ms │`
    - `BatchRenderer::flush 0.8ms 1.2ms │`
    - `AnimationSystem 0.3ms 0.6ms │`
    - `AudioSystem::update 0.1ms 0.2ms │`
  - `┘`


### ConsoleWindow
- `┌──────────────────────────────────────────┐`
    - `💬 Console [X] │`
  - `┤`
    - `Filter: [All ▾] [✓ Auto-scroll] │`
  - `┤`
    - `[INFO] AssetManager Loaded hero.caf │`
    - `[WARN] Physics Overlap detected │`
    - `[INFO] Audio Playing bgm.caf │`
    - `[INFO] ECS Created 50 entit. │`
  - `┤`
    - `> _ │`
  - `┘`


---

## Integration in Game Loop

```cpp
// ── Init ──────────────────────────────────────────────────────
#if CF_EDITOR_MODE
Caffeine::Editor::ImGuiIntegration imgui;
imgui.init(window, &device);

Caffeine::Editor::ProfilerWindow profilerWindow;
Caffeine::Editor::ConsoleWindow consoleWindow;

// Hook no LogSystem para exibir no console:
Debug::LogSystem::instance().addSink([&](LogLevel lvl, const char* cat,
                                         const char* msg) {
    consoleWindow.addLog(lvl, cat, msg);
});
#endif

// ── Por frame ─────────────────────────────────────────────────
#if CF_EDITOR_MODE
imgui.beginFrame();

profilerWindow.render(Debug::Profiler::instance());
consoleWindow.render();
sceneEditor.render(world, camera);   // Fase 6.3

imgui.endFrame(cmd);
#endif
```

---

## Hot-Reload Runtime (RF6.6)

- `FileWatcher (já no AssetManager::pollFileChanges())`
- `▼`
- `Arquivo modificado em disco`
  - `textura (.png) → re-encode → upload GPU → todos os handles atualizados`
  - `shader (.hlsl/.glsl) → recompile → novo Pipeline → substituído`
  - `script (.lua) → reload VM → funções atualizadas`


---

## Acceptance Criteria

- [x] Dear ImGui integrado com SDL3 sem conflitos de input
- [x] ProfilerWindow mostra dados do Profiler real-time
- [x] ConsoleWindow filters by level and category
- [ ] Hot-reload: textura atualizada sem restart do jogo
- [x] ImGui does not interfere with game input when not focused

---

## Dependencies

- **Upstream:** [Debug Tools](../debug/debug-tools.md), [RHI](../rendering/rhi.md), [Asset Manager](../assets/asset-manager.md)
- **Downstream:** [Scene Editor](scene-editor.md)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Editor & Debug]() | Embedded UI como base do Editor |
| [Sistemas de Jogo]() | UI do jogo (F4) vs UI do editor (F6) |

## References

- [Dear ImGui](https://github.com/ocornut/imgui) — biblioteca UI
- [Dear ImGui SDL3 example](https://github.com/ocornut/imgui/blob/master/examples/example_sdl3_opengl3/main.cpp)
- [`docs/fase2/debug.md`](../debug/debug-tools.md) — Profiler + LogSystem
- [`docs/fase4/ui.md`](./ui/game-ui.md) — game UI System (remained mode)
- [Transversal Topic Index]()
