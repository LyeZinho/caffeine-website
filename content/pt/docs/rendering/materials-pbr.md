# Materiais PBR (forward)

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Ficheiro:</strong> `.mat` (`CAFMAT3`; `CAFMAT1`/`CAFMAT2` ainda carregam)</span>
  <span><strong>Core:</strong> `MaterialSurface`, `MaterialFile`, `MaterialCache`</span>
  <span><strong>Shader:</strong> `scene_lit.frag`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/assets/MaterialTypes.hpp"><code>assets/MaterialTypes.hpp</code></a></span>
</div>

<p class="doc-lede">A superfície <code>.mat</code> que o passe forward consome — metallic,
roughness, emission, mapas e os lóbulos avançados — e onde a editar.</p>

> **Editor:** Material Editor

O viewport deixa de ignorar o material atribuído ao mesh. O `.mat` é a superfície que o passe forward já consome: albedo, metallic, roughness, emissão e mapas. O grafo de nós antigo compilava GLSL que o `GpuSceneRenderer` nunca executava.

## Parâmetros

| Campo | Efeito |
|-------|--------|
| Albedo | Multiplica a textura de albedo |
| Metallic / Roughness | GGX e IBL. Um mapa ORM substitui os dois sliders por texel |
| Reflectance | F0 dos dielétricos no `scene_lit` (por defeito 0.04). Metais usam o albedo |
| Emission | Cor × força, somada antes do tone map |
| Albedo Map / Normal Map | Usados quando o mesh não tem textura própria |
| ORM Map | R oclusão, G roughness, B metallic |
| UV tiling / offset | Multiplica coordenadas no vertex shader |
| Alpha mode | Opaque, Cutout (`alphaCutoff`), Blend (pass separado + cópia opaca) |
| Transmission / IOR | Vidro: refract + Fresnel; IOR típico vidro 1.5 |
| Clear coat | Segunda lobe GGX |
| Sheen | Tecidos (cor + roughness) |
| Iridescence | Filme fino (espessura nm, IOR filme) |
| Emission map | sRGB→linear, × `emissionStrength` |

O mapa do mesh (Albedo Texture / Normal Map no inspector) continua à frente do mapa do material. Metallic e roughness do ficheiro ganham ao material embutido do glTF.

Presets nomeados: `src/caffeine/assets/MaterialPresets.hpp` (Mirror, Chrome, Clear Glass, …).

## Onde editar

- Asset Browser → criar Material, abrir o `.mat`.
- Inspector → Mesh Filter → Material, em primitivas e em meshes custom. **Edit Material** abre o painel.
- Os sliders publicam no `MaterialCache` na hora. **File → Save** grava o `CAFMAT3`. O carimbo da cena inclui a revisão do cache, por isso o viewport redesenha sem órbita da câmara.

Ficheiros `CAFMAT1` abrem com albedo, metallic e roughness do cabeçalho. O grafo deixa de ser avaliado.

## Pré-visualização

A esfera do Material Editor é desenhada pelo `GpuSceneRenderer` (`Render::MaterialPreviewRenderer`), com o mesmo `scene_lit`, HDR, TAA, pós-processamento, céu da cena e reflection probe. **Orbit**, **Height** e **Floor** controlam a câmara e o chão. Documentação do painel: [`../editor/material-editor.md`](../editor/material-editor.md). Reflexos: [`reflections.md`](reflections.md).
