import searchIndex from '../../../../content/search-index.json';
import { docHubTitle } from '../i18n/docHubTitles';
import type { Language } from '../types';

export type EngineDocEntry = {
  slug: string;
  title: string;
  source: string;
  path: string;
};

export const ENGINE_DOC_INDEX: EngineDocEntry[] = searchIndex as EngineDocEntry[];

export function sourceLabel(source: string, lang: Language): string {
  const t = {
    pt: { docs: 'Motor (docs)', planning: 'Planeamento', engine: 'Raiz do repo' },
    en: { docs: 'Engine (docs)', planning: 'Planning', engine: 'Repo root' },
    es: { docs: 'Motor (docs)', planning: 'Planificación', engine: 'Raíz del repo' },
  }[lang];
  return t[source as keyof typeof t] ?? source;
}

/** Mirrors docs-site topic hubs for sidebar grouping. */
export const TOPIC_HUBS = [
  { id: 'start', match: (e: EngineDocEntry) =>
      ['MASTER', 'README', 'HISTORY', 'architecture_specs', 'ECOSYSTEM_WORKFLOW', 'AUDIT_REPORT'].some(
        (k) => e.slug.endsWith(`/${k}`) || e.path === `${k}.md`,
      ) || e.path === 'README.md',
  },
  { id: 'core', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('core/') },
  { id: 'memory', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('memory/') },
  { id: 'math', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('math/') },
  { id: 'concurrency', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('concurrency/') },
  { id: 'ecs', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('ecs/') },
  { id: 'rendering', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('rendering/') },
  { id: 'assets', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('assets/') },
  { id: 'physics', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('physics/') },
  { id: 'animation', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('animation/') },
  { id: 'audio', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('audio/') },
  { id: 'input', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('input/') },
  { id: 'ui', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('ui/') },
  { id: 'editor', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('editor/') },
  { id: 'scripting', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('scripting/') },
  { id: 'terrain', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('terrain/') },
  { id: 'debug', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('debug/') },
  { id: 'performance', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('performance/') },
  { id: 'plans', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('plans/') },
  { id: 'analysis', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('analysis/') },
  { id: 'architecture', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('architecture/') },
  { id: 'releases', match: (e: EngineDocEntry) => e.source === 'docs' && e.path.startsWith('releases/') },
  { id: 'm1', match: (e: EngineDocEntry) => e.source === 'planning' && e.path.includes('m1-scene-editor-foundation/') },
  { id: 'm2', match: (e: EngineDocEntry) => e.source === 'planning' && e.path.includes('m2-visual-editing-assets/') },
  { id: 'm3', match: (e: EngineDocEntry) => e.source === 'planning' && e.path.includes('m3-scripting-runtime/') },
  { id: 'm4', match: (e: EngineDocEntry) => e.source === 'planning' && e.path.includes('m4-advanced-tools-polish/') },
  { id: 'planning-root', match: (e: EngineDocEntry) =>
      e.source === 'planning' && !e.path.includes('m1-') && !e.path.includes('m2-') && !e.path.includes('m3-') && !e.path.includes('m4-'),
  },
  { id: 'engine-root', match: (e: EngineDocEntry) => e.source === 'engine' },
] as const;

export type DocHubGroup = { id: string; title: string; entries: EngineDocEntry[] };

export function hubEntries(hub: (typeof TOPIC_HUBS)[number]): EngineDocEntry[] {
  return ENGINE_DOC_INDEX.filter(hub.match).sort((a, b) => a.title.localeCompare(b.title));
}

export function groupedByHub(lang: Language): DocHubGroup[] {
  const used = new Set<string>();
  const groups: DocHubGroup[] = [];
  for (const hub of TOPIC_HUBS) {
    const entries = hubEntries(hub).filter((e) => !used.has(e.slug));
    entries.forEach((e) => used.add(e.slug));
    if (entries.length) {
      groups.push({ id: hub.id, title: docHubTitle(hub.id, lang), entries });
    }
  }
  const rest = ENGINE_DOC_INDEX.filter((e) => !used.has(e.slug));
  if (rest.length) {
    groups.push({
      id: 'outros',
      title: docHubTitle('outros', lang),
      entries: rest.sort((a, b) => a.title.localeCompare(b.title)),
    });
  }
  return groups;
}

/** Drop pictographs from titles and migrated markdown. */
export function stripEmoji(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u200d\uFE0F]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const ASCII_BOX =
  /[╔╗╚╝║═╠╣╬╞╡╟╢╤╧╥╨╪┘┌┴┬├─┼╒╕╓╖╘╛╭╮╰╯]/;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripBoxLine(line: string): string {
  return line
    .replace(/^[\s╔╗╚╝║═╠╣╬╞╡╟╢╤╧╥╨╪┘┌┴┬├─┼╒╕╓╖╘╛╭╮╰╯]+/u, '')
    .replace(/[\s╔╗╚╝║═╠╣╬╞╡╟╢╤╧╥╨╪┘┌┴┬├─┼╒╕╓╖╘╛╭╮╰╯]+$/u, '')
    .trim();
}

