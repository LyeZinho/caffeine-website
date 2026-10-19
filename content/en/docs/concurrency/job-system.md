# 🔗 Job System

> **Phase:** 2 — Pulse and Competition
> **Namespace:** `Caffeine::Threading` 
> **File:** `src/threading/JobSystem.hpp` 
> ** Status:** 
> **RFs:** RF2.2, RF2.3, RF2.4, RF2.5, RF2.6

---

## Overview

The Job System distributes heavy work (physics, AI, animation, asset loading) between CPU cores. Each Job** is a lightweight work unit performed by a **worker thread**.

* * Approach:**Thread pool with **work-stealing**—each worker has his own queue; when empty, "steal" jobs from busy workers. This ensures automatic load balancing without central coordination.

** Phase 2: improvements**
- ** Priority Queue** with 3 levels: Critical / Normal / Background
- **Fiber-based** — Jobs can suspend without blocking OS thread

---

## API Planejada

```cpp
namespace Caffeine::Threading {

// ============================================================================
// @brief  Prioridade de um Job.
// ============================================================================
enum class JobPriority : u8 {
    Critical   = 0,  // 🔴 Renderização, Física — nunca esperam
    Normal     = 1,  // 🟡 Gameplay, animação, eventos
    Background = 2   // ⚪ Asset loading, streaming, compressão
};

// ============================================================================
// @brief  Interface base para todos os Jobs.
//
//  Jobs devem ser cheap to copy — dados passados por valor ou shared_ptr.
//  Nunca alocar no heap dentro de um Job.
// ============================================================================
struct IJob {
    virtual ~IJob() = default;
    virtual void execute() = 0;
    virtual JobPriority priority() const { return JobPriority::Normal; }
};

// ============================================================================
// @brief  Job com dados armazenados internamente (type-safe, zero alloc).
// ============================================================================
template<typename DataT>
struct JobWithData : IJob {
    DataT                       data;
    std::function<void(DataT&)> func;
    JobPriority                 prio = JobPriority::Normal;

    void execute() override { func(data); }
    JobPriority priority() const override { return prio; }
};

// ============================================================================
// @brief  Handle para rastrear e sincronizar um Job.
//
//  Uso: index + version evita ABA problem sem lock.
// ============================================================================
class JobHandle {
public:
    JobHandle() = default;
    explicit JobHandle(u32 index, u32 version);

    void wait() const;         // Bloqueia até o Job completar
    bool isComplete() const;   // Non-blocking check
    explicit operator bool() const { return isComplete(); }

private:
    u32 m_index   = u32_max;
    u32 m_version = u32_max;
};

// ============================================================================
// @brief  Barreira de sincronização — wait() bloqueia até N jobs terminarem.
//
//  Uso:
//      JobBarrier barrier(chunkCount);
//      for (auto& chunk : chunks) {
//          jobSystem.schedule(makeJob(chunk), &barrier);
//      }
//      barrier.wait();  // todos prontos
// ============================================================================
class JobBarrier {
public:
    explicit JobBarrier(u32 targetCount = 0);

    void add();      // incrementa contador pendente
    void release();  // decrementa (chamado pelo sistema quando Job completa)
    void wait();     // bloqueia até count == 0

private:
    std::atomic<u32>        m_count;
    std::atomic<u32>        m_generation;
    std::condition_variable m_cv;
    std::mutex              m_mutex;
};

// ============================================================================
// @brief  Sistema de Jobs principal.
//
//  Arquitetura:
//  - workerCount = hardware_concurrency() - 1 (main thread não compete)
//  - Cada worker tem deque local (work-stealing da ponta oposta)
//  - Fila global MPMC para overflow e jobs sem afinidade
//  - Priority queue garante Critical > Normal > Background
// ============================================================================
class JobSystem {
public:
    explicit JobSystem(u32 workerCount = 0);  // 0 = auto (n-1 cores)
    ~JobSystem();

    // Agenda um job com prioridade opcional
    JobHandle schedule(std::unique_ptr<IJob> job,
                       JobBarrier*           barrier = nullptr,
                       JobPriority           prio    = JobPriority::Normal);

    // Açúcar: cria JobWithData<T> automaticamente
    template<typename DataT, typename FuncT>
    JobHandle scheduleData(DataT       data,
                           FuncT&&     func,
                           JobBarrier* barrier = nullptr,
                           JobPriority prio    = JobPriority::Normal) {
        auto* job       = new JobWithData<DataT>{ std::move(data),
                                                   std::forward<FuncT>(func), prio };
        return schedule(std::unique_ptr<IJob>(job), barrier, prio);
    }

    // Parallel-for sobre [0, count) dividido em chunks por worker
    template<typename FuncT>
    JobHandle scheduleParallelFor(u32         count,
                                  FuncT&&     func,
                                  JobBarrier* barrier = nullptr,
                                  JobPriority prio    = JobPriority::Normal);

    void waitAll();                           // Bloqueia até fila vazia
    u32  workerCount() const { return m_workerCount; }

    struct Stats {
        u32 activeWorkers;
        u32 pendingJobs;
        u64 completedJobsTotal;
        f64 avgJobMs;
    };
    Stats stats() const;

private:
    struct WorkerThread; // implementação interna

    u32                         m_workerCount;
    std::vector<WorkerThread>   m_workers;
    // priority queues por nível
    JobQueue                    m_queues[3];  // Critical, Normal, Background
};

}  // namespace Caffeine::Threading
```

