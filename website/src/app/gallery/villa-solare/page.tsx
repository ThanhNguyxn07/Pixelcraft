'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Compass } from 'lucide-react';

interface SuiteSpec {
  id: string;
  num: string;
  name: string;
  area: string;
  exposure: string;
  rateEur: number;
  image: string;
  imageAlt: string;
  summary: string;
  details: string[];
}

const SUITES: SuiteSpec[] = [
  {
    id: 'belvedere',
    num: '01',
    name: 'Belvedere Arch Terrace',
    area: '78 m²',
    exposure: 'South-West · Sea Horizon',
    rateEur: 940,
    image: '/gallery/villa-solare/suite.jpg',
    imageAlt: 'Whitewashed arched coastal terrace with two woven chairs overlooking the Mediterranean sea',
    summary:
      'Framed by a vaulted lime-plaster loggia, the Belvedere opens directly onto a private stone terrace suspended above the coastline. Hand-troweled walls keep the interior cool through midday heat.',
    details: [
      'Private 24 m² arched sea-view loggia',
      'Hand-loomed Italian flax linen & travertine bath',
      'Morning breakfast served directly on terrace',
    ],
  },
  {
    id: 'pavilion',
    num: '02',
    name: 'The Slate Pool Pavilion',
    area: '112 m²',
    exposure: 'West · Mountain & Gulf',
    rateEur: 1380,
    image: '/gallery/villa-solare/pool.jpg',
    imageAlt: 'Dark slate saltwater infinity pool overlooking coastal hills and the ocean horizon',
    summary:
      'Set at the quietest edge of the estate beside the dark-slate saltwater basin, pairing uninterrupted horizon lines with shaded teak loungers and direct garden access.',
    details: [
      'Direct private steps to the saltwater infinity basin',
      'Outdoor limestone rain shower & cedar sauna access',
      'Dedicated evening aperitivo service',
    ],
  },
  {
    id: 'wisteria',
    num: '03',
    name: 'Wisteria Courtyard Suite',
    area: '64 m²',
    exposure: 'East · Botanical Garden',
    rateEur: 760,
    image: '/gallery/villa-solare/dining.jpg',
    imageAlt: 'Sunlit Mediterranean courtyard garden with palms, stone paths, and blooming wisteria',
    summary:
      'Tucked beneath century-old wisteria trellises and Mediterranean palms, designed for quiet mornings, long reading afternoons, and cool evening breezes off the cliff.',
    details: [
      'Ground-level private entry into the terraced gardens',
      'Curated architectural library & writing desk',
      'Late 14:00 checkout included',
    ],
  },
];

