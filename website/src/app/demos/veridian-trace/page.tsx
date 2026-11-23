'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
} from 'lucide-react';

type ViewState = 'live' | 'loading' | 'empty' | 'stale' | 'error';

interface TraceRow {
  id: string;
  service: string;
  operation: string;
  status: 'ok' | 'slow' | 'error';
  durationMs: number;
  spans: number;
  region: string;
  timestamp: string;
  waterfall: { name: string; offsetPct: number; widthPct: number; ms: number; kind: 'ok' | 'warn' | 'err' }[];
}

const TRACES: TraceRow[] = [
  {
    id: 'tr_9a41f0',
    service: 'checkout-api',
    operation: 'POST /v2/orders/authorize',
    status: 'error',
    durationMs: 842,
    spans: 14,
    region: 'us-east-1',
    timestamp: '14:22:09 UTC',
    waterfall: [
      { name: 'edge.gateway', offsetPct: 0, widthPct: 12, ms: 34, kind: 'ok' },
      { name: 'auth.verify_jwt', offsetPct: 10, widthPct: 14, ms: 48, kind: 'ok' },
      { name: 'postgres.lock_inventory', offsetPct: 24, widthPct: 28, ms: 210, kind: 'warn' },
      { name: 'psp.charge_capture (timeout)', offsetPct: 52, widthPct: 48, ms: 550, kind: 'err' },
    ],
  },
  {
    id: 'tr_8c12b7',
    service: 'ledger-worker',
    operation: 'JOB reconcile_settlements',
    status: 'slow',
    durationMs: 318,
    spans: 9,
    region: 'eu-central-1',
    timestamp: '14:21:54 UTC',
    waterfall: [
      { name: 'queue.dequeue', offsetPct: 0, widthPct: 10, ms: 18, kind: 'ok' },
      { name: 'postgres.batch_read', offsetPct: 10, widthPct: 58, ms: 212, kind: 'warn' },
      { name: 'ledger.emit_event', offsetPct: 68, widthPct: 32, ms: 88, kind: 'ok' },
    ],
  },
  {
    id: 'tr_7e90d3',
    service: 'catalog-edge',
    operation: 'GET /v2/skus/search',
    status: 'ok',
    durationMs: 42,
    spans: 5,
    region: 'ap-southeast-1',
    timestamp: '14:21:41 UTC',
    waterfall: [
      { name: 'cdn.cache_lookup', offsetPct: 0, widthPct: 22, ms: 8, kind: 'ok' },
      { name: 'meilisearch.query', offsetPct: 22, widthPct: 56, ms: 24, kind: 'ok' },
      { name: 'serialize.json', offsetPct: 78, widthPct: 22, ms: 10, kind: 'ok' },
    ],
  },
  {
    id: 'tr_6f01a8',
    service: 'webhook-relay',
    operation: 'POST /hooks/delivery',
    status: 'ok',
    durationMs: 96,
    spans: 6,
    region: 'us-west-2',
    timestamp: '14:21:18 UTC',
    waterfall: [
      { name: 'hmac.sign_payload', offsetPct: 0, widthPct: 18, ms: 14, kind: 'ok' },
      { name: 'http.post_endpoint', offsetPct: 18, widthPct: 82, ms: 82, kind: 'ok' },
    ],
  },
];

