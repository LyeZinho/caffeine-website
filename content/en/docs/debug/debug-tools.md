# 🔍 Debug Tools

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Debug</code></span>
  <span><strong>Files:</strong> <code>src/caffeine/debug/LogSystem.hpp</code>, <code>Profiler.hpp</code>, <code>CrashHandler.hpp</code>, <code>SystemMetrics.hpp</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">The logging, profiling, crash-report and system-metrics
facilities available to the runtime and editor, plus the debug-draw module that
is still only a design.</p>

---

## Overview

`Caffeine::Debug` is a set of independent, always-compiled utilities. Nothing
here requires ImGui or another frontend; editor windows are built on top of
these APIs by the frontend.

| Module | Purpose | Status |
|--------|-----------|--------|
| **LogSystem** | Categorised logging by severity and category, with sinks | ✅ Implemented |
| **Profiler** | Nested named scopes with inclusive/self timings | ✅ Implemented |
| **CrashHandler** | Signal handlers with a backtrace and crash log | ✅ Implemented |
| **SystemMetrics** | Process CPU/RAM and optional GPU utilisation | ✅ Implemented |
| **DebugDraw** | Geometric debug primitives in the world | 📅 Planned — no header or implementation |

---

## API

### LogSystem

```cpp
namespace Caffeine::Debug {

enum class LogLevel : u8 {
    Trace = 0,   // very detailed (macro compiled out in release)
    Info,        // normal operation
    Warn,        // abnormal but recoverable
    Error,       // functionality affected
    Fatal        // unrecoverable — process termination
};

class LogSystem {
public:
    static LogSystem& instance();

    void log(LogLevel level, const char* category, const char* fmt, ...);
    void vlog(LogLevel level, const char* category, const char* fmt, va_list args);

    void setLevel(LogLevel minLevel);
    LogLevel getLevel() const;

    void setCategoryEnabled(const char* category, bool enabled);
    bool isCategoryEnabled(const char* category) const;

    using SinkFn = std::function<void(LogLevel, const char*, const char*)>;
    void addSink(SinkFn sink);
    void clearSinks();
    usize sinkCount() const;

    static const char* levelToString(LogLevel level);
};

}  // namespace Caffeine::Debug

// Macros:
#ifdef CF_DEBUG
#define CF_TRACE(cat, ...) Caffeine::Debug::LogSystem::instance().log(Caffeine::Debug::LogLevel::Trace, cat, __VA_ARGS__)
#else
#define CF_TRACE(cat, ...) ((void)0)
#endif
#define CF_INFO(cat, ...)  Caffeine::Debug::LogSystem::instance().log(Caffeine::Debug::LogLevel::Info,  cat, __VA_ARGS__)
#define CF_WARN(cat, ...)  Caffeine::Debug::LogSystem::instance().log(Caffeine::Debug::LogLevel::Warn,  cat, __VA_ARGS__)
#define CF_ERROR(cat, ...) Caffeine::Debug::LogSystem::instance().log(Caffeine::Debug::LogLevel::Error, cat, __VA_ARGS__)
#define CF_FATAL(cat, ...) Caffeine::Debug::LogSystem::instance().log(Caffeine::Debug::LogLevel::Fatal, cat, __VA_ARGS__)
```

Limits are compile-time constants: 64 categories, 16 sinks and a 2048-character
formatted message. The log call is protected by a mutex, so worker threads may
log concurrently.

### Profiler

```cpp
namespace Caffeine::Debug {

class Profiler {
public:
    static Profiler& instance();

    void beginScope(const char* name);
    void endScope(const char* name);

    static constexpr u32 kInvalidNode = static_cast<u32>(-1);

    struct ScopeStats {
        const char* name = nullptr;
        u32 nodeIndex = kInvalidNode;
        u32 parentIndex = kInvalidNode;
        u32 firstChildIndex = kInvalidNode;
        u32 nextSiblingIndex = kInvalidNode;
        u32 depth = 0;
        u64 callCount = 0;
        f64 totalMs = 0.0;     // inclusive (scope + children)
        f64 selfMs = 0.0;      // exclusive (scope only)
        f64 avgMs = 0.0;
        f64 avgSelfMs = 0.0;
        f64 minMs = 0.0;
        f64 maxMs = 0.0;
    };

    // Fills out[0..nodeCount()-1]; index 0 is the virtual root (no samples).
    void report(Vector<ScopeStats>& out) const;

    void reset();
    void setEnabled(bool enabled);
    bool isEnabled() const;
    usize scopeCount() const;
};

class ProfileScope {
public:
    explicit ProfileScope(const char* name);
    ~ProfileScope();
};

}  // namespace Caffeine::Debug

#define CF_PROFILE_SCOPE(name) \
    Caffeine::Debug::ProfileScope _cfProfileScope_##__LINE__(name)
```

`Profiler::report()` clears and resizes the vector for you. Scope nodes form a
tree: `parentIndex` / `firstChildIndex` / `nextSiblingIndex` let a tool render a
timeline, while `totalMs` includes children and `selfMs` excludes them.

### CrashHandler

```cpp
namespace Caffeine::Debug {

// Installs SIGSEGV/SIGABRT/SIGILL/SIGFPE handlers that dump a backtrace
// to stderr and ~/.config/caffeine/crash.log.
void installCrashHandler();

// Records a short breadcrumb for the next crash dump.
void setCrashBreadcrumb(const char* text);

}  // namespace Caffeine::Debug
```

### SystemMetrics

