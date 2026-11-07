# Plugin Manager and opt-in loading

Doppio ships **without** bundled feature plugins. The editor core does not build,
copy or preload terrain, procedural, Git, post-processing or AI plugins. It only
provides the plugin host (`PluginManager` + `PluginServiceRegistry`).

## Where plugins live

Plugin sources are maintained in the separate
[doppio-plugins](https://github.com/devscafecommunity/doppio-plugins) repository and
added to the engine as a git submodule:

```bash
./scripts/submodules.sh
```

Build them against the engine SDK:

```bash
cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT=/path/to/caffeine \
  -DIMGUI_DIR=/path/to/caffeine/build/_deps/imgui-src
cmake --build doppio-plugins/build
```

Artifacts land in `doppio-plugins/build/plugins/*.so`.

## Install

Copy the libraries into any discovered plugin directory:

| Scope | Directory |
|-------|-----------|
| Project | `<project>/plugins/` |
| Doppio build | `<caffeine>/build/plugins/` |
| Next to the binary | `<doppio-dir>/plugins/` |

## Enable only what you need

Open **Plugins → Plugin Manager**. Discovered libraries start **disabled**:

- Toggling **Enabled** loads the shared library immediately and calls `OnLoad()`.
- Unloading removes its panels, menu actions, component drawers and services.
- The choice is persisted in `~/.config/caffeine/plugins.cfg` (or
  `$XDG_CONFIG_HOME/caffeine/plugins.cfg`).

Nothing is loaded at startup unless it appears in that enable list. A library that
is copied into the folder later stays disabled until you enable it.

## Why this matters

| Before | Now |
|--------|-----|
| Plugins built inside the engine CMake | Built from `doppio-plugins` against the public SDK |
| Every `.so` loaded on startup | Only user-enabled plugins load |
| Core referenced plugin identifiers | Core exposes generic host services only |
| Plugin UI coupled to Doppio internals | Plugin UI uses `Caffeine::UIKit` and opaque host callbacks |

## Troubleshooting

- **Plugin is listed but does not load:** check the status column for the
  `dlopen` error. On Linux the plugin must be built with the same compiler ABI as
  Doppio.
- **Panel disappeared after disabling:** unloading intentionally removes all of the
  plugin's contributions. Re-enable it to register them again.
- **Want a plugin enabled by default for a team:** ship a `plugins.cfg` in the
  project documentation and have developers copy it to their user config; the
  format is one library stem per line.
