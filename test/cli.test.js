'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const packageInfo = require('../package.json');

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
  assert.ok(fs.readFileSync(path.join(directory, '.scaffold/metadata.md'), 'utf8').includes(`Scaffold Version: ${packageInfo.version}`));
  assert.equal(fs.existsSync(path.join(directory, 'knowledge/problem')), false);
  assert.equal(fs.existsSync(path.join(directory, '.scaffold/knowledge-schema.md')), false);
  assert.ok(fs.existsSync(path.join(directory, '.scaffold/templates/problem')));
  assert.ok(fs.existsSync(path.join(directory, '.scaffold/templates/solution')));
  assert.ok(fs.existsSync(path.join(directory, '.scaffold/templates/governance')));
  assert.ok(fs.existsSync(path.join(directory, '.scaffold/rules/core')));
  assert.ok(fs.existsSync(path.join(directory, '.scaffold/rules/verification')));
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

test('status resolves local Project Rule additions and atomic replacements', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  const rules = path.join(directory, '.scaffold/rules');
  fs.writeFileSync(path.join(rules, 'verification/risk.md'), '# verification.risk-proportionate\n');
  fs.writeFileSync(path.join(rules, 'coding/formatting.md'), '# coding.formatting\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Rule: verification\.risk-proportionate\n    source: project\n    disposition: local replacement/);
  assert.match(result.stdout, /Rule: coding\.formatting\n    source: project\n    disposition: local addition/);
  assert.match(result.stdout, /Project-local Rules: [\s\S]*rules[\\/]coding[\\/]formatting\.md/);
  assert.doesNotMatch(result.stdout, /defaults[\\/]project-rules\.md/);
});

test('status reports legacy monolithic Project Rules as ignored', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  fs.writeFileSync(path.join(directory, '.scaffold/project-rules.md'), '# Local Rules\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Legacy monolithic Project Rules require deliberate migration and are ignored/);
});

