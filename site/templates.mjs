// HTML templates for the Caffeine site. Plain functions that return strings.

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const STRINGS = {
  en: {
    docs: 'Documentation',
    docsHome: 'Documentation',
    search: 'Search the docs',
    searchHint: 'Search docs…',
    searchEmpty: 'No results for',
    searchTip: 'Type to search titles, headings and text.',
    onThisPage: 'On this page',
    editPage: 'Edit this page',
    previous: 'Previous',
    next: 'Next',
    menu: 'Menu',
    theme: 'Toggle theme',
    skip: 'Skip to content',
    pages: 'pages',
    page: 'page',
    openSection: 'Open section',
    notFoundTitle: 'Page not found',
    notFoundText: 'That page does not exist, or it moved. Try the search or start from the documentation home.',
    goDocs: 'Documentation home',
    goHome: 'Back to the home page',
    heroKicker: 'Open source game engine',
    heroTitle: 'Build worlds with Caffeine.',
    heroLede:
      'A C++20 engine on SDL3 GPU with an ECS core, Lua and Dryad scripting, and Doppio: a fast native editor with node generators for materials, textures, nature, terrain and water.',
    ctaStart: 'Get started',
    ctaEditor: 'Explore Doppio',
    ctaScripting: 'Scripting API',
    featuresTitle: 'What is inside',
    features: [
      ['Modern renderer', 'Vulkan, Direct3D 12 and Metal through SDL3 GPU, with PBR materials, shadows, post-processing and terrain.'],
      ['ECS core', 'Data-oriented entities and components with scenes, hierarchy, prefabs and reflection-based editing.'],
      ['Doppio editor', 'A native Rust/Iced editor: hierarchy, viewport gizmos, inspector, assets and a headless test driver.'],
      ['Lua and Dryad', 'Two scripting languages over one documented API, plus a node editor that writes Dryad for you.'],
      ['Generators', 'Recipe-based generators for materials, textures, nature, terrain and water that stay editable.'],
      ['Asset pipeline', 'caf-pack turns raw assets into compact .caf files and .cap packages for shipping.'],
    ],
    exploreTitle: 'Explore the documentation',
    tourTitle: 'The editor at a glance',
    tourText: 'Doppio is a single window with five panes. Every widget has a stable id, so the same layout is scriptable and testable.',
    openDocs: 'Browse all documentation',
    stats: 'pages in the docs',
    sectionIndex: 'In this section',
    topics: 'Topics',
    documents: 'Documents',
    booksTitle: 'Books and PDFs',
    booksBadge: 'Reference',
    booksLede: 'Long-form material that is written in LaTeX and published as PDF.',
    bookCol: 'Book',
    aboutCol: 'About',
    linksCol: 'Links',
    bookInternals: 'How the engine is put together, chapter by chapter.',
    bookScripting: 'Scripting reference',
    bookScriptingNote: 'The printed edition of the generated Lua and Dryad API reference.',
    bookGraphics: 'A computer graphics course in Portuguese.',
    footer: 'Caffeine Engine and Doppio. Documentation is part of the open source project.',
    sourceCode: 'Source code',
    community: 'Community',
  },
  pt: {
    docs: 'Documentação',
    docsHome: 'Documentação',
    search: 'Pesquisar na documentação',
    searchHint: 'Pesquisar…',
    searchEmpty: 'Sem resultados para',
    searchTip: 'Escreva para pesquisar títulos, secções e texto.',
    onThisPage: 'Nesta página',
    editPage: 'Editar esta página',
    previous: 'Anterior',
    next: 'Seguinte',
    menu: 'Menu',
    theme: 'Alternar tema',
    skip: 'Saltar para o conteúdo',
    pages: 'páginas',
    page: 'página',
    openSection: 'Abrir secção',
    notFoundTitle: 'Página não encontrada',
    notFoundText: 'Esta página não existe ou mudou de sítio. Experimente a pesquisa ou comece pela página inicial da documentação.',
    goDocs: 'Início da documentação',
    goHome: 'Voltar à página inicial',
    heroKicker: 'Motor de jogos open source',
    heroTitle: 'Construa mundos com o Caffeine.',
    heroLede:
      'Um motor C++20 sobre SDL3 GPU com núcleo ECS, scripting em Lua e Dryad, e o Doppio: um editor nativo e rápido com geradores por nós para materiais, texturas, natureza, terreno e água.',
    ctaStart: 'Começar',
    ctaEditor: 'Explorar o Doppio',
    ctaScripting: 'API de scripting',
    featuresTitle: 'O que está incluído',
    features: [
      ['Renderizador moderno', 'Vulkan, Direct3D 12 e Metal através do SDL3 GPU, com materiais PBR, sombras, pós-processamento e terreno.'],
      ['Núcleo ECS', 'Entidades e componentes orientados a dados com cenas, hierarquia, prefabs e edição por reflexão.'],
      ['Editor Doppio', 'Um editor nativo em Rust/Iced: hierarquia, gizmos no viewport, inspetor, assets e um driver de testes headless.'],
      ['Lua e Dryad', 'Duas linguagens sobre uma única API documentada, mais um editor de nós que escreve Dryad por si.'],
      ['Geradores', 'Geradores baseados em receitas para materiais, texturas, natureza, terreno e água que continuam editáveis.'],
      ['Pipeline de assets', 'O caf-pack transforma assets em bruto em ficheiros .caf compactos e pacotes .cap prontos a distribuir.'],
    ],
    exploreTitle: 'Explore a documentação',
    tourTitle: 'O editor num relance',
    tourText: 'O Doppio é uma janela única com cinco painéis. Cada widget tem um id estável, por isso o mesmo layout é scriptável e testável.',
    openDocs: 'Ver toda a documentação',
    stats: 'páginas na documentação',
    sectionIndex: 'Nesta secção',
    topics: 'Tópicos',
    documents: 'Documentos',
    booksTitle: 'Livros e PDFs',
    booksBadge: 'Referência',
    booksLede: 'Material extenso escrito em LaTeX e publicado em PDF.',
    bookCol: 'Livro',
    aboutCol: 'Sobre',
    linksCol: 'Ligações',
    bookInternals: 'Como o motor é construído, capítulo a capítulo.',
    bookScripting: 'Referência de scripting',
    bookScriptingNote: 'A edição impressa da referência gerada da API Lua e Dryad.',
    bookGraphics: 'Um curso de computação gráfica em português.',
    footer: 'Motor Caffeine e Doppio. A documentação faz parte do projeto open source.',
    sourceCode: 'Código-fonte',
    community: 'Comunidade',
  },
};

