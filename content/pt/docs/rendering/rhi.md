# RHI — Rendering Hardware Interface

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span class="doc-badge">Engine</span>
  <span>Verificado em: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Fonte: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/rhi/RenderDevice.hpp"><code>rhi/RenderDevice.hpp</code></a></span>
</div>

<p class="doc-lede">O RHI envolve o SDL3 GPU: um device, command buffers explícitos,
texturas, buffers, shaders, samplers, pipelines gráficas e pipelines de compute. O
motor não chama SDL_GPU diretamente fora desta camada.</p>

<div class="doc-callout doc-callout--note">
  <p><strong>Porque existe.</strong> O código de render fala com uma só API. Hoje é
  SDL3 GPU (Vulkan, D3D12 ou Metal por baixo); um backend futuro pode ser trocado sem
  reescrever o renderer.</p>
</div>

## Ciclo de frame

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

`beginFrame` adquire a imagem da swapchain e devolve um command buffer para o frame.
`endFrame` submete-o. Até três frames estão em voo (`MAX_FRAMES_IN_FLIGHT`).

## Render offscreen

Para thumbnails, previews de materiais, o viewport do Doppio e testes:

```cpp
CommandBuffer* cmd = device.beginOffscreen();
// grava numa textura e submete sem esperar
device.endOffscreen(cmd);
// mais tarde: copiar a textura e chamar device.releaseOffscreenResources()
```

`readTexture(texture, pixels)` lê o mip 0 de uma textura de cor com 4 bytes por pixel e
bloqueia. `beginOffscreen` não tem swapchain, por isso funciona sem janela quando o
device foi criado com `initOffscreen`.

## Recursos

<table class="doc-table">
  <thead>
    <tr><th>Recurso</th><th>Criar</th><th>Destruir</th></tr>
  </thead>
  <tbody>
    <tr><td>Textura</td><td><code>createTexture(TextureDesc)</code></td><td><code>destroyTexture</code></td></tr>
    <tr><td>Buffer</td><td><code>createBuffer(BufferDesc, BufferUsage)</code></td><td><code>destroyBuffer</code></td></tr>
    <tr><td>Shader</td><td><code>createShader(ShaderDesc)</code></td><td><code>destroyShader</code></td></tr>
    <tr><td>Pipeline gráfica</td><td><code>createGraphicsPipeline(vs, fs, desc)</code></td><td><code>destroyPipeline</code></td></tr>
    <tr><td>Pipeline de compute</td><td><code>createComputePipeline(desc)</code></td><td><code>destroyComputePipeline</code></td></tr>
    <tr><td>Sampler</td><td><code>createSampler(SamplerDesc)</code></td><td><code>destroySampler</code></td></tr>
  </tbody>
</table>

Uploads: `uploadBuffer`, `uploadTexture`, `uploadTexture3D`. O bytecode de shader pode
ser SPIR-V, DXBC, MSL ou metallib; `ShaderBytecodeFormat` seleciona.

## Command buffer

| Grupo | Métodos |
|---|---|
| Render pass | `beginRenderPass`, `endRenderPass` |
| Binding | `bindPipeline`, `bindVertexBuffer`, `bindIndexBuffer`, `bindTexture`, `bindVertexTexture`, `setViewport`, `setScissor` |
| Draw | `draw`, `drawIndexed`, `drawInstanced`, `drawIndexedInstanced` |
| Uniforms | `pushUniformData(stage, slot, data, size)` |
| Compute | `beginComputePass`, `bindComputePipeline`, `bindComputeStorageBuffers`, `bindComputeTextures`, `pushComputeUniformData`, `dispatch`, `endComputePass` |
| Cópias | `copyTexture`, `copyTextureRegion`, `generateMipmaps` |

Um command buffer grava um pass de cada vez. Verifique `isInRenderPass()` /
`isInComputePass()` quando um helper pode ser chamado dos dois caminhos.

## Formatos e usage

`TextureFormat` mapeia formatos SDL e acrescenta os que o renderer precisa
(`R8G8_UNORM` para o G-buffer do Photon, `R16G16_FLOAT` para momentos de probes,
`R11G11B10_UFLOAT` para probes HDR). `TextureUsage` é uma máscara de bits:
`Sampler | ColorTarget | DepthStencil | StorageRead | ComputeRead | ComputeWrite`.

`GraphicsPipelineDesc` aceita até quatro color targets (`kMaxColorTargets`), layouts de
vértice com `VertexFormat::Float2/3/4`, blend modes (`Alpha`, `Premultiplied`,
`Additive`, `Min`) e fill mode (`Fill` ou `Line`).

## Texturas e o editor

O viewport do Doppio renderiza offscreen pelo RHI do motor e lê a textura de volta para
o processo Rust. O SDL_GPU não expõe um handle nativo de textura pela API pública, por
isso o editor não pode partilhar a textura diretamente; veja
[Scene viewport](../editor/scene-viewport.md).

## Regras de design

1. **Um dono por recurso.** Criar e destruir via `RenderDevice`.
2. **Sem estado escondido.** Faça bind de tudo o que um draw precisa; pipelines não
   guardam texturas.
3. **Caminhos offscreen usam `beginOffscreen`.** Nunca abra uma janela para um thumbnail
   ou um teste.
4. **Uploads são staged.** `uploadTexture` trata do transfer buffer; não mapeie buffers
   SDL fora do RHI.
5. **Texturas retiradas são diferidas.** O device mantém-nas vivas durante os frames em
   voo antes de as libertar.

## Testes

`tests/test_rhi.cpp` cobre init do device, passes offscreen, criação de texturas,
uploads, pipelines e readback. Corra com:

```bash
./build/tests/CaffeineTest "[rhi]"
```

## Páginas relacionadas

- [Batch renderer](batch-renderer.md)
- [Materiais PBR](materials-pbr.md)
- [Shadow mapping](shadow-mapping.md)
- [Reflexos](reflections.md)
- [Scene viewport](../editor/scene-viewport.md)
