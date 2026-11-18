# Módulo Core

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/core"><code>src/caffeine/core</code></a></span>
</div>

<p class="doc-lede">O módulo Core define os tipos de largura fixa, a deteção de
plataforma e compilador, as asserções e as convenções de unidades de mundo que
todos os outros módulos da Caffeine usam como base.</p>

## Visão Geral

O módulo Core fornece os tipos fundamentais, abstrações de plataforma e deteção
de compilador. Todos os outros módulos dependem do Core.

**Localização:** `src/caffeine/core`

## Ficheiros

| Ficheiro | Descrição | Estado |
|------|-------------|--------|
| [`Types.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Types.hpp) | Tipos inteiros/float/char de largura fixa, constantes de limite | ✅ Completo |
| [`Platform.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Platform.hpp) | Macros de deteção de plataforma e bitness | ✅ Completo |
| [`Assertions.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Assertions.hpp) | Asserções de debug | ✅ Completo |
| [`Compiler.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/Compiler.hpp) | Deteção de compilador e macros de portabilidade | ✅ Completo |
| [`WorldUnits.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/WorldUnits.hpp) | Convenção de espaço de mundo (1 unidade = 1 metro) e helpers de escala de terreno | ✅ Completo |
| [`IDebugHooks.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/IDebugHooks.hpp) / `DebugHookRegistry.cpp` | Ponto de extensão do IDE (`FrameStats`, hooks de eventos da engine, custo zero quando não registado) | ✅ Completo |
| [`io/`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/core/io) (`BlobLoader`, `CafWriter`, `CafTypes`, `Crc32`, `FileWatcher`) | I/O binário de baixo nível, framing/CRC de CAF, monitorização de ficheiros | ✅ Completo |

## Dependências

```
Os headers de tipos, plataforma, compilador e asserções não dependem de outros
módulos da Caffeine. Os helpers de io/ dependem da interface de allocators, e
IDebugHooks.hpp inclui ecs/Entity.hpp para os hooks poderem receber um ECS::Entity.
```

## Referência Rápida

### Tipos escalares (`Types.hpp`)

| Tipo | Descrição | Header |
|------|-------------|--------|
| `u8`, `u16`, `u32`, `u64` | Inteiros sem sinal | Types.hpp |
| `i8`, `i16`, `i32`, `i64` | Inteiros com sinal | Types.hpp |
| `f32`, `f64` | Vírgula flutuante (`float` / `double`) | Types.hpp |
| `c8`, `c16`, `c32` | Tipos de caractere (`char` / `char16_t` / `char32_t`) | Types.hpp |
| `usize`, `isize` | Tamanho de ponteiro (`std::size_t` / `std::ptrdiff_t`) | Types.hpp |
| `Byte` | Alias de `u8` | Types.hpp |

Existem constantes de limite para todas as larguras inteiras (`u8_max` … `u64_max`,
`i8_min`/`i8_max` … `i64_min`/`i64_max`), e `static_assert`s validam o tamanho de
cada tipo em tempo de compilação.

### Deteção de plataforma (`Platform.hpp`)

| Macro | Descrição |
|-------|-------------|
| `CF_PLATFORM_WINDOWS` / `CF_PLATFORM_LINUX` / `CF_PLATFORM_MACOS` / `CF_PLATFORM_FREEBSD` / `CF_PLATFORM_UNKNOWN` | Sistema operativo ativo |
| `CF_PLATFORM_64BIT` / `CF_PLATFORM_32BIT` | Bitness do ponteiro |
| `CF_PLATFORM_NAME` | Literal `"Windows"`, `"Linux"`, `"macOS"`, `"FreeBSD"` ou `"Unknown"` |

### Abstração de compilador (`Compiler.hpp`)

| Macro | Descrição |
|-------|-------------|
| `CF_COMPILER_MSVC` / `CF_COMPILER_CLANG` / `CF_COMPILER_GCC` / `CF_COMPILER_UNKNOWN` | Compilador ativo |
| `CF_COMPILER_NAME` | Literal `"MSVC"`, `"Clang"`, `"GCC"` ou `"Unknown"` |
| `CF_INLINE` / `CF_NOINLINE` / `CF_NORETURN` | Inline forçado / noinline / noreturn |
| `CF_LIKELY(x)` / `CF_UNLIKELY(x)` | Dicas de previsão de ramo |
| `CF_BUILTIN_TRAP()` / `CF_BUILTIN_DEBUGTRAP()` | Intrínsecos de trap / debug break |
| `CF_THREAD_LOCAL` | Especificador de thread-local storage |
| `CF_EXPORT` / `CF_IMPORT` / `CF_HIDDEN` | Visibilidade de símbolos |
| `CF_CALL` | Convenção de chamada (`__cdecl` no Windows) |
| `CF_CPP14` / `CF_CPP17` / `CF_CPP20` | Standard C++ ativo |

### Asserções (`Assertions.hpp`)

| Macro/Função | Descrição | Header |
|----------------|-------------|--------|
| `CF_ASSERT(cond, msg)` | Asserção de debug; compilada fora (`((void)0)`) quando `CF_DEBUG` não está definido | Assertions.hpp |
| `CF_ASSERT_NOT_NULL(ptr)` | Verificação de ponteiro nulo | Assertions.hpp |
| `CF_UNREACHABLE()` | Marca código inalcançável (sempre ativo) | Assertions.hpp |
| `CF_DEBUG_ONLY(x)` | Expande para `x` em builds de debug, nada nos restantes | Assertions.hpp |
| `Caffeine::assertFailed(cond, file, line, msg)` | Handler de falha (faz trap via `CF_BUILTIN_TRAP`) | Assertions.hpp |

`CF_ASSERT_ENABLED` vale `1` quando `CF_DEBUG` está definido e `0` caso contrário.

### Unidades de mundo (`WorldUnits.hpp`)

Convenção de espaço de mundo: **1 unidade da engine = 1 metro** (`kMetersPerWorldUnit`).
`Caffeine::WorldUnits` fornece as constantes `centimeter` / `meter` / `kilometer`,
constantes de escala de terreno por omissão (`kDefaultTerrainSizeM = 512`, …) e
`suggestedHeightM(worldSizeM)` para geração de terreno.

## Exemplo de Uso

```cpp
#include "core/Types.hpp"
#include "core/Assertions.hpp"

// Usar os tipos
Caffeine::u32 count = 42;
Caffeine::f32 health = 100.0f;

// Constantes de limite
if (count == Caffeine::u32_max) { /* saturado */ }

// Asserções (ativas apenas com CF_DEBUG)
CF_ASSERT(health > 0, "Health must be positive");
CF_ASSERT_NOT_NULL(ptr);
```

## Ver Também

### Documentação Relacionada
- [HISTORY.md](../HISTORY.md) - Requisitos e regras de desenvolvimento da Fase 1
- [memory/memory-model.md](../memory/memory-model.md) - Especificação dos allocators
- [architecture_specs.md](../architecture_specs.md) - Especificações técnicas
- [API Reference](../api/README.md) - Documentação completa da API

### Módulos Relacionados
- [Memory Module](../memory/allocators.md) - Gestão de memória personalizada
- [Containers Module](../memory/containers.md) - Estruturas de dados
- [Math Module](../math/vectors.md) - Tipos matemáticos
