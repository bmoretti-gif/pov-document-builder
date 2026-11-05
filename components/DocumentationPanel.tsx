import React, { useState } from 'react';

interface Props {
  checkedAt: string;
  pages: { url: string; content: string; error?: string }[];
}

export default function DocumentationPanel({ checkedAt, pages }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!pages.length) return null;
  const failures = pages.filter(page => page.error).length;
  return (
    <section className="border-b border-slate-200 bg-white shrink-0">
      <div className="flex items-center justify-between gap-3 px-8 py-2 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2596be]" aria-hidden="true" />
          <span className="font-semibold text-slate-600">Cribl Docs</span>
          <span className="text-slate-400">{new Date(checkedAt).toLocaleDateString('pt-BR')}</span>
          {failures > 0 && <span className="text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">{failures} referências para revisar</span>}
          {Date.now() - Date.parse(checkedAt) > 48 * 60 * 60 * 1000 && <span className="text-amber-700">Consulta há mais de 48h</span>}
        </div>
        <button type="button" aria-expanded={expanded} aria-controls="documentation-references" onClick={() => setExpanded(!expanded)} className="shrink-0 text-slate-500 hover:text-[#2596be] font-semibold py-1">
          {expanded ? 'Ocultar referências ↑' : 'Ver referências ↓'}
        </button>
      </div>
      {expanded && <div id="documentation-references" className="max-h-64 overflow-y-auto px-8 pb-4 text-xs">
        <p className="text-slate-500 pb-3">Consulta: {new Date(checkedAt).toLocaleString('pt-BR')}. Revise as referências antes de alterar os textos e portas da biblioteca.</p>
        {pages.map(page => <details key={page.url} className="border-t border-slate-100 py-2">
          <summary className="cursor-pointer text-slate-600 break-all">{page.url}{page.error && <span className="text-amber-700"> — Indisponível</span>}</summary>
          <a href={page.url} target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-[#2596be]">Abrir documentação oficial ↗</a>
          <pre className="whitespace-pre-wrap text-slate-500">{page.error || page.content}</pre>
        </details>)}
      </div>}
    </section>
  );
}
