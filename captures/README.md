# Screenshot captures

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span class="doc-badge">Docs</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

This folder holds the **legacy** desktop-capture manifest and the fixture project it
used. New documentation images come from the headless driver instead:

```bash
./scripts/capture-editor-docs.sh
```

The flow is `doppio/docs/flows/capture-editor-docs.json`; it renders Doppio
off-screen, so it never captures unrelated windows and works in CI.

## Files

| Path | Purpose |
|------|---------|
| `shots.json` | Legacy list: id, Doppio arguments, delay, target doc |
| `fixture-project/` | Minimal project used by the legacy desktop shot |

## Why the old path is historical

`shots.json` was consumed by `scripts/capture_doppio_ui.py`, which opened a real
window and used `spectacle`/`grim`/ImageMagick. That path is kept for reference; it
requires a display and is not used by the docs pipeline.

## Generate images today

From the engine checkout:

```bash
./scripts/doppio-headless.sh screenshot --annotate --name workspace --out /tmp/shots
./scripts/capture-editor-docs.sh
```

Copy the stable-name files into `content/{en,pt}/docs/images/editor/`. See
[`DOCS_STYLE.md`](../DOCS_STYLE.md) for figure markup and naming.
