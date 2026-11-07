# Contribuir

## Regras base

1. **C++20**, CMake 3.20+, SDL3 — siga o estilo do ficheiro que edita.
2. **Diffs mínimos** — uma preocupação por alteração; sem refactors colaterais.
3. **Testes primeiro** — adicione ou atualize um teste quando o comportamento muda.
4. **Sem documentação na árvore da engine** — Markdown, planos e screenshots vivem
   no submódulo `caffeine-website`.
5. **Sem código de plugins na engine** — o código dos plugins vive em
   `doppio-plugins`.

## Fluxo

```bash
./scripts/submodules.sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
cd build/tests && ./CaffeineTest "[ui]" && ./DoppioTest
```

Antes de abrir um pull request:

- `git diff --check` passa (sem trailing whitespace).
- `cmake --build build --target audit-plugin-coupling` reporta **0 / 0 / 0**.
- Novo comportamento tem teste em `tests/`.

## Plugins

Adicione ou altere plugins no repositório
[doppio-plugins](https://github.com/devscafecommunity/doppio-plugins). A engine só
possui o SDK público (`include/caffeine/plugin/`) e o host
(`src/editor/PluginSystem.cpp`). Ver [Escrever um plugin](../plugins/writing-a-plugin.md).

## Documentação

- Inglês e português vivem em `caffeine-website/content/{en,pt}/docs/`.
- Screenshots são geradas com `python3 scripts/capture_doppio_ui.py` a partir de
  `caffeine-website/captures/shots.json`.
- Livros longos são LaTeX em `caffeine-website/tex/`.

## Estilo de commit

Use um assunto curto no imperativo e explique o *porquê* no corpo. Não commit
artefactos de build, config local ou `imgui.ini`.
