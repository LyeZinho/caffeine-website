# Assets Hot-Reload — Design

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

**Date:** 2026-05-15
**Issue:** #93
**Milestone:**M2 — Visual Editing & Assets
**Namespace:** `Caffeine::Assets`

## Overview

Directory background monitoring `assets/processed/` to detect file changes `.caf` newly compiled by Asset Pipeline and trigger in-place recharges in `AssetManager` — without restarting the engine or losing the state of the scene in the editor.

## Arquitetura

- `[ assets/processed/*.caf ] ←── AssetPipeline escreve .caf atualizado`
- `▼`
- `HotReloader (background thread)`
  - `poll a cada 500ms`
  - `debounce 100ms (configurável)`
  - `detecta timestamp change`
  - `aguarda estabilidade (debounce)`
  - `enfileira path em m_PendingReloads (mutex)`
- `▼`
- `HotReloader::Update() ←── chamado na main thread (ex: EditorContext::Update)`
  - `desenfileira batch sob mutex`
  - `AssetManager::reloadAsset(path)`
    - `reseta LinearAllocator + resolved data`
    - `loadInternal(id) — fopen, BlobLoader, resolveEntry`
    - `retorna assetId`
  - `determina tipo via getResolved<T>()`
  - `NotificationCallback(assetInfo) — editor toast`


## Componentes

### `HotReloader` (class)

| Method | Description |
|--------|-----------|
| `Start(manager, processedDir, debounceMs)` | Inicia thread de polling |
| `Stop()` | Join thread, limpa estado |
| `Update()` | Processa fila de reloads na main thread |
| `SetNotificationCallback(cb)` | Hook for Visual Notification (editor toast) |
| `IsRunning()` | Estado atual |

### `HotReloadedAsset` (struct)

| Campo | Tipo | Description |
|-------|------|-----------|
| `assetId` | `u32` | ID do asset recarregado |
| `name` | `std::string` | File name without extension |
| `type` | `AssetType` | Texture / Audio / Shader |

### `AssetManager::reloadAsset(path)`

Added public method for external reload trigger:

1. Busca `path` em `m_pathIndex` (com `m_basePath` prefixado)
2. Reseta: `allocator.reset()` , `header/metadata/payload = nullptr` , `resolved = {}`
3. Subtrai `sizeBytes` de `m_cachedBytes`
4. Status → `Unloaded`
5. Libera mutex
6. `loadInternal(id)` — reloads the disc, re-solves
7. Retorna `assetId` (ou `~0u` if not found)

## Threading

- **Poll thread** (criada em `Start()` ):
  - Itera `directory_iterator` in the directory processed every 500ms
  - Compara `last_write_time` com snapshot anterior
  - State Machine 3-state: *unmodified → debouncing → ready*
  - Escreve em `m_PendingReloads` sob `m_Mutex`
- **Main thread** (via `Update()` ):
  - Read `m_PendingReloads` sob `m_Mutex` , troca com vetor vazio
  - Executa reload fora do lock
  - Fire notification callback

## Debounce

Three states per monitored file:

1. **Unmodified** ( `debounceStart == -1` ): timestamp stable between polls
2. **First change detected** ( `debounceStart >= 0` ): timestamp mudou, timer inicia
3. **Debounce elapsed** ( `>= debounceMs` no new changes: reload is queued

## Tests

5 tests in `tests/test_assetmanager.cpp` :

| Teste | O que verifica |
|-------|---------------|
| `default state is not running` | `IsRunning() == false` sem `Start()` |
| `Start/Stop lifecycle` | State transitions, idempotence of `Stop()` |
| `Start twice does not crash` | `Start()` → `Start()` → `Stop()` |
| `Update is safe when not running` | `Update()` antes de `Start()` and after `Stop()` |
| `integration reload and callback` | Poll discovers change, `Update()` recarrega, callback dispara |

## Uso no Editor

```cpp
// Inicialização
m_HotReloader.Start(&m_AssetManager, "assets/processed/", 100);
m_HotReloader.SetNotificationCallback([](const HotReloadedAsset& a) {
    EditorToast::Show(ICON_FA_SYNC " {} recarregado", a.name);
});

// A cada frame (main thread)
m_HotReloader.Update();
```
