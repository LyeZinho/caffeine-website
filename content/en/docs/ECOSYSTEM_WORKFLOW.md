# Unified asset workflow

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Tooling</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caf-pack"><code>caf-pack</code></a></span>
</div>

<p class="doc-lede">From raw PNG, WAV and OBJ files to a <code>.cap</code> the engine
maps into memory: one pipeline shared by Doppio, caf-pack, the runtime and CI.</p>

## Pipeline

```text
raw assets ──► caf-pack ──► .caf / .cap ──► AssetManager ──► renderer / audio / physics
(PNG WAV OBJ)   (process)    (binary)        (async, hot reload)
```

| Stage | Tool | Output |
|---|---|---|
| Author | Any image, audio or DCC tool | `assets/raw/**` |
| Pack | `caf-pack --input <dir> --output <file.cap>` | `.caf` payloads inside a `.cap` |
| Load | `Caffeine::Assets::AssetManager` | Typed handles (`Texture`, `AudioClip`, `Mesh`, `Prefab`, `ShaderBlob`) |
| Use | Renderer, audio, physics, scripting | Resolved structs |

## 1. Raw assets

Keep source files in the project's asset root, normally `assets/raw/`:

```text
assets/raw/
  Textures/brick.png
  Audio/step.wav
  Models/crate.obj
  Materials/brick.mat
```

Doppio creates the standard folders (`Textures`, `Models`, `Materials`, `Audio`,
`Animations`, `Prefabs`, `Sky`) through the asset wizard.

## 2. Pack with caf-pack

```bash
caf-pack --input assets/raw --output build/game.cap --gen-ids build/game_assets.hpp
```

The CLI:

1. scans the input directory recursively;
2. converts PNG to RGBA/CAF, WAV to PCM/CAF and OBJ to interleaved mesh/CAF;
3. aligns each payload to 32 bytes;
4. writes the CAP header, asset table (hash, offset, size) and blobs;
5. optionally generates a C++ header with stable hash ids.

`--compress` enables optional compression (`zstd` is linked by the packer). See the
[caf-pack README](https://github.com/devscafecommunity/caf-pack/blob/main/README.md)
for the formats and the current processor list.

In Doppio, the **Assets → Pack** tab runs the same CLI and writes the `.cap` into the
project. The binary is found via `CAF_PACK`, `CAFFEINE_ENGINE_ROOT`,
`caf-pack/build/src` or `PATH`.

## 3. Load in the engine

`AssetManager` owns the cache and the async jobs:

```cpp
#include "assets/AssetManager.hpp"

Caffeine::Threading::JobSystem jobs;
Caffeine::Assets::AssetManager assets(&jobs, "assets/raw", 256);

auto texture = assets.loadAsync<Caffeine::Assets::Texture>("Textures/brick.caf");
auto mesh    = assets.loadAsync<Caffeine::Assets::Mesh>("Models/crate.caf");

// each frame
assets.tick(frameIndex);

if (texture.isReady()) {
    const auto* data = texture.get();
    // upload or bind data
}

assets.collectGarbage();
```

Key points:

- `loadAsync<T>` / `loadSync<T>` return an `AssetHandle<T>` with a generation counter.
- `tick()` pumps completed jobs and checks hot reload.
- `collectGarbage()` evicts least-recently-used entries when the cache exceeds its
  budget (`maxCacheMB`).
- `reloadAsset(path)` reloads an already-loaded asset from disk.
- `registerInvalidationCallback` notifies systems when an asset changes.

The handle is invalidated if the entry is evicted or reloaded; check `isValid()` /
`isReady()` before dereferencing.

## Project layout

```text
my_game/
  project.caffeine
  assets/raw/          # source assets
  assets/processed/    # optional individual .caf files
  build/game.cap       # final pack
  build/game_assets.hpp
  scenes/
  materials/
  texture_sets/
```

## Runtime and Doppio

- Doppio previews raw assets and packs them; it does not parse `.cap` in Rust.
- The engine `AssetManager` loads `.caf`/`.cap`; the C ABI exposes the same asset
  metadata and paths to the editor.
- The runtime uses the same `AssetManager` and project layout, so a scene saved in
  Doppio points at the same relative paths.

## Related pages

- [CAF format](assets/caf-format.md)
- [Asset manager](assets/asset-manager.md)
- [Asset pipeline](assets/asset-pipeline.md)
- [Cafpack architecture](architecture/cafpack.md)
- [caf-pack README](https://github.com/devscafecommunity/caf-pack/blob/main/README.md)
