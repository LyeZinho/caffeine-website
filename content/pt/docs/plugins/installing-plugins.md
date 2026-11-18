# Installing plugins

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Caminhos de descoberta e lista de plugins ativos no host C++ legado.</p>



<div class="doc-callout doc-callout--warning">
  <p><strong>Host legado.</strong> O Doppio atual em Rust/Iced não carrega plugins C++.
  Estas páginas documentam o SDK de plugins C++/ImGui e o seu host no editor C++ arquivado
  (<code>doppio-archived/</code>). A engine continua a compilar todos os plugins do
  submódulo, para que o SDK se mantenha testado na compilação.</p>
</div>


O host C++ legado descobre bibliotecas partilhadas em alguns diretórios `plugins/`
conhecidos, mas **não carrega nenhuma no arranque**. Uma biblioteca descoberta aparece
no Plugin Manager desse host e fica desativada até a ativares. O Doppio atual em Rust
não procura estes diretórios.

## Discovery locations

| Scope | Path |
|-------|------|
| Project | `<project-root>/plugins/*.so` (`*.dll` on Windows) |
| Legacy host build | `<caffeine-build>/plugins/*.so` |
| Next to the host binary | `<host-binary-dir>/plugins/*.so` |

Example after a typical Caffeine build:

```
caffeine/build/
└── plugins/
    ├── hello_plugin.so
    ├── terrain_plugin.so
    └── git_plugin.so
```

## Manual install

```bash
cp /path/to/built/my_plugin.so /path/to/caffeine/build/plugins/
```

Reinicia o host legado ou carrega em **Refresh Directory** no **Plugins → Plugin
Manager** desse host.

## Enabling and disabling

1. Open **Plugins → Plugin Manager**.
2. Tick **Enabled** next to a library to load it and register its panels, menus,
   drawers and services.
3. Untick it (or press **Unload**) to remove its contributions and unload the
   library.

The enable list is written to `~/.config/caffeine/plugins.cfg`
(`$XDG_CONFIG_HOME/caffeine/plugins.cfg` when set, `%APPDATA%/Caffeine` on Windows).
Each line is a library stem; comments start with `#`.

```
# enabled plugins
terrain_plugin
git_plugin
```

## Distribution

Ship the `.so`/`.dll` files and a short readme. Do not modify the engine tree.
For a team default, distribute a `plugins.cfg` that developers copy into their user
config; each user can still disable plugins locally.

## Compatibility

Plugins are compiled against the public headers in `include/caffeine/plugin/`. Keep
the ABI version aligned with the engine; a plugin built for a different ABI may
fail to load or crash. Usa o mesmo compilador e standard library que o host C++ em
Linux.
