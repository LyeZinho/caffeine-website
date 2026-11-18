# Batch Renderer

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/BatchRenderer.hpp"><code>render/BatchRenderer.hpp</code></a></span>
</div>

<p class="doc-lede">Um batcher de sprites que ordena os sprites pendentes e submete um único
draw indexado por frame, mais o atlas de texturas com empacotamento em prateleiras que o
alimenta.</p>

---

## Visão Geral

O batch renderer acumula sprites, ordena-os por radix sort com uma chave de 32 bits e emite um
**único** `drawIndexed` por frame. Hoje é um componente isolado: só os testes o exercitam e o
renderer de cena 3D não submete através dele.

- **Batching** — todos os sprites pendentes viram um único buffer de quads
- **Radix sort** — ordena por layer → textura → profundidade antes de construir o buffer
- **Texture atlas** — um bind de textura para todos os sprites que usam o atlas

---

## API

```cpp
namespace Caffeine::Render {

struct SpriteVertex {   // 24 bytes
    Vec3 position;
    Vec2 texcoord;
    u32  tint;          // RGBA8 empacotado
};

class BatchRenderer {
public:
    static constexpr u32 MAX_SPRITES_PER_BATCH = 32768;

    explicit BatchRenderer(RHI::RenderDevice* device);

    void beginFrame();                                   // limpa sprites pendentes + stats
    void setCamera(const Camera2D& camera);
    void setAtlas(const TextureAtlas* atlas);
    void submitSprite(const Mat4& worldTransform, const ECS::Sprite& sprite);
    void endFrame(RHI::CommandBuffer* cmd);              // sort → build → upload → draw

    struct FrameStats {
        u32 totalSprites     = 0;
        u32 totalBatches     = 0;
        u32 drawCalls        = 0;
        u32 verticesUploaded = 0;
    };
    FrameStats lastFrameStats() const;
};

class TextureAtlas {
public:
    explicit TextureAtlas(u32 width, u32 height);

    bool add(const char* name, Rect2D sourceRegion);  // só width/height são usados
    void pack();                                      // prateleiras, mais alto primeiro
    bool isPacked() const;

    Vec4 getUV(const char* name) const;               // Vec4(u0, v0, u1, v1)

    struct PixelData { const u8* pixels; u32 width; u32 height; u32 byteSize; };
    PixelData exportImage() const;

    u32  count() const;
    u32  usedArea() const;
    u32  totalArea() const;
    f32  utilization() const;
};

}  // namespace Caffeine::Render
```

---

## Buffers

Não existe persistent mapped buffer. O `endFrame` constrói vectores de vértices e índices em
CPU, cria um buffer `BufferUsage::Vertex` e outro `BufferUsage::Index`, faz bind, desenha e
destrói ambos antes de retornar. Sprites que partilham o draw evitam um draw por sprite, mas o
upload continua a acontecer em cada frame.

---

## Chave de ordenação

```cpp
sortKey = ((layer + 128) & 0xFF) << 24
        | (textureId & 0xFFF) << 12
        | (depth * 0xFFF)
```

A divisão de campos existe para o layer dominar, depois a textura e por fim a profundidade. O
`submitSprite` passa actualmente layer `0` e textura `0` e tira a profundidade de
`worldTransform(2, 3)`, pelo que na prática a ordenação é apenas por profundidade. A chave é
consumida por um radix sort LSD de 4 passagens.

---

## Utilização

```cpp
// ── Setup ──────────────────────────────────────────────────────
Caffeine::Render::BatchRenderer renderer(&device);
Caffeine::Render::TextureAtlas atlas(2048, 2048);

atlas.add("hero_idle",   { {0,   0}, {64, 64} });
atlas.add("hero_walk_0", { {64,  0}, {64, 64} });
atlas.add("tile_grass",  { {128, 0}, {16, 16} });
atlas.pack();

// ── Por frame ─────────────────────────────────────────────────
renderer.beginFrame();
renderer.setAtlas(&atlas);
renderer.setCamera(camera2D);

ECS::ComponentQuery spriteQuery;
spriteQuery.with<ECS::Sprite>();
world.forEach<ECS::Sprite>(spriteQuery, [&](ECS::Entity, ECS::Sprite& sprite) {
    renderer.submitSprite(Mat4::translation(0, 0, 0), sprite);
});

auto* cmd = device.beginFrame();
renderer.endFrame(cmd);
device.endFrame(cmd);

// ── Stats ─────────────────────────────────────────────────────
auto stats = renderer.lastFrameStats();
// stats.drawCalls == 1 quando há pelo menos um sprite submetido
```

Um sprite é um quad unitário centrado na origem, transformado por `worldTransform`. As UVs vêm
do atlas quando existe e está empacotado; caso contrário cobrem a textura inteira.

---

## Decisões de design

| Decisão | Justificação |
|---------|--------------|
| Um buffer de quads por frame | Um único draw indexado em vez de um por sprite |
| Radix sort | O(n) para a ordem dos sprites do frame |
| Texture atlas | Um bind para todos os sprites do batch |
| `SpriteVertex` de 24 bytes | Tint RGBA8 empacotado, sem padding |

---

## Limites actuais

- O batch não é dividido por textura nem por layer: vai tudo num draw, pelo que é preciso um
  atlas para ver mais do que uma imagem.
- Sem persistent mapping nem double buffering; os buffers são criados e destruídos a cada
  frame.
- O `tint` está fixo a branco no `submitSprite`.
- Ainda não está integrado com o renderer de cena 3D nem com o sistema ECS de sprites.

---

## Relacionado

- [RHI](rhi.md)
- [Camera 2D](camera-2d.md)
- [Asset Manager](../assets/asset-manager.md)
