'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEMOS } from '@/lib/demos';

export function GalleryView() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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
              Gallery
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
              href="/docs"
              className="text-xs font-medium text-[#524e47] transition-colors hover:text-[#141311]"
            >
              Docs
            </Link>
            <a
              href="https://github.com/ThanhNguyxnOrg/Pixelcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0d0d0c] px-3.5 py-1.5 font-mono text-[11px] font-medium text-[#f6f4ef] transition-colors hover:bg-[#c83216]"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1380px] px-4 py-12 sm:px-8 lg:py-16">
        {/* Header */}
        <div className="border-b border-[#d8d2c6] pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b82d12]">
            LIVE SPECIMEN ARCHIVE · ONE PIECE AT A TIME
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.02] text-[#141311] sm:text-5xl">
            Verified interfaces, with the{' '}
            <em className="italic text-[#b82d12]">exact prompt</em> behind each build.
          </h1>
          <p className="mt-4 max-w-[64ch] text-[15px] leading-[1.68] text-[#45413b]">
            Every specimen below is built as a self-contained visual world with real media,
            verified loaded fonts, and 3-viewport browser inspection. Copy the verbatim skill
            prompt to reproduce or adapt the workflow in your own project.
          </p>
        </div>

        {/* Specimens */}
        <div className="mt-10 space-y-12">
          {DEMOS.map((demo) => {
            const isCopied = copiedSlug === demo.slug;
            return (
              <article
                key={demo.slug}
                className="border border-[#d8d2c6] bg-[#faf8f3]"
              >
                {/* Top Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8d2c6] bg-[#eae5da]/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#524e47]">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#b82d12]">PIECE {demo.code}</span>
                    <span>{demo.category}</span>
                    <span className="hidden sm:inline">· {demo.mode}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1a6646]">CONTRAST: {demo.evidence.contrast}</span>
                    <span>· {demo.evidence.responsive}</span>
                  </div>
                </div>

                {/* Split Showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {demo.href ? (
                    <a
                      href={demo.href}
                      className="group relative block aspect-[16/10] overflow-hidden bg-[#ded8cb] lg:col-span-6 lg:aspect-auto lg:border-r lg:border-[#d8d2c6]"
                    >
                      <img
                        src={demo.coverImage}
                        alt={demo.coverAlt}
                        width={1200}
                        height={800}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </a>
                  ) : (
                    <Link
                      href={`/gallery/${demo.slug}`}
                      className="group relative block aspect-[16/10] overflow-hidden bg-[#ded8cb] lg:col-span-6 lg:aspect-auto lg:border-r lg:border-[#d8d2c6]"
                    >
                      <img
                        src={demo.coverImage}
                        alt={demo.coverAlt}
                        width={1200}
                        height={800}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                  )}

                  <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                    <div>
                      <h2 className="font-serif text-3xl font-medium text-[#141311]">
                        {demo.title}
                      </h2>
                      <p className="mt-3 text-sm leading-[1.7] text-[#45413b]">
                        {demo.subtitle}
                      </p>

                      {/* Tech Stack & Skills */}
                      <div className="mt-5 grid grid-cols-1 gap-4 border-y border-[#d8d2c6] py-4 sm:grid-cols-2">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#59554d]">
                            Stack
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {demo.techStack.map((item) => (
                              <span
                                key={item}
                                className="border border-[#d8d2c6] bg-[#f4f1ea] px-2 py-0.5 font-mono text-[11px] text-[#141311]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#59554d]">
                            Skills Applied
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {demo.skillsUsed.map((skill) => (
                              <Link
                                key={skill}
                                href={`/docs/${skill}`}
                                className="border border-[#b8b0a1] bg-[#faf8f3] px-2 py-0.5 font-mono text-[11px] text-[#141311] hover:border-[#b82d12] hover:text-[#b82d12]"
                              >
                                {skill}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Swatches */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {demo.swatches.map((sw) => (
                          <div
                            key={sw.hex}
                            className="flex items-center gap-2 border border-[#d8d2c6] bg-[#f4f1ea] px-2.5 py-1"
                          >
                            <span
                              aria-hidden="true"
                              className="h-3.5 w-3.5 border border-[#141311]/20"
                              style={{ backgroundColor: sw.hex }}
                            />
                            <span className="font-mono text-[11px] text-[#141311]">
                              {sw.name} ({sw.hex})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verbatim Prompt Box + Open Demo */}
                    <div className="mt-6 border border-[#d8d2c6] bg-[#f4f1ea]">
                      <div className="flex items-center justify-between border-b border-[#d8d2c6] px-4 py-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#59554d]">
                          Verbatim Skill Prompt
                        </span>
                        <button
                          type="button"
                          onClick={() => copyPrompt(demo.slug, demo.prompt)}
                          className="font-mono text-[11px] font-medium text-[#b82d12] hover:underline"
                        >
                          {isCopied ? 'Copied Prompt' : 'Copy Prompt'}
                        </button>
                      </div>
                      <p className="p-4 font-mono text-xs leading-[1.65] text-[#2b2925]">
                        {demo.prompt}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d8d2c6] bg-[#faf8f3] px-4 py-3">
                        <span className="font-mono text-[11px] text-[#59554d]">
                          Verified states: {demo.evidence.states}
                        </span>
                        {demo.href ? (
                          <a
                            href={demo.href}
                            className="inline-flex min-h-10 items-center gap-2 bg-[#141311] px-4 py-2 font-mono text-xs font-medium text-[#faf8f3] transition-colors hover:bg-[#b82d12]"
                          >
                            Open Live Demo ↗
                          </a>
                        ) : (
                          <Link
                            href={`/gallery/${demo.slug}`}
                            className="inline-flex min-h-10 items-center gap-2 bg-[#141311] px-4 py-2 font-mono text-xs font-medium text-[#faf8f3] transition-colors hover:bg-[#b82d12]"
                          >
                            Open Live Demo ↗
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
