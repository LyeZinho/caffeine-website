# Getting started

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


<p class="doc-lede">Build one shared library from the doppio-plugins template and install it
into the legacy C++ editor's plugin directory.</p>

This guide walks through building and installing your first plugin for the legacy
C++/ImGui host.

## Prerequisites

1. **Caffeine Engine** cloned and configured (the build still fetches ImGui for the SDK)
2. **CMake 3.20+** and a C++20 compiler
3. **doppio-plugins** cloned (this repository)
4. A **legacy C++/ImGui host** that implements `PluginHostApi`. The archived C++
   editor is reference only; the Rust Doppio does not load plugins.

## Build the hello template

```bash
export CAFFEINE_ROOT=/path/to/caffeine
export IMGUI_DIR=$CAFFEINE_ROOT/build/_deps/imgui-src

cd doppio-plugins
cmake -B build -DCAFFEINE_ROOT=$CAFFEINE_ROOT -DIMGUI_DIR=$IMGUI_DIR
cmake --build build
```

Output: `build/plugins/hello_plugin.so` (Linux) or `hello_plugin.dll` (Windows).

## Install

Copy the library into a discovered plugin directory:

```bash
mkdir -p $CAFFEINE_ROOT/build/plugins
cp build/plugins/hello_plugin.so $CAFFEINE_ROOT/build/plugins/
```

Launch the legacy C++ host you built from `doppio-archived/`.

Open its **Plugins → Plugin Manager**, tick **Enabled** for **Hello Plugin**, then
find the **Hello Plugin** panel. Plugins are never preloaded; the enable list is
stored in `~/.config/caffeine/plugins.cfg`.

<div class="doc-callout doc-callout--note">
  <p><strong>Note.</strong> The active Rust Doppio has no plugin manager and will not
  list the library. Building the plugin still verifies the SDK and the engine-side
  services.</p>
</div>

## Create your own plugin

```bash
cp -r templates/hello-plugin plugins/my-plugin
# edit plugins/my-plugin/src/main.cpp
# add add_subdirectory(plugins/my-plugin) to the doppio-plugins CMakeLists.txt
cmake --build build
```

See [writing-a-plugin.md](writing-a-plugin.md) for API details.

## Official plugins

All official plugins ship with **source code** under `plugins/`:

```bash
cmake -B build -DCAFFEINE_ROOT=$CAFFEINE_ROOT -DIMGUI_DIR=$IMGUI_DIR \
  -DDOPPIO_PLUGINS_BUILD_TEMPLATE=OFF
cmake --build build
cp build/plugins/*.so $CAFFEINE_ROOT/build/plugins/
```

See the [plugin catalog](README.md) for per-plugin details.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Plugin not listed | Use the legacy C++ host; the Rust Doppio does not scan plugins. Check the file is in a discovered `plugins/` directory and ends in `.so` / `.dll` |
| Plugin listed but disabled | Enable it in the legacy host's **Plugins → Plugin Manager** |
| `CreatePlugin` not found | Build with `CAFFEINE_PLUGIN_EXPORTS=1`; use `doppio_add_plugin()` |
| ImGui headers missing | Set `-DIMGUI_DIR=.../imgui-src` from Caffeine's CMake fetch |
| Crash on load | Mismatched Caffeine version — rebuild plugin against same tree |
| Panel empty | Ensure `CF_HAS_IMGUI=1` at compile time |
