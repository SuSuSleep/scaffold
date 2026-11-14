'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const repository = path.resolve(__dirname, '..');

function filesUnder(directory, relative = '') {
  return fs.readdirSync(path.join(directory, relative), { withFileTypes: true }).flatMap((entry) => {
    const name = path.posix.join(relative, entry.name);
    return entry.isDirectory() ? filesUnder(directory, name) : [name];
  });
}

test('the manifest and lockfile agree without a packaged self-dependency', () => {
  const manifest = require('../package.json');
  const lock = require('../package-lock.json');
  assert.equal(lock.name, manifest.name);
  assert.equal(lock.version, manifest.version);
  assert.equal(lock.packages[''].version, manifest.version);
  assert.deepEqual(lock.packages[''].dependencies || {}, manifest.dependencies || {});
  assert.equal(manifest.dependencies?.[manifest.name], undefined);
  assert.equal(lock.packages[`node_modules/${manifest.name}`], undefined);
});

test('the actual package contains the current Harness and initializes independently', (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-package-test-'));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
    'pack', '--pack-destination', temporary, '--json', '--ignore-scripts', '--cache', temporary,
  ], { cwd: repository, encoding: 'utf8', env: { ...process.env, NO_UPDATE_NOTIFIER: '1' } });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  const [manifest] = JSON.parse(result.stdout);
  const packaged = manifest.files.map((file) => file.path);
  const expected = filesUnder(path.join(repository, '.scaffold'))
    .filter((name) => name !== 'metadata.md').map((name) => `.scaffold/${name}`).sort();
  assert.deepEqual(packaged.filter((name) => name.startsWith('.scaffold/')).sort(), expected);
  assert.equal(packaged.some((name) => /^(defaults|skills)\//.test(name)), false);
  assert.equal(fs.existsSync(path.join(repository, 'defaults')), false);
  assert.equal(fs.existsSync(path.join(repository, 'skills')), false);

  const archive = path.join(temporary, manifest.filename);
  const extracted = spawnSync('tar', ['-xzf', archive, '-C', temporary], { encoding: 'utf8' });
  assert.ifError(extracted.error);
  assert.equal(extracted.status, 0, extracted.stderr);
  const packageRoot = path.join(temporary, 'package');
  const packagedManifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  assert.equal(packagedManifest.dependencies?.[packagedManifest.name], undefined);
  assert.equal(fs.existsSync(path.join(packageRoot, 'node_modules')), false);
  const target = path.join(temporary, 'target');
  const cli = path.join(packageRoot, 'bin/scaffold.js');
  const run = (...args) => {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: temporary, encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  run('init', target);
  for (const file of expected) {
    const source = fs.readFileSync(path.join(repository, file));
    assert.deepEqual(fs.readFileSync(path.join(packageRoot, file)), source, `packaged ${file}`);
    assert.deepEqual(fs.readFileSync(path.join(target, file)), source, `initialized ${file}`);
  }
  assert.match(fs.readFileSync(path.join(target, '.scaffold/metadata.md'), 'utf8'),
    new RegExp(`Last Reviewed Scaffold Version: ${packagedManifest.version.replaceAll('.', '\\.')}`));
  for (const host of ['.agents', '.claude']) {
    assert.equal(fs.realpathSync(path.join(target, host, 'skills/define-change')),
      path.join(target, '.scaffold/skills/define-change'));
  }
  assert.match(run('status', target), /Harness Structure: complete/);
  assert.equal(run('update', '--diff', target).trim(), 'No Harness artifact differences.');
  const guide = path.join(target, '.scaffold/agent-guide.md');
  fs.appendFileSync(guide, '\nProject-owned change.\n');
  const before = fs.readFileSync(guide);
  assert.match(run('update', '--diff', target), /changed: agent-guide\.md/);
  assert.deepEqual(fs.readFileSync(guide), before);
});
