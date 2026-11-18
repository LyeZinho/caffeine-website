# 🎨 Post-Processing Stack

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/PostProcessStack.cpp"><code>render/PostProcessStack.cpp</code></a></span>
</div>

<p class="doc-lede">Pós-processamento modular em entidades de câmara: cada efeito é um
interruptor independente com os seus parâmetros, e câmaras sem componente recebem os defaults.</p>

> **Component:** `PostProcessComponent` on camera entities  
> **Plugin:** `post_processing_plugin.so` (UI + presets; execution is in the engine)  
> **Lua API:** `caffeine.postprocess.*`  
> **GPU:** `Render::PostProcessStack` (HDR scene → bloom/SSAO/DoF/TAA/tonemap → RGBA8)

---

## Filosofia

O stack é **modular** — cada efeito é um módulo independente com toggle e parâmetros. Presets (Cinematic, Horror, Arcade) são **benchmark looks** opcionais, não tipos de jogo.

Câmaras sem `PostProcessComponent` usam `PostProcessStack::defaults()` (TAA + color grading + SSAO suave).

---

## Módulos de efeito

| Módulo | Categoria | Parâmetros principais |
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

Todos os campos são expostos em Lua como `"efeito.campo"` (ver `src/caffeine/ecs/PostProcessFields.hpp`).

---

## Editor

1. Selecionar entidade **Camera2D** ou **Camera3D**
2. Menu **Effects → Add Post Process to Camera** ou botão no painel
3. Ativar módulos individualmente na secção correspondente
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

Conveniência: `setExposure`, `setBloom`, `setVignette`, `setFog`, `setAmbientOcclusion`, `setAntiAliasing("taa"|"fxaa"|"off")`, etc.

Descoberta: `caffeine.postprocess.effects()` e `caffeine.postprocess.fields("bloom")`.

### Efeitos custom (Lua)

Definir `customEffectScript` no componente. Em play mode o engine chama:

- `onCreate(entityId)` uma vez
- `onPostProcess(entityId, dt, api)` cada frame (`api` = `caffeine.postprocess.handle(entityId)`)

Fallback: se não existir `onPostProcess`, usa `onUpdate(entityId, dt)`.

Template: `assets/plugins/post_processing/scripts/custom_effect.lua`

---

## Ficheiros

| Ficheiro | Função |
|----------|--------|
| `src/caffeine/ecs/PostProcessComponents.hpp` | Structs por efeito |
| `src/caffeine/ecs/PostProcessFields.hpp` | Tabela de reflexão effect.field |
| `include/caffeine/postprocess/PostProcessEditorUI.hpp` | UI ImGui partilhada |
| `include/caffeine/postprocess/PostProcessPresets.hpp` | Benchmark looks |
| `src/caffeine/render/PostProcessStack.cpp` | Passes GPU |
| `src/caffeine/render/PostProcessRenderer.hpp` | Resolve componente na câmara |
| `src/caffeine/script/PostProcessBindings.cpp` | Lua API |
| `src/caffeine/script/ScriptSystem.cpp` | Executa `customEffectScript` em play mode |
