/** @deprecated Legacy marketing copy — not used for the docs tab. See engineDocs.ts + content/search-index.json */
import { DocSection, Language } from '../types';

export const DOC_SECTIONS_PT: DocSection[] = [
  {
    id: 'intro-caffeine',
    category: 'Início',
    title: 'Visão Geral do Caffeine & Doppio',
    summary: 'Separação estrita entre o núcleo de execução de alta performance (Caffeine) e seu ambiente visual (Doppio).',
    content: `O ecossistema foi projetado sobre um princípio simples: separação estrita entre o núcleo de execução e a interface gráfica de criação.

• **Caffeine (Core Engine)**: Runtime em C++23 e Rust, compilado para código de máquina puro com zero overhead de garbage collection. Implementa uma arquitetura ECS linear com alocação contígua em arquétipos na memória, garantindo taxas de cache-hit superiores a 98% no CPU.
• **Doppio (IDE & Visual Editor)**: Interface gráfica construída em torno do Caffeine. Oferece visualização em tempo real de cena (2D e 3D), inspetor de entidades, edição de grafos de lógica visual sem código ou híbrido, editor de shaders com live-reload e gerenciamento unificado de assets.

Quando você compila seu projeto para produção (Windows, Linux, macOS, Android, iOS ou WebGPU), o binário resultante contém apenas o Caffeine Core ultra-leve (~4.2 MB), sem o peso da IDE.`,
    codeSnippets: [
      {
        lang: 'bash',
        label: 'CLI do Caffeine',
        code: `# Criar um novo projeto Caffeine com template
caffeine new meu-jogo --template ecs-action
cd meu-jogo

# Abrir o projeto diretamente na IDE Doppio
doppio .

# Ou rodar diretamente em modo release
caffeine run --release`
      }
    ],
    seeAlso: ['instalacao-cli', 'estrutura-projeto', 'ecs-world']
  },
  {
    id: 'instalacao-cli',
    category: 'Início',
    title: 'Instalação e CLI Toolchain',
    summary: 'Como instalar o binário do Caffeine e o executável da IDE Doppio em qualquer sistema operacional.',
    content: `A toolchain do Caffeine é distribuída como binários estáticos independentes para x86_64 e ARM64. O instalador configura automaticamente o compilador de shaders SPIR-V e os drivers Vulkan/Metal/DirectX 12 do seu sistema.`,
    codeSnippets: [
      {
        lang: 'bash',
        label: 'Linux & macOS',
        code: `curl -fsSL https://get.caffeine.dev | sh
# Verifica instalação
caffeine --version
doppio --version`
      },
      {
        lang: 'powershell',
        label: 'Windows PowerShell',
        code: `irm https://get.caffeine.dev/win.ps1 | iex
caffeine doctor`
      }
    ],
    params: [
      { name: '--template', type: 'string', description: 'Template inicial: "empty", "2d-platformer", "3d-fps"', default: 'empty' },
      { name: '--backend', type: 'string', description: 'Backend gráfico padrão: "vulkan", "dx12", "metal", "webgpu"', default: 'vulkan' },
      { name: '--opt-level', type: 'int (0-3)', description: 'Nível de otimização para compilações nativas de release', default: '3' }
    ],
    seeAlso: ['intro-caffeine', 'estrutura-projeto']
  },
  {
    id: 'estrutura-projeto',
    category: 'Início',
    title: 'Estrutura de Diretórios de um Projeto',
    summary: 'Organização limpa e determinística dos arquivos de assets, códigos e cenas do Doppio.',
    content: `Todo projeto gerado pelo Caffeine segue uma estrutura previsível, compatível com controle de versão Git sem conflitos de arquivos binários desnecessários:

• **assets/**: Texturas (PNG, KTX2), áudio (OGG, WAV), malhas (GLTF, OBJ) e fontes.
• **src/**: Scripts de gameplay em C# ou C++/Rust.
• **scenes/**: Arquivos declarativos em formato texto legível (.caffscene) gerados pelo Doppio.
• **shaders/**: Shaders WGSL / GLSL com hot-reload ativo.
• **caffeine.toml**: Configuração principal do motor.`,
    codeSnippets: [
      {
        lang: 'toml',
        label: 'caffeine.toml',
        code: `[project]
name = "CyberEspresso"
version = "0.1.0"

[graphics]
target_fps = 144
vsync = true
backend = "auto"
msaa_samples = 4

[physics]
fixed_timestep_hz = 60.0
gravity = [0.0, -9.81, 0.0]
deterministic = true`
      }
    ],
    seeAlso: ['intro-caffeine', 'doppio-interface']
  },
  {
    id: 'ecs-world',
    category: 'Caffeine Core',
    title: 'World, Entidades & Componentes',
    summary: 'Armazenamento contíguo em arquétipos e queries sem lock.',
    content: `No Caffeine, dados e comportamentos são estritamente separados. Uma Entidade é um identificador numérico de 64 bits. Os Componentes são structs simples de dados puros (POD).

O gerenciador de mundo (**World**) agrupa entidades com a mesma combinação de componentes em colunas contíguas de memória chamadas **Arquétipos**.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'C# Script',
        code: `using Caffeine.Core;
using Caffeine.Math;

public struct Velocity : IComponent {
    public Vec2 Value;
    public float Friction;
}

public class GameSpawner : System {
    public override void OnStart(World world) {
        Entity player = world.CreateEntity();
        world.Attach(player, new Transform2D { Position = new Vec2(0, 0) });
        world.Attach(player, new Velocity { Value = new Vec2(12.5f, 0f), Friction = 0.95f });
    }
}`
      }
    ],
    params: [
      { name: 'world.CreateEntity()', type: 'Entity', description: 'Aloca um ID livre na tabela de gerações' },
      { name: 'world.Attach<T>(entity, component)', type: 'void', description: 'Transfere a entidade para o arquétipo com componente T' },
      { name: 'world.Query<T1, T2>()', type: 'QueryIterator', description: 'Gera um iterador SIMD vetorizado sobre os dados contíguos' }
    ],
    seeAlso: ['ecs-systems', 'fisica-rigidbody']
  },
  {
    id: 'ecs-systems',
    category: 'Caffeine Core',
    title: 'Sistemas & Execução Paralela',
    summary: 'Processamento multi-threading automático sem race conditions no Caffeine.',
    content: `Os Sistemas contêm toda a lógica de transformação do jogo. O agendador de tarefas do Caffeine analisa as dependências de leitura e escrita de componentes em tempo de compilação. Sistemas sem conflito de escrita rodam em paralelo em todos os núcleos da CPU.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'MovementSystem',
        code: `using Caffeine.Core;

public class MovementSystem : ISystem {
    public void Update(World world, float deltaTime) {
        world.Query<Transform2D, Velocity>().ForEach((ref Transform2D tf, ref Velocity vel) => {
            tf.Position += vel.Value * deltaTime;
            vel.Value *= vel.Friction;
        });
    }
}`
      }
    ],
    seeAlso: ['ecs-world', 'fisica-rigidbody']
  },
  {
    id: 'doppio-interface',
    category: 'Doppio IDE',
    title: 'Ambiente de Trabalho Doppio: Painéis & Atalhos',
    summary: 'Aprenda a navegar com velocidade na IDE: Hierarquia, Viewport, Inspetor e Console.',
    content: `O Doppio foi construído sob uma interface ágil de alto contraste, com tempos de resposta de clique abaixo de 16ms e consumo médio de memória de 140MB.

• **Hierarquia**: Árvore de nós da cena atual com camadas e filtros.
• **Viewport**: Janela de renderização com gizmos (W, E, R), wireframe e toggle para grafos.
• **Inspetor**: Edição ao vivo de propriedades com reflexão direta.
• **Console & Profiler**: Diagnóstico de draw calls, VSync e tempo de quadro.`,
    codeSnippets: [
      {
        lang: 'text',
        label: 'Atalhos de Teclado',
        code: `F5            -> Iniciar / Pausar Simulação
F6            -> Avançar 1 único frame na física
Ctrl + Space  -> Criação Rápida de Nós
Ctrl + S      -> Salvar Cena e Hot-Reload de Shaders
Ctrl + K      -> Busca Global de Métodos e Assets`
      }
    ],
    seeAlso: ['doppio-graphs', 'ecs-world']
  },
  {
    id: 'doppio-graphs',
    category: 'Doppio IDE',
    title: 'Doppio Graphs: Lógica Visual Conectada',
    summary: 'Crie comportamentos e máquinas de estado visualmente, compilando para C++ nativo.',
    content: `O editor de grafos do Doppio não é interpretado; ele gera representações AST que compilam diretamente para código C++ nativo na compilação final. Conecte eventos, entradas e cálculos matemáticos com facilidade.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'Nó Customizado para Doppio',
        code: `using Caffeine.Doppio;

[DoppioNode(Category = "Combat", Name = "Calcular Dano")]
public static class CombatNodes {
    public static float ComputeDamage(float baseAtk, float multiplier) {
        return baseAtk * multiplier;
    }
}`
      }
    ],
    seeAlso: ['doppio-interface', 'ecs-systems']
  },
  {
    id: 'fisica-rigidbody',
    category: 'Física & ECS',
    title: 'Física 2D & 3D Determinística',
    summary: 'Corpos rígidos, colisores e integração numérica estável para netcode.',
    content: `A física do Caffeine é determinística em ciclos fixos (60Hz ou 120Hz configuráveis), permitindo partidas multiplayer com netcode rollback ou replays idênticos em qualquer plataforma.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'RigidBody2D Dinâmico',
        code: `var entity = world.CreateEntity();
world.Attach(entity, new Transform2D { Position = new Vec2(100, 350) });
world.Attach(entity, new RigidBody2D {
    BodyType = BodyType.Dynamic,
    Mass = 1.5f,
    ContinuousCollision = true
});
world.Attach(entity, new CircleCollider2D {
    Radius = 24.0f,
    Restitution = 0.85f,
    Friction = 0.2f
});`
      }
    ],
    params: [
      { name: 'Mass', type: 'float', description: 'Massa em quilogramas (0 = estático)', default: '1.0' },
      { name: 'Restitution', type: 'float', description: 'Coeficiente de restituição (quique elástico)', default: '0.0' },
      { name: 'ContinuousCollision', type: 'bool', description: 'Ativa varredura contínua contra paredes', default: 'false' }
    ],
    seeAlso: ['ecs-world', 'shaders-crema']
  },
  {
    id: 'shaders-crema',
    category: 'Render & Shaders',
    title: 'Pipeline de Shaders & Partículas Crema',
    summary: 'Hot-reload atômico de shaders e partículas no pipeline WebGPU e Vulkan.',
    content: `Ao alterar qualquer arquivo WGSL ou GLSL no disco ou no editor visual, o compilador SPIR-V em background recompila o descritor de pipeline gráfico em menos de 10 milissegundos sem pausar a simulação.`,
    codeSnippets: [
      {
        lang: 'wgsl',
        label: 'Shaders/CoffeeCrema.wgsl',
        code: `struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let noise = sin(in.uv.x * 20.0) * cos(in.uv.y * 20.0);
    return vec4<f32>(0.9, 0.5, 0.1, 1.0) * (noise * 0.5 + 0.5);
}`
      }
    ],
    seeAlso: ['doppio-interface', 'fisica-rigidbody']
  }
];

