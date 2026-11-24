<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { mountOrbitalRenderer } from './lib/orbitalShader';

interface Mission {
  id: string;
  code: string;
  name: string;
  regime: string;
  semiMajorKm: number;
  eccentricity: number;
  inclinationDeg: number;
  orbitScale: number;
  atmoColor: [number, number, number];
  accentColor: [number, number, number];
  accentHex: string;
  description: string;
}

interface OrbitState {
  altitudeKm: number;
  velocityKmS: number;
  periodMin: number;
  trueAnomaly: number;
  latDeg: number;
  lonDeg: number;
  apogeeKm: number;
  perigeeKm: number;
}

declare global {
  interface Window {
    Go?: new () => { importObject: WebAssembly.Imports; run: (inst: WebAssembly.Instance) => void };
    solarisSolveOrbit?: (a: number, e: number, i: number, t: number) => OrbitState;
    solarisWasmReady?: boolean;
  }
}

const MISSIONS: Mission[] = [
  {
    id: 'iss',
    code: 'LEO-01',
    name: 'ISS Orbital Lab',
    regime: 'Low Earth Orbit',
    semiMajorKm: 6791,
    eccentricity: 0.0007,
    inclinationDeg: 51.64,
    orbitScale: 1.24,
    atmoColor: [0.35, 0.68, 1.0],
    accentColor: [0.42, 0.72, 1.0],
    accentHex: '#6cb8ff',
    description: 'Crewed microgravity research platform completing 15.5 revolutions per solar day.',
  },
  {
    id: 'molniya',
    code: 'HEO-02',
    name: 'Molniya Relay',
    regime: 'Highly Elliptical',
    semiMajorKm: 13200,
    eccentricity: 0.42,
    inclinationDeg: 63.4,
    orbitScale: 1.44,
    atmoColor: [0.42, 0.66, 0.98],
    accentColor: [0.95, 0.7, 0.4],
    accentHex: '#f2b366',
    description: 'High-inclination elliptical relay lingering over northern polar horizons at apogee.',
  },
  {
    id: 'sentinel',
    code: 'SSO-03',
    name: 'Sentinel-6 Polar',
    regime: 'Sun-Synchronous',
    semiMajorKm: 7707,
    eccentricity: 0.0012,
    inclinationDeg: 66.04,
    orbitScale: 1.32,
    atmoColor: [0.28, 0.78, 0.88],
    accentColor: [0.2, 0.83, 0.6],
    accentHex: '#34d399',
    description: 'Precision radar altimetry satellite mapping global sea-surface topography.',
  },
  {
    id: 'galileo',
    code: 'MEO-04',
    name: 'Galileo Nav-24',
    regime: 'Medium Earth Orbit',
    semiMajorKm: 10800,
    eccentricity: 0.14,
    inclinationDeg: 56.0,
    orbitScale: 1.38,
    atmoColor: [0.48, 0.62, 1.0],
    accentColor: [0.96, 0.56, 0.42],
    accentHex: '#f58f6b',
    description: 'Atomic-clock navigation constellation delivering decimeter orbital ephemeris.',
  },
];

const WARP_MODES = [
  { label: 'PAUSE', value: 0 },
  { label: '10×', value: 10 },
  { label: '120×', value: 120 },
  { label: '600×', value: 600 },
];

const canvasRef = ref<HTMLCanvasElement | null>(null);
const selectedId = ref<string>('iss');
const warp = ref<number>(120);
const wasmStatus = ref<'loading' | 'go-wasm' | 'fallback'>('loading');

const yaw = ref(0.42);
const pitch = ref(0.24);
let dragging = false;
let lastX = 0;
let lastY = 0;

let simTime = 840;
let lastTick = performance.now();
let telemetryTimer = 0;
let stopGl: (() => void) | null = null;

const activeMission = computed(() => MISSIONS.find((m) => m.id === selectedId.value) ?? MISSIONS[0]);