const ICONS = {
  logo: '<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="url(#cf-grad)"/><defs><linearGradient id="cf-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2a65a"/><stop offset="1" stop-color="#c2561e"/></linearGradient></defs><path d="M8.500 14h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" fill="#fff"/><path d="M20.500 15.500H22a2.500 2.500 0 0 1 0 5h-1.500" fill="none" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/><path d="M12 11c-1-1.500 1-2.500 0-4M16 11c-1-1.500 1-2.500 0-4" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.600" stroke-linecap="round"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  chevron:
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  arrow:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

const GROUP_ICONS = {
  start: '<path d="M5 3l14 9-14 9z"/>',
  editor: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  scripting: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
  engine: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.100 2.100M4.900 19.100 7 17M17 7l2.100-2.100"/>',
  project: '<path d="M4 4h16v16H4zM4 9h16M9 9v11"/>',
};

function groupIcon(id) {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GROUP_ICONS[id] ?? GROUP_ICONS.engine}</svg>`;
}

function head({ config, lang, stamp, title, description, url, alternates = [] }) {
  const fullTitle = title ? `${esc(title)} · Caffeine` : 'Caffeine Engine';
  const alt = alternates
    .map((a) => `<link rel="alternate" hreflang="${a.code}" href="${config.url}${a.url}">`)
    .join('\n');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${esc(description || '')}">
<meta name="theme-color" content="#14110f" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#fbf8f4" media="(prefers-color-scheme: light)">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${esc(description || '')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Caffeine">
${url ? `<link rel="canonical" href="${config.url}${url}">\n<meta property="og:url" content="${config.url}${url}">` : ''}
${alt}
<link rel="icon" type="image/svg+xml" href="/assets/logo.svg">
<script>try{var t=localStorage.getItem('caffeine-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<link rel="stylesheet" href="/assets/style.css?v=${stamp}">
</head>`;
}

