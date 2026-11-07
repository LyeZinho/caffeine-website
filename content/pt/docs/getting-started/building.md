# Compilar

## Build manual com CMake

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

Artefactos:

| Target | Caminho |
|--------|---------|
| `doppio` | `build/doppio` |
| `caffeine-runtime` | `build/apps/runtime/…` |
| `build-smoke` | `build/build-smoke` |

## Opções comuns

| Opção | Default | Significado |
|-------|---------|-------------|
| `CMAKE_BUILD_TYPE` | `Debug` | `Release` para uso do editor |
| `CAFFEINE_BUILD_CONVOY` | `ON` | Compilar o submodule 2D art station |
| `CAFFEINE_BUILD_WAVESHAPER` | `OFF` | Compilar o DAW de áudio (precisa VST3 SDK) |
| `CAFFEINE_BUILD_HEADLESS` | `OFF` | Omitir binários SDL/ImGui |
| `CAFFEINE_BUILD_TESTS` | `ON` | Compilar suites Catch2/GoogleTest |

O editor descarrega ImGui, ImNodes e ImGuiTestEngine durante o configure. O primeiro
configure precisa de rede; builds seguintes são offline.

## Testes

```bash
cd build/tests
./CaffeineTest "[ui]"
./DoppioTest
```

O `ctest` na raiz regista apenas um subconjunto; execute os dois binários diretamente
para as suites completas de editor/UI.

## Plugins

Os plugins **não** são compilados pelo CMake da engine. Compile o submódulo à parte:

```bash
cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT="$PWD" \
  -DIMGUI_DIR="$PWD/build/_deps/imgui-src"
cmake --build doppio-plugins/build -j
cp doppio-plugins/build/plugins/*.so build/plugins/
```

Ver [Plugin Manager](../editor/plugin-manager.md) para instalação e carregamento
opt-in.

## Helpers por plataforma

- `scripts/build.sh` — Linux/macOS
- `scripts/build.bat` — Windows
- `scripts/build.fish` — Fish shell
- `scripts/build-launcher.sh` — launcher Rust
- [`build-guide.md`](build-guide.md) — referência completa do wrapper `caffeine-build`
