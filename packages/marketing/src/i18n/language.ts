import type { Language } from '../types';

const STORAGE_KEY = 'caffeine-site-language';

export function readStoredLanguage(): Language {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'pt' || v === 'en' || v === 'es') return v;
  } catch {
    /* private mode */
  }
  return 'pt';
}

export function storeLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function htmlLangAttribute(lang: Language): string {
  if (lang === 'pt') return 'pt-BR';
  return lang;
}
