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
    slug: 'kinetic-04',
    href: '/gallery/kinetic-04/',
    code: '02',
    title: 'KINETIC-04 — Hardware Modular Synthesizer',
    subtitle:
      'Real compiled Svelte 5 (Runes) standalone application with Web Audio API dual-oscillator subtractive synthesis, 60fps phosphor-amber Canvas 2D oscilloscope, 6 custom SVG rotary encoders, 8-step hardware sequencer, and 13-key playable keybed.',
    category: 'Audio Hardware / Instrument',
    mode: 'Operate / Experience',
    theme: 'dark',
    coverImage: '/gallery/kinetic-04/cover.png',
    coverAlt: 'KINETIC-04 anodized hardware synthesizer interface with amber oscilloscope, six rotary knobs, 8-step sequencer, and tactile keyboard',
    techStack: ['Svelte 5 Runes', 'Vite 6', 'Web Audio API', 'Canvas 2D', 'Space Grotesk'],
    skillsUsed: ['pixelcraft-web', 'pixelcraft-direction', 'pixelcraft-craft', 'pixelcraft-accessibility'],
    swatches: [
      { name: 'Anodized Chassis', hex: '#e9e7e1' },
      { name: 'Matte Bezel', hex: '#16171a' },
      { name: 'Phosphor Amber', hex: '#f59e0b' },
      { name: 'Signal Vermilion', hex: '#c93316' },
    ],
    prompt:
      'Use pixelcraft, pixelcraft-web (svelte reference), pixelcraft-direction, pixelcraft-craft, and pixelcraft-accessibility. Build a standalone compiled Svelte 5 Runes hardware synthesizer named "KINETIC-04" inspired by Dieter Rams and Teenage Engineering industrial instruments. Zero React and zero raw OS range sliders. Include a real Web Audio API dual-oscillator subtractive engine with resonant low-pass filter and tape delay, a live 60fps phosphor-amber Canvas 2D oscilloscope, 6 custom pointer-draggable and keyboard-accessible SVG rotary encoders, an 8-step programmable sequencer with tempo controls, and a 13-key playable keyboard mapped to A-K.',
    evidence: {
      contrast: 'WCAG AA',
      states: '4 Presets + 8-Step Seq + Live Audio',
      responsive: '390 / 768 / 1440px',
    },
  },
];
