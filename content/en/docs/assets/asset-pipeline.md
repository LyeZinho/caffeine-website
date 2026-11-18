# Asset Pipeline

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span><strong>Namespace:</strong> `Caffeine::Tools`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/tools/AssetPipeline.hpp"><code>tools/AssetPipeline.hpp</code></a></span>
</div>

<p class="doc-lede">The <code>caf-encode</code> command line tool and the encoders that turn
PNG, WAV, OBJ and glTF sources into <code>.caf</code> files, including the batch manifest.</p>

---

## Overview

The **Asset Pipeline** is the command line tool (CLI) that converts source assets (PNG, WAV,
OBJ, glTF) into the engine's binary `.caf` format.

The pipeline runs **outside the runtime** — before the game, during the build. It can be
invoked from CMake as a build step.

```mermaid
flowchart TD
  assets_raw_["assets/raw/"] --> __caf_encode_CLI_____________assets_["[ caf-encode CLI ]     →     assets/"]
```

<div class="doc-callout doc-callout--note">
  <p><strong>Status.</strong> CMake labels <code>caf-encode</code> as legacy and points new
  pipelines at the <code>caf-pack</code> CLI (<code>.caf</code> / <code>.cap</code> packs). The
  encoders below remain the reference for the engine-internal format and are still built.</p>
</div>

---

## API

The tool headers live in `src/caffeine/tools/` (`TextureEncoder.hpp`, `AudioEncoder.hpp`,
`MeshEncoder.hpp`, `AssetPipeline.hpp`, `AssetManifest.hpp`).

```cpp
namespace Caffeine::Tools {

struct ConversionResult {
    bool        success = false;
    std::string errorMessage;
    u64         inputBytes  = 0;
    u64         outputBytes = 0;
    f32         compressionRatio = 0.0f;  // outputBytes / inputBytes
};

struct TextureEncodeOptions {
    enum class Format { RGBA8, RGB8, BC1, BC3, BC7 } format = Format::RGBA8;
    bool generateMipmaps = true;
    u32  maxMipLevels    = 0;    // 0 = automatic (log2 of the largest dimension)
    bool premultiplyAlpha = false;
    bool flipVertically   = false;
};

struct AudioEncodeOptions {
    enum class Format { PCM16, OGG_VORBIS } format = Format::PCM16;
    u32  targetSampleRate = 44100;
    bool mono             = false;
    f32  normalizeGain    = 0.0f;
};

struct MeshEncodeOptions {
    bool optimizeVertexCache = true;
    bool generateTangents    = true;
    bool compressVertices    = false;
    f32  lodReductionRatio   = 0.0f;
};

class TextureEncoder {
public:
    ConversionResult encode(std::string_view inputPath, std::string_view outputPath,
                            const TextureEncodeOptions& opts = {});
    static ConversionResult encodeRaw(std::string_view outputPath, const u8* pixels,
                                      u32 width, u32 height, u32 channels,
                                      const TextureEncodeOptions& opts = {});
};

class AudioEncoder {
public:
    ConversionResult encode(std::string_view inputPath, std::string_view outputPath,
                            const AudioEncodeOptions& opts = {});
    ConversionResult encodeWav(std::string_view inputPath, std::string_view outputPath,
                               const AudioEncodeOptions& opts = {});
    static ConversionResult encodeRaw(std::string_view outputPath, const i16* samples,
                                      u32 sampleCount, u32 sampleRate, u16 channels,
                                      const AudioEncodeOptions& opts = {});
};

class MeshEncoder {
public:
    ConversionResult encode(std::string_view inputPath, std::string_view outputPath,
                            const MeshEncodeOptions& opts = {});
    ConversionResult encodeObj(std::string_view inputPath, std::string_view outputPath,
                               const MeshEncodeOptions& opts = {});
    ConversionResult encodeGltf(std::string_view inputPath, std::string_view outputPath,
                                const MeshEncodeOptions& opts = {});
};

struct AssetManifestEntry {
    std::string         id;       // logical name (no extension)
    std::string         path;     // relative to the output directory
    Assets::AssetType   type;
    u64                 sizeBytes = 0;
    u32                 crc32     = 0;
};

class AssetManifest {
public:
    bool load(std::string_view manifestPath);
    bool save(std::string_view manifestPath) const;

    void addEntry(AssetManifestEntry entry);
    void removeEntry(std::string_view id);

    const AssetManifestEntry* find(std::string_view id) const;
    const std::vector<AssetManifestEntry>& entries() const;
    usize entryCount() const;
};

class AssetPipeline {
public:
    struct BatchOptions {
        std::string inputDir;
        std::string outputDir;
        std::string manifestPath;   // empty = no manifest
        bool        forceRebuild    = false;
        bool        verbose         = false;
        u32         threadCount     = 4;
    };

    struct BatchReport {
        u32 converted = 0;
        u32 skipped   = 0;   // no changes (same CRC/timestamp)
        u32 errors    = 0;
        std::vector<std::string> errorMessages;
        f64 totalTimeSeconds = 0.0;
        u64 totalInputBytes  = 0;
        u64 totalOutputBytes = 0;
    };

    BatchReport run(const BatchOptions& opts);
};

}  // namespace Caffeine::Tools
```

