# 🔗 Job System

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Threading</code></span>
  <span><strong>Arquivos:</strong> <code>src/caffeine/threading/JobSystem.hpp</code>, <code>src/caffeine/threading/JobSystem.cpp</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Um thread pool com work-stealing que distribui física,
animação, streaming e outros jobs pelos núcleos da CPU, com três níveis de
prioridade, handles de conclusão e uma barreira bloqueante.</p>

---

## Visão Geral

O Job System distribui trabalho pesado (física, IA, animação, carregamento de
assets) entre os núcleos da CPU. Cada **job** é uma unidade de trabalho leve
executada por uma **worker thread**.

**Abordagem:** thread pool com **work-stealing** — cada worker tem deques
locais; quando estão vazias, rouba trabalho a outro worker. Isto proporciona
balanceamento de carga sem coordenação central.

**Implementado atualmente:**
- Três níveis de prioridade: Critical / Normal / Background
- Deques por worker e por nível de prioridade, mais filas globais por prioridade
- Tracking de conclusão por `JobHandle` com índice de slot + versão
- `JobBarrier` para esperar por um grupo de jobs
- Chunking em `scheduleParallelFor`

**Ainda não implementado:** fibers. Um job corre até ao fim numa thread do OS;
não pode suspender a meio sem bloquear essa thread.

---

## API

```cpp
namespace Caffeine::Threading {

enum class JobPriority : u8 {
    Critical   = 0,  // renderização, física
    Normal     = 1,  // gameplay, animação, eventos
    Background = 2   // carregamento de assets, streaming, compressão
};

constexpr u32 PRIORITY_COUNT = 3;

// Interface base de todos os jobs. Os jobs devem ser baratos de mover;
// evite alocar dentro de execute().
struct IJob {
    virtual ~IJob() = default;
    virtual void execute() = 0;
    virtual JobPriority priority() const { return JobPriority::Normal; }
};

// Job type-safe que é dono dos seus dados (sem alocação separada do payload).
template<typename DataT>
struct JobWithData : IJob {
    DataT                       data;
    std::function<void(DataT&)> func;
    JobPriority                 prio = JobPriority::Normal;

    void execute() override { func(data); }
    JobPriority priority() const override { return prio; }
};

// Handle para rastrear e sincronizar um job.
// index + version evitam o problema ABA sem lock.
class JobHandle {
public:
    JobHandle() = default;
    explicit JobHandle(u32 index, u32 version, std::atomic<u32>* completionFlag);

    void wait() const;         // bloqueia até o job concluir (cede a CPU)
    bool isComplete() const;   // verificação não bloqueante
    explicit operator bool() const { return isComplete(); }
};

// Barreira: wait() bloqueia até a contagem pendente chegar a zero.
class JobBarrier {
public:
    explicit JobBarrier(u32 targetCount = 0);

    void add();      // incrementa a contagem pendente
    void release();  // decrementa; o JobSystem chama isto quando um job conclui
    void wait();     // bloqueia até count == 0

private:
    std::atomic<u32>        m_count{0};
    std::mutex              m_mutex;
    std::condition_variable m_cv;
};

class JobSystem {
public:
    explicit JobSystem(u32 workerCount = 0);  // 0 = auto (hardware_concurrency - 1, no mínimo 1)
    ~JobSystem();

    JobSystem(const JobSystem&) = delete;
    JobSystem& operator=(const JobSystem&) = delete;

    JobHandle schedule(std::unique_ptr<IJob> job,
                       JobBarrier*           barrier = nullptr,
                       JobPriority           prio    = JobPriority::Normal);

    // Conveniência: constrói automaticamente um JobWithData<DataT>.
    template<typename DataT, typename FuncT>
    JobHandle scheduleData(DataT       data,
                           FuncT&&     func,
                           JobBarrier* barrier = nullptr,
                           JobPriority prio    = JobPriority::Normal);

    // Parallel-for sobre [0, count), dividido em um chunk por worker.
    template<typename FuncT>
    JobHandle scheduleParallelFor(u32         count,
                                  FuncT&&     func,
                                  JobBarrier* barrier = nullptr,
                                  JobPriority prio    = JobPriority::Normal);

    void waitAll();                           // bloqueia até não haver jobs pendentes
    u32  workerCount() const;

    struct Stats {
        u32 activeWorkers;
        u32 pendingJobs;
        u64 completedJobsTotal;
        f64 avgJobMs;
    };
    Stats stats() const;
};

}  // namespace Caffeine::Threading
```

> `scheduleData` guarda o callable em `std::function<void(DataT&)>`, pelo que a
> lambda recebe um `DataT&` mutável. Capture estado partilhado por referência ou
> por ponteiro; o job é dono apenas do payload `DataT` e do callable.

---

## Exemplos de Uso

