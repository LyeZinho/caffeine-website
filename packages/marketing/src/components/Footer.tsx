import React from 'react';
import { Flame } from 'lucide-react';
import { ViewTab, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FooterProps {
  onSelectTab: (tab: ViewTab, targetId?: string) => void;
  onOpenSearch: () => void;
  currentLanguage?: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenSearch,
  currentLanguage = 'pt'
}) => {
  const t = TRANSLATIONS[currentLanguage].footer;
  const navT = TRANSLATIONS[currentLanguage].nav;

  return (
    <footer className="mt-20 border-t border-[var(--border-main)] bg-[var(--bg-canvas)] py-12 text-xs font-mono-code text-[var(--text-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center bg-[var(--accent-punch)] font-bold text-white">
                <Flame className="h-3.5 w-3.5" />
              </div>
              <span className="font-display text-base font-black uppercase text-[var(--text-primary)]">
                Caffeine Engine & Doppio IDE
              </span>
            </div>
            <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed max-w-sm">
              {t.desc}
            </p>
            <div className="text-[11px] text-[var(--text-muted)]">
              {t.versionInfo}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-bold uppercase text-[var(--text-primary)]">{t.docsCol}</span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('docs', 'docs/README')}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {t.doc1}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('docs', 'docs/README')}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {t.doc2}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('docs', 'docs/MASTER')}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {t.doc3}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('docs', 'docs/ECOSYSTEM_WORKFLOW')}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {t.doc4}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 space-y-2">
            <span className="font-bold uppercase text-[var(--text-primary)]">{t.resourcesCol}</span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('tutorials')}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {navT.tutorials}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('blog')}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {navT.blog}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('doppio')}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {navT.doppio}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSearch}
                  className="hover:text-[var(--accent-punch)] transition-colors text-left"
                >
                  {navT.search} (⌘K)
                </button>
              </li>
            </ul>
          </div>

          {/* CLI & Community */}
          <div className="md:col-span-2 space-y-2">
            <span className="font-bold uppercase text-[var(--text-primary)]">{t.communityCol}</span>
            <div className="space-y-1 text-xs">
              <div>GitHub /caffeine-engine</div>
              <div>Discord Community</div>
              <div>X @caffeinedev</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-main)] pt-6 sm:flex-row">
          <p className="text-[11px] text-[var(--text-muted)]">
            {t.rights}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)]">
            <span>{t.privacy}</span>
            <span>{t.terms}</span>
            <span>{t.license}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
