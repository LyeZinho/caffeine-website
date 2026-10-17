import React, { useState } from 'react';
import {
  ArrowRight,
  Terminal,
  Check,
  Copy,
  BookOpen
} from 'lucide-react';
import { ViewTab, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HeroSectionProps {
  onNavigateTab: (tab: ViewTab, targetId?: string) => void;
  onOpenSearch: () => void;
  currentLanguage?: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateTab,
  onOpenSearch,
  currentLanguage = 'pt'
}) => {
  const [copiedCli, setCopiedCli] = useState(false);
  const cliCommand = 'curl -fsSL https://get.caffeine.dev | sh';
  const t = TRANSLATIONS[currentLanguage].hero;

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero Grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Main Proposition (7 cols) */}
          <div className="flex flex-col justify-between border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-[2px_2px_0px_0px_var(--border-bold)] lg:col-span-7">
            <div>
              <div className="flex items-center gap-2 font-mono-code text-xs text-[var(--accent-punch)] font-bold">
                <span>{t.coreLabel}</span>
                <span className="text-[var(--text-muted)]">/</span>
                <span>{t.ideLabel}</span>
              </div>

              <h1 className="mt-4 font-display text-3xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-[var(--text-primary)]">
                {t.titlePrimary} <br />
                <span className="text-[var(--accent-punch)]">{t.titleHighlight}</span>
              </h1>

              <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                {t.description}
              </p>

              {/* Install CLI Command */}
              <div className="mt-6 border border-[var(--border-main)] bg-[var(--code-bg)] p-2.5">
                <div className="flex items-center justify-between gap-2 font-mono-code text-xs">
                  <div className="flex items-center gap-2 overflow-x-auto text-[var(--text-primary)]">
                    <Terminal className="h-4 w-4 shrink-0 text-[var(--accent-punch)]" />
                    <span className="select-none text-[var(--text-muted)]">$</span>
                    <span className="font-medium whitespace-nowrap">{cliCommand}</span>
                  </div>
                  <button
                    onClick={handleCopyCli}
                    className="flex shrink-0 items-center gap-1.5 border border-[var(--border-main)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-punch)] hover:text-[var(--text-primary)]"
                  >
                    {copiedCli ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--border-main)] pt-5">
              <button
                onClick={() => onNavigateTab('tutorials')}
                className="flex items-center gap-2 border border-[var(--accent-punch)] bg-[var(--accent-punch)] px-5 py-2.5 font-mono-code text-xs font-bold text-white transition-opacity hover:opacity-90 active:translate-y-0.5"
              >
                <span>{t.tutorialsBtn}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onNavigateTab('docs')}
                className="flex items-center gap-2 border border-[var(--border-main)] bg-[var(--bg-card)] px-5 py-2.5 font-mono-code text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-punch)]"
              >
                <BookOpen className="h-3.5 w-3.5 text-[var(--accent-crema)]" />
                <span>{t.docsBtn}</span>
              </button>

              <button
                onClick={onOpenSearch}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 font-mono-code text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <span>{t.searchPrompt}</span>
              </button>
            </div>
          </div>

          {/* Right Visual (5 cols) */}
          <div className="flex flex-col justify-between border border-[var(--border-main)] bg-[var(--bg-surface)] p-4 shadow-[2px_2px_0px_0px_var(--border-bold)] lg:col-span-5">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2 font-mono-code text-xs text-[var(--text-muted)]">
              <span>{t.runtimePreview}</span>
              <span>{t.runtimeVersion}</span>
            </div>

            <div className="my-3 overflow-hidden border border-[var(--border-main)]">
              <img
                src="/images/hero_caffeine_engine_1792062383478.jpg"
                alt="Caffeine Engine Runtime"
                referrerPolicy="no-referrer"
                className="h-64 sm:h-72 w-full object-cover"
              />
            </div>

            <div className="border-t border-[var(--border-main)] pt-2 text-center font-mono-code text-[11px] text-[var(--text-muted)]">
              {t.runtimeCaption}
            </div>
          </div>
        </div>

        {/* Performance Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border border-[var(--border-main)] bg-[var(--bg-surface)] p-5 shadow-[2px_2px_0px_0px_var(--border-bold)] sm:grid-cols-4">
          <div className="border-r border-[var(--border-main)]/60 pr-4 last:border-r-0">
            <div className="font-display text-2xl sm:text-3xl font-black text-[var(--accent-punch)] tabular-nums">
              {t.kpi1}
            </div>
            <div className="mt-1 font-mono-code text-xs text-[var(--text-secondary)]">
              {t.kpi1Label}
            </div>
          </div>

          <div className="border-r border-[var(--border-main)]/60 pr-4 last:border-r-0">
            <div className="font-display text-2xl sm:text-3xl font-black text-[var(--accent-crema)] tabular-nums">
              {t.kpi2}
            </div>
            <div className="mt-1 font-mono-code text-xs text-[var(--text-secondary)]">
              {t.kpi2Label}
            </div>
          </div>

          <div className="border-r border-[var(--border-main)]/60 pr-4 last:border-r-0">
            <div className="font-display text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
              {t.kpi3}
            </div>
            <div className="mt-1 font-mono-code text-xs text-[var(--text-secondary)]">
              {t.kpi3Label}
            </div>
          </div>

          <div>
            <div className="font-display text-2xl sm:text-3xl font-black text-sky-400 tabular-nums">
              {t.kpi4}
            </div>
            <div className="mt-1 font-mono-code text-xs text-[var(--text-secondary)]">
              {t.kpi4Label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
