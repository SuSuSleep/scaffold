# Scaffold Product Baseline

Document ID: PROB-001

## Intent

Scaffold is a portable, knowledge-first development harness for human developers and coding agents. It enables a repository to retain durable intent, constraints, technical reasoning, and verification expectations in Markdown while allowing a project to replace shared operational artifacts deliberately.

## Actors and Goals

- **Project maintainer**: initialize and maintain Scaffold in a repository without restructuring existing work.
- **Developer or coding agent**: discover applicable guidance and project knowledge before meaningful work.
- **Project owner**: replace schemas, workflows, skills, or templates in full, and extend or atomically replace individual Project Rules as the project matures.

## Use Cases

- A maintainer initializes a new or existing repository with the `init` command.
- A developer or agent resolves the active shared or project-local guidance before performing meaningful work.
- A maintainer inspects active artifacts and update-review status with `status`.
- A maintainer records completion of an update review with `update` without overwriting project-local replacements.

## Requirements

### REQ-001 — Portable initialization

The CLI must initialize the Harness in a repository while preserving existing project structure.

### REQ-002 — Explicit artifact resolution

A project-local Knowledge Schema, Workflow, Skill, or Template is authoritative in full; shared and local content must not be implicitly merged.

### REQ-011 — Extensible Project Rule collection

The Harness must represent Project Rules as a categorized effective collection. Rules have stable identities and applicability; local Rules may add identities or atomically replace matching shared identities without content merge.

### REQ-003 — Shared knowledge model

The Knowledge Model is Harness-owned and non-replaceable; full-replacement artifacts include the Knowledge Schema, Workflows, Skills, and Templates. Project Rules are extensible with atomic same-identity replacement.

### REQ-004 — Safe agent integration

`AGENTS.md` and `CLAUDE.md` remain host-owned; Scaffold must preserve surrounding content.

### REQ-005 — Review-aware updates

Status must expose update-review drift, and update must record review completion without silently overwriting project-local replacements.

### REQ-006 — Incremental brownfield reconstruction

The Harness must support incremental reconstruction of durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

### REQ-007 — Evidence-based durable learning

The Harness must guide a project to convert relevant security, operational, and engineering findings into appropriately scoped durable knowledge when analysis justifies doing so.

### REQ-008 — Usable Markdown-first guidance

The Harness must provide usable default guidance and project knowledge representation in human-readable Markdown without requiring structured configuration for core operation.

### REQ-009 — Accepted-change lifecycle

The Harness must support a lifecycle in which a meaningful change is defined and reviewed for acceptance before downstream work, while allowing project-specific methods to satisfy the lifecycle outcomes.

### REQ-010 — Selective guidance consumption

The Harness must keep durable Governance separate from Project Rules and enable agents to consume only the Governance and Rules relevant to the current Workflow Phase.

### REQ-012 — Mechanical document-ID support

The CLI must provide repository-level next-ID and availability checks for document IDs without interpreting Knowledge Model semantics or hard-coding knowledge directories.

### REQ-013 — Authority-safe artifact evolution

The Harness must support deliberate evolution of full-replacement artifacts and route accepted changes to the appropriate downstream Workflow without allowing an artifact to override a different authority domain.

### REQ-014 — Independently reconciled Project Knowledge

The Harness must support Git-backed, iterative reconciliation of a Project Knowledge change. A fresh writer execution may update candidate knowledge, and a distinct fresh reviewer execution must inspect the resulting repository state before reconciliation can complete. Candidate knowledge becomes accepted only after a clean independent review and any required project-owner review.

## Acceptance Criteria

### AC-007 — A repository initializes without restructuring

For:

- REQ-001 — Portable initialization

Given:

- a new or existing repository is selected.

When:

- the maintainer runs `scaffold init`.

Then:

- Scaffold infrastructure is initialized without restructuring the repository.

### AC-008 — Host-owned agent instructions are preserved

For:

- REQ-004 — Safe agent integration

Given:

- `AGENTS.md` or `CLAUDE.md` contains host-owned content.

When:

- Scaffold initializes or refreshes its managed instruction.

Then:

- surrounding host-owned content remains preserved.

### AC-009 — Update review is visible and attested safely

For:

- REQ-005 — Review-aware updates

Given:

- a Scaffold project has a recorded reviewed version.

When:

- a maintainer checks status or records an update review.

Then:

- review drift is visible and local replacements are not overwritten.

### AC-010 — Full-replacement artifacts resolve explicitly

For:

- REQ-002 — Explicit artifact resolution

Given:

- a project supplies a local replacement for a shared artifact.

When:

- Scaffold resolves that artifact.

Then:

- the local artifact replaces the shared artifact in full without implicit merging.

### AC-011 — The shared Knowledge Model remains authoritative

For:

- REQ-003 — Shared knowledge model

Given:

- a project has local Scaffold customizations.

When:

- an agent resolves knowledge semantics.

Then:

- it uses the shared Knowledge Model while applying local artifact replacement only where supported.

### AC-012 — Project Rules form an effective collection

For:

- REQ-011 — Extensible Project Rule collection

Given:

- shared Rules and optional local Rules have stable identities.

When:

- Scaffold resolves the active Rule set.

Then:

- local Rules add identities or atomically replace matching shared identities without content merge.

### AC-013 — Brownfield knowledge is reconstructed with warranted confidence

For:

- REQ-006 — Incremental brownfield reconstruction

Given:

- an existing repository provides incomplete documentation and implementation evidence.

When:

- an agent reconstructs durable knowledge.

Then:

- it distinguishes accepted, Inferred, and Unknown conclusions without treating implementation as unquestionable intent.

### AC-014 — Agents consume only relevant durable guidance

For:

- REQ-010 — Selective guidance consumption

Given:

- a Workflow Phase has a defined goal and required outcome.

When:

- an agent collects work context.

Then:

- it resolves the applicable Governance and Rules semantically without loading all guidance by default.

### AC-015 — Document IDs are inspected mechanically

For:

- REQ-012 — Mechanical document-ID support

Given:

- a repository contains Markdown document identifiers.

When:

- a maintainer asks Scaffold for the next ID or checks an ID.

Then:

- Scaffold reports availability and declarations without interpreting knowledge semantics or requiring a fixed knowledge layout.

### AC-016 — Accepted changes are reviewed before downstream work

For:

- REQ-009 — Accepted-change lifecycle

Given:

- a meaningful change has been sufficiently defined.

When:

- the change enters the lifecycle.

Then:

- review establishes acceptance before its selected downstream Workflow begins.

### AC-017 — Artifact evolution preserves authority boundaries

For:

- REQ-013 — Authority-safe artifact evolution

Given:

- an accepted change affects a full-replacement artifact.

When:

- the change is routed downstream.

Then:

- it uses the appropriate evolution path without allowing an artifact to override another authority domain.

### AC-018 — Findings become durable knowledge only with justified scope

For:

- REQ-007 — Evidence-based durable learning

Given:

- a relevant security, operational, or engineering finding exists.

When:

- the finding is analyzed.

Then:

- any resulting durable knowledge has justified scope and semantic classification.

### AC-019 — Default guidance remains usable as Markdown

For:

- REQ-008 — Usable Markdown-first guidance

Given:

- a project begins using Scaffold defaults.

When:

- a maintainer or agent reads the available guidance.

Then:

- it can use human-readable Markdown without structured configuration for core operation.

### AC-020 — Project Knowledge is independently reconciled

For:

- REQ-014 — Independently reconciled Project Knowledge

Given:

- a proposed Project Knowledge delta and a Git baseline representing accepted Project Knowledge.

When:

- reconciliation runs one or more writer/reviewer iterations.

Then:

- each writer and reviewer uses a distinct fresh subagent context;
- the reviewer inspects the candidate knowledge diff and current repository state without modifying reviewed Project Knowledge;
- unresolved findings repeat the loop;
- a clean review completes reconciliation; and
- required project-owner review occurs before the candidate is accepted.

## Related Knowledge

- SOL-001#CAP-001 — Harness lifecycle management.
- SOL-001#CAP-002 — Artifact resolution.
- SOL-001#CAP-003 — Agent guidance integration.
- SOL-002#CAP-002 — Evidence-based knowledge reconstruction.
- SOL-002#CAP-003 — Finding-to-knowledge learning.
- SOL-003#CAP-002 — Deliberate guidance authority.
- SOL-004#CAP-001 — Accepted-change lifecycle management.
- SOL-004#CAP-002 — Method-flexible work guidance.
- SOL-005#CAP-001 — Selective guidance context resolution.
- SOL-004#CAP-004 — Project Knowledge reconciliation.
- GOV-002#CON-001 — Markdown-first core operation.
- GOV-002#CON-002 — Agent-mediated semantic validation.
- GOV-002#CON-003 — Durable source-of-truth boundaries.
- GOV-002#CON-004 — Initial product scope boundaries.
- GOV-001#CON-001 — Supported Node.js runtime.