`threadCount` is accepted but the batch loop currently converts serially.

---

## CLI: caf-encode

```bash
# Single texture (needs pixels: see encodeRaw below):
caf-encode texture hero.png assets/sprites/hero.caf --mipmaps

# Audio:
caf-encode audio bgm.wav assets/audio/bgm.caf

# Mesh (OBJ / glTF / GLB):
caf-encode mesh level01.gltf assets/meshes/level01.caf

# Whole folder (incremental):
caf-encode batch ./raw/ ./assets/ --manifest assets/manifest.json --jobs 8

# Rebuild everything:
caf-encode batch ./raw/ ./assets/ --force-rebuild

# Verbose log:
caf-encode batch ./raw/ ./assets/ --verbose
```

`caf-encode --help` prints the accepted options for the build you have. Texture conversion
takes `--mipmaps` / `--no-mipmaps`; batch conversion takes `--manifest`, `--force-rebuild`,
`--jobs` and `--verbose`.

<div class="doc-callout doc-callout--warning">
  <p><strong>Texture encoding is currently stubbed.</strong>
  <code>TextureEncoder::encode(inputPath, …)</code> returns “stb_image not linked - file-based
  encoding unavailable”; only <code>TextureEncoder::encodeRaw(...)</code>, which takes decoded
  pixels, writes a texture. Audio (WAV) and mesh (OBJ/glTF) file encoding do work.</p>
</div>

---

## Directory structure

- `project/`
  - `raw/ ← original assets (not shipped)`
    - `sprites/`
      - `hero.png`
      - `enemy.png`
    - `audio/`
      - `bgm.wav`
      - `jump.wav`
    - `meshes/`
      - `level01.gltf`
      - `level01_textures/diffuse.png`
  - `assets/ ← converted assets (shipped)`
    - `sprites/hero.caf ← RGBA8 + mipmaps`
    - `audio/bgm.caf ← PCM16`
    - `meshes/level01.caf ← Mesh3D + materials + embedded textures`
    - `manifest.json ← asset index`
  - `build.sh / CMakeLists ← runs caf-encode batch before linking`


---

## Format .caf — header

```cpp
// 32-byte header (full specification in assets/caf-format.md):
struct CafHeader {
    u32       magic;         // 0xCAFECAFE
    u16       versionMajor;  // 1
    u16       versionMinor;  // 0
    AssetType type;          // Texture=0, Audio=1, Mesh=2, ...
    u16       flags;         // COMPRESSED=0x01, MIPCHAIN=0x08, ...
    u32       crc32;         // CRC32 of the payload
    u64       metadataSize;  // bytes of metadata
    u64       dataSize;      // bytes of payload
};
```

For the full format specification, see [`assets/caf-format.md`](caf-format.md).

---

## Integration with the build (CMake)