export default function VillaSolareDemo() {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(SUITES[0].id);
  const [nights, setNights] = useState<number>(3);
  const [guests, setGuests] = useState<number>(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activeSuite = SUITES.find((s) => s.id === selectedSuiteId) ?? SUITES[0];
  const estimatedTotal = activeSuite.rateEur * nights;

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    if (guestName.trim().length < 2) {
      setFormError('Please enter your full name for the reservation ledger. Your other details were preserved.');
      document.getElementById('vs-name')?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
      setFormError('Please enter a valid email address (for example, elena@atelier.it). Your input was preserved.');
      document.getElementById('vs-email')?.focus();
      return;
    }
    setFormError(null);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#1a1714]">
      {/* FULL-BLEED 100SVH EDITORIAL HERO */}
      <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#1a1714] text-[#f6f2ea]">
        <img
          src="/gallery/villa-solare/hero.jpg"
          alt="Limestone cliffside terrace with marble busts overlooking the Mediterranean coastline"
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.82] contrast-[1.05]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,17,14,0.52) 0%, rgba(20,17,14,0.12) 40%, rgba(20,17,14,0.72) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Whisper-quiet Top Navigation */}
        <header className="relative z-10 mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-6 sm:px-12">
          <div className="flex items-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/30 px-3 py-1 font-mono text-[11px] text-white/90 no-underline backdrop-blur-md transition-colors hover:bg-white hover:text-[#1a1714]"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Gallery
            </Link>
            <a
              href="#main-content"
              className="font-serif text-xl font-semibold tracking-[0.22em] text-white no-underline sm:text-2xl"
            >
              VILLA SOLARE
            </a>
          </div>
          <nav aria-label="Villa Solare navigation" className="flex items-center gap-7 sm:gap-10">
            <a
              href="#house"
              className="hidden text-xs uppercase tracking-[0.2em] text-white/85 no-underline transition-colors hover:text-white md:inline"
            >
              The House
            </a>
            <a
              href="#suites"
              className="hidden text-xs uppercase tracking-[0.2em] text-white/85 no-underline transition-colors hover:text-white sm:inline"
            >
              Suites
            </a>
            <a
              href="#sanctuary"
              className="hidden text-xs uppercase tracking-[0.2em] text-white/85 no-underline transition-colors hover:text-white sm:inline"
            >
              Sanctuary
            </a>
            <a
              href="#reserve"
              className="border-b border-white/70 pb-0.5 text-xs uppercase tracking-[0.2em] text-white no-underline transition-opacity hover:opacity-80"
            >
              Reserve
            </a>
          </nav>
        </header>

        {/* Monumental Editorial Headline */}
        <div className="relative z-10 mx-auto my-auto w-full max-w-[1400px] px-6 py-12 sm:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-white/80">
            RAVELLO · AMALFI CLIFFS · EST. 1928
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-[clamp(2.9rem,7.2vw,6.4rem)] font-normal leading-[0.98] tracking-[-0.02em] text-white">
            Carved into limestone,{' '}
            <em className="italic font-normal">suspended over sea.</em>
          </h1>
        </div>

        {/* Quiet Bottom Stay Inquiry Strip */}
        <div className="relative z-10 border-t border-white/20 bg-[#1a1714]/45 backdrop-blur-md">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 items-center gap-4 px-6 py-4 sm:grid-cols-4 sm:px-12">
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
                Season
              </span>
              <span className="font-serif text-lg text-white">April — October</span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
                Residences
              </span>
              <span className="font-serif text-lg text-white">12 Private Suites</span>
            </div>
            <div className="hidden sm:block">
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
                Elevation
              </span>
              <span className="font-serif text-lg text-white">365 m above Tyrrhenian Sea</span>
            </div>
            <div className="text-right">
              <a
                href="#reserve"
                className="inline-flex items-center gap-2 rounded-full bg-[#f6f2ea] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a1714] no-underline transition-colors hover:bg-white"
              >
                Inquire Stay
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content">
        {/* SECTION 01 — EDITORIAL NARRATIVE & ASYMMETRIC SPREAD */}
        <section id="house" className="mx-auto max-w-[1400px] px-6 py-24 sm:px-12 sm:py-36">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8f5b3c]">
                01 / THE HOUSE
              </p>
              <h2 className="mt-5 font-serif text-[clamp(2rem,4vw,3.4rem)] font-normal leading-[1.12] text-[#1a1714]">
                Twelve quiet rooms where <em className="italic">stone, salt air, and time</em> set the pace.
              </h2>
              <p className="mt-6 text-base leading-[1.75] text-[#5f584f]">
                Built along an eleventh-century limestone ridge above Ravello, Villa Solare was restored with lime plaster, local travertine, and unlacquered brass—leaving the horizon unobstructed and every terrace private.
              </p>
              <div className="mt-8 flex items-center gap-3 border-t border-[#1a1714]/15 pt-6 font-mono text-xs text-[#5f584f]">
                <Compass className="h-4 w-4 text-[#8f5b3c]" aria-hidden="true" />
                <span>40°38&apos;57&quot;N · 14°36&apos;46&quot;E — LIGURIAN &amp; AMALFI COAST</span>
              </div>
            </div>

            <figure className="lg:col-span-7">
              <div className="overflow-hidden">
                <img
                  src="/gallery/villa-solare/dining.jpg"
                  alt="Terraced botanical courtyard with palms and blooming wisteria"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 flex justify-between font-mono text-[11px] text-[#5f584f]">
                <span>FIG. 01 — THE UPPER WISTERIA COURTYARD</span>
                <span>MORNING LIGHT · 08:30</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* SECTION 02 — INTERACTIVE SUITES SHOWCASE */}
        <section
          id="suites"
          className="border-t border-[#1a1714]/15 bg-[#efe9de] px-6 py-24 sm:px-12 sm:py-32"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8f5b3c]">
                  02 / RESIDENCES
                </p>
                <h2 className="mt-3 font-serif text-[clamp(2.2rem,4.5vw,3.8rem)] font-normal leading-[1.06] text-[#1a1714]">
                  Suites &amp; Pavilions
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#5f584f]">
                Select a residence below to inspect its orientation, terrace dimensions, and nightly rate.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Interactive Suite Selector Rail */}
              <div className="flex flex-col border-t border-[#1a1714]/20 lg:col-span-5" role="tablist" aria-label="Select a suite">
                {SUITES.map((suite) => {
                  const active = suite.id === activeSuite.id;
                  return (
                    <button
                      key={suite.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedSuiteId(suite.id)}
                      className={`group flex flex-col gap-2 border-b border-[#1a1714]/20 py-6 text-left cursor-pointer transition-colors ${
                        active ? 'bg-[#1a1714]/[0.04] px-4 -mx-4' : 'hover:bg-[#1a1714]/[0.02] px-4 -mx-4'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-mono text-xs text-[#8f5b3c]">{suite.num}</span>
                        <span className="font-mono text-xs tabular-nums text-[#5f584f]">
                          {suite.area} · €{suite.rateEur}/night
                        </span>
                      </div>
                      <span className="font-serif text-2xl font-medium text-[#1a1714] sm:text-3xl">
                        {suite.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#5f584f]">{suite.exposure}</span>
                    </button>
                  );
                })}

                <div className="mt-8">
                  <p className="text-sm leading-[1.75] text-[#453f38]">{activeSuite.summary}</p>
                  <ul className="mt-5 m-0 list-none space-y-2 border-t border-[#1a1714]/15 pt-5 p-0 font-mono text-xs text-[#5f584f]">
                    {activeSuite.details.map((d) => (
                      <li key={d}>— {d}</li>
                    ))}
                  </ul>
                  <a
                    href="#reserve"
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1a1714] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#f6f2ea] no-underline transition-colors hover:bg-[#8f5b3c]"
                  >
                    Reserve {activeSuite.name}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Large Editorial Suite Photograph */}
              <div className="lg:col-span-7" role="tabpanel">
                <div className="overflow-hidden bg-[#ded7c8]">
                  <img
                    src={activeSuite.image}
                    alt={activeSuite.imageAlt}
                    className="aspect-[16/11] w-full object-cover transition-opacity duration-300"
                  />
                </div>
                <div className="mt-3 flex flex-wrap justify-between gap-2 font-mono text-[11px] text-[#5f584f]">
                  <span>{activeSuite.num} — {activeSuite.name.toUpperCase()}</span>
                  <span>{activeSuite.area} · {activeSuite.exposure.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 03 — FULL-WIDTH SALTWATER SANCTUARY PLATE */}
        <section id="sanctuary" className="relative overflow-hidden bg-[#1a1714] text-white">
          <img
            src="/gallery/villa-solare/pool.jpg"
            alt="Dark slate infinity pool overlooking mountains and coastal horizon"
            className="h-[68vh] min-h-[460px] w-full object-cover brightness-[0.75]"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(20,17,14,0.1) 0%, rgba(20,17,14,0.78) 100%)',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-6 pb-12 sm:px-12 sm:pb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#e6c3a5]">
              03 / THE SALTWATER BASIN
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,4.4vw,3.8rem)] font-normal leading-[1.08] text-white">
              Heated mineral water, dark stone, and an <em className="italic">unbroken horizon.</em>
            </h2>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/25 pt-5 font-mono text-xs">
              <div>
                <span className="block text-white/60">07:00</span>
                <span>Silent Lap Swim</span>
              </div>
              <div>
                <span className="block text-white/60">13:00</span>
                <span>Olive Terrace Lunch</span>
              </div>
              <div>
                <span className="block text-white/60">19:30</span>
                <span>Sunset Aperitivo</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04 — PRIVATE RESERVATION LEDGER */}
        <section id="reserve" className="mx-auto max-w-[1400px] px-6 py-24 sm:px-12 sm:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8f5b3c]">
                04 / RESERVATION LEDGER
              </p>
              <h2 className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.4rem)] font-normal leading-[1.1] text-[#1a1714]">
                Request a private stay.
              </h2>
              <p className="mt-4 text-sm leading-[1.75] text-[#5f584f]">
                Our concierge responds personally within two hours with suite availability and private transfer options from Naples or Salerno. No deposit is charged at inquiry.
              </p>

              <div className="mt-8 border-t border-[#1a1714]/15 pt-6 font-mono text-xs text-[#5f584f] space-y-2">
                <div className="flex justify-between">
                  <span>SELECTED SUITE</span>
                  <span className="font-semibold text-[#1a1714]">{activeSuite.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>DURATION &amp; GUESTS</span>
                  <span className="tabular-nums text-[#1a1714]">
                    {nights} nights · {guests} guests
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#1a1714]/15 pt-3 text-sm">
                  <span>ESTIMATED TOTAL</span>
                  <span className="font-semibold tabular-nums text-[#1a1714]">
                    €{estimatedTotal.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleInquiry}
              noValidate
              className="space-y-6 border-t border-[#1a1714]/20 pt-8 lg:col-span-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="vs-suite" className="block font-mono text-[11px] uppercase tracking-wider text-[#5f584f]">
                    Suite
                  </label>
                  <select
                    id="vs-suite"
                    value={selectedSuiteId}
                    onChange={(e) => setSelectedSuiteId(e.target.value)}
                    className="mt-2 h-11 w-full border-b border-[#1a1714]/40 bg-transparent text-sm text-[#1a1714]"
                  >
                    {SUITES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (€{s.rateEur})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="vs-nights" className="block font-mono text-[11px] uppercase tracking-wider text-[#5f584f]">
                    Nights
                  </label>
                  <select
                    id="vs-nights"
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="mt-2 h-11 w-full border-b border-[#1a1714]/40 bg-transparent text-sm text-[#1a1714]"
                  >
                    {[2, 3, 4, 5, 7].map((n) => (
                      <option key={n} value={n}>
                        {n} nights
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="vs-guests" className="block font-mono text-[11px] uppercase tracking-wider text-[#5f584f]">
                    Guests
                  </label>
                  <select
                    id="vs-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-2 h-11 w-full border-b border-[#1a1714]/40 bg-transparent text-sm text-[#1a1714]"
                  >
                    {[1, 2, 3, 4].map((g) => (
                      <option key={g} value={g}>
                        {g} {g === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="vs-name" className="block font-mono text-[11px] uppercase tracking-wider text-[#5f584f]">
                    Full Name
                  </label>
                  <input
                    id="vs-name"
                    type="text"
                    autoComplete="name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Elena Moretti"
                    className="mt-2 h-11 w-full border-b border-[#1a1714]/40 bg-transparent text-sm text-[#1a1714] placeholder:text-[#8c8478]"
                  />
                </div>

                <div>
                  <label htmlFor="vs-email" className="block font-mono text-[11px] uppercase tracking-wider text-[#5f584f]">
                    Email Address
                  </label>
                  <input
                    id="vs-email"
                    type="email"
                    autoComplete="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="elena@atelier.it"
                    className="mt-2 h-11 w-full border-b border-[#1a1714]/40 bg-transparent text-sm text-[#1a1714] placeholder:text-[#8c8478]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="vs-note" className="block font-mono text-[11px] uppercase tracking-wider text-[#5f584f]">
                  Arrival notes (optional)
                </label>
                <input
                  id="vs-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Private boat transfer, dietary preferences, late arrival…"
                  className="mt-2 h-11 w-full border-b border-[#1a1714]/40 bg-transparent text-sm text-[#1a1714] placeholder:text-[#8c8478]"
                />
              </div>

              {formError && (
                <p
                  role="alert"
                  className="border-l-2 border-red-700 bg-red-950/5 px-4 py-3 text-xs font-medium text-red-900"
                >
                  {formError}
                </p>
              )}

              {submitted && (
                <p
                  role="status"
                  className="flex items-start gap-2.5 border-l-2 border-emerald-800 bg-emerald-950/5 px-4 py-3 text-xs font-medium text-emerald-950"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" aria-hidden="true" />
                  <span>
                    Inquiry validated for {activeSuite.name} ({nights} nights · €{estimatedTotal.toLocaleString('en-US')}). Demo stopping point reached — no live reservation or payment was submitted.
                  </span>
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1a1714] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#f6f2ea] cursor-pointer transition-colors hover:bg-[#8f5b3c]"
                >
                  Check Availability
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1a1714]/15 px-6 py-10 sm:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#5f584f]">
          <span>VILLA SOLARE · RAVELLO · DEMO 01 BUILT WITH PIXELCRAFT</span>
          <span>PHOTOGRAPHY: WIKIMEDIA COMMONS OPEN LICENSE · NO LIVE PAYMENTS</span>
        </div>
      </footer>
    </div>
  );
}
