# Módulo de Memória

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/memory"><code>src/caffeine/memory</code></a></span>
</div>

<p class="doc-lede">Três allocators personalizados — linear, pool e stack — que
partilham a interface <code>IAllocator</code> para memória temporária por frame,
objetos de tamanho fixo e escopos aninhados.</p>

## Visão Geral

O módulo Memory fornece allocators personalizados para gestão de memória sem
dependências externas. Todos os allocators implementam a interface `IAllocator`.

**Localização:** `src/caffeine/memory`

**Namespace:** `Caffeine` (não `Caffeine::Memory` — os allocators vivem
diretamente no namespace raiz).

## Ficheiros

| Ficheiro | Descrição | Estado |
|------|-------------|--------|
| [`Allocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/Allocator.hpp) | Interface `IAllocator` | ✅ Completo |
| [`LinearAllocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/LinearAllocator.hpp) | Alocação O(1), `reset()` limpa tudo | ✅ Completo |
| [`PoolAllocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/PoolAllocator.hpp) | Slots de tamanho fixo, alloc/free O(1) | ✅ Completo |
| [`StackAllocator.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/memory/StackAllocator.hpp) | Markers, `freeToMarker()` | ✅ Completo |

## Arquitetura

### Interface IAllocator

```cpp
class IAllocator {
public:
    virtual ~IAllocator() = default;
    virtual void* alloc(usize size, usize alignment = 8) = 0;
    virtual void free(void* ptr) = 0;
    virtual void reset() = 0;
    virtual usize usedMemory() const = 0;
    virtual usize totalSize() const = 0;
    virtual usize peakMemory() const = 0;
    virtual usize allocationCount() const = 0;
    virtual const char* name() const = 0;
};

// Helpers livres (Allocator.hpp)
inline usize calculatePadding(void* ptr, usize alignment);
inline usize calculateAlignedSize(usize size, usize alignment);
```

## Comparação dos Allocators

| Allocator | Alocação | Libertação | Caso de uso |
|-----------|------------|--------------|----------|
| **Linear** | O(1) | Apenas `reset()` (`free()` é no-op) | Memória temporária por frame |
| **Pool** | O(1) | O(1); `free(nullptr)` é seguro; **sem deteção de double-free** | Objetos de tamanho fixo (partículas) |
| **Stack** | O(1) | `freeToMarker()` (`free()` é no-op) | Alocações com escopo |

## Semântica confirmada no código

- **Construtores:** cada allocator pode ser dono do seu buffer
  (`explicit X(usize size)`, alocado com `new u8[]`) ou envolver um buffer
  externo (`X(void* buffer, usize size)`, sem transferência de ownership).
- **Out of memory:** `alloc()` retorna `nullptr` — verifique sempre o resultado.
- **Especificidades do Pool:** o construtor exige `alignment >= 8` e potência de
  dois; `alloc()` ignora os parâmetros `size`/`alignment` (devolve sempre um slot
  fixo e verifica `size <= slotSize` em debug); os slots têm de comportar um
  ponteiro (mínimo 8 bytes — a free list é intrusiva); `reset()` reconstrói a
  free list. Introspeção: `freeSlots()`, `slotSize()`, `maxSlots()`.
- **Especificidades do Stack:** `Marker` é um offset `usize` a partir do início
  do buffer (`setMarker()`); `freeToMarker()` ignora markers além do cursor e
  repõe a contagem de alocações; `free(ptr)` não faz nada.
- **Estatísticas:** `usedMemory()` / `totalSize()` / `peakMemory()` /
  `allocationCount()` são atualizados em tempo real; `reset()` zera a contagem
  de alocações (Linear/Stack) ou a contagem de slots usados (Pool).

## Exemplos de Uso

### LinearAllocator

```cpp
// Cria um allocator linear de 64KB
Caffeine::LinearAllocator alloc(64 * 1024);

// Aloca (O(1))
void* ptr = alloc.alloc(1024, 8);

// Liberta tudo de uma vez
alloc.reset();
```

### PoolAllocator

```cpp
// Cria um pool para 100 partículas de 64 bytes cada
Caffeine::PoolAllocator pool(64 * 100, 64);

// Aloca (O(1))
void* p1 = pool.alloc(64);
void* p2 = pool.alloc(64);

// free devolve o slot ao pool
pool.free(p1);
```

### StackAllocator

```cpp
Caffeine::StackAllocator stack(1024 * 1024); // 1MB

// Guarda um marker
auto marker = stack.setMarker();

// Aloca
void* ptr = stack.alloc(512);

// Liberta até ao marker (tudo o que está depois dele)
stack.freeToMarker(marker);
```

## DOD (Data-Oriented Design)

- Todos os allocators usam blocos contíguos de memória
- Sem memória dinâmica depois da alocação inicial
- Não são thread-safe para instâncias partilhadas; use allocators por thread ou
  sincronização externa
- Zero alocações no heap durante a operação normal

## Referência Rápida

| Classe | Complexidade | Método principal |
|-------|------------|------------|
| `LinearAllocator` | O(1) alloc, O(1) reset | `reset()` limpa tudo |
| `PoolAllocator` | O(1) | `free()` devolve o slot |
| `StackAllocator` | O(1) alloc | `freeToMarker()` |

## Ver Também

### Documentação Relacionada
- [memory/memory-model.md](../memory/memory-model.md) - Especificação detalhada dos allocators
- [HISTORY.md](../HISTORY.md) - Requisitos e regras de desenvolvimento da Fase 1
- [architecture_specs.md](../architecture_specs.md) - Especificações técnicas
- [API Reference](../api/README.md) - Documentação completa da API
- [Test Documentation](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_allocators.cpp) - Testes dos allocators

### Módulos Relacionados
- [Core Module](../core/types.md) - Tipos fundamentais (usados pela Memory)
- [Containers Module](../memory/containers.md) - `Vector` usa allocators
- [Math Module](../math/vectors.md) - Tipos matemáticos
