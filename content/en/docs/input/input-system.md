# ⌨️ Input System

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Input</code></span>
  <span><strong>Files:</strong> <code>src/caffeine/input/InputManager.hpp</code>, <code>src/caffeine/input/InputManager.cpp</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">An action-based input layer with remappable keyboard, mouse
and gamepad bindings, exposed as per-frame action and axis state without a
compile-time SDL dependency.</p>

---

## Overview

The Input System abstracts devices (keyboard, mouse, gamepad) and exposes
**named actions** instead of raw scancodes. This lets the game remap controls
without changing gameplay code.

**Philosophy:** game code never asks "was W pressed?" — it asks "was the
`MoveUp` action activated?". Bindings map W → `MoveUp`, but the player can
reconfigure them.

The header has **no SDL3 dependency**. The host application translates SDL
events into `injectKeyDown()` / `injectKeyUp()` / `injectMouseButtonDown()` /
`injectGamepadAxis()` calls; tests feed the same injection API directly.

---

## Architecture

- Host event pump (SDL or another backend)
- `InputManager.beginFrame()` — snapshots raw and action state for the new frame
- Host injects events (`injectKey*`, `injectMouse*`, `injectGamepad*`)
- `InputManager.endFrame()` — evaluates bindings, updates `ActionState`
  (`pressed` / `justPressed` / `justReleased`) and fires callbacks
- Game systems query `actionState()` / `axisState()` during update

`beginFrame()` does not poll events and `endFrame()` does not inject them; the
host owns that boundary. Call `beginFrame()` before injecting a frame's events
and `endFrame()` once all events have been injected.

---

## API

```cpp
namespace Caffeine::Input {

enum class Action : u8 {
    MoveUp = 0, MoveDown, MoveLeft, MoveRight,
    Jump, Attack, Interact, Pause,
    Count
};

enum class Axis : u8 {
    MoveX = 0,
    MoveY,
    LookX,
    LookY,
    Count
};

// SDL-compatible values; no SDL header is included.
enum class Key : u16 { /* A–Z, digits, arrows, Space, Escape, modifiers, ... */ };
enum class MouseButton : u8 { Left = 1, Middle, Right, X1, X2, Count };
enum class GamepadButton : u8 { A = 0, B, X, Y, /* ... */ Count };
enum class GamepadAxis : u8 { LeftX = 0, LeftY, RightX, RightY, TriggerLeft, TriggerRight, Count };

struct ActionState {
    bool pressed      = false;   // held while any binding is active
    bool justPressed  = false;   // true only on the first frame
    bool justReleased = false;   // true only on the release frame
};

struct AxisState {
    f32 value = 0.0f;  // -1.0 .. +1.0
    f32 delta = 0.0f;  // change since the previous frame
};

enum class BindingType : u8 {
    Key,
    MouseButton,
    GamepadButton,
    GamepadAxis
};

struct Binding {
    BindingType type;
    union {
        Key           key;
        MouseButton   mouseButton;
        GamepadButton gamepadButton;
        GamepadAxis   gamepadAxis;
    };

    static Binding fromKey(Key k);
    static Binding fromMouseButton(MouseButton mb);
    static Binding fromGamepadButton(GamepadButton gb);
    static Binding fromGamepadAxis(GamepadAxis ga);
};

static constexpr usize MAX_BINDINGS_PER_ACTION = 4;

class InputManager {
public:
    InputManager();

    // --- Frame lifecycle (called by the host/GameLoop) ---
    void beginFrame();
    void endFrame();

    // --- Event injection (testable without SDL3) ---
    void injectKeyDown(Key key);
    void injectKeyUp(Key key);
    void injectMouseButtonDown(MouseButton button);
    void injectMouseButtonUp(MouseButton button);
    void injectMouseMove(f32 x, f32 y);
    void injectGamepadButtonDown(GamepadButton button);
    void injectGamepadButtonUp(GamepadButton button);
    void injectGamepadAxis(GamepadAxis axis, f32 value);

    // --- State queries ---
    ActionState actionState(Action action) const;
    AxisState   axisState(Axis axis) const;
    bool        isKeyDown(Key key) const;
    bool        isMouseButtonDown(MouseButton button) const;
    Vec2        mousePosition() const;
    Vec2        mouseDelta() const;

    // --- Binding management ---
    void bind(Action action, Binding binding);          // adds up to 4 bindings
    void clearBindings(Action action);
    void clearAllBindings();
    void resetToDefaults();

    // --- Axis binding: one negative and one positive binding ---
    void bindAxis(Axis axis, Binding negative, Binding positive);

    // --- Callbacks ---
    std::function<void(Action)> onActionPressed;
    std::function<void(Action)> onActionReleased;

    class IInputCallbacks {
    public:
        virtual ~IInputCallbacks() = default;
        virtual void onActionPressed(Action action) = 0;
        virtual void onActionReleased(Action action) = 0;
    };
    void setCallbackHandler(IInputCallbacks* handler);
};

}  // namespace Caffeine::Input
```

