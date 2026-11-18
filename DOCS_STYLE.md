# Caffeine documentation style

This is the authoring standard for every Markdown file under
`caffeine-website/content/`. It applies to both the English canonical tree and the
Portuguese mirror, to the engine guides in `doppio/docs/`, and to anything generated
for the documentation site.

## 1. HTML-first, Markdown for prose

Documentation pages are **HTML-first**: HTML carries structure, metadata, figures,
callouts, comparison cards, collapsible reference blocks and rich tables. Markdown is
still the right tool for running prose, lists, inline code and fenced code blocks.
The mix keeps pages easy to edit and lets the renderer produce a richer page than
plain Markdown allows.

| Use HTML for | Use Markdown for |
|---|---|
| Page metadata and status badges | Paragraphs and lists |
| Figures, captions, screenshots, GIF/MP4 embeds | Fenced code (` ```cpp `, ` ```json `…) |
| Callouts (`note`, `tip`, `warning`, `danger`) | Inline code, emphasis, links in prose |
| Collapsible API/reference sections (`<details>`) | Headings (`#`, `##`, `###`) |
| Tables with merged cells or multi-line cells | Simple two- or three-column tables |
| Definition lists, keyboard keys, highlighted values | Block quotes |
| Side-by-side cards and timelines | Short notes |

Rules:

- **Keep Markdown headings.** Do not replace `#`/`##`/`###` with `<h1>`/`<h2>`;
  the site builds its table of contents and the translation audit from them.
- **Keep fenced code.** Never put source code in `<pre>` for decoration; use a
  language-tagged fence so highlighting and copy buttons keep working.
- **Prefer semantic elements** (`figure`, `figcaption`, `details`, `summary`,
  `table`, `thead`, `tbody`, `kbd`, `mark`, `abbr`, `dl`, `dt`, `dd`) over anonymous
  `div`s.
- **No `<script>`, no `<style>`, no inline event handlers.** They are stripped by
  renderers and break the docs MCP and the static site.
- **No external image hosts.** Commit images to the repository; see §4.
- **Classes are optional.** Use the documented `doc-*` classes for grouping and for
  a future site stylesheet, but never rely on CSS for meaning: the page must read
  correctly with the default browser styles.

## 2. Page skeleton

Every guide or reference page starts with a title, a metadata strip and a
one-paragraph lede. Historical plans may go straight to context after the metadata. This gives readers the status and the source of truth before the details.

```markdown
# Material pipeline

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Doppio</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/doppio/docs/material-pipeline.md"><code>doppio/docs/material-pipeline.md</code></a></span>
</div>

<p class="doc-lede">How a <code>.mat</code> file moves from texture maps to the
viewport, and which parts of the pipeline are implemented today.</p>

## Overview
…
```

Badge vocabulary: `Stable`, `Beta`, `Experimental`, `Planned`, `Historical`,
`Generated`, `Doppio`, `Engine`, `Plugin`.

- Use `Historical` for plans and session notes kept for context.
- Use `Generated` when a script owns the file (for example
  `editor/ui-reference.md`); never hand-edit a generated page.

## 3. Callouts

```html
<div class="doc-callout doc-callout--note">
  <p><strong>Note.</strong> A note adds context without changing the instructions.</p>
</div>

<div class="doc-callout doc-callout--tip">
  <p><strong>Tip.</strong> Shortcuts and faster workflows.</p>
</div>

<div class="doc-callout doc-callout--warning">
  <p><strong>Warning.</strong> Behaviour that can lose data or break a build.</p>
</div>

<div class="doc-callout doc-callout--danger">
  <p><strong>Danger.</strong> Irreversible or unsafe operations.</p>
</div>
```

Do not use a callout for every paragraph. If everything is highlighted, nothing is.

## 4. Screenshots, diagrams and recordings

Use a `<figure>` with a caption that says **what the reader is looking at**, not
"image". Prefer a crop of the relevant pane over a full desktop screenshot.

```html
<figure class="doc-figure">
  <img src="../images/captures/doppio-editor.png" alt="Doppio workspace with Hierarchy, Viewport, Inspector, Assets and Console panes" loading="lazy" width="1200">
  <figcaption>The default five-pane workspace. The Viewport centre pane is the render target; the Inspector shows the selected entity.</figcaption>
</figure>
```

Rules:

- `alt` is mandatory and describes the content for someone who cannot see it.
- Add `loading="lazy"` and an explicit `width` so the page does not jump while
  loading.
