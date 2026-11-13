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

test('npm packages the complete active Harness without metadata or duplicate source roots', (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-package-test-'));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
    'pack', '--dry-run', '--json', '--ignore-scripts', '--cache', temporary,
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
});
