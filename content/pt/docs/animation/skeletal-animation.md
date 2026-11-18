# 🦴 Skeletal Animation

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Animation</code></span>
  <span>Atualizado em: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Fonte: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/animation/SkinLibrary.hpp"><code>animation/SkinLibrary.hpp</code></a></span>
</div>

<p class="doc-lede">Skins glTF importados tornam-se um <code>ImportedSkin</code> mais um
componente <code>SkinnedPose</code>; a engine amostra clipes, mistura-os e faz skinning
dos vértices na CPU.</p>

---

## Visão Geral

Há duas camadas relacionadas:

- **Percurso de runtime e editor** — `assets/MeshLoader.cpp` importa uma skin glTF para
  `ImportedSkin` (skeleton, bones e clipes). Uma entidade com mesh skinned recebe um
  `SkinnedPose`, e `tickSkinnedPoses` resolve a pose em cada frame. É o percurso usado
  pela timeline do Doppio, pelo painel Animator e pelo runtime.
- **Primitivas autónomas** — `SkeletalAnimation.hpp` fornece `Bone`, `Skeleton`,
  `SkeletalClip`, `SkeletalAnimator` e `SkeletalAnimationSystem` para amostragem direta
  e testes. É compilado e testado, mas o renderer não consome `SkeletalAnimator`; usa
  `SkinnedPose` para personagens de cena.

Ambos partilham os mesmos tipos `Bone` / `Skeleton` / `SkeletalClip`.

---

## API

```cpp
namespace Caffeine::Animation {

struct Bone {
    FixedString<32> name;
    i32             parentIndex = -1;   // -1 = root
    Mat4            bindPoseInverse;
    Mat4            localTransform;     // bind-pose local TRS
};

struct Skeleton {
    std::vector<Bone> bones;
    Mat4              skinSpace;        // inverse of the skinned mesh node
    u32  boneCount() const;
    i32  findBone(const char* name) const;
};

struct SkeletalKeyframe {
    f32  time = 0.0f;
    Vec3 position {0.0f, 0.0f, 0.0f};
    Quat rotation {Quat::identity()};
    Vec3 scale    {1.0f, 1.0f, 1.0f};
};

struct SkeletalClip {
    FixedString<32> name;
    f32             duration = 0.0f;
    f32             fps      = 30.0f;
    bool            loop     = true;
    HashMap<u32, std::vector<SkeletalKeyframe>> channels;  // bone -> keys

    void sampleAt(f32 time, const Skeleton& skeleton,
                  std::vector<Mat4>& boneTransforms,
                  std::vector<Vec3>* jointPositions = nullptr) const;
};

struct BlendNode {
    enum class Type : u8 { Clip, Blend1D, Blend2D };
    Type type = Type::Clip;
    const SkeletalClip* clip = nullptr;
    std::vector<std::pair<f32, BlendNode*>> children;
    f32 parameter = 0.0f;
};

struct SkeletalAnimationState {
    FixedString<32>                  name;
    const SkeletalClip*              clip  = nullptr;
    f32                              speed = 1.0f;
    std::vector<AnimationTransition> transitions;
};

struct SkeletalAnimator {
    const Skeleton*         skeleton = nullptr;
    std::vector<Mat4>       boneMatrices;
    HashMap<FixedString<32>, SkeletalAnimationState> states;
    FixedString<32>         currentState;
    f32                     timeInState = 0.0f;
    f32                     blendWeight = 1.0f;
    bool                    paused      = false;
    BlendNode*              blendTree   = nullptr;
};

class SkeletalAnimationSystem : public ECS::ISystem {
public:
    void onUpdate(ECS::World& world, f32 dt) override;

    void play(ECS::World& world, ECS::Entity e, const char* stateName);
    void pause(ECS::World& world, ECS::Entity e);
    void resume(ECS::World& world, ECS::Entity e);
    void setSpeed(ECS::World& world, ECS::Entity e, f32 speed);
    bool isPlaying(ECS::World& world, ECS::Entity e, const char* stateName) const;
};

}  // namespace Caffeine::Animation
```

### Percurso de importação e pose

```cpp
namespace Caffeine::Animation {

struct ImportedSkin {
    Skeleton                 skeleton;
    std::vector<std::string> boneNames;
    std::vector<SkeletalClip> clips;
    std::vector<std::string> clipNames;
    const Assets::Mesh3D*    mesh = nullptr;
    bool                     synthesized = false;
};

void registerImportedSkin(const std::string& path, ImportedSkin skin);
const ImportedSkin* findImportedSkin(const std::string& path);
bool synthesizeHumanoidSkin(const std::string& path, Assets::Mesh3D& mesh,
                            bool replace = false);

struct SkinnedPose {
    char  meshPath[260] = {};
    i32   clipIndex = 0;
    f32   time = 0.0f;
    f32   speed = 1.0f;
    bool  playing = false;
    bool  editorHeld = false;   // clears on load; Play starts the clip
    bool  loop = true;
    bool  loaded = false;
    bool  sampleKeys = false;   // timeline keys replace the sampled pose
    HumanoidRig humanoid;
    std::vector<BonePose>     offsets;
    std::vector<BoneKeyframe> keys;
    std::vector<ObjectKeyframe> objectKeys;
    std::vector<i32>          removedBones;
    std::vector<ClipStrip>    strips;
    std::vector<PoseLayerMix> overrideMix;
    u64  overrideFrame = 0;
    bool timelineHold = false;
};

SkinnedPose* ensurePoseForMesh(ECS::World& world, ECS::Entity entity,
                               const std::string& projectRoot);
void tickSkinnedPoses(ECS::World& world, f32 dt);

}  // namespace Caffeine::Animation
```

