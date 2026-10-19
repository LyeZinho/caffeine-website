# Materiais PBR (forward)

> **Ficheiro:** `.mat` ( `CAFMAT2` , `CAFMAT1` still reads the header)
> **Core:** `MaterialSurface` , `MaterialFile` , `MaterialCache` 
> **Shader:** `scene_lit.frag` 
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

Presets nomeados: `src/assets/MaterialPresets.hpp` (Mirror, Chrome, Clear Glass, ...).

## Onde editar

- Asset Browser → create Material, open the `.mat` .
- Inspector → Mesh Filter → Material in primitive and custom meshes. **Edit Material** opens the panel.
- Os sliders publicam no `MaterialCache` on time. **File → Save** records the `CAFMAT2` . The scene stamp includes the cache revision, so the viewport redesigns without camera orbit.

Ficheiros `CAFMAT1` open with header albedo, metallic and roughness. The graph is no longer evaluated.

## Preview

The Material Editor sphere is designed by `GpuSceneRenderer` ( `Render::MaterialPreviewRenderer` ), com o mesmo `scene_lit` , HDR, TAA, post-processing, scene sky and reflection probe. **Orbit**, **Height** and **Floor** control the camera and floor. Panel documentation: [`../editor/material-editor.md`](../editor/material-editor.md). Reflexos: [`reflections.md`](reflections.md).
