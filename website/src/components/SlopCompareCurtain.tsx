'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { GripVertical, CheckCircle2, AlertTriangle } from 'lucide-react';

export function SlopCompareCurtain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(52);
  const [dragging, setDragging] = useState(false);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(12, Math.min(88, Math.round(pct))));
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDragging(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Preset & Keyboard Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#a7a49c]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#ff6542]" aria-hidden="true" />
          <span>Drag divider or use arrow keys</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { label: 'Inspect Slop', value: 82 },
            { label: '50 / 50', value: 50 },
            { label: 'Inspect Verified', value: 18 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPosition(preset.value)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                Math.abs(position - preset.value) < 6
                  ? 'border-[#ff6542] bg-[#ff6542]/15 text-[#f6f4ef]'
                  : 'border-[#27272d] bg-[#151519] text-[#a7a49c] hover:border-[#52525b] hover:text-[#f6f4ef]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Split Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[430px] w-full select-none overflow-hidden rounded-[22px] border border-[#27272d] bg-[#151519] shadow-[0_32px_90px_rgba(0,0,0,0.55)] touch-none sm:h-[480px]"
      >
        {/* RIGHT LAYER (Base): Pixelcraft Verified Specimen */}
        <div className="absolute inset-0 bg-[#f6f2ea] text-[#1a1714]">
          <div className="grid h-full grid-cols-1 md:grid-cols-12">
            <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
              <div>
                <div className="flex items-center justify-between border-b border-[#d8d2c6] pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7a4b2f]">
                    PIXELCRAFT VERIFIED · PLATE 01
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#167a4d]/12 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#167a4d]">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    FINISH GATE PASS
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-3xl font-medium leading-[1.05] text-[#1a1714] sm:text-4xl">
                  Villa Solare — <em className="italic text-[#7a4b2f]">Ravello Cliffs</em>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4f4a43]">
                  Loaded Cormorant Garamond serif, warm travertine tokens, WCAG AA contrast,
                  and responsive 390 / 768 / 1440 verification.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#d8d2c6] pt-4 tabular-nums">
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#59554d]">Overflow</p>
                  <p className="mt-0.5 font-display text-base font-semibold text-[#1a1714]">0 px</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#59554d]">Contrast</p>
                  <p className="mt-0.5 font-display text-base font-semibold text-[#167a4d]">AA Pass</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#59554d]">CLS</p>
                  <p className="mt-0.5 font-display text-base font-semibold text-[#1a1714]">0.002</p>
                </div>
              </div>
            </div>

            <div className="relative h-48 overflow-hidden bg-[#ded8cb] md:col-span-6 md:h-full">
              <img
                src="/gallery/villa-solare/hero.jpg"
                alt="Villa Solare Mediterranean limestone terrace overlooking the sea"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-4 right-4 rounded-full bg-[#141311] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.08em] text-[#faf8f3]">
                REAL PHOTOGRAPHY · WCAG AA
              </div>
            </div>
          </div>
        </div>

        {/* LEFT LAYER (Clipped): Unconstrained AI Slop */}
        <div
          className="absolute inset-0 bg-[#0b0a18] text-white"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden="true"
        >
          <div
            className="flex h-full flex-col justify-between p-6 sm:p-9"
            style={{
              background:
                'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.35), transparent 55%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.25), transparent 50%), #0b0a18',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff6542]/40 bg-[#ff6542]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#ffb4a2]">
                <AlertTriangle className="h-3 w-3" />
                UNCONSTRAINED AI OUTPUT
              </span>
              <span className="font-mono text-[10px] text-[#a7a49c]">
                slop-scan: 18 violations
              </span>
            </div>

            <div className="my-auto grid grid-cols-1 gap-5 md:grid-cols-12 md:items-center">
              <div className="space-y-3 md:col-span-7">
                <div className="inline-block rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-0.5 text-[11px] text-indigo-200">
                  Next-Gen Luxury Experience
                </div>
                <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Elevate Your Coastal Journey
                </p>
                <p className="max-w-md text-sm text-slate-400">
                  Discover seamless hospitality powered by modern elegance and curated comfort
                  designed for every discerning traveler.
                </p>
                <div className="flex gap-2 pt-1">
                  <span className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white">
                    Get Started
                  </span>
                  <span className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs text-slate-300">
                    Learn More
                  </span>
                </div>
              </div>

              <div className="hidden md:col-span-5 md:block">
                <div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center">
                  <span className="font-mono text-xs text-slate-400">[ Hero Image Placeholder ]</span>
                  <span className="mt-1 font-mono text-[10px] text-slate-500">
                    div.bg-zinc-800 — no real media
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4 font-mono text-[10px]">
              <span className="rounded bg-[#ff6542]/20 px-2 py-1 text-[#ffb4a2]">
                P1: generic-gradient-slop
              </span>
              <span className="rounded bg-[#ff6542]/20 px-2 py-1 text-[#ffb4a2]">
                P1: placeholder-media-box
              </span>
              <span className="rounded bg-[#ff6542]/20 px-2 py-1 text-[#ffb4a2]">
                P2: centered-cliche-copy
              </span>
              <span className="rounded bg-[#ff6542]/20 px-2 py-1 text-[#ffb4a2]">
                P1: unverified-viewports
              </span>
            </div>
          </div>
        </div>

        {/* Draggable Divider Line & Handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-[#ff6542] shadow-[0_0_20px_rgba(255,101,66,0.75)]"
          style={{ left: `${position}%` }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="Compare unconstrained AI slop and Pixelcraft verified output"
            aria-valuemin={12}
            aria-valuemax={88}
            aria-valuenow={position}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setPosition((p) => Math.max(12, p - 5));
              if (e.key === 'ArrowRight') setPosition((p) => Math.min(88, p + 5));
            }}
            className="pointer-events-auto absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-[#f6f4ef] bg-[#c83216] text-[#f6f4ef] shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform hover:scale-105"
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
