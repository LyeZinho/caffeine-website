# Caffeine Unified Ecosystem — Complete Workflow

This document describes the complete pipeline for creating, packing, and loading assets using the Caffeine unified ecosystem entre Doppio (IDE), caf-pack (asset packer), a Caffeine Engine e o runtime do jogo.

## Full Pipeline Example

### 1. Create Raw Assets

Prepare source assets in standard formats:

**Textura:**
- Crie ou edite a textura em qualquer editor de imagem
- Exporte como PNG para `raw_assets/`

**Áudio:**
- Crie ou edite o som em qualquer editor de áudio
- Exporte como WAV para `raw_assets/`

**Mesh:**
- Create or export OBJ file from 3D tool (Blender, Maya, etc.)
- Place in `raw_assets/` directory

```bash
mkdir raw_assets
cp texture.png raw_assets/
cp sound.wav raw_assets/
cp model.obj raw_assets/
```

### 2. Pack Assets with caf-pack

Use the caf-pack CLI to process assets into optimized binary format:

```bash
./caf-pack --input raw_assets/ \
           --output game.cap \
           --gen-ids include/game_assets.hpp \
           --compress
```

This command:
- Scans `raw_assets/` directory recursively
- Processes PNG → optimized texture (RGBA8 with padding)
- Processes WAV → optimized audio (PCM samples, binned waveform)
- Processes OBJ → optimized mesh (triangulated vertices)
- Compresses all assets with zstd (default compression level 3)
- Writes to `game.cap` with header and asset table
- Generates `include/game_assets.hpp` with asset ID constants

**Generated header example:**
```cpp
namespace Assets {
    constexpr uint64_t texture_id = 0x1a2b3c4d5e6f7g8h;
    constexpr uint64_t sound_id = 0x8g7f6e5d4c3b2a19;
    constexpr uint64_t model_id = 0x5e6f7g8h1a2b3c4d;
}
```

### 3. Load Assets in Game Engine

Use the AssetLoader to load assets asynchronously without blocking the main game loop:

```cpp
#include "include/game_assets.hpp"
#include "engine/AssetLoader.hpp"

class GameState {
private:
    Caffeine::AssetLoader m_assetLoader;
    Caffeine::AssetHandle m_textureHandle;
    Caffeine::AssetHandle m_soundHandle;
    
public:
    void init() {
        m_textureHandle = m_assetLoader.loadAssetAsync(
            Assets::texture_id,
            [this](const std::vector<u8>& data) {
                onTextureLoaded(data);
            }
        );
        
        m_soundHandle = m_assetLoader.loadAssetAsync(
            Assets::sound_id,
            [this](const std::vector<u8>& data) {
                onSoundLoaded(data);
            }
        );
    }
    
    void update() {
        m_assetLoader.update();
    }
    
private:
    void onTextureLoaded(const std::vector<u8>& data) {
        gameTexture = renderer->uploadTexture(data);
    }
    
    void onSoundLoaded(const std::vector<u8>& data) {
        audioManager->loadSound(data);
    }
};
```

### 4. Preview in doppio IDE

Open your game project in doppio to visualize and manage assets:

1. Launch doppio IDE
2. Open project directory
3. Game.cap auto-loads in Asset Browser
4. Features available:
   - Browse all packed assets by name
   - View texture thumbnails
   - Display audio waveforms with stereo visualization
   - See mesh statistics (vertex count, bounds)
   - Drag-and-drop PNG/WAV files into Asset Browser → auto-packed into game.cap

## Integração de ferramentas externas

Convoy e WaveShaper são **projetos legados e já não estão incluídos no repositório
Caffeine**. Qualquer ferramenta externa pode participar no pipeline chamando o CLI
`caf-pack` ou ligando `caf-pack-lib`:

```bash
caf-pack --input <dir-export-temporario> --output <projeto>/game.cap \
         --gen-ids include/game_assets.hpp
```

O packer trata PNG, WAV e OBJ de forma uniforme, pelo que a ferramenta de origem não
importa. Para uma ação nativa "Export to CAP", invoque o mesmo CLI ou ligue a
biblioteca.

### Drag-Drop Import in doppio

1. Open doppio IDE with project
2. In Asset Browser (CAP mode), drag PNG/WAV file
3. File automatically packed using caf-pack
4. game.cap updated in-place
5. Waveform/thumbnail preview generated

## Architecture Overview

> ┐
> │ Raw Assets │
> │ (PNG, WAV, │
> │ OBJ files) │
> └
> │
> ▼
> ┐
> │ caf-pack CLI │
> │ (Packer) │
> └
> │
> ┐
> │ │ │
> ▼ ▼ ▼
> ┐ ┐ ┐
> │game.cap │ │Asset IDs │ │ CAP │
> │(binary) │ │ │Header │ │ Loader │
> └ │ │(.hpp) │ │(Engine) │
> │ │ └ └
> │ │
> ▼ ▼ ┐ ┐
> │ doppio IDE │ │ Game Engine │
> │ (Asset Browser) │ │ (AssetLoader)│
> │ (Live Preview) │ │(async load) │
> └ └


## Key Benefits

1. **Zero-Parsing**: Engine receives pre-processed binary assets, no runtime conversion
2. **Memory-Ready**: All assets aligned for direct CPU/GPU access
3. **Hash-Based IDs**: Fast O(1) asset lookup by hash instead of string comparison
4. **Async Loading**: Load large assets without blocking game loop
5. **Formato partilhado**: Doppio, caf-pack e o runtime usam o mesmo formato; ferramentas externas entram via CLI ou biblioteca
6. **Compression**: Optional zstd compression reduces file size without runtime overhead

## Compilation & Build

Compile a engine, o Doppio e o caf-pack com um comando:

```bash
cd /path/to/caffeine
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

Isto produz:
- `libcaffeine-core.a` — Engine library com AssetLoader
- `libcaf-pack-lib.a` — Biblioteca do packer (quando `caf-pack` está inicializado)
- `caf-pack` — CLI de processamento de assets
- `doppio` — IDE com Asset Browser e preview live

## Testing the Pipeline

Complete end-to-end test:

```bash
# 1. Create test assets
mkdir test_assets
echo "PNG placeholder" > test_assets/test.png
echo "OBJ placeholder" > test_assets/test.obj

# 2. Pack with caf-pack
./caf-pack --input test_assets --output test.cap --gen-ids test_assets.hpp --compress

# 3. Verify header generation
cat test_assets.hpp | head -20

# 4. Launch doppio and open project
./doppio

# 5. Asset Browser should display test.cap with asset previews
```

All components working together provide a unified, high-performance asset ecosystem for Caffeine games.
