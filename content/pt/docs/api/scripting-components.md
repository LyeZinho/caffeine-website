# Scripting: acesso genérico a componentes

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Atualizado em: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

<p class="doc-lede">O registo de reflexão que expõe cada componente da engine a Lua, Dryad, Inspector e à C ABI.</p>

Cada componente que o motor consegue descrever é scriptável, em **Lua** e em **Dryad**, através de um registo de
reflexão partilhado (`src/caffeine/scene/ComponentReflection.*`). O inspector do editor, a C ABI e as duas linguagens
leem a mesma tabela, por isso um componente registado uma vez fica disponível em todo o lado, com os seus campos,
intervalos e opções de enum. `ComponentAccess.*` é a camada independente de linguagem usada pelos hosts de scripting.

Os nomes de componentes e campos são comparados **sem distinguir maiúsculas e ignorando espaços, `_` e `-`**:
`"Rigid Body 3D"`, `"rigidbody3d"` e `"rigid_body_3d"` são o mesmo componente.

## Lua: `caffeine.component`

| Função | Resultado |
|---|---|
| `list()` | todos os tipos de componente: `{ name, id, fields = { { name, kind, min, max, options } } }` |
| `names(entity)` | os nomes dos componentes que a entidade tem |
| `has(entity, name)` / `add(entity, name)` / `remove(entity, name)` | presença; `add` não faz nada se já existir, `remove` devolve se removeu |
| `get(entity, name)` | tabela com todos os campos, ou `nil` quando a entidade não tem o componente |
| `getField(entity, name, field)` | o valor de um campo |
| `setField(entity, name, field, value)` | escreve um campo |
| `set(entity, name, { Field = value, ... })` | adiciona o componente se faltar e escreve os campos indicados; os restantes mantêm o valor |

Valores: números, booleanos e strings como eles próprios; **enums são nomes de opção** (`"Sphere"`, um índice
numérico também é aceite); **vetores são tabelas** (`{x=, y=, z=}`, ou `{1, 2, 3}`); **cores** aceitam `x y z w` ou
`r g b a`.

```lua
local C = caffeine.component
C.add(eid, "Rigid Body 3D")
C.set(eid, "Rigid Body 3D", { Mass = 12.5, ["Body type"] = "Static" })
C.set(eid, "Mesh Filter", { Primitive = "Sphere" })
local p = C.getField(eid, "Position 3D", "Position")      -- { x=, y=, z= }
```

Os erros lançam mensagens Lua que dizem o que fazer: componente desconhecido (e onde encontrar a lista), campo
desconhecido (com os válidos), tipo de valor errado, opção de enum inexistente (com as opções), entidade morta.

## Nativas Dryad

As mesmas operações, com o modelo de valores do Dryad (números, booleanos, strings, arrays, objetos). Os erros são
registados e a nativa devolve `null` / `false`.

| Nativa | Função |
|---|---|
| `caffeine_component_list()` / `caffeine_component_names(entity)` | arrays de nomes |
| `caffeine_component_has / _add / _remove(entity, name)` | presença |
| `caffeine_component_get(entity, name)` | objeto com todos os campos |
| `caffeine_component_get_field(entity, name, field)` / `caffeine_component_set_field(entity, name, field, value)` | um campo |
| `caffeine_component_set(entity, name, object)` | adiciona e escreve os campos indicados |
| `caffeine_component_get_number(entity, name, field[, index])` / `caffeine_component_set_number(entity, name, field, value[, index])` | números, bools, índices de enum e partes de vetor (`index` 0-3); inteiros, enums e bools voltam como inteiros/booleanos |
| `caffeine_component_set_vec(entity, name, field, x, y[, z[, w]])` | um vetor ou cor completo |
| `caffeine_component_get_text / caffeine_component_set_text(entity, name, field[, text])` | strings e labels de enum |

## Registar um componente novo

As entradas escritas à mão (as primeiras 16, com intervalos curados) vivem em `componentRegistry()` em
`ComponentReflection.cpp`. Tudo o resto é **gerado a partir dos headers de componentes**: adicione a struct à lista
`COMPONENTS` em `scripts/gen-component-reflection.py` (com um id fixo) e corra:

```bash
python3 scripts/gen-component-reflection.py --list   # o que encontrou e o que saltou
python3 scripts/gen-component-reflection.py          # reescreve ComponentReflectionGenerated.*.inc
```

O gerador entende floats, bools, ints, `Vec2/3/4`, `std::string`, `char[N]`, `char[N][M]` (como campos numerados),
`FixedString`, tipos `enum class` densos (como listas de opções) e structs simples aninhadas, que achata como
`"Bloom: Intensity"`. Salta caches de runtime (contadores de revisão, flags dirty), vetores e arrays que não são texto.
O componente passa então a aparecer no inspector do Doppio, na C ABI e nas duas linguagens sem código de binding.

## Estado

O registo cobre **43 componentes e ~350 campos**: transforms (3D e 2D legado), câmaras (2D, 3D, controller),
luzes, meshes e meshes com skin, corpos e colliders (2D e 3D), script, sprite e sprite LOD, partículas, health,
audio emitter, **terreno** (tamanho, altura, resolução e as quatro texturas de splat), **fluidos naturais / água**,
nav agent, efeitos, skybox, efeitos de ambiente (dia/noite), post-processing (todos os efeitos, achatados),
forward-render features, procedural world e map surface. Um teste adiciona, lê, escreve de volta e remove *todos* os
componentes e campos registados, e verifica que ids e nomes continuam únicos.

Ainda não refletidos (o estado não cabe em campos simples): máquinas de estados e clips do animator, nav volumes, a
lista de ondas da água e dados de runtime como partículas e meshes ativos. Esses precisam de APIs dedicadas (fase 3).
