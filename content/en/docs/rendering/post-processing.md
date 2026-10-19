# 🎨 Post-Processing Stack

> **Component:** `PostProcessComponent` on camera entities
> **Plugin:** `post_processing_plugin.so` (UI + presets; execution is in the engine)
> **Lua API:** `caffeine.postprocess.*` 
> **GPU:** `Render::PostProcessStack` (HDR scene → bloom/SSAO/DoF/TAA/tonemap → RGBA8)

---

## Filosofia

The stack is**modular** — each effect is an independent module with toggle and parameters. Presets (Cinematic, Horror, Arcade) are **benchmark looks** optional, not game types.

Cameras without `PostProcessComponent` usam `PostProcessStack::defaults()` (TAA + color grading + SSAO suave).

---

## Effect modules

| Module | Categoria | Main parameters |
|--------|-----------|----------------------|
| **Anti-aliasing** | Pre-processing | FXAA / TAA, sharpness |
| **Ambient occlusion** | Pre-processing | intensity, radius, bias |
| **Auto exposure** | Color | min/max, adaptation speed, compensation |
| **Color grading** | Color | exposure, contrast, saturation, temperature, tint |
| **Bloom** | Image | intensity, threshold, scatter |
| **Depth of field** | Image | focus distance, aperture, focal length, max blur |
| **Motion blur** | Image | intensity, max velocity |
| **Chromatic aberration** | Image | intensity |
| **Lens distortion** | Image | intensity |
| **Grain** | Image | intensity, size |
| **Vignette** | Image | intensity, smoothness |
| **Screen space reflections** | Screen space | intensity, max roughness, max steps |
| **Deferred fog** | Atmosphere | density, start/end, color |

All fields are exposed on Moon as `"efeito.campo"` (ver `src/ecs/PostProcessFields.hpp` ).

---

## Editor

1. Selecionar entidade **Camera2D** ou **Camera3D**
2. Menu **Effects → Add Post Process to Camera** or panel button
3. Enable modules individually in the corresponding section
4. (Opcional) Aplicar benchmark look como ponto de partida

UI partilhada: `include/caffeine/postprocess/PostProcessEditorUI.hpp`

---

## Scripting

### Controlar efeitos em runtime

```lua
caffeine.postprocess.add(cameraId)
caffeine.postprocess.setEnabled(cameraId, true)
caffeine.postprocess.setValue(cameraId, "bloom.intensity", 0.35)
caffeine.postprocess.enableEffect(cameraId, "dof", true)
caffeine.postprocess.applyPreset(cameraId, "cinematic")
local fx = caffeine.postprocess.get(cameraId)          -- tabela aninhada por efeito
local api = caffeine.postprocess.handle(cameraId)      -- handle para scripts custom
caffeine.postprocess.setCustomScript(cameraId, "scripts/postprocessing/custom_effect.lua")
```

Convenience: `setExposure` , `setBloom` , `setVignette` , `setFog` , `setAmbientOcclusion` , `setAntiAliasing("taa"|"fxaa"|"off")` , etc.

Descoberta: `caffeine.postprocess.effects()` e `caffeine.postprocess.fields("bloom")` .

### Efeitos custom (Lua)

Definir `customEffectScript` no componente. Em play mode o engine chama:

- `onCreate(entityId)` uma vez
- `onPostProcess(entityId, dt, api)` cada frame ( `api` = `caffeine.postprocess.handle(entityId)` )

Fallback: if there is no `onPostProcess` , usa `onUpdate(entityId, dt)` .

Template: `assets/plugins/post_processing/scripts/custom_effect.lua`

---

## Ficheiros

| Ficheiro | Function |
|----------|--------|
| `src/ecs/PostProcessComponents.hpp` | Structs por efeito |
| `src/ecs/PostProcessFields.hpp` | Table of reflection effect.field |
| `include/caffeine/postprocess/PostProcessEditorUI.hpp` | UI ImGui partilhada |
| `include/caffeine/postprocess/PostProcessPresets.hpp` | Benchmark looks |
| `src/render/PostProcessStack.cpp` | Passes GPU |
| `src/render/PostProcessRenderer.hpp` | Solves component in camera |
| `src/script/PostProcessBindings.cpp` | Lua API |
| `src/script/ScriptSystem.cpp` | Executa `customEffectScript` em play mode |
