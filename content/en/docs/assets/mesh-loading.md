# 🗿 Mesh Loading

<div class="doc-meta">
  <span class="doc-badge doc-badge--stable">Stable</span>
  <span><strong>Namespace:</strong> `Caffeine::Assets`</span>
  <span><strong>File:</strong> `src/caffeine/assets/MeshLoader.hpp`</span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/assets/MeshTypes.hpp"><code>assets/MeshTypes.hpp</code></a></span>
</div>

<p class="doc-lede">Importing OBJ and glTF into <code>Mesh3D</code>: geometry, tangents,
smooth normals, per-surface glTF materials and alpha modes, plus the GPU upload path.</p>

---

## Overview

Loading 3D meshes in `.obj` and `.gltf` formats, converting them to the internal `.caf` (Mesh)
representation. Shaders are GLSL sources compiled to SPIR-V by `Render::ShaderCompiler`.

**Normal mapping:** after import, `computeMeshTangents()` fills `Vertex3D::tangent` (vec4 with
handedness in `.w`). The editor binds normal maps through
`MeshFilterComponent::customNormalPath` in the forward PBR pass
[`materials-phong.md`](../rendering/materials-phong.md).

**Smooth shading:** meshes importadas sem normais recebem `computeSmoothNormals()` em `MeshLoader.cpp` . Primitivas GPU procedurais ( `GpuProceduralMeshes.cpp` ) use analytical normals** — not call `computeSmoothNormals()` in them (avoids seams in sphere/torus/capsule). See [`plans/2026-09-22-viewport-rendering-quality-session.md`](../plans/2026-09-22-viewport-rendering-quality-session.md).

**Alpha modes:** glTF `alphaMode` (`OPAQUE`, `MASK`, `BLEND`) and `alphaCutoff` are imported into `MeshSurfaceMaterial`; the renderer applies them per submesh so one mesh can mix opaque and cutout materials.

---

## API Implementada

```cpp
namespace Caffeine::Assets {

struct Color {
    f32 r, g, b, a = 1.0f;
    static Color white();
    static Color black();
};

struct Rect3D {
    Vec3 min, max;
    Vec3 center() const;
    Vec3 extents() const;
};

struct Vertex3D {
    Vec3 position;
    Vec3 normal;
    Vec2 texcoord;
    Vec4 tangent;
};

struct SubMesh {
    u32 indexOffset = 0;
    u32 indexCount = 0;
    u32 materialIndex = 0;
    FixedString<64> name;
};

struct Mesh3D {
    std::vector<Vertex3D> vertices;
    std::vector<VertexSkin> skin;                 // parallel to vertices when skinned
    std::vector<u32> indices;
    std::vector<SubMesh> subMeshes;
    std::vector<MeshSurfaceMaterial> materials;   // per-surface glTF data
    Rect3D bounds;
    u32 lodCount = 1;
    u32 geometryRevision = 1;
    u32 uploadedRevision = 0;
    bool flipTextureV = true;                     // OBJ V-up vs glTF V-down

#ifdef CF_HAS_SDL3
    RHI::Buffer* vertexBuffer = nullptr;
    RHI::Buffer* indexBuffer = nullptr;
#endif
};

struct Material3D {
    FixedString<64> name;
    Color albedoColor = Color::white();
    f32 roughness = 0.5f;
    f32 metallic = 0.0f;
    
#ifdef CF_HAS_SDL3
    RHI::Texture* albedoTexture = nullptr;
    RHI::Texture* normalTexture = nullptr;
    RHI::Texture* roughnessTexture = nullptr;
    RHI::Shader* shader = nullptr;
#endif
};

struct MeshRenderer {
    FixedString<128> meshPath;
    Mesh3D* mesh = nullptr;
    Material3D* material = nullptr;
    bool castShadows = true;
    bool receiveShadows = true;
};

class MeshLoader {
public:
    MeshLoader() = default;
#ifdef CF_HAS_SDL3
    explicit MeshLoader(RHI::RenderDevice* device);
#endif

    static Mesh3D* fromMemory(const Vertex3D* verts, u32 vertCount, 
                              const u32* indices, u32 indexCount);
    static Mesh3D* parseOBJ(const char* src, usize srcLen);
    Mesh3D* loadOBJ(const char* path);
    
#ifdef CF_HAS_SDL3
    void uploadToGPU(Mesh3D* mesh);
#endif
};

class MeshSystem : public ECS::ISystem {
public:
    void onUpdate(ECS::World& world, f32 dt) override;
};

}  // namespace Caffeine::Assets

namespace Caffeine::ECS {

struct Position3D { Vec3 position; };
struct Rotation3D { Vec4 quaternion = Vec4(0.0f, 0.0f, 0.0f, 1.0f); };
struct Scale3D { Vec3 scale = Vec3(1.0f, 1.0f, 1.0f); };

}  // namespace Caffeine::ECS
```

