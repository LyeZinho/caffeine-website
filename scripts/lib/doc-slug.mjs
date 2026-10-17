import path from 'node:path';

/**
 * Resolve a Markdown href to a site slug (e.g. docs/ecs/core).
 * @param {string} href
 * @param {string} sourceLabel docs | planning | engine
 * @param {string} relPath posix path of the source file relative to import root
 * @returns {string | null}
 */
export function resolveMdHref(href, sourceLabel, relPath) {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
    return null;
  }
  const hashIdx = href.indexOf('#');
  const file = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  if (!file.toLowerCase().endsWith('.md')) return null;

  const docDir = path.posix.dirname(relPath.replace(/\\/g, '/'));
  let rel = file;
  if (!rel.startsWith('/')) {
    if (
      (sourceLabel === 'docs' && rel.startsWith('docs/')) ||
      (sourceLabel === 'planning' && rel.startsWith('planning/'))
    ) {
      rel = rel.replace(/^\//, '');
    } else {
      rel = path.posix.normalize(path.posix.join(docDir, rel));
    }
  } else {
    rel = rel.replace(/^\//, '');
  }
  rel = rel.replace(/\.md$/i, '');

  const docsIdx = rel.indexOf('docs/');
  if (docsIdx >= 0) rel = rel.slice(docsIdx);
  const planningIdx = rel.indexOf('planning/');
  if (planningIdx >= 0) rel = rel.slice(planningIdx);

  if (rel.startsWith('docs/') || rel.startsWith('planning/') || rel.startsWith('engine/')) {
    return rel;
  }
  return `${sourceLabel}/${rel}`;
}

/** @param {string} html */
export function extractDocSlugsFromHtml(html) {
  const slugs = new Set();
  const re = /href="\/docs\/([^"#?]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    slugs.add(m[1]);
  }
  return [...slugs];
}

/** @param {string} md */
export function extractMdLinkHrefs(md) {
  const hrefs = [];
  const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(md)) !== null) {
    hrefs.push(m[2].trim());
  }
  const backtickRe = /`([^`]+\.md)`/gi;
  while ((m = backtickRe.exec(md)) !== null) {
    hrefs.push(m[1].trim());
  }
  const bareRe = /(?:^|[\s,|])([a-zA-Z0-9_./-]+\.md)/gm;
  while ((m = bareRe.exec(md)) !== null) {
    const candidate = m[1];
    if (!candidate.includes('://')) hrefs.push(candidate);
  }
  return hrefs;
}