const telemetry = ref<OrbitState>({
  altitudeKm: 420.0,
  velocityKmS: 7.66,
  periodMin: 92.9,
  trueAnomaly: 0.65,
  latDeg: 28.4,
  lonDeg: -42.1,
  apogeeKm: 424.7,
  perigeeKm: 415.2,
});

const historyPoints = ref<number[]>([7.66, 7.66, 7.66, 7.66, 7.66, 7.66, 7.66, 7.66, 7.66, 7.66]);

// Analytical fallback only until Go WASM finishes instantiating (<80ms)
function fallbackSolve(a: number, e: number, incDeg: number, t: number): OrbitState {
  const mu = 398600.4418;
  const re = 6371.0;
  const periodSec = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu);
  const M = ((2 * Math.PI) / periodSec) * t;
  const E = M + e * Math.sin(M);
  const r = a * (1 - e * Math.cos(E));
  const v = Math.sqrt(mu * (2 / r - 1 / a));
  const nu = Math.atan2(Math.sqrt(1 - e * e) * Math.sin(E), Math.cos(E) - e);
  const inc = (incDeg * Math.PI) / 180;
  const lat = (Math.asin(Math.sin(inc) * Math.sin(nu)) * 180) / Math.PI;
  const lon = ((((Math.atan2(Math.cos(inc) * Math.sin(nu), Math.cos(nu)) - t * 7.292e-5) * 180) / Math.PI + 540) % 360) - 180;
  return {
    altitudeKm: r - re,
    velocityKmS: v,
    periodMin: periodSec / 60,
    trueAnomaly: nu,
    latDeg: lat,
    lonDeg: lon,
    apogeeKm: a * (1 + e) - re,
    perigeeKm: a * (1 - e) - re,
  };
}

function stepPhysics() {
  const now = performance.now();
  const dt = Math.min(0.1, (now - lastTick) / 1000);
  lastTick = now;
  simTime += dt * warp.value;

  const m = activeMission.value;
  const st =
    window.solarisWasmReady && window.solarisSolveOrbit
      ? window.solarisSolveOrbit(m.semiMajorKm, m.eccentricity, m.inclinationDeg, simTime)
      : fallbackSolve(m.semiMajorKm, m.eccentricity, m.inclinationDeg, simTime);

  telemetry.value = st;
  const next = [...historyPoints.value.slice(-23), st.velocityKmS];
  historyPoints.value = next;
}

const sparklinePath = computed(() => {
  const pts = historyPoints.value;
  if (pts.length < 2) return '';
  const min = Math.min(...pts) - 0.08;
  const max = Math.max(...pts) + 0.08;
  const span = Math.max(0.01, max - min);
  return pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * 220;
      const y = 44 - ((v - min) / span) * 36;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
});

function onPointerDown(e: PointerEvent) {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  yaw.value += dx * 0.0055;
  pitch.value = Math.max(-1.05, Math.min(1.05, pitch.value + dy * 0.0055));
}

function onPointerUp(e: PointerEvent) {
  if (!dragging) return;
  dragging = false;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
}

async function bootGoWasm() {
  try {
    if (!window.Go) {
      wasmStatus.value = 'fallback';
      return;
    }
    const go = new window.Go();
    const res = await fetch('/gallery/solaris-9/orbit.wasm');
    const bytes = await res.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
    go.run(instance);
    wasmStatus.value = 'go-wasm';
  } catch {
    wasmStatus.value = 'fallback';
  }
}

onMounted(() => {
  bootGoWasm();
  if (canvasRef.value) {
    stopGl = mountOrbitalRenderer(canvasRef.value, () => ({
      yaw: yaw.value,
      pitch: pitch.value,
      inclination: activeMission.value.inclinationDeg,
      trueAnomaly: telemetry.value.trueAnomaly,
      orbitScale: activeMission.value.orbitScale,
      atmoColor: activeMission.value.atmoColor,
      accentColor: activeMission.value.accentColor,
    }));
  }
  stepPhysics();
  telemetryTimer = window.setInterval(stepPhysics, 60);
});

