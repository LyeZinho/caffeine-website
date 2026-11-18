# Git Plugin

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Plugin:</strong> `git_plugin.so` (compilado do submódulo doppio-plugins; host legado)</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Painel Git opcional para o host C++/ImGui legado: estado, stage, commit, branches, remotes, histórico e stash.</p>

<div class="doc-callout doc-callout--warning">
  <p><strong>Host legado.</strong> O Doppio ativo em Rust/Iced não carrega plugins C++.
  Estas páginas documentam o SDK C++/ImGui e o seu host em
  <code>caffeine-runtime</code> / <code>doppio-archived</code>. A engine continua a
  compilar todos os plugins do submódulo para manter o SDK testado.</p>
</div>


Full Git workflow panel for the open Caffeine project. Requires `git` in PATH.

## Features

- Repository detection + `git init`
- **Changes** — porcelain status, stage/unstage per file or all
- **Commit** — message + commit
- **Branches** — checkout, create
- **Remotes** — fetch, pull, push
- **History** — recent log
- **Stash** — push, pop, list
- **Diff output** — per-file diff in output panel

## Open panel

Menu: **Version Control → Git Panel**, or enable plugin in **Plugins** manager.

## Project root

Uses `PluginHostApi::getProjectRootPath` — parent of `scenes/` from the open scene path.