test('status reports invalid and duplicate Project Rule identities', () => {
  const directory = temporaryDirectory();
  run('init', directory);
  const rules = path.join(directory, '.scaffold/rules');
  fs.writeFileSync(path.join(rules, 'coding/a.md'), '# coding.formatting\n');
  fs.writeFileSync(path.join(rules, 'coding/b.md'), '# coding.formatting\n');
  fs.writeFileSync(path.join(rules, 'documentation/invalid.md'), '# Not A Rule\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Duplicate project Project Rule identity coding\.formatting/);
  assert.match(result.stdout, /Invalid Project Rule identity/);
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
  fs.writeFileSync(path.join(templates, 'solution/standard.md'), '# Local Solution\n');
  fs.writeFileSync(path.join(templates, 'governance/api-contract.md'), '# API Contract\n');
  const result = run('status', directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Template: problem\/standard\n  source: shared/);
  assert.match(result.stdout, /Template: solution\/standard\n  source: project/);
  assert.match(result.stdout, /Template: governance\/api-contract\n  source: project/);
  assert.match(result.stdout, /Shadowed shared artifacts:[\s\S]*defaults[\\/]templates[\\/]solution[\\/]standard\.md/);
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

test('document ID commands allocate and inspect IDs without requiring a fixed knowledge layout', () => {
  const directory = temporaryDirectory();
  const customKnowledge = path.join(directory, 'docs', 'domain');
  fs.mkdirSync(customKnowledge, { recursive: true });
  fs.writeFileSync(path.join(customKnowledge, 'first.md'), '# First\n\nDocument ID: PROB-001\n');
  fs.writeFileSync(path.join(customKnowledge, 'third.md'), '# Third\n\nDocument ID: PROB-003\n');
  fs.writeFileSync(path.join(customKnowledge, 'solution.md'), '# Solution\n\nDocument ID: SOL-001\n');

  const nextProblem = run('id', 'next', 'PROB', directory);
  assert.equal(nextProblem.status, 0, nextProblem.stderr);
  assert.equal(nextProblem.stdout.trim(), 'PROB-002');
  const nextGovernance = run('id', 'next', 'GOV', directory);
  assert.equal(nextGovernance.status, 0, nextGovernance.stderr);
  assert.equal(nextGovernance.stdout.trim(), 'GOV-001');
  const used = run('id', 'check', 'PROB-001', directory);
  assert.equal(used.status, 1);
  assert.match(used.stdout, /already used:[\s\S]*docs[\\/]domain[\\/]first\.md/);
  const available = run('id', 'check', 'PROB-002', directory);
  assert.equal(available.status, 0, available.stderr);
  assert.equal(available.stdout.trim(), 'available');
});

test('document ID inspection reports duplicate declarations', () => {
  const directory = temporaryDirectory();
  fs.writeFileSync(path.join(directory, 'one.md'), 'Document ID: GOV-001\n');
  fs.writeFileSync(path.join(directory, 'two.md'), 'Document ID: GOV-001\n');
  const result = run('id', 'check', 'GOV-001', directory);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /one\.md/);
  assert.match(result.stdout, /two\.md/);
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
    'evolve-project-artifact.md',
    'evolve-project-rules.md',
    'implement-change.md',
    'initialize-project.md',
    'learn-from-finding.md',
    'migrate-project.md',
    'reconcile-project-change.md',
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
  assert.match(workflow('update-knowledge.md'), /- A sufficiently understood Project Knowledge delta is being reconciled\./);
  assert.match(workflow('define-change.md'), /sufficiently defined proposed knowledge change/);
  assert.match(workflow('adopt-harness-update.md'), /Mark Update Review Complete/);
});

test('Project Knowledge reconciliation separates writer, reviewer, and owner acceptance', () => {
  const reconciliation = fs.readFileSync(path.resolve(__dirname, '../workflows/reconcile-project-change.md'), 'utf8');
  const workflow = fs.readFileSync(path.resolve(__dirname, '../workflows/review-change.md'), 'utf8');
  assert.match(reconciliation, /Git baseline/);
  assert.match(reconciliation, /fresh writer subagent/);
  assert.match(reconciliation, /distinct fresh reviewer subagent/);
  assert.match(reconciliation, /AWAITING_OWNER_REVIEW/);
  assert.match(reconciliation, /REVIEW_UNAVAILABLE/);
  assert.match(workflow, /read-only/);
  assert.match(workflow, /ACCEPTABLE/);
  assert.match(workflow, /NOT ACCEPTABLE/);
  assert.match(workflow, /does not modify Project Knowledge/);
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
  assert.match(workflow, /Inferred or Unknown/);
  assert.match(workflow, /not materially relied upon without review or clarification/);
  assert.match(workflow, /not converted directly into durable obligations or other intended knowledge/);
  assert.match(workflow, /reconcile-project-change/);
});

test('agent guidance routes brownfield reconstruction requests to the reconstruction workflow', () => {
  const guide = fs.readFileSync(path.resolve(__dirname, '../defaults/agent-guide.md'), 'utf8');
  assert.match(guide, /Reconstruct documentation or recover durable knowledge from an existing repository area \| `reconstruct-project-knowledge`/);
  assert.match(guide, /reconstruct project documentation/);
  assert.match(guide, /exceptional `Inferred` and `Unknown` states/);
  assert.match(guide, /reconcile-project-change/);
});

test('default templates conform exactly to the default Knowledge Schema structure', () => {
  const schema = fs.readFileSync(path.resolve(__dirname, '../defaults/knowledge-schema.md'), 'utf8');
  assert.match(schema, /required structural section.*may remain empty/s);
  assert.match(schema, /project-local Schema replaces this default representation contract in full/);
  const expectedSections = {
    problem: ['Intent', 'Actors and Goals', 'Use Cases', 'Requirements', 'Acceptance Criteria', 'Related Knowledge'],
    solution: ['Capabilities', 'Responsibilities', 'Components and Boundaries', 'Satisfies', 'Design and Decisions', 'Verification Items', 'Related Knowledge'],
    governance: ['Purpose', 'Applies When', 'Does Not Normally Apply When', 'Records', 'Verification', 'Related Knowledge'],
  };
  for (const [type, sections] of Object.entries(expectedSections)) {
    const template = fs.readFileSync(path.resolve(__dirname, `../defaults/templates/${type}/standard.md`), 'utf8');
    const headings = [...template.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
    assert.deepEqual(headings, sections, `${type} template sections`);
    for (const section of sections) assert.match(schema, new RegExp(`\\| ${section} \\|`), `${type} Schema maps ${section}`);
  }
});

test('default guidance supports selective Governance and Project Rule consumption', () => {
  const schema = fs.readFileSync(path.resolve(__dirname, '../defaults/knowledge-schema.md'), 'utf8');
  const workflow = (name) => fs.readFileSync(path.resolve(__dirname, '../workflows', name), 'utf8');
  const contextSkill = fs.readFileSync(path.resolve(__dirname, '../skills/collect-context/SKILL.md'), 'utf8');
  const rules = path.resolve(__dirname, '../defaults/rules');

  assert.match(schema, /## Selective Governance Consumption/);
  assert.match(schema, /must not hard-code project-specific Governance file paths/);
  for (const name of ['initialize-project.md', 'implement-change.md', 'update-knowledge.md', 'reconstruct-project-knowledge.md']) {
    assert.match(workflow(name), /^#### Relevant Rules$/m, name);
  }
  assert.match(contextSkill, /Do not load all project knowledge by default/);
  assert.doesNotMatch(contextSkill, /knowledge\/governance\//);
  assert.ok(fs.existsSync(path.join(rules, 'core/knowledge-discipline.md')));
  assert.ok(fs.existsSync(path.join(rules, 'verification/risk-proportionate.md')));
  assert.equal(fs.existsSync(path.resolve(__dirname, '../defaults/project-rules.md')), false);
});

test('default knowledge representation demonstrates local IDs and qualified references', () => {
  const schema = fs.readFileSync(path.resolve(__dirname, '../defaults/knowledge-schema.md'), 'utf8');
  const guide = fs.readFileSync(path.resolve(__dirname, '../defaults/agent-guide.md'), 'utf8');
  const problem = fs.readFileSync(path.resolve(__dirname, '../defaults/templates/problem/standard.md'), 'utf8');
  const solution = fs.readFileSync(path.resolve(__dirname, '../defaults/templates/solution/standard.md'), 'utf8');
  const governance = fs.readFileSync(path.resolve(__dirname, '../defaults/templates/governance/standard.md'), 'utf8');

  assert.match(schema, /## Identifiers and References/);
  assert.match(schema, /<TYPE>-<LOCAL_NUMBER> — <DESCRIPTIVE_TITLE>/);
  assert.match(schema, /<DOCUMENT_ID>#<OBJECT_ID>/);
  assert.match(schema, /Identifier = stable identity/);
  assert.match(schema, /Title      = mutable semantic context/);
  assert.match(schema, /Document ID: PROB-001/);
  assert.match(schema, /PROB-001#REQ-001 — Preserve accepted queued work/);
  assert.match(schema, /Semantic validation remains agent-only/);
  assert.match(guide, /scaffold id next/);
  assert.match(guide, /qualified `<DOCUMENT_ID>#<OBJECT_ID>` references/);
  assert.match(problem, /Document ID: PROB-<ALLOCATED_ID>/);
  assert.match(problem, /REQ-001 — <Observable obligation>/);
  assert.match(problem, /AC-001 — <Observable acceptance condition>/);
  assert.match(solution, /Document ID: SOL-<ALLOCATED_ID>/);
  assert.match(solution, /PROB-<ID>#AC-001 — <Observable acceptance condition>/);
  assert.match(governance, /Document ID: GOV-<ALLOCATED_ID>/);
  assert.match(governance, /^## Records$/m);
  assert.doesNotMatch(governance, /CTRL-001/);
});

test('default guidance uses single-owner acceptance and bounded verification items', () => {
  const read = (relative) => fs.readFileSync(path.resolve(__dirname, '..', relative), 'utf8');
  const model = read('defaults/knowledge-model.md');
  const schema = read('defaults/knowledge-schema.md');
  const problemTemplate = read('defaults/templates/problem/standard.md');
  const solutionTemplate = read('defaults/templates/solution/standard.md');
  const rule = read('defaults/rules/verification/dependency-isolation.md');
  const product = read('knowledge/problem/scaffold-product.md');
  const solutionRecords = [
    'knowledge/solution/cli-and-guidance.md',
    'knowledge/solution/change-lifecycle-and-methods.md',
    'knowledge/solution/governance-context-resolution.md',
    'knowledge/solution/knowledge-architecture.md',
    'knowledge/solution/default-artifacts.md',
  ].map(read).join('\n');

  assert.match(model, /one primary parent Requirement/);
  assert.match(model, /one Acceptance Criterion/);
  assert.match(model, /Dependencies outside that boundary may be substituted/);
  assert.doesNotMatch(model, /may cover multiple Requirements/);
  assert.match(schema, /represented by `For`/);
  assert.doesNotMatch(schema, /may cover one or more Requirements/);
  assert.match(problemTemplate, /^For:$/m);
  assert.match(problemTemplate, /^Given:$/m);
  assert.match(problemTemplate, /^When:$/m);
  assert.match(problemTemplate, /^Then:$/m);
  assert.match(solutionTemplate, /PROB-001#AC-001/);
  assert.match(solutionTemplate, /^Scope:$/m);
  assert.match(solutionTemplate, /^Assumptions:$/m);
  assert.match(rule, /Do not substitute an interaction when that interaction itself is the verification target/);
  assert.doesNotMatch(product, /^Covers:$/m);
  assert.doesNotMatch(solutionRecords, /PROB-001#AC-00[1-6]/);

  for (const criterion of product.matchAll(/^### AC-[^\n]+\n\n([\s\S]*?)(?=^### AC-|^## Related Knowledge)/gm)) {
    assert.match(criterion[1], /^For:\n\n- REQ-\d+/m, criterion[0]);
    assert.match(criterion[1], /^Given:$/m, criterion[0]);
    assert.match(criterion[1], /^When:$/m, criterion[0]);
    assert.match(criterion[1], /^Then:$/m, criterion[0]);
  }
  for (const item of solutionRecords.matchAll(/^### VER-[^\n]+\n\n([\s\S]*?)(?=^### VER-|^## Related Knowledge)/gm)) {
    assert.match(item[1], /^Verifies:\n\n- PROB-\d+#AC-\d+/m, item[0]);
    assert.match(item[1], /^Scope:$/m, item[0]);
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
    "### Verification Item",
    "## Relationship Semantics",
    "## Semantic Invariants",
    "## Semantic Anti-Patterns",
  ]) assert.ok(model.includes(heading), heading);
  assert.match(model, /Finding must not automatically become a Control/);
  assert.match(model, /Governance may be project-wide in scope without being relevant to every activity/);
  assert.doesNotMatch(model, /### Engineering Strategy/);
  assert.match(model, /Relationships are many-to-many/);
  assert.match(model, /The active Knowledge Model defines semantic concepts and relationships/);
  assert.match(model, /\.scaffold\/knowledge-model\.md/);
});

test("status resolves a local Knowledge Model against its shared default", () => {
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
  assert.match(local.stdout, /Knowledge Model:\n  source: project/);
  assert.match(local.stdout, /Project-local replacements: knowledge-model\.md/);
  assert.match(local.stdout, /Shadowed shared artifacts:[\s\S]*defaults[\\/]knowledge-model\.md/);
  assert.ok(local.stdout.includes(localModel));
});
