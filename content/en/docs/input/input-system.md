# ⌨️ Input System

> **Phase:** 2 — Pulse and Competition
> **Namespace:** `Caffeine::Input` 
> **File:** `src/input/InputManager.hpp` 
> ** Status:** 
> **RF:** RF2.9

---

## Overview

The Input System abstracts devices (keyboard, mouse, gamepad) and exposes named actions** instead of raw scans. This allows you to remap controls without changing the game code.

** Philosophy:** The game code never asks "Was it pressed W?" — question "Was the action activated `MoveUp` ? ". The bindings map W → MoveUp, but can be reconfigured by the player.

---

## Arquitetura

- `SDL Events`
- `▼`
- `InputManager.beginFrame() ← chamado pelo GameLoop`
  - `KeyboardState ──▶ ActionMap ──▶ ActionState (pressed/justPressed/justReleased)`
  - `MouseState ──▶ AxisMap ──▶ AxisState (value/delta)`
  - `GamepadState[] ──▶ ──▶ (fornecido ao ECS via PlayerInput component)`


---

## API Planejada

```cpp
namespace Caffeine::Input {

// ============================================================================
// @brief  Ações predefinidas.
//
//  Adicionar ações customizadas a partir de CUSTOM_START.
// ============================================================================
enum class Action : u16 {
    None = 0,
    // Movimento
    MoveUp, MoveDown, MoveLeft, MoveRight,
    // Gameplay
    Jump, Attack, Interact, Pause,
    // Menus
    MenuUp, MenuDown, MenuLeft, MenuRight,
    MenuConfirm, MenuBack,
    // Espaço para ações customizadas do jogo
    CUSTOM_START = 128
};

// ============================================================================
// @brief  Eixos analógicos.
// ============================================================================
enum class Axis : u8 {
    None = 0,
    MoveX,    // -1.0 (esquerda) a +1.0 (direita)
    MoveY,    // -1.0 (cima) a +1.0 (baixo)
    LookX,    // Mouse X delta / Right stick X
    LookY,    // Mouse Y delta / Right stick Y
    CUSTOM_START = 64
};

// ============================================================================
// @brief  Estado de uma ação digital.
// ============================================================================
struct ActionState {
    bool pressed      = false;   // mantido enquanto tecla estiver pressionada
    bool justPressed  = false;   // true apenas no primeiro frame
    bool justReleased = false;   // true apenas no frame de soltura
};

// ============================================================================
// @brief  Estado de um eixo analógico.
// ============================================================================
struct AxisState {
    f32 value = 0.0f;  // -1.0 a +1.0
    f32 delta = 0.0f;  // mudança desde o último frame
};

// ============================================================================
// @brief  Binding — mapeia um dispositivo físico a uma ação/eixo.
// ============================================================================
struct Binding {
    enum class Type : u8 {
        Key,           // SDL_Scancode
        MouseButton,   // SDL_BUTTON_*
        GamepadButton, // SDL_GAMEPAD_BUTTON_*
        GamepadAxis    // SDL_GAMEPAD_AXIS_*
    };
    Type type;
    u32  code;
    f32  scale = 1.0f;  // para gamepad axis (inverte/escalona)
};

// ============================================================================
// @brief  Gerenciador de input principal.
//
//  Ciclo:
//  1. beginFrame()          — clear justPressed/justReleased, poll SDL events
//  2. actionState(Jump)     — consulta estado durante update
//  3. endFrame()            — atualiza histórico para próximo frame
// ============================================================================
class InputManager {
public:
    InputManager();
    ~InputManager();

    // Chamado no início de cada frame pelo GameLoop
    void beginFrame();
    // Chamado no fim de cada frame
    void endFrame();

    // Consulta de ações
    const ActionState& actionState(Action a) const;
    const AxisState&   axisState(Axis a) const;

    bool isPressed(Action a)      const { return actionState(a).pressed; }
    bool justPressed(Action a)    const { return actionState(a).justPressed; }
    bool justReleased(Action a)   const { return actionState(a).justReleased; }
    f32  axisValue(Axis a)         const { return axisState(a).value; }

    // Mouse
    Vec2 mousePosition() const;
    Vec2 mouseDelta()    const;
    void setMouseRelative(bool enabled);  // para mouse look (câmera)

    // Configuração de bindings (remapável em runtime)
    void bindAction(Action action, std::initializer_list<Binding> bindings);
    void bindAxis(Axis axis, std::initializer_list<Binding> bindings);
    void clearBindings(Action action);
    void resetToDefaults();

private:
    void processSdlEvent(const SDL_Event& e);

    HashMap<SDL_Scancode, Action> m_keyBindings;
    HashMap<u32, Action>          m_mouseBindings;
    HashMap<i32, Action>          m_gamepadButtonBindings;
    HashMap<i32, Axis>            m_gamepadAxisBindings;

    Array<ActionState, 256> m_actionStates;   // indexed by Action
    Array<AxisState,  64>   m_axisStates;     // indexed by Axis
    Array<bool, 256>         m_prevPressed;   // para calcular justPressed/Released

    Vec2 m_mousePos     = {0, 0};
    Vec2 m_mouseDelta   = {0, 0};
    bool m_mouseRelative = false;
};

}  // namespace Caffeine::Input
```

