import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { ThemeId, ThemeConfig } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'espresso',
    name: 'Espresso Roast',
    tagline: 'Café escuro intenso + Vermilion Neon',
    accentColor: '#FF3E24',
    bgColor: '#0D0B0A',
    previewClass: 'bg-[#0D0B0A] text-[#FDFBF7] border-[#382D26]'
  },
  {
    id: 'doppio-volt',
    name: 'Doppio Volt',
    tagline: 'Preto puro + Crema dourado elétrico',
    accentColor: '#FACC15',
    bgColor: '#080706',
    previewClass: 'bg-[#080706] text-[#FFFDF5] border-[#4A3728]'
  },
  {
    id: 'paper-roast',
    name: 'Paper Roast',
    tagline: 'Papel kraft claro + Tinta café + Stamp',
    accentColor: '#D9381E',
    bgColor: '#F5EFEB',
    previewClass: 'bg-[#F5EFEB] text-[#18120F] border-[#1C1512]'
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew Acid',
    tagline: 'Obsidiana + Verde ácido fluorescente',
    accentColor: '#A3E635',
    bgColor: '#080C0E',
    previewClass: 'bg-[#080C0E] text-[#F2FAF5] border-[#24383E]'
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar tema de café"
        className="flex items-center gap-2 border border-[var(--border-main)] bg-[var(--bg-surface)] px-2.5 py-1.5 font-mono-code text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-punch)]"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: active.accentColor }}
        />
        <span className="hidden sm:inline">{active.name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-1 w-64 border border-[var(--border-main)] bg-[var(--bg-surface)] p-1.5 shadow-xl"
        >
          <div className="border-b border-[var(--border-main)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Temas
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between border p-2 text-left transition-colors ${
                    isSelected
                      ? 'border-[var(--accent-punch)] bg-[var(--bg-subtle)] font-bold text-[var(--text-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]/70 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 shrink-0 border border-black/30"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    <div>
                      <div className="text-xs">{theme.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] leading-tight">
                        {theme.tagline}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[var(--accent-punch)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
