# Overlays vectoriais 2D (caminho RHI)

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/Overlay2D.hpp"><code>render/Overlay2D.hpp</code></a></span>
</div>

<p class="doc-lede">Linhas, círculos e rectângulos de debug e de gameplay em modo retained,
desenhados por ImGui no editor e tesselados para um futuro passe RHI.</p>

As primitivas de debug e gameplay do play mode são acumuladas em `Render::Overlay2D`
(`line`, `circle`, `circleFilled`, `rect`, `polyline`) e limpas por `beginFrame()`.

## Caminho ImGui (editor + runtime actual)

Com `CF_HAS_IMGUI` definido, `Overlay2D::draw(ImDrawList*, camera, screenOrigin, panelSize)`
desenha depois do mundo e antes dos widgets de UI.

## Shipping / sem ImGui

1. Os scripts registam primitivas via `caffeine.draw2d.*` (mesmo buffer que o ImGui).
2. `Overlay2D::buildRhiMesh(camera, screenOrigin, vertices)` tesselam os comandos em valores
   `RhiVertex` em espaço de ecrã (`x`, `y`, `r`, `g`, `b`, `a`); os comandos em espaço de mundo
   são primeiro transformados com a `Camera2D`.
3. `Overlay2D::drawRhi(CommandBuffer*, camera, screenOrigin)` é o ponto de entrada da
   submissão GPU.

Os shaders estão em `src/caffeine/render/shaders/overlay2d.vert` e `overlay2d.frag`. O `drawRhi`
só é compilado com `CF_HAS_SDL3` e sem `CF_HEADLESS`.

Enquanto o pipeline não estiver registado, a tesselação continua a correr para que a lógica de
gameplay possa ser testada; o upload é um no-op (o `drawRhi` tesselam e descarta os vértices).

## Espaços de coordenadas

- **world** — valores em unidades de cena; transformados com a `Camera2D`.
- **screen** — deslocamentos em pixels relativos à origem do viewport; convertidos via
  `screenToWorld` para comandos em espaço de mundo.