export const DOC_SECTIONS_EN: DocSection[] = [
  {
    id: 'intro-caffeine',
    category: 'Início',
    title: 'Caffeine & Doppio Overview',
    summary: 'Strict separation between the high-performance execution engine (Caffeine) and its visual IDE (Doppio).',
    content: `The ecosystem is engineered around a core principle: strict separation between the execution core and the visual creation interface.

• **Caffeine (Core Engine)**: Native runtime in C++23 and Rust, compiled to machine code with zero garbage collection overhead. Implements a linear ECS architecture with contiguous archetype memory allocation, delivering over 98% CPU cache hit rates.
• **Doppio (IDE & Visual Editor)**: Graphical editor built around Caffeine. Features real-time 2D and 3D scene preview, entity inspector, visual node graph scripting, live shader hot-reloading, and unified asset management.

When building for production (Windows, Linux, macOS, Android, iOS, or WebGPU), the output binary contains only the lightweight Caffeine Core (~4.2 MB), free from IDE overhead.`,
    codeSnippets: [
      {
        lang: 'bash',
        label: 'Caffeine CLI',
        code: `# Create a new Caffeine project
caffeine new my-game --template ecs-action
cd my-game

# Open the project in Doppio IDE
doppio .

# Or run headless/core in release mode
caffeine run --release`
      }
    ],
    seeAlso: ['instalacao-cli', 'estrutura-projeto', 'ecs-world']
  },
  {
    id: 'instalacao-cli',
    category: 'Início',
    title: 'Installation & Toolchain CLI',
    summary: 'How to install Caffeine binary and Doppio IDE on any operating system.',
    content: `The Caffeine toolchain is distributed as self-contained static binaries for x86_64 and ARM64. The installer configures SPIR-V compilers and graphics drivers (Vulkan, Metal, DirectX 12) automatically.`,
    codeSnippets: [
      {
        lang: 'bash',
        label: 'Linux & macOS',
        code: `curl -fsSL https://get.caffeine.dev | sh
# Verify installation
caffeine --version
doppio --version`
      },
      {
        lang: 'powershell',
        label: 'Windows PowerShell',
        code: `irm https://get.caffeine.dev/win.ps1 | iex
caffeine doctor`
      }
    ],
    params: [
      { name: '--template', type: 'string', description: 'Initial template: "empty", "2d-platformer", "3d-fps"', default: 'empty' },
      { name: '--backend', type: 'string', description: 'Graphics backend: "vulkan", "dx12", "metal", "webgpu"', default: 'vulkan' },
      { name: '--opt-level', type: 'int (0-3)', description: 'Optimization level for native release compilation', default: '3' }
    ],
    seeAlso: ['intro-caffeine', 'estrutura-projeto']
  },
  {
    id: 'estrutura-projeto',
    category: 'Início',
    title: 'Project Directory Structure',
    summary: 'Clean and deterministic file organization for assets, scripts, and Doppio scenes.',
    content: `Every Caffeine project follows a predictable layout compatible with Git version control:

• **assets/**: Textures (PNG, KTX2), audio (OGG, WAV), meshes (GLTF, OBJ), and fonts.
• **src/**: Gameplay scripts in C#, C++, or Rust.
• **scenes/**: Human-readable declarative scene files (.caffscene) produced by Doppio.
• **shaders/**: WGSL and GLSL shaders with live hot-reload.
• **caffeine.toml**: Main engine configuration file.`,
    codeSnippets: [
      {
        lang: 'toml',
        label: 'caffeine.toml',
        code: `[project]
name = "CyberEspresso"
version = "0.1.0"

[graphics]
target_fps = 144
vsync = true
backend = "auto"
msaa_samples = 4

[physics]
fixed_timestep_hz = 60.0
gravity = [0.0, -9.81, 0.0]
deterministic = true`
      }
    ],
    seeAlso: ['intro-caffeine', 'doppio-interface']
  },
  {
    id: 'ecs-world',
    category: 'Caffeine Core',
    title: 'World, Entities & Components',
    summary: 'Contiguous archetype memory storage and lock-free systems queries.',
    content: `In Caffeine, data and logic are strictly separated. An Entity is a lightweight 64-bit ID. Components are Plain Old Data (POD) structs. The World groups entities with matching component combinations into contiguous memory buffers called Archetypes.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'C# Script',
        code: `using Caffeine.Core;
using Caffeine.Math;

public struct Velocity : IComponent {
    public Vec2 Value;
    public float Friction;
}

public class GameSpawner : System {
    public override void OnStart(World world) {
        Entity player = world.CreateEntity();
        world.Attach(player, new Transform2D { Position = new Vec2(0, 0) });
        world.Attach(player, new Velocity { Value = new Vec2(12.5f, 0f), Friction = 0.95f });
    }
}`
      }
    ],
    params: [
      { name: 'world.CreateEntity()', type: 'Entity', description: 'Allocates a free ID in generation table' },
      { name: 'world.Attach<T>(entity, component)', type: 'void', description: 'Migrates entity to archetype containing component T' },
      { name: 'world.Query<T1, T2>()', type: 'QueryIterator', description: 'Returns a SIMD vectorized iterator over contiguous memory' }
    ],
    seeAlso: ['ecs-systems', 'fisica-rigidbody']
  },
  {
    id: 'ecs-systems',
    category: 'Caffeine Core',
    title: 'Systems & Parallel Scheduling',
    summary: 'Automatic multi-threaded execution without race conditions in Caffeine.',
    content: `Systems contain the game logic. The task scheduler analyzes component read and write dependencies at compile time. Systems without conflicting writes execute concurrently across all available CPU cores.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'MovementSystem',
        code: `using Caffeine.Core;

public class MovementSystem : ISystem {
    public void Update(World world, float deltaTime) {
        world.Query<Transform2D, Velocity>().ForEach((ref Transform2D tf, ref Velocity vel) => {
            tf.Position += vel.Value * deltaTime;
            vel.Value *= vel.Friction;
        });
    }
}`
      }
    ],
    seeAlso: ['ecs-world', 'fisica-rigidbody']
  },
  {
    id: 'doppio-interface',
    category: 'Doppio IDE',
    title: 'Doppio Workspace: Panels & Shortcuts',
    summary: 'Master the editor layout: Hierarchy, Viewport, Inspector, and Console.',
    content: `Doppio features a snappy high-contrast workspace with sub-16ms click response times and ~140MB memory usage.

• **Hierarchy**: Scene node tree with layers and instant search.
• **Viewport**: Render window with transformation gizmos (W, E, R), wireframe toggle, and graph view.
• **Inspector**: Live property editing with direct type reflection.
• **Console & Profiler**: Real-time draw call, VSync, and frame timing metrics.`,
    codeSnippets: [
      {
        lang: 'text',
        label: 'Keyboard Shortcuts',
        code: `F5            -> Play / Pause Viewport Simulation
F6            -> Step 1 physics frame
Ctrl + Space  -> Quick Node Palette
Ctrl + S      -> Save Scene & Trigger Shader Hot-Reload
Ctrl + K      -> Global Search for APIs and Assets`
      }
    ],
    seeAlso: ['doppio-graphs', 'ecs-world']
  },
  {
    id: 'doppio-graphs',
    category: 'Doppio IDE',
    title: 'Doppio Graphs: Connected Visual Logic',
    summary: 'Build visual gameplay behaviors that compile to native C++.',
    content: `Doppio Graphs produces Abstract Syntax Trees (AST) that compile directly to native C++ in production builds. Connect input events, math nodes, and physics forces visually.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'Custom Node for Doppio',
        code: `using Caffeine.Doppio;

[DoppioNode(Category = "Combat", Name = "Compute Damage")]
public static class CombatNodes {
    public static float ComputeDamage(float baseAtk, float multiplier) {
        return baseAtk * multiplier;
    }
}`
      }
    ],
    seeAlso: ['doppio-interface', 'ecs-systems']
  },
  {
    id: 'fisica-rigidbody',
    category: 'Física & ECS',
    title: 'Deterministic 2D & 3D Physics',
    summary: 'Rigid bodies, colliders, and stable numerical integration for rollback netcode.',
    content: `Caffeine Physics is deterministic at fixed timesteps (60Hz or 120Hz), ensuring multiplayer rollback and replays reproduce identical states across PC and consoles.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'Dynamic RigidBody2D',
        code: `var entity = world.CreateEntity();
world.Attach(entity, new Transform2D { Position = new Vec2(100, 350) });
world.Attach(entity, new RigidBody2D {
    BodyType = BodyType.Dynamic,
    Mass = 1.5f,
    ContinuousCollision = true
});
world.Attach(entity, new CircleCollider2D {
    Radius = 24.0f,
    Restitution = 0.85f,
    Friction = 0.2f
});`
      }
    ],
    params: [
      { name: 'Mass', type: 'float', description: 'Mass in kg (0 = static)', default: '1.0' },
      { name: 'Restitution', type: 'float', description: 'Elastic restitution coefficient (bounce)', default: '0.0' },
      { name: 'ContinuousCollision', type: 'bool', description: 'Swept collision against thin walls', default: 'false' }
    ],
    seeAlso: ['ecs-world', 'shaders-crema']
  },
  {
    id: 'shaders-crema',
    category: 'Render & Shaders',
    title: 'Shader Pipeline & Crema Particles',
    summary: 'Atomic shader hot-reload on Vulkan and WebGPU pipelines.',
    content: `When modifying WGSL or GLSL shaders on disk or inside the visual editor, the background SPIR-V compiler swaps pipeline descriptors in under 10ms without pausing the scene.`,
    codeSnippets: [
      {
        lang: 'wgsl',
        label: 'Shaders/CoffeeCrema.wgsl',
        code: `struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let noise = sin(in.uv.x * 20.0) * cos(in.uv.y * 20.0);
    return vec4<f32>(0.9, 0.5, 0.1, 1.0) * (noise * 0.5 + 0.5);
}`
      }
    ],
    seeAlso: ['doppio-interface', 'fisica-rigidbody']
  }
];

