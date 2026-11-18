# Caffeine contra o manual da Unity 5.6

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

Doppio and runtime inventory in October 2026, read from code in `src/` . The criterion is to get the work that the page describes, do not copy the name of the menu.

| Temos | Parcial | Falta | Fora de escopo |
| ---: | ---: | ---: | ---: |
| 19 | 32 | 17 | 6 |

## What this plan isn't

Legacy families of shaders, Asset Store, online services, IL2CPP and cluster do not join the queue. The graphical path is already PBR forward with HDR. The scripting is Moon, not C#.

## Coverage per chapter

Input count of this inventory. Out of scope does not enter the bars.

| Chapter | Temos | Parcial | Falta |
| --- | ---: | ---: | ---: |
| Arranque | 1 | 1 | 0 |
| Assets | 1 | 2 | 1 |
| Janelas | 3 | 5 | 0 |
| Cena | 3 | 3 | 0 |
| Input e build | 0 | 2 | 2 |
| Editor | 1 | 1 | 0 |
| 2D | 1 | 2 | 2 |
| Luz e materiais | 3 | 4 | 4 |
| Terreno e efeitos | 1 | 2 | 1 |
| 3D Physics | 2 | 1 | 1 |
| Scripting | 1 | 2 | 0 |
| UI | 1 | 1 | 2 |
| Navigation | 0 | 1 | 0 |
| Animation | 0 | 4 | 2 |
| Audio | 0 | 1 | 1 |
| Network and services | 0 | 0 | 1 |

## Construction order

For an editor who cares about a character, he gets excited and plays the scene. It's not the manual order.

| | Frente | O que fecha |
| ---: | --- | --- |
| 1 | Visible and stable character | Reload the glTF with the bind calibration, confirm Running on the chalk site and frame time without the 17 km mesh. |
| 2 | Real Animation Window | Playhead that stays where you leave off, Key at the right time, bone rotation curves and replay of the recorded clip. |
| 3 | Animator with parameters | Transitions per float/bool/trigger, not just a state by clip name. |
| 4 | Import Settings do modelo | Escala, eixo, clipes e rig numa ficha do asset, em vez de adivinhar na carga. |
| 5 | Character physics | Character controller, mesh collider e um joint. Cloth e wheel ficam depois. |
| 6 | Usable game IU | Image, editable text, scroll and a horizontal/vertical layout. |
| 7 | NavMesh | Bake from geometry and an agent who walks to a point, coupled to the animator. |
| 8 | Project Definitions | A site for physics, time, quality, tags and input, like Unity's managers. |

## Lista do manual

74 entries. Source: Tree `src/` Caffeine, not Unity's documentation. Sister pages, such as each shader legacy or each 2D joint, count as a single gap.

