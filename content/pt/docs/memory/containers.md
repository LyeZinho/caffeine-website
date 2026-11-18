# Módulo de Contentores

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/containers"><code>src/caffeine/containers</code></a></span>
</div>

<p class="doc-lede">Quatro contentores pequenos e amigos da cache usados em todo
o runtime: um vetor dinâmico, um mapa associativo linear, uma vista de string
sem ownership e uma string de capacidade fixa inline.</p>

## Visão Geral

O módulo Containers fornece estruturas de dados otimizadas para
desenvolvimento de jogos, com localidade de cache e o mínimo de alocações no
heap.

**Localização:** `src/caffeine/containers`

## Ficheiros

| Ficheiro | Descrição | Estado |
|------|-------------|--------|
| [`Vector.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/Vector.hpp) | Array dinâmico com memória contígua amiga da cache | ✅ Completo |
| [`HashMap.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/HashMap.hpp) | Mapa com pesquisa linear sobre `Vector<Pair>` | ✅ Completo |
| [`StringView.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/StringView.hpp) | String sem ownership (zero-copy) | ✅ Completo |
| [`FixedString.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/containers/FixedString.hpp) | String com buffer inline (zero heap) | ✅ Completo |

## Vector<T>

Array dinâmico com crescimento automático. Aceita allocators personalizados ou
usa o `operator new` global por omissão.

```cpp
// Construção por omissão (usa new/delete global)
Caffeine::Vector<int> vec;
vec.pushBack(42);

// Com allocator personalizado
Caffeine::LinearAllocator alloc(1024);
Caffeine::Vector<int> vec2(&alloc);
```

### Métodos Principais

| Método | Complexidade | Descrição |
|--------|------------|--------------|
| `pushBack()` | O(1) amortizado | Adiciona um elemento |
| `operator[]` | O(1) | Acesso por índice |
| `reserve()` | O(n) | Pré-aloca capacidade |
| `clear()` | O(n) | Destrói todos os elementos |
| `size()` | O(1) | Número de elementos |
| `capacity()` | O(1) | Capacidade alocada |

## HashMap<K, V>

Contentor associativo pequeno suportado por `Vector<Pair>` com **pesquisa
linear** — `get`/`set`/`contains`/`remove` em O(n). Não há hashing nem open
addressing; é adequado para tabelas pequenas (dezenas de entradas), não para
hot paths com milhares de chaves.

```cpp
Caffeine::HashMap<int, const char*> map;
map.set(1, "one");
map.set(2, "two");

const char* const* val = map.get(1);  // pointer; nullptr if missing
bool exists = map.contains(1);
map.remove(1);  // swap-with-back removal (unordered)
```

### Métodos Principais

| Método | Complexidade | Descrição |
|--------|------------|--------------|
| `set()` (overloads lvalue + rvalue) | O(n) | Insere ou atualiza |
| `get()` (const + non-const) | O(n) | Ponteiro para o valor, `nullptr` se não existir |
| `contains()` | O(n) | Verifica se a chave existe |
| `remove()` | O(n) | Remove por troca com o último (ordem não preservada) |
| `clear()` / `size()` / `empty()` | O(n) / O(1) / O(1) | Limpa / conta / verifica |
| `begin()` / `end()` (const + non-const) | O(1) | Itera os pares |
| `explicit HashMap(usize capacity)` | — | Pré-reserva armazenamento |

## StringView

Referência de string zero-copy (ponteiro + comprimento, sem ownership).

```cpp
Caffeine::StringView sv("Hello World", 5); // "Hello"
Caffeine::StringView full("Hello");        // comprimento calculado
```

Fornece `data()` / `length()` / `size()` / `empty()`, `operator[]` e
`compare()` lexicográfico com os operadores `==`, `!=`, `<`.
Não é terminada por nulo — não passe `data()` a APIs `%s` sem respeitar o
comprimento.

## FixedString<N>

String na stack com buffer inline. Um único parâmetro de template:
`FixedString<32>`, **não** `FixedString<T, N>`.

```cpp
Caffeine::FixedString<32> fs;
fs.append("Hello");
const char* s = fs.cStr();  // sempre terminada por nulo
```

Fornece `cStr()` / `data()` / `length()` / `size()` / `capacity()` (devolve `N`),
`empty()` / `full()`, `clear()`, `append(const char*)` / `append(char)`,
`==` / `!=`, `operator[]`. Os appends **truncam silenciosamente** em `N - 1`
caracteres (o buffer reserva sempre espaço para `'\0'`).

## DOD (Data-Oriented Design)

- **Vector<T>**: memória contígua, sem fragmentação; `IAllocator*` opcional
  (usa `new`/`delete` global quando não é indicado)
- **HashMap<K,V>**: pesquisa linear sobre pares contíguos — amigo da cache, mas O(n)
- **StringView**: zero-copy, sem alocação
- **FixedString<N>**: buffer inline, zero heap

## Ver Também

### Documentação Relacionada
- [HISTORY.md](../HISTORY.md) - Requisitos e regras de desenvolvimento da Fase 1
- [architecture_specs.md](../architecture_specs.md) - Especificações técnicas
- [API Reference](../api/README.md) - Documentação completa da API
- [Test Documentation](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_containers.cpp) - Testes dos contentores

### Módulos Relacionados
- [Core Module](../core/types.md) - Tipos fundamentais
- [Memory Module](../memory/allocators.md) - Allocators usados pelos contentores
- [Math Module](../math/vectors.md) - Tipos matemáticos
