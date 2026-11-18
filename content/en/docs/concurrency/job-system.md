# 🔗 Job System

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Threading</code></span>
  <span><strong>Files:</strong> <code>src/caffeine/threading/JobSystem.hpp</code>, <code>src/caffeine/threading/JobSystem.cpp</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">A work-stealing thread pool that spreads physics, animation,
streaming and other jobs across CPU cores, with three priority levels,
completion handles and a blocking barrier.</p>

---

## Overview

The Job System distributes heavy work (physics, AI, animation, asset loading)
across CPU cores. Each **job** is a lightweight unit of work executed by a
**worker thread**.

**Approach:** thread pool with **work-stealing** — each worker has local
deques; when they are empty, it steals from another worker. This provides load
balancing without central coordination.

**Implemented today:**
- Three priority levels: Critical / Normal / Background
- Per-worker deques per priority level, plus global queues per priority
- `JobHandle` completion tracking with slot index + version
- `JobBarrier` for waiting on a group of jobs
- `scheduleParallelFor` chunking

**Not implemented yet:** fibers. A job runs to completion on an OS thread; it
cannot suspend halfway without blocking that thread.

---

## API

```cpp
namespace Caffeine::Threading {

enum class JobPriority : u8 {
    Critical   = 0,  // rendering, physics
    Normal     = 1,  // gameplay, animation, events
    Background = 2   // asset loading, streaming, compression
};

constexpr u32 PRIORITY_COUNT = 3;

// Base interface for every job. Jobs must be cheap to move; avoid
// allocating inside execute().
struct IJob {
    virtual ~IJob() = default;
    virtual void execute() = 0;
    virtual JobPriority priority() const { return JobPriority::Normal; }
};

// Type-safe job that owns its data (no separate allocation for the payload).
template<typename DataT>
struct JobWithData : IJob {
    DataT                       data;
    std::function<void(DataT&)> func;
    JobPriority                 prio = JobPriority::Normal;

    void execute() override { func(data); }
    JobPriority priority() const override { return prio; }
};

// Handle used to track and synchronize one job.
// index + version avoid the ABA problem without a lock.
class JobHandle {
public:
    JobHandle() = default;
    explicit JobHandle(u32 index, u32 version, std::atomic<u32>* completionFlag);

    void wait() const;         // blocks until the job completes (yields the CPU)
    bool isComplete() const;   // non-blocking check
    explicit operator bool() const { return isComplete(); }
};

// Barrier: wait() blocks until the pending count reaches zero.
class JobBarrier {
public:
    explicit JobBarrier(u32 targetCount = 0);

    void add();      // increments the pending count
    void release();  // decrements it; the JobSystem calls this when a job completes
    void wait();     // blocks until count == 0

private:
    std::atomic<u32>        m_count{0};
    std::mutex              m_mutex;
    std::condition_variable m_cv;
};

class JobSystem {
public:
    explicit JobSystem(u32 workerCount = 0);  // 0 = auto (hardware_concurrency - 1, at least 1)
    ~JobSystem();

    JobSystem(const JobSystem&) = delete;
    JobSystem& operator=(const JobSystem&) = delete;

    JobHandle schedule(std::unique_ptr<IJob> job,
                       JobBarrier*           barrier = nullptr,
                       JobPriority           prio    = JobPriority::Normal);

    // Convenience: builds a JobWithData<DataT> automatically.
    template<typename DataT, typename FuncT>
    JobHandle scheduleData(DataT       data,
                           FuncT&&     func,
                           JobBarrier* barrier = nullptr,
                           JobPriority prio    = JobPriority::Normal);

    // Parallel-for over [0, count), split into one chunk per worker.
    template<typename FuncT>
    JobHandle scheduleParallelFor(u32         count,
                                  FuncT&&     func,
                                  JobBarrier* barrier = nullptr,
                                  JobPriority prio    = JobPriority::Normal);

    void waitAll();                           // blocks until no jobs are pending
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

> `scheduleData` stores the callable in `std::function<void(DataT&)>`, so the
> lambda receives a mutable `DataT&`. Capture shared state by reference or by
> pointer; the job owns only its `DataT` payload and the callable.

---

## Usage Examples

```cpp
// ── Physics distributed in chunks ─────────────────────────────
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
barrier.wait();  // all chunks ready before rendering