onBeforeUnmount(() => {
  if (stopGl) stopGl();
  if (telemetryTimer) window.clearInterval(telemetryTimer);
});
</script>

<template>
  <div class="stage">
    <!-- Full-Bleed Custom WebGL2 Raymarched Planetary Canvas -->
    <canvas
      ref="canvasRef"
      class="gl-canvas"
      aria-label="Interactive WebGL2 raymarched Earth and live orbital trajectory"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    />

    <!-- Top Mission Masthead -->
    <header class="hud-top">
      <div class="hud-top-left">
        <a href="/gallery" class="back-pill">← Gallery</a>
        <div class="brand-lockup">
          <span class="brand-dot" aria-hidden="true" />
          <span class="brand-name">SOLARIS-9</span>
        </div>
        <span class="stack-pill">VUE 3 · GO WASM · WEBGL2 GLSL</span>
      </div>

      <div class="hud-top-right">
        <span class="wasm-pill">
          <span class="wasm-led" :class="{ active: wasmStatus === 'go-wasm' }" aria-hidden="true" />
          {{ wasmStatus === 'go-wasm' ? 'GO WASM SOLVER LIVE' : 'INITIALIZING WASM' }}
        </span>
        <div class="warp-group" role="group" aria-label="Simulation time warp">
          <button
            v-for="w in WARP_MODES"
            :key="w.label"
            type="button"
            class="warp-btn"
            :class="{ active: warp === w.value }"
            @click="warp = w.value"
          >
            {{ w.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main HUD Overlay Layout -->
    <main class="hud-grid">
      <!-- Left Editorial Mission Column -->
      <section class="mission-panel" aria-label="Mission selection">
        <p class="eyebrow">{{ activeMission.code }} · {{ activeMission.regime }}</p>
        <h1 class="mission-title">
          {{ activeMission.name }}
        </h1>
        <p class="mission-desc">{{ activeMission.description }}</p>

        <div class="mission-list" role="tablist" aria-label="Select spacecraft orbit">
          <button
            v-for="m in MISSIONS"
            :key="m.id"
            type="button"
            role="tab"
            :aria-selected="selectedId === m.id"
            class="mission-btn"
            :class="{ active: selectedId === m.id }"
            @click="selectedId = m.id"
          >
            <span class="m-code">{{ m.code }}</span>
            <span class="m-name">{{ m.name }}</span>
            <span class="m-inc tabular-nums">{{ m.inclinationDeg.toFixed(1) }}°</span>
          </button>
        </div>

        <p class="drag-hint">DRAG PLANET TO ORBIT CAMERA · REAL KEPLER SOLVER IN GO WASM</p>
      </section>

      <!-- Right Live Telemetry Column -->
      <aside class="telemetry-panel" aria-label="Live orbital telemetry">
        <div class="panel-head">
          <span>KEPLERIAN EPHEMERIS</span>
          <span class="tabular-nums" :style="{ color: activeMission.accentHex }">
            e = {{ activeMission.eccentricity.toFixed(4) }}
          </span>
        </div>

        <dl class="metrics-grid tabular-nums">
          <div class="metric-cell">
            <dt>ALTITUDE</dt>
            <dd>{{ telemetry.altitudeKm.toFixed(1) }} <small>km</small></dd>
          </div>
          <div class="metric-cell">
            <dt>VELOCITY</dt>
            <dd>{{ telemetry.velocityKmS.toFixed(3) }} <small>km/s</small></dd>
          </div>
          <div class="metric-cell">
            <dt>LATITUDE</dt>
            <dd>{{ telemetry.latDeg >= 0 ? '+' : '' }}{{ telemetry.latDeg.toFixed(2) }}°</dd>
          </div>
          <div class="metric-cell">
            <dt>LONGITUDE</dt>
            <dd>{{ telemetry.lonDeg >= 0 ? '+' : '' }}{{ telemetry.lonDeg.toFixed(2) }}°</dd>
          </div>
          <div class="metric-cell">
            <dt>PERIOD</dt>
            <dd>{{ telemetry.periodMin.toFixed(1) }} <small>min</small></dd>
          </div>
          <div class="metric-cell">
            <dt>APOGEE</dt>
            <dd>{{ telemetry.apogeeKm.toFixed(0) }} <small>km</small></dd>
          </div>
        </dl>

        <!-- Velocity Sparkline (pixelcraft-dataviz) -->
        <div class="spark-box">
          <div class="spark-head">
            <span>VIS-VIVA VELOCITY TRACE</span>
            <span class="tabular-nums">{{ telemetry.velocityKmS.toFixed(3) }} km/s</span>
          </div>
          <svg viewBox="0 0 220 48" class="spark-svg" aria-label="Orbital velocity trace">
            <line x1="0" y1="24" x2="220" y2="24" stroke="#1e283b" stroke-dasharray="3 3" />
            <path
              :d="sparklinePath"
              fill="none"
              :stroke="activeMission.accentHex"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: var(--void);
  color: var(--ink);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.gl-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
  touch-action: none;
  z-index: 0;
}

.gl-canvas:active {
  cursor: grabbing;
}

.hud-top {
  position: relative;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
}

.hud-top-left,
.hud-top-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.back-pill {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: var(--panel);
  transition: border-color 160ms ease, background 160ms ease;
}

.back-pill:hover {
  border-color: var(--amber);
  background: var(--panel-elev);
}

.brand-lockup {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--panel);
}