---

## Exemplos de Uso

```cpp
// ── Física distribuída em chunks ──────────────────────────────
Caffeine::Threading::JobSystem jobs;
Caffeine::Threading::JobBarrier barrier(particleCount / CHUNK_SIZE);

for (u32 i = 0; i < particleCount; i += CHUNK_SIZE) {
    jobs.scheduleData(
        ChunkJob{i, CHUNK_SIZE, dt},
        [&particles](const ChunkJob& j) {
            for (u32 k = j.start; k < j.start + j.count; ++k)
                particles[k].integrate(j.dt);
        },
        &barrier,
        Caffeine::Threading::JobPriority::Critical
    );
}
barrier.wait();  // todos os chunks prontos antes de render

// ── Parallel-for simplificado ─────────────────────────────────
jobs.scheduleParallelFor(entityCount,
    [&](u32 i) { animators[i].advance(dt); },
    nullptr,
    Caffeine::Threading::JobPriority::Normal
);

// ── Asset loading em background ───────────────────────────────
auto handle = jobs.scheduleData(
    AssetLoadJob{"textures/hero.caf"},
    [](const AssetLoadJob& j) { loadAsset(j.path); },
    nullptr,
    Caffeine::Threading::JobPriority::Background
);

// Main thread continua sem bloquear; verifica quando precisar:
if (handle.isComplete()) { /* use asset */ }
```

---

## Arquitetura Interna

- `JobSystem`
  - `Worker[0] ──┐`
  - `Worker[1] ──┤ work-stealing deque por worker`
  - `Worker[2] ──┤`
  - `Worker[n] ──┘`
- `▼`
- `Priority Queues`
- `[Critical] ← Physics, Render`
- `[Normal] ← Gameplay, Animation`
- `[Background] ← Asset load, streaming`
- `▼`
- `JobHandle (index + version) → sem ABA problem`


**Work-Stealing:**
Each worker takes jobs from the top end of his own deck. When empty, he steals from the bottom end of another worker — minimizing contention.

---

## ECS Integration (Phase 4)

```cpp
// ComponentQuery suporta forEachParallel nativo:
ComponentQuery physicsQuery;
physicsQuery.with<RigidBody2D, Collider2D, Position2D>();

physicsQuery.forEachParallel(world, [](RigidBody2D& rb, Collider2D& col,
                                       Position2D& pos) {
    // roda em parallel-for via Job System
    integrateRigidBody(rb, pos);
}, &barrier);
```

---

## Design Decisions

| Decision | Justificativa |
|---------|-------------|
| `workerCount = n-1` | Main thread does not compete with CPU workers |
| Work-stealing deque | Best throughput vs queue centered on heterogeneous workloads |
| `index + version` no Handle | Evita ABA problem sem mutex |
| 3 priority levels | Rendering/Physic never wait for asset load |
| Fiber-based (RF2.6) | Jobs pesados podem suspender sem bloquear OS thread |

---

## Acceptance Criteria

- [ ] 10K Jobs em <10ms em hardware de 8 cores
- [ ] `parallelFor(1M, func)` < 50ms em 8 cores
- [ ] `tsan` (ThreadSanitizer) clean — zero data races
- [ ] Workers at ≥ 80% load in 10K particle stress test
- [ ] `background` jobs nunca atrasam `critical` jobs

---

## Dependencies

- **Upstream:** `Caffeine::Core::Types` , `Caffeine::Containers::HashMap`
- **Downstream:** [Asset Manager](../assets/asset-manager.md), [ECS — forEachParallel](../ecs/core.md), [Physics 2D](../physics/physics-2d.md), [Animation](.../animation/animation-2d.md)

---

---

## Implementation Plan (3 Phases)

