# Módulo de Matemática

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/tree/main/src/caffeine/math"><code>src/caffeine/math</code></a></span>
</div>

<p class="doc-lede">Os tipos de vetor, matriz e helpers escalares em structs
simples usados pelo runtime e pelo editor, com um <code>Mat4</code>
column-major pronto para a GPU.</p>

## Visão Geral

O módulo Math fornece tipos de vetor e matriz otimizados para desenvolvimento de
jogos. Todos os tipos são desenhados com localidade de cache e potencial de
SIMD em mente.

**Localização:** `src/caffeine/math`

## Ficheiros

| Ficheiro | Descrição | Estado |
|------|-------------|--------|
| [`Vec2.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Vec2.hpp) | Vetor 2D (x, y) | ✅ Completo |
| [`Vec3.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Vec3.hpp) | Vetor 3D (x, y, z) + `cross()` | ✅ Completo |
| [`Vec4.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Vec4.hpp) | Vetor 4D (x, y, z, w) | ✅ Completo |
| [`Mat4.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Mat4.hpp) | Matriz 4x4 (column-major) | ✅ Completo |
| [`Quat.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Quat.hpp) | Rotações por quaternion | ✅ Completo — ver [quaternions.md](quaternions.md) |
| [`Math.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/math/Math.hpp) | Funções utilitárias (`Caffeine::Math`) | ✅ Completo |

## Tipos de Vetor

### Vec2

Vetor 2D para posições, velocidades e coordenadas UV.

```cpp
Caffeine::Vec2 position(10.0f, 20.0f);
Caffeine::Vec2 velocity(1.0f, -1.0f);
Caffeine::Vec2 normalized = velocity.normalized();
Caffeine::f32 length = velocity.length();
```

### Vec3

Vetor 3D para posições, direções e cores (RGB).

```cpp
Caffeine::Vec3 pos(1.0f, 2.0f, 3.0f);
Caffeine::Vec3 up(0.0f, 1.0f, 0.0f);
Caffeine::Vec3 right(1.0f, 0.0f, 0.0f);
Caffeine::Vec3 cross = up.cross(right);
Caffeine::f32 dot = up.dot(right);
```

### Vec4

Vetor 4D para coordenadas homogéneas e cores (RGBA).

```cpp
Caffeine::Vec4 color(1.0f, 0.0f, 0.0f, 1.0f);  // RGBA vermelho
```

## Mat4

Matriz 4x4 column-major para transformações. Layout compatível com a GPU.

```cpp
Caffeine::Mat4 identity = Caffeine::Mat4::identity();
Caffeine::Mat4 translation = Caffeine::Mat4::translation(10.0f, 20.0f, 30.0f);
Caffeine::Mat4 scale = Caffeine::Mat4::scale(2.0f);
Caffeine::Mat4 rotation = Caffeine::Mat4::rotationZ(0.5f);

Caffeine::Mat4 transform = translation * rotation * scale;
Caffeine::Vec3 transformed = transform.transformPoint(point);
```

### Métodos Principais

| Método | Descrição |
|--------|-------------|
| `identity()` / `zero()` | Matriz identidade / tudo a zero |
| `translation(x, y, z)` / `translation(Vec3)` | Matriz de translação |
| `scale(s)` ou `scale(x, y, z)` | Matriz de escala |
| `rotationX/Y/Z(radians)` | Rotações por eixo |
| `ortho(l, r, b, t, n, f)` | Projeção ortográfica |
| `perspective(fovY, aspect, near, far)` | Projeção perspetiva (OpenGL RH) |
| `lookAt(eye, target, up)` | Matriz de vista right-handed |
| `transformPoint(p)` | Transforma um ponto 3D (w=1, divisão perspetiva quando necessário) |
| `transformVector(v)` | Transforma uma direção (w=0, sem translação) |
| `transformVec4(v)` | Transformação 4D em bruto |
| `transposed()` | Transposta |
| `inverted()` | Inversa por expansão de cofatores (devolve identidade se singular — ver nota) |
| `operator()(row, col)` | Acesso a elementos sobre `m[col * 4 + row]` (column-major) |
| `operator*` | Multiplicação de matrizes |

> ⚠️ `inverted()` devolve a identidade numa matriz singular (fallback
> silencioso). `lookAt()` usa `Mat4::viewBasis()`, que substitui o forward ou o
> up por um eixo de fallback quando `eye == target` ou o up é paralelo à direção
> de vista.
> Não existe `Mat4::fromQuat` — use `Quat::toMatrix()` ([quaternions.md](quaternions.md)).

## Utilitários Matemáticos (`Caffeine::Math`)

| Função | Descrição |
|----------|-------------|
| `PI` / `PI_HALF` / `TAU` / `E` | Constantes |
| `degToRad(degrees)` / `radToDeg(radians)` | Conversão de ângulos |
| `clamp(value, min, max)` | Limita um valor |
| `saturate(value)` | Limita a [0, 1] |
| `lerp(a, b, t)` / `inverseLerp(a, b, v)` | Interpolação e inversa |
| `smoothstep(edge0, edge1, x)` | Passo de Hermite suave |
| `moveTowards(current, target, maxDelta)` | Aproximação em passos |
| `absf(value)` / `minf(a, b)` / `maxf(a, b)` | Helpers escalares |
| `approximatelyEqual(a, b, eps=1e-5)` | Comparação com epsilon |
| `sqrtf_safe(value)` | `sqrt` protegido (≤0 → 0) |
| `isPowerOfTwo(usize)` | Verifica se é potência de dois |
| `nextPowerOfTwo(usize)` | Próxima potência de dois (apenas lanes de 32 bits) |

> ⚠️ `floorf()` / `ceilf()` / `roundf()` / `powf()` chamam-se a si mesmas por
> lookup não qualificado (recursão infinita) — não usar até à correção.
> `normalized()` de um vetor zero devolve o vetor zero (silencioso).

## DOD (Data-Oriented Design)

- **Armazenamento contíguo**: Vec2/3/4 são structs simples, sem métodos virtuais
- **Column-major**: Mat4 usa column-major para compatibilidade com a GPU
- **Preparado para SIMD**: o layout de memória permite otimização SIMD futura
- **Amigo da cache**: tipos pequenos que cabem nas linhas de cache da CPU

## Agnosticismo

Todos os tipos matemáticos servem tanto para 2D como para 3D:

| Tipo | Uso 2D | Uso 3D |
|------|--------|--------|
| Vec2 | posição, velocidade, UV | — |
| Vec3 | — | posição, direção, cor RGB |
| Vec4 | — | coordenadas homogéneas, cor RGBA |
| Mat4 | transformações 2D | transformações 3D |

## Ver Também

### Documentação Relacionada
- [HISTORY.md](../HISTORY.md) - Requisitos e regras de desenvolvimento da Fase 1
- [architecture_specs.md](../architecture_specs.md) - Especificações técnicas
- [API Reference](../api/README.md) - Documentação completa da API
- [Test Documentation](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_math.cpp) - Testes de matemática

### Módulos Relacionados
- [Core Module](../core/types.md) - Tipos fundamentais
- [Memory Module](../memory/allocators.md) - Allocators
