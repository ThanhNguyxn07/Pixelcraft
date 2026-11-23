export interface DemoEntry {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'Hardware / Creative' | 'SaaS / Observability' | 'Commerce / Editorial';
  mode: 'Persuade / Experience' | 'Operate / Dataviz' | 'Commerce / i18n';
  theme: 'dark' | 'light';
  techStack: string[];
  skillsUsed: string[];
  swatches: { name: string; hex: string }[];
  directionSummary: string;
  prompt: string;
  evidence: {
    slopScan: string;
    contrast: string;
    states: string;
    responsive: string;
  };
}

export const DEMOS: DemoEntry[] = [
  {
    slug: 'kuro-synth',
    code: '01',
    title: 'KURO-01 Modular Field Synth',
    subtitle: 'Industrial hardware showcase with a live interactive oscilloscope waveform, rotary parameter presets, and monumental editorial framing.',
    category: 'Hardware / Creative',
    mode: 'Persuade / Experience',
    theme: 'dark',
    techStack: ['Next.js 15', 'HTML5 Canvas DSP', 'GSAP', 'Tailwind v4'],
    skillsUsed: ['pixelcraft-direction', 'pixelcraft-craft', 'pixelcraft-web'],
    swatches: [
      { name: 'Anodized Black', hex: '#09090b' },
      { name: 'Machined Slate', hex: '#18181b' },
      { name: 'Signal Orange', hex: '#ff4d00' },
      { name: 'Chalk White', hex: '#f4f4f5' },
    ],
    directionSummary:
      'Brutalist industrial hardware bench: pure matte black aluminum surface, single international-orange signal accent, real-time interactive waveform canvas as the sole showpiece layer, zero 3-card SaaS clutter.',
    prompt:
      'Use pixelcraft, pixelcraft-direction, pixelcraft-craft, and pixelcraft-web. Build a hardware product launch page for "KURO-01", a pocket analog modular field synthesizer. Avoid centered-hero-plus-3-cards and purple gradients. Use a matte industrial black palette with one international-orange accent, giant tight-tracked display typography framing an interactive live oscilloscope waveform with selectable synthesis presets, full technical spec ledger, keyboard-accessible controls, and prefers-reduced-motion fallback.',
    evidence: {
      slopScan: '0 findings',
      contrast: 'WCAG AA',
      states: 'Preset + Reduced Motion',
      responsive: '390px + 1440px',
    },
  },
  {
    slug: 'veridian-trace',
    code: '02',
    title: 'Veridian Trace — SRE Console',
    subtitle: 'High-density distributed tracing & incident monitor with waterfall spans, tabular numerals, and live switchable UX state matrix.',
    category: 'SaaS / Observability',
    mode: 'Operate / Dataviz',
    theme: 'dark',
    techStack: ['Next.js 15', 'React 19', 'Tabular Dataviz', 'Tailwind v4'],
    skillsUsed: ['pixelcraft-patterns', 'pixelcraft-dataviz', 'pixelcraft-ux'],
    swatches: [
      { name: 'Console Ink', hex: '#0a0c10' },
      { name: 'Panel Surface', hex: '#11151c' },
      { name: 'Healthy Emerald', hex: '#10b981' },
      { name: 'Alert Crimson', hex: '#f43f5e' },
    ],
    directionSummary:
      'Operational instrument discipline: dense scannable trace table with aligned tabular numerals, zero idle animations, explicit status badges paired with icons (never color-only), and full Live / Loading / Empty / Stale / Error states.',
    prompt:
      'Use pixelcraft, pixelcraft-patterns (dashboard-admin, tables-crud), pixelcraft-dataviz, and pixelcraft-ux. Build an SRE distributed tracing and incident console called "Veridian Trace". Prioritize scanability over decoration: include a live span waterfall timeline, filterable trace table with tabular numerals, keyboard-focusable row inspection drawer, and an explicit state switcher proving Live, Loading skeleton, Empty, Stale-data timestamp, and Network Error recovery states.',
    evidence: {
      slopScan: '0 findings',
      contrast: 'WCAG AA',
      states: '5 Live UX States',
      responsive: '390px + 1440px',
    },
  },
  {
    slug: 'atelier-kyoto',
    code: '03',
    title: 'KŌBŌ — Ceramic & Monograph Store',
    subtitle: 'Editorial light-first storefront with interactive cart, accessible checkout validation recovery, and live English / Vietnamese i18n toggle.',
    category: 'Commerce / Editorial',
    mode: 'Commerce / i18n',
    theme: 'light',
    techStack: ['Next.js 15', 'React 19', 'DTCG Light Tokens', 'EN / VI i18n'],
    skillsUsed: ['pixelcraft-patterns', 'pixelcraft-ux', 'pixelcraft-accessibility'],
    swatches: [
      { name: 'Mineral Paper', hex: '#f7f5f0' },
      { name: 'Warm Clay', hex: '#ece7dd' },
      { name: 'Sumi Ink', hex: '#141413' },
      { name: 'Cobalt Stamp', hex: '#1d4ed8' },
    ],
    directionSummary:
      'Warm mineral-paper editorial commerce: asymmetric catalog grid, high-contrast charcoal ink with cobalt spot accent, live EN ↔ Tiếng Việt switch proving Vietnamese diacritics and text expansion hold cleanly, plus accessible checkout error recovery that never wipes user input.',
    prompt:
      'Use pixelcraft, pixelcraft-patterns (commerce), pixelcraft-ux (forms, i18n), and pixelcraft-accessibility. Build an editorial light-mode storefront for "KŌBŌ", a handcrafted ceramic & architecture monograph studio. Include an asymmetric product catalog, interactive cart with quantity controls, an accessible checkout form that preserves input on validation errors and announces errors via role="alert", and a live English / Vietnamese language toggle verifying diacritic line-height and layout stability.',
    evidence: {
      slopScan: '0 findings',
      contrast: 'WCAG AA',
      states: 'Cart + Error Recovery + VI',
      responsive: '390px + 1440px',
    },
  },
];