| Chapter | Unity Page | Estado | No Caffeine |
| --- | --- | --- | --- |
| Arranque | Instalador e Learn tab | Fora de escopo | Doppio compiles by CMake. There's no hub or built-in tutorials. |
| Arranque | Projeto 2D ou 3D | Temos | template_type no project.caffeine abre a viewport no modo certo. |
| Arranque | Deploy offline do editor | Parcial | Local torque, no installation package, no activation. |
| Assets | Primitivas (cubo, esfera, cilindro, cone) | Temos | Shared procedural meshes, with editable geometry per entity. |
| Assets | Importar modelos, texturas e materiais | Parcial | glTF/GLB/OBJ, PNG and .mat. FBX is not a first-class importer. |
| Assets | Import Settings por asset | Falta | No scale tab, rig, animations or import compression. |
| Assets | Asset Store e Standard Assets | Fora de escopo | Unity's shop. The project receives default skies in assets/raw/sky. |
| Assets | Pacotes de assets | Parcial | Prefabs and caf-pack. There is no .unitypackage. |
| Janelas | Project, Hierarchy, Inspector | Temos | Asset Browser, hierarquia e inspector de componentes. |
| Janelas | Scene View and navigation | Temos | Orbit, pan, zoom, Persp/Ortho, shaft chalk designed. |
| Janelas | Mover, rodar e escalar | Temos | Gizmos in Toolbox, local space/world, snap. |
| Janelas | Barra da Scene View e menu Gizmos | Parcial | Toolbox no lugar da barra. Luzes e ossos desenham-se, sem menu para os ligar. |
| Janelas | Game View | Parcial | Gameplay Preview. It is not a game view with resolution and own stats. |
| Janelas | Icons, presets and research | Parcial | Entity presets and materials. No hierarchy icons, no global search. |
| Janelas | Workspace e janelas do sistema | Parcial | Panels come out of the O.R. window. At Wayland the mapping is still fragile. |
| Janelas | Hotkeys do editor | Parcial | Ctrl+S grava, Ctrl+Z desfaz, T/E/R/Q no gizmo. Sem mapa completo. |
| Cena | Cenas, entidades e componentes | Temos | ECS com serializer do editor, undo por snapshot da cena. |
| Cena | Transform | Temos | 2D and 3D, position, rotation and scale. |
| Cena | Desativar, tags e static | Parcial | There is effective disable. Tag is empty. Static and surrender layers don't exist. |
| Cena | Prefabs | Parcial | Gravar e instanciar. Sem overrides aninhados como na Unity. |
| Cena | Gravar a cena | Temos | Ctrl+S escreve a cena e os materiais. |
| Cena | Componentes por script | Parcial | Moon, not C#. No MonoBehaviour or execution order. |
| Input e build | Input de teclado, rato e gamepad | Parcial | Actions and axes in the code. No editable Input Manager. |
| Input e build | VR, OpenVR and mobile input | Falta | No VR devices, no mobile keyboard. |
| Input e build | Build Settings e Player Settings | Parcial | Build dialogue. No platform matrix, splash or platform quality. |
| Input e build | Managers (physics, time, tags, quality, graphics) | Falta | Options are scattered. There is no equivalent design screen. |
| Editor | Preferences and 2D/3D mode | Temos | Settings and viewport 2D, 3D and isometric. Viewport AA is separated from the game. |
| Editor | Special folders and version control | Parcial | assets/raw e plugin de git. Sem Perforce nem export de package. |
| Editor | Visual Studio, RenderDoc, analytics, IME | Fora de escopo | Unity Product Integrations. The editor has its own console and crash log. |
| 2D | Sprites e sprite sheet | Parcial | Sprite, folha e clipe de frames. Sem Sprite Editor, outline, packer nem 9-slice. |
| 2D | Sorting Group | Falta | No sprite ordering per group. |
| 2D | Rigidbody 2D e colliders simples | Parcial | Body and collider box or circle. No polygon, no edge, no capsule, no compound. |
| 2D | Joints, effectors e material 2D | Falta | Nenhum dos joints nem effectors da lista. |
| 2D | Tilemap | Temos | Tilemap editor, outside of this list of Unity 5.6 but already in Doppio. |
| Luz e materiais | Direcional, ponto e spot | Temos | More volumetric light as editable mesh. |
| Luz e materiais | Cookies, area light e Light Explorer | Falta | Sem textura de cookie nem janela de todas as luzes. |
| Luz e materiais | Sombras | Parcial | Sombra direcional no GPU. Sem shadowmask, baked nem luzes todas a projetar. |
| Luz e materiais | GI, lightmaps e light probes | Falta | No precalculation. Diffuse IBL is switched off on purpose; speculating reflects the sky. |
| Luz e materiais | Skybox de projeto | Temos | Assets in assets/raw/sky. No sky, fallback is blue with white horizon. |
| Luz e materiais | Chambers and frustum | Parcial | Camera 2D/3D and post on camera. No cameras, no oblique, no occlusion cooking. |
| Luz e materiais | Standard Shader / PBR | Temos | Albedo, metal, roughness, normal, AO, emission, opacity, transmission, clearcoat, sheen. |
| Luz e materiais | Legacy families of shaders | Fora de escopo | Vertex-lit, bumped, parallax and old reflection. The path is PBR forward. |
| Luz e materiais | Reflection probes e SSR | Parcial | Automatic probes per object and SSR. No probes placed by hand. |
| Luz e materiais | HDR e linear | Temos | Cena HDR e texturas sRGB. Sem escolher gamma vs linear no projeto. |
| Luz e materiais | LOD, instancing e batching | Parcial | LOD de mesh e instancing parcial. Sem frame debugger nem stats de draw calls. |
| Luz e materiais | Compute, command buffers, sparse, cluster | Falta | The RHI has internal command buffer. None of this is exposed to the game. |
| Luz e materiais | Video | Falta | Sem Video Player. |
| Terreno e efeitos | Terreno: altura, tintas e LOD | Parcial | Sculpture, splat and chunks. No trees, no grass, no wind, no SpeedTree. |
| Terreno e efeitos | Particles | Parcial | Emissor simples e efeitos. Sem sistema modular da Unity. |
| Terreno e efeitos | Post-processing | Temos | AA, AO, SSR, fog, DOF, motion blur, exposure, bloom, grading, CA, grain, vigneta. |
| Terreno e efeitos | LUT, dithering, monitors and powder debug | Falta | The stack exists. There are no diagnostic and user LUT views. |
| 3D Physics | Rigidbody e material simples | Temos | Dynamic, kinematic, static, friction and restitution in the body. |
| 3D Physics | Box, sphere e capsule | Temos | Mais trigger. Sem mesh collider nem terrain collider dedicado na lista de componentes. |
| 3D Physics | Joints, ragdoll, cloth e wheel | Falta | Nenhum joint, character controller, cloth nem roda. |
| 3D Physics | Physical debug | Parcial | Overlay 2D. The 3D doesn't have Unity's debug view. |
| Scripting | Scripts no inspector e eventos | Parcial | Moon with bindings. No corrosives, UnityEvent or serialization of script fields. |
| Scripting | Consola | Temos | Console do editor e log de crash. |
| Scripting | Test runner e debugger | Parcial | Catch2 fora do editor. Sem debugger ligado ao jogo. |
| Scripting | IL2CPP e stripping | Fora de escopo | Runtime is already C++ native. |
| UI | Canvas, rect, button, text, slider, checkbox | Temos | Withheld IU with basic layout. |
| UI | Image, mask, dropdown, input, scroll e layout groups | Falta | No auto-layout, scaler, mask or text field. |
| UI | World UI and various resolutions | Falta | No world-space canvas, no screen transitions. |
| UI | IMGUI | Parcial | The editor is ImGui. The game does not expose ONGUI. |
| Navigation | NavMesh, agent, obstacle and links | Parcial | NavVolume grid and agent. No mesh bake, areas, costs or off-mesh. |
| Animation | Clipes importados de glTF | Parcial | Running/Walking in. The frame scale cm/m broke the mesh; the bind calibration corrects this in the next load. |
| Animation | Avatar humanoide | Parcial | Automatic and manual bone mapping. No muscle, no avatar asset. |
| Animation | Animation Window | Parcial | Timeline with bones and object. Keyframes are not yet editable curves, and playhead time is unreliable. |
| Animation | Animator: states, parameters, transitions | Parcial | State graph from the clips. No parameters, blend trees, layers, IK or root motion. |
| Animation | Masks, events, split and delay | Falta | Sem avatar mask, animation events nem retarget entre personagens. |
| Animation | Importador FBX de rig | Falta | Sem abas Rig e Animations da Unity. |
| Audio | Clip e fonte | Parcial | AudioEmitter e preview. Sem listener como componente de cena completo. |
| Audio | Mixer, filtros, zonas e microfone | Falta | Sem Audio Mixer nem reverb zones. |
| Network and services | HLAPI, lobby, transport and services | Fora de escopo | Unity and Unity Services network. They're not the editor's core. |
| Network and services | VR e cluster | Falta | No cluster rendering, no VR cameras. |

## Quick reading

You can already work: scene, hierarchy, inspector, chalks, PBR materials, project sky, post-processing, lights, basic terrain, simple prefabs, primitive physics and minimum UI.

It's halfway through and that's what you feel in the editor: character import, timeline, animator, shadows, probes, particles, grid navigation, audio and project settings.