```cmake
# CMakeLists.txt — run the pipeline before compiling the game:
add_custom_command(
    OUTPUT  ${CMAKE_BINARY_DIR}/assets/manifest.json
    COMMAND caf-encode batch
            ${CMAKE_SOURCE_DIR}/raw/
            ${CMAKE_BINARY_DIR}/assets/
            --manifest ${CMAKE_BINARY_DIR}/assets/manifest.json
            --jobs 4
    DEPENDS ${RAW_ASSET_FILES}
    COMMENT "Converting raw assets to .caf format..."
    VERBATIM
)

add_custom_target(assets DEPENDS ${CMAKE_BINARY_DIR}/assets/manifest.json)
add_dependencies(${GAME_TARGET} assets)
```

---

## Incremental build

```mermaid
flowchart TD
  raw_hero_png["raw/hero.png"] --> CRC__0xABCD1234_____assets_hero_caf_exis["CRC: 0xABCD1234  →  assets/hero.caf exists?"]
  CRC__0xABCD1234_____assets_hero_caf_exis["CRC: 0xABCD1234  →  assets/hero.caf exists?"] --> m[""]
  n[""] --> ___________["┌────┴────┐"]
  ___________["┌────┴────┐"] --> Existe___["Existe  │"]
  Existe___["Existe  │"] --> __________["───┬─────┘"]
  __________["───┬─────┘"] --> m[""]
  n[""] --> CRC_stored____CRC_actual_["CRC stored == CRC actual?"]
  CRC_stored____CRC_actual_["CRC stored == CRC actual?"] --> _["│"]
  _["│"] --> SIM_________NÃO["SIM         NÃO"]
  SIM_________NÃO["SIM         NÃO"] --> _["│"]
  _["│"] --> SKIP_______CONVERTER["SKIP       CONVERTER"]
  SKIP_______CONVERTER["SKIP       CONVERTER"] --> _0__CPU_____TextureEncoder_["(0% CPU)   (TextureEncoder)"]
```


---

## Mipmap generation

- `Original texture: 512×512 (RGBA8, 1MB)`
  - `Mip 0: 512×512 (1MB)`
  - `Mip 1: 256×256 (256KB)`
  - `Mip 2: 128×128 (64KB)`
  - `Mip 3: 64×64 (16KB)`
  - `Mip 4: 32×32 (4KB)`
  - `Mip 5: 16×16 (1KB)`
  - `Mip 6: 8×8 (256B)`
  - `Mip 7: 4×4 (64B)`
  - `Mip 8: 2×2 (16B)`
  - `Mip 9: 1×1 (4B)`
- `Total: ~1.33MB (33% overhead)`
- `Filtering: box downscale of the previous level`


---

## Current limits

- [ ] `caf-encode texture` file path is stubbed (`encodeRaw` works with decoded pixels)
- [x] `caf-encode audio` converts WAV → .caf PCM16
- [x] `caf-encode mesh` converts OBJ and glTF → .caf Mesh3D
- [x] `caf-encode batch` converts a folder and writes a JSON manifest
- [x] Incremental build: only convert changed assets
- [ ] `AssetManager` does not read the manifest yet
- [ ] Hot-reload of raw sources (RF6.6) is not wired to the pipeline
- [ ] OGG Vorbis output (`AudioEncodeOptions::Format`) is declared but not encoded

---

## Dependencies

- **Upstream:**
  - [Asset Manager](asset-manager.md) — `CafHeader` format, `AssetType`
  - [CAF Format](caf-format.md) — binary specification of `.caf`
  - [Mesh Loading](mesh-loading.md) — `Vertex3D`, `Mesh3D`, `SubMesh`
  - [Audio System](../audio/audio-system.md) — `AudioClip`, audio formats
- **Downstream:** none — the tool runs before the runtime

---

## References

- [`caf-format.md`](caf-format.md) — binary format `.caf`
- [`asset-manager.md`](asset-manager.md) — `AssetManager` + `AssetHandle`
- [`mesh-loading.md`](mesh-loading.md) — `Mesh3D` + `Vertex3D`
- [stb image](https://github.com/nothings/stb) — PNG/JPG/BMP decoding
- [dr_wav](https://github.com/mackron/dr_libs) — WAV decoding
- [cgltf](https://github.com/jkuhlmann/cgltf) — glTF parser
- [meshoptimizer](https://github.com/zeux/meshoptimizer) — vertex cache optimization
- [bc7enc](https://github.com/richgel999/bc7enc) — BC1/BC3/BC7 texture compression
