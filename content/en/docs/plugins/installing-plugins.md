# Installing plugins

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


<p class="doc-lede">Where the legacy C++ host looks for plugin libraries, how to install
one and how the opt-in enable list is stored.</p>

The legacy C++ host discovers shared libraries in a few well-known `plugins/`
directories but **loads none of them at startup**. A discovered library is listed in
its Plugin Manager and stays disabled until you enable it. The active Rust Doppio does
not scan these directories.

## Discovery locations

| Scope | Path |
|-------|------|
| Project | `<project-root>/plugins/*.so` (`*.dll` on Windows) |
| Legacy host build | `<caffeine-build>/plugins/*.so` |
| Next to the host binary | `<host-binary-dir>/plugins/*.so` |

Example after a typical Caffeine build:

```
caffeine/build/
└── plugins/
    ├── hello_plugin.so
    ├── terrain_plugin.so
    └── git_plugin.so
```

## Manual install

```bash
cp /path/to/built/my_plugin.so /path/to/caffeine/build/plugins/
```

Restart the legacy host or press **Refresh Directory** in its **Plugins → Plugin
Manager**.

## Enabling and disabling

1. Open **Plugins → Plugin Manager**.
2. Tick **Enabled** next to a library to load it and register its panels, menus,
   drawers and services.
3. Untick it (or press **Unload**) to remove its contributions and unload the
   library.

The enable list is written to `~/.config/caffeine/plugins.cfg`
(`$XDG_CONFIG_HOME/caffeine/plugins.cfg` when set, `%APPDATA%/Caffeine` on Windows).
Each line is a library stem; comments start with `#`.

```
# enabled plugins
terrain_plugin
git_plugin
```

## Distribution

Ship the `.so`/`.dll` files and a short readme. Do not modify the engine tree.
For a team default, distribute a `plugins.cfg` that developers copy into their user
config; each user can still disable plugins locally.

## Compatibility

Plugins are compiled against the public headers in `include/caffeine/plugin/`. Keep
the ABI version aligned with the engine; a plugin built for a different ABI may
fail to load or crash. Use the same compiler and standard library as the C++ host on
Linux.
