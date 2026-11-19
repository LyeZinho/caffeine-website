# Pós-processamento

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Rendering</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 29 · Dryad 0</span>
</div>

<p class="doc-lede">Efeitos de pós-processamento por entidade, como bloom, vinheta, correção de cor e nevoeiro, com presets e acesso a campos por caminho.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.postprocess`

## has

Lua: `caffeine.postprocess.has`

```
has(entity) -> boolean
```

Verifica se a entidade tem um componente de pós-processamento.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true se a entidade tiver um componente de pós-processamento.

**Exemplo**

```lua
if caffeine.postprocess.has(cam) then print('ok') end
```

## add

Lua: `caffeine.postprocess.add`

```
add(entity) -> boolean
```

Adiciona um componente de pós-processamento à entidade, se ainda não tiver.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se a entidade não estiver viva.

**Exemplo**

```lua
caffeine.postprocess.add(cam)
```

## remove

Lua: `caffeine.postprocess.remove`

```
remove(entity)
```

Remove o componente de pós-processamento da entidade, se existir.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.remove(cam)
```

## get

Lua: `caffeine.postprocess.get`

```
get(entity) -> table
```

Devolve uma tabela com o estado completo de pós-processamento.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Uma tabela com grupos de efeitos (por exemplo `bloom`, `vignette`) e os seus campos, mais `enabled`, `customEffectScript` e os aliases `exposure`, `vignetteIntensity`, `bloomIntensity`. Vazia se a entidade não tiver o componente.

**Exemplo**

```lua
local s = caffeine.postprocess.get(cam)
print(s.bloom.intensity)
```

## set

Lua: `caffeine.postprocess.set`

```
set(entity, values) -> boolean
```

Aplica uma tabela de valores ao estado de pós-processamento.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>values</code></td><td>table</td><td>Tabela com o formato do resultado de `get`; só as chaves presentes são aplicadas.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se a entidade não tiver o componente.

**Exemplo**

```lua
caffeine.postprocess.set(cam, { bloom = { intensity = 0.8 } })
```

## getValue

Lua: `caffeine.postprocess.getValue`

```
getValue(entity, path) -> number|boolean|nil
```

Lê um campo pelo seu caminho.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Caminho do campo, por exemplo "bloom.intensity".</td></tr>
</tbody>
</table>

**Devolve:** `number|boolean|nil`. O valor do campo, ou nil se a entidade ou o campo não existirem.

**Exemplo**

```lua
print(caffeine.postprocess.getValue(cam, 'bloom.intensity'))
```

## setValue

Lua: `caffeine.postprocess.setValue`

```
setValue(entity, path, value) -> boolean
```

Escreve um campo pelo seu caminho.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Caminho do campo, por exemplo "bloom.intensity".</td></tr>
<tr><td><code>value</code></td><td>number|boolean</td><td>Novo valor.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true se o campo foi alterado.

**Exemplo**

```lua
caffeine.postprocess.setValue(cam, 'bloom.threshold', 1.0)
```

## effects

Lua: `caffeine.postprocess.effects`

```
effects() -> table
```

Lista os nomes dos efeitos de pós-processamento disponíveis.

**Devolve:** `table`. Lista de nomes de efeitos.

**Exemplo**

```lua
for _, name in ipairs(caffeine.postprocess.effects()) do print(name) end
```

## fields

Lua: `caffeine.postprocess.fields`

```
fields(effect) -> table
```

Lista os campos de um efeito com os respetivos intervalos e tipos.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>effect</code></td><td>string</td><td>Nome do efeito, por exemplo "bloom".</td></tr>
</tbody>
</table>

**Devolve:** `table`. Lista de tabelas com `name`, `min`, `max` e `type` ("bool", "int" ou "number").

**Exemplo**

```lua
for _, f in ipairs(caffeine.postprocess.fields('bloom')) do print(f.name, f.min, f.max) end
```

## setEnabled

Lua: `caffeine.postprocess.setEnabled`

```
setEnabled(entity, enabled)
```

