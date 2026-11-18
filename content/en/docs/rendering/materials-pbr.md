# Materiais PBR (forward)

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>File:</strong> `.mat` (`CAFMAT3`; `CAFMAT1`/`CAFMAT2` still load)</span>
  <span><strong>Core:</strong> `MaterialSurface` , `MaterialFile` , `MaterialCache`</span>
  <span><strong>Shader:</strong> `scene_lit.frag`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/assets/MaterialTypes.hpp"><code>assets/MaterialTypes.hpp</code></a></span>
</div>

<p class="doc-lede">The <code>.mat</code> surface the forward pass consumes — metallic, roughness,
emission, maps and the advanced lobes — and where to edit it.</p>

> **Editor:** Material Editor

The viewport ceases to ignore the material assigned to the mesh. O `.mat` it is the surface that the forward pass already consumes: albedo, metallic, roughness, emission and maps. The old node graph compiled GLSL that the `GpuSceneRenderer` nunca executava.

## Parameters

| Campo | Efeito |
|-------|--------|
| Albedo | Multiplica a textura de albedo |
| Metallic / Roughness | GGX e IBL. Um mapa ORM substitui os dois sliders por texel |
| Reflectance | F0 of dielectrics in `scene_lit` (por defeito 0.04). Metais usam o albedo |
| Emission | Colour × force, added before tone map |
| Albedo Map / Normal Map | Used when the mesh has no texture of its own |
| ORM Map | R occlusion, G roughness, B metallic |
| UV tiling / offset | Multiplica coordenadas no vertex shader |
| Alpha mode | Opaque, Cutout ( `alphaCutoff` ), Blend (separate pass + opaque copy) |
| Transmission / IOR | Glass: refract + Fresnel; Typical glass IOR 1.5 |
| Clear coat | Segunda lobe GGX |
| Sheen | Tecidos (cor + roughness) |
| Iridescence | Filme fino (espessura nm, IOR filme) |
| Emission map | sRGB→linear, × `emissionStrength` |

The map of the mesh (Albedo Texture / Normal Map in the inspector) continues ahead of the material map. Metallic and roughness of the file win to the built-in glTF material.

Presets nomeados: `src/caffeine/assets/MaterialPresets.hpp` (Mirror, Chrome, Clear Glass, ...).

## Onde editar

- Asset Browser → create Material, open the `.mat` .
- Inspector → Mesh Filter → Material in primitive and custom meshes. **Edit Material** opens the panel.
- The sliders publish to `MaterialCache` immediately. **File → Save** writes `CAFMAT3`. The scene stamp includes the cache revision, so the viewport redraws without orbiting the camera.

`CAFMAT1` files open with the header albedo, metallic and roughness. The node graph is no longer evaluated.

## Preview

The Material Editor sphere is designed by `GpuSceneRenderer` ( `Render::MaterialPreviewRenderer` ), com o mesmo `scene_lit` , HDR, TAA, post-processing, scene sky and reflection probe. **Orbit**, **Height** and **Floor** control the camera and floor. Panel documentation: [`../editor/material-editor.md`](../editor/material-editor.md). Reflexos: [`reflections.md`](reflections.md).
