# Git Plugin

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Plugin:</strong> `git_plugin.so` (built from the doppio-plugins submodule; legacy host)</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Optional Git panel for the legacy C++/ImGui host: status, stage, commit, branches, remotes, history and stash.</p>

<div class="doc-callout doc-callout--warning">
  <p><strong>Legacy host.</strong> The active Rust/Iced Doppio does not load C++ plugins.
  These pages document the C++/ImGui plugin SDK and its host in
  <code>caffeine-runtime</code> / <code>doppio-archived</code>. The engine still builds
  every plugin from the submodule so the SDK stays compile-tested.</p>
</div>


Full Git workflow panel for the open Caffeine project. Requires `git` in PATH.

## Features

- Repository detection + `git init`
- **Changes** — porcelain status, stage/unstage per file or all
- **Commit** — message + commit
- ** Branches** — checkout, create
- **Remotes** — fetch, pull, push
- ** History** — recent log
- **Stash** — push, pop, list
- **Diff output** — per-file diff in output panel

## Open panel

Menu: **Version Control → Git Panel**, or enable plugin in **Plugins**manager.

## Project root

Uses `PluginHostApi::getProjectRootPath` — parent of `scenes/` from the open scene path.