export default function VeridianTraceDemo() {
  const [viewState, setViewState] = useState<ViewState>('live');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(TRACES[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TRACES;
    return TRACES.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.service.toLowerCase().includes(q) ||
        t.operation.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q)
    );
  }, [query]);

  const activeTrace = filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? TRACES[0];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0c10]/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1 font-mono text-[11px] text-zinc-300 no-underline hover:border-emerald-400 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Gallery
            </Link>
            <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-white">
              <Activity className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              VERIDIAN TRACE
            </span>
            <span className="hidden rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline">
              prod-cluster · sample telemetry
            </span>
          </div>

          {/* Explicit UX State Matrix Switcher */}
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="UX state matrix preview">
            <span className="mr-1 font-mono text-[10px] uppercase text-zinc-500">State:</span>
            {(['live', 'loading', 'empty', 'stale', 'error'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setViewState(st)}
                aria-pressed={viewState === st}
                className={`rounded border px-2.5 py-1 font-mono text-[11px] capitalize cursor-pointer transition-colors ${
                  viewState === st
                    ? 'border-emerald-400 bg-emerald-400 font-semibold text-black'
                    : 'border-white/10 bg-[#11151c] text-zinc-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8">
        {/* Top Decision Strip (Operational metrics with baseline) */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Service health summary">
          {[
            ['ERROR RATE (15M)', '1.42%', '+0.8% vs 1h baseline', 'text-rose-400'],
            ['P95 DURATION', '318 ms', 'SLO budget ≤ 350 ms', 'text-amber-300'],
            ['THROUGHPUT', '4,290 req/s', '4 regions reporting', 'text-emerald-400'],
            ['ACTIVE INCIDENTS', '1 open', 'psp.charge_capture', 'text-white'],
          ].map(([label, value, sub, color]) => (
            <div key={label} className="rounded-md border border-white/10 bg-[#11151c] p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">{label}</p>
              <p className={`mt-1 font-mono text-2xl font-bold tabular-nums ${color}`}>{value}</p>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">{sub}</p>
            </div>
          ))}
        </section>

        {/* Stale Banner */}
        {viewState === 'stale' && (
          <div
            role="status"
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-400/40 bg-amber-500/10 px-4 py-3 font-mono text-xs text-amber-200"
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-300" aria-hidden="true" />
              Stream paused — displaying cached traces from 14:22:09 UTC (6m stale). Filters preserved.
            </span>
            <button
              type="button"
              onClick={() => setViewState('live')}
              className="inline-flex items-center gap-1.5 rounded border border-amber-300/50 px-2.5 py-1 text-amber-200 cursor-pointer hover:bg-amber-400/20"
            >
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Reconnect stream
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <label htmlFor="trace-search" className="sr-only">
              Filter traces
            </label>
            <input
              id="trace-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by trace ID, service, or region..."
              className="h-9 w-full rounded-md border border-white/15 bg-[#11151c] pl-8 pr-3 font-mono text-xs text-white placeholder:text-zinc-500"
            />
          </div>
          <span className="font-mono text-xs text-zinc-400">
            Showing {viewState === 'empty' ? 0 : filtered.length} of {TRACES.length} sampled traces
          </span>
        </div>

        {/* Main Workspace Split */}
        {viewState === 'error' ? (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Trace collector unreachable (503 Service Unavailable)
                </h2>
                <p className="mt-1 text-sm text-zinc-300">
                  Upstream collector <code className="font-mono">otel-us-east-1</code> timed out after 5,000 ms. Your search filter ({query || 'none'}) was preserved.
                </p>
                <button
                  type="button"
                  onClick={() => setViewState('live')}
                  className="mt-4 inline-flex items-center gap-2 rounded bg-rose-500 px-4 py-2 font-mono text-xs font-semibold text-white cursor-pointer hover:bg-rose-400"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Retry query
                </button>
              </div>
            </div>
          </div>
        ) : viewState === 'empty' ? (
          <div className="mt-4 rounded-lg border border-white/10 bg-[#11151c] p-10 text-center">
            <p className="font-display text-lg font-bold text-white">No traces matched this window</p>
            <p className="mt-2 text-sm text-zinc-400">
              No spans were ingested for the selected service and 15-minute window. Verify your OpenTelemetry exporter endpoint or widen the range.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setViewState('live');
              }}
              className="mt-4 rounded border border-emerald-400/50 bg-emerald-400/10 px-4 py-2 font-mono text-xs text-emerald-300 cursor-pointer hover:bg-emerald-400/20"
            >
              Restore sample stream
            </button>
          </div>
        ) : viewState === 'loading' ? (
          <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-[#11151c] p-4" aria-busy="true">
            <p className="font-mono text-xs text-zinc-400">Querying distributed span store…</p>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-11 rounded bg-white/[0.05]" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Dense Tabular Trace Table */}
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#11151c] lg:col-span-7">
              <table className="w-full border-collapse text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-zinc-400">
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Service &amp; Operation</th>
                    <th className="px-3 py-2.5 text-right">Duration</th>
                    <th className="px-3 py-2.5 text-right">Region</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map((row) => {
                    const selected = row.id === activeTrace.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        className={`cursor-pointer transition-colors ${
                          selected ? 'bg-emerald-400/10' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="px-3 py-3">
                          {row.status === 'error' ? (
                            <span className="inline-flex items-center gap-1 text-rose-400">
                              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              ERR
                            </span>
                          ) : row.status === 'slow' ? (
                            <span className="inline-flex items-center gap-1 text-amber-300">
                              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                              SLOW
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedId(row.id)}
                            className="text-left font-semibold text-white cursor-pointer"
                          >
                            {row.service}
                          </button>
                          <div className="text-[11px] text-zinc-400">{row.operation}</div>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-zinc-200">
                          {row.durationMs} ms
                        </td>
                        <td className="px-3 py-3 text-right text-zinc-400">{row.region}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Span Waterfall Inspector */}
            <aside
              aria-label="Selected trace waterfall"
              className="rounded-lg border border-white/10 bg-[#11151c] p-5 lg:col-span-5"
            >
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <p className="font-mono text-[11px] text-emerald-400">{activeTrace.id}</p>
                  <h2 className="mt-0.5 font-mono text-sm font-bold text-white">
                    {activeTrace.operation}
                  </h2>
                </div>
                <span className="font-mono text-xs tabular-nums text-zinc-300">
                  {activeTrace.durationMs} ms · {activeTrace.spans} spans
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {activeTrace.waterfall.map((sp) => (
                  <div key={sp.name}>
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-zinc-300">{sp.name}</span>
                      <span className="tabular-nums text-zinc-400">{sp.ms} ms</span>
                    </div>
                    <div className="relative mt-1.5 h-2 w-full rounded-sm bg-white/[0.07]">
                      <div
                        className={`absolute top-0 h-full rounded-sm ${
                          sp.kind === 'err'
                            ? 'bg-rose-400'
                            : sp.kind === 'warn'
                            ? 'bg-amber-300'
                            : 'bg-emerald-400'
                        }`}
                        style={{ left: `${sp.offsetPct}%`, width: `${sp.widthPct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 border-t border-white/10 pt-3 font-mono text-[11px] text-zinc-500">
                Captured {activeTrace.timestamp} · Region {activeTrace.region} · Pixelcraft Demo 02
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
