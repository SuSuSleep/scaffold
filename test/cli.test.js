'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const cli = path.resolve(__dirname, '../bin/scaffold.js');

function temporaryDirectory() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-test-'));
}

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
}

test('init creates metadata and knowledge directories without copying defaults', () => {
  const directory = temporaryDirectory();
  const result = run('init', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /agent-discovery guide/);
  assert.match(fs.readFileSync(path.join(directory, '.scaffold/metadata.md'), 'utf8'), /Scaffold Version: 0.2.0/);
  assert.ok(fs.statSync(path.join(directory, 'knowledge/problem')).isDirectory());
  assert.equal(fs.existsSync(path.join(directory, '.scaffold/knowledge-schema.md')), false);
  assert.match(fs.readFileSync(path.join(directory, '.scaffold/agent-guide.md'), 'utf8'), /Choose Guidance by Request Type/);
  assert.match(fs.readFileSync(path.join(directory, 'AGENTS.md'), 'utf8'), /agent-guide/);
  assert.match(fs.readFileSync(path.join(directory, 'CLAUDE.md'), 'utf8'), /agent-guide/);
});

test('init preserves existing agent instructions and reports manual integration', () => {
  const directory = temporaryDirectory();
  fs.writeFileSync(path.join(directory, 'AGENTS.md'), '# Existing Instructions\n');
  const result = run('init', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(path.join(directory, 'AGENTS.md'), 'utf8'), '# Existing Instructions\n');
  assert.match(result.stdout, /Existing agent instructions preserved: AGENTS.md/);
  assert.ok(fs.existsSync(path.join(directory, 'CLAUDE.md')));
});

test('status reports a project-local replacement', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  fs.writeFileSync(path.join(directory, '.scaffold/project-rules.md'), '# Local Rules\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /project-rules.md/);
});

test('status reports a native project-local skill replacement', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  const localSkill = path.join(directory, '.scaffold/skills/verify-change');
  fs.mkdirSync(localSkill);
  fs.writeFileSync(path.join(localSkill, 'SKILL.md'), '# Local Verify Change\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /skills\/verify-change\/SKILL.md/);
});

test('update preserves project-local replacement content', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  const override = path.join(directory, '.scaffold/knowledge-schema.md');
  fs.writeFileSync(override, '# Local Schema\n');
  const result = run('update', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(override, 'utf8'), '# Local Schema\n');
  assert.match(fs.readFileSync(path.join(directory, '.scaffold/metadata.md'), 'utf8'), /Last Updated:/);
});

test('commands requiring initialization fail clearly', () => {
  const result = run('status', temporaryDirectory());
  assert.equal(result.status, 1);
  assert.match(result.stdout, /not initialized/);
});

test('the package provides an explicit migration workflow without a migrate command', () => {
  const workflow = path.resolve(__dirname, '../workflows/migrate-project.md');
  assert.match(fs.readFileSync(workflow, 'utf8'), /Safely adapt a project/);
  const result = run('migrate');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command/);
});


test('shared workflows own explicit phase sequencing independent of suggested skills', () => {
  const workflows = [
    'define-change.md',
    'implement-change.md',
    'initialize-project.md',
    'learn-from-finding.md',
    'migrate-project.md',
    'update-knowledge.md',
  ];

  for (const workflow of workflows) {
    const contents = fs.readFileSync(path.resolve(__dirname, '../workflows', workflow), 'utf8');
    assert.match(contents, /^## Phases$/m, workflow + ' should define phases');
    assert.match(contents, /^### Phase — .+$/m, workflow + ' should name each phase');
    assert.match(contents, /^#### Goal$/m, workflow + ' phases should state their goal');
    assert.match(contents, /^#### Required Outcome$/m, workflow + ' phases should state their outcome');
    assert.doesNotMatch(contents, /^## Suggested Skills$/m, workflow + ' must not use skills to define its process');
  }
});
