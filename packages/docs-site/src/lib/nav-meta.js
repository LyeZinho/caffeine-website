export const sourceLabels = {
  docs: 'Engine docs',
  planning: 'Planning',
  engine: 'Engine root',
};

/** @param {{ id: string, title: string, blurb: string, related?: string[] }} hub */
export function publicHub(hub) {
  return { id: hub.id, title: hub.title, blurb: hub.blurb, related: hub.related ?? [] };
}

/** Curated hubs: cross-link docs modules and planning milestones. */
export const topicHubs = [
  {
    id: 'start',
    title: 'Começar',
    blurb: 'Visão geral, histórico, ecossistema e especificações.',
    match: (e) =>
      ['MASTER', 'README', 'HISTORY', 'architecture_specs', 'ECOSYSTEM_WORKFLOW', 'AUDIT_REPORT'].some(
        (k) => e.slug.endsWith(`/${k}`) || e.path === `${k}.md`
      ) || e.path === 'README.md',
    related: ['core', 'editor', 'm1'],
  },
  {
    id: 'core',
    title: 'Core & tempo',
    blurb: 'Tipos, game loop, timer e eventos.',
    match: (e) => e.source === 'docs' && e.path.startsWith('core/'),
    related: ['memory', 'concurrency', 'ecs'],
  },
  {
    id: 'memory',
    title: 'Memória & dados',
    blurb: 'Alocadores, containers e modelo de memória.',
    match: (e) => e.source === 'docs' && e.path.startsWith('memory/'),
    related: ['core', 'ecs', 'performance'],
  },
  {
    id: 'math',
    title: 'Matemática',
    blurb: 'Vetores, matrizes e quaternions.',
    match: (e) => e.source === 'docs' && e.path.startsWith('math/'),
    related: ['rendering', 'physics', 'animation'],
  },
  {
    id: 'concurrency',
    title: 'Concorrência',
    blurb: 'Job system e paralelismo.',
    match: (e) => e.source === 'docs' && e.path.startsWith('concurrency/'),
    related: ['core', 'ecs', 'rendering'],
  },
  {
    id: 'ecs',
    title: 'ECS & cena',
    blurb: 'Entidades, componentes, systems e serialização de cena.',
    match: (e) => e.source === 'docs' && (e.path.startsWith('ecs/') || e.path.startsWith('scene/')),
    related: ['scripting', 'physics', 'editor', 'm3'],
  },
  {
    id: 'rendering',
    title: 'Rendering',
    blurb: 'RHI, câmaras, materiais, PBR, post-process e overlays.',
    match: (e) => e.source === 'docs' && e.path.startsWith('rendering/'),
    related: ['assets', 'animation', 'performance', 'm2'],
  },
  {
    id: 'assets',
    title: 'Assets & pipeline',
    blurb: 'CAF, meshes, asset manager e pipeline.',
    match: (e) => e.source === 'docs' && e.path.startsWith('assets/'),
    related: ['rendering', 'editor', 'm2'],
  },
  {
    id: 'physics',
    title: 'Física',
    blurb: '2D/3D e particionamento espacial.',
    match: (e) => e.source === 'docs' && e.path.startsWith('physics/'),
    related: ['ecs', 'math', 'animation'],
  },
  {
    id: 'animation',
    title: 'Animação',
    blurb: '2D, skeletal e ligação a meshes.',
    match: (e) => e.source === 'docs' && e.path.startsWith('animation/'),
    related: ['rendering', 'assets', 'm4'],
  },
  {
    id: 'audio',
    title: 'Áudio',
    blurb: 'Sistema de áudio e integração ECS.',
    match: (e) => e.source === 'docs' && e.path.startsWith('audio/'),
    related: ['ecs', 'm4'],
  },
  {
    id: 'input',
    title: 'Input',
    blurb: 'Teclado, rato, gamepad e actions.',
    match: (e) => e.source === 'docs' && e.path.startsWith('input/'),
    related: ['core', 'ui', 'scripting'],
  },
  {
    id: 'ui',
    title: 'UI',
    blurb: 'UI de jogo e do editor.',
    match: (e) => e.source === 'docs' && e.path.startsWith('ui/'),
    related: ['editor', 'rendering', 'input'],
  },
  {
    id: 'editor',
    title: 'Editor Doppio',
    blurb: 'Viewport, inspector, plugins e ferramentas de cena.',
    match: (e) => e.source === 'docs' && e.path.startsWith('editor/'),
    related: ['m1', 'm2', 'rendering', 'ui'],
  },
  {
    id: 'scripting',
    title: 'Scripting',
    blurb: 'Lua, APIs de runtime e módulos nativos.',
    match: (e) => e.source === 'docs' && e.path.startsWith('scripting/'),
    related: ['ecs', 'm3'],
  },
  {
    id: 'terrain',
    title: 'Terreno',
    blurb: 'Sistema de terreno e plugins.',
    match: (e) => e.source === 'docs' && e.path.startsWith('terrain/'),
    related: ['rendering', 'assets'],
  },
  {
    id: 'debug',
    title: 'Debug & testes',
    blurb: 'Ferramentas de debug e estratégia de testes.',
    match: (e) => e.source === 'docs' && e.path.startsWith('debug/'),
    related: ['core', 'performance'],
  },
  {
    id: 'performance',
    title: 'Performance',
    blurb: 'Viewport do editor e notas de otimização.',
    match: (e) => e.source === 'docs' && e.path.startsWith('performance/'),
    related: ['rendering', 'editor', 'debug'],
  },
  {
    id: 'plans',
    title: 'Planos & roadmaps',
    blurb: 'Design docs e sessões de implementação.',
    match: (e) => e.source === 'docs' && e.path.startsWith('plans/'),
    related: ['start', 'rendering', 'ecs'],
  },
  {
    id: 'm1',
    title: 'M1 — Scene editor',
    blurb: 'Fundação do editor: hierarchy, inspector, viewport.',
    match: (e) => e.source === 'planning' && e.path.includes('m1-scene-editor-foundation/'),
    related: ['m2', 'editor', 'ecs'],
  },
  {
    id: 'm2',
    title: 'M2 — Visual editing',
    blurb: 'Gizmos, DnD, assets, hot reload, project manager.',
    match: (e) => e.source === 'planning' && e.path.includes('m2-visual-editing-assets/'),
    related: ['m1', 'm3', 'assets', 'editor'],
  },
  {
    id: 'm3',
    title: 'M3 — Scripting',
    blurb: 'VM Lua, bindings ECS, sandbox, watcher.',
    match: (e) => e.source === 'planning' && e.path.includes('m3-scripting-runtime/'),
    related: ['m2', 'scripting', 'ecs'],
  },
  {
    id: 'm4',
    title: 'M4 — Ferramentas avançadas',
    blurb: 'Timeline, tilemap, materiais, áudio espacial, build.',
    match: (e) => e.source === 'planning' && e.path.includes('m4-advanced-tools-polish/'),
    related: ['m3', 'rendering', 'audio'],
  },
];

