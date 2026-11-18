# Scaffold

Scaffold is a portable, knowledge-first software development harness. `init` materializes its complete active guidance in the project, including the Knowledge Model, Schema, Skills, Templates, Rules, and agent guide. The installed package is a starter and update-candidate bundle, never a runtime authority. The Schema defines representation only; Project Rules are a project-local collection with unique stable identities.

Workflows are the high-level interface: each is a user-invoked Skill that owns an ordered sequence of Phases, their goals, and their required outcomes. Model-invoked Skills are lower-level reusable methods that a workflow Skill uses as needed. The `agents/openai.yaml` interface makes a Skill user-invoked; its absence keeps a Skill model-invoked. Project Rules may require a particular method, such as TDD, without changing a workflow's outcome.

The default Harness can describe hybrid solutions without supplying a new AI runtime. Existing general-purpose agent hosts execute adaptive behavior under Skill guidance; deterministic tools or bridges provide exact operations; and bounded integration components install Skills, expose tools, or update host configuration. Hybrid Solution knowledge records the responsibility allocation, interfaces, dependencies, rationale, relevant authority and failure boundaries, and verification of both components and real agent-tool interactions. This guidance is vendor-neutral and does not require a machine-readable tool manifest.

## Requirements

Node.js 20 or later.

## Install and use

```bash
npm install --global @sususleep/scaffold
scaffold init /path/to/project
scaffold status /path/to/project
scaffold update /path/to/project
```

`init` creates `.scaffold/metadata.md` and materializes the complete Harness bundle. Templates are organized under `.scaffold/templates/`; Rules under `.scaffold/rules/`; and all active Skills under `.scaffold/skills/`. It does not impose a `knowledge/` layout: the active Knowledge Model, Knowledge Schema, and `initialize-project` workflow Skill establish project knowledge semantics and representation.

The initialization workflow establishes only a lightweight project foundation: domain terms and glossary plus goals as Project Knowledge; and evidence-based code/style, testing/quality-gate, and Git/PR/branch/release practices as Project Rules. Requirements, architecture, integrations, operational constraints, and Harness customization remain change- or discovery-driven.

Every independently resolvable Rule is a Markdown file whose H1 is its stable dotted identity, for example `# verification.risk-proportionate`. Rules state `Applies When` and `Guidance`. The local collection must not contain duplicate identities. `status` reports it mechanically; `analyze-rule-conflicts` provides agent-driven semantic review, and `evolve-project-rules` owns its lifecycle.

Use `evolve-project-artifact` when deliberately adding or replacing a local Knowledge Schema, Skill, or Template. It reviews dependency and shadow impact while preserving full-replacement semantics; Rule changes remain in `evolve-project-rules`.

For a Project Knowledge change, use `define-change` followed by `reconcile-project-change`. Reconciliation records a Git baseline for accepted knowledge, then uses a fresh writer subagent to run `update-knowledge` and a distinct fresh reviewer subagent to run read-only `review-change` against the current candidate diff. Findings that need user direction immediately prompt the user with evidence, selectable alternatives, and effects; the answer starts a fresh iteration. A clean independent review automatically accepts the candidate and shows the changed knowledge. Only accepted, implementation-affecting knowledge proceeds to `implement-change`. Reconstruction and finding-learning work feed this same reconciliation path when they change normal Project Knowledge.

For agent discovery, `init` copies the bundled agent guide into `.scaffold/agent-guide.md` and seeds `.scaffold/skills/` when that directory is absent, preserving existing project-owned guidance. It then links only user-invoked workflow Skills into `.agents/skills/` for Codex CLI and `.claude/skills/` for Claude Code. `agents/openai.yaml` distinguishes those workflow Skills from internal model-invoked Skills; it is not itself an agent-discovery control. It creates root `AGENTS.md` and `CLAUDE.md` only when absent. Existing host-owned instruction files and agent-skill entries are preserved; an interactive terminal may add or preview a managed Scaffold block, while non-interactive runs report incomplete integration. Existing managed blocks may be updated without changing surrounding content.

`status` inventories all active project-local artifact files, including the agent guide and Skill support files, and reports Rules and package-version drift. It reports `Harness Structure` separately from `Update Review Status`: the structural check requires the agent guide, Model, and Schema files plus the Rules, Templates, and Skills directories. It reports missing or incorrectly typed entries without package fallback. This checks structure only; it does not validate semantics or require package-candidate Skill or Template names. `scaffold update --diff` compares active artifacts with the installed candidate bundle and reports additions, changes, and package removals without editing files. After `adopt-harness-update` has discussed and applied owner-approved decisions, `update` records the installed Scaffold version as reviewed; it never copies, merges, or deletes Harness artifacts.

The default knowledge representation locates documents by descriptive relative file paths and objects by stable document-local IDs with explicit anchors. For example, `[REQ-001 — Preserve accepted work](../problem/task-recovery.md#req-001)` resolves from the referring file and survives a title-only edit. Document IDs and the former `id next` / `id check` commands are retired; `id` now reports an unknown command.

Use `migrate-references` when a move, split, merge, removal, or representation change requires reference repair. It uses read-only subagents to assess each referring context, prepares a proposal for independent knowledge reconciliation, and checks the realized migration. Update repository references and remove obsolete files without leaving redirect stubs. External references are outside that repair boundary; search exclusions and unresolved mappings must be reported.

When a new Scaffold version cannot be adopted through ordinary replacement, use the `migrate-project` workflow Skill. Migration remains an explicit, project-owned activity; Scaffold does not perform automatic semantic migrations.

## Development

The repository’s `.scaffold/` is the single maintained source for both its active Harness and the distributed starter bundle. Edit guidance there; the same files are followed locally and packaged for other projects. There are no separate root `defaults/` or `skills/` copies. The package explicitly includes the agent guide, Knowledge Model, Schema, Rules, Templates, and Skills; local `.scaffold/metadata.md` is excluded. Practices specific to developing Scaffold belong in repository instructions outside the distributed Harness.

```bash
npm test
```
