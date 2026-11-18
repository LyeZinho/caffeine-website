# Guia de build

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Verificado em: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">O repositório traz pequenos wrappers de CMake em vez de uma
ferramenta de build separada. Esta página documenta o que cada wrapper faz, os
comandos exatos que executa e as verificações obrigatórias antes de um pull request.</p>

## Um comando

```bash
./scripts/build.sh            # Build Debug (padrão)
./scripts/build.sh release    # Build Release
./scripts/build.sh test       # Build Debug, depois ctest
./scripts/build.sh rebuild    # Apaga build/, configura, compila
./scripts/build.sh clean      # Apaga build/
```

Windows:

```bat
scripts\build.bat
scripts\build.bat release
scripts\build.bat test
```

Fish shell:

```fish
./scripts/build.fish release
```

Os wrappers são apenas conveniência; cada passo é um comando CMake normal.

## O que o wrapper executa

<table class="doc-table">
  <thead>
    <tr><th>Passo</th><th>Comando</th></tr>
  </thead>
  <tbody>
    <tr><td>Verificação de dependências</td><td><code>cmake</code> e <code>python3</code> no <code>PATH</code></td></tr>
    <tr><td>Configuração</td><td><code>cmake -DCMAKE_BUILD_TYPE=&lt;tipo&gt; ..</code> a partir de <code>build/</code></td></tr>
    <tr><td>Compilação</td><td><code>cmake --build . --parallel &lt;cores&gt;</code></td></tr>
    <tr><td>Testes</td><td><code>ctest --output-on-failure</code></td></tr>
  </tbody>
</table>

O wrapper deteta os cores com `nproc` (Linux), `sysctl` (macOS) ou usa quatro como
fallback.

## Compilar o Doppio

O editor Rust não é compilado pelo CMake. Depois de existir a C ABI:

```bash
cmake --build build --target caffeine-capi -j
cd doppio
cargo build -p doppio-ui
cargo run -p doppio-ui
```

Para um binário release compatível com o launcher:

```bash
cd doppio
cargo build --release -p doppio-ui
# doppio/target/release/doppio
```

## Plugins

O build do motor compila todos os plugins do submódulo `doppio-plugins` para
`build/plugins`. Não existe um segundo passo de build de plugins:

```bash
./scripts/submodules.sh
./scripts/build.sh release
ls build/plugins
```

Para saltar plugins num ambiente mínimo ou headless:

```bash
cmake -S . -B build -DCAFFEINE_BUILD_DOPPIO_PLUGINS=OFF
```

Os plugins usam o SDK legado C++/ImGui em `include/caffeine/plugin/` e
`include/caffeine/ui/`, não a UI Rust.

## Testes e verificações

```bash
cd build && ctest --output-on-failure
cd doppio && cargo test -p doppio-ui
./scripts/check-rust-ui.sh
```

`check-rust-ui.sh` corre:

1. `cargo fmt --check`
2. `cargo test` no workspace
3. `cargo check --features agent`
4. `cargo clippy -- -D warnings`
5. a auditoria de acoplamento `caffeine-core` / ImGui
6. a suite de flows headless

Verificações de UI headless:

```bash
./scripts/doppio-headless.sh run doppio/tests/ui-flows --format text
./scripts/doppio-headless.sh screenshot --annotate --out /tmp/doppio-shots
```

## Verificações de documentação

A partir de `caffeine-website/`:

```bash
python3 scripts/audit-docs.py --include-engine
python3 scripts/audit-docs-i18n.py
```

Estas verificações validam links, imagens, caminhos de código, regras HTML e a
estrutura EN/PT. Veja
[`DOCS_STYLE.md`](https://github.com/devscafecommunity/caffeine/blob/main/caffeine-website/DOCS_STYLE.md).

## Resolução de problemas

<table class="doc-table">
  <thead>
    <tr><th>Sintoma</th><th>Correção</th></tr>
  </thead>
  <tbody>
    <tr><td><code>doppio-plugins submodule is missing</code></td><td><code>./scripts/submodules.sh</code> ou <code>-DCAFFEINE_BUILD_DOPPIO_PLUGINS=OFF</code></td></tr>
    <tr><td>SDL3 não encontrado</td><td>Instale SDL3 ou configure com <code>-DCAFFEINE_BUILD_HEADLESS=ON</code> para trabalho só no core</td></tr>
    <tr><td>O Doppio não carrega <code>libcaffeine-capi</code></td><td>Compile o alvo <code>caffeine-capi</code> e defina <code>CAFFEINE_ENGINE_ROOT</code> se as árvores estiverem separadas</td></tr>
    <tr><td>O build Rust falha após alterar a C ABI</td><td>Recompile a C ABI, depois <code>cargo clean -p doppio-engine</code> e volte a compilar</td></tr>
    <tr><td>O renderer headless não arranca</td><td>Defina <code>ICED_TEST_BACKEND=tiny-skia</code></td></tr>
  </tbody>
</table>