export const DOC_SECTIONS_ES: DocSection[] = [
  {
    id: 'intro-caffeine',
    category: 'Início',
    title: 'Visión General de Caffeine & Doppio',
    summary: 'Separación estricta entre el núcleo de ejecución de alto rendimiento (Caffeine) y su entorno visual (Doppio).',
    content: `El ecosistema fue diseñado sobre un principio estricto: separación total entre el núcleo de ejecución y la interfaz de creación.

• **Caffeine (Core Engine)**: Runtime en C++23 y Rust, compilado a código máquina con cero pausas de Garbage Collection. Implementa una arquitectura ECS lineal con asignación contigua en memoria por arquetipos, logrando más del 98% de aciertos de caché en la CPU.
• **Doppio (IDE & Visual Editor)**: Interfaz gráfica construida en torno a Caffeine. Ofrece previsualización en tiempo real en 2D y 3D, inspector de entidades, grafos de lógica visual, hot-reload de shaders y gestión de recursos unificada.

Al compilar para producción (Windows, Linux, macOS, Android, iOS o WebGPU), el binario resultante contiene únicamente el motor Caffeine Core (~4.2 MB), libre del peso de la IDE.`,
    codeSnippets: [
      {
        lang: 'bash',
        label: 'CLI de Caffeine',
        code: `# Crear un nuevo proyecto
caffeine new mi-juego --template ecs-action
cd mi-juego

# Abrir el proyecto en la IDE Doppio
doppio .

# O ejecutar directamente en modo release
caffeine run --release`
      }
    ],
    seeAlso: ['instalacao-cli', 'estrutura-projeto', 'ecs-world']
  },
  {
    id: 'instalacao-cli',
    category: 'Início',
    title: 'Instalación y CLI Toolchain',
    summary: 'Cómo instalar el binario de Caffeine y la IDE Doppio en cualquier sistema operativo.',
    content: `La toolchain de Caffeine se distribuye en binarios estáticos autónomos para x86_64 y ARM64. El instalador configura automáticamente compiladores SPIR-V y controladores gráficos (Vulkan, Metal, DirectX 12).`,
    codeSnippets: [
      {
        lang: 'bash',
        label: 'Linux & macOS',
        code: `curl -fsSL https://get.caffeine.dev | sh
# Verificar instalación
caffeine --version
doppio --version`
      },
      {
        lang: 'powershell',
        label: 'Windows PowerShell',
        code: `irm https://get.caffeine.dev/win.ps1 | iex
caffeine doctor`
      }
    ],
    params: [
      { name: '--template', type: 'string', description: 'Plantilla inicial: "empty", "2d-platformer", "3d-fps"', default: 'empty' },
      { name: '--backend', type: 'string', description: 'Backend gráfico: "vulkan", "dx12", "metal", "webgpu"', default: 'vulkan' },
      { name: '--opt-level', type: 'int (0-3)', description: 'Nivel de optimización para compilación de producción', default: '3' }
    ],
    seeAlso: ['intro-caffeine', 'estrutura-projeto']
  },
  {
    id: 'estrutura-projeto',
    category: 'Início',
    title: 'Estructura de Directorios del Proyecto',
    summary: 'Organización limpia y predecible de recursos, código y escenas de Doppio.',
    content: `Todo proyecto generado por Caffeine sigue una estructura estándar compatible con Git:

• **assets/**: Texturas (PNG, KTX2), audio (OGG, WAV), modelos (GLTF, OBJ) y fuentes.
• **src/**: Scripts de jugabilidad en C#, C++ o Rust.
• **scenes/**: Archivos declarativos legibles (.caffscene) generados por Doppio.
• **shaders/**: Shaders WGSL y GLSL con hot-reload instantáneo.
• **caffeine.toml**: Archivo de configuración principal del motor.`,
    codeSnippets: [
      {
        lang: 'toml',
        label: 'caffeine.toml',
        code: `[project]
name = "CyberEspresso"
version = "0.1.0"

[graphics]
target_fps = 144
vsync = true
backend = "auto"
msaa_samples = 4

[physics]
fixed_timestep_hz = 60.0
gravity = [0.0, -9.81, 0.0]
deterministic = true`
      }
    ],
    seeAlso: ['intro-caffeine', 'doppio-interface']
  },
  {
    id: 'ecs-world',
    category: 'Caffeine Core',
    title: 'World, Entidades y Componentes',
    summary: 'Almacenamiento contiguo en arquetipos y consultas sin bloqueos.',
    content: `En Caffeine, datos y lógica están estrictamente desacoplados. Una Entidad es un identificador de 64 bits. Los Componentes son structs de datos puros (POD). El World agrupa entidades con los mismos componentes en bloques contiguos de memoria llamados Arquetipos.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'C# Script',
        code: `using Caffeine.Core;
using Caffeine.Math;

public struct Velocity : IComponent {
    public Vec2 Value;
    public float Friction;
}

public class GameSpawner : System {
    public override void OnStart(World world) {
        Entity player = world.CreateEntity();
        world.Attach(player, new Transform2D { Position = new Vec2(0, 0) });
        world.Attach(player, new Velocity { Value = new Vec2(12.5f, 0f), Friction = 0.95f });
    }
}`
      }
    ],
    params: [
      { name: 'world.CreateEntity()', type: 'Entity', description: 'Asigna un identificador libre en la tabla de generaciones' },
      { name: 'world.Attach<T>(entity, component)', type: 'void', description: 'Transfiere la entidad al arquetipo correspondiente' },
      { name: 'world.Query<T1, T2>()', type: 'QueryIterator', description: 'Retorna un iterador SIMD vectorizado sobre memoria contigua' }
    ],
    seeAlso: ['ecs-systems', 'fisica-rigidbody']
  },
  {
    id: 'ecs-systems',
    category: 'Caffeine Core',
    title: 'Sistemas y Ejecución Paralela',
    summary: 'Procesamiento multihilo automático sin condiciones de carrera.',
    content: `Los Sistemas contienen toda la lógica del juego. El planificador analiza las dependencias de lectura y escritura en tiempo de compilación. Los sistemas sin conflictos de escritura se ejecutan en paralelo en todos los núcleos de CPU disponibles.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'MovementSystem',
        code: `using Caffeine.Core;

public class MovementSystem : ISystem {
    public void Update(World world, float deltaTime) {
        world.Query<Transform2D, Velocity>().ForEach((ref Transform2D tf, ref Velocity vel) => {
            tf.Position += vel.Value * deltaTime;
            vel.Value *= vel.Friction;
        });
    }
}`
      }
    ],
    seeAlso: ['ecs-world', 'fisica-rigidbody']
  },
  {
    id: 'doppio-interface',
    category: 'Doppio IDE',
    title: 'Espacio de Trabajo Doppio: Paneles y Atajos',
    summary: 'Aprende a navegar en la IDE: Jerarquía, Viewport, Inspector y Consola.',
    content: `Doppio presenta un entorno ágil con tiempos de respuesta inferiores a 16ms y un consumo promedio de 140MB de RAM.

• **Jerarquía**: Árbol de nodos de la escena actual con filtros rápidos.
• **Viewport**: Ventana de renderizado con manipuladores de transformación (W, E, R) y alternador a grafos.
• **Inspector**: Edición en vivo de propiedades con reflexión de tipos inmediata.
• **Consola & Profiler**: Diagnóstico de draw calls, VSync y tiempos de fotograma.`,
    codeSnippets: [
      {
        lang: 'text',
        label: 'Atajos de Teclado',
        code: `F5            -> Iniciar / Pausar Simulación
F6            -> Avanzar 1 fotograma de física
Ctrl + Space  -> Paleta Rápida de Nodos
Ctrl + S      -> Guardar y Hot-Reload de Shaders
Ctrl + K      -> Búsqueda Global de Métodos y Recursos`
      }
    ],
    seeAlso: ['doppio-graphs', 'ecs-world']
  },
  {
    id: 'doppio-graphs',
    category: 'Doppio IDE',
    title: 'Doppio Graphs: Lógica Visual Conectada',
    summary: 'Crea comportamientos y máquinas de estados visualmente que compilan a C++ nativo.',
    content: `El editor de grafos de Doppio produce representaciones AST que compilan directamente a C++ nativo en producción. Conecta eventos de entrada, operaciones matemáticas e impulsos físicos visualmente.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'Nodo Personalizado para Doppio',
        code: `using Caffeine.Doppio;

[DoppioNode(Category = "Combat", Name = "Calcular Daño")]
public static class CombatNodes {
    public static float ComputeDamage(float baseAtk, float multiplier) {
        return baseAtk * multiplier;
    }
}`
      }
    ],
    seeAlso: ['doppio-interface', 'ecs-systems']
  },
  {
    id: 'fisica-rigidbody',
    category: 'Física & ECS',
    title: 'Física 2D y 3D Determinista',
    summary: 'Cuerpos rígidos, colisionadores e integración numérica estable para multijugador.',
    content: `La física de Caffeine es determinista en pasos fijos (60Hz o 120Hz), garantizando netcode rollback y repeticiones idénticas en cualquier plataforma.`,
    codeSnippets: [
      {
        lang: 'csharp',
        label: 'RigidBody2D Dinámico',
        code: `var entity = world.CreateEntity();
world.Attach(entity, new Transform2D { Position = new Vec2(100, 350) });
world.Attach(entity, new RigidBody2D {
    BodyType = BodyType.Dynamic,
    Mass = 1.5f,
    ContinuousCollision = true
});
world.Attach(entity, new CircleCollider2D {
    Radius = 24.0f,
    Restitution = 0.85f,
    Friction = 0.2f
});`
      }
    ],
    params: [
      { name: 'Mass', type: 'float', description: 'Masa en kg (0 = estático)', default: '1.0' },
      { name: 'Restitution', type: 'float', description: 'Coeficiente de restitución (rebote)', default: '0.0' },
      { name: 'ContinuousCollision', type: 'bool', description: 'Detección continua contra paredes finas', default: 'false' }
    ],
    seeAlso: ['ecs-world', 'shaders-crema']
  },
  {
    id: 'shaders-crema',
    category: 'Render & Shaders',
    title: 'Pipeline de Shaders y Partículas Crema',
    summary: 'Hot-reload atómico de shaders en pipelines WebGPU y Vulkan.',
    content: `Al modificar shaders WGSL o GLSL en el disco o en el editor visual, el compilador SPIR-V en segundo plano actualiza los descriptores del pipeline en menos de 10ms sin reiniciar la escena.`,
    codeSnippets: [
      {
        lang: 'wgsl',
        label: 'Shaders/CoffeeCrema.wgsl',
        code: `struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let noise = sin(in.uv.x * 20.0) * cos(in.uv.y * 20.0);
    return vec4<f32>(0.9, 0.5, 0.1, 1.0) * (noise * 0.5 + 0.5);
}`
      }
    ],
    seeAlso: ['doppio-interface', 'fisica-rigidbody']
  }
];

export function getDocSections(lang: Language = 'pt'): DocSection[] {
  switch (lang) {
    case 'en':
      return DOC_SECTIONS_EN;
    case 'es':
      return DOC_SECTIONS_ES;
    case 'pt':
    default:
      return DOC_SECTIONS_PT;
  }
}

// Backward compatibility
export const DOC_SECTIONS = DOC_SECTIONS_PT;
