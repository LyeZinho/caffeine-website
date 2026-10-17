import { BlogPost, Language } from '../types';

export const BLOG_POSTS_PT: BlogPost[] = [
  {
    id: 'doppio-1-4-release',
    slug: 'doppio-1-4-hot-reload-shader-pipeline',
    title: 'Doppio 1.4: Hot-Reload Instantâneo de Shaders e Node Graphs V2',
    excerpt: 'Apresentamos a maior atualização visual da IDE Doppio até hoje: compilação em background SPIR-V sem travamento de frame, novo grafo de nós com layout orgânico e suporte completo a WebGPU.',
    date: '12 de Outubro, 2026',
    readTime: '6 min de leitura',
    category: 'Release',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Graphics Engineer',
      avatar: 'ER'
    },
    coverImage: '/images/doppio_ide_preview_1792062384957.jpg',
    keyHighlights: [
      'Substituição de pipelines gráficos em 8.4ms sem perda de estado de simulação',
      'Doppio Graphs V2: 3x mais rápido na renderização do canvas com aceleração GPU',
      'Novo painel de inspeção com curvas de Bézier em tempo real para partículas',
      'Exportação com um clique para WebGPU, Linux Flatpak e Windows nativo'
    ],
    content: [
      `A versão 1.4 do Doppio representa um marco na ergonomia de desenvolvimento de jogos. Até hoje, alterar um shader em execução em muitas engines exige reiniciar a cena ou sofrer com engasgos perceptíveis na viewport. No Doppio 1.4, redesenhamos o backend de compilação em parceria direta com o runtime do Caffeine.`,
      `Quando você salva um arquivo .wgsl ou modifica um nó de fragmento no editor visual, o compilador em thread separada analisa a sintaxe, gera o bytecode SPIR-V intermediário e faz a troca atômica do descritor de pipeline gráfico (Descriptor Set Swap) exatamente no intervalo vertical de VSync. Resultado: zero engasgos e resposta instantânea na tela.`,
      `Além disso, o novo editor de lógica visual — Doppio Graphs V2 — agora suporta digitação estrita de tipos com inferência automática. Você pode arrastar uma saída de vetor de força do Caffeine Physics diretamente para a entrada de deformação de malha com validação imediata em tempo real.`
    ]
  },
  {
    id: 'caffeine-ecs-deep-dive',
    slug: 'por-que-construimos-caffeine-ecs-do-zero',
    title: '1 Milhão de Entidades a 120 FPS: Por que criamos o Caffeine ECS do Zero',
    excerpt: 'Um mergulho técnico no modelo de arquétipos do Caffeine, alocação de memória sem fragmentação e vetorização SIMD automática em C++23 e Rust.',
    date: '28 de Setembro, 2026',
    readTime: '9 min de leitura',
    category: 'Arquitetura',
    author: {
      name: 'Gabriel Costa',
      role: 'Core Systems Architect',
      avatar: 'GC'
    },
    coverImage: '/images/hero_caffeine_engine_1792062383478.jpg',
    keyHighlights: [
      'Alocadores contíguos por chunk de 16KB que cabem diretamente no cache L1/L2 do CPU',
      'Zero locks em tempo de execução: paralelismo baseado em grafo de dependências estáticas',
      'Testes de estresse com 1.000.000 de corpos rígidos 2D simulados a mais de 120 FPS estáveis'
    ],
    content: [
      `A maioria dos motores tradicionais ainda carrega vícios de herança orientada a objetos (OOP) clássica, onde entidades são ponteiros espalhados aleatoriamente pela memória RAM. Esse padrão gera o pesadelo dos 'cache misses', onde o processador passa 70% do tempo ocioso aguardando dados da memória principal.`,
      `No Caffeine, adotamos a abordagem de Arquétipos Puros inspirada no princípio de Data-Oriented Design. Se 50.000 inimigos possuem exatamente a mesma composição de componentes (Transform2D, Velocity, Sprite), todos os seus dados residem em arrays contíguos de memória empacotada.`,
      `Ao rodar o MovementSystem, a CPU não precisa saltar por ponteiros: ela simplesmente carrega blocos de memória e executa instruções AVX-512 ou ARM NEON, transformando múltiplos vetores de velocidade em um único ciclo de clock.`
    ]
  },
  {
    id: 'retro-grunge-shaders',
    slug: 'estetica-grunge-halftone-shaders',
    title: 'Criando Efeitos Grunge, Halftone e Paper Tear com Shaders no Doppio',
    excerpt: 'Como construímos o pipeline visual estilizado de alto impacto que dá vida à identidade estética única do Caffeine e dos jogos feitos nele.',
    date: '15 de Setembro, 2026',
    readTime: '5 min de leitura',
    category: 'Shaders & Arte',
    author: {
      name: 'Maya Lin',
      role: 'Technical Artist',
      avatar: 'ML'
    },
    coverImage: '/images/grunge_poster_caffeine_1792062385194.jpg',
    keyHighlights: [
      'Implementação de matriz de retícula halftone matemática sem texturas pesadas',
      'Shader de aberração cromática analógica e grão orgânico com zero impacto no framerate',
      'Presets prontos para usar no Doppio Material Library'
    ],
    content: [
      `A estética de um jogo é sua assinatura mais marcante. Em um mundo saturado de renders genéricos com iluminação plastificada, a estética visual resgata a força do design gráfico analógico, do zine e das prensas risográficas.`,
      `Neste artigo, compartilhamos as equações matemáticas que usamos para projetar padrões de halftone (pontos de retícula) diretamente nas coordenadas de tela da GPU. Ao modular o raio de cada ponto pela luminância calculada na iluminação de cena, obtemos um visual gráfico denso e orgânico.`,
      `Você pode inspecionar e modificar este material diretamente no painel de Shaders do Doppio ou através do nosso tutorial interativo de shaders.`
    ]
  },
  {
    id: 'netcode-rollback-deterministic',
    slug: 'fisica-deterministica-netcode-rollback',
    title: 'Netcode Rollback sem Dor: Física Determinística Nativa no Caffeine',
    excerpt: 'Como o Caffeine desacoplou o relógio de física do frame de renderização para entregar netcode determinístico padrão GGPO direto no core.',
    date: '02 de Setembro, 2026',
    readTime: '7 min de leitura',
    category: 'Performance',
    author: {
      name: 'Gabriel Costa',
      role: 'Core Systems Architect',
      avatar: 'GC'
    },
    keyHighlights: [
      'Representação numérica em ponto fixo 32.32 imune a variações de arquitetura de CPU',
      'Snapshots rápidos de estado do World com alocadores em anel (Ring Buffer) de 60 quadros',
      'Predição e reconciliação automática de comandos de rede sem código boilerplate'
    ],
    content: [
      `Jogos de ação multiplayer e jogos de luta dependem criticamente de determinismo absoluto: a mesma entrada de botão deve produzir exatamente o mesmo estado de colisão, independentemente se o cliente está rodando em um processador AMD x86 ou Apple Silicon ARM.`,
      `O Caffeine Physics foi construído desde o primeiro dia com um solver numérico determinístico. Toda a física de corpos rígidos opera em ciclos fixos (60Hz ou 120Hz configuráveis), permitindo rebobinar e reexecutar quadros em menos de 0.8 milissegundos quando uma discrepância de rede é detectada.`
    ]
  }
];

