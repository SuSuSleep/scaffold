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

test('init creates only Harness infrastructure without copying semantic defaults', () => {
  const directory = temporaryDirectory();
  const result = run('init', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /agent-discovery guide/);
  assert.match(fs.readFileSync(path.join(directory, '.scaffold/metadata.md'), 'utf8'), /Scaffold Version: 0.2.0/);
  assert.equal(fs.existsSync(path.join(directory, 'knowledge/problem')), false);
  assert.equal(fs.existsSync(path.join(directory, '.scaffold/knowledge-schema.md')), false);
  assert.match(fs.readFileSync(path.join(directory, '.scaffold/agent-guide.md'), 'utf8'), /currently installed Scaffold package/);
  assert.match(fs.readFileSync(path.join(directory, 'AGENTS.md'), 'utf8'), /agent-guide/);
  assert.match(fs.readFileSync(path.join(directory, 'CLAUDE.md'), 'utf8'), /agent-guide/);
});

test('agent entry guidance remains a package-resolved bootstrap after an upgrade', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  const guide = fs.readFileSync(path.join(directory, '.scaffold/agent-guide.md'), 'utf8');
  assert.doesNotMatch(guide, /Choose Guidance by Request Type/);
  assert.match(guide, /scaffold status/);
  assert.match(guide, /currently installed Scaffold package/);
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

test('init updates only an existing managed agent block and preserves surrounding host content', () => {
  const directory = temporaryDirectory();
  const hostFile = path.join(directory, 'AGENTS.md');
  fs.writeFileSync(hostFile, '# Host Rules\n\n<!-- scaffold:start -->old<!-- scaffold:end -->\n\nKeep this.\n');
  const result = run('init', directory);
  assert.equal(result.status, 0, result.stderr);
  const contents = fs.readFileSync(hostFile, 'utf8');
  assert.match(contents, /^# Host Rules/m);
  assert.match(contents, /Read `\.scaffold\/agent-guide\.md`/);
  assert.match(contents, /Keep this\./);
  assert.doesNotMatch(contents, /-->old<!--/);
});

test('status reports a project-local replacement', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  fs.writeFileSync(path.join(directory, '.scaffold/project-rules.md'), '# Local Rules\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /project-rules.md/);
  assert.match(result.stdout, /Shadowed shared artifacts:[\s\S]*defaults[\\/]project-rules\.md/);
});

test('status resolves a local Knowledge Schema against its shared default', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  fs.writeFileSync(path.join(directory, '.scaffold/knowledge-schema.md'), '# Local Schema\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Knowledge Schema:\n  source: project/);
  assert.match(result.stdout, /Shadowed shared artifacts:[\s\S]*defaults[\\/]knowledge-schema\.md/);
});

test('status detects local workflow and skill replacements as shadowing their shared artifacts', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  fs.writeFileSync(path.join(directory, '.scaffold/workflows/define-change.md'), '# Local workflow\n');
  const localSkill = path.join(directory, '.scaffold/skills/verify-change');
  fs.mkdirSync(localSkill);
  fs.writeFileSync(path.join(localSkill, 'SKILL.md'), '# Local skill\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Workflow: define-change\n  source: project/);
  assert.match(result.stdout, /Skill: verify-change\n  source: project/);
  assert.match(result.stdout, /Shadowed shared artifacts:[\s\S]*workflows[\\/]define-change\.md/);
  assert.match(result.stdout, /Shadowed shared artifacts:[\s\S]*skills[\\/]verify-change[\\/]SKILL\.md/);
});

test('status resolves local and shared templates without implicit merging', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  const templates = path.join(directory, '.scaffold/templates');
  fs.mkdirSync(templates, { recursive: true });
  fs.writeFileSync(path.join(templates, 'solution.md'), '# Local Solution\n');
  fs.writeFileSync(path.join(templates, 'api-contract.md'), '# API Contract\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Template: problem\n  source: shared/);
  assert.match(result.stdout, /Template: solution\n  source: project/);
  assert.match(result.stdout, /Template: api-contract\n  source: project/);
  assert.match(result.stdout, /Shadowed shared artifacts:[\s\S]*defaults[\\/]templates[\\/]solution\.md/);
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
  assert.match(result.stdout, /attestation/);
  assert.match(result.stdout, /semantic validation remains agent-driven/);
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
    'reconstruct-project-knowledge.md',
    'review-change.md',
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

test('shared workflows have entry conditions that do not pre-require their discovery work', () => {
  const workflow = (name) => fs.readFileSync(path.resolve(__dirname, '../workflows', name), 'utf8');
  assert.match(workflow('learn-from-finding.md'), /## Entry Conditions\n\n- A relevant finding or observed problem exists\./);
  assert.match(workflow('migrate-project.md'), /## Entry Conditions\n\n- A Scaffold update requires deliberate project migration\./);
  assert.match(workflow('update-knowledge.md'), /- A specific durable knowledge change is already sufficiently known\./);
  assert.match(workflow('define-change.md'), /sufficiently defined proposed knowledge change/);
  assert.match(workflow('adopt-harness-update.md'), /Mark Update Review Complete/);
});

test('review-change forms the acceptance gate before implementation', () => {
  const workflow = fs.readFileSync(path.resolve(__dirname, '../workflows/review-change.md'), 'utf8');
  for (const phase of [
    'Review Semantic Correctness',
    'Review Representation',
    'Review Relationships',
    'Review Project Constraints',
    'Establish Acceptance',
  ]) assert.match(workflow, new RegExp(`### Phase — ${phase}`));
  assert.match(workflow, /A proposed durable knowledge change has been defined\./);
  assert.match(workflow, /accepted for downstream work/);
});

test('reconstruction workflow preserves evidence confidence and uncertainty', () => {
  const workflow = fs.readFileSync(path.resolve(__dirname, '../workflows/reconstruct-project-knowledge.md'), 'utf8');
  for (const phase of [
    'Establish Repository Context',
    'Identify Knowledge Subjects',
    'Reconstruct Evidence-Based Knowledge',
    'Resolve Material Uncertainty',
    'Review Reconstructed Knowledge',
  ]) assert.match(workflow, new RegExp(`### Phase — ${phase}`));
  assert.match(workflow, /Known, Inferred, or Unknown/);
  assert.match(workflow, /not converted directly into Requirements/);
});

test('agent guidance routes brownfield reconstruction requests to the reconstruction workflow', () => {
  const guide = fs.readFileSync(path.resolve(__dirname, '../defaults/agent-guide.md'), 'utf8');
  assert.match(guide, /Reconstruct documentation or recover durable knowledge from an existing repository area \| `reconstruct-project-knowledge`/);
  assert.match(guide, /reconstruct project documentation/);
  assert.match(guide, /Known, Inferred, and Unknown/);
});

test('default templates conform exactly to the default Knowledge Schema structure', () => {
  const schema = fs.readFileSync(path.resolve(__dirname, '../defaults/knowledge-schema.md'), 'utf8');
  assert.match(schema, /required structural section.*may remain empty/s);
  assert.match(schema, /project-local Schema replaces this default representation contract in full/);
  const expectedSections = {
    problem: ['Intent', 'Actors and Goals', 'Use Cases', 'Requirements', 'Acceptance Criteria', 'Related Knowledge'],
    solution: ['Capabilities', 'Responsibilities', 'Components and Boundaries', 'Satisfies', 'Design and Decisions', 'Verification Strategy', 'Related Knowledge'],
    governance: ['Context', 'Obligation or Control', 'Applicability', 'Verification', 'Related Knowledge'],
  };
  for (const [type, sections] of Object.entries(expectedSections)) {
    const template = fs.readFileSync(path.resolve(__dirname, `../defaults/templates/${type}.md`), 'utf8');
    const headings = [...template.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
    assert.deepEqual(headings, sections, `${type} template sections`);
    for (const section of sections) assert.match(schema, new RegExp(`\\| ${section} \\|`), `${type} Schema maps ${section}`);
  }
});

test("the package ships a complete default Knowledge Model", () => {
  const model = fs.readFileSync(path.resolve(__dirname, "../defaults/knowledge-model.md"), "utf8");
  for (const heading of [
    "## Problem Space",
    "## Governance Space",
    "### Actor",
    "### Goal",
    "### Motivation",
    "### Use Case",
    "### Requirement",
    "### Acceptance Criteria",
    "### External Contract",
    "### Finding",
    "### Policy or Standard",
    "### Control",
    "### Constraint",
    "### Applicability",
    "## Solution Space",
    "### Capability",
    "### Responsibility",
    "### Component",
    "### Interface",
    "### Design",
    "### Decision",
    "### Verification",
    "## Relationship Semantics",
    "## Semantic Invariants",
    "## Semantic Anti-Patterns",
  ]) assert.ok(model.includes(heading), heading);
  assert.match(model, /Finding must not automatically become a Control/);
  assert.match(model, /Relationships are many-to-many/);
  assert.match(model, /The Knowledge Model defines semantic concepts and relationships only/);
  assert.doesNotMatch(model, /\.scaffold\/knowledge-model\.md/);
});

test("status always resolves the Knowledge Model from shared defaults", () => {
  const directory = temporaryDirectory();
  run("init", directory);

  const shared = run("status", directory);
  assert.equal(shared.status, 0, shared.stderr);
  assert.match(shared.stdout, /Knowledge Model:\n  source: shared/);
  assert.match(shared.stdout, /defaults[\/]knowledge-model\.md/);

  const localModel = path.join(directory, ".scaffold/knowledge-model.md");
  fs.writeFileSync(localModel, "# Local Knowledge Model\n");
  const local = run("status", directory);
  assert.equal(local.status, 0, local.stderr);
  assert.match(local.stdout, /Knowledge Model:\n  source: shared/);
  assert.match(local.stdout, /Unsupported project-local Knowledge Model ignored:/);
  assert.ok(local.stdout.includes(localModel));
});
