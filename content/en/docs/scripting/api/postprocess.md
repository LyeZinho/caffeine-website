# Post-process

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 29 · Dryad 0</span>
</div>

<p class="doc-lede">Per-entity post-process effects such as bloom, vignette, colour grading and fog, with presets and path-based field access.</p>

[All namespaces](index.md)

Namespace: `caffeine.postprocess`

## has

Lua: `caffeine.postprocess.has`

```
has(entity) -> boolean
```

Checks whether the entity has a post-process component.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true if the entity has a post-process component.

**Example**

```lua
if caffeine.postprocess.has(cam) then print('ok') end
```

## add

Lua: `caffeine.postprocess.add`

```
add(entity) -> boolean
```

Adds a post-process component to the entity if it does not have one.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false if the entity is not alive.

**Example**

```lua
caffeine.postprocess.add(cam)
```

## remove

Lua: `caffeine.postprocess.remove`

```
remove(entity)
```

Removes the post-process component from the entity, if present.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.remove(cam)
```

## get

Lua: `caffeine.postprocess.get`

```
get(entity) -> table
```

Returns a snapshot of the whole post-process state as a table.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. A table of effect groups (for example `bloom`, `vignette`) with their fields, plus `enabled`, `customEffectScript` and the flat aliases `exposure`, `vignetteIntensity`, `bloomIntensity`. Empty if the entity has no component.

**Example**

```lua
local s = caffeine.postprocess.get(cam)
print(s.bloom.intensity)
```

## set

Lua: `caffeine.postprocess.set`

```
set(entity, values) -> boolean
```

Merges a table of values into the post-process state.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>values</code></td><td>table</td><td>Table shaped like the result of `get`; only the keys present are applied.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false if the entity has no component.

**Example**

```lua
caffeine.postprocess.set(cam, { bloom = { intensity = 0.8 } })
```

## getValue

Lua: `caffeine.postprocess.getValue`

```
getValue(entity, path) -> number|boolean|nil
```

Reads one field by path.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Field path such as "bloom.intensity".</td></tr>
</tbody>
</table>

**Returns:** `number|boolean|nil`. The field value, or nil if the entity or field is unknown.

**Example**

```lua
print(caffeine.postprocess.getValue(cam, 'bloom.intensity'))
```

## setValue

Lua: `caffeine.postprocess.setValue`

```
setValue(entity, path, value) -> boolean
```

Writes one field by path.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Field path such as "bloom.intensity".</td></tr>
<tr><td><code>value</code></td><td>number|boolean</td><td>New value.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true if the field was set.

**Example**

```lua
caffeine.postprocess.setValue(cam, 'bloom.threshold', 1.0)
```

## effects

Lua: `caffeine.postprocess.effects`

```
effects() -> table
```

Lists the names of the available post-process effects.

**Returns:** `table`. List of effect names.

**Example**

```lua
for _, name in ipairs(caffeine.postprocess.effects()) do print(name) end
```

## fields

Lua: `caffeine.postprocess.fields`

```
fields(effect) -> table
```

Lists the fields of one effect with their ranges and types.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>effect</code></td><td>string</td><td>Effect name such as "bloom".</td></tr>
</tbody>
</table>

**Returns:** `table`. List of tables with `name`, `min`, `max` and `type` ("bool", "int" or "number").

**Example**

```lua
for _, f in ipairs(caffeine.postprocess.fields('bloom')) do print(f.name, f.min, f.max) end
```

## setEnabled

Lua: `caffeine.postprocess.setEnabled`

```
setEnabled(entity, enabled)
```

Turns the whole post-process component on or off.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Master switch.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setEnabled(cam, false)
```

## enableEffect

Lua: `caffeine.postprocess.enableEffect`

```
enableEffect(entity, effect, enabled) -> boolean
```

Turns a single effect on or off.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>effect</code></td><td>string</td><td>Effect name such as "bloom".</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Whether the effect is on.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true if the effect exists.

**Example**

```lua
caffeine.postprocess.enableEffect(cam, 'bloom', true)
```

## isEffectEnabled

Lua: `caffeine.postprocess.isEffectEnabled`

```
isEffectEnabled(entity, effect) -> boolean
```

Checks whether an effect is enabled.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>effect</code></td><td>string</td><td>Effect name such as "bloom".</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true if the effect is on; false if off or unknown.

**Example**

```lua
print(caffeine.postprocess.isEffectEnabled(cam, 'bloom'))
```

## applyPreset

Lua: `caffeine.postprocess.applyPreset`

```
applyPreset(entity, name) -> boolean
```

Applies a built-in post-process preset.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>One of "cinematic", "horror", "arcade", "reset" (or "default").</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false for an unknown preset or missing component.

**Example**

```lua
caffeine.postprocess.applyPreset(cam, 'cinematic')
```

## blend

Lua: `caffeine.postprocess.blend`

```
blend(entity, from, to, t) -> boolean
```

Interpolates between two tables of values (each applied on top of the current state) and stores the result.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>from</code></td><td>table</td><td>Table of values for the start state.</td></tr>
<tr><td><code>to</code></td><td>table</td><td>Table of values for the end state.</td></tr>
<tr><td><code>t</code></td><td>number</td><td>Blend factor, clamped to 0..1.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false if the entity has no component.

**Example**

```lua
caffeine.postprocess.blend(cam, { bloom = { intensity = 0 } }, { bloom = { intensity = 1 } }, 0.5)
```

