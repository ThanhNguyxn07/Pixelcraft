'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, Volume2 } from 'lucide-react';

interface SynthPreset {
  id: string;
  label: string;
  freq: number;
  harmonics: number;
  detune: number;
  note: string;
}

const PRESETS: SynthPreset[] = [
  { id: 'saw', label: '01 SUB SAW', freq: 2.2, harmonics: 5, detune: 0.35, note: 'Warm analog bass foundation' },
  { id: 'fm', label: '02 FM BELL', freq: 4.1, harmonics: 8, detune: 0.82, note: 'Metallic 2-operator FM overtones' },
  { id: 'pulse', label: '03 PULSE MOD', freq: 3.0, harmonics: 3, detune: 0.18, note: 'PWM lead with crisp edges' },
  { id: 'drone', label: '04 FIELD DRONE', freq: 1.3, harmonics: 6, detune: 0.62, note: 'Slow harmonic drift for ambient tape' },
];

const SPECS = [
  ['CHASSIS', 'CNC-milled 6061-T6 bead-blasted aluminum · 184 × 92 × 18 mm'],
  ['ENGINE', 'Dual analog VCO + 12-bit wavetable sub + 24 dB/oct ladder filter'],
  ['I/O', 'Stereo 3.5mm TRS out, CV/Gate sync, USB-C MIDI + class-compliant audio'],
  ['BATTERY', '14 hours continuous field operation · USB-C PD fast charge'],
  ['WEIGHT', '310 g (including machined brass rotary encoders)'],
];

