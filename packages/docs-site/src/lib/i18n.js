const MESSAGES = {
  pt: {
    site: 'Site',
    docs: 'Documentação',
    pdf: 'PDF / TeX',
    tutorials: 'Tutoriais',
    topics: 'Tópicos',
    search: 'Pesquisar na documentação…',
  },
  en: {
    site: 'Site',
    docs: 'Documentation',
    pdf: 'PDF / TeX',
    tutorials: 'Tutorials',
    topics: 'Topics',
    search: 'Search documentation…',
  },
  es: {
    site: 'Sitio',
    docs: 'Documentación',
    pdf: 'PDF / TeX',
    tutorials: 'Tutoriales',
    topics: 'Temas',
    search: 'Buscar en la documentación…',
  },
};

/** @param {string | null | undefined} lang */
export function t(lang, key) {
  const code = lang === 'en' || lang === 'es' ? lang : 'pt';
  return MESSAGES[code][key] ?? MESSAGES.en[key];
}

export function readLangFromStorage() {
  try {
    const v = localStorage.getItem('caffeine-site-language');
    if (v === 'en' || v === 'es' || v === 'pt') return v;
  } catch {
    /* ignore */
  }
  return 'pt';
}