function header({ config, lang, groups, activeGroup, switchTo }) {
  const s = STRINGS[lang];
  const tabs = groups
    .map(
      (g) =>
        `<a class="tab${g.id === activeGroup ? ' active' : ''}" href="/${lang}/section/${g.id}/">${esc(g.title[lang])}</a>`,
    )
    .join('');
  const langs = config.languages
    .map(
      (l) =>
        `<a class="lang${l.code === lang ? ' active' : ''}" href="${switchTo(l.code)}" hreflang="${l.code}" lang="${l.code}" title="${esc(l.label)}">${l.short}</a>`,
    )
    .join('');
  return `<a class="skip" href="#content">${s.skip}</a>
<header class="topbar">
  <div class="topbar-inner">
    <button class="icon-btn menu-btn" type="button" aria-label="${s.menu}" aria-controls="sidebar" aria-expanded="false">${ICONS.menu}</button>
    <a class="brand" href="/${lang}/">${ICONS.logo}<span>Caffeine</span></a>
    <nav class="tabs" aria-label="Sections">${tabs}</nav>
    <div class="topbar-actions">
      <button class="search-btn" type="button" aria-label="${s.search}">${ICONS.search}<span class="search-label">${s.searchHint}</span><kbd>Ctrl K</kbd></button>
      <div class="langs" role="group" aria-label="Language">${langs}</div>
      <button class="icon-btn theme-btn" type="button" aria-label="${s.theme}"><span class="icon-sun">${ICONS.sun}</span><span class="icon-moon">${ICONS.moon}</span></button>
      <a class="icon-btn" href="${config.repo}" aria-label="GitHub" rel="noopener">${ICONS.github}</a>
    </div>
  </div>
</header>`;
}

function searchDialog(lang) {
  const s = STRINGS[lang];
  return `<div class="search-modal" hidden>
  <div class="search-backdrop" data-close></div>
  <div class="search-panel" role="dialog" aria-modal="true" aria-label="${s.search}">
    <div class="search-input-row">${ICONS.search}<input class="search-input" type="search" placeholder="${s.searchHint}" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div>
    <ul class="search-results" role="listbox"></ul>
    <p class="search-tip">${s.searchTip}</p>
  </div>
</div>`;
}

function footer({ config, lang }) {
  const s = STRINGS[lang];
  return `<footer class="site-footer"><div class="site-footer-inner">
  <span>${s.footer}</span>
  <span class="footer-links"><a href="${config.repo}" rel="noopener">${s.sourceCode}</a><a href="${config.siteRepo}" rel="noopener">caffeine-website</a><a href="${config.url}">caffeine.devscafe.org</a></span>
</div></footer>`;
}

function scripts(lang, stamp, mermaid) {
  return `<script>window.CAFFEINE={lang:"${lang}",search:"/${lang}/search.json?v=${stamp}"${mermaid ? ',mermaid:"/assets/vendor/mermaid.min.js"' : ''}};</script>
<script src="/assets/app.js?v=${stamp}" defer></script>`;
}

// ── sidebar ────────────────────────────────────────────────────────────

function containsUrl(node, url) {
  if (node.kind === 'page') return node.page.url === url;
  if (node.page?.url === url) return true;
  return node.children.some((c) => containsUrl(c, url));
}

function navNode(node, url, depth, forceOpen) {
  if (node.kind === 'page') {
    const active = node.page.url === url;
    return `<li><a class="nav-link${active ? ' active' : ''}" href="${node.page.url}"${active ? ' aria-current="page"' : ''}>${esc(node.title)}</a></li>`;
  }
  const open = forceOpen || containsUrl(node, url);
  const active = node.page?.url === url;
  const label = node.page
    ? `<a class="nav-link nav-dir-link${active ? ' active' : ''}" href="${node.page.url}"${active ? ' aria-current="page"' : ''}>${esc(node.title)}</a>`
    : `<button class="nav-dir-label" type="button">${esc(node.title)}</button>`;
  const children = node.children.map((c) => navNode(c, url, depth + 1, false)).join('');
  return `<li class="nav-dir${open ? ' open' : ''}${depth === 0 ? ' top' : ''}"><div class="nav-dir-row">${label}<button class="nav-toggle" type="button" aria-label="Toggle" aria-expanded="${open}">${ICONS.chevron}</button></div><ul>${children}</ul></li>`;
}

