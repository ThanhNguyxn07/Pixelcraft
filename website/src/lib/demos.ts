export interface DemoEntry {
  slug: string;
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
    coverImage: '/demos/villa-solare/hero.jpg',
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
];