const CALLOUT_LABELS: Record<Language, { rule: string; note: string }> = {
  pt: { rule: 'Regra', note: 'Nota' },
  en: { rule: 'Rule', note: 'Note' },
  es: { rule: 'Regla', note: 'Nota' },
};

/** Turn legacy ASCII “card” blocks into styled callouts. */
export function transformAsciiCallouts(html: string, lang: Language = 'pt'): string {
  const labels = CALLOUT_LABELS[lang];
  return html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (block: string, inner: string) => {
    if (!ASCII_BOX.test(inner)) return block;
    const lines = inner
      .split('\n')
      .map(stripBoxLine)
      .filter((line: string) => line.length > 0 && !/^═+$/u.test(line));
    if (!lines.length) return block;

    const isRule = lines.some((l: string) => /^(REGRA|RULE|REGLA)\s*:/i.test(l));
    const label = isRule ? labels.rule : labels.note;
    const body = lines
      .map((line: string) => {
        const m = line.match(/^(REGRA|RULE|REGLA)\s*:\s*(.*)$/i);
        let text = m ? m[2] : line;
        if (lang === 'en') {
          text = text
            .replace(
              /hot paths da engine usam Custom Allocators/i,
              'engine hot paths use custom allocators',
            )
            .replace(
              /Toda alocação de sistema deve aceitar IAllocator\*/i,
              'Every subsystem allocation must accept an IAllocator*',
            );
        }
        if (lang === 'es') {
          text = text
            .replace(
              /hot paths da engine usam Custom Allocators/i,
              'los hot paths del motor usan allocators personalizados',
            )
            .replace(
              /Toda alocação de sistema deve aceitar IAllocator\*/i,
              'Toda asignación del sistema debe aceptar IAllocator*',
            );
        }
        return `<p>${escapeHtml(text)}</p>`;
      })
      .join('');
    return `<aside class="doc-callout doc-callout--${isRule ? 'rule' : 'note'}"><p class="doc-callout__label">${label}</p>${body}</aside>`;
  });
}

function cleanCodeBlock(inner: string): string {
  return inner
    .replace(/^[\t ]*\/\/[\t ]*=+[^\n]*\n/gm, '')
    .replace(/^[\t ]*\/\/[\t ]*-{3,}[^\n]*\n/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanCodeBlocks(html: string): string {
  return html.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (block, attrs, inner) => {
    if (ASCII_BOX.test(inner)) return block;
    const cleaned = cleanCodeBlock(inner);
    let nextAttrs = attrs as string;
    if (
      !/class=/i.test(nextAttrs) &&
      /(?:namespace\s+Caffeine|class\s+IAllocator|virtual\s+void)/.test(cleaned)
    ) {
      nextAttrs = ' class="language-cpp"';
    }
    return `<pre><code${nextAttrs}>${cleaned}</code></pre>`;
  });
}

/** Normalize migrated HTML for the in-app docs viewer. */
export function prepareDocHtml(raw: string, lang: Language = 'pt'): string {
  let html = stripEmoji(raw);
  html = transformAsciiCallouts(html, lang);
  html = cleanCodeBlocks(html);
  return html;
}

const htmlLoaders = import.meta.glob(
  ['../../../../content/html/**/*.html', '../../../../content/i18n/**/*.html'],
  { query: '?raw', import: 'default' },
) as Record<string, () => Promise<string>>;

const htmlByKey = new Map<string, () => Promise<string>>();
for (const [file, loader] of Object.entries(htmlLoaders)) {
  const i18n = file.match(/\/content\/i18n\/(en|es)\/(.+)\.html$/);
  if (i18n) {
    htmlByKey.set(`${i18n[1]}/${i18n[2]}`, loader);
    continue;
  }
  const base = file.match(/\/content\/html\/(.+)\.html$/);
  if (base) htmlByKey.set(base[1], loader);
}

/** Load one page. en/es fall back to the Portuguese source when no translation exists. */
export function loadDocHtml(slug: string, lang: 'pt' | 'en' | 'es' = 'pt'): Promise<string> {
  const localized = lang === 'pt' ? undefined : htmlByKey.get(`${lang}/${slug}`);
  const loader = localized ?? htmlByKey.get(slug);
  if (!loader) return Promise.reject(new Error(`missing ${slug}`));
  return loader();
}

export function hasDocTranslation(slug: string, lang: 'pt' | 'en' | 'es'): boolean {
  if (lang === 'pt') return htmlByKey.has(slug);
  return htmlByKey.has(`${lang}/${slug}`);
}

export const DEFAULT_DOC_SLUG = 'docs/README';

export function resolveDocSlug(initial?: string): string {
  if (!initial) return DEFAULT_DOC_SLUG;
  if (initial.includes('/')) return initial;
  const byEnd = ENGINE_DOC_INDEX.find((e) => e.slug.endsWith(`/${initial}`) || e.path === `${initial}.md`);
  return byEnd?.slug ?? DEFAULT_DOC_SLUG;
}

export function searchEngineDocs(query: string, limit = 40): EngineDocEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ENGINE_DOC_INDEX.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.slug.toLowerCase().includes(q) ||
      e.path.toLowerCase().includes(q),
  ).slice(0, limit);
}
