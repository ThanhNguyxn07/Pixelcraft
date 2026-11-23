'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, Copy, Layers, ShieldCheck, Terminal } from 'lucide-react';
import { DEMOS } from '@/lib/demos';

export function GalleryView() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const copyPrompt = async (slug: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 1600);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f5f5f7]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050507]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 no-underline hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Showcase
            </Link>
            <span className="text-zinc-700">/</span>
            <Link href="/gallery" className="flex items-center gap-2.5 text-white no-underline">
              <img src="/brand/logo-256.png" alt="" width={24} height={24} className="pixel-art" />
              <span className="font-display text-sm font-bold tracking-[0.14em]">LIVE GALLERY</span>
            </Link>
          </div>
          <nav aria-label="Gallery navigation" className="flex items-center gap-5">
            <Link href="/docs" className="font-mono text-xs text-zinc-400 no-underline hover:text-white">
              Docs
            </Link>
            <a
              href="https://github.com/ThanhNguyxn07/Pixelcraft"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-zinc-400 no-underline hover:text-cyan-300"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1400px] px-5 py-14 sm:px-10 sm:py-20">
        <div className="border-b border-white/10 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            CURATED LIVE DEMOS · HAND-CRAFTED ONE BY ONE
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            Real pages, real prompts, zero shortcuts.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Each demo is built one at a time using Pixelcraft skills, real photography, proper typography, and verified browser states. Copy the exact prompt to run with Pixelcraft, or open the live site directly.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {DEMOS.map((demo) => (
            <article
              key={demo.slug}
              className="overflow-hidden rounded-xl border border-white/15 bg-[#0b0b0f]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Real Photograph Preview */}
                <div className="flex flex-col border-b border-white/10 lg:col-span-5 lg:border-b-0 lg:border-r">
                  <Link href={`/demos/${demo.slug}`} className="group relative block flex-1 overflow-hidden">
                    <img
                      src={demo.coverImage}
                      alt={demo.coverAlt}
                      className="h-full min-h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md">
                      {demo.code} · {demo.theme.toUpperCase()}
                    </span>
                  </Link>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#07070a] px-5 py-3">
                    <div className="flex items-center gap-2" aria-label="Color palette swatches">
                      {demo.swatches.map((sw) => (
                        <span
                          key={sw.hex}
                          title={`${sw.name} (${sw.hex})`}
                          className="h-4 w-4 rounded-sm border border-white/20"
                          style={{ backgroundColor: sw.hex }}
                        />
                      ))}
                      <span className="ml-1 font-mono text-[11px] text-zinc-500">{demo.mode}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      {demo.evidence.contrast}
                    </span>
                  </div>
                </div>

                {/* Metadata + Exact Prompt + Open Live Demo */}
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                        {demo.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {demo.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {demo.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{demo.subtitle}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                        <Layers className="h-3 w-3" aria-hidden="true" /> Skills:
                      </span>
                      {demo.skillsUsed.map((sk) => (
                        <Link
                          key={sk}
                          href={`/docs/${sk}`}
                          className="rounded border border-cyan-300/25 bg-cyan-300/10 px-2 py-0.5 font-mono text-[11px] text-cyan-200 no-underline hover:border-cyan-300"
                        >
                          {sk}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-5 rounded-lg border border-white/10 bg-[#050507] p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-amber-300">
                          <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                          Prompt for Pixelcraft Skills
                        </span>
                        <button
                          type="button"
                          onClick={() => copyPrompt(demo.slug, demo.prompt)}
                          className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1 font-mono text-[11px] text-zinc-200 cursor-pointer hover:border-cyan-300 hover:text-cyan-300"
                        >
                          {copiedSlug === demo.slug ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" aria-hidden="true" />
                              Copy prompt
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-xs leading-6 text-zinc-300">{demo.prompt}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div className="flex flex-wrap gap-3 font-mono text-[11px] text-zinc-400">
                      <span>{demo.evidence.states}</span>
                      <span>·</span>
                      <span>{demo.evidence.responsive}</span>
                    </div>

                    <Link
                      href={`/demos/${demo.slug}`}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-cyan-300 px-6 font-mono text-xs font-semibold uppercase tracking-wider text-black no-underline transition-opacity hover:opacity-90"
                    >
                      Open Live Demo
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
