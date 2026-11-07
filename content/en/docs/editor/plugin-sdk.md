# Plugin SDK

Doppio is a **lean IDE**. Feature plugins are built from the separate
[doppio-plugins](https://github.com/devscafecommunity/doppio-plugins) repository
(an engine submodule) and load at runtime from a `plugins/` directory.

## Architecture

> ┐
> Doppio (core IDE)
> Scene editor, viewport, hierarchy, inspector, assets 
> │ PluginManager + PluginServiceRegistry (empty at start) │
> NO terrain/procedural/post-process/git IU in core
> └
> │ PluginHostApi (dlopen)
> ┐
> ▼ ▼ ▼
> terrain_plugin procedural_tools_plugin git_plugin
> (owns TerrainBridge) (owns ProceduralBridge) (owns GitRunner)


### Rules

1. **Plugins own their logic** — bridges, panels, services live in `.so` files, not in `doppio` sources.
2. **Core owns ECS + runtime** — `PostProcessComponent` , `TerrainComponent` , procedural systems are engine data/runtime; editor UI for them is plugin territory.
3. **Service registry is generic** — call plugins `registerService` in `OnLoad` ; Doppio never hardcodes feature services.
4. **No in-tree plugin builds** — the engine CMake never builds or copies feature plugins. Build them from `doppio-plugins` against the public SDK.
5. **Opt-in loading** — nothing is preloaded at startup. Discovered libraries stay disabled until the user enables them in **Plugins → Plugin Manager**; the choice is stored in `~/.config/caffeine/plugins.cfg`.

## Install plugins

```bash
# Build the plugin repository against this engine checkout
cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT=/path/to/caffeine \
  -DIMGUI_DIR=/path/to/caffeine/build/_deps/imgui-src
cmake --build doppio-plugins/build -j

# Copy into a discovered directory (project, build or user)
cp doppio-plugins/build/plugins/*.so build/plugins/
```

Then open **Plugins → Plugin Manager** and enable only the plugins you need.

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

See `include/caffeine/plugin/PluginAPI.hpp` :

- `registerPanel` , `registerMenuAction` , `registerComponentDrawer`
- `registerService` / `invokeService`
- `getProjectRootPath` , `getActiveWorld` , `markSceneDirty`

## Services (cross-plugin)

Plugins may expose services for aggregators / stores:

| Service | Owner plugin |
|---------|----------------|
| `terrain.generateUltra` | terrain_plugin |
| `terrain.importHeightmap` | terrain_plugin |
| `procedural.*` | procedural_tools_plugin |

## Inspector drawers

Plugins register component drawers via `registerComponentDrawer` . Doppio Inspector delegates to registered drawers (e.g. Post Process shows plugin UI when plugin is loaded).

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

Build as `SHARED` library with `CAFFEINE_PLUGIN_EXPORTS=1` , output to `plugins/` .
