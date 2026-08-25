# Shared Guidance Artifacts

Document ID: SOL-002

> Evidence source: [`defaults/`](../../defaults/), [`workflows/`](../../workflows/), [`skills/`](../../skills/), and [`test/cli.test.js`](../../test/cli.test.js), inspected 2026-08-20.

## Capabilities

### CAP-001 — Shared guidance artifact provision

Provide the default Knowledge Model, default Knowledge Schema, categorized Project Rules, and templates that a Scaffold project resolves according to their defined artifact behavior.

### CAP-002 — Evidence-based knowledge reconstruction

Provide a workflow for recovering durable Problem, Governance, and Solution knowledge from existing repository evidence while preserving material uncertainty.

### CAP-003 — Finding-to-knowledge learning

Provide a workflow for analyzing an observed finding and recording a reusable governance obligation or requirement only when its root cause and scope justify generalization.

## Responsibilities

### RESP-001 — Default artifact stewardship

Realizes: CAP-001

Maintain the shared semantic model, representation defaults, categorized rules, and document templates as package-managed guidance.

### RESP-002 — Workflow sequencing

Realizes: CAP-002 and CAP-003

Define the ordered phases and required outcomes for reconstruction and learning work without making a skill the authority for lifecycle sequencing.

### RESP-003 — Reusable activity guidance

Realizes: CAP-002 and CAP-003

Provide concise methods for collecting context, analyzing impact, implementing with TDD when applicable, and verifying completed work.

## Components and Boundaries

- **`defaults/`** is assigned-to RESP-001. It contains the default Knowledge Model as the sole source of default semantic meaning, the shared default Schema for representation only, categorized `rules/`, and default templates.
- **`workflows/`** is assigned-to RESP-002. It defines project-work lifecycle sequencing, including `reconstruct-project-knowledge` and `learn-from-finding`.
- **`skills/`** is assigned-to RESP-003. It supplies optional reusable methods; a project may explicitly replace a skill without merging it with the shared version.
- The installed package exposes these artifacts to projects. `.scaffold/` is a project-local Harness integration area, not the source location of the package's shared guidance.

## Satisfies

- CAP-002 — Evidence-based knowledge reconstruction satisfies:
  - PROB-003#REQ-006 — Incremental brownfield reconstruction
- CAP-003 — Finding-to-knowledge learning satisfies:
  - PROB-003#REQ-007 — Evidence-based durable learning

## Design and Decisions

### DEC-001 — Schema-selected template applicability

The active Knowledge Schema determines the project knowledge representation and which template types apply. Templates are starting structures only and do not independently impose a project knowledge layout.

### DEC-002 — Workflows sequence; skills advise

Workflows own ordered phases, phase intent, and required outcomes. Skills are reusable methods that a workflow may suggest and Project Rules may require, but they do not replace workflow sequencing.

## Verification Items

### VER-001 — Shared artifact availability

Verifies:

- PROB-003#AC-019 — Default guidance remains usable as Markdown.

Scope:

- availability of human-readable default artifacts selected by the active Schema.

Expected evidence:

- The package exposes the default artifacts, workflows, and skills that the active Schema selects.

### VER-002 — Brownfield reconstruction preserves confidence

Verifies:

- PROB-003#AC-013 — Brownfield knowledge is reconstructed with warranted confidence.

Scope:

- evidence and uncertainty treatment during reconstruction.

Expected evidence:

- reconstruction guidance preserves evidence, scope, and uncertainty.

### VER-003 — Findings are generalized with justified scope

Verifies:

- PROB-003#AC-018 — Findings become durable knowledge only with justified scope.

Scope:

- evidence-based conversion of a finding into durable knowledge.

Expected evidence:

- learning guidance requires analysis before a finding becomes a Control, Constraint, or Requirement.

## Related Knowledge

- PROB-002#REQ-002 — Explicit replacement.
- PROB-002#REQ-003 — Replaceable knowledge model.
- PROB-003#REQ-006 — Incremental brownfield reconstruction.
- PROB-003#REQ-007 — Evidence-based durable learning.
- PROB-003#REQ-008 — Usable Markdown-first guidance.
- SOL-001#CAP-002 — Artifact resolution.
- SOL-003#CAP-001 — Durable knowledge separation.
- SOL-003#CAP-002 — Deliberate guidance authority.
- GOV-002#CON-001 — Markdown-first core operation.
