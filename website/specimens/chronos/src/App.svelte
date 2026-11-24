<script>
  import { onMount } from 'svelte';
  import { drawTourbillonFrame } from './lib/tourbillonRenderer.js';

  let canvasEl;
  let mode = $state('exhibition'); // 'exhibition' | 'skeleton' | 'slowmo'
  let powerHours = $state(58);
  let windAngle = $state(0);
  let chronoRunning = $state(false);
  let chronoSec = $state(0);
  let beatRate = $derived(mode === 'slowmo' ? '7,200 vph (0.25×)' : '28,800 vph (4.00 Hz)');

  let simSec = 0;

  function windCrown() {
    powerHours = Math.min(72, powerHours + 12);
    windAngle += 1.4;
  }

  function toggleChrono() {
    chronoRunning = !chronoRunning;
  }

  function resetChrono() {
    chronoRunning = false;
    chronoSec = 0;
  }

  function formatChrono(s) {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const tenths = Math.floor((s % 1) * 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
  }

  onMount(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const timeScale = mode === 'slowmo' ? 0.25 : 1.0;
      simSec += dt * timeScale;
      if (chronoRunning) chronoSec += dt;

      if (canvasEl) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.floor(canvasEl.clientWidth * dpr);
        const h = Math.floor(canvasEl.clientHeight * dpr);
        if (canvasEl.width !== w || canvasEl.height !== h) {
          canvasEl.width = w;
          canvasEl.height = h;
        }
        const ctx = canvasEl.getContext('2d');
        ctx.save();
        ctx.scale(dpr, dpr);
        drawTourbillonFrame(ctx, canvasEl.clientWidth, canvasEl.clientHeight, {
          simSec,
          skeleton: mode === 'skeleton',
          powerHours,
          windAngle,
          chronoSec,
        });
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  });
</script>

<div class="atelier">
  <!-- Whisper-Quiet Horology Masthead -->
  <header class="topbar">
    <div class="top-left">
      <a href="/gallery" class="back-pill">← Gallery</a>
      <span class="brand">CHRONOS · GENÈVE</span>
      <span class="stack-tag">SVELTE 5 RUNES · CANVAS 2D KINEMATICS</span>
    </div>
    <div class="top-right">
      <span class="caliber-pill tabular-nums">CAL. 09 · {beatRate}</span>
    </div>
  </header>

  <main class="stage">
    <!-- Left Editorial & Horological Controls -->
    <section class="editorial">
      <p class="eyebrow">HAUTE HORLOGERIE · PIECE 03</p>
      <h1 class="headline">
        Flying Tourbillon <em class="italic">Calibre 09.</em>
      </h1>
      <p class="lead">
        Real-time mechanical escapement rendered at 60fps in compiled Svelte 5 Runes. Watch the
        4 Hz balance wheel breathe, switch to X-Ray Skeleton to inspect the meshing 18K rose-gold
        gear train, or operate the mechanical chronograph.
      </p>

      <!-- Caliber View Modes -->
      <div class="control-block">
        <span class="block-label">CALIBER INSPECTION MODE</span>
        <div class="mode-row" role="tablist" aria-label="Inspection view mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'exhibition'}
            class="mode-btn"
            class:active={mode === 'exhibition'}
            onclick={() => (mode = 'exhibition')}
          >
            Exhibition Dial
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'skeleton'}
            class="mode-btn"
            class:active={mode === 'skeleton'}
            onclick={() => (mode = 'skeleton')}
          >
            X-Ray Skeleton
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'slowmo'}
            class="mode-btn"
            class:active={mode === 'slowmo'}
            onclick={() => (mode = 'slowmo')}
          >
            0.25× Escapement
          </button>
        </div>
      </div>

      <!-- Chronograph & Crown Winding -->
      <div class="complications">
        <div class="comp-card">
          <div class="comp-head">
            <span>CHRONOGRAPH</span>
            <span class="tabular-nums comp-val">{formatChrono(chronoSec)}</span>
          </div>
          <div class="comp-actions">
            <button type="button" class="action-primary" onclick={toggleChrono}>
              {chronoRunning ? 'Stop' : 'Start'}
            </button>
            <button type="button" class="action-ghost" onclick={resetChrono}>Reset</button>
          </div>
        </div>

        <div class="comp-card">
          <div class="comp-head">
            <span>POWER RESERVE</span>
            <span class="tabular-nums comp-val">{powerHours}h / 72h</span>
          </div>
          <div class="comp-actions">
            <button type="button" class="action-gold" onclick={windCrown}>
              Wind Crown +12h
            </button>
          </div>
        </div>
      </div>

      <!-- Technical Specifications Ledger -->
      <dl class="specs tabular-nums">
        <div>
          <dt>FREQUENCY</dt>
          <dd>28,800 vph</dd>
        </div>
        <div>
          <dt>JEWELS</dt>
          <dd>33 Ruby</dd>
        </div>
        <div>
          <dt>CAGE</dt>
          <dd>60s Flying</dd>
        </div>
        <div>
          <dt>RESERVE</dt>
          <dd>72 Hours</dd>
        </div>
      </dl>
    </section>

    <!-- Right Live Tourbillon Canvas -->
    <section class="watch-bay" aria-label="Live mechanical tourbillon movement">
      <canvas
        bind:this={canvasEl}
        class="watch-canvas"
        aria-label="Real-time animated Swiss mechanical tourbillon watch movement"
      ></canvas>
    </section>
  </main>
