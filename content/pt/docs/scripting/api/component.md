# Componente

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 9 · Dryad 14</span>
</div>

<p class="doc-lede">Acesso genérico a todos os componentes descritos no registo de reflexão: listar, adicionar, remover, ler e escrever campos pelo nome.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.component` · Dryad prefix: `caffeine_component_`

## list

Lua: `caffeine.component.list` · Dryad: `caffeine_component_list`

```
list() -> table
```

Lista todos os tipos de componente descritos no registo de reflexão, com os campos. Em Dryad devolve apenas os nomes.

**Devolve:** `table`. Lista de {name, id, fields}; cada campo tem name, kind, min, max e options (enums).

**Exemplo**

```lua
for _, c in ipairs(caffeine.component.list()) do caffeine.debug.log(c.name) end
```

## names

Lua: `caffeine.component.names` · Dryad: `caffeine_component_names`

```
names(entity) -> table
```

Lista os componentes que a entidade tem. Dá erro se a entidade não existir.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Lista de nomes de componentes.

**Exemplo**

```lua
local names = caffeine.component.names(e)
```

## has

Lua: `caffeine.component.has` · Dryad: `caffeine_component_has`

```
has(entity, name) -> boolean
```

Verifica se uma entidade tem um componente. Dá erro para um nome de componente desconhecido.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro se a entidade tiver o componente.

**Exemplo**

```lua
if caffeine.component.has(e, 'Rigid Body 3D') then end
```

## add

Lua: `caffeine.component.add` · Dryad: `caffeine_component_add`

```
add(entity, name) -> boolean
```

Adiciona um componente com valores por omissão; não faz nada se a entidade já o tiver. Em Dryad devolve false e regista um erro em caso de falha.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true em caso de sucesso.

**Exemplo**

```lua
caffeine.component.add(e, 'Rigid Body 3D')
```

## remove

Lua: `caffeine.component.remove` · Dryad: `caffeine_component_remove`

```
remove(entity, name) -> boolean
```

Remove um componente de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro se o componente foi removido, falso se a entidade não o tinha.

**Exemplo**

```lua
caffeine.component.remove(e, 'Rigid Body 3D')
```

## get

Lua: `caffeine.component.get` · Dryad: `caffeine_component_get`

```
get(entity, name) -> table|nil
```

Lê todos os campos de um componente. Os vetores são {x, y, z}; cores e vetores 4D também têm r, g, b, a; os enums são nomes de opção.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Tabela com todos os campos, ou nil se a entidade não tiver o componente.

**Exemplo**

```lua
local rb = caffeine.component.get(e, 'Rigid Body 3D')
```

## getField

Lua: `caffeine.component.getField` · Dryad: `caffeine_component_get_field`

```
getField(entity, name, field) -> any
```

Lê um campo. Dá erro para componente ou campo desconhecido, ou se a entidade não tiver o componente (o Dryad regista o erro e devolve null).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Nome do campo.</td></tr>
</tbody>
</table>

**Devolve:** `any`. O valor do campo.

**Exemplo**

```lua
local mass = caffeine.component.getField(e, 'Rigid Body 3D', 'Mass')
```

## setField

Lua: `caffeine.component.setField` · Dryad: `caffeine_component_set_field`

```
setField(entity, name, field, value)
```

Escreve um campo. A entidade já tem de ter o componente (use `caffeine.component.add`); um tipo de valor errado provoca erro.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Nome do campo.</td></tr>
<tr><td><code>value</code></td><td>any</td><td>Novo valor: número, booleano, texto, nome ou índice de opção de enum, ou tabela de vetor.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.component.setField(e, 'Rigid Body 3D', 'Mass', 7.5)
```

## set

Lua: `caffeine.component.set` · Dryad: `caffeine_component_set`

```
set(entity, name, values)
```

Adiciona o componente se não existir e escreve os campos indicados.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>values</code></td><td>table</td><td>Mapa de nome de campo para valor; os campos omitidos mantêm o valor.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.component.set(e, 'Rigid Body 3D', { Mass = 3 })
```

## caffeine_component_get_number

Lua: indisponível · Dryad: `caffeine_component_get_number`

```
caffeine_component_get_number(entity, name, field[, index]) -> number
```

Apenas Dryad: lê um campo numérico, booleano ou de enum, ou uma parte de um vetor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Nome do campo.</td></tr>
<tr><td><code>index</code></td><td>integer</td><td>Parte do vetor (0 = x); por omissão 0.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Número; inteiros, índices de enum e booleanos voltam como inteiro/booleano. null em caso de erro.

**Exemplo**

```dryad
let mass = caffeine_component_get_number(entity, "Rigid Body 3D", "Mass");
```

## caffeine_component_set_number

Lua: indisponível · Dryad: `caffeine_component_set_number`

```
caffeine_component_set_number(entity, name, field, value[, index]) -> boolean
```

Apenas Dryad: escreve um campo numérico, booleano ou índice de enum, ou uma parte de um vetor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Nome do campo.</td></tr>
<tr><td><code>value</code></td><td>number</td><td>Número (ou booleano).</td></tr>
<tr><td><code>index</code></td><td>integer</td><td>Parte do vetor (0 = x); por omissão 0.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro em caso de sucesso.

**Exemplo**

```dryad
caffeine_component_set_number(entity, "Rigid Body 3D", "Mass", 7.5);
```

## caffeine_component_set_vec

Lua: indisponível · Dryad: `caffeine_component_set_vec`

```
caffeine_component_set_vec(entity, name, field, x, y[, z[, w]]) -> boolean
```

Apenas Dryad: escreve um campo inteiro de vetor ou cor a partir das suas partes.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Nome do campo.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>Primeira parte.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Segunda parte.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Terceira parte (opcional).</td></tr>
<tr><td><code>w</code></td><td>number</td><td>Quarta parte (opcional).</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro se todas as partes foram escritas.

**Exemplo**

```dryad
caffeine_component_set_vec(entity, "Position 3D", "Position", 4, 5, 6);
```

## caffeine_component_get_text

Lua: indisponível · Dryad: `caffeine_component_get_text`

```
caffeine_component_get_text(entity, name, field) -> string
```

Apenas Dryad: lê um campo de texto ou o nome de uma opção de enum.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Nome do campo.</td></tr>
</tbody>
</table>

**Devolve:** `string`. Texto ou rótulo de enum; null em caso de erro.

**Exemplo**

```dryad
let kind = caffeine_component_get_text(entity, "Mesh Filter", "Primitive");
```

## caffeine_component_set_text

Lua: indisponível · Dryad: `caffeine_component_set_text`

```
caffeine_component_set_text(entity, name, field, text) -> boolean
```

Apenas Dryad: escreve um campo de texto ou define um enum pelo nome da opção.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Nome do componente, como listado por `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Nome do campo.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>Texto ou nome de opção de enum.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro em caso de sucesso.

**Exemplo**

```dryad
caffeine_component_set_text(entity, "Mesh Filter", "Primitive", "Cone");
```
