# Scaffold Product Baseline

Document ID: PROB-001

> Source: [PRD.md](../../PRD.md), version 0.2 (draft). This document records the minimum durable product intent needed for safe ongoing development; the PRD remains the detailed product definition.

## Intent

Scaffold is a portable, knowledge-first development harness for human developers and coding agents. It enables a repository to retain durable intent, constraints, technical reasoning, and verification expectations in Markdown while allowing a project to replace shared operational artifacts deliberately.

## Actors and Goals

- **Project maintainer**: initialize and maintain Scaffold in a repository without restructuring existing work.
- **Developer or coding agent**: discover applicable guidance and project knowledge before meaningful work.
- **Project owner**: replace default schemas, rules, workflows, skills, or templates as the project matures, without implicit merging.

## Use Cases

- A maintainer initializes a new or existing repository with the `init` command.
- A developer or agent resolves the active shared or project-local guidance before performing meaningful work.
- A maintainer inspects active artifacts and update-review status with `status`.
- A maintainer records completion of an update review with `update` without overwriting project-local replacements.

## Requirements

### REQ-001 — Portable initialization

The CLI must initialize the Harness in a repository while preserving existing project structure. Derived from PRD §3.1 and §28.

Acceptance Criteria:

- A repository can be initialized and can use the default Scaffold without a custom schema.
- An existing repository can adopt Scaffold without full restructuring.

### REQ-002 — Explicit replacement

A project-local replaceable artifact is authoritative in full; shared and local artifacts must not be implicitly merged. Derived from PRD §2.3 and §24.

Acceptance Criteria:

- Local schemas, rules, workflows, skills, and templates resolve as replacements and are reported as shadowing shared equivalents.

### REQ-003 — Shared knowledge model

The Knowledge Model is Harness-owned and non-replaceable; replaceable artifacts include the Knowledge Schema, Project Rules, Workflows, Skills, and Templates. Derived from PRD §3.1.

Acceptance Criteria:

- A local Knowledge Model is ignored and reported while the shared model remains active.

### REQ-004 — Safe agent integration

`AGENTS.md` and `CLAUDE.md` remain host-owned; Scaffold must preserve surrounding content. Derived from PRD §3.1 and §25.

Acceptance Criteria:

- Initialization preserves non-Scaffold content in host-owned agent instruction files.

### REQ-005 — Review-aware updates

Status must expose update-review drift, and update must record review completion without silently overwriting project-local replacements. Derived from PRD §3.1 and §30.

Acceptance Criteria:

- Updates preserve local replacement contents and record review attestation.

## Acceptance Criteria

## Related Knowledge

- SOL-001#CAP-001 — Harness lifecycle management.
- SOL-001#CAP-002 — Artifact resolution.
- SOL-001#CAP-003 — Agent guidance integration.
- [PRD.md](../../PRD.md) — detailed source and broader acceptance criteria.