```cpp
// ── Física distribuída em chunks ──────────────────────────────
Caffeine::Threading::JobSystem jobs;
constexpr Caffeine::u32 CHUNK_SIZE = 256;
const Caffeine::u32 chunkCount = (particleCount + CHUNK_SIZE - 1) / CHUNK_SIZE;
Caffeine::Threading::JobBarrier barrier(chunkCount);

for (Caffeine::u32 i = 0; i < particleCount; i += CHUNK_SIZE) {
    const Caffeine::u32 count = std::min(CHUNK_SIZE, particleCount - i);
    jobs.scheduleData(
        ChunkJob{i, count, dt},
        [&particles](ChunkJob& j) {
            for (Caffeine::u32 k = j.start; k < j.start + j.count; ++k)
                particles[k].integrate(j.dt);
        },
        &barrier,
        Caffeine::Threading::JobPriority::Critical
    );
}
barrier.wait();  // todos os chunks prontos antes de renderizar

// ── Parallel-for simplificado ─────────────────────────────────
jobs.scheduleParallelFor(entityCount,
    [&](Caffeine::u32 i) { animators[i].advance(dt); },
    nullptr,
    Caffeine::Threading::JobPriority::Normal
);

// ── Carregamento de assets em background ──────────────────────
auto handle = jobs.scheduleData(
    AssetLoadJob{"textures/hero.caf"},
    [](AssetLoadJob& j) { loadAsset(j.path); },
    nullptr,
    Caffeine::Threading::JobPriority::Background
);

// A main thread continua; verifique quando o asset for necessário:
if (handle.isComplete()) { /* usar o asset */ }
```

Quando o frame inteiro tem de esperar pelo trabalho pendente, chame
`jobs.waitAll()`. `JobHandle::wait()` bloqueia apenas nesse job.

---

## Arquitetura Interna

- `JobSystem`
  - Três filas globais, uma por prioridade, usadas por `schedule()`
  - Um `WorkStealDeque` por worker **e por prioridade** (3 × workerCount) para
    trabalho local do worker
  - `tryExecuteOne()` verifica as filas locais por ordem de prioridade, depois
    as filas globais, e por fim rouba a outros workers (também por prioridade)
  - Cada deque é um `std::deque` protegido por um `std::mutex`
- Tracking de conclusão
  - Um anel fixo de 4096 slots de conclusão
  - `JobHandle` guarda índice de slot, versão e um ponteiro para o flag atómico
  - Reutilizar um slot incrementa a versão, impedindo que handles antigos
    observem a conclusão de um job mais recente
- `JobBarrier`
  - Contagem atómica mais mutex/condition variable
  - O `JobSystem` chama `release()` depois de concluir um job agendado

**Work stealing:** um worker retira da frente da sua própria deque; quando está
vazia, rouba da cauda da deque de outro worker, o que reduz a contenção.

**A prioridade é best-effort:** os workers olham sempre para Critical antes de
Normal e de Background, mas um job Background em execução nunca é preemptido.

---

## Integração com ECS

`World::forEachParallel` cria um `JobBarrier`, divide cada archetype
correspondente em lotes de 1000 entidades e agenda os lotes no `JobSystem`
fornecido:

```cpp
Caffeine::ECS::ComponentQuery query;
query.with<Caffeine::ECS::RigidBody2D,
           Caffeine::ECS::Collider2D,
           Caffeine::ECS::Position2D>();

world.forEachParallel(query, jobs,
    [](Caffeine::ECS::Entity entity,
       Caffeine::ECS::RigidBody2D& rb,
       Caffeine::ECS::Collider2D& col,
       Caffeine::ECS::Position2D& pos) {
        integrateRigidBody(rb, pos);
    });
```

O callback recebe a `Entity` primeiro, seguida dos componentes pedidos.
`forEachParallel` espera pela sua barreira interna antes de retornar.

---

## Testes e Limites

`tests/test_jobsystem.cpp` cobre:
- Ordenação de prioridades
- Execução e defaults de `IJob` / `JobWithData`
- Conclusão e conversão para bool de `JobHandle`
- add/release/wait de `JobBarrier`
- Seleção do número de workers, agendamento, `scheduleData` e
  `scheduleParallelFor`
- `waitAll()` e `stats()`
- Stress com 1K jobs, 10K jobs e um parallel-for de 100K elementos

Não existe scheduler de fibers, cancelamento de jobs nem garantia de
work-stealing entre prioridades. Estes são itens de roadmap, não API atual.

---

## Decisões de Design

| Decisão | Justificativa |
|---------|-------------|
| `workerCount = n-1` por omissão (no mínimo 1) | A main thread não compete com os workers por CPU |
| Deques por worker + work stealing | Melhor throughput do que uma fila central para workloads heterogéneos |
| `index + version` no handle | Evita o problema ABA sem mutex |
| Três níveis de prioridade | Renderização/física não ficam atrás do carregamento de assets |
| Prioridade best-effort, sem preempção | Mantém os workers simples e evita inversão de prioridade por jobs longos |
| Slots de conclusão em vez de alocação por job | Handles baratos e estáveis enquanto os jobs executam |

---

## Dependências

- **Upstream:** `Caffeine::Core::Types`, `<thread>`, `<atomic>`, `<mutex>`,
  `<condition_variable>` e `<deque>` da biblioteca padrão
- **Downstream:** [ECS — `forEachParallel`](../ecs/core.md), [Physics 2D](../physics/physics-2d.md),
  [Animation](../animation/animation-2d.md), [Asset Manager](../assets/asset-manager.md)

---

## 🔗 Tópicos Relacionados

| Tópico | Descrição |
|--------|-----------|
| [Concorrência & Runtime]() | Job System no pipeline de frame |
| [Assets & Pipeline]() | Async loading usa o Job System |

## Referências

- [`src/caffeine/threading/JobSystem.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/threading/JobSystem.hpp) / [`src/caffeine/threading/JobSystem.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/threading/JobSystem.cpp)
- [`tests/test_jobsystem.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_jobsystem.cpp)
- [`docs/architecture_specs.md`](../architecture_specs.md) — §2 Job System
- [Multithreaded Job Systems in Game Engines](https://pulsegeek.com/articles/multithreaded-job-systems-in-game-engines/)
