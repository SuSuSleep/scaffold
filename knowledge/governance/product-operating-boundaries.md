# Product Operating Boundaries

> Evidence source: [`.scaffold/knowledge-model.md`](../../.scaffold/knowledge-model.md), [`.scaffold/knowledge-schema.md`](../../.scaffold/knowledge-schema.md), and [`.scaffold/rules/`](../../.scaffold/rules/), inspected 2026-08-21.

## Purpose

Scaffold is a knowledge-first Harness rather than a replacement for every engineering system. Its initial scope depends on readable durable knowledge, agent reasoning, explicit customization, and deliberate treatment of inconsistencies and discoveries.

## Applies When

Product design, implementation, default guidance, documentation, automated checks, and proposed scope expansions for Scaffold are evaluated.

## Does Not Normally Apply When

A record is purely temporary work history and has no durable project consequence.

## Records

<a id="con-001"></a>

### CON-001 — Markdown-first core operation

Core Harness guidance and project knowledge representation must be usable as human-readable Markdown. Core operation must not require structured configuration; structured metadata may be introduced only when a concrete requirement justifies it.

Constrains:

- [CAP-004 — Package candidate and starter artifact provision](../solution/default-artifacts.md#cap-004).

<a id="con-002"></a>

### CON-002 — Agent-mediated semantic validation

The initial product must rely on agent reasoning for semantic validation, including Schema interpretation, Project Rule enforcement, documentation consistency, traceability, relationships, and Workflow outcomes. It must not claim or depend on deterministic semantic validation; agents must report material uncertainty rather than fabricate relationships.

Constrains:

- [CAP-001 — Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#cap-001).
- [CAP-003 — Context and impact collection](../solution/change-lifecycle-and-methods.md#cap-003).

<a id="con-003"></a>

### CON-003 — Durable source-of-truth boundaries

Project Knowledge is durable truth for intent, obligations, constraints, and reasoning; code is implementation; tests are executable verification mechanisms; and execution artifacts are temporary work history. Verification Items are durable expectations, while completed verification evidence is not automatically durable knowledge. When these sources disagree, the inconsistency must be analyzed rather than automatically resolved in favor of one source. Durable reasoning must not depend exclusively on execution artifacts.

Constrains:

- [CAP-001 — Durable knowledge separation](../solution/knowledge-architecture.md#cap-001).
- [CAP-003 — Context and impact collection](../solution/change-lifecycle-and-methods.md#cap-003).

<a id="con-004"></a>

### CON-004 — Initial product scope boundaries

The initial product does not replace Git, issue tracking, CI/CD, or project-management systems; require Scrum, TDD, a knowledge graph, or a vector database; automatically reconcile conflicting documentation; preserve every temporary execution artifact as durable knowledge; or maintain compatibility through configuration inheritance. Model Migration Crosswalks record project-owned decisions but do not automate semantic migration. Migration and conflict resolution remain deliberate, project-owned work.

Constrains:

- [CAP-005 — Materialized Harness lifecycle management](../solution/cli-and-guidance.md#cap-005).
- [CAP-001 — Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#cap-001).

<a id="con-005"></a>

### CON-005 — Durable knowledge update threshold

Durable knowledge must be updated when a change affects externally observable behavior, requirements, interfaces, responsibilities, architectural boundaries, state or important data semantics, security assumptions, reusable engineering constraints, or meaningful design decisions. Purely mechanical changes, such as formatting, local renaming, equivalent refactoring, or implementation details with no durable reasoning value, do not by themselves require a knowledge update.

Constrains:

- [CAP-001 — Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#cap-001).
- [CAP-003 — Context and impact collection](../solution/change-lifecycle-and-methods.md#cap-003).

<a id="con-006"></a>

### CON-006 — Git-backed candidate-state boundary

When reconciling a Project Knowledge change, Git must distinguish the accepted baseline from candidate Project Knowledge. A writer’s repository edits are candidate state, not accepted truth, until a distinct fresh reviewer completes a clean review, which automatically accepts the candidate. A reviewer-reported conflict or material ambiguity remains non-accepted and is immediately put to the user for resolution when authoritative evidence cannot resolve it. This integration does not replace Git’s normal branching, commit, or review practices.

Constrains:

- [CAP-004 — Project Knowledge reconciliation](../solution/change-lifecycle-and-methods.md#cap-004).

## Verification

- Review product changes for a Markdown-readable representation and absence of a mandatory deterministic semantic-validation engine.
- Review new automation and integration proposals to ensure they do not silently merge replacements, automate semantic migration, or claim to replace excluded engineering systems.
- When records conflict, capture the evidence and reconciliation decision in durable knowledge rather than relying only on a task, issue, pull request, commit, or temporary discussion.
- During change review, classify an update as durable when it crosses the documented knowledge-update threshold; otherwise retain it as a mechanical implementation change.

## Related Knowledge

- [REQ-016 — Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#req-016).
- [REQ-008 — Usable Markdown-first guidance](../problem/knowledge-reconstruction-and-learning.md#req-008).
- [REQ-009 — Accepted-change lifecycle](../problem/change-lifecycle-and-reconciliation.md#req-009).
- [CAP-004 — Package candidate and starter artifact provision](../solution/default-artifacts.md#cap-004).
- [CAP-001 — Durable knowledge separation](../solution/knowledge-architecture.md#cap-001).
- [CAP-001 — Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#cap-001).
- [CAP-004 — Project Knowledge reconciliation](../solution/change-lifecycle-and-methods.md#cap-004).
