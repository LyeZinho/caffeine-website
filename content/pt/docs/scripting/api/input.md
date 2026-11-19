# Entrada

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Input</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 7 · Dryad 9</span>
</div>

<p class="doc-lede">Teclado, eixos e ações mapeados e o rato. O Dryad espelha-os com as natives caffeine_input_*.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.input` · Dryad prefix: `caffeine_input_`

## isKeyDown

Lua: `caffeine.input.isKeyDown` · Dryad: `caffeine_input_key_down`

```
isKeyDown(name) -> boolean
```

Verifica se uma tecla do teclado está premida.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Nome da tecla, como "Space", "W", "Up", "LShift", "Escape", "0"-"9".</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro enquanto a tecla está premida; falso para um nome desconhecido ou sem entrada.

**Exemplo**

```lua
if caffeine.input.isKeyDown('Space') then end
```

## getAxis

Lua: `caffeine.input.getAxis` · Dryad: `caffeine_input_axis`

```
getAxis(name) -> number
```

Lê um eixo de entrada mapeado.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Eixo: Horizontal, Vertical, LookX, LookY.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor do eixo; 0 para um nome desconhecido ou sem entrada.

**Exemplo**

```lua
local h = caffeine.input.getAxis('Horizontal')
```

## isActionDown

Lua: `caffeine.input.isActionDown` · Dryad: `caffeine_input_action_down`

```
isActionDown(name) -> boolean
```

Verifica se uma ação mapeada está ativa.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Ação: MoveUp, MoveDown, MoveLeft, MoveRight, Jump, Attack, Interact, Pause.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro enquanto a ação está ativa.

**Exemplo**

```lua
if caffeine.input.isActionDown('Jump') then end
```

## isActionPressed

Lua: `caffeine.input.isActionPressed` · Dryad: `caffeine_input_action_pressed`

```
isActionPressed(name) -> boolean
```

Verifica se uma ação mapeada acabou de ser premida neste frame.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>name</code></td><td>string</td><td>Ação: MoveUp, MoveDown, MoveLeft, MoveRight, Jump, Attack, Interact, Pause.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro apenas no frame em que a ação começou.

**Exemplo**

```lua
if caffeine.input.isActionPressed('Attack') then end
```

## mouseDelta

Lua: `caffeine.input.mouseDelta`

```
mouseDelta() -> number, number
```

Movimento do rato desde o frame anterior. Devolve dois valores, não uma tabela.

**Devolve:** `number, number`. dx, dy (dois valores de retorno).

**Exemplo**

```lua
local dx, dy = caffeine.input.mouseDelta()
```

## mousePosition

Lua: `caffeine.input.mousePosition`

```
mousePosition() -> number, number
```

Posição do rato conforme indicada pelo gestor de entrada. Devolve dois valores, não uma tabela.

**Devolve:** `number, number`. x, y (dois valores de retorno).

**Exemplo**

```lua
local mx, my = caffeine.input.mousePosition()
```

## isMouseButtonDown

Lua: `caffeine.input.isMouseButtonDown` · Dryad: `caffeine_input_mouse_down`

```
isMouseButtonDown(button) -> boolean
```

Verifica se um botão do rato está premido.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>button</code></td><td>integer</td><td>1 esquerdo, 2 do meio, 3 direito.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro enquanto premido; falso para qualquer outro número.

**Exemplo**

```lua
if caffeine.input.isMouseButtonDown(1) then end
```

## caffeine_input_mouse_x

Lua: indisponível · Dryad: `caffeine_input_mouse_x`

```
caffeine_input_mouse_x() -> number
```

Apenas Dryad: rato, posição x.

**Devolve:** `number`. Rato: posição x; 0 sem entrada.

**Exemplo**

```dryad
let v = caffeine_input_mouse_x();
```

## caffeine_input_mouse_y

Lua: indisponível · Dryad: `caffeine_input_mouse_y`

```
caffeine_input_mouse_y() -> number
```

Apenas Dryad: rato, posição y.

**Devolve:** `number`. Rato: posição y; 0 sem entrada.

**Exemplo**

```dryad
let v = caffeine_input_mouse_y();
```

## caffeine_input_mouse_dx

Lua: indisponível · Dryad: `caffeine_input_mouse_dx`

```
caffeine_input_mouse_dx() -> number
```

Apenas Dryad: rato, movimento x desde o frame anterior.

**Devolve:** `number`. Rato: movimento x desde o frame anterior; 0 sem entrada.

**Exemplo**

```dryad
let v = caffeine_input_mouse_dx();
```

## caffeine_input_mouse_dy

Lua: indisponível · Dryad: `caffeine_input_mouse_dy`

```
caffeine_input_mouse_dy() -> number
```

Apenas Dryad: rato, movimento y desde o frame anterior.

**Devolve:** `number`. Rato: movimento y desde o frame anterior; 0 sem entrada.

**Exemplo**

```dryad
let v = caffeine_input_mouse_dy();
```