> **Tech Stack:** C++20, std::thread, std::atomic, lock-free algorithms
> **Goal:**Implement a competitive engine that transforms heavy processing into Jobs distributed among all CPU nucleos.

### System Overview

#### Filosofia de Design

| Principio | Implementacao |
|----------|---------------|
| **Data-Oriented Design (DOD)** | Jobs em arrays continuos, cache-line aligned (64 bytes) |
| **Lock-Free Progress** | std::atomic in critical paths, mutex only in fallback |
| **Work-Stealing** | Workers ociosos roubam trabalho de workers sobrecarregados |
| **Wait & Stall** | Main Thread ajuda a processar enquanto espera |

#### Requisitos Funcionais (RFs)

| ID | Requisito | Descricao Tecnica |
|----|----------|----------------|
| **RF1** | Thread Pool | N-1 threads workers (N = nucleos logicos) |
| **RF2** | Task Batching | Agrupar tarefas pequenas em lotes |
| **RF3** | Job Handles | Sincronizacao atomic para grupos de jobs |
| **RF4** | Wait & Stall | Main Thread processa enquanto espera |
| **RF5** | Priority Levels | 3 niveis: Critico, Normal, Background |

### Estrutura de Dados

#### Job (64 bytes - fit cache line)

```cpp
namespace Caffeine {

using JobFunc = void (*)(void*);

// @brief Estrutura de trabalho atomica (64 bytes para caber em cache line)
// @note data e um ponteiro para contexto alocado pelo caller
struct Job {
    JobFunc function;     // O que executar
    void* data;           // Dados (contexto)
    JobHandle* handle;    // Handle para sincronizacao (opcional)
    // @todo: padding para 64 bytes
};
static_assert(sizeof(Job) <= 64, "Job must fit in cache line");

} // namespace Caffeine
```

#### JobHandle (sincronizacao)

```cpp
namespace Caffeine {

// @brief Handle para sincronizacao de grupo de jobs
// @note usa contador atomico para tracking sem mutex
struct JobHandle {
    std::atomic<int32_t> unfinishedJobs;  // atomic counter
    
    // @brief Construtor - inicializa com N jobs pendentes
    explicit JobHandle(int32_t initialCount) 
        : unfinishedJobs(initialCount) {}
    
    // @brief Decrementa contador
    // @return true se chegou a zero
    bool complete() {
        return (unfinishedJobs.fetch_sub(1, std::memory_order_release) - 1) == 0;
    }
    
    // @brief Espera ate todos os jobs completarem
    void wait() {
        while (unfinishedJobs.load(std::memory_order_acquire) > 0) {
            // @todo: yield CPU
        }
    }
};

} // namespace Caffeine
```

#### Priority Levels

```cpp
namespace Caffeine {

// @brief Niveis de prioridade de job
enum class JobPriority : u8 {
    Critical = 0,   // Fisica/Input - nunca esperam
    Normal = 1,      // Gameplay, animation
    Background = 2   // Asset loading
};

} // namespace Caffeine
```

### Fases de Implementacao

#### Phase Alpha: Thread Pool with Mutex

**Objetivo:** Implementar thread pool basico funcional para debug e validacao.

**Criterio:** 1.000 tarefas simples completes com sucesso.

| Marco | Tarefas | Tempo |
|-------|---------|-------|
| Alpha-1 | Cria pastas e headers | 5 min |
| Alpha-2 | Implementa Job e JobHandle | 10 min |
| Alpha-3 | Implementa Worker com thread | 15 min |
| Alpha-4 | Implementa JobScheduler basico | 15 min |
| Alpha-5 | Write tests | 10 min |
| Alpha-6 | Stress test 1k tarefas | 5 min |
| **Total** | | **60 min** |

**Files:**
- `src/threading/JobPriority.hpp` — Enum and comparators
- `src/threading/Job.hpp` — structure Job (64 bytes)
- `src/threading/JobHandle.hpp` — JobHandle atomic
- `src/threading/JobQueue.hpp` — std::queue + mutex
- `src/threading/Worker.hpp` — basic thread loop
- `src/threading/JobSystem.hpp` — Initial JobScheduler
- `tests/test_threading.cpp` — Job System tests

**TDD Workflow:**

1. **Alpha-1:** Estrutura de pastas, headers vazios
2. **Alpha-2:** Job struct (64 bytes), JobHandle com atomic counter
   - Test: `JobHandle initializes with correct count`
   - Test: `JobHandle decrements on complete`
   - Test: `Job is 64 bytes or less`
3. **Alpha-3:** Worker basico
   - Test: `Worker thread can be created`
