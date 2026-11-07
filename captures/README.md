# Screenshot captures

This folder drives the documentation screenshots.

## Files

| Path | Purpose |
|------|---------|
| `shots.json` | List of screenshots: id, Doppio arguments, delay, target doc |
| `fixture-project/` | Minimal project used by the editor shot |

## Manifest format

```json
{
  "id": "doppio-scene",
  "args": ["--scene", "assets/benchmarks/dense_outdoor.caf"],
  "delay": 7,
  "doc": "editor/scene-viewport",
  "note": "3D scene viewport with the default editor layout."
}
```

- `id` becomes `<id>.png`.
- `args` are passed to `build/doppio`.
- `delay` is the wait before grabbing the window.
- `doc` is the intended documentation page (informational).

## Generate

From the engine checkout:

```bash
python3 scripts/capture_doppio_ui.py
python3 scripts/capture_doppio_ui.py --id doppio-scene
```

Images are written to `content/en/docs/images/captures/`. Copy the ones needed by
the Portuguese tree to `content/pt/docs/images/captures/`.

## Requirements

- `build/doppio` built and runnable on the current display.
- `spectacle`, `grim` or ImageMagick `import`.
- On KDE, the focus helper loads `scripts/kwin_focus_doppio.js` through `qdbus6`.

Close stale Doppio processes before capturing so Spectacle does not grab an old
window.
