# 🔍 Debug Tools

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Debug</code></span>
  <span><strong>Arquivos:</strong> <code>src/caffeine/debug/LogSystem.hpp</code>, <code>Profiler.hpp</code>, <code>CrashHandler.hpp</code>, <code>SystemMetrics.hpp</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">As ferramentas de logging, profiling, relatório de crashes e
métricas de sistema disponíveis para o runtime e o editor, mais o módulo de
debug draw que ainda é apenas design.</p>

---

## Visão Geral

`Caffeine::Debug` é um conjunto de utilitários independentes, sempre compilados.
Nada aqui exige ImGui ou outro frontend; as janelas do editor são construídas
por cima destas APIs pelo frontend.

| Módulo | Propósito | Estado |
|--------|-----------|--------|
| **LogSystem** | Logging categorizado por severidade e categoria, com sinks | ✅ Implementado |
| **Profiler** | Escopos nomeados aninhados com tempos inclusivos/próprios | ✅ Implementado |
| **CrashHandler** | Handlers de sinal com backtrace e crash log | ✅ Implementado |
| **SystemMetrics** | CPU/RAM do processo e utilização de GPU opcional | ✅ Implementado |
| **DebugDraw** | Primitivas geométricas de debug no mundo | 📅 Planeado — sem header nem implementação |

---

## API

### LogSystem

```cpp
namespace Caffeine::Debug {

enum class LogLevel : u8 {
    Trace = 0,   // muito detalhado (macro compilada fora em release)
    Info,        // operação normal
    Warn,        // anormal mas recuperável
    Error,       // funcionalidade afetada
    Fatal        // irrecuperável — terminação do processo
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

Os limites são constantes de compilação: 64 categorias, 16 sinks e uma
mensagem formatada de 2048 caracteres. A chamada de log é protegida por um
mutex, pelo que várias threads podem registar em simultâneo.

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
        f64 totalMs = 0.0;     // inclusivo (escopo + filhos)
        f64 selfMs = 0.0;      // exclusivo (apenas o escopo)
        f64 avgMs = 0.0;
        f64 avgSelfMs = 0.0;
        f64 minMs = 0.0;
        f64 maxMs = 0.0;
    };

    // Preenche out[0..nodeCount()-1]; o índice 0 é a raiz virtual (sem amostras).
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

`Profiler::report()` limpa e redimensiona o vetor por si. Os nós de escopo
formam uma árvore: `parentIndex` / `firstChildIndex` / `nextSiblingIndex`
permitem a uma ferramenta desenhar uma timeline, enquanto `totalMs` inclui os
filhos e `selfMs` os exclui.

### CrashHandler

```cpp
namespace Caffeine::Debug {

// Instala handlers SIGSEGV/SIGABRT/SIGILL/SIGFPE que escrevem um backtrace
// para stderr e para ~/.config/caffeine/crash.log.
void installCrashHandler();

// Regista uma breadcrumb curta para o próximo crash dump.
void setCrashBreadcrumb(const char* text);

}  // namespace Caffeine::Debug
```

### SystemMetrics

```cpp
namespace Caffeine::Debug {

struct SystemMetrics {
    f32 processCpuPercent = 0.0f;  // % de um núcleo (pode exceder 100)
    f32 gpuBusyPercent = -1.0f;    // -1 se indisponível
    f32 ramUsedMiB = 0.0f;
    f32 ramTotalMiB = -1.0f;
    f32 vramUsedMiB = -1.0f;
    f32 vramTotalMiB = -1.0f;
    bool gpuAvailable = false;
};

SystemMetrics sampleSystemMetrics();

}  // namespace Caffeine::Debug
```

Os valores de GPU dependem de um backend (NVML / sysfs); verifique
`gpuAvailable` e os sentinelas `-1` em vez de assumir que todos os campos estão
preenchidos.

---

## Planeado: DebugDraw

**Não existe** header nem implementação de `DebugDraw` em
`src/caffeine/debug`. O antigo esboço de API (linhas, caixas, círculos, texto e
setas com tempo de vida por primitiva, desenhados através de um command buffer
do RHI) continua a ser intenção de design. Ainda não deve ser chamado por
código da engine ou do jogo.

Quando existir, a divisão pretendida é: o core acumula primitivas e um backend
de renderização consome-as; o core não é dono de um command buffer do RHI.

---

## Exemplos de Uso

```cpp
// ── Logging ───────────────────────────────────────────────────
CF_INFO("AssetManager", "Loaded texture: %s (%.1f KB)", path, sizeKB);
CF_WARN("Physics", "Detected %d overlapping bodies — potential tunneling", count);
CF_ERROR("JobSystem", "Worker thread %d crashed: %s", workerId, err);

