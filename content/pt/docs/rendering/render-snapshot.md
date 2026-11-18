# `caffeine-render-snapshot`

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/tools/render-snapshot/main.cpp"><code>tools/render-snapshot/main.cpp</code></a></span>
</div>

<p class="doc-lede">Uma ferramenta offscreen pequena que renderiza a cena de referência de
materiais pelo pipeline GPU completo e escreve um PNG para regressões visuais.</p>

> **Target CMake:** `caffeine-render-snapshot` (requer SDL3 e `CAFFEINE_BUILD_HEADLESS=OFF`)
> **Fonte:** `tools/render-snapshot/main.cpp`

Renderiza uma cena de referência pelo mesmo pipeline do jogo/editor (HDR, probes, SSR,
sombras, `PostProcessStack`) e grava um PNG — útil para regressões visuais sem abrir o Doppio.

---

## Build

```bash
cmake -S . -B build -DCAFFEINE_BUILD_HEADLESS=OFF
cmake --build build --target caffeine-render-snapshot -j
```

---

## Utilização

```text
caffeine-render-snapshot [out.png] [width] [height] [frames] [skyboxIndex] [view]
```

| Argumento | Default | Descrição |
|-----------|---------|-----------|
| `out.png` | `snapshot.png` | Ficheiro de saída |
| `width` / `height` | 1280 × 720 | Resolução interna |
| `frames` | 24 | Frames para o TAA/probes assentarem |
| `skyboxIndex` | 0 | Índice de céu builtin (`Scene::resolveBuiltinSkyboxPath`) |
| `view` | 0 | 0 ao nível dos olhos, 1 alto, 2 afastado, 3 rasante ao chão, 4 close-up do chão |

### Variáveis de ambiente

| Variável | Efeito |
|----------|--------|
| `SNAP_NO_IBL=1` | Desliga o IBL |
| `SNAP_NO_SHADOWS=1` | Desliga as sombras direcionais |
| `SNAP_FLOOR_MAT=<path>` | Usa um `.mat` no chão |
| `SNAP_ONLY_FLOOR=1` | Deixa só o chão e o sol |

---

## Cena de referência

- Chão 24×24 (roughness ~0.35)
- Esferas: Mirror (centro), Gold, Clear Glass
- Cubos coloridos + Glossy Plastic
- Sol direcional (intensidade ~2.5, shadow distance 20 m)

Os materiais vêm de `Assets::materialPresets()`.

---

## Ver também

- [`reflections.md`](reflections.md)
- [`post-processing.md`](post-processing.md)
- [`forward-render-features.md`](forward-render-features.md)
