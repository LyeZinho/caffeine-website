import { InteractiveTutorial, Language } from '../types';

export const TUTORIALS_PT: InteractiveTutorial[] = [
  {
    id: 'tutorial-ecs-quickstart',
    title: 'Seu Primeiro Jogo em 5 Minutos',
    subtitle: 'Crie uma entidade jogável, anexe componentes de movimento e controle pelo teclado',
    difficulty: 'Iniciante',
    duration: '5 min',
    category: 'Caffeine Core',
    summary: 'Aprenda o fluxo fundamental do Caffeine: criar uma entidade no World, anexar Transform2D e Velocity, e registrar um sistema de controle.',
    steps: [
      {
        stepNumber: 1,
        title: 'Criando a Entidade e Componente de Posição',
        instruction: 'No Caffeine, uma entidade ganha vida adicionando dados puros. Instancie a entidade no World e adicione a posição inicial Transform2D.',
        activeLanguage: 'csharp',
        code: `// Passo 1: Inicializando a entidade do jogador
var player = world.CreateEntity();

world.Attach(player, new Transform2D {
    Position = new Vec2(200, 150),
    Scale = new Vec2(1.0f, 1.0f),
    Rotation = 0f
});`,
        defaultParams: {
          speed: 180,
          gravity: 0,
          particleCount: 20,
          bounce: 0.6,
          bloom: 0.4
        },
        taskExplanation: 'Observe no simulador ao lado: a entidade player foi spawnada no centro do viewport com sua coordenada 2D.'
      },
      {
        stepNumber: 2,
        title: 'Adicionando Vetor de Velocidade e Atrito',
        instruction: 'Adicione o componente Velocity. Você pode ajustar a velocidade no painel de parâmetros abaixo e ver a aceleração mudar instantaneamente.',
        activeLanguage: 'csharp',
        code: `// Passo 2: Adicionando movimento determinístico
world.Attach(player, new Velocity {
    Value = new Vec2(0, 0),
    MaxSpeed = 240.0f,
    Friction = 0.92f // Desaceleração suave
});`,
        defaultParams: {
          speed: 240,
          gravity: 0,
          particleCount: 35,
          bounce: 0.7,
          bloom: 0.5
        },
        taskExplanation: 'Agora use as teclas WASD ou Setas no simulador! A velocidade responde ao atrito e limites de aceleração.'
      },
      {
        stepNumber: 3,
        title: 'Disparando Partículas ao Mover',
        instruction: 'Conecte o emissor de partículas de vapor de café (CremaEmitter) para gerar rastro visual enquanto a entidade se desloca.',
        activeLanguage: 'csharp',
        code: `// Passo 3: Efeito visual reativo com CremaEmitter
world.Attach(player, new CremaEmitter {
    EmissionRate = 45,
    LifeTime = 0.6f,
    SpreadAngle = 35.0f,
    StartColor = Color.FromHex("#FF3E24"),
    EndColor = Color.FromHex("#F59E0B")
});`,
        defaultParams: {
          speed: 280,
          gravity: 0,
          particleCount: 80,
          bounce: 0.8,
          bloom: 0.85
        },
        taskExplanation: 'Mova a entidade ou clique com o mouse no canvas para ver o rastro de faíscas e partículas!'
      }
    ]
  },
  {
    id: 'tutorial-doppio-physics',
    title: 'Gravidade, Impulso e Colisões',
    subtitle: 'Configure corpos rígidos dinâmicos, rebote elástico e simulação determinística',
    difficulty: 'Intermediário',
    duration: '8 min',
    category: 'Física & Doppio',
    summary: 'Explore o solucionador de física do Caffeine. Adicione gravidade, ajuste a elasticidade do quique e lance entidades contra obstáculos.',
    steps: [
      {
        stepNumber: 1,
        title: 'Habilitando a Gravidade no Mundo',
        instruction: 'Configure o vetor de gravidade do Caffeine Physics. Valores negativos puxam para baixo no eixo Y.',
        activeLanguage: 'csharp',
        code: `// Configuração da física no caffeine.toml ou via código
Physics2D.SetGravity(new Vec2(0, -980.0f)); // 9.8 m/s² em pixels
Physics2D.SetSubsteps(4); // 4 sub-passos para máxima precisão`,
        defaultParams: {
          speed: 200,
          gravity: 450,
          particleCount: 40,
          bounce: 0.5,
          bloom: 0.4
        },
        taskExplanation: 'A gravidade agora atua na entidade no simulador. Veja ela cair naturalmente em direção ao chão.'
      },
      {
        stepNumber: 2,
        title: 'Configurando Restituição (Bounciness) e Colisores',
        instruction: 'Ajuste a restituição do colisor para controlar se o objeto se comporta como borracha elástica ou chumbo.',
        activeLanguage: 'csharp',
        code: `world.Attach(entity, new CircleCollider2D {
    Radius = 24.0f,
    Restitution = 0.85f, // Alto quique (85% de energia conservada)
    Friction = 0.2f
});`,
        defaultParams: {
          speed: 250,
          gravity: 600,
          particleCount: 50,
          bounce: 0.88,
          bloom: 0.6
        },
        taskExplanation: 'Observe a colisão com o solo no simulador: com alta restituição, a entidade quica repetidas vezes!'
      }
    ]
  },
  {
    id: 'tutorial-doppio-node-graph',
    title: 'Lógica Visual Conectada',
    subtitle: 'Conecte nós de input, cálculo matemático e emissão de eventos sem complicação',
    difficulty: 'Iniciante',
    duration: '6 min',
    category: 'Doppio IDE',
    summary: 'Aprenda como a IDE Doppio permite construir comportamentos de jogo através de nós interconectados que compilam para C++ nativo.',
    steps: [
      {
        stepNumber: 1,
        title: 'Nós de Entrada de Teclado e Vetor de Movimento',
        instruction: 'No Doppio, arraste o nó Input:WASD e conecte o pino de saída Vector2 ao pino de velocidade do nó RigidBody.',
        activeLanguage: 'node',
        code: `[NÓ: INPUT_WASD]
  Output: Vector2(axis_x, axis_y)
       ↓ (conexão de dados)
[NÓ: MULTIPLY_SCALAR]
  Input A: Vector2
  Input B: float(Speed = 220.0)
       ↓
[NÓ: APPLY_FORCE]
  Target: PlayerEntity`,
        defaultParams: {
          speed: 260,
          gravity: 120,
          particleCount: 60,
          bounce: 0.75,
          bloom: 0.7
        },
        taskExplanation: 'Alterne entre o modo de código e a visualização do Grafo de Nós do Doppio para conferir a conexão visual.'
      }
    ]
  }
];

