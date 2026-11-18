# Writing a plugin

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Como escrever, compilar e instalar um plugin C++/ImGui para o host legado.</p>



<div class="doc-callout doc-callout--warning">
  <p><strong>Host legado.</strong> O Doppio atual em Rust/Iced não carrega plugins C++.
  Estas páginas documentam o SDK de plugins C++/ImGui e o seu host no editor C++ arquivado
  (<code>doppio-archived/</code>). A engine continua a compilar todos os plugins do
  submódulo, para que o SDK se mantenha testado na compilação.</p>
</div>


Os plugins são **bibliotecas partilhadas** que implementam uma C ABI pequena. O host
C++ legado carrega-as com `dlopen` / `LoadLibrary` e chama o teu código através dos
ponteiros de função de `PluginHostApi`. O Doppio atual em Rust não carrega estas
bibliotecas.

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
| `registerPanel` | Painel ImGui dockable / flutuante |
| `registerPanelEx` | Painel com metadados de layout `PluginPanelInfo` (preferido para plugins novos) |
| `openPanel` | Focar um painel já registado |
| `registerMenuAction` | Caminho de menu como `Tools/My Action` |
| `registerComponentDrawer` | UI de Inspector personalizada para um componente ECS |
| `registerEntityPresetManifest` | Adicionar presets de entidade ao menu de criação |
| `registerService` | Expor uma capacidade nomeada a outros plugins |
| `invokeService` | Chamar um serviço do host ou de um plugin pelo nome |
| `getActiveWorld` | World ECS atual no editor |
| `getSelectedEntityId` / `setSelectedEntityId` | Ler ou alterar a seleção da hierarquia |
| `getProjectRootPath` | Raiz do projeto aberto (pai de `scenes/`) |
| `getCurrentScenePath` | Caminho da cena aberta |
| `markSceneDirty` / `markAssetBrowserDirty` | Notificar o host de que o estado mudou |
| `getComponentTypeId` | Resolver nome de componente → type id para drawers |
| `getTerrainBrush` / `setTerrainBrush` | Ler ou editar o pincel de terreno do viewport |
| `logInfo` / `logError` | Saída na consola do editor |

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

- **Output name** = id do plugin (ex.: `terrain_plugin.so` → id `terrain_plugin`)
- **Sem prefixo `lib`** em Unix (`PREFIX ""` no CMake)
- **Não ligues `caffeine-core` nem ImGui** dentro do `.so`. O host exporta esses
  símbolos e o SDK é baseado em callbacks; liga apenas bibliotecas de sistema extra
  (por exemplo `${CMAKE_DL_LIBS}`) quando o plugin precisar.
- Define `CAFFEINE_PLUGIN_EXPORTS=1` (e `CF_HAS_IMGUI=1`) ao compilar o plugin;
  `doppio_add_plugin()` define ambos

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

- [Referência do Plugin SDK](../editor/plugin-sdk.md)
- [Installing plugins](installing-plugins.md)
- [Hello template](https://github.com/devscafecommunity/doppio-plugins/tree/main/templates/hello-plugin)
