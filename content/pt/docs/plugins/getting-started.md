# Getting started

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<div class="doc-callout doc-callout--warning">
  <p><strong>Host legado.</strong> O Doppio atual em Rust/Iced não carrega plugins C++.
  Estas páginas documentam o SDK de plugins C++/ImGui e o seu host no editor C++ arquivado
  (<code>doppio-archived/</code>). A engine continua a compilar todos os plugins do
  submódulo, para que o SDK se mantenha testado na compilação.</p>
</div>


<p class="doc-lede">Compila uma biblioteca partilhada a partir do template do
doppio-plugins e instala-a no diretório de plugins do editor C++ legado.</p>

Este guia mostra como compilar e instalar o teu primeiro plugin para o host C++/ImGui
legado.

## Prerequisites

1. **Caffeine Engine** clonada e configurada (o build continua a descarregar ImGui para o SDK)
2. **CMake 3.20+** e um compilador C++20
3. **doppio-plugins** clonado (este repositório)
4. Um **host C++/ImGui legado** que implemente `PluginHostApi`. O editor C++ arquivado
   serve apenas de referência; o Doppio em Rust não carrega plugins.

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

Arranca o teu host C++/ImGui legado.

Abre **Plugins → Plugin Manager** desse host, marca **Enabled** em **Hello Plugin** e
procura o painel **Hello Plugin**. Os plugins nunca são pré-carregados; a lista de
ativação fica em `~/.config/caffeine/plugins.cfg`.

<div class="doc-callout doc-callout--note">
  <p><strong>Nota.</strong> O Doppio atual em Rust não tem plugin manager e não lista a
  biblioteca. Compilar o plugin continua a validar o SDK e os serviços do lado da
  engine.</p>
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
| Plugin not listed | Usa o host C++ legado; o Doppio em Rust não procura plugins. Confirma que o ficheiro está num diretório `plugins/` descoberto e termina em `.so` / `.dll` |
| Plugin listed but disabled | Ativa-o no **Plugins → Plugin Manager** do host legado |
| `CreatePlugin` not found | Build with `CAFFEINE_PLUGIN_EXPORTS=1`; use `doppio_add_plugin()` |
| ImGui headers missing | Set `-DIMGUI_DIR=.../imgui-src` from Caffeine's CMake fetch |
| Crash on load | Mismatched Caffeine version — rebuild plugin against same tree |
| Panel empty | Ensure `CF_HAS_IMGUI=1` at compile time |
