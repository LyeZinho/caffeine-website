# 🦴 Skeletal Animation

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Engine</span>
  <span><strong>Namespace:</strong> <code>Caffeine::Animation</code></span>
  <span>Last verified: <time datetime="2026-11-18">2026-11-18</time></span>
  <span>Source: <a href="https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/animation/SkinLibrary.hpp"><code>animation/SkinLibrary.hpp</code></a></span>
</div>

<p class="doc-lede">Imported glTF skins become an <code>ImportedSkin</code> plus a
<code>SkinnedPose</code> component; the engine samples clips, blends them and skins
vertices on the CPU.</p>

---

## Overview

There are two related layers:

- **Runtime and editor path** — `assets/MeshLoader.cpp` imports a glTF skin into
  `ImportedSkin` (skeleton, bones and clips). An entity with a skinned mesh gets a
  `SkinnedPose`, and `tickSkinnedPoses` resolves the pose each frame. This is the path
  used by Doppio's timeline, the Animator panel and the runtime.
- **Standalone primitives** — `SkeletalAnimation.hpp` provides `Bone`, `Skeleton`,
  `SkeletalClip`, `SkeletalAnimator` and `SkeletalAnimationSystem` for direct sampling
  and tests. It is compiled and tested, but the renderer does not consume
  `SkeletalAnimator`; use `SkinnedPose` for scene characters.

Both share the same `Bone` / `Skeleton` / `SkeletalClip` types.

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

### Import and pose path

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
  <p><strong>Note.</strong> In the low-level <code>SkeletalAnimationSystem</code>,
  <code>setSpeed()</code> currently writes <code>SkeletalAnimator::blendWeight</code>, not a
  clip playback rate. Use <code>SkeletalClip::sampleAt</code> directly when you need a
  specific time.</p>
</div>

`tickSkinnedPoses` chooses the pose source in this order: the timeline's
`overrideMix`, then the entity's `Animator` layers, then the inspector's single
`clipIndex`. It then skins the bind mesh into the entity's posed vertices and writes
joint positions for the viewport overlay.

---

## Vertex Skinning

Skinning is CPU-side and runs in parallel chunks:

```text
VertexSkin (per vertex, imported):
    u16 joints[4]
    f32 weights[4]

skinVertices(bindMesh, boneMatrices, outVertices):
    for each vertex:
        p = Σ weights[i] * boneMatrices[joints[i]] * bindPosition
        n = Σ weights[i] * boneMatrices[joints[i]] * bindNormal
```

`skinVertices` copies the texture coordinates and tangent through and writes position
and normal. There is no GPU skinning shader in the current renderer; the posed vertex
buffer is uploaded like any other mesh.

`SkeletalClip::sampleAt`:

- Loops or clamps `time` based on `loop` and `duration`.
- Interpolates position and scale linearly and rotation with `Quat::slerp`.
- Resolves bones even when a parent appears after its child in the joint list.
- Computes `skinSpace * world * bindPoseInverse` for each bone.

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

`matchHumanoid` maps common Mixamo/Unity bone names into `HumanoidBone` slots and is
used automatically for imported skins unless `HumanoidRig::manual` is set.

---

## Acceptance Criteria

`tests/test_skeletal_animation.cpp` covers:

- [x] Default skeleton, keyframe and blend-node state
- [x] `findBone` lookup
- [x] `sampleAt` on an empty clip and between keyframes
- [x] Looping wraps time and non-looping clamps at the end
- [x] Parent transforms propagate to children
- [x] Rotation interpolation uses slerp
- [x] Mixamo bone names map to humanoid slots
- [x] CPU skinning moves a weighted vertex
- [x] A static glTF does not get an automatic humanoid skin
- [x] Explicit `synthesizeHumanoidSkin` still works

No frame-rate target is asserted by the suite.

---

## Dependencies

- **Upstream:** [Animation System](../animation/animation-2d.md), [3D Math](../math/vectors.md), [Mesh Loading](../assets/mesh-loading.md)
- **Downstream:** Doppio timeline, viewport joint overlay, runtime characters

---

## Static meshes and fitted humanoid rigs

A glTF without `skins` is a static mesh. Caffeine does **not** synthesize a humanoid rig
automatically when the Animator or Inspector binds it. `synthesizeHumanoidSkin` builds a
T-pose humanoid from the mesh bounds only when a tool calls it explicitly; models with
authored glTF skins import their bones and clips directly.

## 🔗 Related Topics

| Topic | Description |
|--------|-----------|
| [Animation System](../animation/animation-2d.md) | Sprite clips and the shared `Animator` graph |
| [Mesh Loading](../assets/mesh-loading.md) | glTF import and the mesh cache |
| [ECS Core](../ecs/core.md) | Components and queries |

## References

- [`src/caffeine/animation/SkeletalAnimation.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/animation/SkeletalAnimation.hpp) — bones, clips and the low-level system
- [`src/caffeine/animation/SkinLibrary.hpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/animation/SkinLibrary.hpp) — imported skins, humanoid rigs and `SkinnedPose`
- [`src/caffeine/assets/MeshLoader.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/src/caffeine/assets/MeshLoader.cpp) — glTF skin import
- [`tests/test_skeletal_animation.cpp`](https://github.com/devscafecommunity/caffeine/blob/main/tests/test_skeletal_animation.cpp) — behaviour suite
