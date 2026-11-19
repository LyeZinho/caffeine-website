# Matemática

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 23 · Dryad 0</span>
</div>

<p class="doc-lede">Tabelas de vetor ({x, y[, z]}), auxiliares escalares e conversão de ângulos. Define também as constantes caffeine.math.pi e caffeine.math.epsilon (1e-5).</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.math`

## vec2

Lua: `caffeine.math.vec2`

```
vec2(x, y) -> table
```

Cria uma tabela de vetor 2D.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {x, y}

**Exemplo**

```lua
local v = caffeine.math.vec2(1, 2)
```

## vec3

Lua: `caffeine.math.vec3`

```
vec3(x, y, z) -> table
```

Cria uma tabela de vetor 3D.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {x, y, z}

**Exemplo**

```lua
local v = caffeine.math.vec3(1, 2, 3)
```

## add

Lua: `caffeine.math.add`

```
add(a, b) -> table
```

Soma componente a componente de dois vetores.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Tabela de vetor; só tem z se um operando tiver z.

**Exemplo**

```lua
local p = caffeine.math.add(a, b)
```

## sub

Lua: `caffeine.math.sub`

```
sub(a, b) -> table
```

Diferença componente a componente a - b.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Tabela de vetor; só tem z se um operando tiver z.

**Exemplo**

```lua
local d = caffeine.math.sub(a, b)
```

## mul

Lua: `caffeine.math.mul`

```
mul(a, b) -> table
```

Produto componente a componente de dois vetores (não é o produto escalar).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Tabela de vetor; só tem z se um operando tiver z.

**Exemplo**

```lua
local m = caffeine.math.mul(a, b)
```

## scale

Lua: `caffeine.math.scale`

```
scale(v, s) -> table
```

Multiplica um vetor por um escalar.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>s</code></td><td>number</td><td>Fator escalar.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Vetor escalado.

**Exemplo**

```lua
local v2 = caffeine.math.scale(v, 2)
```

## dot

Lua: `caffeine.math.dot`

```
dot(a, b) -> number
```

Produto escalar de dois vetores; um z em falta conta como 0.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Produto escalar.

**Exemplo**

```lua
local d = caffeine.math.dot(a, b)
```

## cross

Lua: `caffeine.math.cross`

```
cross(a, b) -> table
```

Produto vetorial; o resultado é sempre 3D.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Vetor {x, y, z}.

**Exemplo**

```lua
local n = caffeine.math.cross(a, b)
```

## length

Lua: `caffeine.math.length`

```
length(v) -> number
```

Comprimento de um vetor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Comprimento do vetor.

**Exemplo**

```lua
local l = caffeine.math.length(v)
```

## lengthSquared

Lua: `caffeine.math.lengthSquared`

```
lengthSquared(v) -> number
```

Comprimento ao quadrado de um vetor, sem a raiz quadrada.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Comprimento ao quadrado.

**Exemplo**

```lua
local l2 = caffeine.math.lengthSquared(v)
```

## distance

Lua: `caffeine.math.distance`

```
distance(a, b) -> number
```

Distância entre dois pontos.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Distância entre os pontos.

**Exemplo**

```lua
local d = caffeine.math.distance(a, b)
```

## normalize

Lua: `caffeine.math.normalize`

```
normalize(v) -> table
```

Devolve o vetor escalado para comprimento 1.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Vetor unitário, ou zeros se o comprimento for no máximo 0.0001.

**Exemplo**

```lua
local dir = caffeine.math.normalize(caffeine.math.sub(b, a))
```

## lerpVec

Lua: `caffeine.math.lerpVec`

```
lerpVec(a, b, t) -> table
```

Interpolação linear entre dois vetores.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>b</code></td><td>table</td><td>Tabela de vetor {x, y[, z]}.</td></tr>
<tr><td><code>t</code></td><td>number</td><td>Fator de mistura; não é limitado.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Tabela de vetor; só tem z se um operando tiver z.

**Exemplo**

```lua
local mid = caffeine.math.lerpVec(a, b, 0.5)
```

## clamp

Lua: `caffeine.math.clamp`

```
clamp(v, lo, hi) -> number
```

Limita um valor a um intervalo; limites trocados são aceites.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Valor.</td></tr>
<tr><td><code>lo</code></td><td>number</td><td>Limite inferior.</td></tr>
<tr><td><code>hi</code></td><td>number</td><td>Limite superior.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor limitado.

**Exemplo**

```lua
local hp = caffeine.math.clamp(hp, 0, 100)
```

## clamp01

Lua: `caffeine.math.clamp01`

```
clamp01(v) -> number
```

Limita um valor a 0..1.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Valor.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor limitado a 0..1.

**Exemplo**

```lua
local t = caffeine.math.clamp01(t)
```

## lerp

Lua: `caffeine.math.lerp`

```
lerp(a, b, t) -> number
```

Interpolação linear entre dois números.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>number</td><td>Início.</td></tr>
<tr><td><code>b</code></td><td>number</td><td>Fim.</td></tr>
<tr><td><code>t</code></td><td>number</td><td>Fator de mistura; não é limitado.</td></tr>
</tbody>
</table>

**Devolve:** `number`. a + (b - a) * t

**Exemplo**

```lua
local x = caffeine.math.lerp(0, 10, 0.25)
```

## inverseLerp

Lua: `caffeine.math.inverseLerp`

```
inverseLerp(a, b, v) -> number
```

O inverso de lerp; o resultado não é limitado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>number</td><td>Início.</td></tr>
<tr><td><code>b</code></td><td>number</td><td>Fim.</td></tr>
<tr><td><code>v</code></td><td>number</td><td>Valor.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Posição de v entre a e b; 0 se a e b forem iguais.

**Exemplo**

```lua
local t = caffeine.math.inverseLerp(0, 10, 5)
```

## remap

Lua: `caffeine.math.remap`

```
remap(v, inLo, inHi, outLo, outHi) -> number
```

Mapeia um valor de um intervalo para outro.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Valor.</td></tr>
<tr><td><code>inLo</code></td><td>number</td><td>Início do intervalo de entrada.</td></tr>
<tr><td><code>inHi</code></td><td>number</td><td>Fim do intervalo de entrada.</td></tr>
<tr><td><code>outLo</code></td><td>number</td><td>Início do intervalo de saída.</td></tr>
<tr><td><code>outHi</code></td><td>number</td><td>Fim do intervalo de saída.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor remapeado (não limitado).

**Exemplo**

```lua
local pct = caffeine.math.remap(hp, 0, 100, 0, 1)
```

## smoothstep

Lua: `caffeine.math.smoothstep`

```
smoothstep(e0, e1, v) -> number
```

Interpolação suave de Hermite entre dois limites.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>e0</code></td><td>number</td><td>Limite inferior.</td></tr>
<tr><td><code>e1</code></td><td>number</td><td>Limite superior.</td></tr>
<tr><td><code>v</code></td><td>number</td><td>Valor.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor suave entre 0 e 1.

**Exemplo**

```lua
local s = caffeine.math.smoothstep(0, 1, t)
```

## approach

Lua: `caffeine.math.approach`

```
approach(cur, target, step) -> number
```

Move um valor para um alvo em no máximo step.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>cur</code></td><td>number</td><td>Valor atual.</td></tr>
<tr><td><code>target</code></td><td>number</td><td>Valor alvo.</td></tr>
<tr><td><code>step</code></td><td>number</td><td>Mudança máxima; usa-se o valor absoluto.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Novo valor, nunca além do alvo.

**Exemplo**

```lua
speed = caffeine.math.approach(speed, 0, 20 * caffeine.time.delta())
```

## sign

Lua: `caffeine.math.sign`

```
sign(v) -> number
```

Sinal de um número.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>v</code></td><td>number</td><td>Valor.</td></tr>
</tbody>
</table>

**Devolve:** `number`. -1, 0 ou 1.

**Exemplo**

```lua
local s = caffeine.math.sign(-3)
```

## radians

Lua: `caffeine.math.radians`

```
radians(deg) -> number
```

Converte graus em radianos.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>deg</code></td><td>number</td><td>Graus.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Radianos.

**Exemplo**

```lua
local r = caffeine.math.radians(90)
```

## degrees

Lua: `caffeine.math.degrees`

```
degrees(rad) -> number
```

Converte radianos em graus.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>rad</code></td><td>number</td><td>Radianos.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Graus.

**Exemplo**

```lua
local d = caffeine.math.degrees(caffeine.math.pi)
```
