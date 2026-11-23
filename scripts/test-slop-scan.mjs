#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scanner = path.join(root, 'skills/pixelcraft-review/scripts/slop-scan.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-slop-scan-'));

function scan(filename, content) {
  const file = path.join(tmp, filename);
  fs.writeFileSync(file, content);
  const res = spawnSync(process.execPath, [scanner, file, '--json'], { encoding: 'utf8', cwd: root });
  assert.equal(res.status, 0, res.stderr);
  return JSON.parse(res.stdout);
}

try {
  const badTsx = scan('BadComponent.tsx', `
export function BadComponent() {
  return (
    <section className="backdrop-blur-md backdrop-blur-lg backdrop-blur-xl">
      <h1 className="font-serif bg-clip-text text-transparent">Supercharge your workflow effortlessly</h1>
      <p>Trusted by 10,000+ teams with 99.99% uptime.</p>
      <img src="https://placehold.co/600x400" />
      <div onClick={() => {}}>Click me</div>
      <a href="#">Learn more</a>
      <span className="animate-bounce">New</span>
      <p>TODO: finish section</p>
    </section>
  );
}
`);
  const badRules = new Set(badTsx.findings.map((f) => f.rule));
  for (const expected of [
    'clickable-non-semantic',
    'missing-img-alt',
    'dead-anchor-href',
    'placeholder-media',
    'unfinished-ui-stub',
    'gradient-text-cliche',
    'decorative-idle-loop',
    'glassmorphism-spam',
    'unloaded-generic-serif',
    'generic-copy',
  ]) {
    assert.ok(badRules.has(expected), `expected rule '${expected}', got: ${[...badRules].join(', ')}`);
  }
  console.log('ok 1 - expanded TSX anti-slop and lazy-agent detectors trigger');

  const badCss = scan('bad.css', `
.hero { height: 100vh; color: red !important; background: blue !important; padding: 8px !important; }
`);
  const cssRules = new Set(badCss.findings.map((f) => f.rule));
  assert.ok(cssRules.has('fixed-100vh-mobile-trap'), 'expected fixed-100vh-mobile-trap');
  assert.ok(cssRules.has('important-cascade-hack'), 'expected important-cascade-hack');
  console.log('ok 2 - CSS mobile viewport and !important hack detectors trigger');

  const cleanHtml = scan('clean.html', `<!doctype html>
<html lang="en"><head><style>
.stage { min-height: 100svh; }
:focus-visible { outline: 2px solid var(--accent); }
</style></head>
<body><main>
  <h1>Measured Architecture</h1>
  <img src="/villa.jpg" alt="Limestone terrace overlooking the sea" />
  <button type="button">Check availability</button>
  <a href="/docs">Read documentation</a>
</main></body></html>`);
  assert.equal(cleanHtml.score, 0, `expected clean HTML score 0, got ${JSON.stringify(cleanHtml.findings)}`);
  console.log('ok 3 - clean semantic markup scores 0');

  console.log('slop-scan tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
