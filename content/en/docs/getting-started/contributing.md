# Contributing

## Ground rules

1. **C++20**, CMake 3.20+, SDL3 — match the style of the file you edit.
2. **Minimal diffs** — one concern per change; no drive-by refactors.
3. **Tests first** — add or update a test when behavior changes.
4. **No documentation in the engine tree** — Markdown, plans and screenshots belong
   in the `caffeine-website` submodule.
5. **No plugin code in the engine** — plugin sources live in `doppio-plugins`.

## Workflow

```bash
./scripts/submodules.sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
cd build/tests && ./CaffeineTest "[ui]" && ./DoppioTest
```

Before opening a pull request:

- `git diff --check` passes (no trailing whitespace).
- `cmake --build build --target audit-plugin-coupling` reports **0 / 0 / 0**.
- New behavior has a test under `tests/`.

## Plugins

Add or change plugins in the
[doppio-plugins](https://github.com/devscafecommunity/doppio-plugins) repository.
The engine only owns the public SDK (`include/caffeine/plugin/`) and the host
(`src/editor/PluginSystem.cpp`). See [Writing a plugin](../plugins/writing-a-plugin.md).

## Documentation

- English and Portuguese live under `caffeine-website/content/{en,pt}/docs/`.
- Screenshots are generated with `python3 scripts/capture_doppio_ui.py` from
  `caffeine-website/captures/shots.json`.
- Long-form books are LaTeX under `caffeine-website/tex/`.

## Commit style

Use a short imperative subject and explain the *why* in the body. Do not commit
build artifacts, local config, or `imgui.ini`.
