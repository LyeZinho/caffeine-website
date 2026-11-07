# Plugins

Doppio editor extensions are **shared libraries** built against the public
`caffeine/plugin/` SDK. They live in the separate
[doppio-plugins](https://github.com/devscafecommunity/doppio-plugins) repository,
which is pinned as an engine submodule.

Doppio does not build or preload them. Install the libraries in a plugin directory
and enable the ones you need from **Plugins → Plugin Manager**.

## Catalog

| Plugin | Binary | What it adds |
|--------|--------|--------------|
| Hello | `hello_plugin` | Minimal SDK example: panel and menu action |
| Terrain Generator | `terrain_plugin` | Ultra-realistic terrain, heightmap import, terrain editor panel |
| Procedural Tools | `procedural_tools_plugin` | Streaming worlds, benchmarks, procedural director |
| Post Processing | `post_processing_plugin` | Post-process stack UI and camera helpers |
| Git | `git_plugin` | Project Git status, history and commit actions |
| AI Development | `ai_development_plugin` | Nav volumes, nav agents and behaviour templates |

## Pages

| Page | Contents |
|------|----------|
| [Getting started](getting-started.md) | Build the hello template and install it |
| [Installing plugins](installing-plugins.md) | Discovery paths, enable list, distribution |
| [Writing a plugin](writing-a-plugin.md) | C ABI, `IPlugin` lifecycle, host API |
| [Service registry](service-registry.md) | Cross-plugin services such as terrain and procedural |
| [Plugin Manager](../editor/plugin-manager.md) | Opt-in loading and troubleshooting |

## Quick build

```bash
git submodule update --init doppio-plugins

cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT="$PWD" \
  -DIMGUI_DIR="$PWD/build/_deps/imgui-src"
cmake --build doppio-plugins/build -j

cp doppio-plugins/build/plugins/*.so build/plugins/
```

Then start Doppio and enable the plugin in the Plugin Manager.