// ── Simplified parallel-for ───────────────────────────────────
jobs.scheduleParallelFor(entityCount,
    [&](Caffeine::u32 i) { animators[i].advance(dt); },
    nullptr,
    Caffeine::Threading::JobPriority::Normal
);

// ── Background asset loading ──────────────────────────────────
auto handle = jobs.scheduleData(
    AssetLoadJob{"textures/hero.caf"},
    [](AssetLoadJob& j) { loadAsset(j.path); },
    nullptr,
    Caffeine::Threading::JobPriority::Background
);

// The main thread keeps running; poll when the asset is needed:
if (handle.isComplete()) { /* use the asset */ }
```

When the whole frame must wait for outstanding work, call `jobs.waitAll()`.
`JobHandle::wait()` blocks only on that one job.

---

## Internal Architecture

- `JobSystem`
  - Three global queues, one per priority, used by `schedule()`
  - One `WorkStealDeque` per worker **per priority** (3 × workerCount) for
    worker-local work
  - `tryExecuteOne()` checks local queues in priority order, then global
    queues, then steals from other workers (also in priority order)
  - Each deque is a `std::deque` guarded by a `std::mutex`
- Completion tracking
  - A fixed ring of 4096 completion slots
  - `JobHandle` stores a slot index, a version and a pointer to its atomic flag
  - Reusing a slot increments the version, which prevents stale handles from
    observing a newer job's completion
- `JobBarrier`
  - Atomic count plus mutex/condition variable
  - `JobSystem` calls `release()` after a scheduled job finishes

**Work stealing:** a worker pops from the front of its own deque; when empty it
steals from the back of another worker's deque, which reduces contention.

**Priority is best-effort:** workers always look at Critical before Normal
before Background, but a running Background job is never preempted.

---

## ECS Integration

`World::forEachParallel` builds a `JobBarrier`, splits each matching archetype
into batches of 1000 entities and schedules the batches on the supplied
`JobSystem`:

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

The callback receives the `Entity` first, followed by the requested components.
`forEachParallel` waits on its internal barrier before returning.

---

## Tests and Limits

`tests/test_jobsystem.cpp` covers:
- Priority ordering
- `IJob` / `JobWithData` execution and defaults
- `JobHandle` completion and bool conversion
- `JobBarrier` add/release/wait
- Worker count selection, scheduling, `scheduleData`, `scheduleParallelFor`
- `waitAll()` and `stats()`
- Stress runs with 1K jobs, 10K jobs and a 100K-element parallel-for

There is no fiber scheduler, no job cancellation and no work-stealing
guarantee across priorities. These are roadmap items, not current API.

---

## Design Decisions

| Decision | Rationale |
|---------|-------------|
| `workerCount = n-1` by default (at least 1) | The main thread does not compete with CPU workers |
| Per-worker deques + work stealing | Better throughput than a single central queue for heterogeneous workloads |
| `index + version` in the handle | Avoids the ABA problem without a mutex |
| Three priority levels | Rendering/physics do not queue behind asset loading |
| Best-effort priority, no preemption | Keeps workers simple and avoids priority inversion from long jobs |
| Completion slots instead of per-job allocations | Handles are cheap and stable while jobs execute |

---

## Dependencies

- **Upstream:** `Caffeine::Core::Types`, standard `<thread>`, `<atomic>`,
  `<mutex>`, `<condition_variable>`, `<deque>`
- **Downstream:** [ECS — `forEachParallel`](../ecs/core.md), [Physics 2D](../physics/physics-2d.md),
  [Animation](../animation/animation-2d.md), [Asset Manager](../assets/asset-manager.md)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Concurrency & Runtime]() | Job System in the frame pipeline |
| [Assets & Pipeline]() | Async loading uses the Job System |

## References

- [`src/caffeine/threading/JobSystem.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/threading/JobSystem.hpp) / [`src/caffeine/threading/JobSystem.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/threading/JobSystem.cpp)
- [`tests/test_jobsystem.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_jobsystem.cpp)
- [`docs/architecture_specs.md`](../architecture_specs.md) — §2 Job System
- [Multithreaded Job Systems in Game Engines](https://pulsegeek.com/articles/multithreaded-job-systems-in-game-engines/)
