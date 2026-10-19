# 🎬 Animation System

> **Phase:**4 — The Brain
> **Namespace:** `Caffeine::Animation` 
> **File:** `src/animation/AnimationSystem.hpp` 
> **Status: ** Implemented
> **RF:** RF4.9

---

## Overview

2D animation system with sprite clips and state machine. Each entity has a component `Animator` who manages the animation state machine.

**Phase 5** adds skeletal animation (bones, skinning, blend trees) — see [`animation/skeletal-animation.md`](../animation/skeletal-animation.md).

---

## API

```cpp
namespace Caffeine::Animation {

struct FrameRect {
    f32 x = 0.0f;
    f32 y = 0.0f;
    f32 w = 0.0f;
    f32 h = 0.0f;
};

struct AnimationClip {
    FixedString<32>        name;
    u32                    fps   = 12;
    std::vector<FrameRect> frames;
    bool                   loop  = true;
    f32 duration() const;
};

struct AnimationTransition {
    FixedString<32>       toState;
    std::function<bool()> condition;
    f32                   blendTime   = 0.1f;
    bool                  hasExitTime = false;
};

struct AnimationState {
    FixedString<32>                  name;
    const AnimationClip*             clip  = nullptr;
    f32                              speed = 1.0f;
    std::vector<AnimationTransition> transitions;
};

struct Animator {
    HashMap<FixedString<32>, AnimationState>     states;
    FixedString<32>                              currentState;
    FixedString<32>                              previousState;
    f32                                          timeInState   = 0.0f;
    f32                                          blendWeight   = 1.0f;
    f32                                          playbackScale = 1.0f;
    bool                                         paused        = false;
    std::vector<std::pair<u32, FixedString<32>>> frameEvents;
    std::function<void(const FixedString<32>&)>  onFrameEvent;
};

class AnimationSystem : public ECS::ISystem {
public:
    void onUpdate(ECS::World& world, f32 dt) override;

    void play(ECS::World& world, ECS::Entity e, const char* stateName);
    void pause(ECS::World& world, ECS::Entity e);
    void resume(ECS::World& world, ECS::Entity e);
    void setSpeed(ECS::World& world, ECS::Entity e, f32 speed);
    bool isPlaying(ECS::World& world, ECS::Entity e, const char* stateName) const;
};

}  // namespace Caffeine::Animation
```

---

## State Machine Visual

- `jump == true`
- `idle ──────────────────► jump_rise`
  - `◄──────────────────────────┤ apex (vel.y < 0.1)`
  - `land ▼`
  - `◄──────────────── jump_fall`
  - `moveX != 0`
  - `► walk`
  - `attack btn`
  - `► attack_1 ──► attack_2 (combo)`


---

## Exemplos de Uso

```cpp
AnimationClip idleClip;
idleClip.name = "idle";
idleClip.fps  = 8;
idleClip.frames = { {0,0,64,64}, {64,0,64,64} };
idleClip.loop = true;

AnimationClip walkClip;
walkClip.name = "walk";
walkClip.fps  = 12;
walkClip.frames = { {128,0,64,64}, {192,0,64,64}, {256,0,64,64}, {320,0,64,64} };
walkClip.loop = true;

AnimationState idleState;
idleState.name = "idle";
idleState.clip = &idleClip;
idleState.transitions.push_back({
    FixedString<32>("walk"),
    [&]() { return input.axisValue(Axis::MoveX) != 0.0f; }
});

AnimationState walkState;
walkState.name = "walk";
walkState.clip = &walkClip;
walkState.transitions.push_back({
    FixedString<32>("idle"),
    [&]() { return input.axisValue(Axis::MoveX) == 0.0f; }
});

Animator anim;
anim.states.set(FixedString<32>("idle"), idleState);
anim.states.set(FixedString<32>("walk"), walkState);
anim.currentState = "idle";

world.add<Animator>(player, std::move(anim));

AnimationSystem animSys;
animSys.play(world, player, "attack_1");

world.get<Animator>(player)->frameEvents.push_back({3u, FixedString<32>("attack_hit")});
world.get<Animator>(player)->onFrameEvent = [](const FixedString<32>& evt) {
    if (evt == FixedString<32>("attack_hit")) damageEnemiesInRange();
};

animSys.onUpdate(world, dt);
```

---

## Design Decisions

| Decision | Justificativa |
|---------|-------------|
| State machine | Animated logic separated from gameplay logic |
| `condition` como lambda | Flexible without overhead parsing |
| `blendTime` by transition | Smooth Crossfade by default |
| Frame events | Synchronize gameplay with specific animation frames |
| `priority = 200` | Wheel after PhysicsSystem (100) and MovementSystem (150) |

---

## Acceptance Criteria

- [ ] `advanceFrame()` < 0.1ms para 100 entidades animadas
- [ ] 60fps com 100 entidades animadas simultaneamente
- [ ] Soft blendtime transitions (no visual pop)
- [ ] Frame events disparados no frame correto

---

## Dependencies

- **Upstream:** [ECS Core](ecs.md), [Asset Manager](../assets/asset-manager.md) (AnimationClip carregado)
- **Downstream:** [Phase 5 — Skeletal Animation](../animation/skeletal-animation.md)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Sistemas de Jogo]() | Animation System como sistema ECS |
| [Rendering & Pipeline]() | Sprites animados renderizados pelo Batch Renderer |

## References

- [`docs/architecture_specs.md`](../architecture specs.md) — §12 Animation System
- [`animation/skeletal-animation.md`](../animation/skeletal-animation.md) — extension to 3D
- [Transversal Topic Index]()