</div>

<style>
  .atelier {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    display: flex;
    flex-direction: column;
  }

  .topbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 28px;
    border-bottom: 1px solid var(--border);
    background: #0d1016;
  }

  .top-left,
  .top-right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .back-pill {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink);
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
  }

  .back-pill:hover {
    border-color: var(--gold);
    color: var(--gold-bright);
  }

  .brand {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: var(--gold-bright);
  }

  .stack-tag {
    display: none;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--ink-muted);
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid var(--border);
  }

  @media (min-width: 820px) {
    .stack-tag {
      display: inline-block;
    }
  }

  .caliber-pill {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--gold-bright);
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid var(--border-gold);
    background: var(--surface);
  }

  .stage {
    flex: 1;
    max-width: 1340px;
    width: 100%;
    margin: 0 auto;
    padding: 32px 24px 44px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
    align-items: center;
  }

  @media (min-width: 1024px) {
    .stage {
      grid-template-columns: 1fr 1.08fr;
      padding: 40px 36px;
    }
  }

  .eyebrow {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.16em;
    color: var(--gold);
  }

  .headline {
    margin: 12px 0 0;
    font-family: var(--font-serif);
    font-size: clamp(2.8rem, 5vw, 4.6rem);
    font-weight: 500;
    line-height: 0.98;
    color: var(--ink);
  }

  .italic {
    font-style: italic;
    color: var(--gold-bright);
  }

  .lead {
    margin: 16px 0 0;
    font-size: 15px;
    line-height: 1.72;
    color: var(--ink-muted);
    max-width: 52ch;
  }

  .control-block {
    margin-top: 28px;
  }

  .block-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--ink-muted);
    margin-bottom: 10px;
  }

  .mode-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .mode-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink-muted);
    cursor: pointer;
    transition: all 150ms ease;
  }

  .mode-btn:hover {
    border-color: var(--gold);
    color: var(--ink);
  }

  .mode-btn.active {
    background: var(--gold);
    border-color: var(--gold);
    color: #0a0c10;
    font-weight: 600;
  }

  .complications {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 540px) {
    .complications {
      grid-template-columns: 1fr 1fr;
    }
  }

  .comp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
  }

  .comp-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--ink-muted);
  }

  .comp-val {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  .comp-actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }

  .action-primary,
  .action-ghost,
  .action-gold {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    padding: 9px 12px;
    border-radius: 10px;
    cursor: pointer;
  }

  .action-primary {
    background: var(--blued);
    border: 1px solid var(--blued);
    color: #06090f;
  }

  .action-ghost {
    background: var(--surface-elev);
    border: 1px solid var(--border);
    color: var(--ink);
  }

  .action-gold {
    background: var(--surface-elev);
    border: 1px solid var(--border-gold);
    color: var(--gold-bright);
  }

  .action-gold:hover {
    background: var(--gold);
    color: #0a0c10;
  }

  .specs {
    margin: 24px 0 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  @media (min-width: 540px) {
    .specs {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .specs dt {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--ink-muted);
  }

  .specs dd {
    margin: 4px 0 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
  }

  .watch-bay {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .watch-canvas {
    width: 100%;
    max-width: 580px;
    aspect-ratio: 1 / 1;
    display: block;
  }
</style>
