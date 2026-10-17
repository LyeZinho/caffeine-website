import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  ENGINE_DOC_INDEX,
  sourceLabel,
  groupedByHub,
  resolveDocSlug,
  searchEngineDocs,
  loadDocHtml,
  prepareDocHtml,
  hasDocTranslation,
  stripEmoji,
  type EngineDocEntry,
} from '../data/engineDocs';

interface DocumentationViewProps {
  initialDocId?: string;
  onNavigateToTutorial?: (tutorialId?: string) => void;
  currentLanguage?: Language;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({
  initialDocId,
  currentLanguage = 'pt',
}) => {
  const t = TRANSLATIONS[currentLanguage].docs;
  const hubGroups = useMemo(() => groupedByHub(currentLanguage), [currentLanguage]);

  const [selectedSlug, setSelectedSlug] = useState(() => resolveDocSlug(initialDocId));
  const [docsSearch, setDocsSearch] = useState('');
  const [html, setHtml] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (initialDocId) setSelectedSlug(resolveDocSlug(initialDocId));
  }, [initialDocId]);

  useEffect(() => {
    let cancelled = false;
    setLoadError('');
    loadDocHtml(selectedSlug, currentLanguage)
      .then((raw) => {
        if (!cancelled) setHtml(prepareDocHtml(raw, currentLanguage));
      })
      .catch(() => {
        if (!cancelled) {
          setHtml('');
          setLoadError(t.loadError);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSlug, currentLanguage, t.loadError]);

  const activeDoc = useMemo(
    () => ENGINE_DOC_INDEX.find((d) => d.slug === selectedSlug) ?? ENGINE_DOC_INDEX[0],
    [selectedSlug],
  );

  const filteredDocs = useMemo(() => searchEngineDocs(docsSearch, 40), [docsSearch]);

  const openHubId = useMemo(() => {
    const hit = hubGroups.find((g) => g.entries.some((e) => e.slug === selectedSlug));
    return hit?.id ?? hubGroups[0]?.id;
  }, [hubGroups, selectedSlug]);

  function onArticleClick(event: React.MouseEvent<HTMLElement>) {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href') ?? '';
    if (!href.startsWith('/docs/')) return;
    event.preventDefault();
    const slug = href.replace(/^\/docs\//, '').split(/[?#]/)[0];
    if (ENGINE_DOC_INDEX.some((e) => e.slug === slug)) setSelectedSlug(slug);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {t.title}
            </h1>
            <p className="mt-1 font-sans text-xs sm:text-sm text-[var(--text-secondary)]">
              {t.subtitle}
            </p>
            <p className="mt-1 font-mono-code text-[11px] text-[var(--text-muted)]">
              {stripEmoji(activeDoc.title)} · {sourceLabel(activeDoc.source, currentLanguage)}
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--accent-punch)]" />
            <input
              type="text"
              value={docsSearch}
              onChange={(e) => setDocsSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full border border-[var(--border-main)] bg-[var(--bg-canvas)] py-2 pl-9 pr-4 font-mono-code text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-punch)] focus:outline-none"
            />
            {docsSearch && (
              <button
                type="button"
                onClick={() => setDocsSearch('')}
                className="absolute right-3 top-2 font-mono-code text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {t.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24 border border-[var(--border-main)] bg-[var(--bg-surface)] p-3 shadow-[2px_2px_0px_0px_var(--border-bold)]">
            <div className="mb-2 flex items-center justify-between border-b border-[var(--border-main)] pb-2 px-1">
              <span className="font-mono-code text-xs font-bold text-[var(--text-primary)]">
                {t.topics}
              </span>
              <span className="font-mono-code text-[11px] text-[var(--text-muted)]">
                {docsSearch ? filteredDocs.length : ENGINE_DOC_INDEX.length} {t.pagesCount}
              </span>
            </div>

            <nav className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {docsSearch ? (
                <DocNavList
                  entries={filteredDocs}
                  selectedSlug={selectedSlug}
                  onSelect={setSelectedSlug}
                />
              ) : (
                hubGroups.map((hub) => (
                  <details key={hub.id} open={hub.id === openHubId} className="border-b border-[var(--border-main)]">
                    <summary className="cursor-pointer list-none px-2 py-2 font-mono-code text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      {hub.title}
                      <span className="ml-1 opacity-60">({hub.entries.length})</span>
                    </summary>
                    <DocNavList
                      entries={hub.entries}
                      selectedSlug={selectedSlug}
                      onSelect={setSelectedSlug}
                    />
                  </details>
                ))
              )}
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-8 xl:col-span-9">
          {currentLanguage !== 'pt' && (
            <p className="mb-3 border border-[var(--border-main)] bg-[var(--bg-subtle)] px-3 py-2 font-sans text-[11px] leading-relaxed text-[var(--text-muted)]">
              {hasDocTranslation(selectedSlug, currentLanguage) ? t.translatedNotice : t.contentNotice}
            </p>
          )}
          <article
            className="min-h-[32rem] border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[2px_2px_0px_0px_var(--border-bold)]"
            onClick={onArticleClick}
          >
            {loadError ? (
              <p className="font-sans text-sm text-[var(--text-secondary)]">{loadError}</p>
            ) : (
              <div className="doc-prose" dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </article>
        </main>
      </div>
    </div>
  );
};

function DocNavList({
  entries,
  selectedSlug,
  onSelect,
}: {
  entries: EngineDocEntry[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="pb-2">
      {entries.map((doc) => {
        const isSelected = selectedSlug === doc.slug;
        return (
          <button
            key={doc.slug}
            type="button"
            onClick={() => onSelect(doc.slug)}
            className={`block w-full truncate px-2.5 py-1 text-left font-sans text-xs transition-colors ${
              isSelected
                ? 'border-l-2 border-[var(--accent-punch)] bg-[var(--bg-subtle)] font-bold text-[var(--text-primary)]'
                : 'border-l-2 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]/50 hover:text-[var(--text-primary)]'
            }`}
          >
            {stripEmoji(doc.title)}
          </button>
        );
      })}
    </div>
  );
}
