# Plugin Manager (host legado)

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Como o host C++ legado descobre e ativa bibliotecas de plugins, e porque o Doppio Rust não as carrega.</p>

<div class="doc-callout doc-callout--warning">
  <p><strong>Host legado.</strong> O Doppio ativo em Rust/Iced não carrega plugins C++.
  Estas páginas documentam o SDK C++/ImGui e o seu host em
  <code>caffeine-runtime</code> / <code>doppio-archived</code>. A engine continua a
  compilar todos os plugins do submódulo para manter o SDK testado.</p>
</div>


O build da engine compila **todos** os plugins do submódulo `doppio-plugins` para
`build/plugins/`, mas o **host C++ legado** não os carrega até o utilizador ativar cada um no
Plugin Manager. O core do editor expõe apenas o host (`PluginManager` +
`PluginServiceRegistry`); nenhum plugin de funcionalidade está hardcoded.

<figure class="doc-figure">
  <img src="../images/diagrams/plugin-architecture.svg" alt="Arquitetura de plugins do Doppio" loading="lazy">
  <figcaption>Arquitetura de plugins do Doppio</figcaption>
</figure>


<figure class="doc-figure">
  <img src="../images/diagrams/plugin-lifecycle.svg" alt="Ciclo de vida dos plugins" loading="lazy">
  <figcaption>Ciclo de vida dos plugins</figcaption>
</figure>


## Onde vivem os plugins

O código-fonte dos plugins é mantido no repositório separado
[doppio-plugins](https://github.com/devscafecommunity/doppio-plugins), adicionado à
engine como submódulo:

```bash
./scripts/submodules.sh
```

O build normal da engine compila **todos** os plugins e escreve as bibliotecas em
`build/plugins/`:

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

Não há um segundo passo de build. `CAFFEINE_BUILD_DOPPIO_PLUGINS=OFF` é a única
forma de os saltar, para builds mínimos/headless.

## Instalação

Copie as bibliotecas para qualquer diretório de plugins descoberto:

| Âmbito | Diretório |
|--------|-----------|
| Projeto | `<projeto>/plugins/` |
| Build do Doppio | `<caffeine>/build/plugins/` |
| Junto ao binário | `<dir-do-doppio>/plugins/` |

## Ativar apenas o necessário

Abra **Plugins → Plugin Manager**. As bibliotecas descobertas começam **desativadas**:

- Ativar **Enabled** carrega a biblioteca imediatamente e chama `OnLoad()`.
- Descarregar remove painéis, ações de menu, drawers de componentes e serviços.
- A escolha é persistida em `~/.config/caffeine/plugins.cfg` (ou
  `$XDG_CONFIG_HOME/caffeine/plugins.cfg`).

Nada é carregado no arranque a não ser que conste nessa lista. Uma biblioteca
copiada mais tarde para a pasta fica desativada até ser ativada.

## Porque isto importa

| Antes | Agora |
|-------|-------|
| Plugins compilados dentro da árvore da engine | Compilados a partir do submódulo `doppio-plugins` contra o SDK público |
| Todos os `.so` carregados no arranque | Só carregam plugins ativados pelo utilizador |
| Core referenciava identificadores de plugins | Core expõe apenas serviços genéricos |
| UI dos plugins acoplada ao Doppio | UI usa `Caffeine::UIKit` e callbacks opacos do host |

## Resolução de problemas

- **Plugin aparece mas não carrega:** verifique a coluna de estado para o erro de
  `dlopen`. No Linux o plugin tem de ser compilado com a mesma ABI do Doppio.
- **O painel desapareceu ao desativar:** o unload remove intencionalmente todas as
  contribuições. Reative para voltar a registá-las.
- **Quer um plugin ativo por omissão numa equipa:** distribua um `plugins.cfg` e
  copie-o para a config do utilizador; o formato é um stem de biblioteca por linha.
