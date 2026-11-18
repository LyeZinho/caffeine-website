# Writing a plugin

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<div class="doc-callout doc-callout--warning">
  <p><strong>Legacy host.</strong> The active Rust/Iced Doppio does not load C++ plugins.
  These pages document the C++/ImGui plugin SDK and its host in the archived C++ editor
  (<code>doppio-archived/</code>). The engine still builds every plugin from the submodule
  so the SDK stays compile-tested.</p>
</div>


<p class="doc-lede">The C ABI, lifecycle and host callbacks a plugin implements for the
legacy C++/ImGui editor.</p>

Plugins are **shared libraries** that implement a small C ABI. The legacy C++ host
loads them with `dlopen` / `LoadLibrary` and calls into your code through
`PluginHostApi` function pointers. The active Rust Doppio does not load these
libraries.

## Minimal plugin

```cpp
#include "caffeine/plugin/PluginAPI.hpp"

class MyPlugin : public Caffeine::Editor::IPlugin {
public:
    explicit MyPlugin(const Caffeine::Editor::PluginHostApi* host) : m_host(host) {}

    void OnLoad() override {
        m_host->registerPanel(m_host->editorContext, GetName(), "My Panel",
                              &MyPlugin::render, this);
    }
    void OnUnload() override {}
    void OnUpdate(float) override {}
    const char* GetName() const override { return "My Plugin"; }
    const char* GetVersion() const override { return "1.0.0"; }

private:
    static void render(void* self) { /* ImGui here */ }
    const Caffeine::Editor::PluginHostApi* m_host;
};

extern "C" Caffeine::Editor::IPlugin* CreatePlugin(
    const Caffeine::Editor::PluginHostApi* host) {
    return new MyPlugin(host);
}

extern "C" void DestroyPlugin(Caffeine::Editor::IPlugin* p) { delete p; }
```

## Lifecycle

| Phase | Method | Purpose |
|-------|--------|---------|
| Load | `CreatePlugin(host)` | Host constructs your plugin; `host->pluginId` is set |
| Init | `OnLoad()` | Register panels, menus, drawers, services |
| Frame | `OnUpdate(dt)` | Optional per-frame logic |
| Unload | `OnUnload()` | Release plugin-owned resources |
| Destroy | `DestroyPlugin(ptr)` | Host unloads library |

## Host API surface

Defined in `include/caffeine/plugin/PluginAPI.hpp`:

| Callback | Use |
|----------|-----|
| `registerPanel` | ImGui dockable / floating panel |
| `registerPanelEx` | Panel with `PluginPanelInfo` layout metadata (preferred for new plugins) |
| `openPanel` | Focus an already registered panel |
| `registerMenuAction` | Menu path like `Tools/My Action` |
| `registerComponentDrawer` | Custom Inspector UI for an ECS component |
| `registerEntityPresetManifest` | Add entity presets to the create menu |
| `registerService` | Expose a named capability to other plugins |
| `invokeService` | Call a host or plugin service by name |
| `getActiveWorld` | Current ECS world in the editor |
| `getSelectedEntityId` / `setSelectedEntityId` | Read or change the hierarchy selection |
| `getProjectRootPath` | Open project root (parent of `scenes/`) |
| `getCurrentScenePath` | Path of the open scene |
| `markSceneDirty` / `markAssetBrowserDirty` | Notify the host that state changed |
| `getComponentTypeId` | Resolve component name → type id for drawers |
| `getTerrainBrush` / `setTerrainBrush` | Read or edit the viewport terrain brush |
| `logInfo` / `logError` | Editor console output |

## Component drawers

```cpp
const auto typeId = m_host->getComponentTypeId(m_host->editorContext, "PostProcess");
m_host->registerComponentDrawer(m_host->editorContext, GetName(), typeId,
                                &drawPostProcess, this);
```

The draw function receives a pointer to the component's storage in the active archetype.

## Services

Well-known service names live in `PluginServices.hpp`:

- `terrain.generateUltra`
- `terrain.importHeightmap`
- `procedural.installScripts`
- `procedural.createStreamingSetup`
- `procedural.loadBenchmark`

Plugins can register additional services for aggregators or tooling. See [service-registry.md](service-registry.md).

## Build rules

- **Output name** = plugin id (e.g. `terrain_plugin.so` → id `terrain_plugin`)
- **No `lib` prefix** on Unix (`PREFIX ""` in CMake)
- **Do not link `caffeine-core` or ImGui** into the `.so`. The host exports those symbols
  and the SDK is callback-based; link extra system libraries (for example CMake's
  `${CMAKE_DL_LIBS}`) only when your plugin needs them.
- Define `CAFFEINE_PLUGIN_EXPORTS=1` (and `CF_HAS_IMGUI=1`) when building the plugin;
  `doppio_add_plugin()` sets both

Use `cmake/DoppioPlugin.cmake`:

```cmake
doppio_add_plugin(my_plugin OUTPUT_NAME my_plugin SOURCES src/main.cpp)
```

## SDK-only vs engine-coupled plugins

| Style | Headers | Best for |
|-------|---------|----------|
| SDK-only | `caffeine/plugin/*.hpp` + ImGui | Panels, menus, lightweight tools |
| Engine-coupled | `doppio-archived/src/doppio/editor/`, `src/caffeine/ecs/` | Terrain, post-process, deep Inspector integration |

Engine-coupled plugins must be rebuilt when Caffeine internals change. Prefer services and the public SDK when possible.

## Further reading

- [Plugin SDK reference](../editor/plugin-sdk.md)
- [Installing plugins](installing-plugins.md)
- [Hello template](https://github.com/devscafecommunity/doppio-plugins/tree/main/templates/hello-plugin)
