# Product Operating Boundaries

> Evidence source: [`.scaffold/knowledge-model.md`](../../.scaffold/knowledge-model.md), [`.scaffold/knowledge-schema.md`](../../.scaffold/knowledge-schema.md), and [`.scaffold/rules/`](../../.scaffold/rules/), inspected 2026-08-21.

## Purpose

Scaffold is a knowledge-first Harness rather than a replacement for every engineering system. Its initial scope depends on readable durable knowledge, agent reasoning, explicit customization, and deliberate treatment of inconsistencies and discoveries.

## Applies When

Product design, implementation, default guidance, documentation, automated checks, and proposed scope expansions for Scaffold are evaluated.

## Does Not Normally Apply When

A record is purely temporary work history and has no durable project consequence.

## Records

<a id="markdown-first-core-operation"></a>

### Markdown-first core operation

Concept: Constraint

Core Harness guidance and project knowledge representation must be usable as human-readable Markdown. Core operation must not require structured configuration; structured metadata may be introduced only when a concrete requirement justifies it.

Constrains:

- [Package candidate and starter artifact provision](../solution/default-artifacts.md#package-candidate-and-starter-artifact-provision).

<a id="agent-mediated-semantic-validation"></a>

### Agent-mediated semantic validation

Concept: Constraint

The initial product must rely on agent reasoning for semantic validation, including Schema interpretation, Project Rule enforcement, documentation consistency, traceability, relationships, and Workflow outcomes. It must not claim or depend on deterministic semantic validation; agents must report material uncertainty rather than fabricate relationships.

Constrains:

- [Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#accepted-change-lifecycle-management).
- [Context and impact collection](../solution/change-lifecycle-and-methods.md#context-and-impact-collection).

<a id="durable-source-of-truth-boundaries"></a>

### Durable source-of-truth boundaries

Concept: Constraint

Project Knowledge is durable truth for intent, obligations, constraints, and reasoning; code is implementation; tests are executable verification mechanisms; and execution artifacts are temporary work history. Verification Items are durable expectations, while completed verification evidence is not automatically durable knowledge. When these sources disagree, the inconsistency must be analyzed rather than automatically resolved in favor of one source. Durable reasoning must not depend exclusively on execution artifacts.

Constrains:

- [Durable knowledge separation](../solution/knowledge-architecture.md#durable-knowledge-separation).
- [Context and impact collection](../solution/change-lifecycle-and-methods.md#context-and-impact-collection).

<a id="initial-product-scope-boundaries"></a>

### Initial product scope boundaries

Concept: Constraint

The initial product does not replace Git, issue tracking, CI/CD, or project-management systems; require Scrum, TDD, a knowledge graph, or a vector database; automatically reconcile conflicting documentation; preserve every temporary execution artifact as durable knowledge; or maintain compatibility through configuration inheritance. Model Migration Crosswalks record project-owned decisions but do not automate semantic migration. Migration and conflict resolution remain deliberate, project-owned work.

Constrains:

- [Materialized Harness lifecycle management](../solution/cli-and-guidance.md#materialized-harness-lifecycle-management).
- [Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#accepted-change-lifecycle-management).

<a id="durable-knowledge-update-threshold"></a>

### Durable knowledge update threshold

Concept: Constraint

Durable knowledge must be updated when a change affects externally observable behavior, requirements, interfaces, responsibilities, architectural boundaries, state or important data semantics, security assumptions, reusable engineering constraints, or meaningful design decisions. Purely mechanical changes, such as formatting, local renaming, equivalent refactoring, or implementation details with no durable reasoning value, do not by themselves require a knowledge update.

Constrains:

- [Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#accepted-change-lifecycle-management).
- [Context and impact collection](../solution/change-lifecycle-and-methods.md#context-and-impact-collection).

<a id="git-backed-candidate-state-boundary"></a>

### Git-backed candidate-state boundary

Concept: Constraint

When reconciling a Project Knowledge change, Git must distinguish the accepted baseline from candidate Project Knowledge. A writer’s repository edits are candidate state, not accepted truth, until a distinct fresh reviewer completes a clean review, which automatically accepts the candidate. A reviewer-reported conflict or material ambiguity remains non-accepted and is immediately put to the user for resolution when authoritative evidence cannot resolve it. This integration does not replace Git’s normal branching, commit, or review practices.

Constrains:

- [Project Knowledge reconciliation](../solution/change-lifecycle-and-methods.md#project-knowledge-reconciliation).

## Verification

- Review product changes for a Markdown-readable representation and absence of a mandatory deterministic semantic-validation engine.
- Review new automation and integration proposals to ensure they do not silently merge replacements, automate semantic migration, or claim to replace excluded engineering systems.
- When records conflict, capture the evidence and reconciliation decision in durable knowledge rather than relying only on a task, issue, pull request, commit, or temporary discussion.
- During change review, classify an update as durable when it crosses the documented knowledge-update threshold; otherwise retain it as a mechanical implementation change.

## Related Knowledge

- [Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#project-local-active-harness-authority).
- [Usable Markdown-first guidance](../problem/knowledge-reconstruction-and-learning.md#usable-markdown-first-guidance).
- [Accepted-change lifecycle](../problem/change-lifecycle-and-reconciliation.md#accepted-change-lifecycle).
- [Package candidate and starter artifact provision](../solution/default-artifacts.md#package-candidate-and-starter-artifact-provision).
- [Durable knowledge separation](../solution/knowledge-architecture.md#durable-knowledge-separation).
- [Accepted-change lifecycle management](../solution/change-lifecycle-and-methods.md#accepted-change-lifecycle-management).
- [Project Knowledge reconciliation](../solution/change-lifecycle-and-methods.md#project-knowledge-reconciliation).
