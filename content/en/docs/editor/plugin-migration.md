# Plugin migration guide

This page documents the move from in-tree Doppio plugins to the standalone
`doppio-plugins` repository and the opt-in loader.

## What changed

| Before | After |
|--------|-------|
| `apps/plugins/<name>` inside the engine | `doppio-plugins/plugins/<name>` (submodule) |
| Engine CMake targets `hello_plugin`, `terrain_plugin`, … | `doppio_add_plugin()` in the plugin repo |
| Every discovered `.so` loaded at startup | Only libraries enabled in the Plugin Manager |
| Core referenced plugin identifiers | Core exposes generic host callbacks only |
| Plugin UI used Doppio internals | Plugin UI uses `caffeine/plugin/PluginUI.hpp` + `Caffeine::UIKit` |

## Migrate a plugin

1. **Move the sources**

   ```bash
   doppio-plugins/
   └── plugins/
       └── my-plugin/
           ├── CMakeLists.txt
           ├── README.md
           └── src/
               └── main.cpp
   ```

2. **Build against the SDK**

   ```cmake
   include(DoppioPlugin)

   doppio_add_plugin(my_plugin
       OUTPUT_NAME my_plugin
       SOURCES src/main.cpp)
   ```

   Configure with `-DCAFFEINE_ROOT=/path/to/caffeine` and
   `-DIMGUI_DIR=/path/to/caffeine/build/_deps/imgui-src`.

3. **Use the public API**

   ```cpp
   #include "caffeine/plugin/PluginAPI.hpp"
   #include "caffeine/plugin/PluginUI.hpp"
   ```

   Do not include `editor/…` headers. The coupling audit fails on those.

4. **Register UI with `PluginUI.hpp`**

   ```cpp
   Caffeine::Editor::PluginPanelInfo info;
   info.id = "plugin.my.panel";
   info.title = "My Tool";
   info.icon = "settings";
   info.defaultOpen = false;
   info.dock = Caffeine::Editor::PluginDockArea::Right;
   Caffeine::Editor::RegisterPluginPanel(m_host, GetName(), info, &render, this);
   ```

5. **Install and enable**

   Copy the built library to a `plugins/` directory and enable it in
   **Plugins → Plugin Manager**. Doppio persists the choice in
   `~/.config/caffeine/plugins.cfg`.

## Versioning

Keep the plugin repository and engine in sync. A plugin built against one ABI may
fail to load or crash against another. CI should build the plugin matrix against the
engine commit it targets.

## Validation

```bash
python3 scripts/audit_plugin_coupling.py
# errors: 0, warnings: 0, info: 0
```

## Related

- [Plugin Manager](plugin-manager.md)
- [Plugin SDK](plugin-sdk.md)
- [Writing a plugin](../plugins/writing-a-plugin.md)
