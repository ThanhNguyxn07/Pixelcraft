'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check, Copy, Terminal } from 'lucide-react';
import { ShaderStage } from './ShaderStage';
import { SmoothScroll } from './SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

export interface SkillDoc {
  slug: string;
  name: string;
  description: string;
  category: string;
  references: string[];
  scripts: string[];
}

const LOOP = [
  { num: '00', title: 'Plan', skill: 'pixelcraft-plan', desc: 'Map the real repository or score stacks on evidence before any visual styling.' },
  { num: '01', title: 'Frame', skill: 'pixelcraft', desc: 'Classify surface mode, real content inventory, unknowns, and platform constraints.' },
  { num: '02', title: 'Diverge', skill: 'pixelcraft-direction', desc: 'Generate 3–5 far-apart directions, score them, and commit one subject-derived signature.' },
  { num: '03', title: 'Specify', skill: 'pixelcraft-tokens + ux', desc: 'Export W3C DTCG OKLCH tokens and complete empty, loading, error, and keyboard states.' },
  { num: '04', title: 'Build', skill: 'pixelcraft-web / mobile / ...', desc: 'Translate idiomatically across 13 platform families without copying web assumptions.' },
  { num: '05', title: 'Verify', skill: 'pixelcraft-review + visual-qa', desc: 'Run slop-scan and Chromium style-inventory at 390px & 1440px with honest evidence labels.' },
];

