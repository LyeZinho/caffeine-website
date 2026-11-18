# ⌨️ Input System

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Input</code></span>
  <span><strong>Arquivos:</strong> <code>src/caffeine/input/InputManager.hpp</code>, <code>src/caffeine/input/InputManager.cpp</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Uma camada de input baseada em ações, com bindings
remapeáveis de teclado, rato e gamepad, exposta como estado de ações e eixos
por frame sem dependência de SDL em tempo de compilação.</p>

---

## Visão Geral

O Input System abstrai dispositivos (teclado, rato, gamepad) e expõe **ações
nomeadas** em vez de scancodes crus. Isto permite remapear controlos sem alterar
o código de gameplay.

**Filosofia:** o código do jogo nunca pergunta "foi pressionado W?" — pergunta
"foi ativada a ação `MoveUp`?". As bindings mapeiam W → `MoveUp`, mas o jogador
pode reconfigurá-las.

O header **não tem dependência de SDL3**. A aplicação anfitriã traduz eventos
SDL em chamadas `injectKeyDown()` / `injectKeyUp()` /
`injectMouseButtonDown()` / `injectGamepadAxis()`; os testes alimentam a mesma
API de injeção diretamente.

---

## Arquitetura

- Pump de eventos do host (SDL ou outro backend)
- `InputManager.beginFrame()` — guarda o estado raw e de ações para o novo frame
- O host injeta eventos (`injectKey*`, `injectMouse*`, `injectGamepad*`)
- `InputManager.endFrame()` — avalia as bindings, atualiza `ActionState`
  (`pressed` / `justPressed` / `justReleased`) e dispara callbacks
- Os sistemas de jogo consultam `actionState()` / `axisState()` durante o update

`beginFrame()` não faz polling de eventos e `endFrame()` não os injeta; essa
fronteira pertence ao host. Chame `beginFrame()` antes de injetar os eventos do
frame e `endFrame()` depois de todos terem sido injetados.

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

// Valores compatíveis com SDL; nenhum header SDL é incluído.
enum class Key : u16 { /* A–Z, dígitos, setas, Space, Escape, modificadores, ... */ };
enum class MouseButton : u8 { Left = 1, Middle, Right, X1, X2, Count };
enum class GamepadButton : u8 { A = 0, B, X, Y, /* ... */ Count };
enum class GamepadAxis : u8 { LeftX = 0, LeftY, RightX, RightY, TriggerLeft, TriggerRight, Count };

struct ActionState {
    bool pressed      = false;   // mantido enquanto alguma binding estiver ativa
    bool justPressed  = false;   // true apenas no primeiro frame
    bool justReleased = false;   // true apenas no frame da libertação
};

struct AxisState {
    f32 value = 0.0f;  // -1.0 .. +1.0
    f32 delta = 0.0f;  // mudança desde o frame anterior
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

    // --- Ciclo de frame (chamado pelo host/GameLoop) ---
    void beginFrame();
    void endFrame();

    // --- Injeção de eventos (testável sem SDL3) ---
    void injectKeyDown(Key key);
    void injectKeyUp(Key key);
    void injectMouseButtonDown(MouseButton button);
    void injectMouseButtonUp(MouseButton button);
    void injectMouseMove(f32 x, f32 y);
    void injectGamepadButtonDown(GamepadButton button);
    void injectGamepadButtonUp(GamepadButton button);
    void injectGamepadAxis(GamepadAxis axis, f32 value);

    // --- Consulta de estado ---
    ActionState actionState(Action action) const;
    AxisState   axisState(Axis axis) const;
    bool        isKeyDown(Key key) const;
    bool        isMouseButtonDown(MouseButton button) const;
    Vec2        mousePosition() const;
    Vec2        mouseDelta() const;

    // --- Gestão de bindings ---
    void bind(Action action, Binding binding);          // adiciona até 4 bindings
    void clearBindings(Action action);
    void clearAllBindings();
    void resetToDefaults();

