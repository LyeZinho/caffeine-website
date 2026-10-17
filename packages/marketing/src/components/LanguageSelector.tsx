import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  menuTitle?: string;
}

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'pt', label: 'Português', nativeLabel: 'Português (BR)' },
  { code: 'en', label: 'English', nativeLabel: 'English (US)' },
  { code: 'es', label: 'Español', nativeLabel: 'Español' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  menuTitle = 'Language / Idioma',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Mudar idioma: atual ${activeOption.label}`}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 border border-[var(--border-main)] bg-[var(--bg-surface)] px-2.5 py-1.5 font-mono-code text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-punch)] hover:text-[var(--text-primary)]"
      >
        <Globe className="h-3.5 w-3.5 text-[var(--accent-punch)]" />
        <span className="font-bold uppercase tracking-wider">{activeOption.code}</span>
        <ChevronDown
          className={`h-3 w-3 text-[var(--text-muted)] transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 z-50 border border-[var(--border-main)] bg-[var(--bg-surface)] py-1 shadow-[2px_2px_0px_0px_var(--border-bold)]">
          <div className="border-b border-[var(--border-main)] px-3 py-1.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {menuTitle}
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left font-mono-code text-xs transition-colors ${
                  isSelected
                    ? 'bg-[var(--bg-subtle)] text-[var(--accent-punch)] font-bold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-[10px] font-black uppercase text-[var(--text-muted)]">
                    {lang.code}
                  </span>
                  <span>{lang.nativeLabel}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-[var(--accent-punch)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
