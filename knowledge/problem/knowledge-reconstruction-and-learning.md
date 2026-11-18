# Knowledge Reconstruction and Learning

## Intent

Scaffold must make durable knowledge accessible in Markdown and help projects reconstruct or improve it from evidence while preserving uncertainty and justified scope.

Interaction context:

- An agent reconstructs durable knowledge from incomplete documentation and repository evidence.
- A project analyzes a security, operational, or engineering finding before recording a reusable obligation.
- A maintainer or agent reads the project-local Scaffold guidance for core operation.

## Actors and Goals

- **Project maintainer**: use readable materialized Harness guidance without needing structured configuration for core operation.
- **Developer or coding agent**: reconstruct durable knowledge from an existing repository while distinguishing evidence from accepted intent.
- **Project owner**: convert relevant findings into appropriately scoped durable knowledge when analysis warrants it.

## Requirements

<a id="req-006"></a>

### REQ-006 — Incremental brownfield reconstruction

The Harness must support incremental reconstruction of durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

Reconstruction must preserve established stakeholder terminology, including terms that originated in implementation, while distinguishing its agreed domain meaning from internal identifiers and representations. Shared usage alone must not make the current enum, field, complete state set, or transitions an intended business obligation. Where domain meaning or intended behavior lacks sufficient evidence, that uncertainty remains Inferred or Unknown; retaining or renaming a term does not resolve it. Classification follows [REQ-019 — Operational knowledge-space partitioning](knowledge-authority-and-customization.md#req-019).

Relationships:

- REQ-006 is constrained by [REQ-019 — Operational knowledge-space partitioning](knowledge-authority-and-customization.md#req-019).
- Satisfied-by: [CAP-002 — Evidence-based knowledge reconstruction](../solution/default-artifacts.md#cap-002).
- Related-to: [CON-002 — Agent-mediated semantic validation](../governance/product-operating-boundaries.md#con-002).
- Related-to: [CON-003 — Durable source-of-truth boundaries](../governance/product-operating-boundaries.md#con-003).

<a id="req-007"></a>

### REQ-007 — Evidence-based durable learning

The Harness must guide a project to convert relevant security, operational, and engineering findings into appropriately scoped durable knowledge when analysis justifies doing so.

Relationships:

- Satisfied-by: [CAP-003 — Finding-to-knowledge learning](../solution/default-artifacts.md#cap-003).

<a id="req-008"></a>

### REQ-008 — Usable Markdown-first guidance

The Harness must provide usable project-local guidance and project knowledge representation in human-readable Markdown without requiring structured configuration for core operation.

Relationships:

- Related-to: [CAP-004 — Package candidate and starter artifact provision](../solution/default-artifacts.md#cap-004).
- Related-to: [CON-001 — Markdown-first core operation](../governance/product-operating-boundaries.md#con-001).

## Acceptance Criteria

<a id="ac-013"></a>

### AC-013 — Brownfield knowledge is reconstructed with warranted confidence

For:

- REQ-006 — Incremental brownfield reconstruction

Given:

- an existing repository provides incomplete documentation and implementation evidence.
- some implementation-origin terms have established stakeholder usage and agreed domain meanings, while other code-only states lack evidence of intended domain behavior.

When:

- an agent reconstructs durable knowledge.

Then:

- it distinguishes accepted, Inferred, and Unknown conclusions without treating implementation as unquestionable intent;
- it retains established stakeholder terms and their agreed meanings without requiring the current internal spelling, representation, complete enum, or transitions solely because code or shared usage contains them; and
- it leaves unsupported domain meanings or lifecycle obligations Inferred or Unknown instead of treating familiar names as evidence of accepted intent.

<a id="ac-018"></a>

### AC-018 — Findings become durable knowledge only with justified scope

For:

- REQ-007 — Evidence-based durable learning

Given:

- a relevant security, operational, or engineering finding exists.

When:

- the finding is analyzed.

Then:

- any resulting durable knowledge has justified scope and semantic classification.

<a id="ac-019"></a>

### AC-019 — Materialized guidance remains usable as Markdown

For:

- REQ-008 — Usable Markdown-first guidance

Given:

- a project begins using Scaffold.

When:

- a maintainer or agent reads the available guidance.

Then:

- it can use human-readable Markdown without structured configuration for core operation.
