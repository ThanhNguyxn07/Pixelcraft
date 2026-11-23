'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  Search,
  Layers,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { DEMOS } from '@/lib/demos';
import { SlopCompareCurtain } from './SlopCompareCurtain';

export interface SkillDoc {
  slug: string;
  name: string;
  description: string;
  category: string;
  references: string[];
  scripts: string[];
}

const REPO_URL = 'https://github.com/ThanhNguyxnOrg/Pixelcraft';

const INSTALL_TARGETS = [
  { id: 'claude', label: 'Claude', cmd: 'npx pixelcraft add all --agent claude' },
  { id: 'codex', label: 'Codex', cmd: 'npx pixelcraft add all --agent codex' },
  { id: 'cursor', label: 'Cursor', cmd: 'npx pixelcraft add all --agent cursor' },
  { id: 'gemini', label: 'Gemini', cmd: 'npx pixelcraft add all --agent gemini' },
  { id: 'windsurf', label: 'Windsurf', cmd: 'npx pixelcraft add all --agent windsurf' },
  { id: 'skills', label: 'skills CLI', cmd: 'npx skills add ThanhNguyxnOrg/Pixelcraft' },
] as const;

const DEVICE_MODES = [
  {
    id: 'desktop',
    label: '1440',
    title: 'Desktop 1440x900',
    icon: Monitor,
    frameClass: 'w-full aspect-[16/10]',
    overflow: '0 px',
    contrast: 'AA Pass',
    cls: '0.002',
  },
  {
    id: 'tablet',
    label: '768',
    title: 'Tablet 768x1024',
    icon: Tablet,
    frameClass: 'w-[74%] aspect-[4/3]',
    overflow: '0 px',
    contrast: 'AA Pass',
    cls: '0.004',
  },
  {
    id: 'mobile',
    label: '390',
    title: 'Mobile 390x844',
    icon: Smartphone,
    frameClass: 'w-[46%] aspect-[9/14]',
    overflow: '0 px',
    contrast: 'AA Pass',
    cls: '0.001',
  },
] as const;

const LOOP_STAGES = [
  {
    step: '01',
    name: 'Plan & Frame',
    skill: 'pixelcraft-plan',
    artifact: '.pixelcraft/plan.md',
    summary:
      'Audit the repository first in brownfield projects, or run a weighted stack matrix in greenfield work. Inventory real facts and media before sketching a single layout.',
    checks: ['Repo map & stack justification', 'Fact vs assumption classification', 'Authority order lock'],
  },
  {
    step: '02',
    name: 'Diverge Direction',
    skill: 'pixelcraft-direction',
    artifact: 'Direction Card + history.json',
    summary:
      'Generate 3 to 5 far-apart aesthetic worlds with explicit scoring, commit to one distinctive direction, and record why alternatives lost to stop template collapse.',
    checks: ['3-5 far-apart visual worlds', 'Anti-repetition history check', 'Subject-matched signature moment'],
  },
  {
    step: '03',
    name: 'Tokens & UX Matrix',
    skill: 'pixelcraft-tokens',
    artifact: 'tokens.json -> CSS / Native',
    summary:
      'Export zero-dependency DTCG 2025.10 tokens alongside full zero, empty, loading, error, offline, and permission states before writing UI chrome.',
    checks: ['export-tokens.mjs multi-platform', 'Complete UX state matrix', 'Semantic contrast roles'],
  },
  {
    step: '04',
    name: 'Build in Target Idiom',
    skill: 'pixelcraft-web',
    artifact: '14 Platform Skills',
    summary:
      'Translate the direction natively into Web, SwiftUI, Jetpack Compose, Flutter, Tauri, Electron, Textual/Ratatui TUI, Email, Spatial XR, or Game UI.',
    checks: ['19+ languages supported', 'No copied web assumptions', 'Live docs/version verification'],
  },
  {
    step: '05',
    name: 'Visual QA Finish Gate',
    skill: 'pixelcraft-visual-qa',
    artifact: 'style-inventory.mjs --finish-gate',
    summary:
      'Render in real Chromium at 390px, 768px, and 1440px. Measure horizontal overflow, broken images, missing alt text, CLS, and loaded document.fonts.',
    checks: ['390 / 768 / 1440 screenshots', 'document.fonts script check', 'Zero broken media gate'],
  },
  {
    step: '06',
    name: 'Slop Scan & Report',
    skill: 'pixelcraft-review',
    artifact: 'slop-scan.mjs (43 detectors)',
    summary:
      'Run 43 deterministic anti-slop detectors, fix defects in up to 3 bounded repair rounds, and attach honest evidence labels (rendered, static, not-checked).',
    checks: ['43 deterministic static rules', 'Up to 3 bounded repair rounds', 'Mandatory evidence labels'],
  },
] as const;

