import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  lang?: string;
  label?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, lang = 'text', label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="relative my-4 border border-[var(--border-main)] bg-[var(--code-bg)] text-left">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-main)] bg-[var(--bg-subtle)] px-3 py-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono-code font-semibold text-[var(--text-primary)]">
            {label || lang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copiar código"
          className="flex items-center gap-1.5 border border-[var(--border-main)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono-code text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-punch)] hover:text-[var(--text-primary)]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <div className="overflow-x-auto p-3 font-mono-code text-xs leading-relaxed text-[var(--text-primary)]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[var(--bg-subtle)]/40">
                <td className="w-8 select-none pr-3 text-right text-[11px] text-[var(--text-muted)] opacity-60">
                  {idx + 1}
                </td>
                <td className="whitespace-pre">
                  {highlightSyntax(line, lang)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Lightweight, accessible token highlighter
function highlightSyntax(line: string, lang: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-[#8E847C] italic">{line}</span>;
  }
  if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
    return <span className="text-[var(--accent-crema)] font-bold">{line}</span>;
  }

  // Keywords & types
  const parts = line.split(/(\b(?:using|public|struct|class|override|void|return|var|let|fn|struct|int|float|bool|true|false|new|ref|const|auto)\b|"[^"]*"|'[^']*'|\d+\.?\d*f?)/g);

  return (
    <span>
      {parts.map((token, i) => {
        if (/^(using|public|struct|class|override|void|return|var|let|fn|ref|const|auto)$/.test(token)) {
          return <span key={i} className="text-[#FF5C42] font-semibold">{token}</span>;
        }
        if (/^(int|float|bool|Vec2|Transform2D|Velocity|World|Entity|ISystem|RigidBody2D|CircleCollider2D|CremaEmitter)$/.test(token)) {
          return <span key={i} className="text-[#FBBF24] font-medium">{token}</span>;
        }
        if (/^(".*"|'.*')$/.test(token)) {
          return <span key={i} className="text-[#34D399]">{token}</span>;
        }
        if (/^(true|false)$/.test(token)) {
          return <span key={i} className="text-[#F472B6]">{token}</span>;
        }
        if (/^\d+\.?\d*f?$/.test(token)) {
          return <span key={i} className="text-[#60A5FA]">{token}</span>;
        }
        return token;
      })}
    </span>
  );
}
