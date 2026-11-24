export interface DemoEntry {
  slug: string;
  href?: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  mode: string;
  theme: 'dark' | 'light';
  coverImage: string;
  coverAlt: string;
  techStack: string[];
  skillsUsed: string[];
  swatches: { name: string; hex: string }[];
  prompt: string;
  evidence: {
    contrast: string;
    states: string;
    responsive: string;
  };
}

export const DEMOS: DemoEntry[] = [
  {
    slug: 'villa-solare',
    code: '01',
    title: 'Villa Solare — Coastal Architectural Sanctuary',
    subtitle:
      'Editorial hospitality experience featuring real open-license Mediterranean architecture photography, Cormorant Garamond serif typography, interactive suite switcher, saltwater sanctuary plate, and accessible reservation ledger.',
    category: 'Hospitality / Editorial',
    mode: 'Persuade / Read',
    theme: 'light',
    coverImage: '/gallery/villa-solare/hero.jpg',
    coverAlt: 'Villa Solare limestone cliffside terrace overlooking the Mediterranean sea',
    techStack: ['Next.js 15', 'React 19', 'Tailwind v4', 'Cormorant Garamond', 'Open Photography'],
    skillsUsed: ['pixelcraft-direction', 'pixelcraft-craft', 'pixelcraft-ux', 'pixelcraft-accessibility'],
    swatches: [
      { name: 'Travertine Alabaster', hex: '#f6f2ea' },
      { name: 'Warm Sand', hex: '#efe9de' },
      { name: 'Espresso Ink', hex: '#1a1714' },
      { name: 'Terracotta Bronze', hex: '#8f5b3c' },
    ],
    prompt:
      'Use pixelcraft, pixelcraft-direction, pixelcraft-craft, pixelcraft-ux, and pixelcraft-accessibility. Build an editorial luxury coastal boutique hotel site for "Villa Solare" on the Ravello cliffs. Avoid dark SaaS cards, emoji, and placeholder boxes. Use real Mediterranean architectural photography, a full-bleed 100svh hero with whisper-quiet navigation and a bottom stay strip, Cormorant Garamond italic serif + Plus Jakarta Sans body, an interactive 3-suite switcher with floor area and nightly EUR rates, a full-width saltwater sanctuary plate, and an accessible reservation inquiry form that preserves user input on error and stops safely before any live charge.',
    evidence: {
      contrast: 'WCAG AA',
      states: '3 Suites + Form Recovery',
      responsive: '390px + 1440px',
    },
  },
  {
    slug: 'solaris-9',
    href: '/gallery/solaris-9/',
    code: '02',
    title: 'SOLARIS-9 — Orbital Telemetry Observatory',
    subtitle:
      'Real compiled Vue 3 + TypeScript frontend paired with a Go 1.27 WebAssembly Keplerian orbit solver (Newton-Raphson vis-viva physics) and a zero-dependency custom WebGL2 GLSL atmospheric raymarched planet renderer.',
    category: 'Aerospace / Real-Time 3D + WASM',
    mode: 'Experience / Operate',
    theme: 'dark',
    coverImage: '/gallery/solaris-9/cover.png',
    coverAlt: 'SOLARIS-9 WebGL2 raymarched Earth with luminous Rayleigh atmosphere, tilted orbital ring, spacecraft beacon, and live Go WebAssembly Keplerian telemetry HUD',
    techStack: ['Vue 3 + TS', 'Go WebAssembly', 'WebGL2 GLSL', 'Vite 6', 'Kepler Physics'],
    skillsUsed: ['pixelcraft-web', 'pixelcraft-dataviz', 'pixelcraft-direction', 'pixelcraft-accessibility'],
    swatches: [
      { name: 'Deep Void', hex: '#04060a' },
      { name: 'HUD Obsidian', hex: '#090d15' },
      { name: 'Rayleigh Ice', hex: '#6cb8ff' },
      { name: 'Terminator Gold', hex: '#f2b366' },
    ],
    prompt:
      'Use pixelcraft, pixelcraft-web (vue-nuxt reference), pixelcraft-dataviz, pixelcraft-direction, and pixelcraft-accessibility from https://github.com/ThanhNguyxnOrg/Pixelcraft. Build a standalone Vue 3 + TypeScript orbital observatory named "SOLARIS-9" powered by a real Go WebAssembly Keplerian orbital mechanics solver (Newton-Raphson M = E - e*sin(E) and vis-viva velocity) and a custom raw WebGL2 GLSL raymarched planetary renderer with Rayleigh atmospheric limb scattering, night-side city lights, volumetric clouds, a 3D inclined orbital trajectory ring, and a moving spacecraft beacon. Include 4 real orbital regimes (ISS LEO, Molniya HEO, Sentinel-6 SSO, Galileo MEO), interactive drag-to-orbit camera, time-warp controls, and a live SVG velocity trace.',
    evidence: {
      contrast: 'WCAG AA',
      states: '4 Orbits + Go WASM + WebGL2 Drag',
      responsive: '390 / 768 / 1440px',
    },
  },
  {
    slug: 'chronos',
    href: '/gallery/chronos/',
    code: '03',
    title: 'CHRONOS — Swiss Mechanical Tourbillon Atelier',
    subtitle:
      'Compiled Svelte 5 Runes horology showcase featuring a 60fps HiDPI Canvas 2D mechanical flying tourbillon, 4 Hz oscillating balance wheel with breathing hairspring, meshing 18K rose-gold gear train, X-Ray Skeleton mode, crown winding, and working chronograph.',
    category: 'Haute Horlogerie / Kinematics',
    mode: 'Experience / Persuade',
    theme: 'dark',
    coverImage: '/gallery/chronos/cover.png',
    coverAlt: 'CHRONOS Swiss mechanical flying tourbillon timepiece with 18K rose gold bezel, midnight enamel dial, exposed 4 Hz balance wheel, and horological controls',
    techStack: ['Svelte 5 Runes', 'Canvas 2D Kinematics', 'Vite 6', 'Cormorant Garamond'],
    skillsUsed: ['pixelcraft-web', 'pixelcraft-direction', 'pixelcraft-craft', 'pixelcraft-accessibility'],
    swatches: [
      { name: 'Midnight Enamel', hex: '#0a0c10' },
      { name: '18K Rose Gold', hex: '#d9a76a' },
      { name: 'Heat-Blued Steel', hex: '#5a9bff' },
      { name: 'Ruby Bearing', hex: '#e03c5a' },
    ],
    prompt:
      'Use pixelcraft, pixelcraft-web (svelte reference), pixelcraft-direction, pixelcraft-craft, and pixelcraft-accessibility from https://github.com/ThanhNguyxnOrg/Pixelcraft. Build a standalone compiled Svelte 5 Runes Geneva haute horlogerie showcase named "CHRONOS — Calibre 09". Render a real-time 60fps HiDPI Canvas 2D mechanical flying tourbillon with a 4 Hz (28,800 vph) oscillating balance wheel, breathing concentric hairspring, Côtes de Genève mainplate, meshing spoked rose-gold & rhodium gears, ruby jewel bearings, 72h power-reserve sub-dial, working blued-steel chronograph, X-Ray Skeleton reveal, and 0.25x escapement slow-motion inspection.',
    evidence: {
      contrast: 'WCAG AA',
      states: '3 Modes + Chrono + Crown Wind',
      responsive: '390 / 768 / 1440px',
    },
  },
];
