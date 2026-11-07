# Plugin SDK

Doppio é uma **IDE lean**. Os plugins de funcionalidades são compilados a partir do repositório separado [doppio-plugins](https://github.com/devscafecommunity/doppio-plugins) (submódulo da engine) e carregados em runtime a partir de um diretório `plugins/`.

## Architecture

> ┐
> │ Doppio (core IDE) │
> │ Scene editor, viewport, hierarchy, inspector, assets │
> │ PluginManager + PluginServiceRegistry (empty at start) │
> │ NO terrain/procedural/post-process/git UI in core │
> └
> │ PluginHostApi (dlopen)
> ┐
> ▼ ▼ ▼
> terrain_plugin procedural_tools_plugin git_plugin
> (owns TerrainBridge) (owns ProceduralBridge) (owns GitRunner)


### Rules

1. **Plugins own their logic** — bridges, panels, services live in `.so` files, not in `doppio` sources.
2. **Core owns ECS + runtime** — `PostProcessComponent`, `TerrainComponent`, procedural systems are engine data/runtime; editor UI for them is plugin territory.
3. **Service registry is generic** — plugins call `registerService` in `OnLoad`; Doppio never hardcodes feature services.
4. **Sem build de plugins na árvore** — o CMake da engine nunca compila nem copia plugins de funcionalidades. São compilados a partir de `doppio-plugins` contra o SDK público.
5. **Carregamento opt-in** — nada é pré-carregado no arranque. As bibliotecas descobertas ficam desativadas até o utilizador as ativar em **Plugins → Plugin Manager**; a escolha é guardada em `~/.config/caffeine/plugins.cfg`.

## Install plugins

```bash
# Compilar o repositório de plugins contra esta engine
cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT=/caminho/para/caffeine \
  -DIMGUI_DIR=/caminho/para/caffeine/build/_deps/imgui-src
cmake --build doppio-plugins/build -j

# Copiar para um diretório descoberto (projeto, build ou utilizador)
cp doppio-plugins/build/plugins/*.so build/plugins/
```

Depois abra **Plugins → Plugin Manager** e ative apenas os plugins necessários.

## Plugin catalog (reference)

| Plugin | Purpose |
|--------|---------|
| `hello_plugin` | Minimal SDK example |
| `terrain_plugin` | Ultra-realistic terrain generator (Node.js) |
| `procedural_tools_plugin` | Modular procedural streaming tools |
| `post_processing_plugin` | Post-process effect stack UI |
| `git_plugin` | Optional Git project management |
| `ai_development_plugin` | NPC navigation and behaviour authoring |

## Host API

See `include/caffeine/plugin/PluginAPI.hpp`:

- `registerPanel`, `registerMenuAction`, `registerComponentDrawer`
- `registerService` / `invokeService`
- `getProjectRootPath`, `getActiveWorld`, `markSceneDirty`

## Services (cross-plugin)

Plugins may expose services for aggregators / stores:

| Service | Owner plugin |
|---------|----------------|
| `terrain.generateUltra` | terrain_plugin |
| `terrain.importHeightmap` | terrain_plugin |
| `procedural.*` | procedural_tools_plugin |

## Inspector drawers

Plugins register component drawers via `registerComponentDrawer`. Doppio Inspector delegates to registered drawers (e.g. Post Process shows plugin UI when plugin is loaded).

## Writing a plugin

```cpp
#include "caffeine/plugin/PluginAPI.hpp"

class MyPlugin : public Caffeine::Editor::IPlugin {
    void OnLoad() override {
        m_host->registerPanel(m_host->editorContext, GetName(), "My Panel", &render, this);
    }
    // ...
};

extern "C" CAFFEINE_PLUGIN_API Caffeine::Editor::IPlugin* CreatePlugin(
    const Caffeine::Editor::PluginHostApi* host) {
    return new MyPlugin(host);
}
```

Build as `SHARED` library with `CAFFEINE_PLUGIN_EXPORTS=1`, output to `plugins/`.
