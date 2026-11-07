# Caffeine documentation

Documentation, plans, screenshots and books for the **Caffeine Engine** and
**Doppio** editor. This repository is included in the engine as the
`caffeine-website` submodule; the engine tree contains no Markdown docs.

## Layout

| Path | Contents |
|------|----------|
| `content/en/docs/` | English documentation (canonical) |
| `content/pt/docs/` | Portuguese mirror of the English tree |
| `tex/` | LaTeX books and PDF sources |
| `captures/` | Screenshot manifest and fixture project |
| `scripts/` | i18n audit, translation and diagram helpers |

## Where to write

| Topic | Folder |
|-------|--------|
| Build, install, first project | `content/en/docs/getting-started/` |
| Editor UI, panels, viewport | `content/en/docs/editor/` |
| Engine modules (ECS, rendering, audio…) | matching module folder |
| Roadmaps and historical plans | `content/en/docs/plans/` |
| Book-length material | `tex/` |
| Plugins | `content/en/docs/plugins/` and `doppio-plugins/docs/` |

## Adding a page

1. Create the Markdown file under `content/en/docs/<section>/`.
2. Add it to the section index (`content/en/docs/README.md`) when relevant.
3. Mirror the structure to `content/pt/docs/<section>/`.
4. Run the i18n audit:

   ```bash
   python3 scripts/audit-docs-i18n.py
   ```

5. Include images with a relative path:

   ```markdown
   ![Viewport toolbar](../images/captures/doppio-scene.png)
   ```

## Images and diagrams

| Kind | Location |
|------|----------|
| Screenshots | `content/en/docs/images/captures/` |
| Diagrams | `content/en/docs/images/diagrams/` |
| Portuguese copies | `content/pt/docs/images/` |

Generate screenshots from the engine checkout:

```bash
python3 scripts/capture_doppio_ui.py
```

The shot list lives in [`captures/shots.json`](captures/shots.json). Prefer SVG for
diagrams so they stay sharp and diff-friendly.

## Translation

`content/pt/docs/` mirrors `content/en/docs/`. Keep heading levels and code fences
aligned; the audit checks structure and reports mismatches. New English pages should
get a Portuguese counterpart, even if the first pass is a summary.

## Books

LaTeX sources are under `tex/`:

- `tex/caffeine-internals/` — engine internals
- `tex/fundamentos-computacao-grafica/` — computer graphics fundamentals
- `tex/scripting-reference/` — scripting reference

Build them with your LaTeX toolchain of choice (`pdflatex`/`latexmk`).

## Related repositories

- Engine and Doppio: <https://github.com/devscafecommunity/caffeine>
- Editor plugins: <https://github.com/devscafecommunity/doppio-plugins>
- Launcher: <https://github.com/devscafecommunity/caffeine-launcher>