Liga ou desliga todo o componente de pós-processamento.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Interruptor geral.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setEnabled(cam, false)
```

## enableEffect

Lua: `caffeine.postprocess.enableEffect`

```
enableEffect(entity, effect, enabled) -> boolean
```

Liga ou desliga um único efeito.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>effect</code></td><td>string</td><td>Nome do efeito, por exemplo "bloom".</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Se o efeito fica ligado.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true se o efeito existir.

**Exemplo**

```lua
caffeine.postprocess.enableEffect(cam, 'bloom', true)
```

## isEffectEnabled

Lua: `caffeine.postprocess.isEffectEnabled`

```
isEffectEnabled(entity, effect) -> boolean
```

Verifica se um efeito está ligado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>effect</code></td><td>string</td><td>Nome do efeito, por exemplo "bloom".</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true se o efeito estiver ligado; false se estiver desligado ou for desconhecido.

**Exemplo**

```lua
print(caffeine.postprocess.isEffectEnabled(cam, 'bloom'))
```

## applyPreset

Lua: `caffeine.postprocess.applyPreset`

```
applyPreset(entity, name) -> boolean
```

Aplica um preset de pós-processamento incluído.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Um de "cinematic", "horror", "arcade", "reset" (ou "default").</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false para um preset desconhecido ou componente em falta.

**Exemplo**

```lua
caffeine.postprocess.applyPreset(cam, 'cinematic')
```

## blend

Lua: `caffeine.postprocess.blend`

```
blend(entity, from, to, t) -> boolean
```

Interpola entre duas tabelas de valores (cada uma aplicada sobre o estado atual) e guarda o resultado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>from</code></td><td>table</td><td>Tabela de valores para o estado inicial.</td></tr>
<tr><td><code>to</code></td><td>table</td><td>Tabela de valores para o estado final.</td></tr>
<tr><td><code>t</code></td><td>number</td><td>Fator de mistura, limitado a 0..1.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se a entidade não tiver o componente.

**Exemplo**

```lua
caffeine.postprocess.blend(cam, { bloom = { intensity = 0 } }, { bloom = { intensity = 1 } }, 0.5)
```

## setExposure

Lua: `caffeine.postprocess.setExposure`

```
setExposure(entity, exposure)
```

Define a exposição da correção de cor e ativa-a.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>exposure</code></td><td>number</td><td>Valor de exposição.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setExposure(cam, 1.2)
```

## setColorGrading

Lua: `caffeine.postprocess.setColorGrading`

```
setColorGrading(entity, contrast, saturation, temperature, tint)
```

Define valores de correção de cor e ativa-a.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>contrast</code></td><td>number</td><td>Contraste.</td></tr>
<tr><td><code>saturation</code></td><td>number</td><td>Saturação.</td></tr>
<tr><td><code>temperature</code></td><td>number</td><td>Temperatura de cor. Opcional.</td></tr>
<tr><td><code>tint</code></td><td>number</td><td>Matiz. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setColorGrading(cam, 1.1, 0.9)
```

## setBloom

Lua: `caffeine.postprocess.setBloom`

```
setBloom(entity, intensity, threshold)
```

Define a intensidade do bloom e, opcionalmente, o limiar.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensidade do bloom; o efeito fica ativo acima de 0.001.</td></tr>
<tr><td><code>threshold</code></td><td>number</td><td>Limiar de brilho. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setBloom(cam, 0.6, 1.0)
```

## setVignette

Lua: `caffeine.postprocess.setVignette`

```
setVignette(entity, intensity)
```

Define a intensidade da vinheta.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensidade; ativo acima de 0.001.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setVignette(cam, 0.4)
```

## setChromaticAberration

Lua: `caffeine.postprocess.setChromaticAberration`

```
setChromaticAberration(entity, intensity)
```

Define a intensidade da aberração cromática.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensidade; ativo acima de 0.001.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setChromaticAberration(cam, 0.2)
```

## setGrain

Lua: `caffeine.postprocess.setGrain`

```
setGrain(entity, intensity)
```