function sidebar({ lang, nodes, url, groups, activeGroup }) {
  const s = STRINGS[lang];
  if (!nodes) {
    const items = groups
      .map(
        (g) =>
          `<li><a class="nav-link" href="/${lang}/section/${g.id}/">${esc(g.title[lang])}</a></li>`,
      )
      .join('');
    return `<nav class="sidebar" id="sidebar" aria-label="${s.docs}"><div class="nav-title">${s.docs}</div><ul class="nav-root">${items}</ul></nav>`;
  }
  const group = groups.find((g) => g.id === activeGroup);
  const single = nodes.length === 1;
  const items = nodes.map((n) => navNode(n, url, 0, single)).join('');
  return `<nav class="sidebar" id="sidebar" aria-label="${esc(group?.title[lang] ?? s.docs)}"><div class="nav-title">${esc(group?.title[lang] ?? s.docs)}</div><ul class="nav-root">${items}</ul></nav>`;
}

// ── pages ──────────────────────────────────────────────────────────────

function breadcrumbs({ lang, page, groups, root }) {
  const s = STRINGS[lang];
  const crumbs = [`<a href="/${lang}/docs/">${s.docs}</a>`];
  const group = groups.find((g) => g.id === page.group);
  if (group) crumbs.push(`<a href="/${lang}/section/${group.id}/">${esc(group.title[lang])}</a>`);
  return `<nav class="crumbs" aria-label="Breadcrumb">${crumbs.join('<span aria-hidden="true">/</span>')}</nav>`;
}

export function renderPage(ctx) {
  const { config, lang, stamp, groups, page, prev, next, switchTo, sections } = ctx;
  const s = STRINGS[lang];
  const hasMermaid = page.html.includes('class="mermaid"');
  const toc = page.toc.length > 1
    ? `<aside class="toc" aria-label="${s.onThisPage}"><div class="toc-title">${s.onThisPage}</div><ul>${page.toc
        .map((h) => `<li class="l${h.level}"><a href="#${h.id}">${esc(h.text)}</a></li>`)
        .join('')}</ul></aside>`
    : '<aside class="toc"></aside>';
  const pager =
    prev || next
      ? `<nav class="pager" aria-label="Pager">${
          prev
            ? `<a class="pager-prev" href="${prev.url}"><span>${s.previous}</span><strong>${esc(prev.title)}</strong></a>`
            : '<span></span>'
        }${
          next
            ? `<a class="pager-next" href="${next.url}"><span>${s.next}</span><strong>${esc(next.title)}</strong></a>`
            : '<span></span>'
        }</nav>`
      : '';
  const edit = page.virtual
    ? ''
    : `<a class="edit-link" href="${config.siteRepo}/edit/main/content/${lang}/docs/${page.rel}" rel="noopener">${s.editPage}</a>`;
  const isDocsHome = page.rel === 'README.md';
  return `${head({
    config,
    lang,
    stamp,
    title: page.title,
    description: page.description,
    url: page.url,
    alternates: config.languages.map((l) => ({ code: l.code, url: switchTo(l.code) })),
  })}
<body data-page="doc">
${header({ config, lang, groups, activeGroup: page.group, switchTo })}
<div class="layout">
  ${sidebar({ lang, nodes: sections, url: page.url, groups, activeGroup: page.group })}
  <main class="main" id="content">
    ${isDocsHome ? '' : breadcrumbs({ lang, page, groups })}
    <article class="doc">
      <h1 class="doc-title">${esc(page.title)}</h1>
      ${page.html}
    </article>
    <div class="doc-foot">${edit}</div>
    ${pager}
  </main>
  ${toc}
</div>
${footer({ config, lang })}
${searchDialog(lang)}
${scripts(lang, stamp, hasMermaid)}
</body></html>`;
}

