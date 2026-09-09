# Change Lifecycle and Reconciliation

Document ID: PROB-004

## Intent

Scaffold must establish an acceptance-first lifecycle for meaningful changes and ensure Project Knowledge candidates are independently reconciled before a clean review automatically accepts them as project truth.

## Actors and Goals

- **Project owner**: resolve a reviewer-reported conflict or material ambiguity when authoritative evidence cannot do so.
- **Developer or coding agent**: define and route meaningful changes through the appropriate downstream work.
- **Fresh writer and reviewer subagents**: update and independently inspect candidate Project Knowledge without either role accepting it.

## Use Cases

- A meaningful change is defined, reviewed for acceptance, and routed to downstream work.
- A proposed Project Knowledge delta is reconciled against its accepted Git baseline through distinct writer/reviewer iterations, with immediate user clarification of unresolved conflicts or material ambiguities.

## Requirements

### REQ-009 — Accepted-change lifecycle

The Harness must support a lifecycle in which a meaningful change is defined and reviewed for acceptance before downstream work, while allowing project-specific methods to satisfy the lifecycle outcomes.

### REQ-014 — Independently reconciled Project Knowledge

The Harness must support Git-backed, iterative reconciliation of a Project Knowledge change. A fresh writer execution may update candidate knowledge, and a distinct fresh reviewer execution must inspect the resulting repository state before reconciliation can complete. When a reviewer reports a conflict or material ambiguity that authoritative evidence cannot resolve, the Harness must immediately ask the user to choose how to resolve it, with evidence, viable selectable alternatives and effects, and the affected candidate knowledge. Candidate knowledge becomes accepted automatically after a clean independent review.

## Acceptance Criteria

### AC-016 — Accepted changes are reviewed before downstream work

For:

- REQ-009 — Accepted-change lifecycle

Given:

- a meaningful change has been sufficiently defined.

When:

- the change enters the lifecycle.

Then:

- review establishes acceptance before its selected downstream Workflow begins.

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
- unresolved findings remain non-accepted and, when they require user direction, immediately prompt the user with the evidence, viable selectable alternatives and effects, and affected candidate knowledge;
- a user clarification refreshes context and repeats the loop with fresh writer and reviewer contexts;
- a clean review automatically accepts the candidate; and
- completion shows the changed Project Knowledge records and a concise semantic delta.

## Related Knowledge

- SOL-004#CAP-001 — Accepted-change lifecycle management.
- SOL-004#CAP-002 — Method-flexible work guidance.
- SOL-004#CAP-004 — Project Knowledge reconciliation.
- GOV-002#CON-004 — Initial product scope boundaries.
- GOV-002#CON-005 — Durable knowledge update threshold.
- GOV-002#CON-006 — Git-backed candidate-state boundary.
