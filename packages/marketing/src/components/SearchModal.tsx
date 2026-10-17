import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, BookOpen, Newspaper, Code2, Sparkles } from 'lucide-react';
import { ENGINE_DOC_INDEX } from '../data/engineDocs';
import { getBlogPosts } from '../data/blogData';
import { getInteractiveTutorials } from '../data/tutorialsData';
import { ViewTab, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

export interface SearchResultItem {
  id: string;
  type: 'doc' | 'tutorial' | 'blog' | 'api';
  title: string;
  category: string;
  snippet: string;
  targetView: ViewTab;
  targetId: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewTab, targetId?: string) => void;
  currentLanguage?: Language;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentLanguage = 'pt'
}) => {
  const t = TRANSLATIONS[currentLanguage].search;

  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'doc' | 'tutorial' | 'blog' | 'api'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Construct comprehensive search index based on current language
  const index = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    ENGINE_DOC_INDEX.forEach((doc) => {
      items.push({
        id: `doc-${doc.slug}`,
        type: 'doc',
        title: doc.title,
        category: doc.source,
        snippet: doc.path,
        targetView: 'docs',
        targetId: doc.slug,
      });
    });

    // Tutorials
    const tutorials = getInteractiveTutorials(currentLanguage);
    tutorials.forEach((tut) => {
      items.push({
        id: `tut-${tut.id}`,
        type: 'tutorial',
        title: tut.title,
        category: `Tutorial · ${tut.difficulty}`,
        snippet: tut.subtitle,
        targetView: 'tutorials',
        targetId: tut.id
      });
    });

    // Blog
    const blogPosts = getBlogPosts(currentLanguage);
    blogPosts.forEach((post) => {
      items.push({
        id: `blog-${post.id}`,
        type: 'blog',
        title: post.title,
        category: `Blog · ${post.category}`,
        snippet: post.excerpt,
        targetView: 'blog',
        targetId: post.id
      });
    });

    return items;
  }, [currentLanguage]);

  // Predictive search scoring
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    let pool = index;

    if (selectedFilter !== 'all') {
      pool = pool.filter((item) => item.type === selectedFilter);
    }

    if (!q) {
      // Default recommended / popular items
      return pool.slice(0, 7);
    }

    // Score based on title match, category match, and snippet match
    return pool
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const snippetLower = item.snippet.toLowerCase();
        const catLower = item.category.toLowerCase();

        let score = 0;
        if (titleLower.startsWith(q)) score += 100;
        else if (titleLower.includes(q)) score += 50;

        if (catLower.includes(q)) score += 25;
        if (snippetLower.includes(q)) score += 10;

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [query, selectedFilter, index]);

  // Handle arrow keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        const chosen = filteredResults[selectedIndex];
        onNavigate(chosen.targetView, chosen.targetId);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'doc':
        return <BookOpen className="h-4 w-4 text-[var(--accent-punch)]" />;
      case 'tutorial':
        return <Sparkles className="h-4 w-4 text-[var(--accent-crema)]" />;
      case 'blog':
        return <Newspaper className="h-4 w-4 text-emerald-400" />;
      case 'api':
        return <Code2 className="h-4 w-4 text-sky-400" />;
    }
  };

  const filterTabs = [
    { id: 'all' as const, label: t.all },
    { id: 'doc' as const, label: t.docs },
    { id: 'tutorial' as const, label: t.tutorials },
    { id: 'api' as const, label: t.apis },
    { id: 'blog' as const, label: t.blog }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-16 backdrop-blur-xs md:pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-0 text-left shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input */}
        <div className="flex items-center gap-3 border-b border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-3">
          <Search className="h-5 w-5 text-[var(--accent-punch)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t.placeholder}
            className="w-full bg-transparent font-sans text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="hidden rounded-none border border-[var(--border-main)] bg-[var(--bg-canvas)] px-1.5 py-0.5 font-mono-code text-[10px] text-[var(--text-muted)] sm:inline">
              ESC
            </span>
          )}
        </div>

        {/* Filter Bar (Zero-pill interactive buttons) */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border-main)] bg-[var(--bg-canvas)] px-3 py-1.5">
          {filterTabs.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setSelectedFilter(filter.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 font-mono-code text-xs transition-colors ${
                selectedFilter === filter.id
                  ? 'border border-[var(--accent-punch)] bg-[var(--accent-punch)] font-bold text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {filter.label}
            </button>
          ))}
          <span className="ml-auto font-mono-code text-[11px] text-[var(--text-muted)]">
            {filteredResults.length} {t.resultsCount}
          </span>
        </div>

        {/* Predictive Result List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto divide-y divide-[var(--border-main)]/60 p-1"
        >
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-display text-base font-bold text-[var(--text-primary)]">
                {t.noResults} "{query}"
              </p>
              <p className="mt-1 font-sans text-xs text-[var(--text-muted)]">
                {t.noResultsTip}
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.targetView, item.targetId);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex cursor-pointer items-start justify-between gap-3 p-3 transition-colors ${
                    isSelected
                      ? 'border-2 border-[var(--accent-punch)] bg-[var(--bg-subtle)]'
                      : 'border-2 border-transparent hover:bg-[var(--bg-subtle)]/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{getTypeIcon(item.type)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-[var(--text-primary)]">
                          {item.title}
                        </span>
                        <span className="font-mono-code text-[10px] text-[var(--text-muted)]">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 font-sans text-xs text-[var(--text-secondary)]">
                        {item.snippet}
                      </p>
                    </div>
                  </div>
                  <div className="mt-1 shrink-0">
                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${
                        isSelected ? 'translate-x-1 text-[var(--accent-punch)]' : 'text-[var(--text-muted)]'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[var(--border-main)] bg-[var(--bg-subtle)] px-4 py-2 font-mono-code text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span>↑↓ {t.shortcuts.split('/')[0]?.trim() || 'navegar'}</span>
            <span>↵ {t.shortcuts.split('/')[1]?.trim() || 'selecionar'}</span>
            <span>ESC {t.shortcuts.split('/')[2]?.trim() || 'fechar'}</span>
          </div>
          <span>{t.globalSearch}</span>
        </div>
      </div>
    </div>
  );
};
