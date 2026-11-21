# Tempo

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 11 · Dryad 9</span>
</div>

<p class="doc-lede">O relógio de jogo: tempo de frame com e sem escala, o passo fixo, pausa e a semente aleatória determinística.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.time` · Dryad prefix: `caffeine_time_`

## delta

Lua: `caffeine.time.delta` · Dryad: `caffeine_time_delta`

```
delta() -> number
```

Tempo de frame a usar para movimento e temporizadores em `onUpdate`.

**Devolve:** `number`. Segundos desde o frame anterior, multiplicados pela escala de tempo (0 em pausa).

**Exemplo**

```lua
local speed = 5
function onUpdate(e, dt)
  local t = caffeine.world.getTransform(e)
  caffeine.world.setTransform(e, { x = t.x + speed * caffeine.time.delta(), y = t.y })
end
```

## setTimeScale

Lua: `caffeine.time.setTimeScale` · Dryad: `caffeine_time_set_scale`

```
setTimeScale(scale)
```

Altera a velocidade do tempo escalado. O tempo sem escala e a UI não são afetados.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>scale</code></td><td>number</td><td>1 = normal, 0.5 = metade da velocidade, 0 = parado.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.time.setTimeScale(0.25) -- slow motion
```

## unscaledDelta

Lua: `caffeine.time.unscaledDelta` · Dryad: `caffeine_time_unscaled_delta`

```
unscaledDelta() -> number
```

Tempo real de frame, não afetado pela escala de tempo nem pela pausa. Use-o para UI e efeitos que devem continuar a correr.

**Devolve:** `number`. Segundos desde o frame anterior, ignorando a escala de tempo.

**Exemplo**

```lua
local real = caffeine.time.unscaledDelta()
```

## time

Lua: `caffeine.time.time` · Dryad: `caffeine_time_total`

```
time() -> number
```

Tempo de jogo total acumulado pelo relógio de jogo.

**Devolve:** `number`. Tempo de jogo escalado em segundos.

**Exemplo**

```lua
caffeine.debug.log('t=' .. caffeine.time.time())
```

## fixedDelta

Lua: `caffeine.time.fixedDelta` · Dryad: `caffeine_time_fixed_delta`

```
fixedDelta() -> number
```

O passo fixo de simulação do relógio de jogo.

**Devolve:** `number`. O passo fixo em segundos (1/60 por omissão).

**Exemplo**

```lua
local step = caffeine.time.fixedDelta()
```

## timeScale

Lua: `caffeine.time.timeScale` · Dryad: `caffeine_time_scale`

```
timeScale() -> number
```

Devolve a escala de tempo atual (1 é a velocidade normal).

**Devolve:** `number`. Escala de tempo atual.

**Exemplo**

```lua
local s = caffeine.time.timeScale()
```

## paused

Lua: `caffeine.time.paused` · Dryad: `caffeine_time_paused`

```
paused() -> boolean
```

Indica se o relógio de jogo está em pausa.

**Devolve:** `boolean`. Verdadeiro enquanto o relógio de jogo está em pausa.

**Exemplo**

```lua
if caffeine.time.paused() then return end
```

## setPaused

Lua: `caffeine.time.setPaused` · Dryad: `caffeine_time_set_paused`

```
setPaused(paused)
```

Pausa ou retoma o relógio de jogo; o delta escalado é 0 em pausa.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>paused</code></td><td>boolean</td><td>Verdadeiro para pausar, falso para retomar.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.time.setPaused(true)
```

## frame

Lua: `caffeine.time.frame` · Dryad: `caffeine_time_frame`

```
frame() -> number
```

Devolve o número de frames avançados pelo relógio de jogo.

**Devolve:** `number`. Contador de frames do relógio de jogo.

**Exemplo**

```lua
local n = caffeine.time.frame()
```

## seed

Lua: `caffeine.time.seed`

```
seed() -> integer
```

Devolve a semente aleatória determinística do relógio de jogo.

**Devolve:** `integer`. Semente aleatória atual.

**Exemplo**

```lua
local s = caffeine.time.seed()
```

## setSeed

Lua: `caffeine.time.setSeed`

```
setSeed(seed)
```

Define a semente aleatória determinística do relógio de jogo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>seed</code></td><td>integer</td><td>Nova semente.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.time.setSeed(1234)
```
