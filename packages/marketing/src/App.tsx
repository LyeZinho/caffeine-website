import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Layers,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { ThemeId, ViewTab, Language } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DocumentationView } from './components/DocumentationView';
import { InteractiveTutorialsView } from './components/InteractiveTutorialsView';
import { BlogView } from './components/BlogView';
import { DoppioShowcase } from './components/DoppioShowcase';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { getBlogPosts } from './data/blogData';
import { TRANSLATIONS } from './i18n/translations';
import { htmlLangAttribute, readStoredLanguage, storeLanguage } from './i18n/language';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('espresso');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => readStoredLanguage());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [targetedDocId, setTargetedDocId] = useState<string | undefined>();
  const [targetedTutorialId, setTargetedTutorialId] = useState<string | undefined>();
  const [targetedPostId, setTargetedPostId] = useState<string | undefined>();

  // Translation helpers
  const t = TRANSLATIONS[currentLanguage].home;
  const recentPosts = getBlogPosts(currentLanguage).slice(0, 2);

  // Sync theme attribute to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Sync lang attribute to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('lang', htmlLangAttribute(currentLanguage));
  }, [currentLanguage]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    storeLanguage(lang);
  };

  // Global keyboard shortcut for predictive search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: ViewTab, targetId?: string) => {
    setActiveTab(tab);
    if (tab === 'docs') setTargetedDocId(targetId);
    if (tab === 'tutorials') setTargetedTutorialId(targetId);
    if (tab === 'blog') setTargetedPostId(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-[var(--accent-punch)] selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content Area */}
      <main id="main-content">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onNavigateTab={handleNavigate}
              onOpenSearch={() => setIsSearchOpen(true)}
              currentLanguage={currentLanguage}
            />

            {/* Section 1: The Engine Architecture (Core vs Doppio IDE) */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 border-b border-[var(--border-main)] pb-4">
                <h2 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                  {t.archTitle}
                </h2>
                <p className="mt-2 font-sans text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
                  {t.archDesc}
                </p>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                {/* Card 1: Caffeine ECS (Col 7) */}
                <div className="flex flex-col justify-between border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[2px_2px_0px_0px_var(--border-bold)] md:col-span-7">
                  <div>
                    <div className="flex items-center gap-2 font-mono-code text-xs font-bold text-[var(--accent-punch)]">
                      <Terminal className="h-4 w-4" />
                      <span>{t.coreBadge}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                      {t.coreTitle}
                    </h3>
                    <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                      {t.coreDesc}
                    </p>

                    <div className="mt-5 space-y-2 font-sans text-xs sm:text-sm text-[var(--text-primary)]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent-punch)] shrink-0" />
                        <span>{t.corePoint1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent-punch)] shrink-0" />
                        <span>{t.corePoint2}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent-punch)] shrink-0" />
                        <span>{t.corePoint3}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-main)]">
                    <button
                      onClick={() => handleNavigate('docs', 'docs/ecs/core')}
                      className="flex items-center gap-2 font-mono-code text-xs font-bold text-[var(--accent-punch)] hover:underline"
                    >
                      <span>{t.coreLink}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 2: Doppio Visual IDE (Col 5) */}
                <div className="flex flex-col justify-between border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[2px_2px_0px_0px_var(--border-bold)] md:col-span-5">
                  <div>
                    <div className="flex items-center gap-2 font-mono-code text-xs font-bold text-[var(--accent-crema)]">
                      <Layers className="h-4 w-4" />
                      <span>{t.ideBadge}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                      {t.ideTitle}
                    </h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
                      {t.ideDesc}
                    </p>

                    {/* Doppio IDE Thumbnail */}
                    <div className="mt-4 overflow-hidden border border-[var(--border-main)]">
                      <img
                        src="/images/doppio_ide_preview_1792062384957.jpg"
                        alt="Doppio IDE Interface"
                        referrerPolicy="no-referrer"
                        className="h-36 w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-main)]">
                    <button
                      onClick={() => handleNavigate('doppio')}
                      className="flex items-center gap-2 font-mono-code text-xs font-bold text-[var(--accent-crema)] hover:underline"
                    >
                      <span>{t.ideLink}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Interactive Tutorial Teaser */}
            <section className="border-y border-[var(--border-main)] bg-[var(--bg-subtle)]/40 py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                      {t.tutTitle}
                    </h2>
                    <p className="mt-1 font-sans text-sm text-[var(--text-secondary)]">
                      {t.tutDesc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('tutorials')}
                    className="flex items-center gap-2 border border-[var(--accent-punch)] bg-[var(--accent-punch)] px-4 py-2 font-mono-code text-xs font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <span>{t.openSimBtn}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 3 Tutorial Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div
                    onClick={() => handleNavigate('tutorials', 'tutorial-ecs-quickstart')}
                    className="group cursor-pointer border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)] transition-all hover:border-[var(--accent-punch)]"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="font-bold text-[var(--accent-punch)]">{t.tutCard1Badge}</span>
                      <span className="text-[var(--text-muted)]">{t.tutCard1Time}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-punch)]">
                      {t.tutCard1Title}
                    </h3>
                    <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                      {t.tutCard1Desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 font-mono-code text-xs font-bold text-[var(--accent-punch)]">
                      <span>{t.tutCard1Btn}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div
                    onClick={() => handleNavigate('tutorials', 'tutorial-doppio-physics')}
                    className="group cursor-pointer border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)] transition-all hover:border-[var(--accent-punch)]"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="font-bold text-[var(--accent-crema)]">{t.tutCard2Badge}</span>
                      <span className="text-[var(--text-muted)]">{t.tutCard2Time}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-punch)]">
                      {t.tutCard2Title}
                    </h3>
                    <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                      {t.tutCard2Desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 font-mono-code text-xs font-bold text-[var(--accent-crema)]">
                      <span>{t.tutCard2Btn}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div
                    onClick={() => handleNavigate('tutorials', 'tutorial-doppio-node-graph')}
                    className="group cursor-pointer border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)] transition-all hover:border-[var(--accent-punch)]"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="font-bold text-sky-400">{t.tutCard3Badge}</span>
                      <span className="text-[var(--text-muted)]">{t.tutCard3Time}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-punch)]">
                      {t.tutCard3Title}
                    </h3>
                    <p className="mt-2 font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                      {t.tutCard3Desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 font-mono-code text-xs font-bold text-sky-400">
                      <span>{t.tutCard3Btn}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Devlog & Engineering Insights Teaser */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-4 mb-8">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                    {t.devlogTitle}
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate('blog')}
                  className="hidden sm:flex items-center gap-1.5 font-mono-code text-xs font-bold text-[var(--accent-punch)] hover:underline"
                >
                  <span>{t.viewAllPosts}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleNavigate('blog', post.id)}
                    className="group cursor-pointer border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)] transition-all hover:border-[var(--accent-punch)]"
                  >
                    {/* Clean unboxed metadata */}
                    <div className="flex items-center gap-2 font-mono-code text-xs text-[var(--text-muted)]">
                      <span className="font-bold text-[var(--accent-punch)]">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-punch)]">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 font-sans text-xs sm:text-sm text-[var(--text-secondary)]">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--border-main)] pt-3 text-xs font-mono-code">
                      <span className="text-[var(--text-muted)]">{post.author.name}</span>
                      <span className="font-bold text-[var(--accent-punch)]">{t.readPost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Callout */}
            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
              <div className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-8 sm:p-12 shadow-[2px_2px_0px_0px_var(--border-bold)] text-center">
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[var(--text-primary)]">
                  {t.bottomCtaTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-xl font-sans text-sm sm:text-base text-[var(--text-secondary)]">
                  {t.bottomCtaDesc}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => handleNavigate('docs')}
                    className="border border-[var(--accent-punch)] bg-[var(--accent-punch)] px-6 py-2.5 font-mono-code text-xs font-bold text-white transition-opacity hover:opacity-90"
                  >
                    {t.bottomCtaDocs}
                  </button>
                  <button
                    onClick={() => handleNavigate('tutorials')}
                    className="border border-[var(--border-main)] bg-[var(--bg-card)] px-6 py-2.5 font-mono-code text-xs font-bold text-[var(--text-primary)] hover:border-[var(--accent-punch)]"
                  >
                    {t.bottomCtaTut}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'docs' && (
          <DocumentationView
            initialDocId={targetedDocId}
            onNavigateToTutorial={(tutId) => handleNavigate('tutorials', tutId)}
            currentLanguage={currentLanguage}
          />
        )}

        {/* View: Interactive Tutorials */}
        {activeTab === 'tutorials' && (
          <InteractiveTutorialsView
            initialTutorialId={targetedTutorialId}
            currentLanguage={currentLanguage}
          />
        )}

        {/* View: Blog & Devlog */}
        {activeTab === 'blog' && (
          <BlogView
            initialPostId={targetedPostId}
            currentLanguage={currentLanguage}
          />
        )}

        {/* View: Doppio IDE Showcase */}
        {activeTab === 'doppio' && (
          <DoppioShowcase
            onNavigateTab={handleNavigate}
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Global Predictive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        currentLanguage={currentLanguage}
      />

      {/* Footer */}
      <Footer
        onSelectTab={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
