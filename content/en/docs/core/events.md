# 📢 Event Bus

> **Phase:**4 — The Brain
> **Namespace:** `Caffeine::Events`
> **Files:** `src/events/EventBus.hpp` , `src/events/EventBus.cpp` , `src/events/Events.hpp`
> **Status: ** Implemented
> **RF:** RF4.6

---

## Overview

Event Bus allows for communication ** Uncoupled** between systems. One system publishes an event; others sign up without knowing who publishes it. This eliminates direct dependencies (e.g. Physics does not need to know Audio).

**Dois modos de entrega:**
- `publish<T>()` — Immediately, call listeners now (main thread)
- `publishDeferred<T>()` — line for the next `dispatch()` (thread-safe)

---

## API

### `EventBus`

```cpp
namespace Caffeine::Events {

using ListenerHandle = u32;

class EventBus {
public:
    // Inscreve um listener tipado. Retorna handle para cancelamento.
    template<typename T>
    ListenerHandle subscribe(std::function<void(const T&)> callback);

    // Remove o listener. No-op se handle inválido. Zero dangling pointers.
    void unsubscribe(ListenerHandle handle);

    // Entrega imediata: chama todos os listeners agora (snapshot seguro).
    template<typename T>
    void publish(const T& event);

    // Enfileira evento para o próximo dispatch(). Thread-safe.
    template<typename T>
    void publishDeferred(T event);

    // Processa toda a fila diferida. Chamar uma vez por frame, no GameLoop.
    void dispatch();

    // Número de eventos pendentes na fila.
    usize pendingCount() const;

    // Remove todos os listeners e esvazia a fila.
    void clear();
};

} // namespace Caffeine::Events
```

### Tipo ID de Evento

Cada tipo `T` receives a unique ID in runtime via local static variable address — zero practical collision, zero manual record:

```cpp
template<typename T>
u32 eventTypeId() {
    static char s_sentinel = 0;
    return static_cast<u32>(reinterpret_cast<uintptr_t>(&s_sentinel));
}
```

> Note: 64 bit address is truncated to `u32` . Theoretical Collision is
> possible but negligible in practice (it would require two statistics to exactly
> 4 GiB distance with the same 32 bits low).

---

## Predefined Events

Todos em `src/events/Events.hpp` , namespace `Caffeine::Events` .

### ECS

```cpp
struct OnEntityCreated   { u32 entityId; };
struct OnEntityDestroyed { u32 entityId; };
```

### Physics / Collision

```cpp
struct OnCollision2D {
    u32  entityA;
    u32  entityB;
    Vec2 contactPoint;
    Vec2 normal;
    f32  impulse;
};

struct OnTrigger2D {
    u32  triggerEntity;
    u32  otherEntity;
    bool entered; // true = enter, false = exit
};
```

### Combate / Stats

```cpp
struct OnHealthChanged {
    u32 entityId;
    f32 previousHealth;
    f32 currentHealth;
    f32 maxHealth;
};

struct OnDeath {
    u32 entityId;
    u32 killerEntityId; // 0 = environmental / no killer
};
```

### Progression

```cpp
struct OnScoreChanged {
    u32 playerId;
    i32 previousScore;
    i32 currentScore;
    i32 delta;
};
```

### Cena

```cpp
struct OnLevelLoaded   { u32 levelId; c8 levelName[64]; };
struct OnLevelUnloaded { u32 levelId; };
```

### Input

```cpp
struct OnActionPressed  { u32 actionId; u32 playerId; };
struct OnActionReleased { u32 actionId; u32 playerId; };
```

---

## Exemplos de Uso

### Basic setup

```cpp
Caffeine::Events::EventBus bus;

// Inscrever
ListenerHandle h = bus.subscribe<OnDeath>([](const OnDeath& e) {
    if (e.killerEntityId == 0) {
        // morte ambiental
    }
});

// Publicar imediato (main thread)
bus.publish(OnDeath{ entityId, killerId });

// Cancelar
bus.unsubscribe(h);
```

### Deferred publication (de worker thread)

```cpp
// PhysicsSystem rodando em job worker:
bus.publishDeferred(OnCollision2D{
    entityA, entityB, contactPoint, normal, impulse
});

// GameLoop, início do fixed update:
bus.dispatch(); // entrega todos os eventos enfileirados
```

### Communication between systems without coupling

```cpp
// AudioSystem (não conhece PhysicsSystem)
bus.subscribe<OnCollision2D>([&audio](const OnCollision2D& e) {
    audio.playSFX("impact.caf");
});

// ScoreSystem (não conhece nada de gameplay)
bus.subscribe<OnDeath>([&score](const OnDeath& e) {
    score.add(100);
});

// PhysicsSystem publica, ambos recebem
bus.publishDeferred(OnCollision2D{ ... });
```