---

## Componente ECS para Input

```cpp
namespace Caffeine::Components {

// ============================================================================
// @brief  Componente que permite a uma entidade reagir a input do jogador.
//
//  Adicionado ao Entity "Player" pelo jogo.
//  O MovementSystem lê este componente junto com Velocity2D.
// ============================================================================
struct PlayerInput {
    Caffeine::Input::Action moveUpAction    = Caffeine::Input::Action::MoveUp;
    Caffeine::Input::Action moveDownAction  = Caffeine::Input::Action::MoveDown;
    Caffeine::Input::Action moveLeftAction  = Caffeine::Input::Action::MoveLeft;
    Caffeine::Input::Action moveRightAction = Caffeine::Input::Action::MoveRight;
    Caffeine::Input::Action jumpAction      = Caffeine::Input::Action::Jump;
    Caffeine::Input::Axis   moveAxisX       = Caffeine::Input::Axis::MoveX;
    Caffeine::Input::Axis   moveAxisY       = Caffeine::Input::Axis::MoveY;
    f32 moveSpeed  = 200.0f;  // pixels/segundo
    f32 jumpForce  = 500.0f;
};

}  // namespace Caffeine::Components
```

---

## Exemplos de Uso

```cpp
// ── Setup de bindings ─────────────────────────────────────────
Caffeine::Input::InputManager input;

input.bindAction(Caffeine::Input::Action::Jump, {
    { Caffeine::Input::Binding::Type::Key, SDL_SCANCODE_SPACE },
    { Caffeine::Input::Binding::Type::GamepadButton, SDL_GAMEPAD_BUTTON_SOUTH }
});

input.bindAxis(Caffeine::Input::Axis::MoveX, {
    { Caffeine::Input::Binding::Type::Key, SDL_SCANCODE_D,  +1.0f },
    { Caffeine::Input::Binding::Type::Key, SDL_SCANCODE_A,  -1.0f },
    { Caffeine::Input::Binding::Type::GamepadAxis, SDL_GAMEPAD_AXIS_LEFTX, 1.0f }
});

// ── Uso no Game Loop ─────────────────────────────────────────
input.beginFrame();  // dentro de GameLoop::processInput()

// ── Uso no Movement System ───────────────────────────────────
world.query(movementQuery, [&](PlayerInput& pi, Velocity2D& vel) {
    vel.x = input.axisValue(pi.moveAxisX) * pi.moveSpeed;

    if (input.justPressed(pi.jumpAction)) {
        vel.y = pi.jumpForce;
    }
});

input.endFrame();
```

---

## Default Bindings (to be configured)

| Action | Teclado | Gamepad |
|------|---------|---------|
| MoveUp | W / ↑ | Left Stick Up |
| MoveDown | S / ↓ | Left Stick Down |
| MoveLeft | A / ← | Left Stick Left |
| MoveRight | D / → | Left Stick Right |
| Jump | Space | A / Cross |
| Attack | LMB / Z | X / Square |
| Interact | E | B / Circle |
| Pause | Esc | Start |

---

## Design Decisions

| Decision | Justificativa |
|---------|-------------|
| Action-based, not scancode | Portable games; remopping in runtime without changing code |
| `justPressed` / `justReleased` por frame | Elimina necessidade de polling manual |
| Binding changeable map | Remapping in runtime (player options menu) |
| Mouse relative mode | Mouse look for camera without drift (FPS, twin-stick) |
| Array<ActionState, 256> | Access O(1) by index; no hash for hot path |

---

## Acceptance Criteria

- [ ] `justPressed` registered in the same frame where the key is pressed
- [ ] Input latency < 1ms (input does not add noticeable overhead)
- [ ] Remapping funciona sem reiniciar
- [ ] Gamepad e teclado funcionam simultaneamente
- [ ] `setMouseRelative(true)` desativa cursor e fornece deltas

---

## Dependencies

- **Upstream:** `SDL3::SDL_PollEvent` , `Caffeine::Core::Types`
- **Downstream:** [Game Loop](../core/game-loop.md), [Phase 4 — ECS Movement System](../ecs/core.md)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Sistemas de Jogo]() | Input alimenta sistemas ECS |
| [Competition & Runtime]() | Input processado no Game Loop |

## References

- [`docs/architecture_specs.md`](../architecture specs.md) — §3 Input System
- [`core/game-loop.md`](../core/game-loop.md) — `processInput()` chama InputManager
- [`ecs/core.md`](.../ecs/core.md) — `PlayerInput` component
- [Transversal Topic Index]()
