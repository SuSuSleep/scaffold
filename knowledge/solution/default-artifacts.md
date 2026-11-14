# Package Candidate and Starter Artifacts

Document ID: SOL-002

> Design basis: project-owner approval of the single-source Harness consolidation, 2026-11-13. [`.scaffold/`](../../.scaffold/) contains the active artifacts; [`src/project.js`](../../src/project.js), [`package.json`](../../package.json), and [`test/cli.test.js`](../../test/cli.test.js) are the affected distribution, lifecycle, and verification boundaries. The consolidation is implemented in these boundaries; package contents and extracted-package initialization were verified on 2026-11-13.

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

Maintain the package's candidate Knowledge Model, representation Schema, categorized Rules, document templates, Skills, and agent guide as a starter bundle, without making them runtime authority for initialized projects. The candidate Schema and templates must be able to represent the Project Context baseline and coherent Problem documents required by PROB-001#REQ-014, and the bundle must guide the explicit hybrid responsibility allocation required by PROB-006#REQ-001.

### RESP-002 — Workflow-Skill sequencing

Realizes: CAP-002 and CAP-003

Provide user-invoked workflow Skills that define ordered phases and required outcomes for reconstruction and learning work.

### RESP-003 — Reusable activity guidance

Realizes: CAP-002 and CAP-003

Provide concise methods for collecting context, analyzing impact, implementing with TDD when applicable, and verifying completed work.

## Components and Boundaries

- **The Scaffold repository's `.scaffold/`** is assigned-to RESP-001. Its agent guide, Knowledge Model, Schema, categorized `rules/`, templates, and `skills/` are both the active Harness for developing Scaffold and the single maintained source of its distributed starter bundle. There are no separate root `defaults/` or `skills/` copies. The package includes these distributable artifacts and excludes this repository's local `metadata.md`.
- **User-invoked workflow Skills in `.scaffold/skills/`** are assigned-to RESP-002. Their `agents/openai.yaml` interfaces expose project-work lifecycle sequencing, including `reconstruct-project-knowledge` and `learn-from-finding`.
- **Model-invoked Skills in `.scaffold/skills/`** are assigned-to RESP-003. They omit an interface and supply reusable methods in the candidate bundle; initialization materializes them locally for active use.
- The installed package distributes its bundled `.scaffold/` artifacts to other projects. Initialization copies them into the target project's own `.scaffold/` and creates target-specific metadata. That target-local Harness remains the sole active authority; the installed bundle remains only an initialization and update-review candidate for that project.

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

The target Schema must select a lightweight Project Context representation for project-wide orientation: top-level purpose, goals, domain terms or glossary, scope and exclusions, and material unknowns. Project Context is a representation record, not a Knowledge Model concept or fourth semantic space. It must not use the Problem-document structure or represent Actors, Use Cases, Requirements, or Acceptance Criteria; Goals remain Problem-space concepts even when recorded for orientation in Project Context.

The target Schema and Problem template must also make each Problem document a record of one coherent subject. A document is extended only when added knowledge concerns that same subject; a different subject receives a new Problem document. Shared project purpose, goals, actors, dependencies, implementation areas, or repository layout do not establish document containment. Any material connection between documents is recorded explicitly using the Schema's relationship representation.

### DEC-002 — Workflow Skills sequence; model-invoked Skills advise

User-invoked workflow Skills own ordered phases, phase intent, and required outcomes. Model-invoked Skills are reusable methods that a workflow Skill may use and Project Rules may require, but they do not replace workflow sequencing.

### DEC-003 — Superseded: pending candidate-bundle materialization

Superseded by DEC-006 — One source for active and distributed Harness artifacts. This historical implementation-stage note is no longer an active description of the package layout.

### DEC-004 — Project Context representation

The candidate Schema, Project Context template, Problem template guidance, and initialization guidance represent the accepted Project Context and coherent-Problem-document design. The active Knowledge Model remains unchanged: it retains the three semantic spaces and defines Goals as Problem-space concepts. An initialized project's active local Harness may replace that representation deliberately through its Schema and selected templates.

### DEC-005 — Reconstruction separates domain evidence from representation

Realizes: RESP-002 — Workflow-Skill sequencing.