export default function KuroSynthDemo() {
  const [preset, setPreset] = useState<SynthPreset>(PRESETS[0]);
  const [freq, setFreq] = useState(PRESETS[0].freq);
  const [harmonics, setHarmonics] = useState(PRESETS[0].harmonics);
  const [detune, setDetune] = useState(PRESETS[0].detune);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectPreset = (p: SynthPreset) => {
    setPreset(p);
    setFreq(p.freq);
    setHarmonics(p.harmonics);
    setDetune(p.detune);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let phase = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0c0c0f';
      ctx.fillRect(0, 0, w, h);

      // Calibration grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Secondary ghost harmonic
      ctx.strokeStyle = 'rgba(255, 77, 0, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const t = (x / w) * Math.PI * 2 * freq + phase * 0.7;
        const y =
          h / 2 +
          Math.sin(t) * (h * 0.24) +
          Math.sin(t * (1 + harmonics * 0.35)) * (h * 0.1 * detune);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Primary signal trace
      ctx.strokeStyle = '#ff4d00';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const t = (x / w) * Math.PI * 2 * freq + phase;
        let sample = Math.sin(t);
        for (let k = 2; k <= Math.round(harmonics); k += 1) {
          sample += (Math.sin(t * k + detune * k) / k) * (0.45 + detune * 0.35);
        }
        const y = h / 2 + sample * (h * 0.26);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (!reduced) {
        phase += 0.035;
        raf = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [freq, harmonics, detune]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09090b]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 sm:px-10">
          <div className="flex items-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-zinc-300 no-underline hover:border-[#ff4d00] hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Gallery
            </Link>
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-white">
              KURO—01
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            <a href="#oscilloscope" className="hidden no-underline hover:text-white sm:inline">
              Engine
            </a>
            <a href="#specs" className="hidden no-underline hover:text-white sm:inline">
              Specs
            </a>
            <span className="text-[#ff4d00]">BATCH 04 · DEMO</span>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1440px] px-5 pb-24 pt-12 sm:px-10 sm:pt-16">
        {/* Asymmetric Hardware Hero */}
        <section className="grid grid-cols-1 items-end gap-10 border-b border-white/10 pb-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff4d00]">
              FIELD SYNTHESIS INSTRUMENT · TOKYO / BERLIN
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,8.4vw,7.4rem)] font-extrabold leading-[0.88] tracking-[-0.045em] text-white">
              KURO—01
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              A 310-gram CNC-machined analog synthesizer engineered for field recording, live improvisation, and tactile zero-menu sound design.
            </p>
            <p className="mt-3 font-mono text-xs text-zinc-500">
              Pixelcraft Demo 01 · Persuade / Experience · Dark Industrial
            </p>
          </div>
        </section>

        {/* Interactive Oscilloscope Stage (Single Showpiece Layer) */}
        <section id="oscilloscope" className="py-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0c0c0f] lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 font-mono text-xs">
                <span className="inline-flex items-center gap-2 text-zinc-200">
                  <Volume2 className="h-3.5 w-3.5 text-[#ff4d00]" aria-hidden="true" />
                  LIVE OSCILLOSCOPE · {preset.label}
                </span>
                <span className="text-zinc-400">
                  {Math.round(freq * 110)} Hz · {Math.round(harmonics)} harmonics
                </span>
              </div>
              <canvas
                ref={canvasRef}
                className="block h-[260px] w-full sm:h-[340px]"
                aria-label={`Live oscilloscope waveform for ${preset.label}`}
              />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5 font-mono text-[11px] text-zinc-400">
                <span>{preset.note}</span>
                <span>24 dB/oct Analog Ladder</span>
              </div>
            </div>

            {/* Tactile Control Bench */}
            <div className="flex flex-col justify-between rounded-lg border border-white/15 bg-[#121216] p-6 lg:col-span-4">
              <div>
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-[#ff4d00]" aria-hidden="true" />
                    Patch Bank
                  </span>
                  <span>4 Presets</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Synthesis presets">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPreset(p)}
                      aria-pressed={preset.id === p.id}
                      className={`rounded border px-3 py-2.5 text-left font-mono text-xs cursor-pointer transition-colors ${
                        preset.id === p.id
                          ? 'border-[#ff4d00] bg-[#ff4d00] font-semibold text-black'
                          : 'border-white/15 bg-[#09090b] text-zinc-300 hover:border-white/40'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="flex justify-between font-mono text-xs">
                      <label htmlFor="synth-freq" className="text-zinc-300">
                        VCO FREQUENCY
                      </label>
                      <span className="text-[#ff4d00]">{Math.round(freq * 110)} Hz</span>
                    </div>
                    <input
                      id="synth-freq"
                      type="range"
                      min="1"
                      max="6"
                      step="0.1"
                      value={freq}
                      onChange={(e) => setFreq(Number(e.target.value))}
                      className="mt-2 w-full accent-[#ff4d00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-xs">
                      <label htmlFor="synth-harm" className="text-zinc-300">
                        HARMONIC FOLD
                      </label>
                      <span className="text-[#ff4d00]">{Math.round(harmonics)}×</span>
                    </div>
                    <input
                      id="synth-harm"
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={harmonics}
                      onChange={(e) => setHarmonics(Number(e.target.value))}
                      className="mt-2 w-full accent-[#ff4d00]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-xs">
                      <label htmlFor="synth-detune" className="text-zinc-300">
                        ANALOG DRIFT
                      </label>
                      <span className="text-[#ff4d00]">{Math.round(detune * 100)}%</span>
                    </div>
                    <input
                      id="synth-detune"
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={detune}
                      onChange={(e) => setDetune(Number(e.target.value))}
                      className="mt-2 w-full accent-[#ff4d00]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-zinc-400">DIRECT EDITION</span>
                  <span className="font-display text-2xl font-bold text-white">$490</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-zinc-500">
                  Interactive hardware specimen · No live payment processed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Spec Ledger */}
        <section id="specs" className="border-t border-white/10 pt-14">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#ff4d00]">
            TECHNICAL SPECIFICATION
          </p>
          <div className="mt-6 border-t border-white/15">
            {SPECS.map(([key, val]) => (
              <div
                key={key}
                className="grid grid-cols-1 gap-2 border-b border-white/15 py-5 sm:grid-cols-12"
              >
                <span className="font-mono text-xs text-zinc-400 sm:col-span-3">{key}</span>
                <span className="text-sm text-zinc-100 sm:col-span-9 sm:text-base">{val}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