.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--amber);
}

.brand-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.stack-pill {
  display: none;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--panel);
}

@media (min-width: 900px) {
  .stack-pill {
    display: inline-block;
  }
}

.wasm-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--ink);
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--panel);
}

.wasm-led {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--amber);
}

.wasm-led.active {
  background: var(--emerald);
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.7);
}

.warp-group {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--panel);
}

.warp-btn {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 6px 11px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
}

.warp-btn.active {
  background: var(--ink);
  color: var(--void);
}

.hud-grid {
  position: relative;
  z-index: 10;
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 210px 20px 28px;
  pointer-events: none;
}

@media (min-width: 1024px) {
  .hud-grid {
    padding: 20px 24px 28px;
    grid-template-columns: 380px 1fr 350px;
    align-items: end;
  }
}

.mission-panel,
.telemetry-panel {
  pointer-events: auto;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}

@media (min-width: 1024px) {
  .telemetry-panel {
    grid-column: 3;
  }
}

.eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--amber);
}

.mission-title {
  margin: 8px 0 0;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3.4vw, 2.75rem);
  font-weight: 500;
  line-height: 1.02;
  color: var(--ink);
}

.mission-desc {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.62;
  color: var(--ink-muted);
}

.mission-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mission-btn {
  display: grid;
  grid-template-columns: 58px 1fr auto;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--panel-elev);
  color: var(--ink-muted);
  text-align: left;
  cursor: pointer;
  transition: border-color 140ms ease, color 140ms ease, background 140ms ease;
}

.mission-btn:hover {
  border-color: var(--border-strong);
  color: var(--ink);
}

.mission-btn.active {
  border-color: var(--amber);
  background: #141d2e;
  color: var(--ink);
}

.m-code {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--amber);
}

.m-name {
  font-size: 13px;
  font-weight: 600;
}

.m-inc {
  font-family: var(--font-mono);
  font-size: 11px;
}

.drag-hint {
  margin: 14px 0 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--ink-muted);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.metrics-grid {
  margin: 14px 0 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.metric-cell {
  background: var(--panel-elev);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
}

.metric-cell dt {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
}

.metric-cell dd {
  margin: 4px 0 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
}

.metric-cell dd small {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-muted);
}

.spark-box {
  margin-top: 12px;
  background: var(--panel-elev);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
}

.spark-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-muted);
  margin-bottom: 6px;
}

.spark-svg {
  width: 100%;
  height: 44px;
  display: block;
}
</style>