> There is no `Action::None`, `CUSTOM_START`, `justPressed(Action)` accessor,
> `axisValue()` helper or mouse-relative mode in the current header. Use
> `actionState(action).justPressed` and `axisState(axis).value`.

---

## Default Bindings

`InputManager::resetToDefaults()` installs:

| Action | Keyboard |
|------|---------|
| MoveUp | W / ↑ |
| MoveDown | S / ↓ |
| MoveLeft | A / ← |
| MoveRight | D / → |
| Jump | Space |
| Pause | Esc |

Axes:

| Axis | Negative | Positive |
|------|----------|----------|
| MoveX | A | D |
| MoveY | S | W |
| LookX | Right stick X | Right stick X |
| LookY | Right stick Y | Right stick Y |

`Attack` and `Interact` have no default binding. Gamepad face buttons are not
bound to actions by default either; bind them explicitly.

---

## Usage Examples

### Binding actions and axes

```cpp
Caffeine::Input::InputManager input;

input.bind(Caffeine::Input::Action::Jump,
           Caffeine::Input::Binding::fromKey(Caffeine::Input::Key::Space));
input.bind(Caffeine::Input::Action::Jump,
           Caffeine::Input::Binding::fromGamepadButton(
               Caffeine::Input::GamepadButton::A));

input.bindAxis(Caffeine::Input::Axis::MoveX,
               Caffeine::Input::Binding::fromKey(Caffeine::Input::Key::A),
               Caffeine::Input::Binding::fromKey(Caffeine::Input::Key::D));
```

### Frame lifecycle

```cpp
input.beginFrame();

// The host translates SDL events into injection calls:
input.injectKeyDown(Caffeine::Input::Key::W);
input.injectMouseMove(mouseX, mouseY);

input.endFrame();  // evaluates bindings and fires callbacks
```

### Reading input in a system

```cpp
const Caffeine::Input::ActionState jump =
    input.actionState(Caffeine::Input::Action::Jump);

if (jump.justPressed) {
    velocity.y = jumpForce;
}

const Caffeine::Input::AxisState moveX =
    input.axisState(Caffeine::Input::Axis::MoveX);
velocity.x = moveX.value * moveSpeed;

// Mouse look: accumulate the per-frame delta yourself.
const Caffeine::Vec2 look = input.mouseDelta();
yaw   += look.x * sensitivity;
pitch += look.y * sensitivity;
```

### Reacting to actions

```cpp
input.onActionPressed = [](Caffeine::Input::Action action) {
    if (action == Caffeine::Input::Action::Pause) {
        togglePause();
    }
};
```

Game code that needs per-entity control mapping can define its own component
holding `Action` / `Axis` values; the engine does not ship a `PlayerInput`
component.

---

## Tests

`tests/test_input.cpp` (34 cases) covers:
- `justPressed` / `justReleased` transitions across frames
- Multiple bindings on one action
- Mouse button and gamepad button bindings
- Mouse position and delta tracking
- Axis negative/positive pairs, gamepad pass-through and per-frame delta
- Clearing bindings and restoring defaults
- The 4-binding-per-action limit
- `onActionPressed` / `onActionReleased` and `IInputCallbacks`
- Default WASD/arrow bindings

---

## Design Decisions

| Decision | Rationale |
|---------|-------------|
| Action-based, not scancode-based | Portable games; runtime remapping without code changes |
| Per-frame `justPressed` / `justReleased` | No manual edge detection in gameplay code |
| Mutable binding table | Runtime remapping in an options menu |
| Event injection API | Tests and alternative backends work without SDL |
| No SDL headers in the public input header | Core stays independent of the windowing backend |
| Fixed arrays indexed by enum | O(1) queries without hashing on the hot path |
| Up to 4 bindings per action | Covers keyboard + gamepad alternatives without unbounded growth |

---

## Dependencies

- **Upstream:** `Caffeine::Core::Types`, `Caffeine::Vec2`,
  `Caffeine::HashMap`, `Caffeine::Vector`, standard `<array>` and `<functional>`
- **Downstream:** [Game Loop](../core/game-loop.md), gameplay systems that query
  actions/axes

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Game Systems]() | Input feeds ECS systems |
| [Concurrency & Runtime]() | Input is processed in the Game Loop |

## References

- [`src/caffeine/input/InputManager.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/input/InputManager.hpp) / [`src/caffeine/input/InputManager.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/input/InputManager.cpp)
- [`tests/test_input.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_input.cpp)
- [`docs/architecture_specs.md`](../architecture_specs.md) — §3 Input System
- [`core/game-loop.md`](../core/game-loop.md) — the host drives `beginFrame()` / `endFrame()`
- [Transversal Topic Index]()