// Silenciar um subsistema ruidoso:
Caffeine::Debug::LogSystem::instance().setCategoryEnabled("Physics", false);

// Encaminhar todas as mensagens para uma consola do editor:
Caffeine::Debug::LogSystem::instance().addSink(
    [](Caffeine::Debug::LogLevel level, const char* category, const char* message) {
        editorConsole.append(level, category, message);
    });

// ── Profiler ──────────────────────────────────────────────────
{
    CF_PROFILE_SCOPE("ECS::PhysicsSystem");
    physicsSystem.update(world, dt);
}

// Ou manualmente:
Caffeine::Debug::Profiler::instance().beginScope("BatchRenderer::flush");
batchRenderer.flushCurrentBatch(cmd);
Caffeine::Debug::Profiler::instance().endScope("BatchRenderer::flush");

// Relatório no fim do frame:
Caffeine::Vector<Caffeine::Debug::Profiler::ScopeStats> stats;
Caffeine::Debug::Profiler::instance().report(stats);
for (const auto& s : stats) {
    CF_INFO("Perf", "%-30s  avg=%.2fms  self=%.2fms  calls=%llu",
            s.name, s.avgMs, s.avgSelfMs,
            static_cast<unsigned long long>(s.callCount));
}

// ── Relatório de crashes e métricas ───────────────────────────
Caffeine::Debug::installCrashHandler();
Caffeine::Debug::setCrashBreadcrumb("loading level 3");

Caffeine::Debug::SystemMetrics metrics = Caffeine::Debug::sampleSystemMetrics();
if (metrics.gpuAvailable) {
    CF_INFO("Perf", "GPU busy: %.1f%%", metrics.gpuBusyPercent);
}
```

---

## Configuração por Build

| Funcionalidade | Build de debug | Build de release |
|---------|-------------|---------------|
| `CF_DEBUG` | Definido quando `CMAKE_BUILD_TYPE=Debug` | Não definido |
| `CF_TRACE` | Ativo | Compila para `((void)0)` |
| `CF_INFO` / `CF_WARN` / `CF_ERROR` / `CF_FATAL` | Ativos | Ativos |
| Filtragem de nível/categoria do `LogSystem` | Ativa | Ativa |
| `Profiler` | Ativo | Compilado; ativar/desativar em runtime com `setEnabled()` |
| `CrashHandler` | Disponível | Disponível; chamar `installCrashHandler()` explicitamente |
| `SystemMetrics` | Disponível | Disponível; campos de GPU dependem do backend |
| `DebugDraw` | Não implementado | Não implementado |

---

## Decisões de Design

| Decisão | Justificativa |
|---------|-------------|
| Categorias de log | Silenciar subsistemas ruidosos sem perder os restantes |
| Callback de sink | Frontends podem implementar uma consola sem o core conhecer UI |
| Árvore de profiler com self time | Distingue um filho lento de um pai lento |
| Flag de ativação em runtime | Sem custo de instrumentação quando desativado |
| Crash handler opt-in | O host decide se instala handlers de sinal |
| Singletons para serviços de debug | Debug é infraestrutura transversal; acesso global é aceitável aqui |

---

## Testes

`tests/test_debug.cpp` cobre:
- Ordenação de níveis de log e `levelToString()`
- Filtragem por nível e ativação/desativação por categoria
- Sinks, múltiplos sinks e `sinkCount()`
- Mensagens formatadas com vários argumentos
- Logging concorrente a partir de várias threads
- Acumulação de chamadas do Profiler, min/max e escopos nomeados independentes
- Escopos aninhados e self time
- Profiler desativado não regista nada
- `reset()` e `scopeCount()`
- RAII de `ProfileScope`

---

## Dependências

- **Upstream:** `Caffeine::Core::Types`, `Caffeine::Core::Timer`,
  `Caffeine::Vector`, `<mutex>`, `<cstdarg>` e `<functional>` da biblioteca
  padrão
- **Downstream:** consolas do runtime e do editor, janelas de profiler e
  relatório de crashes no frontend

---

## 🔗 Tópicos Relacionados

| Tópico | Descrição |
|--------|-----------|
| [Editor & Debug]() | Ferramentas de debug como base do editor |
| [Concorrência & Runtime]() | O Profiler monitoriza o trabalho por frame |

## Referências

- [`src/caffeine/debug/`](https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/debug)
- [`tests/test_debug.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_debug.cpp)
- [`docs/architecture_specs.md`](../architecture_specs.md) — §16 Debug/Development Tools
- [`core/timer.md`](../core/timer.md) — `Core::Timer` usado pelo Profiler
- [Índice de Tópicos Transversais]()
