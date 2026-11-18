# `caffeine-render-snapshot`

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/tools/render-snapshot/main.cpp"><code>tools/render-snapshot/main.cpp</code></a></span>
</div>

<p class="doc-lede">A small offscreen tool that renders the reference material scene through
the full GPU pipeline and writes a PNG for visual regressions.</p>

> **CMake target:** `caffeine-render-snapshot` (needs SDL3 and `CAFFEINE_BUILD_HEADLESS=OFF`)
> **Source:** `tools/render-snapshot/main.cpp`

It renders a reference scene through the same pipeline as the game/editor (HDR, probes, SSR,
shadows, `PostProcessStack`) and writes a PNG — useful for visual regressions without opening
Doppio.

---

## Build

```bash
cmake -S . -B build -DCAFFEINE_BUILD_HEADLESS=OFF
cmake --build build --target caffeine-render-snapshot -j
```

---

## Usage

```text
caffeine-render-snapshot [out.png] [width] [height] [frames] [skyboxIndex] [view]
```

| Argument | Default | Description |
|----------|---------|-------------|
| `out.png` | `snapshot.png` | Output file |
| `width` / `height` | 1280 × 720 | Internal resolution |
| `frames` | 24 | Frames so TAA/probes settle |
| `skyboxIndex` | 0 | Builtin sky index (`Scene::resolveBuiltinSkyboxPath`) |
| `view` | 0 | 0 eye level, 1 high, 2 distant, 3 grazing floor, 4 floor close-up |

### Environment variables

| Variable | Effect |
|----------|--------|
| `SNAP_NO_IBL=1` | Disables IBL |
| `SNAP_NO_SHADOWS=1` | Disables directional shadows |
| `SNAP_FLOOR_MAT=<path>` | Uses a `.mat` on the floor |
| `SNAP_ONLY_FLOOR=1` | Leaves only the floor and the sun |

---

## Reference scene

- Ground 24×24 (roughness ~0.35)
- Spheres: Mirror (centre), Gold, Clear Glass
- Coloured cubes + Glossy Plastic
- Directional sun (intensity ~2.5, shadow distance 20 m)

Materials come from `Assets::materialPresets()`.

---

## See also

- [`reflections.md`](reflections.md)
- [`post-processing.md`](post-processing.md)
- [`forward-render-features.md`](forward-render-features.md)
