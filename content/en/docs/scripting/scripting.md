# 📜 Scripting

> **Phase:**6 — The Olympus
> **Namespace:** `Caffeine::Script` 
> ** Status:** 
> **RFs:** RF6.6 (scripting hot-reload), RF4.7 (bindings iniciais)

Lua (`.lua`) stays. Dryad scripts (`.dyd`) and the node canvas are specified in [Dryad and node scripts](../plans/2026-10-19-dryad-node-scripts.md).

---

## Overview

The **Scripting** module exposes Caffeine Engine to a script language so designers and scripts can program game behaviors without writing C++. The system is **opt-in** — purely C++ games do not have overhead scripting.

**State:** The script language is **TBD (To Be Decided)**. The two candidates are:

| Criteria | Lua 5.4 | AngelScript 2.x |
|----------|---------|-----------------|
| Familiarity in industry | High (LÖVE, Roblox, WoW) | Average |
| Performance | Very good (LuaJIT available) | ? Good (compiled) |
| Tipagem | ❌ Dinâmica (erros em runtime) | ✅ Estática (erros na compilação) |
| C++ Integration | Via sol2/toLua | ✅ Nativa, API C++ direta |
| Tamanho do runtime | ✅ ~300KB | 🟡 ~600KB |
| Hot-reload | Chunk reload | 🟡 recompilação necessária |
| **Recommendation** | **✅ Preferida** | Alternativa |

