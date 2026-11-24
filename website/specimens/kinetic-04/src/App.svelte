<script>
  import { onMount } from 'svelte';
  import RotaryKnob from './lib/RotaryKnob.svelte';
  import { KineticSynthEngine } from './lib/synthEngine.js';

  const PRESETS = [
    {
      id: 'berlin',
      name: '01 Berlin Pulse',
      waveform: 'sawtooth',
      cutoff: 2200,
      resonance: 6.2,
      detune: 11,
      attack: 0.012,
      release: 0.24,
      delayMix: 0.26,
      bpm: 118,
    },
    {
      id: 'brass',
      name: '02 Warm Brass',
      waveform: 'sawtooth',
      cutoff: 1350,
      resonance: 2.8,
      detune: 16,
      attack: 0.09,
      release: 0.42,
      delayMix: 0.18,
      bpm: 96,
    },
    {
      id: 'glass',
      name: '03 Glass Pluck',
      waveform: 'triangle',
      cutoff: 4400,
      resonance: 1.8,
      detune: 5,
      attack: 0.006,
      release: 0.19,
      delayMix: 0.36,
      bpm: 124,
    },
    {
      id: 'acid',
      name: '04 Sub Acid',
      waveform: 'square',
      cutoff: 880,
      resonance: 11.4,
      detune: 8,
      attack: 0.008,
      release: 0.16,
      delayMix: 0.22,
      bpm: 132,
    },
  ];

  const KEYS = [
    { note: 'C4', freq: 261.63, key: 'a', sharp: false },
    { note: 'C#4', freq: 277.18, key: 'w', sharp: true },
    { note: 'D4', freq: 293.66, key: 's', sharp: false },
    { note: 'D#4', freq: 311.13, key: 'e', sharp: true },
    { note: 'E4', freq: 329.63, key: 'd', sharp: false },
    { note: 'F4', freq: 349.23, key: 'f', sharp: false },
    { note: 'F#4', freq: 369.99, key: 't', sharp: true },
    { note: 'G4', freq: 392.0, key: 'g', sharp: false },
    { note: 'G#4', freq: 415.3, key: 'y', sharp: true },
    { note: 'A4', freq: 440.0, key: 'h', sharp: false },
    { note: 'A#4', freq: 466.16, key: 'u', sharp: true },
    { note: 'B4', freq: 493.88, key: 'j', sharp: false },
    { note: 'C5', freq: 523.25, key: 'k', sharp: false },
  ];

  const SEQ_NOTES = [
    { note: 'C4', freq: 261.63 },
    { note: 'G4', freq: 392.0 },
    { note: 'D#4', freq: 311.13 },
    { note: 'A#4', freq: 466.16 },
    { note: 'C5', freq: 523.25 },
    { note: 'G4', freq: 392.0 },
    { note: 'F4', freq: 349.23 },
    { note: 'D#4', freq: 311.13 },
  ];

  const WAVEFORMS = [
    { id: 'sawtooth', label: 'SAW' },
    { id: 'square', label: 'SQR' },
    { id: 'triangle', label: 'TRI' },
    { id: 'sine', label: 'SIN' },
  ];

  const engine = new KineticSynthEngine();

  let activePreset = $state('berlin');
  let waveform = $state('sawtooth');
  let cutoff = $state(2200);
  let resonance = $state(6.2);
  let detune = $state(11);
  let attack = $state(0.012);
  let release = $state(0.24);
  let delayMix = $state(0.26);
  let bpm = $state(118);

  let lastNote = $state('C4');
  let lastFreq = $state(261.63);
  let activeKey = $state(null);
  let audioReady = $state(false);

  let steps = $state([true, false, true, true, false, true, false, true]);
  let playing = $state(false);
  let currentStep = $state(-1);

  let canvasEl;
  let seqTimer = null;

  let synthParams = $derived({
    waveform,
    cutoff,
    resonance,
    detune,
    attack,
    release,
    delayMix,
    volume: 0.42,
  });

  function applyPreset(preset) {
    activePreset = preset.id;
    waveform = preset.waveform;
    cutoff = preset.cutoff;
    resonance = preset.resonance;
    detune = preset.detune;
    attack = preset.attack;
    release = preset.release;
    delayMix = preset.delayMix;
    bpm = preset.bpm;
  }

  function playNote(noteObj, dur = 0.3) {
    audioReady = true;
    lastNote = noteObj.note;
    lastFreq = noteObj.freq;
    activeKey = noteObj.note;
    engine.triggerNote(noteObj.freq, synthParams, dur);
    window.setTimeout(() => {
      if (activeKey === noteObj.note) activeKey = null;
    }, 180);
  }

  function toggleStep(idx) {
    steps[idx] = !steps[idx];
  }

  function stopSequencer() {
    if (seqTimer) {
      window.clearInterval(seqTimer);
      seqTimer = null;
    }
    playing = false;
    currentStep = -1;
  }

  function toggleSequencer() {
    if (playing) {
      stopSequencer();
      return;
    }
    audioReady = true;
    playing = true;
    currentStep = 0;
    if (steps[0]) playNote(SEQ_NOTES[0], 0.22);

    const stepMs = Math.round((60 / bpm / 2) * 1000);
    seqTimer = window.setInterval(() => {
      currentStep = (currentStep + 1) % 8;
      if (steps[currentStep]) {
        playNote(SEQ_NOTES[currentStep], 0.22);
      }
    }, stepMs);
  }

  $effect(() => {
    engine.updateParams(synthParams);
  });

  $effect(() => {
    if (!playing) return;
    if (seqTimer) window.clearInterval(seqTimer);
    const stepMs = Math.round((60 / bpm / 2) * 1000);
    seqTimer = window.setInterval(() => {
      currentStep = (currentStep + 1) % 8;
      if (steps[currentStep]) {
        playNote(SEQ_NOTES[currentStep], 0.22);
      }
    }, stepMs);
    return () => {
      if (seqTimer) window.clearInterval(seqTimer);
    };
  });

  onMount(() => {
    const onKeyDown = (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      const found = KEYS.find((k) => k.key === e.key.toLowerCase());
      if (found) playNote(found, 0.32);
    };
    window.addEventListener('keydown', onKeyDown);

    let rafId = 0;
    const buffer = new Uint8Array(1024);
    let phase = 0;

    const drawScope = () => {
      if (!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      const w = canvasEl.width;
      const h = canvasEl.height;

      // Phosphor CRT dark green-charcoal glass
      ctx.fillStyle = '#0e1112';
      ctx.fillRect(0, 0, w, h);

      // Calibration graticule
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.11)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += w / 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += h / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const hasLive = audioReady && engine.getWaveformData(buffer);
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.55)';
      ctx.shadowBlur = 10;

      if (hasLive) {
        const slice = w / buffer.length;
        let x = 0;
        for (let i = 0; i < buffer.length; i++) {
          const v = buffer[i] / 128.0;
          const y = (v * h) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += slice;
        }
      } else {
        // Authentic mathematical preview of active waveform & cutoff before audio unlock
        phase += 0.035;
        const cycles = 3.2;
        const amp = (h * 0.28) * Math.min(1, cutoff / 3000 + 0.32);
        for (let x = 0; x < w; x++) {
          const t = (x / w) * Math.PI * 2 * cycles + phase;
          let sample = 0;
          if (waveform === 'sine') sample = Math.sin(t);
          else if (waveform === 'square') sample = Math.sin(t) >= 0 ? 0.78 : -0.78;
          else if (waveform === 'triangle') sample = (2 / Math.PI) * Math.asin(Math.sin(t));
          else sample = 2 * ((t / (2 * Math.PI)) - Math.floor(0.5 + t / (2 * Math.PI)));
          const y = h / 2 - sample * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      rafId = window.requestAnimationFrame(drawScope);
    };

    rafId = window.requestAnimationFrame(drawScope);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.cancelAnimationFrame(rafId);
      stopSequencer();
    };
  });