/** @param {typeof topicHubs[0]} hub */
export function hubEntries(hub, index) {
  return index.filter(hub.match).sort((a, b) => a.title.localeCompare(b.title));
}

/** @param {string} slug */
export function hubsForSlug(slug, index) {
  const entry = index.find((e) => e.slug === slug);
  if (!entry) return [];
  return topicHubs.filter((h) => h.match(entry));
}

/** Group index entries for sidebar: source -> section -> entries */
export function groupIndex(index) {
  /** @type {Record<string, Record<string, typeof index>>} */
  const bySource = {};
  for (const entry of index) {
    const source = entry.source;
    if (!bySource[source]) bySource[source] = {};
    const parts = entry.path.split('/');
    const section = parts.length > 1 ? parts[0] : '(root)';
    if (!bySource[source][section]) bySource[source][section] = [];
    bySource[source][section].push(entry);
  }
  for (const source of Object.keys(bySource)) {
    for (const section of Object.keys(bySource[source])) {
      bySource[source][section].sort((a, b) => a.title.localeCompare(b.title));
    }
  }
  return bySource;
}

/** Siblings: same source and top-level section folder. */
export function sectionSiblings(entry, index) {
  const parts = entry.path.split('/');
  const section = parts.length > 1 ? parts[0] : '';
  return index
    .filter(
      (e) =>
        e.source === entry.source &&
        e.slug !== entry.slug &&
        (section ? e.path.startsWith(`${section}/`) || e.path === `${section}.md` : !e.path.includes('/'))
    )
    .sort((a, b) => a.path.localeCompare(b.path));
}
