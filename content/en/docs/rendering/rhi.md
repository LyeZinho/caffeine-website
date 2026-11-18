# RHI — Rendering Hardware Interface

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/rhi/RenderDevice.hpp"><code>rhi/RenderDevice.hpp</code></a></span>
</div>

<p class="doc-lede">The RHI wraps SDL3 GPU: one device, explicit command buffers,
textures, buffers, shaders, samplers, graphics pipelines and compute pipelines. The
engine does not call SDL_GPU directly outside this layer.</p>

<div class="doc-callout doc-callout--note">
  <p><strong>Why it exists.</strong> Render code targets one API. Today it is SDL3
  GPU (Vulkan, D3D12 or Metal underneath); a future backend can be swapped without
  rewriting the renderer.</p>
</div>

## Frame lifecycle

```cpp
Caffeine::RHI::RenderDevice device;
device.init(window, {.width = 1600, .height = 900, .vsync = true});

Caffeine::RHI::CommandBuffer* cmd = device.beginFrame();
Caffeine::RHI::RenderPassDesc pass{};
pass.colorTarget = nullptr;   // nullptr = swapchain
cmd->beginRenderPass(pass);
cmd->bindPipeline(pipeline);
cmd->bindVertexBuffer(vertices);
cmd->draw(3);
cmd->endRenderPass();
device.endFrame(cmd);
```

`beginFrame` acquires the swapchain image and returns a command buffer for the frame.
`endFrame` submits it. Up to three frames are in flight (`MAX_FRAMES_IN_FLIGHT`).

## Offscreen rendering

For thumbnails, material previews, the Doppio viewport and tests:

```cpp
CommandBuffer* cmd = device.beginOffscreen();
// record into a texture, then submit without waiting
device.endOffscreen(cmd);
// later: copy the texture and call device.releaseOffscreenResources()
```

`readTexture(texture, pixels)` reads mip 0 of a 4-byte-per-pixel colour texture and
blocks. `beginOffscreen` has no swapchain, so it works without a window when the
device was created with `initOffscreen`.

## Resources

<table class="doc-table">
  <thead>
    <tr><th>Resource</th><th>Create</th><th>Destroy</th></tr>
  </thead>
  <tbody>
    <tr><td>Texture</td><td><code>createTexture(TextureDesc)</code></td><td><code>destroyTexture</code></td></tr>
    <tr><td>Buffer</td><td><code>createBuffer(BufferDesc, BufferUsage)</code></td><td><code>destroyBuffer</code></td></tr>
    <tr><td>Shader</td><td><code>createShader(ShaderDesc)</code></td><td><code>destroyShader</code></td></tr>
    <tr><td>Graphics pipeline</td><td><code>createGraphicsPipeline(vs, fs, desc)</code></td><td><code>destroyPipeline</code></td></tr>
    <tr><td>Compute pipeline</td><td><code>createComputePipeline(desc)</code></td><td><code>destroyComputePipeline</code></td></tr>
    <tr><td>Sampler</td><td><code>createSampler(SamplerDesc)</code></td><td><code>destroySampler</code></td></tr>
  </tbody>
</table>

Uploads: `uploadBuffer`, `uploadTexture`, `uploadTexture3D`. Shader bytecode can be
SPIR-V, DXBC, MSL or a metallib; `ShaderBytecodeFormat` selects it.

## Command buffer

| Group | Methods |
|---|---|
| Render pass | `beginRenderPass`, `endRenderPass` |
| Binding | `bindPipeline`, `bindVertexBuffer`, `bindIndexBuffer`, `bindTexture`, `bindVertexTexture`, `setViewport`, `setScissor` |
| Draw | `draw`, `drawIndexed`, `drawInstanced`, `drawIndexedInstanced` |
| Uniforms | `pushUniformData(stage, slot, data, size)` |
| Compute | `beginComputePass`, `bindComputePipeline`, `bindComputeStorageBuffers`, `bindComputeTextures`, `pushComputeUniformData`, `dispatch`, `endComputePass` |
| Copies | `copyTexture`, `copyTextureRegion`, `generateMipmaps` |

A command buffer records one pass at a time. Check `isInRenderPass()` /
`isInComputePass()` when a helper may be called from both paths.

## Formats and usage

`TextureFormat` maps SDL formats and adds the formats the renderer needs
(`R8G8_UNORM` for the Photon G-buffer, `R16G16_FLOAT` for probe moments,
`R11G11B10_UFLOAT` for HDR probes). `TextureUsage` is a bit mask:
`Sampler | ColorTarget | DepthStencil | StorageRead | ComputeRead | ComputeWrite`.

`GraphicsPipelineDesc` accepts up to four colour targets (`kMaxColorTargets`), vertex
layouts with `VertexFormat::Float2/3/4`, blend modes (`Alpha`, `Premultiplied`,
`Additive`, `Min`) and a fill mode (`Fill` or `Line`).

## Textures and the editor

The Doppio viewport renders through the engine RHI offscreen, then reads the texture
back to the Rust process. SDL_GPU does not expose a native texture handle through the
public API, so the editor cannot share the texture directly; see
[Scene viewport](../editor/scene-viewport.md).

## Design rules

1. **One owner per resource.** Create and destroy through `RenderDevice`.
2. **No hidden state.** Bind everything a draw needs; pipelines do not remember
   textures.
3. **Offscreen paths use `beginOffscreen`.** Never open a window for a thumbnail or a
   test.
4. **Uploads are staged.** `uploadTexture` handles the transfer buffer; do not map
   SDL buffers outside the RHI.
5. **Retired textures are deferred.** The device keeps them alive for frames in
   flight before releasing them.

## Tests

`tests/test_rhi.cpp` covers device init, offscreen passes, texture creation, uploads,
pipelines and readback. Run it with:

```bash
./build/tests/CaffeineTest "[rhi]"
```

## Related pages

- [Batch renderer](batch-renderer.md)
- [Materials PBR](materials-pbr.md)
- [Shadow mapping](shadow-mapping.md)
- [Reflections](reflections.md)
- [Scene viewport](../editor/scene-viewport.md)
