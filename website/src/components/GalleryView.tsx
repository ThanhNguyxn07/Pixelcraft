'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, Copy, Layers, ShieldCheck, Terminal } from 'lucide-react';
import { DEMOS, type DemoEntry } from '@/lib/demos';

function DemoMiniPreview({ demo }: { demo: DemoEntry }) {
  if (demo.slug === 'kuro-synth') {
    return (
      <div className="relative flex h-56 flex-col justify-between overflow-hidden bg-[#09090b] p-5 text-white">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <span>KURO-01 / FIELD SYNTH</span>
          <span className="text-[#ff4d00]">● 440 HZ LIVE</span>
        </div>
        <div className="my-auto">
          <p className="font-display text-4xl font-extrabold leading-none tracking-[-0.04em]">
            PURE ANALOG
          </p>
          <svg viewBox="0 0 360 56" className="mt-3 h-12 w-full" aria-hidden="true">
            <path
              d="M0 28 Q 22 4, 45 28 T 90 28 T 135 28 T 180 28 T 225 28 T 270 28 T 315 28 T 360 28"
              fill="none"
              stroke="#ff4d00"
              strokeWidth="2.5"
            />
            <line x1="0" y1="28" x2="360" y2="28" stroke="rgba(255,255,255,0.14)" strokeDasharray="3 4" />
          </svg>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[10px] text-zinc-400">
          <span>SAW · PULSE · FM SUB</span>
          <span className="text-white">ANODIZED 6061-T6</span>
        </div>
      </div>
    );
  }

  if (demo.slug === 'veridian-trace') {
    return (
      <div className="relative flex h-56 flex-col justify-between overflow-hidden bg-[#0a0c10] p-5 text-zinc-100">
        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
          <span className="font-semibold text-white">VERIDIAN TRACE</span>
          <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-400">
            99.94% OK · 5 STATES
          </span>
        </div>
        <div className="my-auto space-y-2 font-mono text-[10px]">
          {[
            ['POST /v2/checkout/authorize', '142 ms', 'w-[74%]', 'bg-emerald-400'],
            ['db.query: ledger_locks', '68 ms', 'w-[42%]', 'bg-cyan-400'],
            ['stripe.intent.confirm', '214 ms', 'w-[88%]', 'bg-rose-400'],
          ].map(([span, dur, width, color]) => (
            <div key={span} className="rounded border border-white/10 bg-[#11151c] p-2">
              <div className="flex justify-between text-zinc-300">
                <span className="truncate">{span}</span>
                <span className="text-zinc-400">{dur}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10">
                <div className={`h-full rounded-full ${width} ${color}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
          <span>LIVE · LOADING · EMPTY · STALE · ERROR</span>
          <span>TABULAR NUMS</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-56 flex-col justify-between overflow-hidden bg-[#f7f5f0] p-5 text-[#141413]">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-stone-600">
        <span className="font-bold text-[#141413]">KŌBŌ STUDIO</span>
        <span className="rounded border border-[#1d4ed8]/30 px-1.5 py-0.5 text-[#1d4ed8]">
          EN / TIẾNG VIỆT
        </span>
      </div>
      <div className="my-auto grid grid-cols-12 items-end gap-3">
        <div className="col-span-7">
          <p className="font-serif text-2xl font-bold leading-tight tracking-tight text-[#141413]">
            Stoneware &amp; Spatial Monographs
          </p>
          <p className="mt-1.5 text-xs text-stone-600">
            Editorial light commerce · Accessible checkout recovery
          </p>
        </div>
        <div className="col-span-5 space-y-1.5">
          <div className="h-14 rounded-sm border border-stone-300 bg-[#ece7dd] p-2 font-mono text-[9px] text-stone-700">
            01 · Shigaraki Vessel
          </div>
          <div className="rounded-sm bg-[#1d4ed8] px-2 py-1 text-center font-mono text-[10px] font-semibold text-white">
            Add to bag · $140
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-stone-300 pt-2 font-mono text-[10px] text-stone-600">
        <span>LIGHT-FIRST OKLCH</span>
        <span>WCAG AA · ROLE=ALERT</span>
      </div>
    </div>
  );
}

export function GalleryView() {
  const [themeFilter, setThemeFilter] = useState<'all' | 'dark' | 'light'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const visibleDemos = useMemo(() => {
    if (themeFilter === 'all') return DEMOS;
    return DEMOS.filter((d) => d.theme === themeFilter);
  }, [themeFilter]);

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
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-10">
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

      <main id="main-content" className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/10 pb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              LIVE INTERACTIVE BENCHMARK · {DEMOS.length} FULL-PAGE DEMOS
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.035em] text-white sm:text-6xl">
              Same skills. Zero template repeat.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Every demo below is a standalone, interactive full-page application—not a static screenshot. Copy the exact prompt to reproduce it with Pixelcraft skills, or click <strong className="text-white">Open Live Demo</strong> to test every interaction yourself.
            </p>
          </div>

          <div className="flex items-center gap-1.5" role="group" aria-label="Filter demos by surface theme">
            {(['all', 'dark', 'light'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setThemeFilter(mode)}
                aria-pressed={themeFilter === mode}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors ${
                  themeFilter === mode
                    ? 'border-cyan-300 bg-cyan-300 font-semibold text-black'
                    : 'border-white/15 bg-white/[0.03] text-zinc-400 hover:text-white'
                }`}
              >
                {mode === 'all' ? `All (${DEMOS.length})` : mode}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {visibleDemos.map((demo) => (
            <article
              key={demo.slug}
              className="overflow-hidden rounded-xl border border-white/15 bg-[#0b0b0f]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual preview column */}
                <div className="border-b border-white/10 lg:col-span-5 lg:border-b-0 lg:border-r">
                  <DemoMiniPreview demo={demo} />
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
                      <span className="ml-1 font-mono text-[11px] text-zinc-500">
                        {demo.theme.toUpperCase()} · {demo.mode}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      {demo.evidence.contrast}
                    </span>
                  </div>
                </div>

                {/* Details + Exact Prompt + Open Live Demo button */}
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-cyan-300">{demo.code}</span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                          {demo.category}
                        </span>
                      </div>
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

                    {/* Exact Prompt Box */}
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
                              Copied prompt
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

                  {/* Action Row: Evidence + Open Live Demo button */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div className="flex flex-wrap gap-3 font-mono text-[11px] text-zinc-400">
                      <span>slop-scan: {demo.evidence.slopScan}</span>
                      <span>·</span>
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