export const BLOG_POSTS_EN: BlogPost[] = [
  {
    id: 'doppio-1-4-release',
    slug: 'doppio-1-4-hot-reload-shader-pipeline',
    title: 'Doppio 1.4: Instant Shader Hot-Reload & Node Graphs V2',
    excerpt: 'Introducing the biggest visual IDE release for Doppio yet: zero-stutter background SPIR-V compilation, organic node graph layouts, and first-class WebGPU support.',
    date: 'October 12, 2026',
    readTime: '6 min read',
    category: 'Release',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Graphics Engineer',
      avatar: 'ER'
    },
    coverImage: '/images/doppio_ide_preview_1792062384957.jpg',
    keyHighlights: [
      'Graphics pipeline swap in 8.4ms without resetting simulation state',
      'Doppio Graphs V2: 3x faster canvas rendering with GPU acceleration',
      'Brand new inspector panel with live Bézier curves for particle tuning',
      'One-click export for WebGPU, Linux Flatpak, and native Windows binaries'
    ],
    content: [
      `Doppio 1.4 represents a milestone in game development ergonomics. In many legacy engines, changing a running shader forces a scene reload or causes disruptive viewport hitching. In Doppio 1.4, we redesigned our compilation backend hand-in-hand with the Caffeine runtime.`,
      `Whenever you save a .wgsl file or adjust a fragment node in the visual graph, a dedicated compiler thread checks syntax, outputs SPIR-V bytecode, and performs an atomic Descriptor Set Swap during the VSync vertical blank. Result: zero dropped frames and immediate screen response.`,
      `Additionally, the visual logic editor — Doppio Graphs V2 — now enforces strict types with automated type inference. Drag a force vector from Caffeine Physics right into a mesh deformer with immediate validation.`
    ]
  },
  {
    id: 'caffeine-ecs-deep-dive',
    slug: 'why-we-built-caffeine-ecs-from-scratch',
    title: '1 Million Entities at 120 FPS: Why We Built Caffeine ECS from Scratch',
    excerpt: 'A technical deep-dive into Caffeine’s pure archetype memory layout, unfragmented heap allocations, and automatic SIMD vectorization in C++23 & Rust.',
    date: 'September 28, 2026',
    readTime: '9 min read',
    category: 'Arquitetura',
    author: {
      name: 'Gabriel Costa',
      role: 'Core Systems Architect',
      avatar: 'GC'
    },
    coverImage: '/images/hero_caffeine_engine_1792062383478.jpg',
    keyHighlights: [
      'Contiguous 16KB chunk allocators fitting cleanly into CPU L1/L2 caches',
      'Zero locks during runtime: dependency-graph static system parallelism',
      'Stress-tested with 1,000,000 2D rigid bodies simulating at rock-solid 120+ FPS'
    ],
    content: [
      `Most traditional engines still cling to legacy object-oriented patterns where entities are pointers scattered randomly across RAM. This creates relentless cache misses, forcing modern CPUs to sit idle waiting for memory.`,
      `With Caffeine, we embraced pure archetypes rooted in Data-Oriented Design. If 50,000 enemy entities share the same components (Transform2D, Velocity, Sprite), their data is packed contiguously in memory arrays.`,
      `When MovementSystem executes, the CPU streams memory sequentially through AVX-512 or ARM NEON vector registers, updating multiple vectors in a single clock cycle.`
    ]
  },
  {
    id: 'retro-grunge-shaders',
    slug: 'grunge-halftone-stylized-shaders',
    title: 'Crafting Grunge, Halftone, and Risograph Shaders in Doppio',
    excerpt: 'How we engineered high-impact stylized graphic pipelines that define the distinctive visual identity of Caffeine games.',
    date: 'September 15, 2026',
    readTime: '5 min read',
    category: 'Shaders & Arte',
    author: {
      name: 'Maya Lin',
      role: 'Technical Artist',
      avatar: 'ML'
    },
    coverImage: '/images/grunge_poster_caffeine_1792062385194.jpg',
    keyHighlights: [
      'Mathematical screen-space halftone grid matrix requiring no bulky textures',
      'Analog chromatic aberration and organic grain shaders with zero framerate tax',
      'Ready-to-use presets available in the Doppio Material Library'
    ],
    content: [
      `A game’s visual aesthetic is its true fingerprint. In an era inundated with plastic, hyper-generic rendering, neo-brutalist and print-inspired visuals restore the raw power of risograph presses and tactile zines.`,
      `In this article, we share the mathematical equations used to compute procedural halftone dot grids in screen space. By modulating dot radius according to scene lighting luminance, we achieve rich, organic print textures in real time.`,
      `You can inspect and customize this shader directly inside Doppio’s Shader graph or run it inside our in-browser interactive tutorial.`
    ]
  },
  {
    id: 'netcode-rollback-deterministic',
    slug: 'deterministic-physics-netcode-rollback',
    title: 'Pain-Free Rollback Netcode: Native Deterministic Physics in Caffeine',
    excerpt: 'How Caffeine decoupled the physics tick from the render frame to deliver GGPO-grade deterministic netcode out of the box.',
    date: 'September 02, 2026',
    readTime: '7 min read',
    category: 'Performance',
    author: {
      name: 'Gabriel Costa',
      role: 'Core Systems Architect',
      avatar: 'GC'
    },
    keyHighlights: [
      '32.32 fixed-point math representation immune to cross-CPU floating point divergence',
      'High-speed World state snapshotting with a 60-frame cyclic ring buffer',
      'Automated client input prediction and reconciliation with zero boilerplate'
    ],
    content: [
      `Multiplayer action games and fighting games depend on strict determinism: the exact same controller input must yield the exact same collision resolution whether executed on AMD x86 or Apple Silicon ARM.`,
      `Caffeine Physics was engineered from day one with a fixed-step deterministic solver (60Hz or 120Hz). It can rewind and re-simulate up to 10 frames in under 0.8 milliseconds whenever a network desynchronization is detected.`
    ]
  }
];