> * *Preliminary decision:**Lua + [sol2](https://github.com/ThePhD/sol2) for automatic binding C++→Lua. The final decision will be taken in Phase 4 (RF4.7).

---

## API Planejada

```cpp
namespace Caffeine::Script {

// ============================================================================
// @brief  Componente ECS que associa um script Lua a uma entidade.
// ============================================================================
struct ScriptComponent {
    Assets::AssetHandle<ScriptAsset> script;  // handle para o ficheiro .lua

    // Funções padrão do ciclo de vida (chamadas pelo ScriptSystem):
    // - onCreate(entity)    chamado uma vez após criação
    // - onUpdate(entity, dt) chamado todo o frame
    // - onDestroy(entity)  chamado antes de destruição
    // - onCollision(entity, other) chamado ao colidir (requer Physics2D)
};

// ============================================================================
// @brief  Asset que representa um script Lua compilado.
// ============================================================================
struct ScriptAsset {
    std::string   sourcePath;   // caminho do .lua no disco
    std::string   source;       // código-fonte carregado
    // Bytecode Lua compilado (se LuaJIT for usado):
    std::vector<u8> bytecode;
};

// ============================================================================
// @brief  VM Lua principal. Um único estado Lua por aplicação.
//
//  Expõe ao Lua:
//  - Entity: criação, destruição, get/set de componentes
//  - Transform: posição, rotação, escala
//  - Input: isKeyDown, getAxis
//  - Events: on(), emit()
//  - Debug: log(), draw()
//
//  Threading: a VM Lua é single-threaded. Scripts rodam no thread principal.
// ============================================================================
class LuaVM {
public:
    bool init();
    void shutdown();

    // Executa um ficheiro .lua e regista as suas funções globais
    bool loadScript(std::string_view path);

    // Hot-reload: recarrega um ficheiro .lua em disco sem reiniciar a VM
    bool reloadScript(std::string_view path);

    // Chama uma função Lua por nome com argumentos arbitrários
    template<typename... Args>
    bool call(std::string_view function, Args&&... args);

    // Acesso ao estado sol2 (para registar bindings customizados)
    sol::state& state() { return m_lua; }

private:
    sol::state m_lua;

    void registerCaffeineBindings();   // regista toda a API da engine
    void registerEntityBindings();
    void registerTransformBindings();
    void registerInputBindings();
    void registerEventBindings();
    void registerDebugBindings();
    void registerMathBindings();
};

// ============================================================================
// @brief  Sistema ECS que executa scripts em entidades com ScriptComponent.
//
//  Por frame:
//  1. Itera todas as entidades com ScriptComponent
//  2. Para cada entidade, chama script.onUpdate(entity, dt)
//  3. Detecta erros Lua e regista via LogSystem (sem crash)
// ============================================================================
class ScriptSystem : public ECS::ISystem {
public:
    explicit ScriptSystem(LuaVM* vm);

    void onInit(ECS::World& world) override;
    void onUpdate(ECS::World& world, f32 dt) override;
    void onShutdown(ECS::World& world) override;

    // Chama onCreate() em todas as entidades com ScriptComponent recém-criadas
    void initNewScripts(ECS::World& world);

private:
    LuaVM* m_vm;

    void callLifecycle(std::string_view fn, ECS::Entity entity, f32 dt = 0.0f);
    void handleLuaError(std::string_view fn, ECS::Entity entity,
                        const sol::error& err);
};

// ============================================================================
// @brief  Watcher de ficheiros de script para hot-reload.
//
//  Em modo editor (CF_EDITOR_MODE), monitoriza a pasta /scripts/.
//  Quando um .lua é modificado, recarrega via LuaVM::reloadScript().
// ============================================================================
class ScriptWatcher {
public:
    void init(LuaVM* vm, std::string_view scriptsDir);
    void shutdown();

    // Chame no loop principal para verificar mudanças
    void poll();

private:
    LuaVM*                                    m_vm = nullptr;
    std::string                               m_dir;
    HashMap<std::string, std::filesystem::file_time_type> m_mtimes;
};

}  // namespace Caffeine::Script
```

---

## Moon Bindings — Exposed API

### Entity & Components

```lua
-- Criar e destruir entidades:
local entity = caffeine.world.create()
caffeine.world.destroy(entity)

-- Adicionar/remover componentes:
caffeine.world.addTransform(entity, { x=100, y=200, rotation=0, scaleX=1, scaleY=1 })
caffeine.world.addSprite(entity, { texture="hero.caf", r=1, g=1, b=1, a=1 })

-- Obter/modificar componentes:
local t = caffeine.world.getTransform(entity)
t.x = t.x + 10
caffeine.world.setTransform(entity, t)
```

### Input

```lua
-- Teclado:
if caffeine.input.isKeyDown("Space") then
    jump()
end

-- Eixos analógicos (gamepad ou teclado mapeado):
local horizontal = caffeine.input.getAxis("Horizontal")   -- -1 a 1
local vertical   = caffeine.input.getAxis("Vertical")

-- Mouse:
local mx, my = caffeine.input.mousePosition()
if caffeine.input.isMouseButtonDown(1) then  -- botão esquerdo
    shoot(mx, my)
end
```

### Eventos

```lua
-- Subscrever evento:
local handle = caffeine.events.on("OnCollision2D", function(entityA, entityB)
    if entityA == hero then
        takeDamage(10)
    end
end)

-- Emitir evento customizado:
caffeine.events.emit("OnPlayerDied", { score = 1500 })

-- Cancelar subscrição:
caffeine.events.off(handle)
```

### Debug

```lua
-- Log:
caffeine.debug.log("Hero position: " .. t.x .. ", " .. t.y)
caffeine.debug.warn("Low HP!")
caffeine.debug.error("Critical failure!")

-- Debug draw:
caffeine.debug.drawCircle(t.x, t.y, 32, 1, 0, 0, 1)  -- x, y, radius, r, g, b, a
caffeine.debug.drawRect(0, 0, 100, 100, 0, 1, 0, 1)
```

### Math

```lua
local v1 = caffeine.math.vec2(10, 20)
local v2 = caffeine.math.vec2(5, 15)
local sum = caffeine.math.add(v1, v2)      -- { x=15, y=35 }
local len = caffeine.math.length(v1)       -- 22.36...
local dir = caffeine.math.normalize(v1)
local dot = caffeine.math.dot(v1, v2)
```

---

## Exemplo Completo: Hero Script

```lua
-- scripts/hero.lua
-- Script de comportamento do herói

local SPEED  = 200.0
local JUMP_V = -400.0

local isGrounded = false

function onCreate(entity)
    caffeine.debug.log("Hero created: " .. entity)
end

function onUpdate(entity, dt)
    local t = caffeine.world.getTransform(entity)
    local rb = caffeine.world.getRigidBody2D(entity)

    -- Movimento horizontal
    local h = caffeine.input.getAxis("Horizontal")
    rb.velocityX = h * SPEED

    -- Pulo
    if caffeine.input.isKeyDown("Space") and isGrounded then
        rb.velocityY = JUMP_V
        isGrounded = false
    end

    -- Flip do sprite
    local sprite = caffeine.world.getSprite(entity)
    if h < 0 then sprite.flipX = true
    elseif h > 0 then sprite.flipX = false
    end
    caffeine.world.setSprite(entity, sprite)
    caffeine.world.setRigidBody2D(entity, rb)
end

function onCollision(entity, other)
    -- Assume que o chão tem o componente "Ground"
    if caffeine.world.hasComponent(other, "Ground") then
        isGrounded = true
    end
end

function onDestroy(entity)
    caffeine.debug.log("Hero destroyed")
end
```

---

## Hot-Reload de Scripts

- `[Editor Mode ativo: CF_EDITOR_MODE=1]`
- `▼`
- `ScriptWatcher::poll() (chamado todo frame)`
- `Detecta mudança em scripts/hero.lua`
- `▼`
- `LuaVM::reloadScript("scripts/hero.lua")`
- `Recarrega o chunk Lua`
- `(globals são substituídos na VM)`
- `▼`
- `Da próxima invocação de onUpdate():`
- `usa o código novo — sem restart`


---

## Security and Sandboxing

By default, Lua scripts have access to **restricted**:

| Permitido | Bloqueado |
|-----------|-----------|
| Todas as APIs `caffeine.*` | `os.*` (sistema de ficheiros/processos) |
| `math.*` , `string.*` , `table.*` | `io.*` (I/O directo) |
| `require` (game modules only) | `load` , `loadstring` (dynamic implementation) |
| `pcall` , `xpcall` (error handling) | `debug.*` (acesso a internals da VM) |

Em modo editor ( `CF_EDITOR_MODE` ), the restrictions of `io.*` podem ser relaxadas para permitir salvar dados de save state.

---

## Acceptance Criteria

- [ ] LuaVM inicializa e executa um script `.lua` simples
- [ ] ScriptComponent can be added to an entity via C++ code or editor
- [ ] `onUpdate(entity, dt)` is called every frame for all entities with ScriptComponent
- [ ] Transform Bindings (get/set position, rotation, scale) work properly
- [ ] Bindings de Input (isKeyDown, getAxis) funcionam correctamente
- Moon errors are captured and logged in without game crash
- [ ] Hot-reload: modificar um `.lua` disk recharges script without restarting application
- [ ] Sandbox: `os.execute()` retorna erro em scripts de jogo

---

## Dependencies

- **Upstream:**
  - [ECS](../ecs/core.md) — `World` , `Entity` , `ISystem` , `ComponentID`
  - [Input](../input/input-system.md) — `InputManager`
  - [Events](../core/events.md) — `EventBus`
  - [Debug Tools] `LogSystem` , `DebugDraw`
  - [Asset Manager](../assets/asset-manager.md) — file loading `.lua`
  - [Scene Editor](scene-editor.md) — script assignment via InspectorPanel
- **Downstream:**
  - — (end user module)

---

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Competition & Runtime]() | Scripting executado no Game Loop |
| [Editor & Debug]() | Scripts assigned via Scene Editor |

## References

- [`docs/fase4/ecs.md`](../ecs/core.md) — ECS World and systems
- [`docs/fase4/events.md`](../core/events.md) — EventBus
- [`docs/fase2/input.md`](../input/input-system.md) — InputManager
- [Transversal Topic Index]()
- [`docs/MASTER.md`](../MASTER.md) — Unified documentation
- [Lua 5.4 Reference Manual](https://www.lua.org/manual/5.4/)
- [sol2 — C++ / Lua binding library](https://github.com/ThePhD/sol2)
- [LuaJIT](https://luajit.org/) — JIT compiler para Lua (performance)
- [AngelScript](https://www.angelcode.com/angelscript/) — alternativa estaticamente tipada
