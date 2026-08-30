# Product Operating Boundaries

Document ID: GOV-002

> Evidence source: [`defaults/knowledge-model.md`](../../defaults/knowledge-model.md), [`defaults/knowledge-schema.md`](../../defaults/knowledge-schema.md), and [`defaults/rules/`](../../defaults/rules/), inspected 2026-08-21.

## Purpose

Scaffold is a knowledge-first Harness rather than a replacement for every engineering system. Its initial scope depends on readable durable knowledge, agent reasoning, explicit customization, and deliberate treatment of inconsistencies and discoveries.

## Applies When

Product design, implementation, default guidance, documentation, automated checks, and proposed scope expansions for Scaffold are evaluated.

## Does Not Normally Apply When

A record is purely temporary work history and has no durable project consequence.

## Records

### CON-001 — Markdown-first core operation

Core Harness guidance and project knowledge representation must be usable as human-readable Markdown. Core operation must not require structured configuration; structured metadata may be introduced only when a concrete requirement justifies it.

Constrains:

- SOL-002#CAP-001 — Shared guidance artifact provision.

### CON-002 — Agent-mediated semantic validation

The initial product must rely on agent reasoning for semantic validation, including Schema interpretation, Project Rule enforcement, documentation consistency, traceability, relationships, and Workflow outcomes. It must not claim or depend on deterministic semantic validation; agents must report material uncertainty rather than fabricate relationships.

Constrains:

- SOL-004#CAP-001 — Accepted-change lifecycle management.
- SOL-004#CAP-003 — Context and impact collection.

### CON-003 — Durable source-of-truth boundaries

Project Knowledge is durable truth for intent, obligations, constraints, and reasoning; code is implementation; tests are executable verification mechanisms; and execution artifacts are temporary work history. Verification Items are durable expectations, while completed verification evidence is not automatically durable knowledge. When these sources disagree, the inconsistency must be analyzed rather than automatically resolved in favor of one source. Durable reasoning must not depend exclusively on execution artifacts.

Constrains:

- SOL-003#CAP-001 — Durable knowledge separation.
- SOL-004#CAP-003 — Context and impact collection.

### CON-004 — Initial product scope boundaries

The initial product does not replace Git, issue tracking, CI/CD, or project-management systems; require Scrum, TDD, a knowledge graph, or a vector database; automatically reconcile conflicting documentation; preserve every temporary execution artifact as durable knowledge; or maintain compatibility through configuration inheritance. Model Migration Crosswalks record project-owned decisions but do not automate semantic migration. Migration and conflict resolution remain deliberate, project-owned work.

Constrains:

- SOL-001#CAP-001 — Harness lifecycle management.
- SOL-004#CAP-001 — Accepted-change lifecycle management.

### CON-005 — Durable knowledge update threshold

Durable knowledge must be updated when a change affects externally observable behavior, requirements, interfaces, responsibilities, architectural boundaries, state or important data semantics, security assumptions, reusable engineering constraints, or meaningful design decisions. Purely mechanical changes, such as formatting, local renaming, equivalent refactoring, or implementation details with no durable reasoning value, do not by themselves require a knowledge update.

Constrains:

- SOL-004#CAP-001 — Accepted-change lifecycle management.
- SOL-004#CAP-003 — Context and impact collection.

### CON-006 — Git-backed candidate-state boundary

When reconciling a Project Knowledge change, Git must distinguish the accepted baseline from candidate Project Knowledge. A writer’s repository edits are candidate state, not accepted truth, until a distinct fresh reviewer completes a clean review and any required project-owner review is obtained. This integration does not replace Git’s normal branching, commit, or review practices.

Constrains:

- SOL-004#CAP-004 — Project Knowledge reconciliation.

## Verification

- Review product changes for a Markdown-readable representation and absence of a mandatory deterministic semantic-validation engine.
- Review new automation and integration proposals to ensure they do not silently merge replacements, automate semantic migration, or claim to replace excluded engineering systems.
- When records conflict, capture the evidence and reconciliation decision in durable knowledge rather than relying only on a task, issue, pull request, commit, or temporary discussion.
- During change review, classify an update as durable when it crosses the documented knowledge-update threshold; otherwise retain it as a mechanical implementation change.

## Related Knowledge

- PROB-002#REQ-002 — Explicit replacement.
- PROB-003#REQ-008 — Usable Markdown-first guidance.
- PROB-004#REQ-009 — Accepted-change lifecycle.
- SOL-002#CAP-001 — Shared guidance artifact provision.
- SOL-003#CAP-001 — Durable knowledge separation.
- SOL-004#CAP-001 — Accepted-change lifecycle management.
- SOL-004#CAP-004 — Project Knowledge reconciliation.
