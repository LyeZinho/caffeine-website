# Natural Fluids

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">Plugin opcional de fluidos naturais (água, fogo, fumo) para o runtime e host legado.</p>



<div class="doc-callout doc-callout--warning">
  <p><strong>Host legado.</strong> O Doppio atual em Rust/Iced não carrega plugins C++.
  Estas páginas documentam o SDK de plugins C++/ImGui e o seu host no editor C++ arquivado
  (<code>doppio-archived/</code>). A engine continua a compilar todos os plugins do
  submódulo, para que o SDK se mantenha testado na compilação.</p>
</div>


O Natural Fluids é um **plugin para o host C++/ImGui legado** para água animada e
fluidos reais. Adiciona um `NaturalFluidComponent` às entidades e quatro níveis de
autoria, de um plano de água parado a um volume de fluido Euleriano 3D.

<figure class="doc-figure">
  <img src="../images/captures/natural-fluids.png" alt="Água e fogo do Natural Fluids" loading="lazy">
  <figcaption>Água e fogo do Natural Fluids</figcaption>
</figure>


## Quatro níveis

| Nível | O que faz |
|-------|-----------|
| **Água plana** | Um plano de água animado com material transparente de baixa rugosidade. |
| **Vento + física** | Ondas de Gerstner com vento e um solver conservativo de shallow water: tensão do vento, gotas, impulsos, leito do terreno e conservação de volume. |
| **Água realista** | Um espetro largo de Gerstner com dispersão de profundidade finita, choppiness, espuma de cristas e atenuação com a profundidade. |
| **Volume de fluido** | Um solver Stable-Fluids 3D real para água, fogo, nevoeiro e fumo. |

## Como funciona

A simulação vive na engine, não no plugin:

- `WaveField` amostra um espetro determinístico de Gerstner a partir do vento,
  direção, choppiness, comprimento de onda e profundidade.
- `ShallowWater` é um solver de águas rasas com velocidades em faces. Conserva o
  volume numa bacia fechada e reage a vento, gotas e impulsos.
- `EulerFluid2D` e `FluidVolume` usam adveção semi-Lagrangiana, projeção de pressão
  por Jacobi, empuxo e confinamento de vorticidade. Densidade e temperatura são
  transportadas pelo campo de velocidade incompressível: o fogo sobe e o fumo e o
  nevoeiro seguem o escoamento real.
- `Scene::tickNaturalFluids` reconstrói todos os frames uma malha de água com
  normais suaves ou uma malha de voxels de densidade e entrega-a ao renderer da
  cena.

O `NaturalFluidComponent` é POD e fica gravado na cena. As malhas geradas não são
gravadas; são reconstruídas ao carregar.

## Painel

Abre **View → Panels → Natural Fluids** (ou ativa o plugin e usa o painel dockado).
Seleciona uma entidade com o componente, ou cria uma no painel.

O painel expõe tamanho, nível de água, vento, amplitude, choppiness, limiar de
espuma, resolução da malha/física, escala temporal e material. A secção de volume
adiciona o preset (água, fogo, nevoeiro, fumo), taxa/raio/calor da fonte, vento do
fluido e emissão. Os botões injetam gotas, impulsos e puffs e reiniciam a
simulação. O preview desenha o mapa de altura/espuma, uma fatia 2D de densidade ou
duas fatias 3D.

## Rendering

A água usa o shader PBR da cena com um material transparente. O próximo passo é um
shader dedicado com refração/reflexão planar e textura de espuma. Os volumes são
visualizados como voxels de densidade; um passe de raymarch pode substituí-los sem
mexer no solver.

## Instalação

```bash
cmake -S doppio-plugins -B doppio-plugins/build \
  -DCAFFEINE_ROOT="$PWD" \
  -DIMGUI_DIR="$PWD/build/_deps/imgui-src"
cmake --build doppio-plugins/build --target natural_fluids_plugin
cp doppio-plugins/build/plugins/natural_fluids_plugin.so build/plugins/
```

Ativa **Natural Fluids** no **Plugins → Plugin Manager** do host legado. O componente
e a simulação do lado da engine continuam a funcionar em cenas abertas pelo Doppio em
Rust ou pelo runtime; só falta o painel do plugin.
