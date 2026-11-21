# Aleatório

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 5 · Dryad 5</span>
</div>

<p class="doc-lede">Um gerador determinístico: a mesma semente dá sempre a mesma sequência, em todas as plataformas.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.random` · Dryad prefix: `caffeine_random_`

## setSeed

Lua: `caffeine.random.setSeed` · Dryad: `caffeine_random_set_seed`

```
setSeed(seed)
```

Reinicia a sequência.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>seed</code></td><td>number</td><td>Qualquer inteiro; 0 é substituído por um valor fixo.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.random.setSeed(1234)
```

## value

Lua: `caffeine.random.value` · Dryad: `caffeine_random_value`

```
value() -> number
```

Próximo número aleatório.

**Devolve:** `number`. Um número em [0, 1).

**Exemplo**

```lua
local r = caffeine.random.value()
```

## range

Lua: `caffeine.random.range` · Dryad: `caffeine_random_range`

```
range(min, max) -> number
```

Um número aleatório num intervalo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>min</code></td><td>number</td><td>Limite inferior (inclusivo).</td></tr>
<tr><td><code>max</code></td><td>number</td><td>Limite superior (exclusivo).</td></tr>
</tbody>
</table>

**Devolve:** `number`. Um número em [min, max).

**Exemplo**

```lua
local x = caffeine.random.range(-5, 5)
```

## int

Lua: `caffeine.random.int` · Dryad: `caffeine_random_int`

```
int(min, max) -> number
```

Um inteiro aleatório, com os dois extremos incluídos.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>min</code></td><td>number</td><td>Limite inferior (inclusivo).</td></tr>
<tr><td><code>max</code></td><td>number</td><td>Limite superior (inclusivo); limites invertidos são trocados.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Um inteiro em [min, max].

**Exemplo**

```lua
local roll = caffeine.random.int(1, 6)
```

## chance

Lua: `caffeine.random.chance` · Dryad: `caffeine_random_chance`

```
chance(p) -> boolean
```

Um cara ou coroa com pesos.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>p</code></td><td>number</td><td>Probabilidade de 0 a 1.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true com probabilidade p.

**Exemplo**

```lua
if caffeine.random.chance(0.25) then end
```
