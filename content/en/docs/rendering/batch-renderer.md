# Batch Renderer

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span><strong>Namespace:</strong> `Caffeine::Render`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/render/BatchRenderer.hpp"><code>render/BatchRenderer.hpp</code></a></span>
</div>

<p class="doc-lede">A sprite batcher that sorts pending sprites and submits one indexed draw
per frame, plus the shelf-packing texture atlas that feeds it.</p>

---

## Overview

The batch renderer collects sprites, radix-sorts them by a 32-bit key and emits a **single**
`drawIndexed` for the frame. Today it is a standalone component: only the tests exercise it,
and the 3D scene renderer does not submit through it.

- **Batching** — all pending sprites become one quad buffer
- **Radix sort** — orders sprites by layer → texture → depth before building the buffer
- **Texture atlas** — one texture bind for every sprite that uses the packed atlas

---

## API

```cpp
namespace Caffeine::Render {

struct SpriteVertex {   // 24 bytes
    Vec3 position;
    Vec2 texcoord;
    u32  tint;          // RGBA8 packed
};

class BatchRenderer {
public:
    static constexpr u32 MAX_SPRITES_PER_BATCH = 32768;

    explicit BatchRenderer(RHI::RenderDevice* device);

    void beginFrame();                                   // clears pending sprites + stats
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

    bool add(const char* name, Rect2D sourceRegion);  // only width/height are used
    void pack();                                      // shelf packing, tallest first
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

There is no persistent mapped buffer. `endFrame` builds CPU vertex and index vectors, creates
a `BufferUsage::Vertex` and a `BufferUsage::Index` buffer, binds them, draws, and destroys
both buffers before returning. Sprites that share a draw therefore avoid per-sprite draws,
but the upload still happens every frame.

---

## Sort key

```cpp
sortKey = ((layer + 128) & 0xFF) << 24
        | (textureId & 0xFFF) << 12
        | (depth * 0xFFF)
```

The field split exists so layer dominates, then texture, then depth. `submitSprite` currently
passes layer `0` and texture `0` and takes depth from `worldTransform(2, 3)`, so in practice
the sort orders sprites by depth only. The key is consumed by a 4-pass LSD radix sort.

---

## Usage

```cpp
// ── Setup ──────────────────────────────────────────────────────
Caffeine::Render::BatchRenderer renderer(&device);
Caffeine::Render::TextureAtlas atlas(2048, 2048);

atlas.add("hero_idle",   { {0,   0}, {64, 64} });
atlas.add("hero_walk_0", { {64,  0}, {64, 64} });
atlas.add("tile_grass",  { {128, 0}, {16, 16} });
atlas.pack();

// ── Per frame ─────────────────────────────────────────────────
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
// stats.drawCalls == 1 when at least one sprite was submitted
```

A sprite is a unit quad centred on the origin, transformed by `worldTransform`. Its UVs come
from the atlas when one is set and packed, otherwise they cover the whole texture.

---

## Design decisions

| Decision | Rationale |
|----------|-----------|
| One quad buffer per frame | A single indexed draw instead of one per sprite |
| Radix sort | O(n) for the per-frame sprite order |
| Texture atlas | One bind for every sprite in the batch |
| `SpriteVertex` 24 bytes | Packed RGBA8 tint, no padding |

---

## Current limits

- The batch is not split by texture or layer: everything goes into one draw, so a sprite atlas
  is required to see more than one image.
- No persistent mapping and no double buffering; buffers are created and destroyed each frame.
- `tint` is fixed to white in `submitSprite`.
- Not integrated with the 3D scene renderer or the ECS sprite system yet.

---

## Related

- [RHI](rhi.md)
- [Camera 2D](camera-2d.md)
- [Asset Manager](../assets/asset-manager.md)