- Paths are relative to the Markdown file. English images live under
  `content/en/docs/images/`; mirror the file into `content/pt/docs/images/` when the
  Portuguese page uses it.
- Prefer PNG for UI, SVG for diagrams, WebP only when the source is photographic.
- Diagrams should be SVG when they are drawn by hand; generated diagrams may be
  Mermaid fences.
- Recordings use native video with a GIF fallback link. A standalone caption under a
  video uses `<p class="doc-caption">…</p>`:

```html
<video class="doc-video" autoplay loop muted playsinline width="960"
       poster="../images/captures/menu-poster.png">
  <source src="../images/captures/example.mp4" type="video/mp4">
  <source src="../images/captures/example.webm" type="video/webm">
  <a href="../images/captures/example.gif">Watch the interaction (GIF)</a>
</video>
```

### Capturing editor images

Do not take desktop screenshots and do not open a real window. Use the headless
driver, which renders the real Doppio widget tree off-screen:

```bash
# Discover targets and state
./scripts/doppio-headless.sh widgets --size 1440x800
./scripts/doppio-headless.sh screenshot --annotate --name workspace --out /tmp/docs

# Re-run a committed capture flow into a docs folder
./scripts/capture-editor-docs.sh
```

Capture flows live in `doppio/docs/flows/capture-*.json`; the shell scripts only
strip the numeric prefix so image names stay stable. When the UI changes, update the
flow and regenerate the images instead of editing the PNG files by hand.

## 5. Rich tables and reference data

Simple tables stay Markdown. Use HTML when a cell spans rows/columns or needs a
badge, code block or list:

```html
<table class="doc-table">
  <thead>
    <tr><th>Area</th><th>Status</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2"><strong>Materials</strong></td>
      <td><span class="doc-badge doc-badge--stable">Stable</span></td>
      <td>PBR, ORM, normal and height maps.</td>
    </tr>
    <tr>
      <td><span class="doc-badge">Beta</span></td>
      <td>Parallax occlusion mapping.</td>
    </tr>
  </tbody>
</table>
```

Long API details belong in a collapsible block so the page stays scannable:

```html
<details class="doc-details">
  <summary>Full parameter reference</summary>
  <dl>
    <dt><code>target</code></dt>
    <dd>Widget id, visible text or window point.</dd>
    <dt><code>nth</code></dt>
    <dd>Zero-based index when several widgets match.</dd>
  </dl>
</details>
```

## 6. Links and source references

The documentation repository is a submodule: relative links cannot escape
`caffeine-website/`. Therefore:

- Link **inside the docs tree** with relative paths: `../rendering/rhi.md`.
- Link **to engine source or Doppio source** with an absolute GitHub URL:

```html
<a href="https://github.com/devscafecommunity/caffeine/blob/main/doppio/crates/ui/src/uikit/theme.rs"><code>uikit/theme.rs</code></a>
```

- Never write `../../src/...` or `](src/...)`. The `audit-docs.py` script rejects it.
- Anchor links (`#section`) are fine; keep the heading text stable.
- Do not link to a branch that may disappear; use `main` (or the current default
  branch) in public docs.

## 7. Language and translation

English under `content/en/` is canonical. Portuguese under `content/pt/` mirrors the
same paths, headings, code fences and image names. Translate prose and captions;
never translate identifiers, file paths, CLI flags, badges or code.

- Keep the same heading levels and order in both trees.
- Translate `alt` text and `<figcaption>` text.
- When an English page is rewritten, update the Portuguese counterpart in the same
  change. If a section is new and the translation is not ready, add it to both trees
  with the English text marked `lang="en"` rather than leaving the mirror short.
- Run `python3 scripts/audit-docs-i18n.py` before committing.

## 8. Status and dates

- Every page has a status badge from §2.
- Add `Last verified: <time datetime="YYYY-MM-DD">YYYY-MM-DD</time>` when the page
  was checked against the current source.
- Historical plans keep their original date in the title and carry the `Historical`
  badge; do not rewrite history as if it had already shipped.
- Remove empty metadata stubs such as `> ** Status:**`.

## 9. Verification

From `caffeine-website/`:

```bash
python3 scripts/audit-docs-i18n.py     # EN/PT structure parity
python3 scripts/audit-docs.py          # links, images, stale paths, HTML rules
```

From the engine root, the headless checks remain:

```bash
./scripts/doppio-headless.sh run doppio/tests/ui-flows --format text
./scripts/check-doppio-visual.sh       # when a display is available
```

A documentation change is complete when both audits pass and any new screenshot was
produced by a committed headless flow.