```cpp
namespace Caffeine::Debug {

struct SystemMetrics {
    f32 processCpuPercent = 0.0f;  // % of one core (can exceed 100)
    f32 gpuBusyPercent = -1.0f;    // -1 if unavailable
    f32 ramUsedMiB = 0.0f;
    f32 ramTotalMiB = -1.0f;
    f32 vramUsedMiB = -1.0f;
    f32 vramTotalMiB = -1.0f;
    bool gpuAvailable = false;
};

SystemMetrics sampleSystemMetrics();

}  // namespace Caffeine::Debug
```

GPU values depend on a backend (NVML / sysfs); check `gpuAvailable` and the
`-1` sentinels instead of assuming every field is populated.

---

## Planned: DebugDraw

There is **no `DebugDraw` header or implementation** in `src/caffeine/debug`.
The former API sketch (lines, boxes, circles, text, arrows with a per-primitive
lifetime, rendered through an RHI command buffer) remains design intent. Do not
call it from engine or game code yet.

When it lands, the intended split is: the core accumulates primitives and a
renderer backend consumes them; the core does not own an RHI command buffer.

---

## Usage Examples

```cpp
// ── Logging ───────────────────────────────────────────────────
CF_INFO("AssetManager", "Loaded texture: %s (%.1f KB)", path, sizeKB);
CF_WARN("Physics", "Detected %d overlapping bodies — potential tunneling", count);
CF_ERROR("JobSystem", "Worker thread %d crashed: %s", workerId, err);

// Silence a noisy subsystem:
Caffeine::Debug::LogSystem::instance().setCategoryEnabled("Physics", false);

// Forward every message to an editor console:
Caffeine::Debug::LogSystem::instance().addSink(
    [](Caffeine::Debug::LogLevel level, const char* category, const char* message) {
        editorConsole.append(level, category, message);
    });

// ── Profiler ──────────────────────────────────────────────────
{
    CF_PROFILE_SCOPE("ECS::PhysicsSystem");
    physicsSystem.update(world, dt);
}

// Or manually:
Caffeine::Debug::Profiler::instance().beginScope("BatchRenderer::flush");
batchRenderer.flushCurrentBatch(cmd);
Caffeine::Debug::Profiler::instance().endScope("BatchRenderer::flush");

// Report at end of frame:
Caffeine::Vector<Caffeine::Debug::Profiler::ScopeStats> stats;
Caffeine::Debug::Profiler::instance().report(stats);
for (const auto& s : stats) {
    CF_INFO("Perf", "%-30s  avg=%.2fms  self=%.2fms  calls=%llu",
            s.name, s.avgMs, s.avgSelfMs,
            static_cast<unsigned long long>(s.callCount));
}

// ── Crash reporting and metrics ───────────────────────────────
Caffeine::Debug::installCrashHandler();
Caffeine::Debug::setCrashBreadcrumb("loading level 3");

Caffeine::Debug::SystemMetrics metrics = Caffeine::Debug::sampleSystemMetrics();
if (metrics.gpuAvailable) {
    CF_INFO("Perf", "GPU busy: %.1f%%", metrics.gpuBusyPercent);
}
```

---

## Build Settings

| Feature | Debug build | Release build |
|---------|-------------|---------------|
| `CF_DEBUG` | Defined when `CMAKE_BUILD_TYPE=Debug` | Not defined |
| `CF_TRACE` | Active | Compiles to `((void)0)` |
| `CF_INFO` / `CF_WARN` / `CF_ERROR` / `CF_FATAL` | Active | Active |
| `LogSystem` runtime level/category filtering | Active | Active |
| `Profiler` | Active | Compiled; enable/disable at runtime with `setEnabled()` |
| `CrashHandler` | Available | Available; call `installCrashHandler()` explicitly |
| `SystemMetrics` | Available | Available; GPU fields depend on the backend |
| `DebugDraw` | Not implemented | Not implemented |

---

## Design Decisions

| Decision | Rationale |
|---------|-------------|
| Log categories | Silence noisy subsystems without losing the rest |
| Sink callback | Frontends can implement a console without the core knowing about UI |
| Profiler tree with self time | Distinguishes a slow child from a slow parent |
| Runtime profiler enable flag | No instrumentation cost when disabled |
| Crash handler opt-in | The host decides whether to install signal handlers |
| Singletons for debug services | Debug is cross-cutting infrastructure; global access is acceptable here |

---

## Tests

`tests/test_debug.cpp` covers:
- Log level ordering and `levelToString()`
- Level filtering and per-category enable/disable
- Sinks, multiple sinks and `sinkCount()`
- Formatted messages with multiple arguments
- Concurrent logging from several threads
- Profiler call accumulation, min/max, independent named scopes
- Nested scopes and self time
- Disabled profiler recording nothing
- `reset()` and `scopeCount()`
- `ProfileScope` RAII

---

## Dependencies

- **Upstream:** `Caffeine::Core::Types`, `Caffeine::Core::Timer`,
  `Caffeine::Vector`, standard `<mutex>`, `<cstdarg>`, `<functional>`
- **Downstream:** runtime and editor consoles, profiler windows and crash
  reporting in the frontend

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Editor & Debug]() | Debug tools as the basis of the editor |
| [Concurrency & Runtime]() | The Profiler monitors frame work |

## References

- [`src/caffeine/debug/`](https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/debug)
- [`tests/test_debug.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_debug.cpp)
- [`docs/architecture_specs.md`](../architecture_specs.md) — §16 Debug/Development Tools
- [`core/timer.md`](../core/timer.md) — `Core::Timer` used by the Profiler
- [Transversal Topic Index]()
