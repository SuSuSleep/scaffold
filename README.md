# Scaffold

Scaffold is a portable, knowledge-first software development harness. `init` materializes its complete active guidance in the project, including the Knowledge Model, Schema, Skills, Templates, Rules, and agent guide. The installed package is a starter and update-candidate bundle, never a runtime authority. The Schema defines representation only; Project Rules are a project-local collection with unique stable identities.

Workflows are the high-level interface: each is a user-invoked Skill that owns an ordered sequence of Phases, their goals, and their required outcomes. Model-invoked Skills are lower-level reusable methods that a workflow Skill uses as needed. The `agents/openai.yaml` interface makes a Skill user-invoked; its absence keeps a Skill model-invoked. Project Rules may require a particular method, such as TDD, without changing a workflow's outcome.

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

`init` creates `.scaffold/metadata.md` and materializes the complete Harness bundle. Templates are organized under `.scaffold/templates/`; Rules under `.scaffold/rules/`; and all active Skills under `.scaffold/skills/`. It does not impose a `knowledge/` layout: the active Knowledge Model, Knowledge Schema, and `initialize-project` workflow Skill establish project knowledge semantics and representation.

Every independently resolvable Rule is a Markdown file whose H1 is its stable dotted identity, for example `# verification.risk-proportionate`. Rules state `Applies When` and `Guidance`. The local collection must not contain duplicate identities. `status` reports it mechanically; `analyze-rule-conflicts` provides agent-driven semantic review, and `evolve-project-rules` owns its lifecycle.

Use `evolve-project-artifact` when deliberately adding or replacing a local Knowledge Schema, Skill, or Template. It reviews dependency and shadow impact while preserving full-replacement semantics; Rule changes remain in `evolve-project-rules`.

For a Project Knowledge change, use `define-change` followed by `reconcile-project-change`. Reconciliation records a Git baseline for accepted knowledge, then uses a fresh writer subagent to run `update-knowledge` and a distinct fresh reviewer subagent to run read-only `review-change` against the current candidate diff. Findings repeat the loop. A clean review completes reconciliation; any required project-owner review then accepts the candidate. Only accepted, implementation-affecting knowledge proceeds to `implement-change`. Reconstruction and finding-learning work feed this same reconciliation path when they change normal Project Knowledge.

For agent discovery, `init` creates a Scaffold-owned `.scaffold/agent-guide.md` bootstrap that resolves the current package guidance rather than copying it. It seeds the project-owned `.scaffold/skills/` directory when it is empty, then links only user-invoked workflow Skills into `.agents/skills/` for Codex CLI and `.claude/skills/` for Claude Code. `agents/openai.yaml` distinguishes those workflow Skills from internal model-invoked Skills; it is not itself an agent-discovery control. It creates root `AGENTS.md` and `CLAUDE.md` only when absent. Existing host-owned instruction files and agent-skill entries are preserved; an interactive terminal may add or preview a managed Scaffold block, while non-interactive runs report incomplete integration. Existing managed blocks may be updated without changing surrounding content.

`status` reports active project-local artifacts, Rules, and package-version drift. `scaffold update --diff` compares active artifacts with the installed candidate bundle and reports additions, changes, and package removals without editing files. After `adopt-harness-update` has discussed and applied owner-approved decisions, `update` records the installed Scaffold version as reviewed; it never copies, merges, or deletes Harness artifacts.

`scaffold id next <PREFIX>` returns the next unused document ID in a namespace such as `PROB`, `SOL`, or `GOV`; `scaffold id check <PREFIX-NUMBER>` reports whether a document ID is available. These commands search Markdown document declarations recursively without interpreting the Knowledge Model or assuming a project’s knowledge directory layout. Resolve the active Knowledge Schema first to choose the correct prefix.

When a new Scaffold version cannot be adopted through ordinary replacement, use the `migrate-project` workflow Skill. Migration remains an explicit, project-owned activity; Scaffold does not perform automatic semantic migrations.

## Development

```bash
npm test
```
