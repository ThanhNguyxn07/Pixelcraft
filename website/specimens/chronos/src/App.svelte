<script>
  import { onMount } from 'svelte';
  import { drawTourbillonFrame } from './lib/tourbillonRenderer.js';

  const METALS = [
    { id: 'gold', label: '18K Rose Gold', ref: 'CH-09-RG', price: 'CHF 148,000' },
    { id: 'platinum', label: '950 Platinum', ref: 'CH-09-PT', price: 'CHF 172,000' },
    { id: 'titanium', label: 'Grade 5 Titanium', ref: 'CH-09-TI', price: 'CHF 136,000' },
  ];

  const ASSEMBLIES = [
    {
      id: 'tourbillon',
      code: '01',
      title: '60-Second Flying Tourbillon',
      metric: '0.29 g · 74 Hand-Bevelled Parts',
      summary:
        'Cantilevered from beneath without an upper bridge, the titanium carriage completes one full revolution every sixty seconds to average positional gravity errors across the 4 Hz free-sprung balance.',
      specs: ['Free-sprung balance with 4 gold inertia blocks', 'Overcoil blued-steel Breguet hairspring', '28,800 vibrations per hour (4.00 Hz)'],
    },
    {
      id: 'barrels',
      code: '02',
      title: 'Twin-Barrel 72-Hour Reserve',
      metric: '72 Hours · Constant-Force Torque',
      summary:
        'Two fast-rotating mainspring barrels coupled in series deliver flat, stable torque across three full days, displayed continuously on the 10 o’clock recessed power-reserve sector.',
      specs: ['Hand-wound fluted crown ratchet', 'Linear 0–72h differential indicator', 'Côtes de Genève hand-finished bridges'],
    },
    {
      id: 'chrono',
      code: '03',
      title: 'Column-Wheel Chronograph',
      metric: '1/10th Sec · Horizontal Clutch',
      summary:
        'Engaged via the sculpted 2 o’clock pusher, the heat-blued central sweep hand tracks elapsed intervals with crisp zero-jump column-wheel actuation and instant heart-cam flyback reset.',
      specs: ['Heat-blued steel central chronograph hand', 'Polished 8-pillar steel column wheel', 'Independent Start / Stop / Reset pushers'],
    },
  ];

  const SALONS = ['Geneva — Rue du Rhône', 'Zurich — Bahnhofstrasse', 'Tokyo — Ginza Six'];

  let canvasEl;
  let metal = $state('gold');
  let mode = $state('exhibition'); // 'exhibition' | 'skeleton' | 'slowmo'
  let activeAssembly = $state('tourbillon');
  let powerHours = $state(58);
  let windAngle = $state(0);
  let chronoRunning = $state(false);
  let chronoSec = $state(0);
  let soundOn = $state(false);

  // Private Salon appointment form state (preserves user input on error)
  let salon = $state(SALONS[0]);
  let guestName = $state('');
  let guestEmail = $state('');
  let preferredDate = $state('');
  let formError = $state('');
  let formSubmitted = $state(false);

  let currentMetal = $derived(METALS.find((m) => m.id === metal) || METALS[0]);
  let currentAssembly = $derived(ASSEMBLIES.find((a) => a.id === activeAssembly) || ASSEMBLIES[0]);
  let beatRate = $derived(mode === 'slowmo' ? '7,200 vph (0.25×)' : '28,800 vph (4.00 Hz)');

  let simSec = 0;
  let audioCtx = null;
  let lastTickStep = 0;

  function playMechanicalTick() {
    if (!soundOn || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400 + (lastTickStep % 2) * 380, now);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.018);
  }

  function toggleSound() {
    soundOn = !soundOn;
    if (soundOn) playMechanicalTick();
  }

  function windCrown() {
    powerHours = Math.min(72, powerHours + 12);
    windAngle += 1.45;
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

  function submitAppointment(e) {
    e.preventDefault();
    formError = '';
    if (!guestName.trim()) {
      formError = 'Please enter your full name so the salon director can prepare your dossier.';
      return;
    }
    if (!guestEmail.includes('@') || !guestEmail.includes('.')) {
      formError = 'Please enter a valid email address for private viewing confirmation.';
      return;
    }
    formSubmitted = true;
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

      // 8 impulses/sec at 4 Hz (28,800 vph)
      const tickStep = Math.floor(simSec * 8);
      if (tickStep !== lastTickStep) {
        lastTickStep = tickStep;
        if (soundOn) playMechanicalTick();
      }

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
          metal,
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

<div class="site">
  <!-- Sticky Haute Horlogerie Masthead -->
  <header class="topbar">
    <div class="topbar-inner">
      <div class="top-left">
        <a href="/gallery" class="back-pill">← Gallery</a>
        <span class="brand">CHRONOS · GENÈVE</span>
        <span class="stack-pill">SVELTE 5 · CANVAS 2D</span>
      </div>

      <nav aria-label="Horology sections" class="top-nav">
        <a href="#calibre">Calibre 09</a>
        <a href="#specs">Specifications</a>
        <a href="#salon">Private Salon</a>
        <button type="button" class="sound-btn" class:on={soundOn} onclick={toggleSound}>
          {soundOn ? 'Escapement: ON' : 'Escapement: Muted'}
        </button>
      </nav>
    </div>
  </header>

  <main>
    <!-- SECTION 1 (OBSIDIAN): Monumental Hero Exhibition -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">MANUFACTURE GENÈVE · {currentMetal.ref}</p>
          <h1 class="headline">
            Flying Tourbillon <em class="italic">Calibre 09.</em>
          </h1>
          <p class="lead">
            A hand-finished 4 Hz mechanical tourbillon and column-wheel chronograph rendered live
            in compiled Svelte 5 Runes. Inspect the meshing gear train, switch case alloys in real
            time, or engage the acoustic escapement.
          </p>

          <!-- Case Metal Switcher -->
          <div class="control-group">
            <span class="group-label">CASE ALLOY · {currentMetal.price}</span>
            <div class="pill-row" role="tablist" aria-label="Case metal">
              {#each METALS as m}
                <button
                  type="button"
                  role="tab"
                  aria-selected={metal === m.id}
                  class="pill-btn"
                  class:active={metal === m.id}
                  onclick={() => (metal = m.id)}
                >
                  {m.label}
                </button>
              {/each}
            </div>
          </div>

          <!-- Caliber Inspection Mode -->
          <div class="control-group">
            <span class="group-label">CALIBER VIEW · {beatRate}</span>
            <div class="pill-row" role="tablist" aria-label="Inspection view mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'exhibition'}
                class="pill-btn"
                class:active={mode === 'exhibition'}
                onclick={() => (mode = 'exhibition')}
              >
                Exhibition Dial
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'skeleton'}
                class="pill-btn"
                class:active={mode === 'skeleton'}
                onclick={() => (mode = 'skeleton')}
              >
                X-Ray Skeleton
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'slowmo'}
                class="pill-btn"
                class:active={mode === 'slowmo'}
                onclick={() => (mode = 'slowmo')}
              >
                0.25× Escapement
              </button>
            </div>
          </div>

          <!-- Hero Actions -->
          <div class="hero-actions">
            <a href="#salon" class="cta-gold">Request Private Viewing</a>
            <button type="button" class="cta-ghost" onclick={windCrown}>
              Wind Crown ({powerHours}h / 72h)
            </button>
          </div>
        </div>

        <!-- Sculpted Photorealistic Watch Stage -->
        <div class="watch-stage">
          <canvas
            bind:this={canvasEl}
            class="watch-canvas"
            aria-label="Live Swiss mechanical tourbillon watch with sculpted lugs, crown, sapphire crystal, and 4 Hz oscillating escapement"
          ></canvas>
        </div>
      </div>
    </section>

    <!-- SECTION 2 (WARM CHAMPAGNE IVORY): Interactive Mechanical Complication Workbench -->
    <section id="calibre" class="chapter-ivory">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow-dark">01 / MECHANICAL ARCHITECTURE</p>
            <h2 class="section-title-dark">Three complications, zero quartz.</h2>
          </div>
          <p class="section-note-dark">
            Every control below directly drives the live Svelte 5 kinematic model above.
          </p>
        </div>

        <div class="workbench-grid">
          <div class="assembly-tabs" role="tablist" aria-label="Calibre assemblies">
            {#each ASSEMBLIES as asm}
              <button
                type="button"
                role="tab"
                aria-selected={activeAssembly === asm.id}
                class="asm-tab"
                class:active={activeAssembly === asm.id}
                onclick={() => (activeAssembly = asm.id)}
              >
                <span class="asm-code">{asm.code}</span>
                <span class="asm-name">{asm.title}</span>
              </button>
            {/each}
          </div>

          <div class="assembly-detail">
            <div class="detail-top">
              <span class="detail-code">ASSEMBLY {currentAssembly.code}</span>
              <span class="detail-metric tabular-nums">{currentAssembly.metric}</span>
            </div>
            <h3 class="detail-title">{currentAssembly.title}</h3>
            <p class="detail-summary">{currentAssembly.summary}</p>
            <ul class="detail-list">
              {#each currentAssembly.specs as sp}
                <li>{sp}</li>
              {/each}
            </ul>

            <!-- Live Interactive Complication Bar -->
            <div class="live-bar">
              <div class="live-chrono">
                <span class="live-lbl">CHRONOGRAPH</span>
                <span class="live-readout tabular-nums">{formatChrono(chronoSec)}</span>
                <div class="live-btns">
                  <button type="button" class="btn-dark" onclick={toggleChrono}>
                    {chronoRunning ? 'Stop' : 'Start'}
                  </button>
                  <button type="button" class="btn-outline" onclick={resetChrono}>Reset</button>
                </div>
              </div>

              <div class="live-wind">
                <span class="live-lbl">POWER RESERVE</span>
                <span class="live-readout tabular-nums">{powerHours}h / 72h</span>
                <button type="button" class="btn-dark" onclick={windCrown}>Wind Crown +12h</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3 (OBSIDIAN): Manufacture Reference & Technical Ledger -->
    <section id="specs" class="chapter-dark">
      <div class="container">
        <div class="section-head-dark">
          <div>
            <p class="eyebrow">02 / CALIBRE SPECIFICATION</p>
            <h2 class="section-title-light">Geneva Seal engineering ledger.</h2>
          </div>
          <span class="ref-badge tabular-nums">REF. {currentMetal.ref} · {currentMetal.price}</span>
        </div>

        <dl class="ledger-grid tabular-nums">
          <div class="ledger-cell">
            <dt>CASE DIAMETER</dt>
            <dd>39.5 mm</dd>
          </div>
          <div class="ledger-cell">
            <dt>CASE HEIGHT</dt>
            <dd>9.4 mm</dd>
          </div>
          <div class="ledger-cell">
            <dt>FREQUENCY</dt>
            <dd>28,800 vph (4 Hz)</dd>
          </div>
          <div class="ledger-cell">
            <dt>JEWELS</dt>
            <dd>33 Synthetic Rubies</dd>
          </div>
          <div class="ledger-cell">
            <dt>POWER RESERVE</dt>
            <dd>72 Hours Twin-Barrel</dd>
          </div>
          <div class="ledger-cell">
            <dt>CRYSTAL</dt>
            <dd>Domed Anti-Reflective Sapphire</dd>
          </div>
          <div class="ledger-cell">
            <dt>WATER RESISTANCE</dt>
            <dd>3 ATM (30 meters)</dd>
          </div>
          <div class="ledger-cell">
            <dt>STRAP</dt>
            <dd>Hand-Stitched Matte Alligator</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- SECTION 4 (WARM CHAMPAGNE IVORY): Private Salon Appointment -->
    <section id="salon" class="chapter-ivory">
      <div class="container salon-grid">
        <div>
          <p class="eyebrow-dark">03 / PRIVATE SALON</p>
          <h2 class="section-title-dark">Reserve a bench-side viewing.</h2>
          <p class="salon-copy">
            Calibre 09 is produced in numbered annual tranches of 18 pieces per alloy. Request a
            private presentation with our master watchmaker in Geneva, Zurich, or Tokyo.
          </p>
          <p class="salon-note">
            No live payment or deposit is collected online; this inquiry prepares your dossier only.
          </p>
        </div>

        <div class="form-card">
          {#if formSubmitted}
            <div class="confirm-box" role="status">
              <p class="confirm-eyebrow">DOSSIER REGISTERED</p>
              <h3>Thank you, {guestName}.</h3>
              <p>
                Our salon director at <strong>{salon}</strong> will contact
                <strong>{guestEmail}</strong> regarding Reference <strong>{currentMetal.ref}</strong>.
              </p>
              <button
                type="button"
                class="btn-outline"
                onclick={() => {
                  formSubmitted = false;
                }}
              >
                Modify Request
              </button>
            </div>
          {:else}
            <form onsubmit={submitAppointment} novalidate>
              <div class="field">
                <label for="salon-select">Preferred Salon</label>
                <select id="salon-select" bind:value={salon}>
                  {#each SALONS as s}
                    <option value={s}>{s}</option>
                  {/each}
                </select>
              </div>

              <div class="field">
                <label for="guest-name">Full Name</label>
                <input
                  id="guest-name"
                  type="text"
                  bind:value={guestName}
                  placeholder="Claire Beaumont"
                  autocomplete="name"
                />
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="guest-email">Email Address</label>
                  <input
                    id="guest-email"
                    type="email"
                    bind:value={guestEmail}
                    placeholder="claire@atelier.ch"
                    autocomplete="email"
                  />
                </div>
                <div class="field">
                  <label for="pref-date">Preferred Date (Optional)</label>
                  <input id="pref-date" type="date" bind:value={preferredDate} />
                </div>
              </div>

              {#if formError}
                <p class="form-error" role="alert">{formError}</p>
              {/if}

              <button type="submit" class="btn-submit">Request Private Presentation</button>
            </form>
          {/if}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <span>CHRONOS GENÈVE · PIECE 03 · COMPILED SVELTE 5 RUNES + CANVAS 2D</span>
      <a href="/gallery" class="footer-link">← Return to Pixelcraft Gallery</a>
    </div>
  </footer>
</div>

<style>
  .site {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 30;
    background: #0b0d12;
    border-bottom: 1px solid var(--border);
  }

  .topbar-inner {
    max-width: 1320px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .top-left,
  .top-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
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

  .stack-pill {
    display: none;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--ink-muted);
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
  }

  @media (min-width: 900px) {
    .stack-pill {
      display: inline-block;
    }
  }

  .top-nav a {
    display: none;
    font-size: 12px;
    color: var(--ink-muted);
    text-decoration: none;
  }

  .top-nav a:hover {
    color: var(--ink);
  }

  @media (min-width: 720px) {
    .top-nav a {
      display: inline;
    }
  }

  .sound-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 7px 13px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink-muted);
    cursor: pointer;
  }

  .sound-btn.on {
    border-color: var(--gold);
    color: var(--gold-bright);
  }

  .hero {
    background: var(--bg);
    padding: 36px 24px 64px;
  }

  .hero-inner {
    max-width: 1320px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
    align-items: center;
  }

  @media (min-width: 1024px) {
    .hero-inner {
      grid-template-columns: 1.02fr 1fr;
      min-height: calc(100svh - 110px);
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
    font-size: clamp(3rem, 5.4vw, 5rem);
    font-weight: 500;
    line-height: 0.96;
  }

  .italic {
    font-style: italic;
    color: var(--gold-bright);
  }

  .lead {
    margin: 18px 0 0;
    font-size: 15px;
    line-height: 1.72;
    color: var(--ink-muted);
    max-width: 52ch;
  }

  .control-group {
    margin-top: 22px;
  }

  .group-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--ink-muted);
    margin-bottom: 8px;
  }

  .pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pill-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 9px 15px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink-muted);
    cursor: pointer;
  }

  .pill-btn:hover {
    border-color: var(--gold);
    color: var(--ink);
  }

  .pill-btn.active {
    background: var(--gold);
    border-color: var(--gold);
    color: #0a0c10;
    font-weight: 600;
  }

  .hero-actions {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .cta-gold {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    padding: 0 24px;
    border-radius: 999px;
    background: var(--gold);
    color: #0a0c10;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
  }

  .cta-ghost {
    min-height: 46px;
    padding: 0 20px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
  }

  .watch-stage {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .watch-canvas {
    width: 100%;
    max-width: 580px;
    aspect-ratio: 1 / 1.06;
    display: block;
  }

  /* Chapters */
  .chapter-ivory {
    background: #f4efe6;
    color: #121316;
    padding: 76px 24px;
  }

  .chapter-dark {
    background: #0d1016;
    color: var(--ink);
    padding: 76px 24px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .container {
    max-width: 1320px;
    margin: 0 auto;
  }

  .section-head,
  .section-head-dark {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 36px;
  }

  .eyebrow-dark {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    color: #8c5a2b;
  }

  .section-title-dark {
    margin: 8px 0 0;
    font-family: var(--font-serif);
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    font-weight: 500;
    line-height: 1.02;
    color: #121316;
  }

  .section-title-light {
    margin: 8px 0 0;
    font-family: var(--font-serif);
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    font-weight: 500;
    line-height: 1.02;
    color: var(--ink);
  }

  .section-note-dark {
    margin: 0;
    font-size: 14px;
    color: #4d4942;
    max-width: 44ch;
  }

  .workbench-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 960px) {
    .workbench-grid {
      grid-template-columns: 360px 1fr;
    }
  }

  .assembly-tabs {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .asm-tab {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    border-radius: 16px;
    border: 1px solid #d9d1c3;
    background: #ffffff;
    color: #121316;
    text-align: left;
    cursor: pointer;
  }

  .asm-tab.active {
    background: #121316;
    border-color: #121316;
    color: #f4efe6;
  }

  .asm-code {
    font-family: var(--font-mono);
    font-size: 12px;
    color: #8c5a2b;
  }

  .asm-tab.active .asm-code {
    color: var(--gold-bright);
  }

  .asm-name {
    font-size: 15px;
    font-weight: 600;
  }

  .assembly-detail {
    background: #ffffff;
    border: 1px solid #d9d1c3;
    border-radius: 20px;
    padding: 28px;
  }

  .detail-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #8c5a2b;
    padding-bottom: 14px;
    border-bottom: 1px solid #e7e1d6;
  }

  .detail-metric {
    color: #4d4942;
  }

  .detail-title {
    margin: 18px 0 0;
    font-family: var(--font-serif);
    font-size: 32px;
    font-weight: 500;
  }

  .detail-summary {
    margin: 12px 0 0;
    font-size: 15px;
    line-height: 1.72;
    color: #3f3c37;
  }

  .detail-list {
    margin: 16px 0 0;
    padding-left: 18px;
    font-size: 14px;
    line-height: 1.8;
    color: #121316;
  }

  .live-bar {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e7e1d6;
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 640px) {
    .live-bar {
      grid-template-columns: 1fr 1fr;
    }
  }

  .live-chrono,
  .live-wind {
    background: #f4efe6;
    border: 1px solid #d9d1c3;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .live-lbl {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: #575249;
  }

  .live-readout {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 600;
    color: #121316;
  }

  .live-btns {
    display: flex;
    gap: 8px;
  }

  .btn-dark {
    padding: 9px 16px;
    border-radius: 999px;
    border: 1px solid #121316;
    background: #121316;
    color: #f4efe6;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-outline {
    padding: 9px 16px;
    border-radius: 999px;
    border: 1px solid #b5ab9a;
    background: #ffffff;
    color: #121316;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }

  .ref-badge {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--gold-bright);
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid var(--border-gold);
    background: var(--surface);
  }

  .ledger-grid {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 640px) {
    .ledger-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .ledger-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .ledger-cell {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
  }

  .ledger-cell dt {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--ink-muted);
  }

  .ledger-cell dd {
    margin: 8px 0 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--ink);
  }

  .salon-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: start;
  }

  @media (min-width: 960px) {
    .salon-grid {
      grid-template-columns: 1fr 1.15fr;
    }
  }

  .salon-copy {
    margin: 14px 0 0;
    font-size: 15px;
    line-height: 1.72;
    color: #3f3c37;
    max-width: 48ch;
  }

  .salon-note {
    margin: 14px 0 0;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #575249;
  }

  .form-card {
    background: #ffffff;
    border: 1px solid #d9d1c3;
    border-radius: 20px;
    padding: 28px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 540px) {
    .field-row {
      grid-template-columns: 1fr 1fr;
    }
  }

  .field label {
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #4d4942;
  }

  .field input,
  .field select {
    min-height: 44px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #c9c0b1;
    background: #f9f7f2;
    color: #121316;
    font-family: var(--font-display);
    font-size: 14px;
  }

  .form-error {
    margin: 0 0 14px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #fce8e6;
    color: #8c1d18;
    font-size: 13px;
  }

  .btn-submit {
    width: 100%;
    min-height: 48px;
    border-radius: 999px;
    border: none;
    background: #121316;
    color: #f4efe6;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .confirm-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .confirm-eyebrow {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #166534;
  }

  .confirm-box h3 {
    margin: 0;
    font-family: var(--font-serif);
    font-size: 28px;
  }

  .confirm-box p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: #3f3c37;
  }

  .footer {
    background: #0a0c10;
    border-top: 1px solid var(--border);
    padding: 24px;
  }

  .footer-inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-muted);
  }

  .footer-link {
    color: var(--gold-bright);
    text-decoration: none;
  }
</style>