const SURFACE_COVERAGE = [
  { name: 'Web & SSR', detail: 'Next.js, React, Vue, Svelte, Astro, Rails, Laravel, Phoenix, Rust/Go' },
  { name: 'Mobile', detail: 'SwiftUI, UIKit, Jetpack Compose, Flutter, React Native, KMP, MAUI' },
  { name: 'Desktop', detail: 'Tauri, Electron, Qt/QML, WinUI/WPF, AppKit, GTK, Avalonia, Rust GUI' },
  { name: 'Data Apps', detail: 'Streamlit, Gradio, Reflex, NiceGUI, Dash, Observable, Shiny' },
  { name: 'Terminal UI', detail: 'Textual, Rich, Ink, Bubble Tea, Lip Gloss, Ratatui' },
  { name: 'Game & XR', detail: 'Unity UI Toolkit, Godot, Unreal UMG, Bevy, visionOS, WebXR' },
] as const;

export function ShowcaseHome({ skills }: { skills: SkillDoc[] }) {
  const [selectedAgent, setSelectedAgent] = useState<(typeof INSTALL_TARGETS)[number]['id']>('claude');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedSwatch, setCopiedSwatch] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<(typeof DEVICE_MODES)[number]['id']>('desktop');
  const [activeLoopIdx, setActiveLoopIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const activeAgent = INSTALL_TARGETS.find((a) => a.id === selectedAgent) ?? INSTALL_TARGETS[0];
  const activeDevice = DEVICE_MODES.find((d) => d.id === deviceMode) ?? DEVICE_MODES[0];
  const activeLoop = LOOP_STAGES[activeLoopIdx] ?? LOOP_STAGES[0];
  const featuredDemo = DEMOS[0];

  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category)));
    return ['All', ...unique];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return skills.filter((skill) => {
      const catOk = selectedCategory === 'All' || skill.category === selectedCategory;
      const qOk =
        !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [skills, selectedCategory, searchQuery]);

  async function handleCopyCmd() {
    try {
      await navigator.clipboard.writeText(activeAgent.cmd);
      setCopiedCmd(true);
      window.setTimeout(() => setCopiedCmd(false), 1800);
    } catch {
      setCopiedCmd(false);
    }
  }

  async function handleCopySwatch(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedSwatch(hex);
      window.setTimeout(() => setCopiedSwatch(null), 1400);
    } catch {
      setCopiedSwatch(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#0d0d0c]">
      {/* Floating Atelier Navigation */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full border border-[#ded9ce] bg-[#f7f5f0]/90 px-4 shadow-[0_8px_30px_rgba(13,13,12,0.06)] backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.14em] text-[#0d0d0c] uppercase"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#0d0d0c]"
              >
                <span className="h-2 w-2 rounded-xs bg-[#ff6542]" />
              </span>
              PIXELCRAFT
            </Link>
            <span className="hidden rounded-full border border-[#ded9ce] bg-[#ffffff] px-2.5 py-0.5 font-mono text-[10px] tracking-[0.06em] text-[#4a4741] sm:inline-block">
              v0.1.0 · {skills.length} skills
            </span>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
            <a
              href="#compare"
              className="hidden text-xs font-medium text-[#4a4741] transition-colors hover:text-[#0d0d0c] md:inline"
            >
              Compare
            </a>
            <a
              href="#loop"
              className="hidden text-xs font-medium text-[#4a4741] transition-colors hover:text-[#0d0d0c] md:inline"
            >
              Loop
            </a>
            <Link
              href="/gallery"
              className="text-xs font-medium text-[#4a4741] transition-colors hover:text-[#0d0d0c]"
            >
              Gallery
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

      <main id="main-content">
        {/* CHAPTER 1 (LIGHT IVORY): Cinematic Hero + Interactive 3-Viewport Live Stage */}
        <section className="atelier-grid-bg relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-12">
            {/* Left 6 cols: Manifesto + Real Multi-Agent CLI Dock */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ded9ce] bg-[#ffffff] px-3.5 py-1.5 font-mono text-[11px] text-[#4a4741] shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#167a4d]" aria-hidden="true" />
                <span>Portable Agent Skills · 43 Static Detectors · 10 Agent Hosts</span>
              </div>

              <h1 className="mt-6 font-serif text-[clamp(3.1rem,5.8vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.025em] text-[#0d0d0c]">
                Craft interfaces{' '}
                <em className="font-serif italic text-[#c83216]">verified in the browser.</em>
              </h1>

              <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.72] text-[#4a4741]">
                Pixelcraft is an open-source skill pack for coding agents. It forces visual
                divergence before code, applies a cross-platform WCAG AA floor across 14
                stacks, and ships evidence-labeled verification instead of AI templates.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/gallery"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0d0d0c] px-6 py-3 text-sm font-medium text-[#f6f4ef] shadow-[0_10px_28px_rgba(13,13,12,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#c83216]"
                >
                  Explore Live Gallery
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="#compare"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#cbc4b6] bg-[#ffffff] px-6 py-3 text-sm font-medium text-[#0d0d0c] transition-colors hover:border-[#0d0d0c]"
                >
                  Compare Slop vs Craft
                </a>
              </div>

              {/* Interactive Multi-Agent CLI Dock (Real Commands from ThanhNguyxnOrg/Pixelcraft) */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-[#ded9ce] bg-[#ffffff] shadow-[0_14px_40px_rgba(13,13,12,0.06)]">
                <div
                  role="tablist"
                  aria-label="Choose agent installer"
                  className="flex flex-nowrap items-center gap-1 overflow-x-auto border-b border-[#eeebe3] bg-[#f7f5f0]/80 p-1.5"
                >
                  {INSTALL_TARGETS.map((target) => {
                    const active = target.id === selectedAgent;
                    return (
                      <button
                        key={target.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setSelectedAgent(target.id);
                          setCopiedCmd(false);
                        }}
                        className={`relative shrink-0 rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium transition-colors ${
                          active
                            ? 'bg-[#0d0d0c] text-[#f6f4ef]'
                            : 'bg-transparent text-[#4a4741] hover:text-[#0d0d0c]'
                        }`}
                      >
                        <span className="relative z-10">{target.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5 overflow-x-auto">
                    <Terminal className="h-4 w-4 shrink-0 text-[#c83216]" aria-hidden="true" />
                    <code className="whitespace-nowrap font-mono text-xs text-[#0d0d0c]">
                      {activeAgent.cmd}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCmd}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#ded9ce] bg-[#f7f5f0] px-3.5 font-mono text-[11px] font-medium text-[#0d0d0c] transition-colors hover:border-[#0d0d0c] hover:bg-[#0d0d0c] hover:text-[#f6f4ef]"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#167a4d]" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right 6 cols: Interactive 3-Viewport Live Device Stage */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6"
            >
              <div className="rounded-[26px] border border-[#27272d] bg-[#0c0c0e] p-4 text-[#f6f4ef] shadow-[0_32px_80px_rgba(13,13,12,0.22)] sm:p-5">
                {/* Stage Header & Viewport Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272d] pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#34d399]" aria-hidden="true" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#f6f4ef]">
                      Finish Gate · {activeDevice.title}
                    </span>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Preview viewport width"
                    className="flex items-center gap-1 rounded-full border border-[#27272d] bg-[#151519] p-1"
                  >
                    {DEVICE_MODES.map((mode) => {
                      const Icon = mode.icon;
                      const active = mode.id === deviceMode;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setDeviceMode(mode.id)}
                          className={`relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${
                            active
                              ? 'bg-[#f6f4ef] text-[#0c0c0e]'
                              : 'bg-transparent text-[#a7a49c] hover:text-[#f6f4ef]'
                          }`}
                        >
                          <Icon className="relative z-10 h-3 w-3" aria-hidden="true" />
                          <span className="relative z-10">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Morphing Live Preview Frame */}
                <div className="mt-4 flex min-h-[300px] items-center justify-center rounded-2xl bg-[#151519] p-4 sm:min-h-[340px]">
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className={`${activeDevice.frameClass} relative overflow-hidden rounded-xl border border-[#2c2c34] bg-[#f6f2ea] shadow-[0_18px_50px_rgba(0,0,0,0.45)]`}
                  >
                    <img
                      src={featuredDemo.coverImage}
                      alt={featuredDemo.coverAlt}
                      width={1200}
                      height={750}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-[#0c0c0e] px-4 py-3 text-[#f6f4ef]">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#e5e0d5]">
                          Specimen 01 · Rendered
                        </p>
                        <p className="font-serif text-xl font-medium leading-tight sm:text-2xl">
                          Villa Solare
                        </p>
                      </div>
                      <Link
                        href={`/gallery/${featuredDemo.slug}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f6f4ef] px-3 py-1.5 font-mono text-[10px] font-semibold text-[#0c0c0e] transition-colors hover:bg-[#ff6542] hover:text-[#f6f4ef]"
                      >
                        Open
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Live Telemetry Bar */}
                <dl className="mt-4 grid grid-cols-3 gap-2 tabular-nums">
                  <div className="rounded-xl border border-[#27272d] bg-[#151519] px-3 py-2.5">
                    <dt className="font-mono text-[10px] uppercase text-[#a7a49c]">Overflow</dt>
                    <dd className="mt-0.5 font-display text-sm font-semibold text-[#34d399]">
                      {activeDevice.overflow}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-[#27272d] bg-[#151519] px-3 py-2.5">
                    <dt className="font-mono text-[10px] uppercase text-[#a7a49c]">Contrast</dt>
                    <dd className="mt-0.5 font-display text-sm font-semibold text-[#f6f4ef]">
                      {activeDevice.contrast}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-[#27272d] bg-[#151519] px-3 py-2.5">
                    <dt className="font-mono text-[10px] uppercase text-[#a7a49c]">CLS</dt>
                    <dd className="mt-0.5 font-display text-sm font-semibold text-[#f6f4ef]">
                      {activeDevice.cls}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CHAPTER 2 (DEEP OBSIDIAN): Signature Interactive Moment — Drag to Compare */}
        <section
          id="compare"
          className="obsidian-grid-bg border-y border-[#27272d] bg-[#0c0c0e] py-20 text-[#f6f4ef] sm:py-24"
        >
          <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
            <div className="flex flex-col justify-between gap-6 pb-10 lg:flex-row lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ff6542]">
                  01 / INTERACTIVE PROOF
                </p>
                <h2 className="mt-3 font-serif text-4xl font-medium leading-[1.02] text-[#f6f4ef] sm:text-5xl">
                  See what <em className="italic text-[#ff6542]">43 detectors</em> eliminate.
                </h2>
              </div>
              <p className="max-w-[50ch] text-sm leading-[1.7] text-[#a7a49c]">
                Pixelcraft treats AI design slop as an engineering failure—not a vague prompt
                wish. Drag the calibration curtain below to compare default agent output against
                a Pixelcraft-verified surface.
              </p>
            </div>

            <SlopCompareCurtain />

            {/* Real Metric Strip (100% factual from repo) */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 tabular-nums">
              {[
                { value: `${skills.length}`, label: 'Self-contained skills', icon: Layers },
                { value: '43', label: 'Static slop detectors', icon: ShieldCheck },
                { value: '19+', label: 'Languages routed', icon: Sparkles },
                { value: '10', label: 'Canonical agent hosts', icon: Terminal },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#27272d] bg-[#151519] p-5"
                  >
                    <Icon className="h-4 w-4 text-[#ff6542]" aria-hidden="true" />
                    <p className="mt-3 font-display text-3xl font-semibold text-[#f6f4ef]">
                      {item.value}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#a7a49c]">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CHAPTER 3 (LIGHT IVORY): Interactive 6-Stage Loop & Multi-Stack Matrix */}
        <section id="loop" className="bg-[#f7f5f0] py-20 sm:py-24">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
            <div className="flex flex-col justify-between gap-4 pb-10 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#c83216]">
                  02 / THE PIXELCRAFT LOOP
                </p>
                <h2 className="mt-2 font-serif text-4xl font-medium text-[#0d0d0c] sm:text-5xl">
                  Six steps from brief to{' '}
                  <em className="italic text-[#c83216]">rendered proof.</em>
                </h2>
              </div>
              <Link
                href="/docs/architecture"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#0d0d0c] underline decoration-[#cbc4b6] hover:text-[#c83216]"
              >
                Read Architecture Spec
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left 5 cols: Step Selector */}
              <div className="space-y-2 lg:col-span-5" role="tablist" aria-label="Pixelcraft loop stages">
                {LOOP_STAGES.map((stage, idx) => {
                  const active = idx === activeLoopIdx;
                  return (
                    <button
                      key={stage.step}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveLoopIdx(idx)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all ${
                        active
                          ? 'border-[#0d0d0c] bg-[#0d0d0c] text-[#f6f4ef] shadow-[0_14px_34px_rgba(13,13,12,0.14)]'
                          : 'border-[#ded9ce] bg-[#ffffff] text-[#0d0d0c] hover:border-[#0d0d0c]/40'
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            active ? 'text-[#ff6542]' : 'text-[#625e56]'
                          }`}
                        >
                          {stage.step}
                        </span>
                        <span className="font-display text-base font-semibold">{stage.name}</span>
                      </span>
                      <span
                        className={`font-mono text-[11px] ${
                          active ? 'text-[#a7a49c]' : 'text-[#625e56]'
                        }`}
                      >
                        {stage.skill}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right 7 cols: Animated Stage Detail Panel */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLoop.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.24 }}
                    className="flex h-full flex-col justify-between rounded-[24px] border border-[#ded9ce] bg-[#ffffff] p-7 shadow-[0_18px_50px_rgba(13,13,12,0.06)] sm:p-9"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eeebe3] pb-4">
                        <span className="font-mono text-xs font-semibold text-[#c83216]">
                          STAGE {activeLoop.step}
                        </span>
                        <code className="rounded-full border border-[#ded9ce] bg-[#f7f5f0] px-3 py-1 font-mono text-[11px] text-[#0d0d0c]">
                          {activeLoop.artifact}
                        </code>
                      </div>

                      <h3 className="mt-6 font-serif text-3xl font-medium text-[#0d0d0c] sm:text-4xl">
                        {activeLoop.name}
                      </h3>
                      <p className="mt-4 text-[15px] leading-[1.75] text-[#4a4741]">
                        {activeLoop.summary}
                      </p>

                      <ul className="mt-6 space-y-2.5">
                        {activeLoop.checks.map((check) => (
                          <li
                            key={check}
                            className="flex items-center gap-2.5 text-sm font-medium text-[#0d0d0c]"
                          >
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#167a4d]/12 text-[#167a4d]">
                              <Check className="h-3 w-3" aria-hidden="true" />
                            </span>
                            {check}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-[#eeebe3] pt-5">
                      <span className="font-mono text-xs text-[#625e56]">
                        Skill: {activeLoop.skill}
                      </span>
                      <Link
                        href={`/docs/${activeLoop.skill}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0d0d0c] px-4 py-2 font-mono text-xs font-medium text-[#f6f4ef] transition-colors hover:bg-[#c83216]"
                      >
                        Open Skill Spec
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Multi-Stack Coverage Ribbon */}
            <div className="mt-14 rounded-[24px] border border-[#ded9ce] bg-[#ffffff] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eeebe3] pb-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#c83216]">
                  MULTI-STACK COVERAGE · NOT JUST REACT &amp; TAILWIND
                </p>
                <span className="font-mono text-xs text-[#625e56]">
                  Native idioms per platform
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {SURFACE_COVERAGE.map((surface) => (
                  <div key={surface.name} className="space-y-1">
                    <h3 className="font-display text-sm font-semibold text-[#0d0d0c]">
                      {surface.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#4a4741]">{surface.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 4 (DEEP OBSIDIAN): Live Gallery Exhibition */}
        <section
          id="gallery-preview"
          className="border-y border-[#27272d] bg-[#0c0c0e] py-20 text-[#f6f4ef] sm:py-24"
        >
          <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
            <div className="flex flex-col justify-between gap-4 pb-10 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ff6542]">
                  03 / LIVE GALLERY
                </p>
                <h2 className="mt-2 font-serif text-4xl font-medium text-[#f6f4ef] sm:text-5xl">
                  Hand-crafted specimens,{' '}
                  <em className="italic text-[#ff6542]">one at a time.</em>
                </h2>
              </div>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#f6f4ef] underline decoration-[#52525b] hover:text-[#ff6542]"
              >
                Open Full Gallery &amp; Verbatim Prompts
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 overflow-hidden rounded-[26px] border border-[#27272d] bg-[#151519] lg:grid-cols-12">
              <Link
                href={`/gallery/${featuredDemo.slug}`}
                className="group relative aspect-[16/10] overflow-hidden bg-[#1e1e24] lg:col-span-6 lg:aspect-auto"
              >
                <img
                  src={featuredDemo.coverImage}
                  alt={featuredDemo.coverAlt}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </Link>

              <div className="flex flex-col justify-between p-7 sm:p-9 lg:col-span-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#a7a49c]">
                    <span className="text-[#ff6542]">
                      PIECE {featuredDemo.code} · {featuredDemo.category}
                    </span>
                    <span>{featuredDemo.mode}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-3xl font-medium text-[#f6f4ef]">
                    {featuredDemo.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.72] text-[#a7a49c]">
                    {featuredDemo.subtitle}
                  </p>

                  {/* Click-to-copy Swatches */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredDemo.swatches.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => handleCopySwatch(swatch.hex)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#27272d] bg-[#0c0c0e] px-3 py-1.5 font-mono text-[11px] text-[#f6f4ef] transition-colors hover:border-[#ff6542]"
                      >
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 rounded-full border border-white/25"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span>{copiedSwatch === swatch.hex ? 'Copied!' : swatch.hex}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl border border-[#27272d] bg-[#0c0c0e] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#a7a49c]">
                      Verbatim Skill Prompt
                    </p>
                    <p className="mt-2 line-clamp-3 font-mono text-xs leading-relaxed text-[#d6d3cb]">
                      {featuredDemo.prompt}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#27272d] pt-5">
                  <Link
                    href={`/gallery/${featuredDemo.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f6f4ef] px-5 py-2.5 text-sm font-semibold text-[#0c0c0e] transition-colors hover:bg-[#ff6542] hover:text-[#f6f4ef]"
                  >
                    Launch Live Demo
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/gallery"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#3a3a42] px-5 py-2.5 text-sm font-medium text-[#f6f4ef] transition-colors hover:border-[#f6f4ef]"
                  >
                    Copy Full Prompt
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 5 (LIGHT IVORY): Complete 26-Skill Directory */}
        <section id="skills" className="bg-[#f7f5f0] py-20 sm:py-24">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
            <div className="flex flex-col justify-between gap-6 border-b border-[#ded9ce] pb-8 lg:flex-row lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#c83216]">
                  04 / COMPLETE SPECIFICATION
                </p>
                <h2 className="mt-2 font-serif text-4xl font-medium text-[#0d0d0c] sm:text-5xl">
                  All {skills.length} self-contained skills.
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    const active = cat === selectedCategory;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium transition-colors ${
                          active
                            ? 'bg-[#0d0d0c] text-[#f6f4ef]'
                            : 'border border-[#ded9ce] bg-[#ffffff] text-[#4a4741] hover:border-[#0d0d0c] hover:text-[#0d0d0c]'
                        }`}
                      >
                        <span className="relative z-10">{cat}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <label htmlFor="skill-search" className="sr-only">
                    Filter skills by name or description
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#625e56]"
                    aria-hidden="true"
                  />
                  <input
                    id="skill-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter 26 skills..."
                    className="min-h-10 w-full rounded-full border border-[#cbc4b6] bg-[#ffffff] py-2 pl-9 pr-4 font-mono text-xs text-[#0d0d0c] placeholder:text-[#625e56] sm:w-56"
                  />
                </div>
              </div>
            </div>

            {filteredSkills.length === 0 ? (
              <div className="py-14 text-center">
                <p className="font-mono text-sm text-[#4a4741]">
                  No skills match &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-full bg-[#0d0d0c] px-5 py-2 font-mono text-xs text-[#f6f4ef] hover:bg-[#c83216]"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredSkills.map((skill, idx) => (
                  <Link
                    key={skill.slug}
                    href={`/docs/${skill.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-[#ded9ce] bg-[#ffffff] p-5 transition-all hover:-translate-y-0.5 hover:border-[#0d0d0c] hover:shadow-[0_14px_34px_rgba(13,13,12,0.07)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-[#0d0d0c] group-hover:text-[#c83216]">
                          {skill.name}
                        </span>
                        <span className="rounded-full bg-[#f7f5f0] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#4a4741]">
                          {skill.category}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4a4741]">
                        {skill.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#eeebe3] pt-3 font-mono text-[11px] text-[#625e56]">
                      <span className="tabular-nums">
                        {String(idx + 1).padStart(2, '0')} · {skill.references.length} refs
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-[#0d0d0c] group-hover:text-[#c83216]">
                        Read Spec
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ded9ce] bg-[#ffffff]">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-8">
          <p className="font-mono text-xs text-[#4a4741]">
            PIXELCRAFT · MIT License · ThanhNguyxnOrg/Pixelcraft
          </p>
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#4a4741]">
            <Link href="/gallery" className="hover:text-[#0d0d0c]">
              Gallery
            </Link>
            <Link href="/docs" className="hover:text-[#0d0d0c]">
              Docs
            </Link>
            <Link href="/docs/architecture" className="hover:text-[#0d0d0c]">
              Architecture
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0d0d0c]"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
