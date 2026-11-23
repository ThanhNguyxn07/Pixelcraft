'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DEMOS } from '@/lib/demos';

export interface SkillDoc {
  slug: string;
  name: string;
  description: string;
  category: string;
  references: string[];
  scripts: string[];
}

const AGENTS = [
  { id: 'codex', label: 'Codex', cmd: 'npx github:ThanhNguyxn07/Pixelcraft install codex' },
  { id: 'claude-code', label: 'Claude Code', cmd: 'npx github:ThanhNguyxn07/Pixelcraft install claude-code' },
  { id: 'cursor', label: 'Cursor', cmd: 'npx github:ThanhNguyxn07/Pixelcraft install cursor' },
  { id: 'gemini-cli', label: 'Gemini CLI', cmd: 'npx github:ThanhNguyxn07/Pixelcraft install gemini-cli' },
  { id: 'windsurf', label: 'Windsurf', cmd: 'npx github:ThanhNguyxn07/Pixelcraft install windsurf' },
] as const;

const DISCIPLINE_STAGES = [
  {
    id: 'unconstrained',
    index: '01',
    title: 'Unconstrained Agent',
    verdict: 'Design theater',
    evidence: 'static',
    summary:
      'Without a design contract or deterministic checks, coding agents default to dark-mode gradients, uniform 3-card grids, unstyled OS sliders, and silent fallback fonts.',
    rows: [
      { label: 'Visual direction', value: 'Generic dark glassmorphism & cyan/purple glow', status: 'fail' },
      { label: 'Media integrity', value: 'Empty gray boxes or broken placeholder URLs', status: 'fail' },
      { label: 'Font verification', value: 'CSS declared only — silent fallback to Times/Arial', status: 'fail' },
      { label: 'Responsive check', value: 'Desktop assumption — mobile clipping & overflow', status: 'fail' },
    ],
  },
  {
    id: 'specified',
    index: '02',
    title: 'Direction + DTCG Tokens',
    verdict: 'Authored system',
    evidence: 'static',
    summary:
      'Pixelcraft forces a written brief, 3–5 far-apart visual directions, and exported DTCG tokens before a single component is written—eliminating template collapse.',
    rows: [
      { label: 'Design contract', value: '.pixelcraft/plan.md + scored Direction Card', status: 'pass' },
      { label: 'Token pipeline', value: 'Zero-dependency export-tokens.mjs -> CSS / Tailwind / Native', status: 'pass' },
      { label: 'Static anti-slop', value: '43 deterministic rules in slop-scan.mjs (layout, type, a11y)', status: 'pass' },
      { label: 'Platform fidelity', value: 'Target-specific idioms across 14 platform skills', status: 'pass' },
    ],
  },
  {
    id: 'verified',
    index: '03',
    title: '3-Viewport Finish Gate',
    verdict: 'Evidence-verified',
    evidence: 'rendered',
    summary:
      'Before reporting completion, the agent captures real Chromium renders at 1440px, 768px, and 390px, inspects document.fonts, checks overflow/images, and repairs in bounded batches.',
    rows: [
      { label: 'Multi-viewport pass', value: '390x844 · 768x1024 · 1440x900 horizontal overflow = 0', status: 'pass' },
      { label: 'Rendered fonts', value: 'document.fonts verified loaded for active script', status: 'pass' },
      { label: 'Browser surfaces', value: '::selection, caret-color, :focus-visible, tabular-nums', status: 'pass' },
      { label: 'Evidence labels', value: 'Every claim tagged rendered, static, or not-checked', status: 'pass' },
    ],
  },
] as const;

const LOOP_STAGES = [
  {
    step: '01',
    name: 'Plan & Frame',
    skill: 'pixelcraft-plan',
    artifact: '.pixelcraft/plan.md',
    detail: 'Audit the repo, lock the stack decision, inventory real assets, and classify every fact before touching layout.',
  },
  {
    step: '02',
    name: 'Diverge Direction',
    skill: 'pixelcraft-direction',
    artifact: 'Direction Card + history.json',
    detail: 'Generate 3–5 genuinely distinct aesthetic worlds, score them against the subject, and commit to one.',
  },
  {
    step: '03',
    name: 'Tokens & UX Matrix',
    skill: 'pixelcraft-tokens',
    artifact: 'tokens.json -> tokens.css',
    detail: 'Export DTCG color, type, spacing, and motion tokens alongside zero/empty/error/loading UX states.',
  },
  {
    step: '04',
    name: 'Build in Target Idiom',
    skill: 'pixelcraft-web',
    artifact: '14 Platform Skills',
    detail: 'Implement natively for Web, iOS/Android, Desktop, TUI, Data Apps, Email, Spatial, or Game UI.',
  },
  {
    step: '05',
    name: 'Visual QA & Finish Gate',
    skill: 'pixelcraft-visual-qa',
    artifact: 'style-inventory.mjs --finish-gate',
    detail: 'Render in Chromium at 390 / 768 / 1440px, verify loaded fonts, broken images, CLS, and contrast.',
  },
  {
    step: '06',
    name: 'Static Slop Review',
    skill: 'pixelcraft-review',
    artifact: 'slop-scan.mjs (43 rules)',
    detail: 'Run deterministic anti-slop scanning, fix findings in up to 3 bounded rounds, and report with evidence labels.',
  },
] as const;