Define a intensidade do grão de película.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensidade; ativo acima de 0.001.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setGrain(cam, 0.1)
```

## setLensDistortion

Lua: `caffeine.postprocess.setLensDistortion`

```
setLensDistortion(entity, intensity)
```

Define a intensidade da distorção de lente.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensidade; ativo quando o valor absoluto é superior a 0.001.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setLensDistortion(cam, -0.1)
```

## setMotionBlur

Lua: `caffeine.postprocess.setMotionBlur`

```
setMotionBlur(entity, intensity)
```

Define a intensidade do desfoque de movimento.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensidade; ativo acima de 0.001.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setMotionBlur(cam, 0.5)
```

## setDepthOfField

Lua: `caffeine.postprocess.setDepthOfField`

```
setDepthOfField(entity, focusDistance, aperture)
```

Define o foco e a abertura da profundidade de campo e ativa o efeito.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>focusDistance</code></td><td>number</td><td>Distância de foco.</td></tr>
<tr><td><code>aperture</code></td><td>number</td><td>Abertura.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setDepthOfField(cam, 10, 2.8)
```

## setFog

Lua: `caffeine.postprocess.setFog`

```
setFog(entity, density, r, g, b)
```

Define a densidade do nevoeiro diferido e, opcionalmente, a cor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>density</code></td><td>number</td><td>Densidade do nevoeiro; ativo acima de 0.001.</td></tr>
<tr><td><code>r</code></td><td>number</td><td>Vermelho; a cor só é aplicada se r, g e b forem todos indicados. Opcional.</td></tr>
<tr><td><code>g</code></td><td>number</td><td>Verde. Opcional.</td></tr>
<tr><td><code>b</code></td><td>number</td><td>Azul. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setFog(cam, 0.02, 0.6, 0.7, 0.8)
```

## setAmbientOcclusion

Lua: `caffeine.postprocess.setAmbientOcclusion`

```
setAmbientOcclusion(entity, intensity, radius)
```

Define a intensidade da oclusão ambiente e, opcionalmente, o raio.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>intensity</code></td><td>number</td><td>Intensidade; ativo acima de 0.001.</td></tr>
<tr><td><code>radius</code></td><td>number</td><td>Raio de amostragem. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setAmbientOcclusion(cam, 1.0, 0.5)
```

## setAntiAliasing

Lua: `caffeine.postprocess.setAntiAliasing`

```
setAntiAliasing(entity, mode)
```

Seleciona o modo de anti-aliasing; "off" e "none" desativam-no.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>mode</code></td><td>string</td><td>"fxaa", "off" ou "none"; qualquer outro valor seleciona o modo que não é FXAA.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setAntiAliasing(cam, 'fxaa')
```

## setAutoExposure

Lua: `caffeine.postprocess.setAutoExposure`

```
setAutoExposure(entity, enabled, compensation)
```

Liga ou desliga a exposição automática e, opcionalmente, define a compensação.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>enabled</code></td><td>boolean</td><td>Liga ou desliga a exposição automática.</td></tr>
<tr><td><code>compensation</code></td><td>number</td><td>Compensação de exposição. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setAutoExposure(cam, true, 0.5)
```

## setCustomScript

Lua: `caffeine.postprocess.setCustomScript`

```
setCustomScript(entity, path)
```

Define o script de efeito personalizado da entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
<tr><td><code>path</code></td><td>string</td><td>Caminho do script de efeito personalizado.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.postprocess.setCustomScript(cam, 'scripts/fx.lua')
```

## handle

Lua: `caffeine.postprocess.handle`

```
handle(entity) -> table
```

Devolve um handle por entidade, do mesmo tipo passado a `onPostProcess`, para que as chamadas não precisem do id.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Tabela com `entity`, `get`, `set`, `enable`, `isEnabled`, `snapshot`, `apply` e `preset`, todas ligadas à entidade.

**Exemplo**

```lua
local h = caffeine.postprocess.handle(cam)
h.set('bloom.intensity', 0.5)
```