function nodeSummary(node, lang) {
  const s = STRINGS[lang];
  const page = node.kind === 'page' ? node.page : node.page;
  const count = node.kind === 'dir' ? countAll(node) : 1;
  const children = node.kind === 'dir' ? node.children.slice(0, 4) : [];
  const links = children
    .map((c) => `<li><a href="${(c.kind === 'page' ? c.page : c.page)?.url ?? '#'}">${esc(c.title)}</a></li>`)
    .join('');
  return { page, count, links, s };
}

function countAll(node) {
  if (node.kind === 'page') return 1;
  return (node.page ? 1 : 0) + node.children.reduce((n, c) => n + countAll(c), 0);
}

export function renderLanding(ctx) {
  const { config, lang, stamp, groups, group, nodes, switchTo } = ctx;
  const s = STRINGS[lang];
  const cards = nodes
    .map((node) => {
      const { page, count, links } = nodeSummary(node, lang);
      const href = page?.url ?? (node.kind === 'dir' ? firstUrl(node) : '#');
      const desc = page?.description ?? '';
      return `<article class="card">
  <h3><a href="${href}">${esc(node.title)}</a></h3>
  ${desc ? `<p>${esc(desc)}</p>` : ''}
  ${links ? `<ul class="card-links">${links}</ul>` : ''}
  <div class="card-foot"><span>${count} ${count === 1 ? s.page : s.pages}</span><a href="${href}" aria-label="${s.openSection}: ${esc(node.title)}">${ICONS.arrow}</a></div>
</article>`;
    })
    .join('');
  return `${head({
    config,
    lang,
    stamp,
    title: group.title[lang],
    description: group.description[lang],
    url: `/${lang}/section/${group.id}/`,
    alternates: config.languages.map((l) => ({ code: l.code, url: switchTo(l.code) })),
  })}
<body data-page="landing">
${header({ config, lang, groups, activeGroup: group.id, switchTo })}
<div class="layout layout-landing">
  ${sidebar({ lang, nodes, url: '', groups, activeGroup: group.id })}
  <main class="main" id="content">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/${lang}/docs/">${s.docs}</a></nav>
    <div class="landing-head">
      <span class="landing-icon">${groupIcon(group.id)}</span>
      <div><h1 class="doc-title">${esc(group.title[lang])}</h1><p class="doc-lede">${esc(group.description[lang])}</p></div>
    </div>
    <div class="cards">${cards}</div>
  </main>
</div>
${footer({ config, lang })}
${searchDialog(lang)}
${scripts(lang, stamp, false)}
</body></html>`;
}

function firstUrl(node) {
  if (node.page) return node.page.url;
  for (const child of node.children) {
    const url = child.kind === 'page' ? child.page.url : firstUrl(child);
    if (url) return url;
  }
  return '#';
}