---

## Integration in GameLoop

- `Frame N:`
  - `InputManager.poll()`
  - `EventBus.dispatch() ← entrega diferidos do frame N-1`
  - `World.update(fixedDt)`
    - `PhysicsSystem → publishDeferred(OnCollision2D)`
    - `CombatSystem → publish(OnDeath) ← imediato`
    - `...`
  - `render(alpha)`
- `Frame N+1:`
  - `EventBus.dispatch() ← entrega os OnCollision2D do frame N`
  - `...`


---

## Design Decisions

| Decision | Justificativa |
|---------|---------------|
| Type-erased `void*` internamente | Permite `std::unordered_map<u32, vector<Record>>` sem virtual por tipo |
| Snapshot antes de iterar em `publish()` | Listener pode chamar `unsubscribe()` without invalidating iteration |
| Mutex only in the deferred queue | `publish()` e `subscribe()` are main-thread only; only `publishDeferred()` precisa de lock |
| `ListenerHandle = u32` | No pending hands; unsubscribe by ID, not by reference |
| `eventTypeId<T>()` via `static char` | Zero registration cost; Unique ID guaranteed by static address |
| `unsubscribe()` com busca linear | O(types × listeners); acceptable because unsubscribe is rare (not hot path) |

---

## Thread Safety

| Operation | Thread-safe? | Motivo |
|----------|-------------|--------|
| `subscribe()` | Main thread only | Modifica `m_listeners` sem lock |
| `unsubscribe()` | Main thread only | Modifica `m_listeners` sem lock |
| `publish()` | Main thread only | Read `m_listeners` sem lock |
| `publishDeferred()` | Any thread | Protegido por `m_queueMutex` |
| `dispatch()` | Main thread only | Consume queue after swap; no lock required |

---

## Acceptance Criteria

| Criteria | Resultado |
|----------|-----------|
| 1K events/frame without noticeable overhead | ✅ 1000× `publish()` = **0.085ms** total |
| `publish()` < 0.1ms (hot path) | ✅ **0.086µs**/call (10K reps, Release) |
| `publishDeferred` thread-safe | 8 threads × 125 events = 1000/1000 without race |
| Deferred events delivered next `dispatch()` | Zero delivered before, all later |
| Zero listeners killed after `unsubscribe` | ✅ 0 callbacks após unsubscribe (imediato e deferred) |

---

## Tests

`tests/test_eventbus.cpp` — 18 test cases, 39 assertions:

| Teste | Cobertura |
|-------|-----------|
| subscribe + publish imediato | Fluxo base |
| Multiple listeners in the same type | Fan-out |
| unsubscribe remove listener | Cancelamento correto |
| invalid unsubscribe handle | No-op seguro |
| Tipos de evento isolados | Sem cross-talk |
| publish sem listeners | No-op seguro |
| publishDeferred does not deliver immediately | Fila correta |
| dispatch entrega todos | Entrega garantida |
| dispatch esvazia fila | Post-dispatch status |
| Ordem de entrega deferred | FIFO preservado |
| clear remove listeners e fila | Reset completo |
| Unique Handles by Subscription | IDs do not collide |
| Selective Unsubscribe between several | Surgical precision |
| Deferred com tipos mistos | Multi-type queue |
| `OnEntityCreated` predefinido | Evento ECS |
| `OnDeath` predefinido | Evento combate |
| `OnScoreChanged` predefinido + dispatch | Progression Event |
| 8 threads × 125 `publishDeferred` | Thread safety |

---

## Dependencies

- **Upstream:** `Caffeine::Core::Types` , `src/math/Vec2.hpp`
- **Downstream (real use in code):** `PhysicsSystem2D` ( `src/physics/` ) publishes collision;
 `ScriptEngine` ( `src/script/` ) exposes `on` / `emit` para Lua; `UISystem` ( `src/ui/` )
 e `SceneEditor` ( `src/editor/` ) consomem eventos
- **Docs relacionados:** [Physics 2D](../physics/physics-2d.md), [Audio](../audio/audio-system.md),
[Game UI](../ui/game-ui.md), [GameLoop](../core/game-loop.md) (chama `dispatch()` )

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Competition & Runtime]() | Event Bus no contexto do Game Loop |
| [Sistemas de Jogo]() | Eventos conectam sistemas de gameplay |

## References

- [`docs/architecture_specs.md`](../architecture specs.md) — §6 Event Bus
- [`../physics/physics-2d.md`](../physics/physics-2d.md) — publishes `OnCollision2D`
- [`core/game-loop.md`](../core/game-loop.md) — flame `eventBus.dispatch()`
- [Transversal Topic Index]()
