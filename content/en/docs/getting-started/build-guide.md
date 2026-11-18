# Build guide

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">The repository ships small CMake wrappers instead of a separate
build tool. This page documents what each wrapper does, the exact commands it runs
and the checks that must pass before a pull request.</p>

## One command

```bash
./scripts/build.sh            # Debug build (default)
./scripts/build.sh release    # Release build
./scripts/build.sh test       # Debug build, then ctest
./scripts/build.sh rebuild    # Delete build/, configure, build
./scripts/build.sh clean      # Delete build/
```

Windows:

```bat
scripts\build.bat
scripts\build.bat release
scripts\build.bat test
```

Fish shell:

```fish
./scripts/build.fish release
```

The wrappers are convenience only; every step is a normal CMake command.

## What the wrapper runs

<table class="doc-table">
  <thead>
    <tr><th>Step</th><th>Command</th></tr>
  </thead>
  <tbody>
    <tr><td>Dependency check</td><td><code>cmake</code> and <code>python3</code> on <code>PATH</code></td></tr>
    <tr><td>Configure</td><td><code>cmake -DCMAKE_BUILD_TYPE=&lt;type&gt; ..</code> from <code>build/</code></td></tr>
    <tr><td>Build</td><td><code>cmake --build . --parallel &lt;cores&gt;</code></td></tr>
    <tr><td>Test</td><td><code>ctest --output-on-failure</code></td></tr>
  </tbody>
</table>

The wrapper auto-detects CPU cores with `nproc` (Linux), `sysctl` (macOS) or falls
back to four.

## Building Doppio

The Rust editor is not built by CMake. After the C ABI exists:

```bash
cmake --build build --target caffeine-capi -j
cd doppio
cargo build -p doppio-ui
cargo run -p doppio-ui
```

For a launcher-compatible release binary:

```bash
cd doppio
cargo build --release -p doppio-ui
# doppio/target/release/doppio
```

## Plugins

The engine build compiles every plugin from the `doppio-plugins` submodule into
`build/plugins`. There is no second plugin build step:

```bash
./scripts/submodules.sh
./scripts/build.sh release
ls build/plugins
```

To skip plugins in a minimal or headless environment:

```bash
cmake -S . -B build -DCAFFEINE_BUILD_DOPPIO_PLUGINS=OFF
```

Plugins target the legacy C++/ImGui SDK under `include/caffeine/plugin/` and
`include/caffeine/ui/`, not the Rust UI.

## Tests and checks

```bash
cd build && ctest --output-on-failure
cd doppio && cargo test -p doppio-ui
./scripts/check-rust-ui.sh
```

`check-rust-ui.sh` runs:

1. `cargo fmt --check`
2. `cargo test` for the workspace
3. `cargo check --features agent`
4. `cargo clippy -- -D warnings`
5. the `caffeine-core` / ImGui coupling audit
6. the headless flow suite

Headless UI checks:

```bash
./scripts/doppio-headless.sh run doppio/tests/ui-flows --format text
./scripts/doppio-headless.sh screenshot --annotate --out /tmp/doppio-shots
```

## Documentation checks

From `caffeine-website/`:

```bash
python3 scripts/audit-docs.py --include-engine
python3 scripts/audit-docs-i18n.py
```

These validate links, images, source paths, HTML rules and EN/PT structure. See
[`DOCS_STYLE.md`](https://github.com/devscafecommunity/caffeine/blob/main/caffeine-website/DOCS_STYLE.md).

## Troubleshooting

<table class="doc-table">
  <thead>
    <tr><th>Symptom</th><th>Fix</th></tr>
  </thead>
  <tbody>
    <tr><td><code>doppio-plugins submodule is missing</code></td><td><code>./scripts/submodules.sh</code> or <code>-DCAFFEINE_BUILD_DOPPIO_PLUGINS=OFF</code></td></tr>
    <tr><td>SDL3 not found</td><td>Install SDL3 or configure with <code>-DCAFFEINE_BUILD_HEADLESS=ON</code> for core-only work</td></tr>
    <tr><td>Doppio cannot load <code>libcaffeine-capi</code></td><td>Build the <code>caffeine-capi</code> target and set <code>CAFFEINE_ENGINE_ROOT</code> if the trees are separate</td></tr>
    <tr><td>Rust build fails after a C ABI change</td><td>Rebuild the C ABI, then <code>cargo clean -p doppio-engine</code> and rebuild</td></tr>
    <tr><td>Headless renderer cannot start</td><td>Set <code>ICED_TEST_BACKEND=tiny-skia</code></td></tr>
  </tbody>
</table>
