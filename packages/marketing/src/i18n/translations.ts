import { Language } from '../types';

export interface UiTranslations {
  nav: {
    overview: string;
    docs: string;
    tutorials: string;
    blog: string;
    doppio: string;
    search: string;
    downloadCli: string;
    home: string;
  };
  hero: {
    coreLabel: string;
    ideLabel: string;
    titlePrimary: string;
    titleHighlight: string;
    description: string;
    tutorialsBtn: string;
    docsBtn: string;
    searchPrompt: string;
    runtimePreview: string;
    runtimeVersion: string;
    runtimeCaption: string;
    kpi1: string;
    kpi1Label: string;
    kpi2: string;
    kpi2Label: string;
    kpi3: string;
    kpi3Label: string;
    kpi4: string;
    kpi4Label: string;
    copied: string;
    copy: string;
  };
  home: {
    archTitle: string;
    archDesc: string;
    coreBadge: string;
    coreTitle: string;
    coreDesc: string;
    corePoint1: string;
    corePoint2: string;
    corePoint3: string;
    coreLink: string;
    ideBadge: string;
    ideTitle: string;
    ideDesc: string;
    ideLink: string;
    tutTitle: string;
    tutDesc: string;
    openSimBtn: string;
    tutCard1Badge: string;
    tutCard1Time: string;
    tutCard1Title: string;
    tutCard1Desc: string;
    tutCard1Btn: string;
    tutCard2Badge: string;
    tutCard2Time: string;
    tutCard2Title: string;
    tutCard2Desc: string;
    tutCard2Btn: string;
    tutCard3Badge: string;
    tutCard3Time: string;
    tutCard3Title: string;
    tutCard3Desc: string;
    tutCard3Btn: string;
    devlogTitle: string;
    viewAllPosts: string;
    readPost: string;
    bottomCtaTitle: string;
    bottomCtaDesc: string;
    bottomCtaDocs: string;
    bottomCtaTut: string;
  };
  docs: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    clear: string;
    topics: string;
    sectionsCount: string;
    codeExamples: string;
    paramsTitle: string;
    paramName: string;
    paramType: string;
    paramDefault: string;
    paramDesc: string;
    calloutTitle: string;
    calloutDesc: string;
    openTutorial: string;
    seeAlso: string;
    loadError: string;
    contentNotice: string;
    translatedNotice: string;
    pagesCount: string;
    sourceDocs: string;
    sourcePlanning: string;
    sourceEngine: string;
  };
  languageMenu: {
    title: string;
  };
  tutorials: {
    title: string;
    subtitle: string;
    stepOf: string;
    prevStep: string;
    nextStep: string;
    completed: string;
    logic: string;
    csharpScript: string;
    visualGraph: string;
    graphCanvas: string;
    activeNodes: string;
    nodeInput: string;
    nodeInputDesc: string;
    nodeRate: string;
    nodeRigidBody: string;
    simTitle: string;
    pause: string;
    run: string;
    resetTitle: string;
    wasdHint: string;
    realtimeParams: string;
    noRecompile: string;
    speedLabel: string;
    gravityLabel: string;
    restitutionLabel: string;
    particlesLabel: string;
    bloomLabel: string;
    inspectorTitle: string;
    activeStatus: string;
    posLabel: string;
    velLabel: string;
    componentsLabel: string;
  };
  blog: {
    title: string;
    subtitle: string;
    allPosts: string;
    readArticle: string;
    backBtn: string;
    highlightsTitle: string;
  };
  doppio: {
    title: string;
    subtitle: string;
    hotReloadBtn: string;
    recompiling: string;
    successMsg: string;
    tutorialBtn: string;
    windowTitle: string;
    vsyncOn: string;
    hierarchyTitle: string;
    viewportTitle: string;
    consoleLabel: string;
    consoleText: string;
    inspectorTitle: string;
    coreBoxTitle: string;
    coreBoxDesc: string;
    coreBox1: string;
    coreBox2: string;
    coreBox3: string;
    ideBoxTitle: string;
    ideBoxDesc: string;
    ideBox1: string;
    ideBox2: string;
    ideBox3: string;
  };
  search: {
    placeholder: string;
    all: string;
    docs: string;
    tutorials: string;
    apis: string;
    blog: string;
    resultsCount: string;
    noResults: string;
    noResultsTip: string;
    shortcuts: string;
    globalSearch: string;
  };
  footer: {
    desc: string;
    versionInfo: string;
    docsCol: string;
    doc1: string;
    doc2: string;
    doc3: string;
    doc4: string;
    resourcesCol: string;
    communityCol: string;
    rights: string;
    privacy: string;
    terms: string;
    license: string;
  };
}