export function ShowcaseHome({ skills }: { skills: SkillDoc[] }) {
  const [selectedAgent, setSelectedAgent] = useState<(typeof AGENTS)[number]['id']>('codex');
  const [copied, setCopied] = useState(false);
  const [activeStage, setActiveStage] = useState<(typeof DISCIPLINE_STAGES)[number]['id']>('verified');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const activeAgent = AGENTS.find((a) => a.id === selectedAgent) ?? AGENTS[0];
  const currentStage =
    DISCIPLINE_STAGES.find((s) => s.id === activeStage) ?? DISCIPLINE_STAGES[2];
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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activeAgent.cmd);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#141311]">
      {/* Editorial Masthead */}
      <header className="sticky top-0 z-40 border-b border-[#d8d2c6] bg-[#f4f1ea]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1380px] items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.14em] text-[#141311] uppercase"
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 bg-[#c23114]"
              />
              PIXELCRAFT
            </Link>
            <span className="hidden border-l border-[#d8d2c6] pl-3 font-mono text-[11px] tracking-[0.08em] text-[#59554d] sm:inline">
              SPEC v1.0 · 26 SKILLS
            </span>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-5 sm:gap-7">
            <a
              href="#discipline"
              className="hidden text-xs font-medium tracking-[0.04em] text-[#524e47] transition-colors hover:text-[#141311] md:inline"
            >
              Discipline
            </a>
            <a
              href="#loop"
              className="hidden text-xs font-medium tracking-[0.04em] text-[#524e47] transition-colors hover:text-[#141311] md:inline"
            >
              Loop
            </a>
            <Link
              href="/gallery"
              className="text-xs font-medium tracking-[0.04em] text-[#524e47] transition-colors hover:text-[#141311]"
            >
              Gallery
            </Link>
            <Link
              href="/docs"
              className="text-xs font-medium tracking-[0.04em] text-[#524e47] transition-colors hover:text-[#141311]"
            >
              Docs
            </Link>
            <a
              href="https://github.com/ThanhNguyxn07/Pixelcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#141311] bg-[#141311] px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.04em] text-[#faf8f3] transition-colors hover:bg-[#b82d12] hover:border-[#b82d12]"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Spread — Swiss-Japanese Editorial Calibration Grid */}
        <section className="border-b border-[#d8d2c6]">
          <div className="mx-auto grid max-w-[1380px] grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Manifesto & Multi-Agent Install */}
            <div className="flex flex-col justify-between px-4 py-10 sm:px-8 lg:col-span-7 lg:border-r lg:border-[#d8d2c6] lg:py-12 lg:pr-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b82d12]">
                  Portable Agent Skills · 43 Static Detectors · 3-Viewport Gate
                </p>

                <h1 className="mt-4 font-serif text-[clamp(2.85rem,5.3vw,4.95rem)] font-medium leading-[0.97] tracking-[-0.025em] text-[#141311]">
                  Interfaces that hold up{' '}
                  <em className="font-serif italic text-[#b82d12]">in the real browser.</em>
                </h1>

                <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.68] text-[#45413b]">
                  Pixelcraft is an open specification and visual verification kit for coding
                  agents. It replaces generic AI templates with explicit visual direction,
                  DTCG tokens, real media, and Chromium finish-gate evidence.
                </p>

                {/* Primary Actions */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/gallery"
                    className="inline-flex min-h-11 items-center gap-2 bg-[#141311] px-5 py-2.5 text-sm font-medium text-[#faf8f3] transition-colors hover:bg-[#b82d12]"
                  >
                    Open Live Gallery
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex min-h-11 items-center gap-2 border border-[#b8b0a1] bg-[#faf8f3] px-5 py-2.5 text-sm font-medium text-[#141311] transition-colors hover:border-[#141311]"
                  >
                    Read 26 Skill Specs
                  </Link>
                </div>
              </div>

              {/* Multi-Agent Install Ledger */}
              <div className="mt-9 border border-[#d8d2c6] bg-[#faf8f3]">
                <div
                  role="tablist"
                  aria-label="Target coding agent"
                  className="flex flex-nowrap overflow-x-auto border-b border-[#d8d2c6]"
                >
                  {AGENTS.map((agent) => {
                    const active = agent.id === selectedAgent;
                    return (
                      <button
                        key={agent.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setSelectedAgent(agent.id);
                          setCopied(false);
                        }}
                        className={`min-h-10 shrink-0 border-r border-[#d8d2c6] px-3.5 py-2 font-mono text-[11px] tracking-[0.04em] transition-colors ${
                          active
                            ? 'bg-[#141311] text-[#faf8f3]'
                            : 'bg-transparent text-[#524e47] hover:bg-[#eae5da] hover:text-[#141311]'
                        }`}
                      >
                        {agent.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <code className="overflow-x-auto font-mono text-xs text-[#141311]">
                    <span className="mr-2 select-none text-[#b82d12]">$</span>
                    {activeAgent.cmd}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center border border-[#b8b0a1] bg-[#f4f1ea] px-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#141311] transition-colors hover:border-[#141311] hover:bg-[#141311] hover:text-[#faf8f3]"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Proof Specimen (Plate 01) */}
            <div className="flex flex-col justify-between bg-[#eae5da]/55 px-4 py-10 sm:px-8 lg:col-span-5 lg:py-12">
              <div>
                <div className="flex items-center justify-between border-b border-[#d8d2c6] pb-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#524e47]">
                  <span>PLATE 01 · LIVE PROOF</span>
                  <span className="text-[#1a6646]">EVIDENCE: RENDERED</span>
                </div>

                <Link
                  href={`/gallery/${featuredDemo.slug}`}
                  className="group mt-4 block overflow-hidden border border-[#d8d2c6] bg-[#faf8f3]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ded8cb]">
                    <img
                      src={featuredDemo.coverImage}
                      alt={featuredDemo.coverAlt}
                      width={1200}
                      height={750}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-[#d8d2c6] px-4 py-3">
                    <div>
                      <p className="font-serif text-lg font-medium text-[#141311]">
                        {featuredDemo.title}
                      </p>
                      <p className="font-mono text-[11px] text-[#59554d]">
                        {featuredDemo.category} · {featuredDemo.techStack.slice(0, 3).join(' · ')}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-medium text-[#b82d12] transition-transform group-hover:translate-x-0.5">
                      Open ↗
                    </span>
                  </div>
                </Link>
              </div>

              {/* Measurable Telemetry Strip */}
              <dl className="mt-6 grid grid-cols-2 border border-[#d8d2c6] bg-[#faf8f3] tabular-nums sm:grid-cols-4">
                <div className="border-b border-r border-[#d8d2c6] p-3 sm:border-b-0">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#59554d]">
                    Skills
                  </dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-[#141311]">
                    {skills.length}
                  </dd>
                </div>
                <div className="border-b border-[#d8d2c6] p-3 sm:border-b-0 sm:border-r">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#59554d]">
                    Detectors
                  </dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-[#141311]">43</dd>
                </div>
                <div className="border-r border-[#d8d2c6] p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#59554d]">
                    Viewports
                  </dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-[#141311]">3</dd>
                </div>
                <div className="p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#59554d]">
                    Platforms
                  </dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-[#141311]">14</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Section 01: Interactive Anti-Slop Discipline Inspector */}
        <section id="discipline" className="border-b border-[#d8d2c6]">
          <div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b82d12]">
                  01 / ANTI-LAZINESS DISCIPLINE
                </p>
                <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-[#141311] sm:text-4xl">
                  From design theater to{' '}
                  <em className="italic">measured craft.</em>
                </h2>
                <p className="mt-4 text-sm leading-[1.7] text-[#45413b]">
                  Most agents write ambitious plans and still ship uniform cards, unloaded fonts,
                  or raw browser controls. Pixelcraft enforces deterministic gates at every stage.
                </p>

                <div
                  role="tablist"
                  aria-label="Calibration stages"
                  className="mt-7 flex flex-col border-t border-[#d8d2c6]"
                >
                  {DISCIPLINE_STAGES.map((stage) => {
                    const active = stage.id === activeStage;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveStage(stage.id)}
                        className={`flex min-h-12 items-center justify-between border-b border-[#d8d2c6] px-3 py-3 text-left transition-colors ${
                          active
                            ? 'bg-[#141311] text-[#faf8f3]'
                            : 'bg-transparent text-[#141311] hover:bg-[#eae5da]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs ${
                              active ? 'text-[#f29b88]' : 'text-[#59554d]'
                            }`}
                          >
                            {stage.index}
                          </span>
                          <span className="font-display text-sm font-medium">{stage.title}</span>
                        </span>
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.08em] ${
                            active ? 'text-[#faf8f3]' : 'text-[#59554d]'
                          }`}
                        >
                          {stage.verdict}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="border border-[#d8d2c6] bg-[#faf8f3]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d8d2c6] bg-[#eae5da]/60 px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-[#b82d12]">
                        STAGE {currentStage.index}
                      </span>
                      <span className="font-display text-sm font-semibold text-[#141311]">
                        {currentStage.title}
                      </span>
                    </div>
                    <span className="border border-[#b8b0a1] bg-[#f4f1ea] px-2.5 py-0.5 font-mono text-[11px] text-[#141311]">
                      evidence: {currentStage.evidence}
                    </span>
                  </div>

                  <p className="border-b border-[#d8d2c6] px-5 py-4 text-sm leading-[1.68] text-[#45413b]">
                    {currentStage.summary}
                  </p>

                  <div className="divide-y divide-[#d8d2c6]">
                    {currentStage.rows.map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-12 sm:items-center"
                      >
                        <div className="font-mono text-xs uppercase tracking-[0.06em] text-[#59554d] sm:col-span-4">
                          {row.label}
                        </div>
                        <div className="text-sm text-[#141311] sm:col-span-6">{row.value}</div>
                        <div className="sm:col-span-2 sm:text-right">
                          <span
                            className={`inline-block px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${
                              row.status === 'pass'
                                ? 'bg-[#1a6646]/12 text-[#1a6646]'
                                : 'bg-[#c23114]/12 text-[#b82d12]'
                            }`}
                          >
                            {row.status === 'pass' ? 'Verified' : 'Blocked'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: The 6-Stage Pixelcraft Loop */}
        <section id="loop" className="border-b border-[#d8d2c6] bg-[#faf8f3]">
          <div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-8 lg:py-20">
            <div className="flex flex-col justify-between gap-4 border-b border-[#d8d2c6] pb-6 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b82d12]">
                  02 / EXECUTION PROTOCOL
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-[#141311] sm:text-4xl">
                  The 6-stage Pixelcraft loop.
                </h2>
              </div>
              <Link
                href="/docs/architecture"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[#141311] underline decoration-[#b8b0a1] hover:text-[#b82d12]"
              >
                Read Full Architecture →
              </Link>
            </div>

            <div className="grid grid-cols-1 border-l border-[#d8d2c6] md:grid-cols-2 lg:grid-cols-3">
              {LOOP_STAGES.map((item) => (
                <article
                  key={item.step}
                  className="flex flex-col justify-between border-b border-r border-[#d8d2c6] p-6 transition-colors hover:bg-[#f4f1ea]"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-[#59554d]">
                      <span className="font-semibold text-[#b82d12]">{item.step}</span>
                      <span>{item.artifact}</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-[#141311]">
                      {item.name}
                    </h3>
                    <p className="mt-2.5 text-sm leading-[1.65] text-[#45413b]">{item.detail}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#d8d2c6]/70">
                    <Link
                      href={`/docs/${item.skill}`}
                      className="font-mono text-xs text-[#141311] hover:text-[#b82d12]"
                    >
                      {item.skill} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 03: Live Gallery Proof Specimen */}
        <section id="proof" className="border-b border-[#d8d2c6]">
          <div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-8 lg:py-20">
            <div className="flex flex-col justify-between gap-4 border-b border-[#d8d2c6] pb-6 md:flex-row md:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b82d12]">
                  03 / LIVE GALLERY
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-[#141311] sm:text-4xl">
                  Built one specimen at a time.
                </h2>
              </div>
              <Link
                href="/gallery"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[#141311] underline decoration-[#b8b0a1] hover:text-[#b82d12]"
              >
                Open Full Gallery & Verbatim Prompts →
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 border border-[#d8d2c6] bg-[#faf8f3] lg:grid-cols-12">
              <div className="relative aspect-[16/10] bg-[#ded8cb] lg:col-span-6 lg:aspect-auto">
                <img
                  src={featuredDemo.coverImage}
                  alt={featuredDemo.coverAlt}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#59554d]">
                    <span>PIECE {featuredDemo.code} · {featuredDemo.category}</span>
                    <span>{featuredDemo.mode}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-medium text-[#141311] sm:text-3xl">
                    {featuredDemo.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.7] text-[#45413b]">
                    {featuredDemo.subtitle}
                  </p>

                  {/* Palette Swatches */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredDemo.swatches.map((swatch) => (
                      <div
                        key={swatch.hex}
                        className="flex items-center gap-2 border border-[#d8d2c6] bg-[#f4f1ea] px-2.5 py-1.5"
                      >
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 border border-[#141311]/20"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="font-mono text-[11px] text-[#141311]">{swatch.hex}</span>
                      </div>
                    ))}
                  </div>

                  {/* Prompt Preview */}
                  <div className="mt-5 border border-[#d8d2c6] bg-[#f4f1ea] px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#59554d]">
                      Verbatim Skill Prompt
                    </p>
                    <p className="mt-1.5 line-clamp-3 font-mono text-xs leading-relaxed text-[#2b2925]">
                      {featuredDemo.prompt}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-[#d8d2c6]">
                  <Link
                    href={`/gallery/${featuredDemo.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 bg-[#141311] px-5 py-2.5 text-sm font-medium text-[#faf8f3] transition-colors hover:bg-[#b82d12]"
                  >
                    Launch Live Demo ↗
                  </Link>
                  <Link
                    href="/gallery"
                    className="inline-flex min-h-11 items-center gap-2 border border-[#b8b0a1] px-5 py-2.5 text-sm font-medium text-[#141311] transition-colors hover:border-[#141311]"
                  >
                    Copy Full Prompt
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: 26-Skill Specification Archive */}
        <section id="skills" className="bg-[#faf8f3]">
          <div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-8 lg:py-20">
            <div className="flex flex-col justify-between gap-6 border-b border-[#d8d2c6] pb-6 lg:flex-row lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b82d12]">
                  04 / COMPLETE SPECIFICATION
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-[#141311] sm:text-4xl">
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
                        className={`min-h-9 border px-3 font-mono text-[11px] transition-colors ${
                          active
                            ? 'border-[#141311] bg-[#141311] text-[#faf8f3]'
                            : 'border-[#d8d2c6] bg-[#f4f1ea] text-[#524e47] hover:border-[#141311] hover:text-[#141311]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label htmlFor="skill-search" className="sr-only">
                    Filter skills by name or keyword
                  </label>
                  <input
                    id="skill-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter skills..."
                    className="min-h-9 w-full border border-[#b8b0a1] bg-[#f4f1ea] px-3 font-mono text-xs text-[#141311] placeholder:text-[#6b665d] sm:w-56"
                  />
                </div>
              </div>
            </div>

            {filteredSkills.length === 0 ? (
              <div className="border-b border-[#d8d2c6] py-12 text-center">
                <p className="font-mono text-sm text-[#524e47]">
                  No skills match &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 border border-[#141311] px-4 py-1.5 font-mono text-xs text-[#141311] hover:bg-[#141311] hover:text-[#faf8f3]"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#d8d2c6] border-b border-[#d8d2c6]">
                {filteredSkills.map((skill, idx) => (
                  <Link
                    key={skill.slug}
                    href={`/docs/${skill.slug}`}
                    className="group grid grid-cols-1 gap-2 py-4 transition-colors hover:bg-[#f4f1ea] sm:px-3 md:grid-cols-12 md:items-baseline"
                  >
                    <div className="flex items-baseline gap-3 md:col-span-4">
                      <span className="font-mono text-[11px] tabular-nums text-[#59554d]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-sm font-medium text-[#141311] group-hover:text-[#b82d12]">
                        {skill.name}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#59554d] md:col-span-2">
                      {skill.category}
                    </div>
                    <div className="line-clamp-2 text-sm text-[#45413b] md:col-span-5">
                      {skill.description}
                    </div>
                    <div className="font-mono text-xs text-[#59554d] group-hover:text-[#b82d12] md:col-span-1 md:text-right">
                      Spec →
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Colophon Footer */}
      <footer className="border-t border-[#d8d2c6] bg-[#f4f1ea]">
        <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-8">
          <p className="font-mono text-xs text-[#59554d]">
            PIXELCRAFT · MIT License · Verified at 390px, 768px &amp; 1440px
          </p>
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#524e47]">
            <Link href="/gallery" className="hover:text-[#141311]">
              Gallery
            </Link>
            <Link href="/docs" className="hover:text-[#141311]">
              Documentation
            </Link>
            <Link href="/docs/architecture" className="hover:text-[#141311]">
              Architecture
            </Link>
            <a
              href="https://github.com/ThanhNguyxn07/Pixelcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141311]"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
