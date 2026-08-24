# Knowledge Reconstruction and Learning

Document ID: PROB-003

## Intent

Scaffold must make durable knowledge accessible in Markdown and help projects reconstruct or improve it from evidence while preserving uncertainty and justified scope.

## Actors and Goals

- **Project maintainer**: use readable default guidance without needing structured configuration for core operation.
- **Developer or coding agent**: reconstruct durable knowledge from an existing repository while distinguishing evidence from accepted intent.
- **Project owner**: convert relevant findings into appropriately scoped durable knowledge when analysis warrants it.

## Use Cases

- An agent reconstructs durable knowledge from incomplete documentation and repository evidence.
- A project analyzes a security, operational, or engineering finding before recording a reusable obligation.
- A maintainer or agent reads the default Scaffold guidance for core operation.

## Requirements

### REQ-006 — Incremental brownfield reconstruction

The Harness must support incremental reconstruction of durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

### REQ-007 — Evidence-based durable learning

The Harness must guide a project to convert relevant security, operational, and engineering findings into appropriately scoped durable knowledge when analysis justifies doing so.

### REQ-008 — Usable Markdown-first guidance

The Harness must provide usable default guidance and project knowledge representation in human-readable Markdown without requiring structured configuration for core operation.

## Acceptance Criteria

### AC-013 — Brownfield knowledge is reconstructed with warranted confidence

For:

- REQ-006 — Incremental brownfield reconstruction

Given:

- an existing repository provides incomplete documentation and implementation evidence.

When:

- an agent reconstructs durable knowledge.

Then:

- it distinguishes accepted, Inferred, and Unknown conclusions without treating implementation as unquestionable intent.

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

## Related Knowledge

- SOL-002#CAP-001 — Shared guidance artifact provision.
- SOL-002#CAP-002 — Evidence-based knowledge reconstruction.
- SOL-002#CAP-003 — Finding-to-knowledge learning.
- GOV-002#CON-001 — Markdown-first core operation.
- GOV-002#CON-002 — Agent-mediated semantic validation.
- GOV-002#CON-003 — Durable source-of-truth boundaries.