4. **Alpha-4:** JobScheduler com fila protegida por mutex
   - Test: `JobScheduler creates workers`
   - Test: `JobScheduler can schedule job`
5. **Alpha-5 & 6:** Stress tests
   - Test: `Alpha stress: 1000 jobs complete`
   - Expected: < 100ms para 1k jobs

#### Beta Phase: Work-Stealing

**Objetivo:** Substituir fila unica por filas por thread e implementar steal().

**Criterio:**10.000 tasks with active work-stealing, CPU uses > 80%.

| Marco | Tarefas | Tempo |
|-------|---------|-------|
| Beta-1 | Implementar WorkerLocal deque | 15 min |
| Beta-2 | Implementar steal() algorithm | 15 min |
| Beta-3 | Integrar com JobScheduler | 15 min |
| Beta-4 | Stress test 10k tarefas | 10 min |
| **Total** | | **55 min** |

**Arquivos novos:**
- `src/threading/WorkerLocal.hpp` — LIFO deck per worker

**WorkerLocal (LIFO deque):**

```cpp
class WorkerLocal {
public:
    // @brief Adiciona job na frente (LIFO)
    void push(Job&& job) {
        queue_.push_front(std::move(job));
    }
    
    // @brief Remove job da frente (LIFO)
    bool pop(Job* out) {
        if (queue_.empty()) return false;
        *out = std::move(queue_.front());
        queue_.pop_front();
        return true;
    }
    
    // @brief Tenta roubar da cauda (FIFO - para steal)
    bool steal(Job* out) {
        if (queue_.empty()) return false;
        *out = std::move(queue_.back());
        queue_.pop_back();
        return true;
    }
    
    bool empty() const { return queue_.empty(); }
private:
    std::deque<Job> queue_;
};
```

**Stress test:**
```cpp
TEST_CASE("Beta stress: 10000 jobs with work stealing", "[threading][stress]") {
    Caffeine::JobScheduler scheduler;
    std::atomic<int32_t> counter{0};
    
    auto handle = scheduler.schedule(10000, [](void* data) {
        auto* c = static_cast<std::atomic<int32_t>*>(data);
        c->fetch_add(1);
    }, &counter);
    
    scheduler.wait(handle);
    CHECK(counter.load() == 10000);
}
```

#### Gold Phase: Lock-Free

**Objetivo:** Trocar mutexes por operacoes atomicas de baixo nivel.

**Criterio:** 50.000 tarefas em lock-free, zero mutex no hot path.

| Marco | Tarefas | Tempo |
|-------|---------|-------|
| Gold-1 | Implementar atomic queue | 20 min |
| Gold-2 | Substituir mutex por atomic | 15 min |
| Gold-3 | Stress test 50k tarefas | 10 min |
| Gold-4 | TSAN/ASAN clean | 10 min |
| **Total** | | **55 min** |

**Stress test final:**
```cpp
TEST_CASE("Gold stress: 50000 jobs complete", "[threading][stress]") {
    Caffeine::JobScheduler scheduler;
    std::atomic<int32_t> counter{0};
    
    auto handle = scheduler.schedule(50000, [](void* data) {
        auto* c = static_cast<std::atomic<int32_t>*>(data);
        c->fetch_add(1);
    }, &counter);
    
    scheduler.wait(handle);
    CHECK(counter.load() == 50000);
}
```

### Criterios de Progresso

| Phase | Teste | Benchmark | Target |
|------|-------|-----------|--------|
| Alpha | 1k tarefas | < 100ms | Correctness |
| Beta | 10k tarefas, work-stealing | < 500ms | Load balancing |
| Gold | 50k tarefas, lock-free | < 2s, TSAN clean | Performance |

### Inclusao no Build

```cmake
# src/CMakeLists.txt
add_subdirectory(threading)
```

```cpp
// src/Caffeine.hpp
#include "threading/JobSystem.hpp"
```

### Resumo da Implementacao

| Phase | Descricao | Files | Stress Test |
|------|----------|---------|-------------|
| **Alpha** | Thread pool + mutex | 7 novos | 1k jobs |
| **Beta** | Work-stealing | 1 novo | 10k jobs |
| **Gold** | Lock-free | 1 novo | 50k jobs |

* * Total estimated time:** ~3 hours

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Competition & Runtime]() | Job System as the backbone of competition |
| [Assets & Pipeline]() | Async loading usa Job System |

## References

- [`docs/architecture_specs.md`](../architecture specs.md) — §2 Job System
- [Jolt Physics Job System] — Design reference
- [Multithreaded Job Systems in Game Engines](https://pulsegeek.com/articles/multithreaded-job-systems-in-game-engines/)
- [Transversal Topic Index]()
