# Guia de migração de plugins

Esta página documenta a passagem de plugins dentro da árvore do Doppio para o
repositório autónomo `doppio-plugins` e para o carregamento opt-in.

## O que mudou

| Antes | Agora |
|-------|-------|
| `apps/plugins/<nome>` dentro da engine | `doppio-plugins/plugins/<nome>` (submódulo) |
| Targets CMake `hello_plugin`, `terrain_plugin`, … | `doppio_add_plugin()` no repo de plugins |
| Todos os `.so` descobertos carregados no arranque | Só bibliotecas ativadas no Plugin Manager |
| Core referenciava identificadores de plugins | Core expõe apenas callbacks genéricos do host |
| UI do plugin usava internals do Doppio | UI usa `caffeine/plugin/PluginUI.hpp` + `Caffeine::UIKit` |

## Migrar um plugin

1. **Mover as fontes**

   ```bash
   doppio-plugins/
   └── plugins/
       └── my-plugin/
           ├── CMakeLists.txt
           ├── README.md
           └── src/
               └── main.cpp
   ```

2. **Compilar contra o SDK**

   ```cmake
   include(DoppioPlugin)

   doppio_add_plugin(my_plugin
       OUTPUT_NAME my_plugin
       SOURCES src/main.cpp)
   ```

   Configure com `-DCAFFEINE_ROOT=/caminho/para/caffeine` e
   `-DIMGUI_DIR=/caminho/para/caffeine/build/_deps/imgui-src`.

3. **Usar a API pública**

   ```cpp
   #include "caffeine/plugin/PluginAPI.hpp"
   #include "caffeine/plugin/PluginUI.hpp"
   ```

   Não inclua headers `editor/…`. O audit de coupling falha nesses casos.

4. **Registar UI com `PluginUI.hpp`**

   ```cpp
   Caffeine::Editor::PluginPanelInfo info;
   info.id = "plugin.my.panel";
   info.title = "My Tool";
   info.icon = "settings";
   info.defaultOpen = false;
   info.dock = Caffeine::Editor::PluginDockArea::Right;
   Caffeine::Editor::RegisterPluginPanel(m_host, GetName(), info, &render, this);
   ```

5. **Instalar e ativar**

   Copie a biblioteca compilada para um diretório `plugins/` e ative-a em
   **Plugins → Plugin Manager**. O Doppio guarda a escolha em
   `~/.config/caffeine/plugins.cfg`.

## Versionamento

Mantenha o repositório de plugins e a engine em sincronia. Um plugin compilado
contra uma ABI diferente pode falhar ao carregar ou crashear. O CI deve compilar a
matriz de plugins contra o commit da engine que visa.

## Validação

```bash
python3 scripts/audit_plugin_coupling.py
# errors: 0, warnings: 0, info: 0
```

## Relacionado

- [Plugin Manager](plugin-manager.md)
- [Plugin SDK](plugin-sdk.md)
- [Escrever um plugin](../plugins/writing-a-plugin.md)