    // --- Binding de eixo: uma binding negativa e uma positiva ---
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

> Não existem `Action::None`, `CUSTOM_START`, o acessor
> `justPressed(Action)`, o helper `axisValue()` nem modo de rato relativo no
> header atual. Use `actionState(action).justPressed` e
> `axisState(axis).value`.

---

## Bindings por Omissão

`InputManager::resetToDefaults()` instala:

| Ação | Teclado |
|------|---------|
| MoveUp | W / ↑ |
| MoveDown | S / ↓ |
| MoveLeft | A / ← |
| MoveRight | D / → |
| Jump | Space |
| Pause | Esc |

Eixos:

| Eixo | Negativo | Positivo |
|------|----------|----------|
| MoveX | A | D |
| MoveY | S | W |
| LookX | Right stick X | Right stick X |
| LookY | Right stick Y | Right stick Y |

`Attack` e `Interact` não têm binding por omissão. Os botões de face do gamepad
também não estão ligados a ações por omissão; faça o binding explicitamente.

---

## Exemplos de Uso

### Ligar ações e eixos

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

### Ciclo de frame

```cpp
input.beginFrame();

// O host traduz eventos SDL em chamadas de injeção:
input.injectKeyDown(Caffeine::Input::Key::W);
input.injectMouseMove(mouseX, mouseY);

input.endFrame();  // avalia bindings e dispara callbacks
```

### Ler input num sistema

```cpp
const Caffeine::Input::ActionState jump =
    input.actionState(Caffeine::Input::Action::Jump);

if (jump.justPressed) {
    velocity.y = jumpForce;
}

const Caffeine::Input::AxisState moveX =
    input.axisState(Caffeine::Input::Axis::MoveX);
velocity.x = moveX.value * moveSpeed;

// Mouse look: acumule o delta de cada frame.
const Caffeine::Vec2 look = input.mouseDelta();
yaw   += look.x * sensitivity;
pitch += look.y * sensitivity;
```

### Reagir a ações

```cpp
input.onActionPressed = [](Caffeine::Input::Action action) {
    if (action == Caffeine::Input::Action::Pause) {
        togglePause();
    }
};
```

Código de jogo que precise de mapeamentos por entidade pode definir o seu
próprio componente com valores `Action` / `Axis`; a engine não fornece um
componente `PlayerInput`.

---

## Testes

`tests/test_input.cpp` (34 casos) cobre:
- Transições de `justPressed` / `justReleased` entre frames
- Múltiplas bindings numa ação
- Bindings de botão do rato e do gamepad
- Posição e delta do rato
- Pares negativo/positivo de eixos, pass-through de gamepad e delta por frame
- Limpar bindings e restaurar defaults
- Limite de 4 bindings por ação
- `onActionPressed` / `onActionReleased` e `IInputCallbacks`
- Bindings WASD/setas por omissão

---

## Decisões de Design

| Decisão | Justificativa |
|---------|-------------|
| Baseado em ações, não em scancodes | Jogos portáveis; remapping em runtime sem alterar código |
| `justPressed` / `justReleased` por frame | Sem deteção manual de transições no gameplay |
| Tabela de bindings mutável | Remapping em runtime num menu de opções |
| API de injeção de eventos | Testes e backends alternativos funcionam sem SDL |
| Sem headers SDL no header público de input | O core mantém-se independente do backend de janela |
| Arrays fixos indexados por enum | Consultas O(1) sem hashing no hot path |
| Até 4 bindings por ação | Cobre alternativas de teclado + gamepad sem crescimento ilimitado |

---

## Dependências

- **Upstream:** `Caffeine::Core::Types`, `Caffeine::Vec2`,
  `Caffeine::HashMap`, `Caffeine::Vector`, `<array>` e `<functional>` da
  biblioteca padrão
- **Downstream:** [Game Loop](../core/game-loop.md), sistemas de gameplay que
  consultam ações/eixos

---

## 🔗 Tópicos Relacionados

| Tópico | Descrição |
|--------|-----------|
| [Sistemas de Jogo]() | Input alimenta sistemas ECS |
| [Concorrência & Runtime]() | Input é processado no Game Loop |

## Referências

- [`src/caffeine/input/InputManager.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/input/InputManager.hpp) / [`src/caffeine/input/InputManager.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/input/InputManager.cpp)
- [`tests/test_input.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_input.cpp)
- [`docs/architecture_specs.md`](../architecture_specs.md) — §3 Input System
- [`core/game-loop.md`](../core/game-loop.md) — o host chama `beginFrame()` / `endFrame()`
- [Índice de Tópicos Transversais]()
