# Compatibilidade de plugins

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Compatibilidade de ABI, flags de build e matriz de plataformas para plugins C++ legados.</p>



<div class="doc-callout doc-callout--warning">
  <p><strong>Host legado.</strong> O Doppio atual em Rust/Iced não carrega plugins C++.
  Estas páginas documentam o SDK de plugins C++/ImGui e o seu host no editor C++ arquivado
  (<code>doppio-archived/</code>). A engine continua a compilar todos os plugins do
  submódulo, para que o SDK se mantenha testado na compilação.</p>
</div>


Plugins são bibliotecas nativas partilhadas. A compatibilidade depende da ABI da
engine, dos headers públicos do SDK e do toolchain de build.

## Matriz

| Engine | Plugin SDK | `caffeine/plugin/` | Notas |
|--------|------------|--------------------|-------|
| `main` | `doppio-plugins/main` | estável | Emparelhamento recomendado |
| Engine antiga | Plugin mais recente | pode quebrar | Recompilar contra a engine |
| Engine mais recente | Plugin antigo | pode quebrar | Recompilar contra a engine |

Não há garantia de compatibilidade binária entre releases da engine. Recompile
sempre os plugins ao atualizar a engine.

## Flags de build obrigatórias

| Flag | Porquê |
|------|--------|
| `CF_HAS_IMGUI=1` | Os painéis usam o contexto ImGui do editor |
| `CAFFEINE_PLUGIN_EXPORTS=1` | Exporta `CreatePlugin` / `DestroyPlugin` |
| `CAFFEINE_SOURCE_DIR=<engine>` | Paths usados por bridges de terreno/tooling |

`doppio_add_plugin()` define estas flags automaticamente.

## Notas por plataforma

| Plataforma | Biblioteca | Notas |
|------------|------------|-------|
| Linux | `.so` | Usar o mesmo compilador e standard library do host C++ |
| Windows | `.dll` | Tem de corresponder ao runtime MSVC (`/MD` vs `/MT`) |
| macOS | `.dylib` | Ainda não é alvo principal |

## Símbolos

O host C++ legado carrega plugins com `dlopen` / `LoadLibrary` e resolve:

- `CreatePlugin(const PluginHostApi*)`
- `DestroyPlugin(IPlugin*)`

Ambos têm de ser exportados com linkage C.

## Dependências em runtime

Um plugin pode depender de bibliotecas de runtime já carregadas pelo host. Não deve
trazer a sua própria cópia de ImGui ou da engine. Compile contra os mesmos headers.

## Resolução de problemas

| Sintoma | Causa |
|---------|-------|
| `missing exports` | Falta `extern "C"` ou não foi compilado como shared library |
| `dlopen failed` | Dependência em falta, arquitetura ou ABI errada |
| Crash durante `OnLoad` | Header/ABI mismatch ou callback nulo do host |
| Painel vazio | Compilado sem `CF_HAS_IMGUI=1` |
| Component drawer em falta | Plugin desativado ou `getComponentTypeId` inválido |

## Relacionado

- [Instalar plugins](../plugins/installing-plugins.md)
- [Plugin Manager](../editor/plugin-manager.md)
- [Escrever um plugin](../plugins/writing-a-plugin.md)
