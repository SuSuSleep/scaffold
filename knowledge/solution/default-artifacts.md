# Package Candidate and Starter Artifacts

> Design basis: project-owner approval of the single-source Harness consolidation, 2026-11-13. [`.scaffold/`](../../.scaffold/) contains the active artifacts; [`src/project.js`](../../src/project.js), [`package.json`](../../package.json), and [`test/cli.test.js`](../../test/cli.test.js) are the affected distribution, lifecycle, and verification boundaries. The consolidation is implemented in these boundaries; package contents and extracted-package initialization were verified on 2026-11-13.

## Capabilities and Architecture

<a id="cap-001"></a>

### CAP-001 — Superseded: shared guidance artifact provision

Superseded by CAP-004 — Package candidate and starter artifact provision. This historical capability described package guidance as active runtime provision; it is not an active solution capability.

<a id="cap-004"></a>

### CAP-004 — Package candidate and starter artifact provision

Provide a Markdown-readable Harness bundle that initializes a project's local active artifacts and serves as the installed-package candidate set for update comparison.

Relationships:

- Satisfies: [REQ-017 — Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#req-017).
- Related-to: [REQ-008 — Usable Markdown-first guidance](../problem/knowledge-reconstruction-and-learning.md#req-008).
- Related-to: [CON-001 — Markdown-first core operation](../governance/product-operating-boundaries.md#con-001).
- CAP-004 supersedes CAP-001. CAP-001 remains as historical traceability only; package artifacts are candidates for initialization and update review rather than active runtime guidance.

#### Responsibilities

<a id="resp-001"></a>

##### RESP-001 — Candidate artifact stewardship

Realizes: CAP-004

Maintain the package's candidate Knowledge Model, representation Schema, categorized Rules, document templates, Skills, and agent guide as a starter bundle, without making them runtime authority for initialized projects. The candidate Schema and templates must be able to represent the Project Context baseline and coherent Problem documents required by [REQ-014](../problem/scaffold-product.md#req-014), and the bundle must guide the explicit hybrid responsibility allocation required by [REQ-001](../problem/hybrid-system-architecture.md#req-001).

Relationships:

- Related-to: [REQ-016 — Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#req-016).
- Related-to: [CAP-001 — Hybrid responsibility architecture](hybrid-agent-tool-architecture.md#cap-001).
- Related-to: [REQ-001 — Explicit hybrid responsibility allocation](../problem/hybrid-system-architecture.md#req-001).

#### Components and Boundaries

- **The Scaffold repository's `.scaffold/`** is assigned-to RESP-001. Its agent guide, Knowledge Model, Schema, categorized `rules/`, templates, and `skills/` are both the active Harness for developing Scaffold and the single maintained source of its distributed starter bundle. There are no separate root `defaults/` or `skills/` copies. The package includes these distributable artifacts and excludes this repository's local `metadata.md`.

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-002"></a>

### CAP-002 — Evidence-based knowledge reconstruction

Provide a workflow for recovering durable Problem, Governance, and Solution knowledge from existing repository evidence while preserving material uncertainty.

Relationships:

- Satisfies: [REQ-006 — Incremental brownfield reconstruction](../problem/knowledge-reconstruction-and-learning.md#req-006).

#### Responsibilities

Uses shared Responsibilities RESP-002, RESP-003 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-003"></a>

### CAP-003 — Finding-to-knowledge learning

Provide a workflow for analyzing an observed finding and recording a reusable governance obligation or requirement only when its root cause and scope justify generalization.

Relationships:

- Satisfies: [REQ-007 — Evidence-based durable learning](../problem/knowledge-reconstruction-and-learning.md#req-007).

#### Responsibilities

Uses shared Responsibilities RESP-002, RESP-003 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

### Shared Architecture

#### Responsibilities

<a id="resp-002"></a>

##### RESP-002 — Workflow-Skill sequencing

Realizes: CAP-002 and CAP-003

Provide user-invoked workflow Skills that define ordered phases and required outcomes for reconstruction and learning work.

<a id="resp-003"></a>

##### RESP-003 — Reusable activity guidance

Realizes: CAP-002 and CAP-003

Provide concise methods for collecting context, tracing change effects, implementing with TDD when applicable, and verifying completed work. The change impact method follows [DEC-003 — Small, evidence-driven Skill set](change-lifecycle-and-methods.md#dec-003); finding root-cause and generalization analysis remain workflow outcomes rather than responsibilities of that method.

#### Components and Boundaries

- **User-invoked workflow Skills in `.scaffold/skills/`** are assigned-to RESP-002. Their `agents/openai.yaml` interfaces expose project-work lifecycle sequencing, including `reconstruct-project-knowledge` and `learn-from-finding`.
- **Model-invoked Skills in `.scaffold/skills/`** are assigned-to RESP-003. They omit an interface and supply reusable methods in the candidate bundle; initialization materializes them locally for active use.
- The installed package distributes its bundled `.scaffold/` artifacts to other projects. Initialization copies them into the target project's own `.scaffold/` and creates target-specific metadata. That target-local Harness remains the sole active authority; the installed bundle remains only an initialization and update-review candidate for that project.

## Satisfies

- CAP-004 — Package candidate and starter artifact provision satisfies:
  - [REQ-017 — Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#req-017)
- CAP-002 — Evidence-based knowledge reconstruction satisfies:
  - [REQ-006 — Incremental brownfield reconstruction](../problem/knowledge-reconstruction-and-learning.md#req-006)
- CAP-003 — Finding-to-knowledge learning satisfies:
  - [REQ-007 — Evidence-based durable learning](../problem/knowledge-reconstruction-and-learning.md#req-007)

## Design and Decisions

<a id="dec-001"></a>

### DEC-001 — Schema-selected template applicability

The active Knowledge Schema determines the project knowledge representation and which template types apply. Templates are starting structures only and do not independently impose a project knowledge layout.

The target Schema must select a lightweight Project Context representation for project-wide orientation: top-level purpose, goals, domain terms or glossary, scope and exclusions, and material unknowns. Project Context is a representation record, not a Knowledge Model concept or fourth semantic space. It must not use the Problem-document structure or represent Actors, Use Cases, Requirements, or Acceptance Criteria; Goals remain Problem-space concepts even when recorded for orientation in Project Context.

The target Schema and Problem template must also make each Problem document a record of one coherent subject. A document is extended only when added knowledge concerns that same subject; a different subject receives a new Problem document. Shared project purpose, goals, actors, dependencies, implementation areas, or repository layout do not establish document containment. Any material connection between documents is recorded explicitly using the Schema's relationship representation.

Relationships:

- Related-to: [CAP-001 — Durable knowledge separation](knowledge-architecture.md#cap-001).
- Related-to: [CAP-002 — Deliberate guidance authority](knowledge-architecture.md#cap-002).

<a id="dec-002"></a>

### DEC-002 — Workflow Skills sequence; model-invoked Skills advise

User-invoked workflow Skills own ordered phases, phase intent, and required outcomes. Model-invoked Skills are reusable methods that a workflow Skill may use and Project Rules may require, but they do not replace workflow sequencing.

<a id="dec-003"></a>

### DEC-003 — Superseded: pending candidate-bundle materialization

Superseded by DEC-006 — One source for active and distributed Harness artifacts. This historical implementation-stage note is no longer an active description of the package layout.

<a id="dec-004"></a>

### DEC-004 — Project Context representation

The candidate Schema, Project Context template, Problem template guidance, and initialization guidance represent the accepted Project Context and coherent-Problem-document design. The active Knowledge Model remains unchanged: it retains the three semantic spaces and defines Goals as Problem-space concepts. An initialized project's active local Harness may replace that representation deliberately through its Schema and selected templates.

Relationships:

- Related-to: [REQ-014 — Foundational Project Context baseline](../problem/scaffold-product.md#req-014).

<a id="dec-005"></a>

### DEC-005 — Reconstruction separates domain evidence from representation

Realizes: RESP-002 — Workflow-Skill sequencing.

The reconstruction workflow applies the active `core.knowledge-space-partition` Rule to shared terminology and implementation evidence, using the classification design in [DEC-006 — Policy-guided partitioning without a semantic CLI validator](knowledge-architecture.md#dec-006). Its evidence analysis must distinguish support for a stakeholder term, support for its domain meaning and intended behavior, and evidence of technical realization; these are not interchangeable. Established implementation-origin vocabulary can be retained without accepting the surrounding state machine as business intent. Unsupported meanings or obligations retain the existing Inferred or Unknown treatment and required owner review. The partition Rule and reconstruction Skill carry this guidance; their presence does not by itself demonstrate a successful agent-run reconstruction scenario.

Relationships:

- DEC-005 is constrained by [REQ-019 — Operational knowledge-space partitioning](../problem/knowledge-authority-and-customization.md#req-019).

<a id="dec-006"></a>

### DEC-006 — One source for active and distributed Harness artifacts

Realizes: RESP-001 — Candidate artifact stewardship.

Maintain the distributable Harness directly in this repository's `.scaffold/`, replacing the separate root `defaults/` and `skills/` copies. Coding agents otherwise have to distinguish the guidance to edit from an identical copy they must follow, creating wrong-location edits and synchronization work. One maintained file per artifact removes that distinction here; the same Skill, Rule, Model, Schema, Template, or guide is followed locally and shipped.

The trade-off is deliberate coupling: changing distributed guidance changes this repository's active guidance immediately. The shared source must therefore remain suitable for distribution. Practices specific to developing Scaffold belong in repository instructions outside the distributed artifact set. Local metadata is excluded from distribution and artifact comparison; each target project owns its reviewed-version and installation state.

Initialization and update comparison read the package's `.scaffold/` artifact set. Other projects still receive independent local copies and retain deliberate customization and update adoption. Consolidation changes the source layout, not downstream runtime authority or update-merge behavior. Agent discovery continues linking workflow Skills from each project's `.scaffold/skills/`.

The package contains its own CLI implementation and candidate Harness. It does not depend on another packaged copy of itself or a repository-local tarball to operate. The package manifest and lockfile describe the same package identity and dependency set; archived earlier versions remain historical snapshots rather than current artifact authorities.

<a id="dec-007"></a>

### DEC-007 — Lean templates with explicit local relationships

Realizes: RESP-001 — Candidate artifact stewardship.

The default Problem representation requires Requirements and Acceptance Criteria. Intent and Actors and Goals are optional sections that may be omitted when they add no useful subject-specific context; when present they retain the template order. Important motivation, scope, actor differences, and requirement origins remain available even when a section is omitted. Use Cases has no fixed section: useful externally meaningful interaction context remains near Intent or the relevant Requirements. This is a representation change and retains the Knowledge Model's Use Case concept and Acceptance Criteria ownership semantics.

The default Solution representation groups Capabilities, Responsibilities, and Components and Boundaries under Capabilities and Architecture. Each CAP may carry Responsibilities and Components and Boundaries subsections. Shared Architecture records cross-CAP responsibilities, components, or interfaces once; CAP-local references preserve their many-to-many assignments. Presentation beneath a CAP does not establish exclusive ownership. Responsibilities retain their distinction from concrete Components, and material interfaces and interaction boundaries remain explicit.

Problem and Solution documents omit the Related Knowledge section. Their useful relationships move beside the relevant Requirements, Capabilities, Responsibilities, Designs, or Decisions with precise relationship statements where known; removal of a section does not remove its durable relationships. Governance representation remains unchanged. Satisfies, Design and Decisions, and Verification Items remain separate Solution sections.

This choice reduces repetitive context and reading across distant sections. Compared with mandatory empty headings and independent capability/responsibility/component lists, it keeps each capability's realization close to its meaning. The trade-off is a deliberate need to identify shared architecture rather than duplicate it under each capability. Existing knowledge is reorganized while preserving its meaning, stable IDs, references, and useful interaction context; the Knowledge Model is unchanged and no semantic migration Crosswalk is needed for this reorganization.

<a id="dec-008"></a>

### DEC-008 — Relative-path references with local object anchors

The selected default Schema removes document-ID declarations and uses descriptive repository file paths as document locators. Cross-document references are Markdown links relative to the referring file; a whole-document link has no fragment, and an object link uses its stable local-ID anchor. Object numbering remains document-local. Explicit lowercase HTML anchors such as `<a id="req-001"></a>` precede identified objects so title edits do not change the fragment. Same-document references may use the local ID alone or a fragment link. The full representation and migration responsibility allocation is defined in [DEC-001](knowledge-reference-lifecycle.md#dec-001) and [DEC-002](knowledge-reference-lifecycle.md#dec-002).

Update the Schema, all selected templates, and agent guide consistently; remove document-number allocation instructions. Preserve the lean template structure and explicit relationship placement selected by DEC-007. The Knowledge Model and its concepts, relationship meanings, and ownership invariants are unchanged. [Reference Representation Migration Crosswalk](../governance/reference-representation-migration.md) records the source-to-target represented-field Crosswalk; it is a migration aid, not a second active Schema or an automatic rewriting authority.

The default Schema, selected templates, and agent guide implement this representation. Adoption follows design knowledge reconciliation, artifact implementation, then existing knowledge-format migration under [DEC-003](knowledge-reference-lifecycle.md#dec-003). The linked Verification Items retain their evidence expectations.

## Verification Items

<a id="ver-001"></a>

### VER-001 — Materialized Markdown guidance availability

Verifies:

- [AC-019 — Materialized guidance remains usable as Markdown](../problem/knowledge-reconstruction-and-learning.md#ac-019).

Scope:

- availability of human-readable package candidate artifacts materialized into the active local Harness.

Expected evidence:

- The package exposes the candidate artifacts and Skills, including user-invoked workflow interfaces and model-invoked methods, for initialization and update comparison.

<a id="ver-002"></a>

### VER-002 — Brownfield reconstruction preserves confidence

Verifies:

- [AC-013 — Brownfield knowledge is reconstructed with warranted confidence](../problem/knowledge-reconstruction-and-learning.md#ac-013).

Scope:

- evidence and uncertainty treatment during reconstruction, including shared terms originating in implementation and ambiguous code-only states.

Expected evidence:

- reconstruction guidance preserves evidence, scope, and uncertainty;
- established stakeholder terms retain their agreed meanings with the partitioning required by [REQ-019](../problem/knowledge-authority-and-customization.md#req-019), while current internal identifiers, enums, and transitions are not promoted to business obligations solely from code or shared usage; and
- unsupported domain meanings and intended lifecycle behavior remain Inferred or Unknown even when names are familiar or have been reworded.

<a id="ver-003"></a>

### VER-003 — Findings are generalized with justified scope

Verifies:

- [AC-018 — Findings become durable knowledge only with justified scope](../problem/knowledge-reconstruction-and-learning.md#ac-018).

Scope:

- evidence-based conversion of a finding into durable knowledge.

Expected evidence:

- learning guidance requires analysis before a finding becomes a Control, Constraint, or Requirement.

<a id="ver-004"></a>

### VER-004 — Packaged Harness initializes from the single maintained source

Verifies:

- [AC-023 — Initialization materializes active guidance](../problem/knowledge-authority-and-customization.md#ac-023).

Scope:

- the boundary from this repository's maintained `.scaffold/` artifacts through the actual package archive to initialization in another repository.

Expected evidence:

- the archive contains the complete distributable Harness from `.scaffold/`, including workflow interfaces and model-invoked Skills, without root `defaults/` or `skills/` duplicates or this repository's `metadata.md`, and its manifest requires no self-dependency or repository-local archive;
- initialization using the extracted package materializes the same artifacts in the target project's `.scaffold/`, generates target-specific metadata, and links workflow discovery to the target-local Skills; and
- artifact comparison excludes local metadata and reports changes against the bundled Harness without modifying the target's guidance.
