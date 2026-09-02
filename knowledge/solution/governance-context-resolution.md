# Guidance Context Resolution

Document ID: SOL-005

> Evidence source: [`defaults/knowledge-schema.md`](../../defaults/knowledge-schema.md), [`defaults/rules/`](../../defaults/rules/), and [`skills/`](../../skills/), inspected 2026-08-30.

## Capabilities

### CAP-001 — Selective guidance context resolution

Enable agents to identify and consume only the Governance and Project Rules relevant to a Workflow Phase while retaining Governance as durable, independently evolvable project knowledge.

### CAP-002 — Rule-guided verification approach

Separate Rule-guided project-wide verification approach from the solution-specific expectations that must be demonstrated.

## Responsibilities

### RESP-001 — Phase-relevant guidance discovery

Realizes: CAP-001

Identify relevant Governance categories and Project Rule identities from the current Workflow Phase, locate applicable records and Rules, and expand context only when dependencies or uncertainty require it.

### RESP-002 — Verification responsibility separation

Realizes: CAP-002

Keep test methodology and evidence-selection strategy in Project Rules while Solution documents retain the specific verification items they must demonstrate.

## Components and Boundaries

- **Project-local workflow Skills in `.scaffold/skills/`** are assigned-to RESP-001. They identify semantic Governance and Rule categories without naming project file paths.
- **Project-local model-invoked Skills in `.scaffold/skills/`** are assigned-to RESP-001. They provide reusable methods and consult applicable project guidance without encoding project-specific strategy. The installed package supplies candidate Skills only for initialization and update review.
- **Solution documents** are assigned-to RESP-002 for Solution verification items.
- **Project Rules** are assigned-to RESP-002 for project-wide verification approach and applicability guidance.

## Satisfies

- CAP-001 — Selective guidance context resolution satisfies:
  - PROB-005#REQ-010 — Selective guidance consumption
- CAP-002 — Rule-guided verification approach satisfies:
  - PROB-005#REQ-010 — Selective guidance consumption

## Design and Decisions

### DEC-001 — Scope is distinct from context loading

Governance and Project Rules may be project-wide in scope without being loaded for every activity. Workflow Phase intent determines relevant categories; agents resolve applicability semantically rather than through a deterministic routing engine.

### DEC-002 — Verification approach and item separation

Project Rules define how the project generally approaches verification. A Solution defines what it must demonstrate through Verification Items, which normally verify Acceptance Criteria and may directly verify technical expectations when needed. Execution results are not automatically durable knowledge. A Solution may specify a verification method only when an exceptional solution-specific constraint requires it.

## Verification Items

### VER-001 — Selective guidance consumption

Verifies:

- PROB-005#AC-014 — Agents consume only relevant durable guidance.

Scope:

- phase-relevant Governance and Rule resolution.

Expected evidence:

- Workflow and Skill guidance refers to Governance and Rules by semantic category and never requires a project-specific path.
- Agents can identify phase-relevant guidance without loading every Governance record or Rule.

Assumptions:

- applicable Governance and Rules have been recorded with enough semantic context to resolve their applicability.

## Related Knowledge

- PROB-005#REQ-010 — Selective guidance consumption.
- SOL-003#CAP-002 — Deliberate guidance authority.
