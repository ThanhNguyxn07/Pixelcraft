'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';

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
  installCmd?: string;
  references?: string[];
  scripts?: string[];
  markdown: string;
}

const REPO_BLOB_BASE = 'https://github.com/ThanhNguyxn07/Pixelcraft/blob/main';

function resolveMarkdownHref(rawHref: string, activeSlug: string): { href: string; external: boolean } {
  if (/^https?:\/\//i.test(rawHref)) {
    return { href: rawHref, external: true };
  }
  if (rawHref.startsWith('#') || rawHref.startsWith('/')) {
    return { href: rawHref, external: false };
  }
  const clean = rawHref.replace(/^\.\//, '');
  if (activeSlug === 'architecture' || activeSlug === 'rationale' || activeSlug === 'overview') {
    return { href: `${REPO_BLOB_BASE}/docs/${clean}`, external: true };
  }
  return { href: `${REPO_BLOB_BASE}/skills/${activeSlug}/${clean}`, external: true };
}

function renderInline(text: string, activeSlug: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('[')) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (m) {
        const { href, external } = resolveMarkdownHref(m[2], activeSlug);
        parts.push(
          <a
            key={`link-${keyIdx++}`}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="text-[#b82d12] underline decoration-[#b82d12]/40 hover:decoration-[#b82d12]"
          >
            {m[1]}
          </a>
        );
      }
    } else if (token.startsWith('`')) {
      parts.push(
        <code
          key={`code-${keyIdx++}`}
          className="border border-[#d8d2c6] bg-[#eae5da] px-1.5 py-0.5 font-mono text-[0.85em] text-[#141311]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={`strong-${keyIdx++}`} className="font-semibold text-[#141311]">
          {token.slice(2, -2)}
        </strong>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function renderMarkdown(markdown: string, activeSlug: string): ReactNode[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      nodes.push(
        <pre
          key={`pre-${key++}`}
          className="my-5 overflow-x-auto border border-[#d8d2c6] bg-[#141311] p-4 font-mono text-xs leading-relaxed text-[#faf8f3]"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Headings
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      if (level === 1) {
        nodes.push(
          <h2
            key={`h-${key++}`}
            className="mt-8 border-b border-[#d8d2c6] pb-2 font-serif text-3xl font-medium text-[#141311]"
          >
            {renderInline(headingText, activeSlug)}
          </h2>
        );
      } else if (level === 2) {
        nodes.push(
          <h2
            key={`h-${key++}`}
            className="mt-9 border-b border-[#d8d2c6] pb-2 font-display text-lg font-semibold text-[#141311]"
          >
            {renderInline(headingText, activeSlug)}
          </h2>
        );
      } else {
        nodes.push(
          <h3
            key={`h-${key++}`}
            className="mt-6 font-display text-base font-semibold text-[#141311]"
          >
            {renderInline(headingText, activeSlug)}
          </h3>
        );
      }
      i++;
      continue;
    }

    // Markdown table
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:-]+\|/.test(lines[i + 1])) {
      const parseRow = (r: string) =>
        r
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim());

      const headers = parseRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(parseRow(lines[i]));
        i++;
      }

      nodes.push(
        <div key={`tbl-${key++}`} className="my-5 overflow-x-auto border border-[#d8d2c6]">
          <table className="w-full border-collapse text-left text-xs tabular-nums">
            <thead>
              <tr className="border-b border-[#d8d2c6] bg-[#eae5da]">
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    className="px-3.5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#141311]"
                  >
                    {renderInline(h, activeSlug)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8d2c6] bg-[#faf8f3]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2.5 align-top leading-relaxed text-[#2b2925]">
                      {renderInline(cell, activeSlug)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered or ordered list
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''));
        i++;
      }
      const ListTag = ordered ? 'ol' : 'ul';
      nodes.push(
        <ListTag
          key={`list-${key++}`}
          className={`my-4 space-y-2 pl-5 text-sm leading-[1.7] text-[#2b2925] ${
            ordered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, activeSlug)}</li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    nodes.push(
      <p key={`p-${key++}`} className="my-3.5 text-sm leading-[1.75] text-[#2b2925]">
        {renderInline(paraLines.join(' '), activeSlug)}
      </p>
    );
  }

  return nodes;
}

export function DocsShell({
  skills,
  activeSlug,
  title,
  subtitle,
  installCmd,
  references = [],
  scripts = [],
  markdown,
}: DocsShellProps) {
  const [copied, setCopied] = useState(false);

  const grouped = skills.reduce<Record<string, FullSkillDoc[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  async function handleCopy() {
    if (!installCmd) return;
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#141311]">
      {/* Masthead */}
      <header className="sticky top-0 z-40 border-b border-[#d8d2c6] bg-[#f4f1ea]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1380px] items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.14em] text-[#141311] uppercase"
            >
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 bg-[#c23114]" />
              PIXELCRAFT
            </Link>
            <span className="border-l border-[#d8d2c6] pl-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#b82d12]">
              Docs
            </span>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/"
              className="text-xs font-medium text-[#524e47] transition-colors hover:text-[#141311]"
            >
              Overview
            </Link>
            <Link
              href="/gallery"
              className="text-xs font-medium text-[#524e47] transition-colors hover:text-[#141311]"
            >
              Gallery
            </Link>
            <a
              href="https://github.com/ThanhNguyxn07/Pixelcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#141311] bg-[#141311] px-3 py-1.5 font-mono text-[11px] font-medium text-[#faf8f3] transition-colors hover:border-[#b82d12] hover:bg-[#b82d12]"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1380px] grid-cols-1 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="border-b border-[#d8d2c6] bg-[#faf8f3] p-5 lg:col-span-3 lg:border-b-0 lg:border-r">
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#59554d]">
                Guides
              </p>
              <ul className="mt-2 space-y-1">
                {[
                  { slug: 'architecture', label: 'Architecture' },
                  { slug: 'rationale', label: 'Design Rationale' },
                ].map((item) => {
                  const active = activeSlug === item.slug;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className={`block px-2.5 py-1.5 font-mono text-xs transition-colors ${
                          active
                            ? 'bg-[#141311] text-[#faf8f3]'
                            : 'text-[#45413b] hover:bg-[#eae5da] hover:text-[#141311]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#59554d]">
                  {category}
                </p>
                <ul className="mt-2 space-y-1">
                  {items.map((skill) => {
                    const active = activeSlug === skill.slug;
                    return (
                      <li key={skill.slug}>
                        <Link
                          href={`/docs/${skill.slug}`}
                          className={`block px-2.5 py-1.5 font-mono text-xs transition-colors ${
                            active
                              ? 'bg-[#141311] text-[#faf8f3]'
                              : 'text-[#45413b] hover:bg-[#eae5da] hover:text-[#141311]'
                          }`}
                        >
                          {skill.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Article */}
        <main id="main-content" className="px-5 py-10 sm:px-10 lg:col-span-9 lg:py-12">
          <div className="max-w-[78ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#b82d12]">
              SPECIFICATION · {activeSlug}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-medium text-[#141311]">{title}</h1>
            <p className="mt-3 text-[15px] leading-[1.7] text-[#45413b]">{subtitle}</p>

            {installCmd && (
              <div className="mt-6 flex flex-col gap-2 border border-[#d8d2c6] bg-[#faf8f3] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <code className="overflow-x-auto font-mono text-xs text-[#141311]">
                  <span className="mr-2 select-none text-[#b82d12]">$</span>
                  {installCmd}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-8 shrink-0 border border-[#b8b0a1] px-3 font-mono text-[11px] text-[#141311] hover:border-[#141311] hover:bg-[#141311] hover:text-[#faf8f3]"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}

            {(references.length > 0 || scripts.length > 0) && (
              <div className="mt-6 grid grid-cols-1 gap-4 border-y border-[#d8d2c6] py-4 sm:grid-cols-2">
                {references.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#59554d]">
                      References ({references.length})
                    </p>
                    <ul className="mt-2 space-y-1">
                      {references.map((ref) => (
                        <li key={ref}>
                          <a
                            href={`${REPO_BLOB_BASE}/skills/${activeSlug}/references/${ref}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-[#b82d12] hover:underline"
                          >
                            references/{ref} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {scripts.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#59554d]">
                      Scripts ({scripts.length})
                    </p>
                    <ul className="mt-2 space-y-1">
                      {scripts.map((sc) => (
                        <li key={sc}>
                          <a
                            href={`${REPO_BLOB_BASE}/skills/${activeSlug}/scripts/${sc}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-[#b82d12] hover:underline"
                          >
                            scripts/{sc} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <article className="mt-8">{renderMarkdown(markdown, activeSlug)}</article>
          </div>
        </main>
      </div>
    </div>
  );
}