## setExposure

Lua: `caffeine.postprocess.setExposure`

```
setExposure(entity, exposure)
```

Sets colour-grading exposure and enables colour grading.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>exposure</code></td><td>number</td><td>Exposure value.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setExposure(cam, 1.2)
```

## setColorGrading

Lua: `caffeine.postprocess.setColorGrading`

```
setColorGrading(entity, contrast, saturation, temperature, tint)
```

Sets colour-grading values and enables colour grading.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>contrast</code></td><td>number</td><td>Contrast.</td></tr>
<tr><td><code>saturation</code></td><td>number</td><td>Saturation.</td></tr>
<tr><td><code>temperature</code></td><td>number</td><td>Colour temperature. Optional.</td></tr>
<tr><td><code>tint</code></td><td>number</td><td>Tint. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setColorGrading(cam, 1.1, 0.9)
```

## setBloom

Lua: `caffeine.postprocess.setBloom`

```
setBloom(entity, intensity, threshold)
```

Sets bloom intensity and optionally the threshold.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Bloom intensity; the effect is enabled when above 0.001.</td></tr>
<tr><td><code>threshold</code></td><td>number</td><td>Brightness threshold. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setBloom(cam, 0.6, 1.0)
```

## setVignette

Lua: `caffeine.postprocess.setVignette`

```
setVignette(entity, intensity)
```

Sets vignette intensity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensity; enabled when above 0.001.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setVignette(cam, 0.4)
```

## setChromaticAberration

Lua: `caffeine.postprocess.setChromaticAberration`

```
setChromaticAberration(entity, intensity)
```

Sets chromatic aberration intensity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensity; enabled when above 0.001.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setChromaticAberration(cam, 0.2)
```

## setGrain

Lua: `caffeine.postprocess.setGrain`

```
setGrain(entity, intensity)
```

Sets film grain intensity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensity; enabled when above 0.001.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setGrain(cam, 0.1)
```

## setLensDistortion

Lua: `caffeine.postprocess.setLensDistortion`

```
setLensDistortion(entity, intensity)
```

Sets lens distortion intensity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensity; enabled when its absolute value is above 0.001.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setLensDistortion(cam, -0.1)
```

## setMotionBlur

Lua: `caffeine.postprocess.setMotionBlur`

```
setMotionBlur(entity, intensity)
```

Sets motion blur intensity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensity; enabled when above 0.001.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setMotionBlur(cam, 0.5)
```

## setDepthOfField

Lua: `caffeine.postprocess.setDepthOfField`

```
setDepthOfField(entity, focusDistance, aperture)
```

Sets depth-of-field focus and aperture and enables the effect.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>focusDistance</code></td><td>number</td><td>Focus distance.</td></tr>
<tr><td><code>aperture</code></td><td>number</td><td>Aperture.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setDepthOfField(cam, 10, 2.8)
```

## setFog

Lua: `caffeine.postprocess.setFog`

```
setFog(entity, density, r, g, b)
```

Sets the deferred fog density and optionally its colour.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>density</code></td><td>number</td><td>Fog density; enabled when above 0.001.</td></tr>
<tr><td><code>r</code></td><td>number</td><td>Red; the colour is applied only if r, g and b are all given. Optional.</td></tr>
<tr><td><code>g</code></td><td>number</td><td>Green. Optional.</td></tr>
<tr><td><code>b</code></td><td>number</td><td>Blue. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setFog(cam, 0.02, 0.6, 0.7, 0.8)
```

## setAmbientOcclusion

Lua: `caffeine.postprocess.setAmbientOcclusion`

```
setAmbientOcclusion(entity, intensity, radius)
```

Sets ambient occlusion intensity and optionally the radius.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensity; enabled when above 0.001.</td></tr>
<tr><td><code>radius</code></td><td>number</td><td>Sampling radius. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setAmbientOcclusion(cam, 1.0, 0.5)
```

## setAntiAliasing

Lua: `caffeine.postprocess.setAntiAliasing`

```
setAntiAliasing(entity, mode)
```

Selects the anti-aliasing mode; "off" and "none" disable it.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>mode</code></td><td>string</td><td>"fxaa", "off" or "none"; any other value selects the non-FXAA mode.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setAntiAliasing(cam, 'fxaa')
```

## setAutoExposure

Lua: `caffeine.postprocess.setAutoExposure`

```
setAutoExposure(entity, enabled, compensation)
```

Toggles auto exposure and optionally sets its compensation.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Turns auto exposure on or off.</td></tr>
<tr><td><code>compensation</code></td><td>number</td><td>Exposure compensation. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setAutoExposure(cam, true, 0.5)
```

## setCustomScript

Lua: `caffeine.postprocess.setCustomScript`

```
setCustomScript(entity, path)
```

Sets the custom effect script of the entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Path of the custom effect script.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.postprocess.setCustomScript(cam, 'scripts/fx.lua')
```

## handle

Lua: `caffeine.postprocess.handle`

```
handle(entity) -> table
```

Returns a per-entity handle, the same kind passed to `onPostProcess`, so calls need no entity id.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. Table with `entity`, `get`, `set`, `enable`, `isEnabled`, `snapshot`, `apply` and `preset`, all bound to the entity.

**Example**

```lua
local h = caffeine.postprocess.handle(cam)
h.set('bloom.intensity', 0.5)
```
