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

<a id="incremental-brownfield-reconstruction"></a>

### Incremental brownfield reconstruction

The Harness must support incremental reconstruction of durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

Reconstruction must preserve established stakeholder terminology, including terms that originated in implementation, while distinguishing its agreed domain meaning from internal identifiers and representations. Shared usage alone must not make the current enum, field, complete state set, or transitions an intended business obligation. Where domain meaning or intended behavior lacks sufficient evidence, that uncertainty remains Inferred or Unknown; retaining or renaming a term does not resolve it. Classification follows [Operational knowledge-space partitioning](knowledge-authority-and-customization.md#operational-knowledge-space-partitioning).

Relationships:

- [Incremental brownfield reconstruction](#incremental-brownfield-reconstruction) is constrained by [Operational knowledge-space partitioning](knowledge-authority-and-customization.md#operational-knowledge-space-partitioning).
- Satisfied-by: [Evidence-based knowledge reconstruction](../solution/default-artifacts.md#evidence-based-knowledge-reconstruction).
- Related-to: [Agent-mediated semantic validation](../governance/product-operating-boundaries.md#agent-mediated-semantic-validation).
- Related-to: [Durable source-of-truth boundaries](../governance/product-operating-boundaries.md#durable-source-of-truth-boundaries).

<a id="evidence-based-durable-learning"></a>

### Evidence-based durable learning

The Harness must guide a project to convert relevant security, operational, and engineering findings into appropriately scoped durable knowledge when analysis justifies doing so.

Relationships:

- Satisfied-by: [Finding-to-knowledge learning](../solution/default-artifacts.md#finding-to-knowledge-learning).

<a id="usable-markdown-first-guidance"></a>

### Usable Markdown-first guidance

The Harness must provide usable project-local guidance and project knowledge representation in human-readable Markdown without requiring structured configuration for core operation.

Relationships:

- Related-to: [Package candidate and starter artifact provision](../solution/default-artifacts.md#package-candidate-and-starter-artifact-provision).
- Related-to: [Markdown-first core operation](../governance/product-operating-boundaries.md#markdown-first-core-operation).

## Acceptance Criteria

<a id="brownfield-knowledge-is-reconstructed-with-warranted-confidence"></a>

### Brownfield knowledge is reconstructed with warranted confidence

For:

- [Incremental brownfield reconstruction](#incremental-brownfield-reconstruction)

Given:

- an existing repository provides incomplete documentation and implementation evidence.
- some implementation-origin terms have established stakeholder usage and agreed domain meanings, while other code-only states lack evidence of intended domain behavior.

When:

- an agent reconstructs durable knowledge.

Then:

- it distinguishes accepted, Inferred, and Unknown conclusions without treating implementation as unquestionable intent;
- it retains established stakeholder terms and their agreed meanings without requiring the current internal spelling, representation, complete enum, or transitions solely because code or shared usage contains them; and
- it leaves unsupported domain meanings or lifecycle obligations Inferred or Unknown instead of treating familiar names as evidence of accepted intent.

<a id="findings-become-durable-knowledge-only-with-justified-scope"></a>

### Findings become durable knowledge only with justified scope

For:

- [Evidence-based durable learning](#evidence-based-durable-learning)

Given:

- a relevant security, operational, or engineering finding exists.

When:

- the finding is analyzed.

Then:

- any resulting durable knowledge has justified scope and semantic classification.

<a id="materialized-guidance-remains-usable-as-markdown"></a>

### Materialized guidance remains usable as Markdown

For:

- [Usable Markdown-first guidance](#usable-markdown-first-guidance)

Given:

- a project begins using Scaffold.

When:

- a maintainer or agent reads the available guidance.

Then:

- it can use human-readable Markdown without structured configuration for core operation.