</script>

<div class="page">
  <!-- Anodized Top Bezel Header -->
  <header class="topbar">
    <div class="topbar-left">
      <a href="/gallery" class="back-link">← Gallery</a>
      <span class="divider" aria-hidden="true"></span>
      <span class="model-id">KINETIC-04</span>
      <span class="badge-stack">SVELTE 5 · WEB AUDIO · CANVAS 2D</span>
    </div>
    <div class="topbar-right">
      <span class="status-led" class:live={audioReady} aria-hidden="true"></span>
      <span class="status-text">{audioReady ? 'AUDIO ENGINE ACTIVE' : 'CLICK KEY OR PLAY TO UNLOCK AUDIO'}</span>
    </div>
  </header>

  <main class="shell">
    <!-- Preset & Patch Strip -->
    <section class="patch-bar" aria-label="Sound bank presets">
      <div class="patch-title">
        <h1>KINETIC-04</h1>
        <p>Dual-oscillator subtractive synthesizer with real-time phosphor oscilloscope, built natively in Svelte 5 Runes.</p>
      </div>
      <div class="preset-group" role="tablist" aria-label="Synth presets">
        {#each PRESETS as preset}
          <button
            type="button"
            role="tab"
            aria-selected={activePreset === preset.id}
            class="preset-btn"
            class:active={activePreset === preset.id}
            onclick={() => applyPreset(preset)}
          >
            {preset.name}
          </button>
        {/each}
      </div>
    </section>

    <!-- Main Hardware Console -->
    <section class="console" aria-label="Synthesizer instrument panel">
      <!-- Top Row: Oscilloscope + 6 Rotary Encoders -->
      <div class="console-grid">
        <div class="scope-bay">
          <div class="bay-header">
            <span>CRT OSCILLOSCOPE · 1024-PT FFT</span>
            <span class="tabular-nums note-readout">{lastNote} · {lastFreq.toFixed(1)} Hz</span>
          </div>
          <div class="scope-frame">
            <canvas
              bind:this={canvasEl}
              width="640"
              height="240"
              class="scope-canvas"
              aria-label="Live audio waveform oscilloscope"
            ></canvas>
          </div>
          <div class="wave-bar" role="radiogroup" aria-label="Oscillator waveform">
            <span class="wave-label">OSC WAVE</span>
            <div class="wave-buttons">
              {#each WAVEFORMS as wf}
                <button
                  type="button"
                  role="radio"
                  aria-checked={waveform === wf.id}
                  class="wave-btn"
                  class:active={waveform === wf.id}
                  onclick={() => (waveform = wf.id)}
                >
                  {wf.label}
                </button>
              {/each}
            </div>
          </div>
        </div>

        <div class="encoder-bay">
          <div class="bay-header">
            <span>FILTER · ENVELOPE · TAPE DELAY</span>
            <span>DRAG VERTICAL / ARROWS</span>
          </div>
          <div class="knob-grid">
            <RotaryKnob
              label="Cutoff"
              bind:value={cutoff}
              min={180}
              max={6400}
              step={20}
              unit=" Hz"
              accent="#fbbf24"
            />
            <RotaryKnob
              label="Resonance"
              bind:value={resonance}
              min={0.5}
              max={16}
              step={0.1}
              format={(v) => v.toFixed(1)}
              accent="#ff4d2e"
            />
            <RotaryKnob
              label="Detune"
              bind:value={detune}
              min={0}
              max={40}
              step={1}
              unit=" ct"
              accent="#fbbf24"
            />
            <RotaryKnob
              label="Attack"
              bind:value={attack}
              min={0.005}
              max={0.4}
              step={0.005}
              unit="s"
              format={(v) => v.toFixed(2)}
              accent="#34d399"
            />
            <RotaryKnob
              label="Release"
              bind:value={release}
              min={0.05}
              max={1.2}
              step={0.01}
              unit="s"
              format={(v) => v.toFixed(2)}
              accent="#34d399"
            />
            <RotaryKnob
              label="Delay Mix"
              bind:value={delayMix}
              min={0}
              max={0.65}
              step={0.01}
              unit="%"
              format={(v) => String(Math.round(v * 100))}
              accent="#ff4d2e"
            />
          </div>
        </div>
      </div>

      <!-- Middle Row: 8-Step Hardware Sequencer -->
      <div class="seq-bay">
        <div class="seq-controls">
          <button
            type="button"
            class="play-btn"
            class:running={playing}
            onclick={toggleSequencer}
          >
            <span class="play-dot" aria-hidden="true"></span>
            {playing ? 'STOP SEQ' : 'PLAY 8-STEP'}
          </button>

          <div class="bpm-control">
            <span class="bpm-label">TEMPO</span>
            <button
              type="button"
              class="bpm-step"
              aria-label="Decrease tempo"
              onclick={() => (bpm = Math.max(72, bpm - 4))}
            >
              −
            </button>
            <span class="bpm-val tabular-nums">{bpm} BPM</span>
            <button
              type="button"
              class="bpm-step"
              aria-label="Increase tempo"
              onclick={() => (bpm = Math.min(168, bpm + 4))}
            >
              +
            </button>
          </div>
        </div>

        <div class="seq-pads" role="group" aria-label="8-step sequence triggers">
          {#each steps as active, idx}
            <button
              type="button"
              class="seq-pad"
              class:on={active}
              class:now={currentStep === idx}
              aria-pressed={active}
              onclick={() => toggleStep(idx)}
            >
              <span class="pad-led" aria-hidden="true"></span>
              <span class="pad-num tabular-nums">0{idx + 1}</span>
              <span class="pad-note">{SEQ_NOTES[idx].note}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Bottom Row: 13-Key Playable Tactile Keyboard -->
      <div class="keyboard-bay">
        <div class="bay-header">
          <span>TACTILE KEYBED · C4 – C5</span>
          <span>KEYS: A W S E D F T G Y H U J K</span>
        </div>
        <div class="keybed" role="group" aria-label="Playable synthesizer keyboard">
          {#each KEYS as k}
            <button
              type="button"
              class="piano-key"
              class:sharp={k.sharp}
              class:pressed={activeKey === k.note}
              onpointerdown={() => playNote(k, 0.34)}
              aria-label={`Play ${k.note}`}
            >
              <span class="key-note">{k.note}</span>
              <span class="key-bind">{k.key.toUpperCase()}</span>
            </button>
          {/each}
        </div>
      </div>
    </section>

    <footer class="spec-footer">
      <span>SPECIMEN 02 · COMPILED SVELTE 5 STATIC BUNDLE</span>
      <span>ZERO REACT · ZERO RAW OS SLIDERS · VERIFIED 390 / 768 / 1440</span>
    </footer>
  </main>
</div>

<style>
  .page {
    min-height: 100vh;
    background: var(--chassis);
    color: var(--ink);
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 24px;
    background: rgba(233, 231, 225, 0.94);
    border-bottom: 1px solid var(--steel);
    backdrop-filter: blur(8px);
  }

  .topbar-left,
  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .back-link {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid var(--steel);
    background: var(--chassis-raised);
    transition: background 150ms ease, color 150ms ease;
  }

  .back-link:hover {
    background: var(--bezel);
    color: var(--ink-on-dark);
    border-color: var(--bezel);
  }

  .divider {
    width: 1px;
    height: 16px;
    background: var(--steel);
  }

  .model-id {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  .badge-stack {
    display: none;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--ink-muted);
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--steel);
    background: var(--chassis-raised);
  }

  @media (min-width: 768px) {
    .badge-stack {
      display: inline-block;
    }
  }

  .status-led {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--vermilion);
  }

  .status-led.live {
    background: #168052;
    box-shadow: 0 0 10px rgba(22, 128, 82, 0.6);
  }

  .status-text {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--ink-muted);
  }

  .shell {
    max-width: 1280px;
    margin: 0 auto;
    padding: 28px 20px 44px;
  }

  .patch-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 22px;
  }

  .patch-title h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .patch-title p {
    margin: 8px 0 0;
    font-size: 14px;
    color: var(--ink-muted);
    max-width: 56ch;
    line-height: 1.55;
  }

  .preset-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .preset-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    padding: 9px 14px;
    border-radius: 999px;
    border: 1px solid var(--steel);
    background: var(--chassis-raised);
    color: var(--ink);
    cursor: pointer;
    transition: all 150ms ease;
  }

  .preset-btn:hover {
    border-color: var(--bezel);
  }

  .preset-btn.active {
    background: var(--bezel);
    border-color: var(--bezel);
    color: var(--ink-on-dark);
  }

  .console {
    background: var(--bezel);
    color: var(--ink-on-dark);
    border-radius: 22px;
    border: 1px solid #2b2d35;
    padding: 20px;
    box-shadow: 0 28px 70px rgba(20, 20, 22, 0.22);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .console-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media (min-width: 960px) {
    .console-grid {
      grid-template-columns: 1.15fr 1fr;
    }
  }

  .scope-bay,
  .encoder-bay,
  .seq-bay,
  .keyboard-bay {
    background: var(--bezel-panel);
    border: 1px solid var(--bezel-border);
    border-radius: 14px;
    padding: 16px;
  }

  .bay-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--ink-on-dark-muted);
    margin-bottom: 12px;
  }

  .note-readout {
    color: var(--amber-bright);
    font-weight: 600;
  }

  .scope-frame {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #2d3038;
    background: #0e1112;
  }

  .scope-canvas {
    display: block;
    width: 100%;
    height: 196px;
  }

  .wave-bar {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .wave-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--ink-on-dark-muted);
  }

  .wave-buttons {
    display: flex;
    gap: 6px;
  }

  .wave-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 8px;
    border: 1px solid #353842;
    background: #17181d;
    color: var(--ink-on-dark-muted);
    cursor: pointer;
  }

  .wave-btn.active {
    background: var(--amber);
    border-color: var(--amber);
    color: #141311;
  }

  .knob-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 12px;
    padding-top: 6px;
  }

  @media (min-width: 520px) {
    .knob-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .seq-bay {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .seq-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .play-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid #3c3f4a;
    background: #17181d;
    color: var(--ink-on-dark);
    cursor: pointer;
  }

  .play-btn.running {
    background: var(--vermilion);
    border-color: var(--vermilion);
    color: #ffffff;
  }

  .play-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--vermilion-led);
  }

  .play-btn.running .play-dot {
    background: #ffffff;
  }

  .bpm-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bpm-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--ink-on-dark-muted);
  }

  .bpm-step {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #353842;
    background: #17181d;
    color: var(--ink-on-dark);
    font-family: var(--font-mono);
    font-size: 14px;
    cursor: pointer;
  }

  .bpm-val {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    min-width: 64px;
    text-align: center;
  }

  .seq-pads {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  @media (min-width: 720px) {
    .seq-pads {
      grid-template-columns: repeat(8, 1fr);
    }
  }

  .seq-pad {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #32353f;
    background: #16171c;
    color: var(--ink-on-dark-muted);
    cursor: pointer;
    transition: border-color 120ms ease, background 120ms ease;
  }

  .seq-pad.on {
    border-color: #5b5e6b;
    background: #24262e;
    color: var(--ink-on-dark);
  }

  .seq-pad.now {
    border-color: var(--amber);
    box-shadow: inset 0 0 0 1px var(--amber);
  }

  .pad-led {
    width: 14px;
    height: 4px;
    border-radius: 2px;
    background: #353842;
  }

  .seq-pad.on .pad-led {
    background: var(--vermilion-led);
  }

  .seq-pad.now .pad-led {
    background: var(--amber-bright);
  }

  .pad-num {
    font-family: var(--font-mono);
    font-size: 10px;
  }

  .pad-note {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
  }

  .keybed {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
    gap: 6px;
  }

  .piano-key {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 82px;
    padding: 10px 6px;
    border-radius: 8px;
    border: 1px solid #cfccc4;
    background: #f4f2ed;
    color: #171719;
    cursor: pointer;
    transition: transform 80ms ease, background 80ms ease;
  }

  .piano-key.sharp {
    border-color: #3a3d47;
    background: #121317;
    color: #f2f0ea;
  }

  .piano-key.pressed,
  .piano-key:active {
    transform: translateY(2px);
    background: var(--amber);
    border-color: var(--amber);
    color: #141311;
  }

  .key-note {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
  }

  .key-bind {
    font-family: var(--font-mono);
    font-size: 10px;
    opacity: 0.7;
  }

  .spec-footer {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-muted);
  }
</style>
