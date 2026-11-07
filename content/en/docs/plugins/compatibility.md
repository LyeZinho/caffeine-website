# Plugin compatibility

Plugins are native shared libraries. Compatibility depends on the engine ABI, the
public SDK headers and the build toolchain.

## Matrix

| Engine | Plugin SDK | `caffeine/plugin/` | Notes |
|--------|------------|--------------------|-------|
| `main` | `doppio-plugins/main` | stable | Recommended pairing |
| Older engine | Newer plugin | may break | Rebuild against the engine |
| Newer engine | Older plugin | may break | Rebuild against the engine |

There is no binary compatibility guarantee across engine releases. Always rebuild
plugins when updating the engine.

## Required build flags

| Flag | Why |
|------|-----|
| `CF_HAS_IMGUI=1` | Plugin panels use the editor's ImGui context |
| `CAFFEINE_PLUGIN_EXPORTS=1` | Exports `CreatePlugin` / `DestroyPlugin` |
| `CAFFEINE_SOURCE_DIR=<engine>` | Paths used by terrain/tooling bridges |

`doppio_add_plugin()` sets these automatically.

## Platform notes

| Platform | Library | Notes |
|----------|---------|-------|
| Linux | `.so` | Use the same compiler and standard library as Doppio |
| Windows | `.dll` | Must match the MSVC runtime (`/MD` vs `/MT`) |
| macOS | `.dylib` | Not a primary target yet |

## Symbols

Doppio loads plugins with `dlopen` / `LoadLibrary` and resolves:

- `CreatePlugin(const PluginHostApi*)`
- `DestroyPlugin(IPlugin*)`

Both must be exported with C linkage.

## Runtime dependencies

A plugin may depend on engine runtime libraries already loaded by Doppio. It should
not bundle its own copy of ImGui or the engine. Build against the same headers.

## Troubleshooting

| Symptom | Cause |
|---------|-------|
| `missing exports` | Missing `extern "C"` or not built as a shared library |
| `dlopen failed` | Missing dependency, wrong architecture or ABI |
| Crash during `OnLoad` | Header/ABI mismatch or null host callback |
| Panel renders empty | Built without `CF_HAS_IMGUI=1` |
| Component drawer missing | Plugin disabled or `getComponentTypeId` returned invalid |

## Related

- [Installing plugins](../plugins/installing-plugins.md)
- [Plugin Manager](../editor/plugin-manager.md)
- [Writing a plugin](../plugins/writing-a-plugin.md)
