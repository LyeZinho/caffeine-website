# Ferramenta `caffeine-render-snapshot`

> **Target CMake:** `caffeine-render-snapshot` (requer SDL3 e `CAFFEINE_BUILD_HEADLESS=OFF` ) 
> **Fonte:** `tools/render-snapshot/main.cpp`

Surrender a reference scene by the same pipeline** that the game/editor (HDR, probes, SSR, shadows, `PostProcessStack` ) and record a PNG — useful for visual regressions without opening Doppio.

---

## Build

```bash
cmake -S . -B build -DCAFFEINE_BUILD_HEADLESS=OFF
cmake --build build --target caffeine-render-snapshot -j
```

---

## Uso

```text
caffeine-render-snapshot [out.png] [width] [height] [frames] [skyboxIndex] [view 0|1|2]
```

| Argumento | Default | Description |
|-----------|---------|-----------|
| `out.png` | `render-snapshot.png` | Output file |
| `width` / `height` | 1280 × 720 | Internal resolution |
| `frames` | 16 | Frames para TAA/probes assentarem |
| `skyboxIndex` | 0 | Preset of heaven ( `EnvironmentSystem` ) |
| `view` | 0 | 0 = frontal, 1 = lateral, 2 = afastada |

### Environment variables

| Variable | Efeito |
|----------|--------|
| `SNAP_NO_IBL=1` | Desliga IBL |
| `SNAP_NO_SHADOWS=1` | Desliga sombras direcionais |

---

## Reference scene

- Ground 24×24 (roughness ~0.35)
- Esferas: Mirror (centro), Gold, Clear Glass
- Cubos coloridos + Glossy Plastic
- Directional sun (intensity ~2.5)

Materials come from `Assets::materialPresets()` .

---

## See also

- [`reflections.md`](reflections.md)
- [`post-processing.md`](post-processing.md)
- [`forward-render-features.md`](forward-render-features.md)
