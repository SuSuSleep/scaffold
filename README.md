# Scaffold

Scaffold is a portable, knowledge-first software development harness. Its Knowledge Model, artifact-resolution semantics, and agent bootstrap contract are shared, non-replaceable Harness contracts. Projects may fully replace the Markdown Knowledge Schema, Workflows, Skills, and Templates. Project Rules are an extensible collection: local Rules add new identities and atomically replace shared Rules with the same stable identity.

Workflows own the sequence of work through ordered Phases. Each Phase states its goal and required outcome; Skills are reusable, optional method guidance suggested by a Phase. Project Rules may require a particular method, such as TDD, without changing the Workflow. In short: workflow owns sequencing, phase owns intent, outcome owns completion, and skill owns method.

## Requirements

Node.js 20 or later.

## Install and use

```bash
npm install --global @sususleep/scaffold
scaffold init /path/to/project
scaffold status /path/to/project
scaffold update /path/to/project
```

`init` creates `.scaffold/metadata.md` and Harness extension directories for workflows, skills, rules, and templates. Local templates are organized by knowledge space under `.scaffold/templates/problem/`, `.scaffold/templates/solution/`, and `.scaffold/templates/governance/`; local Rules are organized under `.scaffold/rules/` with default categories such as `coding/`, `verification/`, and `documentation/`. It does not impose a `knowledge/` layout: the active Knowledge Schema and `initialize-project` Workflow establish project knowledge representation. Shared operational defaults stay in the installed Scaffold package; they are not copied into the project. The Knowledge Model is always supplied by that package. A project can replace its Knowledge Schema with `.scaffold/knowledge-schema.md`; local workflows use `.scaffold/workflows/<name>.md`, skills use `.scaffold/skills/<name>/SKILL.md`, and templates use `.scaffold/templates/<knowledge-space>/<name>.md`.

Every independently resolvable Rule is a Markdown file whose H1 is its stable dotted identity, for example `# verification.risk-proportionate`. Rules state `Applies When` and `Guidance`. The effective collection is shared Rules plus local Rules: a local-only identity is an addition, while a local Rule with the same identity replaces that shared Rule in full. Scaffold never merges Rule content. `status` reports these dispositions mechanically; `analyze-rule-conflicts` provides agent-driven semantic review, and `evolve-project-rules` owns the normal lifecycle for local Rule changes.

For agent discovery, `init` creates a Scaffold-owned `.scaffold/agent-guide.md` bootstrap that resolves the current package guidance rather than copying it. It creates root `AGENTS.md` and `CLAUDE.md` only when absent. Existing host-owned instruction files are preserved; an interactive terminal may add or preview a managed Scaffold block, while non-interactive runs report incomplete integration. Existing managed blocks may be updated without changing surrounding content.

`status` reports resolved artifact sources, effective Project Rules, and shadowed shared artifacts. Existing `.scaffold/project-rules.md` files are explicitly reported as legacy and ignored; migrate them deliberately with the migration and rule-evolution guidance rather than expecting implicit interpretation. After `adopt-harness-update` has completed its conflict, drift, migration, and consistency review, `update` records the currently running Scaffold version as reviewed. It never overwrites project-local replacements or Rules.

When a new Scaffold version cannot be adopted through ordinary replacement, use the shared `workflows/migrate-project.md` guidance. Migration remains an explicit, project-owned activity; Scaffold does not perform automatic semantic migrations.

## Development

```bash
npm test
```
