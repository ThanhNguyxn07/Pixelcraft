#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validatorSource = path.join(root, 'scripts/validate-skills.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelcraft-validator-test-'));
const validator = path.join(tmp, 'scripts/validate-skills.mjs');
const skillDir = path.join(tmp, 'skills/case');
const skillFile = path.join(skillDir, 'SKILL.md');

fs.mkdirSync(path.dirname(validator), { recursive: true });
fs.mkdirSync(skillDir, { recursive: true });
fs.mkdirSync(path.join(tmp, 'evals'), { recursive: true });
fs.copyFileSync(validatorSource, validator);
fs.writeFileSync(path.join(tmp, 'evals/case.md'), '# Evaluation\n\n## Case\n\nPrompt.\n');

function runValidator(frontmatter) {
  fs.writeFileSync(skillFile, `---\n${frontmatter}\n---\n\n# Case\n`);
  return spawnSync(process.execPath, [validator], { encoding: 'utf8' });
}

try {
  for (const indicator of ['|', '|-', '|+', '>', '>-', '>+', '|2-']) {
    const result = runValidator(`name: case\ndescription: ${indicator}\n  Handles block: scalar content\n  across multiple lines.\nmetadata:\n  version: 0.1.0\nlicense: MIT`);
    assert.equal(result.status, 0, `${indicator} failed: ${result.stderr}`);
  }
  console.log('ok 1 - literal and folded block scalars pass');

  const flow = runValidator('name: case\ndescription: Handles inline flow metadata\nmetadata: {version: 0.1.0, owner: validator-test}\nlicense: MIT');
  assert.equal(flow.status, 0, flow.stderr);
  console.log('ok 2 - inline flow mappings pass');

  const comment = runValidator('name: case\ndescription: Handles YAML safely # trailing comment with: colon\nlicense: MIT');
  assert.equal(comment.status, 0, comment.stderr);
  const contraction = runValidator("name: case\ndescription: Don't break contractions # trailing comment with: colon\nlicense: MIT");
  assert.equal(contraction.status, 0, contraction.stderr);
  console.log('ok 3 - colon text inside trailing comments is ignored');

  const unsafeColon = runValidator('name: case\ndescription: Invalid: plain scalar\nlicense: MIT');
  assert.notEqual(unsafeColon.status, 0, 'unsafe plain scalar unexpectedly passed');
  assert.match(unsafeColon.stderr, /contains ': '/);

  const unsafeStart = runValidator('name: case\ndescription: @invalid\nlicense: MIT');
  assert.notEqual(unsafeStart.status, 0, 'reserved leading scalar unexpectedly passed');
  assert.match(unsafeStart.stderr, /starts with YAML-special character/);
  console.log('ok 4 - unsafe plain scalars still fail');

  console.log('validator YAML tests passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
