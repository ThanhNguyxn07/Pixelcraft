'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy, Sparkles, Terminal } from 'lucide-react';
import { DEMOS } from '@/lib/demos';

const REPO_URL = 'https://github.com/ThanhNguyxnOrg/Pixelcraft';

export function GalleryView() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<string>('All');

  const stackFilters = useMemo(() => {
    const primaryStacks = DEMOS.map((d) => d.techStack[0]);
    return ['All', ...Array.from(new Set(primaryStacks))];
  }, []);

  const visibleDemos = useMemo(() => {
    if (selectedStack === 'All') return DEMOS;
    return DEMOS.filter((d) => d.techStack[0] === selectedStack);
  }, [selectedStack]);

  async function copyPrompt(slug: string, prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedSlug(slug);
      window.setTimeout(() => setCopiedSlug(null), 1800);
    } catch {
      setCopiedSlug(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#0d0d0c]">
      {/* Floating Atelier Navigation (unified with Home) */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full border border-[#ded9ce] bg-[#f7f5f0]/90 px-4 shadow-[0_8px_30px_rgba(13,13,12,0.06)] backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.14em] text-[#0d0d0c] uppercase"
            >
              <img
                src="/brand/logo-256.png"
                alt="Pixelcraft logo"
                width={28}
                height={28}
                className="h-7 w-7 rounded-md object-contain"
              />
              PIXELCRAFT
            </Link>
            <span className="hidden rounded-full border border-[#ded9ce] bg-[#ffffff] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#c83216] sm:inline-block">
              Gallery
            </span>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-xs font-medium text-[#4a4741] transition-colors hover:text-[#0d0d0c]"
            >
              Overview
            </Link>
            <Link
              href="/docs"
              className="text-xs font-medium text-[#4a4741] transition-colors hover:text-[#0d0d0c]"
            >
              Docs
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-[#0d0d0c] px-3.5 py-1.5 font-mono text-[11px] font-medium text-[#f6f4ef] transition-colors hover:bg-[#c83216]"
            >
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="atelier-grid-bg pb-24 pt-12 sm:pt-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
          {/* Editorial Header */}
          <div className="flex flex-col justify-between gap-6 border-b border-[#ded9ce] pb-10 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ded9ce] bg-[#ffffff] px-3.5 py-1 font-mono text-[11px] text-[#4a4741]">
                <Sparkles className="h-3 w-3 text-[#c83216]" aria-hidden="true" />
                <span>MULTI-STACK LIVE SPECIMENS · {DEMOS.length} VERIFIED BUILDS</span>
              </div>
              <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.0] tracking-[-0.02em] text-[#0d0d0c] sm:text-6xl">
                Built across stacks,{' '}
                <em className="italic text-[#c83216]">verified in Chromium.</em>
              </h1>
              <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-[#4a4741]">
                Each gallery specimen runs in its real target stack—complete with the verbatim
                Pixelcraft skill prompt, semantic palette, and 3-viewport finish-gate evidence.
              </p>
            </div>

            {/* Stack Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by tech stack">
              {stackFilters.map((stack) => {
                const active = stack === selectedStack;
                return (
                  <button
                    key={stack}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedStack(stack)}
                    className={`rounded-full px-4 py-2 font-mono text-xs font-medium transition-colors ${
                      active
                        ? 'bg-[#0d0d0c] text-[#f6f4ef]'
                        : 'border border-[#ded9ce] bg-[#ffffff] text-[#4a4741] hover:border-[#0d0d0c] hover:text-[#0d0d0c]'
                    }`}
                  >
                    {stack}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specimen Cards — Generous Uncropped Browser Showcase */}
          <div className="mt-12 space-y-14">
            {visibleDemos.map((demo) => {
              const isCopied = copiedSlug === demo.slug;
              const isExpanded = expandedPrompt === demo.slug;
              const launchUrl = demo.href ?? `/gallery/${demo.slug}`;
              const isStandalone = Boolean(demo.href);

              return (
                <article
                  key={demo.slug}
                  className="overflow-hidden rounded-[28px] border border-[#ded9ce] bg-[#ffffff] shadow-[0_24px_70px_rgba(13,13,12,0.08)]"
                >
                  {/* Top Browser-Frame Exhibition Preview (Full Width, Zero Awkward Cropping) */}
                  <div className="bg-[#0c0c0e] p-4 sm:p-6">
                    {/* Browser Chrome Bar */}
                    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#ff6542]/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#ff6542]">
                          PIECE {demo.code}
                        </span>
                        <span className="font-mono text-xs text-[#f6f4ef]">
                          {demo.techStack[0]}
                        </span>
                        <span className="hidden font-mono text-[11px] text-[#a7a49c] sm:inline">
                          · {demo.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden rounded-full border border-[#27272d] bg-[#151519] px-3 py-1 font-mono text-[10px] text-[#34d399] sm:inline-block">
                          {demo.evidence.contrast} · {demo.evidence.responsive}
                        </span>
                        {isStandalone ? (
                          <a
                            href={launchUrl}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f4ef] px-4 py-1.5 font-mono text-xs font-semibold text-[#0c0c0e] transition-colors hover:bg-[#ff6542] hover:text-[#f6f4ef]"
                          >
                            Open Live Demo
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <Link
                            href={launchUrl}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f4ef] px-4 py-1.5 font-mono text-xs font-semibold text-[#0c0c0e] transition-colors hover:bg-[#ff6542] hover:text-[#f6f4ef]"
                          >
                            Open Live Demo
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Clean 16:9 Uncropped Visual Frame */}
                    {isStandalone ? (
                      <a
                        href={launchUrl}
                        className="group block overflow-hidden rounded-2xl border border-[#27272d] bg-[#151519]"
                      >
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#16171a]">
                          <img
                            src={demo.coverImage}
                            alt={demo.coverAlt}
                            width={1360}
                            height={765}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </div>
                      </a>
                    ) : (
                      <Link
                        href={launchUrl}
                        className="group block overflow-hidden rounded-2xl border border-[#27272d] bg-[#151519]"
                      >
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#ded8cb]">
                          <img
                            src={demo.coverImage}
                            alt={demo.coverAlt}
                            width={1360}
                            height={765}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Bottom Details + Verbatim Prompt Strip */}
                  <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-12">
                    {/* Left 5 cols: Identity, Stack & Palette */}
                    <div className="lg:col-span-5">
                      <h2 className="font-serif text-3xl font-medium text-[#0d0d0c]">
                        {demo.title}
                      </h2>
                      <p className="mt-2.5 text-sm leading-[1.7] text-[#4a4741]">
                        {demo.subtitle}
                      </p>

                      {/* Stack Chips */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {demo.techStack.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#ded9ce] bg-[#f7f5f0] px-3 py-1 font-mono text-[11px] font-medium text-[#0d0d0c]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Palette Dots */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {demo.swatches.map((sw) => (
                          <div key={sw.hex} className="flex items-center gap-1.5">
                            <span
                              aria-hidden="true"
                              className="h-4 w-4 rounded-full border border-[#0d0d0c]/20"
                              style={{ backgroundColor: sw.hex }}
                            />
                            <span className="font-mono text-[11px] text-[#4a4741]">{sw.hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right 7 cols: Verbatim Skill Prompt Console */}
                    <div className="flex flex-col justify-between rounded-2xl border border-[#ded9ce] bg-[#f7f5f0] p-5 lg:col-span-7">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ded9ce] pb-3">
                          <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0d0d0c]">
                            <Terminal className="h-3.5 w-3.5 text-[#c83216]" aria-hidden="true" />
                            <span>Verbatim Skill Prompt</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedPrompt(isExpanded ? null : demo.slug)}
                              className="rounded-full border border-[#ded9ce] bg-[#ffffff] px-3 py-1 font-mono text-[11px] text-[#4a4741] hover:border-[#0d0d0c] hover:text-[#0d0d0c]"
                            >
                              {isExpanded ? 'Collapse' : 'Read Full'}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyPrompt(demo.slug, demo.prompt)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#0d0d0c] px-3.5 py-1 font-mono text-[11px] font-medium text-[#f6f4ef] transition-colors hover:bg-[#c83216]"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3 w-3 text-[#34d399]" aria-hidden="true" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" aria-hidden="true" />
                                  Copy Prompt
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <p
                          className={`mt-3.5 font-mono text-xs leading-[1.7] text-[#2b2925] ${
                            isExpanded ? '' : 'line-clamp-4'
                          }`}
                        >
                          {demo.prompt}
                        </p>
                      </div>

                      {/* Applied Skills Footer */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#ded9ce] pt-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[10px] uppercase text-[#625e56]">
                            Skills:
                          </span>
                          {demo.skillsUsed.map((skill) => (
                            <Link
                              key={skill}
                              href={`/docs/${skill}`}
                              className="rounded-full border border-[#ded9ce] bg-[#ffffff] px-2.5 py-0.5 font-mono text-[10px] text-[#0d0d0c] hover:border-[#c83216] hover:text-[#c83216]"
                            >
                              {skill}
                            </Link>
                          ))}
                        </div>
                        <span className="font-mono text-[11px] text-[#167a4d]">
                          {demo.evidence.states}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