export function ShowcaseHome({ skills }: { skills: SkillDoc[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        yPercent: 105,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.08,
        clearProps: 'transform,opacity',
      });

      gsap.from('.hero-fade', {
        y: 18,
        opacity: 0,
        duration: 0.75,
        delay: 0.3,
        ease: 'power3.out',
        stagger: 0.08,
        clearProps: 'transform,opacity',
      });

      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText('npx pixelcraft add all --agent codex');
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-[#050507] text-[#f5f5f7]">
      <SmoothScroll />

      {/* Minimal Awwwards-style floating header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#050507]/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-10">
          <Link href="/" className="flex items-center gap-3 text-[#f5f5f7] no-underline">
            <img
              src="/brand/logo-256.png"
              alt=""
              width={28}
              height={28}
              className="pixel-art block"
            />
            <span className="font-display text-sm font-bold tracking-[0.18em]">PIXELCRAFT</span>
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-6 sm:gap-9">
            <a href="#manifesto" className="hidden text-xs font-mono uppercase tracking-[0.14em] text-zinc-400 no-underline transition-colors hover:text-white sm:inline">
              Manifesto
            </a>
            <a href="#process" className="hidden text-xs font-mono uppercase tracking-[0.14em] text-zinc-400 no-underline transition-colors hover:text-white sm:inline">
              Process
            </a>
            <a href="#archive" className="hidden text-xs font-mono uppercase tracking-[0.14em] text-zinc-400 no-underline transition-colors hover:text-white md:inline">
              {skills.length} Skills
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white px-4 py-1.5 font-mono text-xs font-semibold text-black no-underline transition-opacity hover:opacity-90"
            >
              Docs
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* FULL-VIEWPORT MONUMENTAL WEBGL HERO */}
        <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-10 pt-24 sm:px-10 sm:pb-12 sm:pt-28">
          <ShaderStage />

          <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-200">
            <span className="hero-fade">PORTABLE AGENT SKILLS · V0.1.0</span>
            <span className="hero-fade hidden sm:inline">26 SKILLS · W3C DTCG · CHROMIUM QA</span>
          </div>

          <div className="relative z-10 mx-auto my-auto w-full max-w-[1440px] py-10">
            <h1 className="font-display text-[clamp(2.15rem,7.2vw,7.4rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white">
              <span className="hero-mask-line">
                <span className="hero-reveal block">CRAFT BEYOND</span>
              </span>
              <span className="hero-mask-line">
                <span className="hero-reveal block text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.9)]">
                  AI TEMPLATES.
                </span>
              </span>
            </h1>
          </div>

          <div className="hero-fade relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-8 border-t border-white/20 pt-7 lg:grid-cols-12">
            <p className="max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base lg:col-span-5">
              An open-source engineering loop that forces visual divergence, enforces a cross-platform accessibility floor, and verifies real browser output with evidence labels.
            </p>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-7 lg:justify-end">
              <button
                type="button"
                onClick={copyInstall}
                className="inline-flex h-12 items-center gap-3 rounded-full border border-white/20 bg-black/55 px-5 font-mono text-xs text-zinc-100 backdrop-blur-md cursor-pointer transition-colors hover:border-cyan-300"
              >
                <Terminal className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                <span>npx pixelcraft add all --agent codex</span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                )}
              </button>

              <Link
                href="/docs"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-cyan-300 px-6 font-mono text-xs font-semibold uppercase tracking-wider text-black no-underline transition-opacity hover:opacity-90"
              >
                Explore Documentation
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* EDITORIAL MANIFESTO */}
        <section id="manifesto" className="border-t border-white/10 px-5 py-24 sm:px-10 sm:py-36">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="scroll-reveal font-mono text-xs uppercase tracking-[0.18em] text-cyan-300 lg:col-span-3">
              01 / THE THESIS
            </div>
            <div className="scroll-reveal lg:col-span-9">
              <p className="font-display text-[clamp(1.9rem,4.5vw,4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
                Great interfaces are not generated by asking for “modern and clean.” They emerge from{' '}
                <span className="text-cyan-300">deliberate divergence</span>,{' '}
                <span className="text-amber-300">measurable craft</span>, and honest runtime verification.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4">
                {[
                  ['26', 'Self-contained skills'],
                  ['13', 'Platform ecosystems'],
                  ['OKLCH', 'W3C DTCG 2025.10'],
                  ['0', 'Hardcoded templates'],
                ].map(([val, label]) => (
                  <div key={label}>
                    <p className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {val}
                    </p>
                    <p className="mt-1 font-mono text-xs text-zinc-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EDITORIAL NUMBERED LOOP (NO 3-CARD BOXES) */}
        <section id="process" className="border-t border-white/10 px-5 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="scroll-reveal mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
                  02 / THE PIXELCRAFT LOOP
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-6xl">
                  Six stages. Zero guesswork.
                </h2>
              </div>
              <Link
                href="/docs/architecture"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 no-underline hover:text-cyan-300"
              >
                Read full architecture
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="border-t border-white/15">
              {LOOP.map((step) => (
                <div
                  key={step.num}
                  className="scroll-reveal group grid grid-cols-1 items-baseline gap-4 border-b border-white/15 py-7 transition-colors hover:bg-white/[0.025] sm:grid-cols-12 sm:px-4"
                >
                  <span className="font-mono text-sm text-cyan-300 sm:col-span-1">
                    {step.num}
                  </span>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:col-span-3 sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400 sm:col-span-5 sm:text-base">
                    {step.desc}
                  </p>
                  <div className="font-mono text-xs text-amber-300 sm:col-span-3 sm:text-right">
                    {step.skill}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 26-SKILL EDITORIAL ARCHIVE -> LINKS TO /docs/[slug] */}
        <section id="archive" className="border-t border-white/10 px-5 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="scroll-reveal mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
                  03 / SKILL ARCHIVE
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                  {skills.length} portable skills, live from source.
                </h2>
              </div>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white no-underline transition-colors hover:border-cyan-300 hover:text-cyan-300"
              >
                Open Docs Reader
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 border-t border-white/15 md:grid-cols-2">
              {skills.map((skill, i) => (
                <Link
                  key={skill.slug}
                  href={`/docs/${skill.slug}`}
                  className="scroll-reveal group flex items-start justify-between gap-4 border-b border-white/15 p-5 text-left no-underline transition-colors hover:bg-white/[0.03] md:odd:border-r"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs text-zinc-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <code className="font-mono text-sm font-semibold text-white group-hover:text-cyan-300">
                        {skill.name}
                      </code>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                        {skill.category}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                      {skill.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-zinc-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500">
          <div className="flex items-center gap-3 text-zinc-300">
            <img src="/brand/logo-256.png" alt="" width={22} height={22} className="pixel-art" />
            <span>PIXELCRAFT · MIT LICENSE</span>
          </div>
          <span>Next.js 15 · Three.js GLSL · GSAP · Lenis · W3C DTCG OKLCH</span>
        </div>
      </footer>
    </div>
  );
}
