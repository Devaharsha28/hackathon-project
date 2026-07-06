import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  text: string;
  className?: string;
  block?: boolean;
}

export function parseAndRenderMath(text: string): React.ReactNode[] {
  if (!text) return [];

  // Split by $$ (block math) or $ (inline math)
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const formula = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
          trust: true,
        });
        return (
          <span
            key={index}
            className="block my-3 overflow-x-auto text-center"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        console.error("KaTeX block render error:", err);
        return <span key={index} className="font-mono text-red-500">{part}</span>;
      }
    } else if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
          trust: true,
        });
        return (
          <span
            key={index}
            className="inline-block max-w-full overflow-x-auto align-middle px-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        console.error("KaTeX inline render error:", err);
        return <span key={index} className="font-mono text-red-500">{part}</span>;
      }
    } else {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }
  });
}

export default function MathFormula({ text, className = '', block = false }: MathFormulaProps) {
  if (block) {
    try {
      const html = katex.renderToString(text, {
        displayMode: true,
        throwOnError: false,
        trust: true,
      });
      return (
        <div
          className={`overflow-x-auto my-2 text-center ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (err) {
      return <div className={`font-mono text-red-500 ${className}`}>{text}</div>;
    }
  }

  return <span className={className}>{parseAndRenderMath(text)}</span>;
}