export const TRANSLATIONS: Record<Language, UiTranslations> = {
  pt: {
    nav: {
      overview: 'Visão Geral',
      docs: 'Documentação',
      tutorials: 'Tutoriais Interativos',
      blog: 'Blog & Devlog',
      doppio: 'Doppio IDE',
      search: 'Buscar',
      downloadCli: 'Baixar CLI',
      home: 'Início'
    },
    hero: {
      coreLabel: 'Core: Caffeine',
      ideLabel: 'IDE: Doppio',
      titlePrimary: 'Game Engine Caffeine',
      titleHighlight: 'e IDE Doppio',
      description: 'Desenvolva jogos com a arquitetura ECS linear do Caffeine e a interface visual do Doppio. Desempenho nativo em C++ e Rust sem pausas de coleta de lixo, com compilação direta para Vulkan, DirectX 12 e WebGPU.',
      tutorialsBtn: 'Tutoriais Interativos',
      docsBtn: 'Documentação',
      searchPrompt: 'Busca rápida (⌘K)',
      runtimePreview: 'Preview do Runtime',
      runtimeVersion: 'Caffeine ECS v1.4',
      runtimeCaption: 'Renderização contígua de entidades e simulação de partículas',
      kpi1: '120+ FPS',
      kpi1Label: '1 milhão de entidades no ECS',
      kpi2: '8.4 ms',
      kpi2Label: 'Hot-reload atômico de shaders',
      kpi3: '4.2 MB',
      kpi3Label: 'Tamanho do runtime Caffeine',
      kpi4: 'Zero-GC',
      kpi4Label: 'Sem engasgos de memória',
      copied: 'Copiado',
      copy: 'Copiar'
    },
    home: {
      archTitle: 'Caffeine Core e a IDE Doppio',
      archDesc: 'Um runtime cirúrgico de baixo nível sem distrações, integrado a um ambiente visual para iterar cenas, grafos e shaders.',
      coreBadge: 'Motor de Execução',
      coreTitle: 'Caffeine: Arquitetura ECS',
      coreDesc: 'Sem árvores de herança ou ponteiros dispersos. O Caffeine empacota componentes em arquétipos contíguos na memória. As queries rodam diretamente em registradores SIMD vetoriais com zero pausas de coleta de lixo.',
      corePoint1: 'Bindings nativos para C++, Rust e C# com compilação Ahead-of-Time',
      corePoint2: 'Física determinística em ponto fixo pronta para Netcode Rollback',
      corePoint3: 'Alocadores de arena contíguos com cache-hit superior a 98%',
      coreLink: 'Ver arquitetura ECS na documentação',
      ideBadge: 'Interface Gráfica',
      ideTitle: 'Doppio: Editor Visual',
      ideDesc: 'Desenvolva visualmente sem sacrificar velocidade. O editor de nós Doppio Graphs compila direto para código C++ nativo em release.',
      ideLink: 'Explorar recursos da IDE Doppio',
      tutTitle: 'Tutoriais Interativos',
      tutDesc: 'Aprenda na prática: teste a física, as entidades e as partículas no simulador embutido.',
      openSimBtn: 'Abrir Simulador',
      tutCard1Badge: 'Iniciante',
      tutCard1Time: '5 min',
      tutCard1Title: 'Seu Primeiro Jogo em 5 Minutos',
      tutCard1Desc: 'Instancie uma entidade no World, anexe Transform2D e controle o movimento pelo teclado.',
      tutCard1Btn: 'Iniciar tutorial',
      tutCard2Badge: 'Física 2D',
      tutCard2Time: '8 min',
      tutCard2Title: 'Gravidade, Impulso e Colisões',
      tutCard2Desc: 'Aprenda a calibrar a restituição (quique), atrito e camadas de colisão determinísticas.',
      tutCard2Btn: 'Iniciar tutorial',
      tutCard3Badge: 'Doppio Graphs',
      tutCard3Time: '6 min',
      tutCard3Title: 'Lógica Visual Conectada',
      tutCard3Desc: 'Conecte nós de input, cálculo matemático e disparo de forças sem escrever código manual.',
      tutCard3Btn: 'Iniciar tutorial',
      devlogTitle: 'Últimas do Devlog',
      viewAllPosts: 'Ver todas as publicações',
      readPost: 'Ler artigo →',
      bottomCtaTitle: 'Crie jogos de alto rendimento no Caffeine & Doppio',
      bottomCtaDesc: 'Explore a documentação prática, experimente os tutoriais interativos no navegador ou baixe a toolchain completa via terminal.',
      bottomCtaDocs: 'Documentação Oficial',
      bottomCtaTut: 'Tutoriais Interativos'
    },
    docs: {
      title: 'Documentação Técnica',
      subtitle: 'APIs, arquitetura ECS, grafos visuais e shaders para Caffeine e Doppio.',
      searchPlaceholder: 'Pesquisar tópicos e métodos...',
      clear: 'Limpar',
      topics: 'Tópicos',
      sectionsCount: 'seções',
      codeExamples: 'Código de Exemplo',
      paramsTitle: 'Parâmetros e Tipos',
      paramName: 'Nome',
      paramType: 'Tipo',
      paramDefault: 'Padrão',
      paramDesc: 'Descrição',
      calloutTitle: 'Testar no simulador interativo',
      calloutDesc: 'Manipule variáveis de física, entidades e partículas diretamente pelo navegador.',
      openTutorial: 'Abrir Tutorial',
      seeAlso: 'Veja também',
      loadError: 'Não foi possível abrir esta página.',
      contentNotice:
        'Esta página ainda não tem tradução. O texto abaixo está em português.',
      translatedNotice: 'Texto disponível no idioma selecionado.',
      pagesCount: 'páginas',
      sourceDocs: 'Motor (docs)',
      sourcePlanning: 'Planeamento',
      sourceEngine: 'Raiz do repositório',
    },
    languageMenu: {
      title: 'Idioma / Language',
    },
    tutorials: {
      title: 'Tutoriais Interativos',
      subtitle: 'Aprenda os conceitos do Caffeine e Doppio ajustando variáveis em tempo real no simulador.',
      stepOf: 'Passo',
      prevStep: 'Passo Anterior',
      nextStep: 'Próximo Passo',
      completed: '✓ Tutorial Concluído!',
      logic: 'Lógica',
      csharpScript: 'C# Script (Caffeine)',
      visualGraph: 'Grafo Visual (Doppio)',
      graphCanvas: 'Doppio Graph',
      activeNodes: 'Nós ativos',
      nodeInput: '[INPUT: WASD]',
      nodeInputDesc: 'Output: Vec2(axis_x, axis_y) ──► Força',
      nodeRate: '│ (atualização a 60Hz)',
      nodeRigidBody: '[RIGIDBODY: ENTIDADE]',
      simTitle: 'Simulador de Física & Entidades',
      pause: 'Pausar',
      run: 'Rodar',
      resetTitle: 'Resetar posição',
      wasdHint: 'Use WASD ou clique no canvas para mover',
      realtimeParams: 'Parâmetros em Tempo Real',
      noRecompile: 'Sem recompilação',
      speedLabel: 'Velocidade Máxima',
      gravityLabel: 'Gravidade (Eixo Y)',
      restitutionLabel: 'Restituição (Quique)',
      particlesLabel: 'Partículas',
      bloomLabel: 'Brilho',
      inspectorTitle: 'Inspetor da Entidade',
      activeStatus: 'Ativo',
      posLabel: 'Posição: ',
      velLabel: 'Velocidade: ',
      componentsLabel: 'Componentes: '
    },
    blog: {
      title: 'Blog e Devlog',
      subtitle: 'Artigos de arquitetura de baixo nível, lançamentos e tutoriais avançados de shaders.',
      allPosts: 'Todos os Posts',
      readArticle: 'Ler Artigo',
      backBtn: 'Voltar ao Blog & Devlog',
      highlightsTitle: 'Destaques Técnicos do Artigo'
    },
    doppio: {
      title: 'IDE Doppio',
      subtitle: 'Ambiente gráfico integrado para o runtime Caffeine. Construa cenas, conecte lógica por grafos de nós e edite shaders em tempo real.',
      hotReloadBtn: 'Testar Hot-Reload de Shader',
      recompiling: 'Recompilando...',
      successMsg: '✓ Shader recompilado no VSync em 8.4ms.',
      tutorialBtn: 'Tutorial de Grafos',
      windowTitle: 'Doppio IDE — CyberEspresso_2D.caffproj',
      vsyncOn: 'VSync Ativo',
      hierarchyTitle: 'Hierarquia da Cena',
      viewportTitle: 'Viewport 2D/3D',
      consoleLabel: 'Console:',
      consoleText: 'Engine pronta. Shaders compilados com sucesso.',
      inspectorTitle: 'Inspetor de Componentes',
      coreBoxTitle: 'Caffeine (Core Engine)',
      coreBoxDesc: 'Feito para controle total de memória, cache da CPU e determinismo.',
      coreBox1: 'Arquitetura ECS com alocação contígua em arquétipos',
      coreBox2: 'Física 2D determinística para netcode rollback multiplayer',
      coreBox3: 'Binário final de release leve (~4.2 MB)',
      ideBoxTitle: 'Doppio (IDE Visual)',
      ideBoxDesc: 'Feito para prototipar cenas, montar grafos e ajustar shaders com agilidade.',
      ideBox1: 'Editor de nós visuais Doppio Graphs que compila para C++',
      ideBox2: 'Hot-reload de fragment shaders em menos de 10ms',
      ideBox3: 'Inspetor de componentes com reflexão direta em tempo real'
    },
    search: {
      placeholder: 'Pesquisar docs, APIs, tutoriais ou devlog...',
      all: 'Tudo',
      docs: 'Documentação',
      tutorials: 'Tutoriais',
      apis: 'APIs & Parâmetros',
      blog: 'Blog',
      resultsCount: 'resultados',
      noResults: 'Nenhum resultado encontrado para',
      noResultsTip: 'Tente buscar por termos como "ECS", "Doppio", "Física", "World", "Shaders" ou "CLI".',
      shortcuts: 'navegar / selecionar / fechar',
      globalSearch: 'Busca global'
    },
    footer: {
      desc: 'Motor de jogos de altíssimo desempenho com ECS contíguo e IDE visual dual-shot. Distribuído sob licença Apache-2.0.',
      versionInfo: 'Build v1.4.2 · Suporte a Vulkan 1.3, DirectX 12, Metal e WebGPU.',
      docsCol: 'Documentação',
      doc1: 'Visão Geral do Core',
      doc2: 'Arquitetura ECS & World',
      doc3: 'Física Determinística 2D/3D',
      doc4: 'Pipeline de Shaders Crema',
      resourcesCol: 'Recursos',
      communityCol: 'Comunidade',
      rights: '© 2026 Caffeine Engine Project. Desenvolvido com amor pelo café e games rápidos.',
      privacy: 'Privacidade',
      terms: 'Termos',
      license: 'Licença Apache 2.0'
    }
  },
  en: {
    nav: {
      overview: 'Overview',
      docs: 'Documentation',
      tutorials: 'Interactive Tutorials',
      blog: 'Blog & Devlog',
      doppio: 'Doppio IDE',
      search: 'Search',
      downloadCli: 'Download CLI',
      home: 'Home'
    },
    hero: {
      coreLabel: 'Core: Caffeine',
      ideLabel: 'IDE: Doppio',
      titlePrimary: 'Caffeine Game Engine',
      titleHighlight: '& Doppio IDE',
      description: 'Build games with Caffeine’s contiguous ECS architecture and Doppio’s visual interface. Native C++ and Rust performance with zero garbage collection pauses, compiling directly to Vulkan, DirectX 12, and WebGPU.',
      tutorialsBtn: 'Interactive Tutorials',
      docsBtn: 'Documentation',
      searchPrompt: 'Quick search (⌘K)',
      runtimePreview: 'Runtime Preview',
      runtimeVersion: 'Caffeine ECS v1.4',
      runtimeCaption: 'Contiguous entity rendering and particle simulation',
      kpi1: '120+ FPS',
      kpi1Label: '1 million entities in ECS',
      kpi2: '8.4 ms',
      kpi2Label: 'Atomic shader hot-reload',
      kpi3: '4.2 MB',
      kpi3Label: 'Caffeine runtime binary size',
      kpi4: 'Zero-GC',
      kpi4Label: 'Zero memory stutters',
      copied: 'Copied',
      copy: 'Copy'
    },
    home: {
      archTitle: 'Caffeine Core & Doppio IDE',
      archDesc: 'A surgical low-level runtime free of distractions, paired with a visual environment to iterate on scenes, graphs, and shaders.',
      coreBadge: 'Execution Engine',
      coreTitle: 'Caffeine: ECS Architecture',
      coreDesc: 'No inheritance hierarchies or scattered pointers. Caffeine packs components into contiguous archetypes in memory. Systems query directly through SIMD vector registers with zero garbage collection pauses.',
      corePoint1: 'Native bindings for C++, Rust, and C# with Ahead-of-Time compilation',
      corePoint2: 'Fixed-point deterministic physics ready for Rollback Netcode',
      corePoint3: 'Contiguous arena allocators delivering over 98% CPU cache hits',
      coreLink: 'Explore ECS architecture in documentation',
      ideBadge: 'Graphical Interface',
      ideTitle: 'Doppio: Visual Editor',
      ideDesc: 'Develop visually without sacrificing speed. The Doppio Graphs visual node editor compiles directly into native C++ in release builds.',
      ideLink: 'Explore Doppio IDE features',
      tutTitle: 'Interactive Tutorials',
      tutDesc: 'Learn hands-on: test physics, entities, and particles right inside the browser simulator.',
      openSimBtn: 'Open Simulator',
      tutCard1Badge: 'Beginner',
      tutCard1Time: '5 min',
      tutCard1Title: 'Your First Game in 5 Minutes',
      tutCard1Desc: 'Spawn an entity in the World, attach Transform2D, and control its movement with the keyboard.',
      tutCard1Btn: 'Start tutorial',
      tutCard2Badge: '2D Physics',
      tutCard2Time: '8 min',
      tutCard2Title: 'Gravity, Impulse & Collisions',
      tutCard2Desc: 'Learn to calibrate restitution (bounce), friction, and deterministic collision layers.',
      tutCard2Btn: 'Start tutorial',
      tutCard3Badge: 'Doppio Graphs',
      tutCard3Time: '6 min',
      tutCard3Title: 'Connected Visual Logic',
      tutCard3Desc: 'Connect input, math operations, and force impulses without writing manual code.',
      tutCard3Btn: 'Start tutorial',
      devlogTitle: 'Latest from Devlog',
      viewAllPosts: 'View all publications',
      readPost: 'Read article →',
      bottomCtaTitle: 'Build high-performance games with Caffeine & Doppio',
      bottomCtaDesc: 'Explore practical documentation, test in-browser interactive tutorials, or install the CLI toolchain via terminal.',
      bottomCtaDocs: 'Official Documentation',
      bottomCtaTut: 'Interactive Tutorials'
    },
    docs: {
      title: 'Technical Documentation',
      subtitle: 'APIs, ECS architecture, visual graphs, and shaders for Caffeine and Doppio.',
      searchPlaceholder: 'Search topics and methods...',
      clear: 'Clear',
      topics: 'Topics',
      sectionsCount: 'sections',
      codeExamples: 'Code Examples',
      paramsTitle: 'Parameters and Types',
      paramName: 'Name',
      paramType: 'Type',
      paramDefault: 'Default',
      paramDesc: 'Description',
      calloutTitle: 'Test in interactive simulator',
      calloutDesc: 'Tweak physics variables, entities, and particles directly inside the browser.',
      openTutorial: 'Open Tutorial',
      seeAlso: 'See also',
      loadError: 'Could not open this page.',
      contentNotice: 'This page is not translated yet. The text below is in Portuguese.',
      translatedNotice: 'This page is available in the selected language.',
      pagesCount: 'pages',
      sourceDocs: 'Engine (docs)',
      sourcePlanning: 'Planning',
      sourceEngine: 'Repository root',
    },
    languageMenu: {
      title: 'Language / Idioma',
    },
    tutorials: {
      title: 'Interactive Tutorials',
      subtitle: 'Master Caffeine and Doppio concepts by adjusting real-time variables in the simulator.',
      stepOf: 'Step',
      prevStep: 'Previous Step',
      nextStep: 'Next Step',
      completed: '✓ Tutorial Completed!',
      logic: 'Logic',
      csharpScript: 'C# Script (Caffeine)',
      visualGraph: 'Visual Graph (Doppio)',
      graphCanvas: 'Doppio Graph',
      activeNodes: 'Active Nodes',
      nodeInput: '[INPUT: WASD]',
      nodeInputDesc: 'Output: Vec2(axis_x, axis_y) ──► Force',
      nodeRate: '│ (60Hz update cycle)',
      nodeRigidBody: '[RIGIDBODY: ENTITY]',
      simTitle: 'Physics & Entity Simulator',
      pause: 'Pause',
      run: 'Run',
      resetTitle: 'Reset position',
      wasdHint: 'Use WASD or click on canvas to move',
      realtimeParams: 'Real-Time Parameters',
      noRecompile: 'No recompilation needed',
      speedLabel: 'Max Speed',
      gravityLabel: 'Gravity (Y-Axis)',
      restitutionLabel: 'Restitution (Bounce)',
      particlesLabel: 'Particles',
      bloomLabel: 'Glow Bloom',
      inspectorTitle: 'Entity Inspector',
      activeStatus: 'Active',
      posLabel: 'Position: ',
      velLabel: 'Velocity: ',
      componentsLabel: 'Components: '
    },
    blog: {
      title: 'Blog & Devlog',
      subtitle: 'Low-level architecture articles, release updates, and advanced shader tutorials.',
      allPosts: 'All Posts',
      readArticle: 'Read Article',
      backBtn: 'Back to Blog & Devlog',
      highlightsTitle: 'Technical Highlights'
    },
    doppio: {
      title: 'Doppio IDE',
      subtitle: 'Integrated graphical environment for the Caffeine runtime. Compose scenes, wire node graphs, and edit shaders in real time.',
      hotReloadBtn: 'Test Shader Hot-Reload',
      recompiling: 'Recompiling...',
      successMsg: '✓ Shader recompiled on VSync in 8.4ms.',
      tutorialBtn: 'Graph Tutorial',
      windowTitle: 'Doppio IDE — CyberEspresso_2D.caffproj',
      vsyncOn: 'VSync Active',
      hierarchyTitle: 'Scene Hierarchy',
      viewportTitle: '2D/3D Viewport',
      consoleLabel: 'Console:',
      consoleText: 'Engine ready. Shaders compiled successfully.',
      inspectorTitle: 'Component Inspector',
      coreBoxTitle: 'Caffeine (Core Engine)',
      coreBoxDesc: 'Engineered for absolute memory control, CPU cache efficiency, and determinism.',
      coreBox1: 'Contiguous archetype-based ECS architecture',
      coreBox2: 'Deterministic 2D physics ready for rollback multiplayer',
      coreBox3: 'Lightweight release binary (~4.2 MB)',
      ideBoxTitle: 'Doppio (Visual IDE)',
      ideBoxDesc: 'Built to prototype scenes, connect node graphs, and tune shaders with agility.',
      ideBox1: 'Doppio Graphs visual editor compiling to native C++',
      ideBox2: 'Fragment shader hot-reload in under 10ms',
      ideBox3: 'Component inspector with immediate type reflection'
    },
    search: {
      placeholder: 'Search docs, APIs, tutorials, or devlog...',
      all: 'All',
      docs: 'Documentation',
      tutorials: 'Tutorials',
      apis: 'APIs & Parameters',
      blog: 'Blog',
      resultsCount: 'results',
      noResults: 'No results found for',
      noResultsTip: 'Try searching for terms like "ECS", "Doppio", "Physics", "World", "Shaders", or "CLI".',
      shortcuts: 'navigate / select / close',
      globalSearch: 'Global search'
    },
    footer: {
      desc: 'High-performance game engine with contiguous ECS and dual-shot visual IDE. Distributed under Apache-2.0.',
      versionInfo: 'Build v1.4.2 · Support for Vulkan 1.3, DirectX 12, Metal, and WebGPU.',
      docsCol: 'Documentation',
      doc1: 'Core Overview',
      doc2: 'ECS & World Architecture',
      doc3: '2D/3D Deterministic Physics',
      doc4: 'Crema Shader Pipeline',
      resourcesCol: 'Resources',
      communityCol: 'Community',
      rights: '© 2026 Caffeine Engine Project. Made with coffee love and fast games.',
      privacy: 'Privacy',
      terms: 'Terms',
      license: 'Apache 2.0 License'
    }
  },
  es: {
    nav: {
      overview: 'Visión General',
      docs: 'Documentación',
      tutorials: 'Tutoriales Interactivos',
      blog: 'Blog & Devlog',
      doppio: 'Doppio IDE',
      search: 'Buscar',
      downloadCli: 'Descargar CLI',
      home: 'Inicio'
    },
    hero: {
      coreLabel: 'Core: Caffeine',
      ideLabel: 'IDE: Doppio',
      titlePrimary: 'Game Engine Caffeine',
      titleHighlight: 'e IDE Doppio',
      description: 'Desarrolla videojuegos con la arquitectura ECS contigua de Caffeine y la interfaz visual de Doppio. Rendimiento nativo en C++ y Rust sin pausas de Garbage Collection, con compilación directa a Vulkan, DirectX 12 y WebGPU.',
      tutorialsBtn: 'Tutoriales Interactivos',
      docsBtn: 'Documentación',
      searchPrompt: 'Búsqueda rápida (⌘K)',
      runtimePreview: 'Vista previa del Runtime',
      runtimeVersion: 'Caffeine ECS v1.4',
      runtimeCaption: 'Renderizado contiguo de entidades y simulación de partículas',
      kpi1: '120+ FPS',
      kpi1Label: '1 millón de entidades en ECS',
      kpi2: '8.4 ms',
      kpi2Label: 'Hot-reload atómico de shaders',
      kpi3: '4.2 MB',
      kpi3Label: 'Tamaño del runtime Caffeine',
      kpi4: 'Zero-GC',
      kpi4Label: 'Sin tirones de memoria',
      copied: 'Copiado',
      copy: 'Copiar'
    },
    home: {
      archTitle: 'Caffeine Core y la IDE Doppio',
      archDesc: 'Un runtime quirúrgico de bajo nivel sin distracciones, integrado a un entorno visual para iterar escenas, grafos y shaders.',
      coreBadge: 'Motor de Ejecución',
      coreTitle: 'Caffeine: Arquitectura ECS',
      coreDesc: 'Sin árboles de herencia ni punteros dispersos. Caffeine agrupa componentes en arquetipos contiguos en memoria. Las consultas se ejecutan directamente en registros SIMD vectoriales sin pausas de recolección de basura.',
      corePoint1: 'Bindings nativos para C++, Rust y C# con compilación Ahead-of-Time',
      corePoint2: 'Física determinista de punto fijo lista para Netcode Rollback',
      corePoint3: 'Asignadores de arena contiguos con más del 98% de aciertos de caché CPU',
      coreLink: 'Ver arquitectura ECS en la documentación',
      ideBadge: 'Interfaz Gráfica',
      ideTitle: 'Doppio: Editor Visual',
      ideDesc: 'Desarrolla visualmente sin sacrificar velocidad. El editor de nodos Doppio Graphs compila directamente a código C++ nativo en producción.',
      ideLink: 'Explorar características de la IDE Doppio',
      tutTitle: 'Tutoriales Interactivos',
      tutDesc: 'Aprende en la práctica: prueba la física, las entidades y las partículas en el simulador integrado.',
      openSimBtn: 'Abrir Simulador',
      tutCard1Badge: 'Principiante',
      tutCard1Time: '5 min',
      tutCard1Title: 'Tu Primer Juego en 5 Minutos',
      tutCard1Desc: 'Instancia una entidad en el World, agrega Transform2D y controla su movimiento con el teclado.',
      tutCard1Btn: 'Iniciar tutorial',
      tutCard2Badge: 'Física 2D',
      tutCard2Time: '8 min',
      tutCard2Title: 'Gravedad, Impulso y Colisiones',
      tutCard2Desc: 'Aprende a calibrar la restitución (rebote), fricción y capas de colisión deterministas.',
      tutCard2Btn: 'Iniciar tutorial',
      tutCard3Badge: 'Doppio Graphs',
      tutCard3Time: '6 min',
      tutCard3Title: 'Lógica Visual Conectada',
      tutCard3Desc: 'Conecta nodos de entrada, cálculo matemático e impulsos de fuerza sin escribir código manual.',
      tutCard3Btn: 'Iniciar tutorial',
      devlogTitle: 'Últimas novedades del Devlog',
      viewAllPosts: 'Ver todas las publicaciones',
      readPost: 'Leer artículo →',
      bottomCtaTitle: 'Crea juegos de alto rendimiento en Caffeine & Doppio',
      bottomCtaDesc: 'Explora la documentación práctica, prueba los tutoriales interactivos en el navegador o instala la toolchain completa vía terminal.',
      bottomCtaDocs: 'Documentación Oficial',
      bottomCtaTut: 'Tutoriales Interactivos'
    },
    docs: {
      title: 'Documentación Técnica',
      subtitle: 'APIs, arquitectura ECS, grafos visuales y shaders para Caffeine y Doppio.',
      searchPlaceholder: 'Buscar temas y métodos...',
      clear: 'Limpiar',
      topics: 'Temas',
      sectionsCount: 'secciones',
      codeExamples: 'Código de Ejemplo',
      paramsTitle: 'Parámetros y Tipos',
      paramName: 'Nombre',
      paramType: 'Tipo',
      paramDefault: 'Por Defecto',
      paramDesc: 'Descripción',
      calloutTitle: 'Probar en el simulador interactivo',
      calloutDesc: 'Manipula variables de física, entidades y partículas directamente en el navegador.',
      openTutorial: 'Abrir Tutorial',
      seeAlso: 'Véase también',
      loadError: 'No se pudo abrir esta página.',
      contentNotice: 'Esta página aún no está traducida. El texto de abajo está en portugués.',
      translatedNotice: 'Texto disponible en el idioma seleccionado.',
      pagesCount: 'páginas',
      sourceDocs: 'Motor (docs)',
      sourcePlanning: 'Planificación',
      sourceEngine: 'Raíz del repositorio',
    },
    languageMenu: {
      title: 'Idioma / Language',
    },
    tutorials: {
      title: 'Tutoriales Interactivos',
      subtitle: 'Aprende los conceptos de Caffeine y Doppio ajustando variables en tiempo real en el simulador.',
      stepOf: 'Paso',
      prevStep: 'Paso Anterior',
      nextStep: 'Siguiente Paso',
      completed: '✓ ¡Tutorial Completado!',
      logic: 'Lógica',
      csharpScript: 'C# Script (Caffeine)',
      visualGraph: 'Grafo Visual (Doppio)',
      graphCanvas: 'Doppio Graph',
      activeNodes: 'Nodos activos',
      nodeInput: '[INPUT: WASD]',
      nodeInputDesc: 'Output: Vec2(axis_x, axis_y) ──► Fuerza',
      nodeRate: '│ (ciclo a 60Hz)',
      nodeRigidBody: '[RIGIDBODY: ENTIDAD]',
      simTitle: 'Simulador de Física & Entidades',
      pause: 'Pausar',
      run: 'Ejecutar',
      resetTitle: 'Restablecer posición',
      wasdHint: 'Usa WASD o haz clic en el canvas para mover',
      realtimeParams: 'Parámetros en Tiempo Real',
      noRecompile: 'Sin recompilación',
      speedLabel: 'Velocidad Máxima',
      gravityLabel: 'Gravedad (Eje Y)',
      restitutionLabel: 'Restitución (Rebote)',
      particlesLabel: 'Partículas',
      bloomLabel: 'Brillo',
      inspectorTitle: 'Inspector de Entidad',
      activeStatus: 'Activo',
      posLabel: 'Posición: ',
      velLabel: 'Velocidad: ',
      componentsLabel: 'Componentes: '
    },
    blog: {
      title: 'Blog y Devlog',
      subtitle: 'Artículos de arquitectura de bajo nivel, lanzamientos y tutoriales avanzados de shaders.',
      allPosts: 'Todos los Artículos',
      readArticle: 'Leer Artículo',
      backBtn: 'Volver al Blog & Devlog',
      highlightsTitle: 'Aspectos Técnicos Destacados'
    },
    doppio: {
      title: 'IDE Doppio',
      subtitle: 'Entorno gráfico integrado para el runtime Caffeine. Construye escenas, conecta lógica con grafos de nodos y edita shaders en tiempo real.',
      hotReloadBtn: 'Probar Hot-Reload de Shader',
      recompiling: 'Recompilando...',
      successMsg: '✓ Shader recompilado en el VSync en 8.4ms.',
      tutorialBtn: 'Tutorial de Grafos',
      windowTitle: 'Doppio IDE — CyberEspresso_2D.caffproj',
      vsyncOn: 'VSync Activo',
      hierarchyTitle: 'Jerarquía de la Escena',
      viewportTitle: 'Viewport 2D/3D',
      consoleLabel: 'Consola:',
      consoleText: 'Engine lista. Shaders compilados con éxito.',
      inspectorTitle: 'Inspector de Componentes',
      coreBoxTitle: 'Caffeine (Core Engine)',
      coreBoxDesc: 'Diseñado para control total de memoria, eficiencia en caché de CPU y determinismo.',
      coreBox1: 'Arquitectura ECS con asignación contigua en arquetipos',
      coreBox2: 'Física 2D determinista para netcode rollback multijugador',
      coreBox3: 'Binario final de producción liviano (~4.2 MB)',
      ideBoxTitle: 'Doppio (IDE Visual)',
      ideBoxDesc: 'Creado para prototipar escenas, conectar grafos de nodos y ajustar shaders con agilidad.',
      ideBox1: 'Editor de nodos visuales Doppio Graphs que compila a C++ nativo',
      ideBox2: 'Hot-reload de shaders en menos de 10ms',
      ideBox3: 'Inspector de componentes con reflexión directa en tiempo real'
    },
    search: {
      placeholder: 'Buscar docs, APIs, tutoriales o devlog...',
      all: 'Todo',
      docs: 'Documentación',
      tutorials: 'Tutoriales',
      apis: 'APIs & Parámetros',
      blog: 'Blog',
      resultsCount: 'resultados',
      noResults: 'No se encontraron resultados para',
      noResultsTip: 'Intenta buscar términos como "ECS", "Doppio", "Física", "World", "Shaders" o "CLI".',
      shortcuts: 'navegar / seleccionar / cerrar',
      globalSearch: 'Búsqueda global'
    },
    footer: {
      desc: 'Motor de videojuegos de altísimo rendimiento con ECS contiguo e IDE visual dual-shot. Distribuido bajo licencia Apache-2.0.',
      versionInfo: 'Build v1.4.2 · Soporte para Vulkan 1.3, DirectX 12, Metal y WebGPU.',
      docsCol: 'Documentación',
      doc1: 'Visión General del Core',
      doc2: 'Arquitectura ECS & World',
      doc3: 'Física Determinista 2D/3D',
      doc4: 'Pipeline de Shaders Crema',
      resourcesCol: 'Recursos',
      communityCol: 'Comunidad',
      rights: '© 2026 Caffeine Engine Project. Desarrollado con pasión por el café y juegos rápidos.',
      privacy: 'Privacidad',
      terms: 'Términos',
      license: 'Licencia Apache 2.0'
    }
  }
};