<div class="doc-callout doc-callout--note">
  <p><strong>Nota.</strong> No <code>SkeletalAnimationSystem</code> de baixo nível,
  <code>setSpeed()</code> escreve atualmente <code>SkeletalAnimator::blendWeight</code>, não
  uma taxa de reprodução do clipe. Usa <code>SkeletalClip::sampleAt</code> diretamente quando
  precisares de um tempo específico.</p>
</div>

`tickSkinnedPoses` escolhe a fonte da pose por esta ordem: o `overrideMix` da timeline,
depois as camadas do `Animator` da entidade, depois o `clipIndex` único do inspector. Em
seguida faz skinning da mesh bind para os vértices posed da entidade e escreve as
posições das joints para o overlay do viewport.

---

## Vertex Skinning

O skinning é feito na CPU e corre em blocos paralelos:

```text
VertexSkin (per vertex, imported):
    u16 joints[4]
    f32 weights[4]

skinVertices(bindMesh, boneMatrices, outVertices):
    for each vertex:
        p = Σ weights[i] * boneMatrices[joints[i]] * bindPosition
        n = Σ weights[i] * boneMatrices[joints[i]] * bindNormal
```

`skinVertices` copia as coordenadas de textura e a tangente e escreve posição e normal.
Não existe shader de skinning na GPU no renderer atual; o buffer de vértices posed é
enviado como qualquer outra mesh.

`SkeletalClip::sampleAt`:

- Faz loop ou clamp do `time` conforme `loop` e `duration`.
- Interpola posição e escala linearmente e rotação com `Quat::slerp`.
- Resolve bones mesmo quando um pai aparece depois do filho na lista de joints.
- Calcula `skinSpace * world * bindPoseInverse` para cada bone.

---

## Exemplos de Uso

```cpp
// ── Inspect an imported clip ──────────────────────────────────
const ImportedSkin* skin = Caffeine::Animation::findImportedSkin("characters/hero.gltf");
if (skin && !skin->clips.empty()) {
    std::vector<Mat4> bones(skin->skeleton.boneCount());
    skin->clips[0].sampleAt(0.5f, skin->skeleton, bones);
}

// ── Attach a pose to an entity ────────────────────────────────
SkinnedPose* pose = Caffeine::Animation::ensurePoseForMesh(world, hero,
                                                           projectRoot);
if (pose) {
    pose->clipIndex = 1;
    pose->loop = true;
    pose->editorHeld = false;   // allow playback
}

// ── Drive the state graph through the Animator ────────────────
Animator& animator = world.add<Animator>(hero);
animator.defaultState = "Idle";
// states, transitions and parameters are shared with the 2D path.

// ── Tick poses once per frame before rendering ────────────────
Caffeine::Animation::tickSkinnedPoses(world, dt);
```

`matchHumanoid` mapeia nomes de bones comuns de Mixamo/Unity para slots
`HumanoidBone` e é usado automaticamente em skins importadas, a menos que
`HumanoidRig::manual` esteja definido.

---

## Critério de Aceitação

`tests/test_skeletal_animation.cpp` cobre:

- [x] Estado por omissão de skeleton, keyframe e blend node
- [x] Procura com `findBone`
- [x] `sampleAt` num clipe vazio e entre keyframes
- [x] Loop dá a volta ao tempo e clipes sem loop param no fim
- [x] Transforms do pai propagam para os filhos
- [x] A interpolação de rotação usa slerp
- [x] Nomes de bones Mixamo mapeiam para slots humanoides
- [x] Skinning na CPU move um vértice com peso
- [x] Um glTF estático não recebe skin humanoide automática
- [x] `synthesizeHumanoidSkin` explícito continua a funcionar

A suite não impõe um alvo de frame rate.

---

## Dependências

- **Upstream:** [Animation System](../animation/animation-2d.md), [3D Math](../math/vectors.md), [Mesh Loading](../assets/mesh-loading.md)
- **Downstream:** timeline do Doppio, overlay de joints no viewport, personagens do runtime

---

## Static meshes and fitted humanoid rigs

Um glTF sem `skins` é uma mesh estática. O Caffeine **não** sintetiza uma rig humanoide
automaticamente quando o Animator ou o Inspector a liga. `synthesizeHumanoidSkin` cria um
humanoide em T-pose a partir dos limites da mesh apenas quando uma ferramenta o chama
explicitamente; modelos com skins glTF autorais importam os bones e clipes diretamente.

## 🔗 Tópicos Relacionados

| Tópico | Descrição |
|--------|-----------|
| [Animation System](../animation/animation-2d.md) | Clipes de sprite e o grafo `Animator` partilhado |
| [Mesh Loading](../assets/mesh-loading.md) | Importação glTF e cache de meshes |
| [ECS Core](../ecs/core.md) | Componentes e queries |

## Referências

- [`src/caffeine/animation/SkeletalAnimation.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/animation/SkeletalAnimation.hpp) — bones, clipes e o sistema de baixo nível
- [`src/caffeine/animation/SkinLibrary.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/animation/SkinLibrary.hpp) — skins importadas, rigs humanoides e `SkinnedPose`
- [`src/caffeine/assets/MeshLoader.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/assets/MeshLoader.cpp) — importação de skins glTF
- [`tests/test_skeletal_animation.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_skeletal_animation.cpp) — suite de comportamento
