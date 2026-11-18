# Service registry

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


<p class="doc-lede">Named request/response handlers let one plugin call another, or a host
capability, without linking the two together.</p>

The legacy C++ host provides a **generic service registry**. Plugins register named
handlers; any code (host or other plugins) can call `invokeService`.

This avoids hardcoding feature bridges inside the editor core.

## Architecture

```
┌──────────────┐     registerService      ┌─────────────────┐
│ terrain_plugin│ ──────────────────────► │ PluginService   │
└──────────────┘                          │ Registry        │
                                          └────────┬────────┘
┌──────────────┐     invokeService                │
│ other plugin │ ◄────────────────────────────────┘
└──────────────┘
```

## Well-known services

Defined in `include/caffeine/plugin/PluginServices.hpp`:

### Terrain

| Service | Request | Response |
|---------|---------|----------|
| `terrain.generateUltra` | `TerrainGenerateUltraRequest` | — |
| `terrain.importHeightmap` | `TerrainImportHeightmapRequest` | — |

### Procedural streaming

| Service | Request | Response |
|---------|---------|----------|
| `procedural.installScripts` | — | — |
| `procedural.createStreamingSetup` | `ProceduralStreamingSetupRequest` | `ProceduralSetupResponse` |
| `procedural.loadBenchmark` | `ProceduralLoadBenchmarkRequest` | `ProceduralSetupResponse` |

## Registering a service

```cpp
bool myHandler(void* editorContext, const void* request, std::size_t requestSize,
               void* response, std::size_t responseSize) {
    // parse request, fill response
    return true;
}

void OnLoad() override {
    m_host->registerService(m_host->editorContext, GetName(),
                            "myplugin.export", &myHandler);
}
```

## Invoking a service

```cpp
MyRequest req{};
MyResponse resp{};
m_host->invokeService(m_host->editorContext, "terrain.generateUltra",
                      &req, sizeof(req), &resp, sizeof(resp));
```

## Guidelines for new services

1. Use **dot-separated names**: `vendor.feature.action` (e.g. `acme.navmesh.bake`)
2. Document struct layouts in your plugin README — they are plain C structs, not versioned wire format
3. Return `false` on unknown request size or invalid state
4. Keep handlers fast; offload heavy work to background jobs inside your plugin

## Owner plugins

| Service prefix | Owner |
|----------------|-------|
| `terrain.*` | [terrain-generator](https://github.com/devscafecommunity/doppio-plugins/tree/main/plugins/terrain-generator) |
| `procedural.*` | [procedural-tools](https://github.com/devscafecommunity/doppio-plugins/tree/main/plugins/procedural-tools) |