export const TUTORIALS_EN: InteractiveTutorial[] = [
  {
    id: 'tutorial-ecs-quickstart',
    title: 'Your First Game in 5 Minutes',
    subtitle: 'Spawn a playable entity, attach movement components, and steer with the keyboard',
    difficulty: 'Iniciante',
    duration: '5 min',
    category: 'Caffeine Core',
    summary: 'Learn the core Caffeine flow: spawn an entity in the World, attach Transform2D and Velocity, and bind systems.',
    steps: [
      {
        stepNumber: 1,
        title: 'Spawning the Entity and Transform Component',
        instruction: 'In Caffeine, entities come alive with pure data. Spawn an entity in the World and attach an initial Transform2D.',
        activeLanguage: 'csharp',
        code: `// Step 1: Initializing player entity
var player = world.CreateEntity();

world.Attach(player, new Transform2D {
    Position = new Vec2(200, 150),
    Scale = new Vec2(1.0f, 1.0f),
    Rotation = 0f
});`,
        defaultParams: {
          speed: 180,
          gravity: 0,
          particleCount: 20,
          bounce: 0.6,
          bloom: 0.4
        },
        taskExplanation: 'Notice in the live simulator: the player entity is spawned in the viewport center with its 2D coordinate.'
      },
      {
        stepNumber: 2,
        title: 'Adding Velocity Vector & Friction',
        instruction: 'Attach the Velocity component. You can tweak speed in the real-time panel below and observe immediate response.',
        activeLanguage: 'csharp',
        code: `// Step 2: Adding deterministic motion
world.Attach(player, new Velocity {
    Value = new Vec2(0, 0),
    MaxSpeed = 240.0f,
    Friction = 0.92f // Smooth deceleration
});`,
        defaultParams: {
          speed: 240,
          gravity: 0,
          particleCount: 35,
          bounce: 0.7,
          bloom: 0.5
        },
        taskExplanation: 'Now press WASD or arrow keys inside the simulator! Movement responds dynamically with friction damping.'
      },
      {
        stepNumber: 3,
        title: 'Emitting Reactive Particles on Movement',
        instruction: 'Attach a CremaEmitter particle system to trail sparks and smoke behind the moving entity.',
        activeLanguage: 'csharp',
        code: `// Step 3: Visual particles with CremaEmitter
world.Attach(player, new CremaEmitter {
    EmissionRate = 45,
    LifeTime = 0.6f,
    SpreadAngle = 35.0f,
    StartColor = Color.FromHex("#FF3E24"),
    EndColor = Color.FromHex("#F59E0B")
});`,
        defaultParams: {
          speed: 280,
          gravity: 0,
          particleCount: 80,
          bounce: 0.8,
          bloom: 0.85
        },
        taskExplanation: 'Move the entity or click anywhere on the canvas to trigger explosive crema particle bursts!'
      }
    ]
  },
  {
    id: 'tutorial-doppio-physics',
    title: 'Gravity, Impulse & Collisions',
    subtitle: 'Configure dynamic rigid bodies, elastic bounce, and deterministic collision',
    difficulty: 'Intermediário',
    duration: '8 min',
    category: 'Física & Doppio',
    summary: 'Explore Caffeine’s physics solver. Add gravity, adjust bounce restitution, and push entities into barriers.',
    steps: [
      {
        stepNumber: 1,
        title: 'Configuring World Gravity',
        instruction: 'Set the gravity vector in Caffeine Physics. Negative Y pulls downward in simulation coordinates.',
        activeLanguage: 'csharp',
        code: `// Physics setup in caffeine.toml or script
Physics2D.SetGravity(new Vec2(0, -980.0f)); // 9.8 m/s² in pixels
Physics2D.SetSubsteps(4); // 4 sub-steps for maximum accuracy`,
        defaultParams: {
          speed: 200,
          gravity: 450,
          particleCount: 40,
          bounce: 0.5,
          bloom: 0.4
        },
        taskExplanation: 'Gravity now pulls down on the entity in the simulator. Watch it accelerate downwards.'
      },
      {
        stepNumber: 2,
        title: 'Setting Restitution (Bounce) & Colliders',
        instruction: 'Calibrate restitution to determine whether the body acts like elastic rubber or lead.',
        activeLanguage: 'csharp',
        code: `world.Attach(entity, new CircleCollider2D {
    Radius = 24.0f,
    Restitution = 0.85f, // High elasticity (85% energy retained)
    Friction = 0.2f
});`,
        defaultParams: {
          speed: 250,
          gravity: 600,
          particleCount: 50,
          bounce: 0.88,
          bloom: 0.6
        },
        taskExplanation: 'Watch floor and wall collisions in the simulator: high restitution causes sustained bounces!'
      }
    ]
  },
  {
    id: 'tutorial-doppio-node-graph',
    title: 'Connected Visual Logic',
    subtitle: 'Connect input pins, math nodes, and force triggers without writing boilerplate',
    difficulty: 'Iniciante',
    duration: '6 min',
    category: 'Doppio IDE',
    summary: 'Learn how Doppio IDE allows wiring game behaviors through interconnected visual nodes that compile to native C++.',
    steps: [
      {
        stepNumber: 1,
        title: 'Keyboard Input Nodes and Vector Wiring',
        instruction: 'In Doppio, drag the Input:WASD node and connect its Vector2 pin to the Force pin of the RigidBody node.',
        activeLanguage: 'node',
        code: `[NODE: INPUT_WASD]
  Output: Vector2(axis_x, axis_y)
       ↓ (data wire)
[NODE: MULTIPLY_SCALAR]
  Input A: Vector2
  Input B: float(Speed = 220.0)
       ↓
[NODE: APPLY_FORCE]
  Target: PlayerEntity`,
        defaultParams: {
          speed: 260,
          gravity: 120,
          particleCount: 60,
          bounce: 0.75,
          bloom: 0.7
        },
        taskExplanation: 'Switch between code and Doppio Visual Node Graph to inspect visual wiring.'
      }
    ]
  }
];

