#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'skills/pixelcraft-visual-qa/scripts/style-inventory.mjs');
const fixture = path.join(root, 'skills/pixelcraft-visual-qa/scripts/fixtures/style-inventory.html');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-style-inventory-'));

function browserUnavailable(output) {
  return /Executable doesn't exist|browser executable|playwright install chromium|chrome-headless-shell/i.test(output);
}

try {
  const out = path.join(tmp, 'inventory.json');
  const extraArgs = [];
  if (process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT) extraArgs.push('--project', process.env.PIXELCRAFT_TEST_PLAYWRIGHT_PROJECT);
  if (process.env.PIXELCRAFT_TEST_CHROMIUM) extraArgs.push('--executable-path', process.env.PIXELCRAFT_TEST_CHROMIUM);
  const result = spawnSync(process.execPath, [script, fixture, '--out', out, '--breakpoints=390x500,800x600', '--wait-ms=100', ...extraArgs], { encoding: 'utf8', cwd: root });
  const combined = `${result.stdout}\n${result.stderr}`;
  const skipped = (result.status === 2 && /Playwright is not installed/.test(combined)) || (result.status !== 0 && browserUnavailable(combined));
  if (skipped) console.log('ok 1 - Playwright unavailable; style inventory test skipped cleanly');
  else assert.equal(result.status, 0, combined);
  if (!skipped) {
    assert.ok(fs.existsSync(out), 'inventory JSON was not written');
    const report = JSON.parse(fs.readFileSync(out, 'utf8'));
    assert.equal(report.schemaVersion, 1);
    assert.equal(report.viewports.length, 2);
    const narrow = report.viewports[0];
    assert.equal(narrow.width, 390);
    const wide = report.viewports[1];
    assert.equal(narrow.fonts.count, 1, 'expected one preferred font family');
    assert.ok(narrow.type.ratio >= 2, `expected type contrast ratio, got ${narrow.type.ratio}`);
    assert.ok(narrow.color.distinct >= 3, 'expected multiple quantized palette entries');
    assert.equal(narrow.color.mode, 'light');
    assert.ok(wide.layout.maxContentWidth >= 600 && wide.layout.maxContentWidth <= 720, `unexpected desktop content measure ${wide.layout.maxContentWidth}`);
    assert.equal(typeof narrow.layout.whitespaceRatio, 'number');
    assert.equal(narrow.motion.reducedMotionCSS, true);
    assert.equal(narrow.accessibility.focusVisibleCSS, true);
    assert.equal(narrow.accessibility.landmarks.main, 1);
    assert.equal(narrow.accessibility.headingCount, 1);
    assert.equal(typeof narrow.network.requests, 'number');
    assert.equal(typeof narrow.network.transferBytes, 'number');
    assert.equal(typeof narrow.network.jsBytes, 'number');
    assert.ok(narrow.lcp === null || typeof narrow.lcp === 'number', `expected nullable numeric LCP, got ${narrow.lcp}`);
    assert.equal(typeof narrow.cls, 'number');
    assert.equal(narrow.cursor.hidden, true);
    assert.ok(narrow.cursor.values.includes('none'));
    assert.equal(typeof narrow.motion.libraries.gsap, 'boolean');
    assert.ok(narrow.fonts.entries.some((entry) => entry.weight === '800'), 'expected the display weight in the font inventory');
    assert.ok(Array.isArray(narrow.type.lineHeights));
    assert.equal(report.units.transfer, 'bytes');
    assert.equal(typeof narrow.network.initial.requests, 'number');
    assert.equal(typeof narrow.network.initial.transferBytes, 'number');
    assert.equal(typeof narrow.network.initial.jsBytes, 'number');
    assert.equal(typeof narrow.network.deferred.requests, 'number');
    assert.equal(typeof narrow.network.deferred.transferBytes, 'number');
    assert.equal(typeof narrow.network.deferred.jsBytes, 'number');
    assert.ok(narrow.network.initial.jsBytes > 0, 'expected the initial fixture script in jsBytes');
    assert.ok(narrow.network.deferred.jsBytes > 0, 'expected the deferred fixture script in jsBytes');
    assert.ok(narrow.network.resourceTypes && typeof narrow.network.resourceTypes === 'object', 'expected resource-type accounting');
    assert.ok(narrow.network.resourceTypes.script.requests >= 2, 'expected script resource-type accounting');
    assert.match(report.measurement.payloadPhase, /before the document load event/);
    assert.match(narrow.color.dominant, /^#[0-9a-f]{6}$/);
    console.log('ok 1 - local fixture produces style inventory JSON');
    console.log('style inventory tests passed');
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
