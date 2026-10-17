/** @param {string} slug e.g. docs/ecs/core */
export function docHref(slug, base = '') {
  const path = `/${slug}`.replace(/\/+/g, '/');
  if (!base) return `/docs${path}`;
  return `${base}${path}`.replace(/\/+/g, '/');
}