The reconstruction workflow applies the active `core.knowledge-space-partition` Rule to shared terminology and implementation evidence, using the classification design in SOL-003#DEC-006 — Policy-guided partitioning without a semantic CLI validator. Its evidence analysis must distinguish support for a stakeholder term, support for its domain meaning and intended behavior, and evidence of technical realization; these are not interchangeable. Established implementation-origin vocabulary can be retained without accepting the surrounding state machine as business intent. Unsupported meanings or obligations retain the existing Inferred or Unknown treatment and required owner review. The partition Rule and reconstruction Skill carry this guidance; their presence does not by itself demonstrate a successful agent-run reconstruction scenario.

### DEC-006 — One source for active and distributed Harness artifacts

Realizes: RESP-001 — Candidate artifact stewardship.

Maintain the distributable Harness directly in this repository's `.scaffold/`, replacing the separate root `defaults/` and `skills/` copies. Coding agents otherwise have to distinguish the guidance to edit from an identical copy they must follow, creating wrong-location edits and synchronization work. One maintained file per artifact removes that distinction here; the same Skill, Rule, Model, Schema, Template, or guide is followed locally and shipped.

The trade-off is deliberate coupling: changing distributed guidance changes this repository's active guidance immediately. The shared source must therefore remain suitable for distribution. Practices specific to developing Scaffold belong in repository instructions outside the distributed artifact set. Local metadata is excluded from distribution and artifact comparison; each target project owns its reviewed-version and installation state.

Initialization and update comparison read the package's `.scaffold/` artifact set. Other projects still receive independent local copies and retain deliberate customization and update adoption. Consolidation changes the source layout, not downstream runtime authority or update-merge behavior. Agent discovery continues linking workflow Skills from each project's `.scaffold/skills/`.

The package contains its own CLI implementation and candidate Harness. It does not depend on another packaged copy of itself or a repository-local tarball to operate. The package manifest and lockfile describe the same package identity and dependency set; archived earlier versions remain historical snapshots rather than current artifact authorities.

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

- evidence and uncertainty treatment during reconstruction, including shared terms originating in implementation and ambiguous code-only states.

Expected evidence:

- reconstruction guidance preserves evidence, scope, and uncertainty;
- established stakeholder terms retain their agreed meanings with the partitioning required by PROB-002#REQ-019, while current internal identifiers, enums, and transitions are not promoted to business obligations solely from code or shared usage; and
- unsupported domain meanings and intended lifecycle behavior remain Inferred or Unknown even when names are familiar or have been reworded.

### VER-003 — Findings are generalized with justified scope

Verifies:

- PROB-003#AC-018 — Findings become durable knowledge only with justified scope.

Scope:

- evidence-based conversion of a finding into durable knowledge.

Expected evidence:

- learning guidance requires analysis before a finding becomes a Control, Constraint, or Requirement.

### VER-004 — Packaged Harness initializes from the single maintained source

Verifies:

- PROB-002#AC-023 — Initialization materializes active guidance.

Scope:

- the boundary from this repository's maintained `.scaffold/` artifacts through the actual package archive to initialization in another repository.

Expected evidence:

- the archive contains the complete distributable Harness from `.scaffold/`, including workflow interfaces and model-invoked Skills, without root `defaults/` or `skills/` duplicates or this repository's `metadata.md`, and its manifest requires no self-dependency or repository-local archive;
- initialization using the extracted package materializes the same artifacts in the target project's `.scaffold/`, generates target-specific metadata, and links workflow discovery to the target-local Skills; and
- artifact comparison excludes local metadata and reports changes against the bundled Harness without modifying the target's guidance.

## Related Knowledge

- PROB-002#REQ-016 — Project-local active Harness authority.
- PROB-002#REQ-017 — Materialized Harness initialization.
- PROB-001#REQ-014 — Foundational Project Context baseline.
- PROB-003#REQ-006 — Incremental brownfield reconstruction.
- PROB-003#REQ-007 — Evidence-based durable learning.
- PROB-003#REQ-008 — Usable Markdown-first guidance.
- DEC-005 is constrained by PROB-002#REQ-019 — Operational knowledge-space partitioning.
- SOL-003#CAP-001 — Durable knowledge separation.
- SOL-003#CAP-002 — Deliberate guidance authority.
- SOL-006#CAP-001 — Hybrid responsibility architecture.
- PROB-006#REQ-001 — Explicit hybrid responsibility allocation.
- GOV-002#CON-001 — Markdown-first core operation.
- CAP-004 supersedes CAP-001. CAP-001 remains as historical traceability only; package artifacts are candidates for initialization and update review rather than active runtime guidance.