export function renderHome(ctx) {
  const { config, lang, stamp, groups, switchTo, pageCount, firstOf, trees } = ctx;
  const s = STRINGS[lang];
  const features = s.features
    .map(
      ([title, text], i) =>
        `<article class="feature"><span class="feature-index">0${i + 1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`,
    )
    .join('');
  const groupCards = groups
    .map((g) => {
      const nodes = trees.get(g.id) ?? [];
      const links = nodes
        .slice(0, 5)
        .map((n) => `<li><a href="${(n.page?.url) ?? firstUrl(n)}">${esc(n.title)}</a></li>`)
        .join('');
      return `<article class="card card-group"><span class="card-icon">${groupIcon(g.id)}</span><h3><a href="${firstOf(g.id)}">${esc(g.title[lang])}</a></h3><p>${esc(g.description[lang])}</p><ul class="card-links">${links}</ul></article>`;
    })
    .join('');
  const img = (name) => `/${lang}/docs/images/${name}`;
  return `${head({
    config,
    lang,
    stamp,
    title: '',
    description: s.heroLede,
    url: `/${lang}/`,
    alternates: config.languages.map((l) => ({ code: l.code, url: switchTo(l.code) })),
  })}
<body data-page="home">
${header({ config, lang, groups, activeGroup: null, switchTo })}
<main id="content">
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <span class="kicker">${s.heroKicker}</span>
        <h1>${s.heroTitle}</h1>
        <p class="hero-lede">${s.heroLede}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/${lang}/section/start/">${s.ctaStart}${ICONS.arrow}</a>
          <a class="btn" href="/${lang}/section/editor/">${s.ctaEditor}</a>
          <a class="btn" href="/${lang}/section/scripting/">${s.ctaScripting}</a>
        </div>
        <div class="hero-code code-block" data-lang="bash"><div class="code-head"><span class="code-lang">bash</span><button class="code-copy" type="button" aria-label="Copy code">Copy</button></div><pre><code>git clone --recurse-submodules git@github.com:devscafecommunity/caffeine.git
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release &amp;&amp; cmake --build build -j</code></pre></div>
      </div>
      <figure class="hero-shot">
        <img src="${img('editor/workspace-scene.png')}" alt="Doppio editor with hierarchy, viewport, inspector, assets and console" width="1200" fetchpriority="high">
      </figure>
    </div>
  </section>

  <section class="band">
    <h2 class="band-title">${s.featuresTitle}</h2>
    <div class="features">${features}</div>
  </section>

  <section class="band band-alt">
    <h2 class="band-title">${s.exploreTitle}</h2>
    <div class="cards cards-home">${groupCards}</div>
    <p class="band-foot"><a class="btn" href="/${lang}/docs/">${s.openDocs}${ICONS.arrow}</a><span class="muted">${pageCount} ${s.stats}</span></p>
  </section>

  <section class="band">
    <div class="tour">
      <div class="tour-copy"><h2 class="band-title">${s.tourTitle}</h2><p>${s.tourText}</p></div>
      <div class="tour-shots">
        <figure><img src="${img('editor/material-generator.png')}" alt="Material node generator in Doppio" loading="lazy"></figure>
        <figure><img src="${img('editor/terrain-generator.png')}" alt="Terrain generator in Doppio" loading="lazy"></figure>
        <figure><img src="${img('editor/nature-generator.png')}" alt="Nature generator in Doppio" loading="lazy"></figure>
      </div>
    </div>
  </section>
</main>
${footer({ config, lang })}
${searchDialog(lang)}
${scripts(lang, stamp, false)}
</body></html>`;
}

export function renderNotFound(ctx) {
  const { config, lang, stamp, groups, switchTo } = ctx;
  const s = STRINGS[lang];
  return `${head({ config, lang, stamp, title: s.notFoundTitle, description: s.notFoundText })}
<body data-page="404">
${header({ config, lang, groups, activeGroup: null, switchTo })}
<main id="content" class="notfound">
  <h1>${s.notFoundTitle}</h1>
  <p>${s.notFoundText}</p>
  <p><a class="btn btn-primary" href="/${lang}/docs/">${s.goDocs}</a> <a class="btn" href="/${lang}/">${s.goHome}</a></p>
</main>
${searchDialog(lang)}
${scripts(lang, stamp, false)}
</body></html>`;
}

export function renderRootRedirect({ config }) {
  const langs = config.languages.map((l) => l.code);
  return `<!doctype html>
<html lang="${config.defaultLanguage}"><head><meta charset="utf-8"><title>Caffeine Engine</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0; url=/${config.defaultLanguage}/">
<link rel="canonical" href="${config.url}/${config.defaultLanguage}/">
<link rel="icon" type="image/svg+xml" href="/assets/logo.svg">
<script>(function(){var l=(navigator.language||'en').slice(0,2).toLowerCase();var ok=${JSON.stringify(langs)};var s=null;try{s=localStorage.getItem('caffeine-lang')}catch(e){}location.replace('/'+(ok.indexOf(s)>-1?s:ok.indexOf(l)>-1?l:'${config.defaultLanguage}')+'/')})();</script>
</head><body><p><a href="/${config.defaultLanguage}/">Caffeine Engine</a></p></body></html>`;
}
