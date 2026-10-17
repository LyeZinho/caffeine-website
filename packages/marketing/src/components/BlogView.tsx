import React, { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Clock, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { getBlogPosts } from '../data/blogData';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface BlogViewProps {
  initialPostId?: string;
  currentLanguage?: Language;
}

export const BlogView: React.FC<BlogViewProps> = ({
  initialPostId,
  currentLanguage = 'pt'
}) => {
  const t = TRANSLATIONS[currentLanguage].blog;
  const blogPosts = useMemo(() => getBlogPosts(currentLanguage), [currentLanguage]);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(initialPostId || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Release', 'Arquitetura', 'Shaders & Arte', 'Performance'];

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  });

  const activePost = blogPosts.find((p) => p.id === selectedPostId);

  // If viewing single article
  if (activePost) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => setSelectedPostId(null)}
          className="mb-6 flex items-center gap-2 border border-[var(--border-main)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono-code text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-punch)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backBtn}</span>
        </button>

        <article className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-[2px_2px_0px_0px_var(--border-bold)]">
          {/* Metadata banner */}
          <div className="flex flex-wrap items-center gap-3 font-mono-code text-xs text-[var(--text-muted)]">
            <span className="font-bold text-[var(--accent-punch)] uppercase">
              {activePost.category}
            </span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{activePost.date}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{activePost.readTime}</span>
            </div>
          </div>

          <h1 className="mt-4 font-display text-2xl sm:text-4xl font-black leading-tight text-[var(--text-primary)]">
            {activePost.title}
          </h1>

          <p className="mt-4 font-sans text-base sm:text-lg font-medium leading-relaxed text-[var(--text-secondary)]">
            {activePost.excerpt}
          </p>

          {/* Author Block */}
          <div className="my-6 flex items-center gap-3 border-y border-[var(--border-main)] py-4">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-[var(--border-bold)] bg-[var(--accent-punch)] font-display text-sm font-extrabold text-white">
              {activePost.author.avatar}
            </div>
            <div>
              <div className="font-display text-sm font-bold text-[var(--text-primary)]">
                {activePost.author.name}
              </div>
              <div className="font-mono-code text-xs text-[var(--text-muted)]">
                {activePost.author.role}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {activePost.coverImage && (
            <div className="my-8 overflow-hidden border border-[var(--border-main)] shadow-[2px_2px_0px_0px_var(--border-bold)]">
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                referrerPolicy="no-referrer"
                className="h-64 sm:h-96 w-full object-cover"
              />
            </div>
          )}

          {/* Key highlights box */}
          {activePost.keyHighlights && (
            <div className="my-6 border border-[var(--border-main)] bg-[var(--bg-subtle)] p-5">
              <div className="flex items-center gap-2 font-mono-code text-xs font-bold uppercase text-[var(--accent-crema)]">
                <Sparkles className="h-4 w-4" />
                <span>{t.highlightsTitle}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {activePost.keyHighlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 font-sans text-xs sm:text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-punch)]" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Body Prose */}
          <div className="space-y-6 font-sans text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">
            {activePost.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    );
  }

  // Articles list
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Blog Header */}
      <div className="mb-6 border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {t.title}
            </h1>
            <p className="mt-1 font-sans text-xs sm:text-sm text-[var(--text-secondary)]">
              {t.subtitle}
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`border px-3 py-1 font-mono-code text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'border-[var(--accent-punch)] bg-[var(--accent-punch)] text-white'
                    : 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat === 'all' ? t.allPosts : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPostId(post.id)}
            className="group flex cursor-pointer flex-col justify-between border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)] transition-all hover:border-[var(--accent-punch)]"
          >
            <div>
              {/* Optional card thumbnail */}
              {post.coverImage && (
                <div className="mb-4 h-44 overflow-hidden border border-[var(--border-main)]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Clean metadata (no pill enclosures) */}
              <div className="flex items-center gap-2 font-mono-code text-xs text-[var(--text-muted)]">
                <span className="font-bold text-[var(--accent-punch)]">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="mt-2 font-display text-lg sm:text-xl font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-punch)]">
                {post.title}
              </h2>

              <p className="mt-2 line-clamp-3 font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[var(--border-main)] pt-4">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--text-secondary)]">
                <span className="flex h-5 w-5 items-center justify-center bg-[var(--bg-subtle)] text-[10px] font-bold text-[var(--text-primary)]">
                  {post.author.avatar}
                </span>
                <span>{post.author.name}</span>
              </div>

              <span className="flex items-center gap-1 font-mono-code text-xs font-bold text-[var(--accent-punch)]">
                <span>{t.readArticle}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