export const TUTORIALS_ES: InteractiveTutorial[] = [
  {
    id: 'tutorial-ecs-quickstart',
    title: 'Tu Primer Juego en 5 Minutos',
    subtitle: 'Crea una entidad jugable, añade componentes de movimiento y controla con el teclado',
    difficulty: 'Iniciante',
    duration: '5 min',
    category: 'Caffeine Core',
    summary: 'Aprende el flujo esencial de Caffeine: instanciar una entidad en el World, conectar Transform2D y Velocity, y registrar sistemas.',
    steps: [
      {
        stepNumber: 1,
        title: 'Creando la Entidad y Componente de Posición',
        instruction: 'En Caffeine, las entidades cobran vida con datos puros. Instancia una entidad en el World y define su Transform2D.',
        activeLanguage: 'csharp',
        code: `// Paso 1: Inicializando entidad del jugador
var player = world.CreateEntity();

world.Attach(player, new Transform2D {
    Position = new Vec2(200, 150),
    Scale = new Vec2(1.0f, 1.0f),
    Rotation = 0f
});`,
        defaultParams: {
          speed: 180,
          gravity: 0,
          particleCount: 20,
          bounce: 0.6,
          bloom: 0.4
        },
        taskExplanation: 'Observa en el simulador contiguo: la entidad player se generó en el centro con sus coordenadas 2D.'
      },
      {
        stepNumber: 2,
        title: 'Añadiendo Vector de Velocidad y Fricción',
        instruction: 'Agrega el componente Velocity. Ajusta la velocidad en el panel de parámetros y mira cómo responde al instante.',
        activeLanguage: 'csharp',
        code: `// Paso 2: Movimiento determinista
world.Attach(player, new Velocity {
    Value = new Vec2(0, 0),
    MaxSpeed = 240.0f,
    Friction = 0.92f // Desaceleración suave
});`,
        defaultParams: {
          speed: 240,
          gravity: 0,
          particleCount: 35,
          bounce: 0.7,
          bloom: 0.5
        },
        taskExplanation: '¡Usa las teclas WASD o flechas en el simulador! La velocidad responde a la amortiguación de fricción.'
      },
      {
        stepNumber: 3,
        title: 'Disparando Partículas al Moverse',
        instruction: 'Conecta el emisor de partículas CremaEmitter para generar una estela visual mientras la entidad se desplaza.',
        activeLanguage: 'csharp',
        code: `// Paso 3: Efecto visual reactivo
world.Attach(player, new CremaEmitter {
    EmissionRate = 45,
    LifeTime = 0.6f,
    SpreadAngle = 35.0f,
    StartColor = Color.FromHex("#FF3E24"),
    EndColor = Color.FromHex("#F59E0B")
});`,
        defaultParams: {
          speed: 280,
          gravity: 0,
          particleCount: 80,
          bounce: 0.8,
          bloom: 0.85
        },
        taskExplanation: '¡Mueve la entidad o haz clic en el canvas para ver la explosión de partículas en vivo!'
      }
    ]
  },
  {
    id: 'tutorial-doppio-physics',
    title: 'Gravedad, Impulso y Colisiones',
    subtitle: 'Configura cuerpos rígidos dinámicos, rebote elástico y simulación determinista',
    difficulty: 'Intermediário',
    duration: '8 min',
    category: 'Física & Doppio',
    summary: 'Explora el solver físico de Caffeine. Agrega gravedad, calibra el rebote y lanza entidades contra barreras.',
    steps: [
      {
        stepNumber: 1,
        title: 'Activando la Gravedad en el Mundo',
        instruction: 'Configura el vector de gravedad de Caffeine Physics. Valores negativos tiran hacia abajo en el eje Y.',
        activeLanguage: 'csharp',
        code: `// Configuración en caffeine.toml o script
Physics2D.SetGravity(new Vec2(0, -980.0f)); // 9.8 m/s² en píxeles
Physics2D.SetSubsteps(4); // 4 sub-pasos de precisión`,
        defaultParams: {
          speed: 200,
          gravity: 450,
          particleCount: 40,
          bounce: 0.5,
          bloom: 0.4
        },
        taskExplanation: 'La gravedad ahora actúa sobre la entidad. Mírala caer de forma natural hacia el suelo.'
      },
      {
        stepNumber: 2,
        title: 'Configurando Restitución (Rebote) y Colisionadores',
        instruction: 'Ajusta la restitución del colisionador para controlar si el cuerpo se comporta como goma elástica o plomo.',
        activeLanguage: 'csharp',
        code: `world.Attach(entity, new CircleCollider2D {
    Radius = 24.0f,
    Restitution = 0.85f, // Alto rebote (85% energía retenida)
    Friction = 0.2f
});`,
        defaultParams: {
          speed: 250,
          gravity: 600,
          particleCount: 50,
          bounce: 0.88,
          bloom: 0.6
        },
        taskExplanation: '¡Observa el rebote con el suelo: con alta restitución, la entidad rebota continuamente!'
      }
    ]
  },
  {
    id: 'tutorial-doppio-node-graph',
    title: 'Lógica Visual Conectada',
    subtitle: 'Conecta nodos de entrada, cálculo matemático y fuerzas físicas sin escribir código',
    difficulty: 'Iniciante',
    duration: '6 min',
    category: 'Doppio IDE',
    summary: 'Aprende cómo la IDE Doppio permite programar mecánicas conectando nodos visuales que compilan a C++ nativo.',
    steps: [
      {
        stepNumber: 1,
        title: 'Nodos de Entrada de Teclado y Vector de Movimiento',
        instruction: 'En Doppio, arrastra el nodo Input:WASD y conecta su salida Vector2 al pin de Fuerza del RigidBody.',
        activeLanguage: 'node',
        code: `[NODO: INPUT_WASD]
  Output: Vector2(axis_x, axis_y)
       ↓ (cable de datos)
[NODO: MULTIPLY_SCALAR]
  Input A: Vector2
  Input B: float(Speed = 220.0)
       ↓
[NODO: APPLY_FORCE]
  Target: PlayerEntity`,
        defaultParams: {
          speed: 260,
          gravity: 120,
          particleCount: 60,
          bounce: 0.75,
          bloom: 0.7
        },
        taskExplanation: 'Alterna entre vista de código y Grafo de Nodos de Doppio para apreciar la conexión visual.'
      }
    ]
  }
];

export function getInteractiveTutorials(lang: Language = 'pt'): InteractiveTutorial[] {
  switch (lang) {
    case 'en':
      return TUTORIALS_EN;
    case 'es':
      return TUTORIALS_ES;
    case 'pt':
    default:
      return TUTORIALS_PT;
  }
}

// Backward compatibility
export const INTERACTIVE_TUTORIALS = TUTORIALS_PT;
