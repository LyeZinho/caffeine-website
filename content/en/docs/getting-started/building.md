# Building

## Manual CMake build

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

Artifacts:

| Target | Path |
|--------|------|
| `doppio` | `build/doppio` |
| `caffeine-runtime` | `build/apps/runtime/…` |
| `build-smoke` | `build/build-smoke` |

## Common options

| Option | Default | Meaning |
|--------|---------|---------|
| `CMAKE_BUILD_TYPE` | `Debug` | `Release` for editor use |
| `CAFFEINE_BUILD_CONVOY` | `ON` | Build the 2D art station submodule |
| `CAFFEINE_BUILD_WAVESHAPER` | `OFF` | Build the audio DAW submodule (needs VST3 SDK) |
| `CAFFEINE_BUILD_HEADLESS` | `OFF` | Skip SDL/ImGui editor binaries |
| `CAFFEINE_BUILD_TESTS` | `ON` | Build Catch2/GoogleTest suites |

The editor fetches ImGui, ImNodes and ImGuiTestEngine during configure. The first
configure needs network access; later builds are offline.

## Tests

```bash
cd build/tests
./CaffeineTest "[ui]"
./DoppioTest
```

The root `ctest` entry only registers a subset; run the two binaries directly for the
full editor/UI suites.

## Plugins

Plugins are **not** built by the engine CMake. Build the submodule separately:

```bash
cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT="$PWD" \
  -DIMGUI_DIR="$PWD/build/_deps/imgui-src"
cmake --build doppio-plugins/build -j
cp doppio-plugins/build/plugins/*.so build/plugins/
```

See [Plugin Manager](../editor/plugin-manager.md) for installation and opt-in
loading.

## Platform helpers

- `scripts/build.sh` — Linux/macOS
- `scripts/build.bat` — Windows
- `scripts/build.fish` — Fish shell
- `scripts/build-launcher.sh` — Rust desktop launcher
- [`build-guide.md`](build-guide.md) — full `caffeine-build` wrapper reference
