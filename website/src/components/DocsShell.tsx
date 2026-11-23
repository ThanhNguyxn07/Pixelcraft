'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, FileText, Search, Terminal } from 'lucide-react';

export interface FullSkillDoc {
  slug: string;
  name: string;
  description: string;
  category: string;
  references: string[];
  scripts: string[];
  body: string;
}

interface DocsShellProps {
  skills: FullSkillDoc[];
  activeSlug: string;
  title: string;
  subtitle: string;
  markdown: string;
  installCmd?: string;
  references?: string[];
  scripts?: string[];
}

export function DocsShell({
  skills,
  activeSlug,
  title,
  subtitle,
  markdown,
  installCmd,
  references = [],
  scripts = [],
}: DocsShellProps) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? skills.filter(
          (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        )
      : skills;
    const map = new Map<string, FullSkillDoc[]>();
    for (const s of list) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return [...map.entries()];
  }, [skills, query]);

  const copyInstall = async () => {
    if (!installCmd) return;
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f5f7]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070709]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 no-underline hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Showcase
            </Link>
            <span className="text-zinc-700">/</span>
            <Link href="/docs" className="flex items-center gap-2 text-white no-underline">
              <img src="/brand/logo-256.png" alt="" width={22} height={22} className="pixel-art" />
              <span className="font-display text-sm font-bold tracking-wider">PIXELCRAFT DOCS</span>
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/gallery"
              className="font-mono text-xs text-cyan-300 no-underline hover:text-white"
            >
              Gallery
            </Link>
            <a
              href="https://github.com/ThanhNguyxn07/Pixelcraft"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-zinc-400 no-underline hover:text-cyan-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="border-b border-white/10 p-4 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-5">
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <label htmlFor="docs-search" className="sr-only">
              Search docs
            </label>
            <input
              id="docs-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter 26 skills..."
              className="h-9 w-full rounded-md border border-white/15 bg-white/[0.03] pl-8 pr-3 font-mono text-xs text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="mb-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              Foundations
            </p>
            <ul className="m-0 list-none space-y-1 p-0">
              {[
                ['overview', '/docs', 'Overview'],
                ['architecture', '/docs/architecture', 'Architecture'],
                ['rationale', '/docs/rationale', 'Design Rationale'],
              ].map(([slug, href, label]) => (
                <li key={slug}>
                  <Link
                    href={href}
                    className={`block rounded px-2.5 py-1.5 text-sm no-underline transition-colors ${
                      activeSlug === slug
                        ? 'bg-cyan-300/15 font-semibold text-cyan-300'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {grouped.map(([cat, list]) => (
            <div key={cat} className="mb-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                {cat} ({list.length})
              </p>
              <ul className="m-0 list-none space-y-0.5 p-0">
                {list.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/docs/${s.slug}`}
                      className={`block truncate rounded px-2.5 py-1.5 font-mono text-xs no-underline transition-colors ${
                        activeSlug === s.slug
                          ? 'bg-cyan-300/15 font-semibold text-cyan-300'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main reading column (68ch) */}
        <main id="main-content" className="px-5 py-10 sm:px-12 sm:py-14">
          <div className="max-w-[74ch]">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-300">
              Documentation
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">{subtitle}</p>

            {installCmd && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-200">
                  <Terminal className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  <code>{installCmd}</code>
                </div>
                <button
                  type="button"
                  onClick={copyInstall}
                  className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1 font-mono text-xs text-cyan-300 cursor-pointer hover:border-cyan-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}

            {(references.length > 0 || scripts.length > 0) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {references.map((ref) => (
                  <span
                    key={ref}
                    className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] text-zinc-400"
                  >
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    references/{ref}
                  </span>
                ))}
                {scripts.map((sc) => (
                  <span
                    key={sc}
                    className="inline-flex items-center gap-1 rounded border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[11px] text-amber-300"
                  >
                    <Terminal className="h-3 w-3" aria-hidden="true" />
                    scripts/{sc}
                  </span>
                ))}
              </div>
            )}

            <article className="mt-10 border-t border-white/10 pt-8 space-y-4">
              {renderMarkdownBlocks(markdown)}
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[12px] text-cyan-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMarkdownBlocks(md: string) {
  const lines = md.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      nodes.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-lg border border-white/10 bg-[#0d0d12] p-4 font-mono text-xs leading-6 text-zinc-200"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={key++} className="pt-4 font-display text-lg font-bold text-white">
          {renderInline(line.slice(4))}
        </h3>
      );
      i += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={key++} className="border-t border-white/10 pt-6 font-display text-2xl font-bold text-white">
          {renderInline(line.slice(3))}
        </h2>
      );
      i += 1;
      continue;
    }
    if (line.startsWith('# ')) {
      i += 1;
      continue;
    }
    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (/^[-*]\s+/.test(lines[i]) || /^\d+\.\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^([-*]|\d+\.)\s+/, ''));
        i += 1;
      }
      nodes.push(
        <ul key={key++} className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-300">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }
    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i += 1;
      }
      if (rows.length > 0) {
        const [head, ...body] = rows;
        nodes.push(
          <div key={key++} className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-white/[0.04] font-mono text-zinc-300">
                <tr>
                  {head.map((h, hi) => (
                    <th key={hi} className="border-b border-white/10 px-3 py-2.5">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300">
                {body.map((r, ri) => (
                  <tr key={ri}>
                    {r.map((c, ci) => (
                      <td key={ci} className="px-3 py-2.5 align-top leading-6">
                        {renderInline(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }
    nodes.push(
      <p key={key++} className="text-sm leading-7 text-zinc-300">
        {renderInline(line)}
      </p>
    );
    i += 1;
  }

  return nodes;
}
