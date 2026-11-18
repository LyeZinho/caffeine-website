# Volumetric light

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/RenderFeatures.hpp"><code>render/RenderFeatures.hpp</code></a></span>
</div>

<p class="doc-lede">Névoa de altura analítica calculada dentro do shader forward: o custo de
cada nível de qualidade e o que o engine ainda não faz (volumes froxel, god rays).</p>

Activo em **Forward Render Features → Volumetrics** (ou
`caffeine.forwardrender.setVolumetrics`). Por defeito está **Off**.

Não há um segundo draw de geometria. A névoa percorre a linha da câmara até à superfície
dentro do shader que já está a correr:

- **Low** — 6 passos
- **Medium** — 12 passos
- **High** — 24 passos
- **Density** e **Height** controlam a densidade e a queda com a altitude
- **Anisotropy** inclina a névoa para o sol
- **Sample shadows** lê o shadow map em cada passo (mais caro; desligar se o frame passar dos
  16 ms)

Um volume froxel ainda não existe, nem god rays. Ver
[`forward-render-features.md`](forward-render-features.md) para o componente e a API Lua.

Um componente de nuvens volumétricas com densidade de névoa não nula força a névoa da cena a
**Low** quando os volumétricos estão desligados, para que a geometria do chão fique na mesma
névoa que o céu.
