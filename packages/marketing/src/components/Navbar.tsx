import React from 'react';
import { Search, Flame, Download } from 'lucide-react';
import { ViewTab, ThemeId, Language } from '../types';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenSearch: () => void;
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  currentTheme,
  onThemeChange,
  currentLanguage,
  onLanguageChange
}) => {
  const t = TRANSLATIONS[currentLanguage].nav;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-main)] bg-[var(--bg-canvas)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="group flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none"
        >
          <div className="flex h-7 w-7 items-center justify-center border border-[var(--border-main)] bg-[var(--accent-punch)] font-display font-bold text-white transition-opacity group-hover:opacity-90">
            <Flame className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-black tracking-tight text-[var(--text-primary)] uppercase">
              Caffeine <span className="text-[var(--accent-punch)]">·</span> Doppio
            </span>
          </div>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono-code font-semibold">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'home'
                ? 'border-[var(--accent-punch)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.overview}
          </button>
          <button
            onClick={() => onSelectTab('docs')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'docs'
                ? 'border-[var(--accent-punch)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.docs}
          </button>
          <button
            onClick={() => onSelectTab('tutorials')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'tutorials'
                ? 'border-[var(--accent-punch)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.tutorials}
          </button>
          <button
            onClick={() => onSelectTab('blog')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'blog'
                ? 'border-[var(--accent-punch)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.blog}
          </button>
          <button
            onClick={() => onSelectTab('doppio')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'doppio'
                ? 'border-[var(--accent-punch)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.doppio}
          </button>
        </nav>

        {/* Zone 3: Actions + Language & Theme selectors */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Predictive Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            aria-label={`${t.search} (Ctrl+K)`}
            className="flex items-center gap-2 border border-[var(--border-main)] bg-[var(--bg-surface)] px-2.5 py-1.5 font-mono-code text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-punch)] hover:text-[var(--text-primary)]"
          >
            <Search className="h-3.5 w-3.5 text-[var(--accent-punch)]" />
            <span className="hidden lg:inline">{t.search}</span>
            <kbd className="hidden rounded-none border border-[var(--border-main)] bg-[var(--bg-subtle)] px-1 text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Language Selector (PT / EN / ES) */}
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            menuTitle={TRANSLATIONS[currentLanguage].languageMenu.title}
          />

          {/* Coffee Theme Selector */}
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />

          {/* Primary Action Button */}
          <button
            onClick={() => onSelectTab('docs')}
            className="hidden sm:flex items-center gap-1.5 border border-[var(--accent-punch)] bg-[var(--accent-punch)] px-3.5 py-1.5 font-mono-code text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">{t.downloadCli}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav links */}
      <div className="flex md:hidden items-center justify-around border-t border-[var(--border-main)] bg-[var(--bg-surface)] px-2 py-1.5 text-xs font-mono-code">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-2 py-1 ${activeTab === 'home' ? 'font-bold text-[var(--accent-punch)]' : 'text-[var(--text-secondary)]'}`}
        >
          {t.home}
        </button>
        <button
          onClick={() => onSelectTab('docs')}
          className={`px-2 py-1 ${activeTab === 'docs' ? 'font-bold text-[var(--accent-punch)]' : 'text-[var(--text-secondary)]'}`}
        >
          {t.docs}
        </button>
        <button
          onClick={() => onSelectTab('tutorials')}
          className={`px-2 py-1 ${activeTab === 'tutorials' ? 'font-bold text-[var(--accent-punch)]' : 'text-[var(--text-secondary)]'}`}
        >
          {t.tutorials}
        </button>
        <button
          onClick={() => onSelectTab('blog')}
          className={`px-2 py-1 ${activeTab === 'blog' ? 'font-bold text-[var(--accent-punch)]' : 'text-[var(--text-secondary)]'}`}
        >
          {t.blog}
        </button>
        <button
          onClick={() => onSelectTab('doppio')}
          className={`px-2 py-1 ${activeTab === 'doppio' ? 'font-bold text-[var(--accent-punch)]' : 'text-[var(--text-secondary)]'}`}
        >
          {t.doppio}
        </button>
      </div>
    </header>
  );
};
