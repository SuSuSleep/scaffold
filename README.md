# Scaffold

Scaffold is a portable, knowledge-first software development harness. Its artifact-resolution semantics and agent bootstrap contract are shared Harness contracts. It supplies a default Knowledge Model, which a project may replace in full along with the Markdown Knowledge Schema, Workflows, Skills, and Templates. Project Rules are an extensible collection: local Rules add new identities and atomically replace shared Rules with the same stable identity.

Workflows own the sequence of work through ordered Phases. Each Phase states its goal and required outcome; Skills are reusable, optional method guidance suggested by a Phase. Project Rules may require a particular method, such as TDD, without changing the Workflow. In short: workflow owns sequencing, phase owns intent, outcome owns completion, and skill owns method.

## Requirements

Node.js 20 or later.

## Install and use

```bash
npm install --global @sususleep/scaffold
scaffold init /path/to/project
scaffold status /path/to/project
scaffold update /path/to/project
scaffold id next PROB /path/to/project
scaffold id check PROB-007 /path/to/project
```

`init` creates `.scaffold/metadata.md` and Harness extension directories for workflows, skills, rules, and templates. Local templates are organized by the default knowledge spaces under `.scaffold/templates/problem/`, `.scaffold/templates/solution/`, and `.scaffold/templates/governance/`; a project with another model may use its own template paths. Local Rules are organized under `.scaffold/rules/` with default categories such as `coding/`, `verification/`, and `documentation/`. It does not impose a `knowledge/` layout: the active Knowledge Model, Knowledge Schema, and `initialize-project` Workflow establish project knowledge semantics and representation. Shared operational defaults stay in the installed Scaffold package; they are not copied into the project. A project can fully replace the default Model with `.scaffold/knowledge-model.md`, its Schema with `.scaffold/knowledge-schema.md`, workflows with `.scaffold/workflows/<name>.md`, skills with `.scaffold/skills/<name>/SKILL.md`, and templates with `.scaffold/templates/<knowledge-space>/<name>.md`.

Every independently resolvable Rule is a Markdown file whose H1 is its stable dotted identity, for example `# verification.risk-proportionate`. Rules state `Applies When` and `Guidance`. The effective collection is shared Rules plus local Rules: a local-only identity is an addition, while a local Rule with the same identity replaces that shared Rule in full. Scaffold never merges Rule content. `status` reports these dispositions mechanically; `analyze-rule-conflicts` provides agent-driven semantic review, and `evolve-project-rules` owns the normal lifecycle for local Rule changes.

Use `evolve-project-artifact` when deliberately adding or replacing a local Knowledge Schema, Workflow, Skill, or Template. It reviews dependency and shadow impact while preserving full-replacement semantics; Rule changes remain in `evolve-project-rules`.

For a Project Knowledge change, use `define-change` followed by `reconcile-project-change`. Reconciliation records a Git baseline for accepted knowledge, then uses a fresh writer subagent to run `update-knowledge` and a distinct fresh reviewer subagent to run read-only `review-change` against the current candidate diff. Findings repeat the loop. A clean review completes reconciliation; any required project-owner review then accepts the candidate. Only accepted, implementation-affecting knowledge proceeds to `implement-change`. Reconstruction and finding-learning work feed this same reconciliation path when they change normal Project Knowledge.

For agent discovery, `init` creates a Scaffold-owned `.scaffold/agent-guide.md` bootstrap that resolves the current package guidance rather than copying it. It creates root `AGENTS.md` and `CLAUDE.md` only when absent. Existing host-owned instruction files are preserved; an interactive terminal may add or preview a managed Scaffold block, while non-interactive runs report incomplete integration. Existing managed blocks may be updated without changing surrounding content.

`status` reports resolved artifact sources, effective Project Rules, and shadowed shared artifacts. Existing `.scaffold/project-rules.md` files are explicitly reported as legacy and ignored; migrate them deliberately with the migration and rule-evolution guidance rather than expecting implicit interpretation. After `adopt-harness-update` has completed its conflict, drift, migration, and consistency review, `update` records the currently running Scaffold version as reviewed. It never overwrites project-local replacements or Rules.

`scaffold id next <PREFIX>` returns the next unused document ID in a namespace such as `PROB`, `SOL`, or `GOV`; `scaffold id check <PREFIX-NUMBER>` reports whether a document ID is available. These commands search Markdown document declarations recursively without interpreting the Knowledge Model or assuming a project’s knowledge directory layout. Resolve the active Knowledge Schema first to choose the correct prefix.

When a new Scaffold version cannot be adopted through ordinary replacement, use the shared `workflows/migrate-project.md` guidance. Migration remains an explicit, project-owned activity; Scaffold does not perform automatic semantic migrations.

## Development

```bash
npm test
```