---

## Shader compilation

```cpp
namespace Caffeine::Render {

struct CompiledShader {
    std::vector<u8> bytecode;
    std::string     errorLog;
    bool            success = false;
};

class ShaderCompiler {
public:
    // GLSL source → SPIR-V for the requested stage.
    CompiledShader compileGlsl(const std::string& source, RHI::ShaderStage stage,
                               const char* entryPoint = "main");
    CompiledShader compileCached(const std::string& source, RHI::ShaderStage stage,
                                 const char* entryPoint = "main");
    void clearCache();
};

}  // namespace Caffeine::Render
```

Built-in shaders are listed in `BuiltinShader` (`render/ShaderBytecode.hpp`) and created
through `createBuiltinShader`; pipelines are built with
`RenderDevice::createGraphicsPipeline(vs, fs, desc)`.

---

## Componentes ECS (editor / runtime)

```cpp
namespace Caffeine::ECS {

struct MeshFilterComponent {
    MeshPrimitive primitive = MeshPrimitive::Cube;
    std::string   customMeshPath;
    std::string   customTexturePath;
    std::string   customNormalPath;   // normal map (relativo ao projeto)
    std::string   customMaterialPath;
    f32           shininess = 32.0f;    // expoente especular Phong
};

struct MeshRendererComponent {
    std::string meshPath;
    std::string materialPath;
    bool castShadows = true;
    bool receiveShadows = true;
};

}  // namespace Caffeine::ECS
```

**Inspector:** campos Albedo Texture, Normal Map e Shininess em `MeshFilterComponent` . Serialization in `SceneSerializer` (blob after `customMaterialPath` ).

---

## Exemplos de Uso

```cpp
// ── Carregar mesh OBJ ─────────────────────────────────────────
Caffeine::Assets::MeshLoader meshLoader;
Mesh3D* mesh = meshLoader.loadOBJ("models/player.obj");

// ── Criar entidade 3D ─────────────────────────────────────────
Entity player3D = world.create();
world.add<Position3D>(player3D, {Vec3(0.0f, 0.0f, 0.0f)});
world.add<Rotation3D>(player3D);
world.add<Scale3D>(player3D, {Vec3(1.0f, 1.0f, 1.0f)});
world.add<MeshRenderer>(player3D, MeshRenderer{});

// ── Sistema de renderização ───────────────────────────────────
MeshSystem meshSystem;
meshSystem.onUpdate(world, 0.016f);
```

---

## Acceptance Criteria

- [x] Vertex3D struct definido (position, normal, texcoord, tangent vec4)
- [x] `computeMeshTangents()` after import OBJ/glTF
- [x] Normal map + shininess em `MeshFilterComponent` (GPU Phong)
- [x] Mesh3D struct com vertices, indices, subMeshes, bounds
- [x] MeshLoader::fromMemory creates mesh of vertices and indexes
- [x] MeshLoader::parseOBJ reads .obj format (v, vt, vn, f)
- [x] MeshLoader::loadOBJ loads disk file
- [x] MeshSystem::onUpdate integrado com ECS
- [x] Componentes 3D (Position3D, Rotation3D, Scale3D)
- [x] 22+ tests covering all components
- [x] Compila sem SDL3 (CPU-only path)
- [x] GPU upload guardado com #ifdef CF_HAS_SDL3

---

## Dependencies

- **Upstream:** [Asset Manager](../assets/asset-manager.md), [Formato .caf](../assets/caf-format.md), [RHI](../rendering/rhi.md)
- **Downstream:** [Skeletal Animation](../animation/skeletal-animation.md), [Asset Pipeline](asset-pipeline.md)

---

## Related topics

| Topic | Description |
|--------|-----------|
| [Rendering & Pipeline]() | Meshes e shaders na pipeline 3D |
| [Assets & Pipeline]() | Mesh loading integrado ao pipeline de assets |

## References

- [`architecture_specs.md`](../architecture_specs.md) — §15 Math Library
- [`rendering/rhi.md`](../rendering/rhi.md) — Buffer/Shader creation
- [`rendering/texture-quality-lod.md`](../rendering/texture-quality-lod.md) — LOD of textures in rendering GPU
- [`plans/2026-09-22-viewport-rendering-quality-session.md`](../plans/2026-09-22-viewport-rendering-quality-session.md) — shading seams in primitive
