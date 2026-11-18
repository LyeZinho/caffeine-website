# Plugin SDK (legacy C++)

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">The C++/ImGui plugin ABI, host services and panel registration used by the legacy host.</p>

<div class="doc-callout doc-callout--warning">
  <p><strong>Legacy host.</strong> The active Rust/Iced Doppio does not load C++ plugins.
  These pages document the C++/ImGui plugin SDK and its host in
  <code>caffeine-runtime</code> / <code>doppio-archived</code>. The engine still builds
  every plugin from the submodule so the SDK stays compile-tested.</p>
</div>


The plugin SDK targets the **C++/ImGui host** in `caffeine-runtime` / the archived C++ Doppio. The active Rust/Iced Doppio does not load these libraries. Sources live in the separate
[doppio-plugins](https://github.com/devscafecommunity/doppio-plugins) submodule.

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
4. **Plugins live in the submodule** — the engine CMake builds every plugin from `doppio-plugins` into `build/plugins`, but the sources never live in the engine tree. Set `CAFFEINE_BUILD_DOPPIO_PLUGINS=OFF` for a plugin-free build.
5. **Opt-in loading** — nothing is preloaded at startup. Discovered libraries stay disabled until the user enables them in **Plugins → Plugin Manager**; the choice is stored in `~/.config/caffeine/plugins.cfg`.

## Install plugins

The normal engine configure already builds the submodule plugins into
`build/plugins`:

```bash
./scripts/submodules.sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

To build the plugin repository against another engine checkout, point it at the SDK:

```bash
cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT=/path/to/caffeine \
  -DIMGUI_DIR=/path/to/caffeine/build/_deps/imgui-src
cmake --build doppio-plugins/build -j
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
