# Package Candidate and Starter Artifacts

Document ID: SOL-002

> Evidence source: [`defaults/`](../../defaults/), [`skills/`](../../skills/), and [`test/cli.test.js`](../../test/cli.test.js), inspected 2026-08-30. These sources currently evidence the older shared-runtime bundle behavior; they do not establish the candidate-only package role proposed in this knowledge change.

## Capabilities

### CAP-001 — Superseded: shared guidance artifact provision

Superseded by CAP-004 — Package candidate and starter artifact provision. This historical capability described package guidance as active runtime provision; it is not an active solution capability.

### CAP-004 — Package candidate and starter artifact provision

Provide a Markdown-readable Harness bundle that initializes a project's local active artifacts and serves as the installed-package candidate set for update comparison.

### CAP-002 — Evidence-based knowledge reconstruction

Provide a workflow for recovering durable Problem, Governance, and Solution knowledge from existing repository evidence while preserving material uncertainty.

### CAP-003 — Finding-to-knowledge learning

Provide a workflow for analyzing an observed finding and recording a reusable governance obligation or requirement only when its root cause and scope justify generalization.

## Responsibilities

### RESP-001 — Candidate artifact stewardship

Realizes: CAP-004

Maintain the package's candidate Knowledge Model, representation Schema, categorized Rules, document templates, Skills, and agent guide as a starter bundle, without making them runtime authority for initialized projects.

### RESP-002 — Workflow-Skill sequencing

Realizes: CAP-002 and CAP-003

Provide user-invoked workflow Skills that define ordered phases and required outcomes for reconstruction and learning work.

### RESP-003 — Reusable activity guidance

Realizes: CAP-002 and CAP-003

Provide concise methods for collecting context, analyzing impact, implementing with TDD when applicable, and verifying completed work.

## Components and Boundaries

- **`defaults/`** is assigned-to RESP-001. It contains the candidate Knowledge Model, Schema, categorized `rules/`, templates, and agent guide. Package-root **`skills/`** supplies the candidate workflow and model-invoked Skills. Together these locations form the starter bundle that `init` materializes into a project's active Harness and `update --diff` compares with it.
- **User-invoked workflow Skills in `skills/`** are assigned-to RESP-002. Their `agents/openai.yaml` interfaces expose project-work lifecycle sequencing, including `reconstruct-project-knowledge` and `learn-from-finding`.
- **Model-invoked Skills in `skills/`** are assigned-to RESP-003. They omit an interface and supply reusable methods in the candidate bundle; initialization materializes them locally for active use.
- The installed package distributes these artifacts to projects. After initialization, `.scaffold/` is the source of active Harness guidance; the package bundle is only an initialization and update-review candidate.

## Satisfies

- CAP-004 — Package candidate and starter artifact provision satisfies:
  - PROB-002#REQ-017 — Materialized Harness initialization
- CAP-002 — Evidence-based knowledge reconstruction satisfies:
  - PROB-003#REQ-006 — Incremental brownfield reconstruction
- CAP-003 — Finding-to-knowledge learning satisfies:
  - PROB-003#REQ-007 — Evidence-based durable learning

## Design and Decisions

### DEC-001 — Schema-selected template applicability

The active Knowledge Schema determines the project knowledge representation and which template types apply. Templates are starting structures only and do not independently impose a project knowledge layout.

### DEC-002 — Workflow Skills sequence; model-invoked Skills advise

User-invoked workflow Skills own ordered phases, phase intent, and required outcomes. Model-invoked Skills are reusable methods that a workflow Skill may use and Project Rules may require, but they do not replace workflow sequencing.

### DEC-003 — Pending candidate-bundle materialization

CAP-004 is intentional target design. The current package layout remains evidence of its prior shared-runtime role until implementation copies the complete candidate bundle into a project's active Harness and compares that local set mechanically during update review. This Decision does not claim that those changes have already been implemented or verified.

## Verification Items

### VER-001 — Materialized Markdown guidance availability

Verifies:

- PROB-003#AC-019 — Materialized guidance remains usable as Markdown.

Scope:

- availability of human-readable package candidate artifacts materialized into the active local Harness.

Expected evidence:

- The package exposes the candidate artifacts and Skills, including user-invoked workflow interfaces and model-invoked methods, for initialization and update comparison.

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

- PROB-002#REQ-016 — Project-local active Harness authority.
- PROB-002#REQ-017 — Materialized Harness initialization.
- PROB-003#REQ-006 — Incremental brownfield reconstruction.
- PROB-003#REQ-007 — Evidence-based durable learning.
- PROB-003#REQ-008 — Usable Markdown-first guidance.
- SOL-003#CAP-001 — Durable knowledge separation.
- SOL-003#CAP-002 — Deliberate guidance authority.
- GOV-002#CON-001 — Markdown-first core operation.
- CAP-004 supersedes CAP-001. CAP-001 remains as historical traceability only; package artifacts are candidates for initialization and update review rather than active runtime guidance.