export const BLOG_POSTS_ES: BlogPost[] = [
  {
    id: 'doppio-1-4-release',
    slug: 'doppio-1-4-hot-reload-shader-pipeline',
    title: 'Doppio 1.4: Hot-Reload Instantáneo de Shaders y Node Graphs V2',
    excerpt: 'Presentamos la mayor actualización visual de la IDE Doppio hasta la fecha: compilación en segundo plano SPIR-V sin caídas de frames, nuevo grafo de nodos y soporte completo para WebGPU.',
    date: '12 de Octubre, 2026',
    readTime: '6 min de lectura',
    category: 'Release',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Graphics Engineer',
      avatar: 'ER'
    },
    coverImage: '/images/doppio_ide_preview_1792062384957.jpg',
    keyHighlights: [
      'Reemplazo de pipelines gráficos en 8.4ms sin pérdida de estado de simulación',
      'Doppio Graphs V2: 3x más rápido en renderizado de canvas con aceleración por GPU',
      'Nuevo panel de inspección con curvas Bézier en tiempo real para partículas',
      'Exportación con un solo clic a WebGPU, Linux Flatpak y binarios nativos de Windows'
    ],
    content: [
      `La versión 1.4 de Doppio marca un hito en la ergonomía de desarrollo de videojuegos. En muchos motores tradicionales, modificar un shader en ejecución obliga a reiniciar la escena o sufrir tirones perceptibles en el visor. En Doppio 1.4, rediseñamos el backend de compilación en colaboración estrecha con el runtime de Caffeine.`,
      `Cuando guardas un archivo .wgsl o editas un nodo en el editor visual, el compilador en un hilo dedicado analiza la sintaxis, genera el bytecode SPIR-V y ejecuta un intercambio atómico de descriptores (Descriptor Set Swap) justo en el intervalo vertical de VSync. Resultado: cero frames perdidos y respuesta instantánea en pantalla.`,
      `Además, el editor visual Doppio Graphs V2 ahora cuenta con tipado estricto e inferencia automática. Puedes arrastrar una salida de fuerza desde Caffeine Physics directamente a la entrada de deformación de malla con validación inmediata.`
    ]
  },
  {
    id: 'caffeine-ecs-deep-dive',
    slug: 'por-que-creamos-caffeine-ecs-desde-cero',
    title: '1 Millón de Entidades a 120 FPS: Por qué creamos Caffeine ECS desde Cero',
    excerpt: 'Una inmersión técnica en el diseño de arquetipos puros de Caffeine, gestión de memoria sin fragmentación y vectorización SIMD en C++23 y Rust.',
    date: '28 de Septiembre, 2026',
    readTime: '9 min de lectura',
    category: 'Arquitetura',
    author: {
      name: 'Gabriel Costa',
      role: 'Core Systems Architect',
      avatar: 'GC'
    },
    coverImage: '/images/hero_caffeine_engine_1792062383478.jpg',
    keyHighlights: [
      'Asignadores contiguos en bloques de 16KB que encajan en las cachés L1/L2 del CPU',
      'Cero bloqueos en ejecución: paralelismo basado en grafos de dependencias estáticas',
      'Pruebas de estrés con 1.000.000 de cuerpos rígidos 2D a más de 120 FPS estables'
    ],
    content: [
      `La mayoría de motores clásicos arrastran patrones de herencia orientada a objetos (OOP), donde las entidades son punteros dispersos en memoria RAM. Este patrón genera cache misses constantes que dejan a la CPU inactiva esperando datos.`,
      `En Caffeine adoptamos el modelo de Arquetipos Puros fundamentado en Data-Oriented Design. Si 50.000 enemigos comparten los mismos componentes (Transform2D, Velocity, Sprite), todos sus datos residen en arreglos contiguos de memoria.`,
      `Al ejecutarse MovementSystem, el procesador carga bloques secuenciales usando registros AVX-512 o ARM NEON, actualizando múltiples vectores de velocidad en un único ciclo de reloj.`
    ]
  },
  {
    id: 'retro-grunge-shaders',
    slug: 'shaders-estilizados-halftone-grunge',
    title: 'Creando Efectos Grunge, Halftone y Risografía con Shaders en Doppio',
    excerpt: 'Cómo desarrollamos el pipeline gráfico de alto impacto que define la identidad visual distintiva de Caffeine y sus juegos.',
    date: '15 de Septiembre, 2026',
    readTime: '5 min de lectura',
    category: 'Shaders & Arte',
    author: {
      name: 'Maya Lin',
      role: 'Technical Artist',
      avatar: 'ML'
    },
    coverImage: '/images/grunge_poster_caffeine_1792062385194.jpg',
    keyHighlights: [
      'Matriz procedural de trama de semitonos (halftone) en espacio de pantalla sin texturas',
      'Aberración cromática analógica y grano orgánico con cero coste en framerate',
      'Ajustes preestablecidos listos para usar en la Doppio Material Library'
    ],
    content: [
      `La estética de un videojuego es su huella digital. Frente a los renders genéricos y sobreiluminados, el neo-brutalismo y la gráfica de imprenta devuelven la fuerza y textura de los fanzines y las prensas risográficas.`,
      `En este artículo compartimos las fórmulas matemáticas utilizadas para generar tramas de puntos de semitono en tiempo real. Al modular el radio de cada punto con la luminancia de la escena, logramos un aspecto denso y orgánico.`,
      `Puedes probar y ajustar este material en el editor de Shaders de Doppio o en nuestro tutorial interactivo en el navegador.`
    ]
  },
  {
    id: 'netcode-rollback-deterministic',
    slug: 'fisica-determinista-netcode-rollback',
    title: 'Netcode Rollback sin Dolor: Física Determinista Nativa en Caffeine',
    excerpt: 'Cómo Caffeine desacopló el ciclo de física del refresco de pantalla para ofrecer netcode determinista estilo GGPO directamente en el núcleo.',
    date: '02 de Septiembre, 2026',
    readTime: '7 min de lectura',
    category: 'Performance',
    author: {
      name: 'Gabriel Costa',
      role: 'Core Systems Architect',
      avatar: 'GC'
    },
    keyHighlights: [
      'Aritmética en punto fijo 32.32 inmune a divergencias de coma flotante entre CPUs',
      'Instantáneas ultrarrápidas del estado del World con buffer circular de 60 frames',
      'Predicción y reconciliación automática de entradas de red sin código repetitivo'
    ],
    content: [
      `Los juegos multijugador de acción rápida exigen un determinismo estricto: la misma pulsación de botón debe generar exactamente la misma resolución de colisiones, ya sea en un procesador AMD x86 o un Apple Silicon ARM.`,
      `Caffeine Physics se diseñó desde el primer día con un solver numérico determinista a pasos fijos (60Hz o 120Hz). Puede rebobinar y resimular hasta 10 frames en menos de 0.8 milisegundos cuando detecta una desincronización de red.`
    ]
  }
];

export function getBlogPosts(lang: Language = 'pt'): BlogPost[] {
  switch (lang) {
    case 'en':
      return BLOG_POSTS_EN;
    case 'es':
      return BLOG_POSTS_ES;
    case 'pt':
    default:
      return BLOG_POSTS_PT;
  }
}

// Backward compatibility
export const BLOG_POSTS = BLOG_POSTS_PT;
