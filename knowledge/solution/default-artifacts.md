# Package Candidate and Starter Artifacts

> Design basis: project-owner approval of the single-source Harness consolidation, 2026-11-13. [`.scaffold/`](../../.scaffold/) contains the active artifacts; [`src/project.js`](../../src/project.js), [`package.json`](../../package.json), and [`test/cli.test.js`](../../test/cli.test.js) are the affected distribution, lifecycle, and verification boundaries. The consolidation is implemented in these boundaries; package contents and extracted-package initialization were verified on 2026-11-13.

## Capabilities and Architecture

<a id="superseded-shared-guidance-artifact-provision"></a>

### Superseded: shared guidance artifact provision

Superseded by [Package candidate and starter artifact provision](#package-candidate-and-starter-artifact-provision). This historical capability described package guidance as active runtime provision; it is not an active solution capability.

<a id="package-candidate-and-starter-artifact-provision"></a>

### Package candidate and starter artifact provision

Provide a Markdown-readable Harness bundle that initializes a project's local active artifacts and serves as the installed-package candidate set for update comparison.

Relationships:

- Satisfies: [Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#materialized-harness-initialization).
- Related-to: [Usable Markdown-first guidance](../problem/knowledge-reconstruction-and-learning.md#usable-markdown-first-guidance).
- Related-to: [Markdown-first core operation](../governance/product-operating-boundaries.md#markdown-first-core-operation).
- [Package candidate and starter artifact provision](#package-candidate-and-starter-artifact-provision) supersedes [Superseded: shared guidance artifact provision](#superseded-shared-guidance-artifact-provision). [Superseded: shared guidance artifact provision](#superseded-shared-guidance-artifact-provision) remains as historical traceability only; package artifacts are candidates for initialization and update review rather than active runtime guidance.

#### Responsibilities

<a id="candidate-artifact-stewardship"></a>

##### Candidate artifact stewardship

Realizes: [Package candidate and starter artifact provision](#package-candidate-and-starter-artifact-provision)

Maintain the package's candidate Knowledge Model, representation Schema, categorized Rules, document templates, Skills, and agent guide as a starter bundle, without making them runtime authority for initialized projects. The candidate Schema and templates must be able to represent the Project Context baseline and coherent Problem documents required by [Foundational Project Context baseline](../problem/scaffold-product.md#foundational-project-context-baseline), and the bundle must guide the explicit hybrid responsibility allocation required by [Explicit hybrid responsibility allocation](../problem/hybrid-system-architecture.md#explicit-hybrid-responsibility-allocation).

Relationships:

- Related-to: [Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#project-local-active-harness-authority).
- Related-to: [Hybrid responsibility architecture](hybrid-agent-tool-architecture.md#hybrid-responsibility-architecture).
- Related-to: [Explicit hybrid responsibility allocation](../problem/hybrid-system-architecture.md#explicit-hybrid-responsibility-allocation).

#### Components and Boundaries

- **The Scaffold repository's `.scaffold/`** is assigned-to [Candidate artifact stewardship](#candidate-artifact-stewardship). Its agent guide, Knowledge Model, Schema, categorized `rules/`, templates, and `skills/` are both the active Harness for developing Scaffold and the single maintained source of its distributed starter bundle. There are no separate root `defaults/` or `skills/` copies. The package includes these distributable artifacts and excludes this repository's local `metadata.md`.

See Shared Architecture for component assignments and interaction boundaries.

<a id="evidence-based-knowledge-reconstruction"></a>

### Evidence-based knowledge reconstruction

Provide a workflow for recovering durable Problem, Governance, and Solution knowledge from existing repository evidence while preserving material uncertainty.

Relationships:

- Satisfies: [Incremental brownfield reconstruction](../problem/knowledge-reconstruction-and-learning.md#incremental-brownfield-reconstruction).

#### Responsibilities

Uses shared Responsibilities [Workflow-Skill sequencing](#workflow-skill-sequencing), [Reusable activity guidance](#reusable-activity-guidance) defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="finding-to-knowledge-learning"></a>

### Finding-to-knowledge learning

Provide a workflow for analyzing an observed finding and recording a reusable governance obligation or requirement only when its root cause and scope justify generalization.

Relationships:

- Satisfies: [Evidence-based durable learning](../problem/knowledge-reconstruction-and-learning.md#evidence-based-durable-learning).

#### Responsibilities

Uses shared Responsibilities [Workflow-Skill sequencing](#workflow-skill-sequencing), [Reusable activity guidance](#reusable-activity-guidance) defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

### Shared Architecture

#### Responsibilities

<a id="workflow-skill-sequencing"></a>

##### Workflow-Skill sequencing

Realizes: [Evidence-based knowledge reconstruction](#evidence-based-knowledge-reconstruction) and [Finding-to-knowledge learning](#finding-to-knowledge-learning)

Provide user-invoked workflow Skills that define ordered phases and required outcomes for reconstruction and learning work.

<a id="reusable-activity-guidance"></a>

##### Reusable activity guidance

Realizes: [Evidence-based knowledge reconstruction](#evidence-based-knowledge-reconstruction) and [Finding-to-knowledge learning](#finding-to-knowledge-learning)

Provide concise methods for collecting context, tracing change effects, implementing with TDD when applicable, and verifying completed work. The change impact method follows [Small, evidence-driven Skill set](change-lifecycle-and-methods.md#small-evidence-driven-skill-set); finding root-cause and generalization analysis remain workflow outcomes rather than responsibilities of that method.

#### Components and Boundaries

- **User-invoked workflow Skills in `.scaffold/skills/`** are assigned-to [Workflow-Skill sequencing](#workflow-skill-sequencing). Their `agents/openai.yaml` interfaces expose project-work lifecycle sequencing, including `reconstruct-project-knowledge` and `learn-from-finding`.
- **Model-invoked Skills in `.scaffold/skills/`** are assigned-to [Reusable activity guidance](#reusable-activity-guidance). They omit an interface and supply reusable methods in the candidate bundle; initialization materializes them locally for active use.
- The installed package distributes its bundled `.scaffold/` artifacts to other projects. Initialization copies them into the target project's own `.scaffold/` and creates target-specific metadata. That target-local Harness remains the sole active authority; the installed bundle remains only an initialization and update-review candidate for that project.

## Satisfies

- [Package candidate and starter artifact provision](#package-candidate-and-starter-artifact-provision) satisfies:
  - [Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#materialized-harness-initialization)
- [Evidence-based knowledge reconstruction](#evidence-based-knowledge-reconstruction) satisfies:
  - [Incremental brownfield reconstruction](../problem/knowledge-reconstruction-and-learning.md#incremental-brownfield-reconstruction)
- [Finding-to-knowledge learning](#finding-to-knowledge-learning) satisfies:
  - [Evidence-based durable learning](../problem/knowledge-reconstruction-and-learning.md#evidence-based-durable-learning)

## Design and Decisions

The entries in this section are Decisions; explicitly superseded entries remain historical.

<a id="schema-selected-template-applicability"></a>

### Schema-selected template applicability

The active Knowledge Schema determines the project knowledge representation and which template types apply. Templates are starting structures only and do not independently impose a project knowledge layout.

The target Schema must select a lightweight Project Context representation for project-wide orientation: top-level purpose, goals, domain terms or glossary, scope and exclusions, and material unknowns. Project Context is a representation record, not a Knowledge Model concept or fourth semantic space. It must not use the Problem-document structure or represent Actors, Use Cases, Requirements, or Acceptance Criteria; Goals remain Problem-space concepts even when recorded for orientation in Project Context.

The target Schema and Problem template must also make each Problem document a record of one coherent subject. A document is extended only when added knowledge concerns that same subject; a different subject receives a new Problem document. Shared project purpose, goals, actors, dependencies, implementation areas, or repository layout do not establish document containment. Any material connection between documents is recorded explicitly using the Schema's relationship representation.

Relationships:

- Related-to: [Durable knowledge separation](knowledge-architecture.md#durable-knowledge-separation).
- Related-to: [Deliberate guidance authority](knowledge-architecture.md#deliberate-guidance-authority).

<a id="workflow-skills-sequence-model-invoked-skills-advise"></a>

### Workflow Skills sequence; model-invoked Skills advise

User-invoked workflow Skills own ordered phases, phase intent, and required outcomes. Model-invoked Skills are reusable methods that a workflow Skill may use and Project Rules may require, but they do not replace workflow sequencing.

<a id="superseded-pending-candidate-bundle-materialization"></a>

### Superseded: pending candidate-bundle materialization

Superseded by [One source for active and distributed Harness artifacts](#one-source-for-active-and-distributed-harness-artifacts). This historical implementation-stage note is no longer an active description of the package layout.

<a id="project-context-representation"></a>

### Project Context representation

The candidate Schema, Project Context template, Problem template guidance, and initialization guidance represent the accepted Project Context and coherent-Problem-document design. The active Knowledge Model remains unchanged: it retains the three semantic spaces and defines Goals as Problem-space concepts. An initialized project's active local Harness may replace that representation deliberately through its Schema and selected templates.

Relationships:

- Related-to: [Foundational Project Context baseline](../problem/scaffold-product.md#foundational-project-context-baseline).

<a id="reconstruction-separates-domain-evidence-from-representation"></a>

### Reconstruction separates domain evidence from representation

Realizes: [Workflow-Skill sequencing](#workflow-skill-sequencing).

The reconstruction workflow applies the active `core.knowledge-space-partition` Rule to shared terminology and implementation evidence, using the classification design in [Policy-guided partitioning without a semantic CLI validator](knowledge-architecture.md#policy-guided-partitioning-without-a-semantic-cli-validator). Its evidence analysis must distinguish support for a stakeholder term, support for its domain meaning and intended behavior, and evidence of technical realization; these are not interchangeable. Established implementation-origin vocabulary can be retained without accepting the surrounding state machine as business intent. Unsupported meanings or obligations retain the existing Inferred or Unknown treatment and required owner review. The partition Rule and reconstruction Skill carry this guidance; their presence does not by itself demonstrate a successful agent-run reconstruction scenario.

Relationships:

- [Reconstruction separates domain evidence from representation](#reconstruction-separates-domain-evidence-from-representation) is constrained by [Operational knowledge-space partitioning](../problem/knowledge-authority-and-customization.md#operational-knowledge-space-partitioning).

<a id="one-source-for-active-and-distributed-harness-artifacts"></a>

### One source for active and distributed Harness artifacts

Realizes: [Candidate artifact stewardship](#candidate-artifact-stewardship).

Maintain the distributable Harness directly in this repository's `.scaffold/`, replacing the separate root `defaults/` and `skills/` copies. Coding agents otherwise have to distinguish the guidance to edit from an identical copy they must follow, creating wrong-location edits and synchronization work. One maintained file per artifact removes that distinction here; the same Skill, Rule, Model, Schema, Template, or guide is followed locally and shipped.

The trade-off is deliberate coupling: changing distributed guidance changes this repository's active guidance immediately. The shared source must therefore remain suitable for distribution. Practices specific to developing Scaffold belong in repository instructions outside the distributed artifact set. Local metadata is excluded from distribution and artifact comparison; each target project owns its reviewed-version and installation state.

Initialization and update comparison read the package's `.scaffold/` artifact set. Other projects still receive independent local copies and retain deliberate customization and update adoption. Consolidation changes the source layout, not downstream runtime authority or update-merge behavior. Agent discovery continues linking workflow Skills from each project's `.scaffold/skills/`.

The package contains its own CLI implementation and candidate Harness. It does not depend on another packaged copy of itself or a repository-local tarball to operate. The package manifest and lockfile describe the same package identity and dependency set; archived earlier versions remain historical snapshots rather than current artifact authorities.

<a id="lean-templates-with-explicit-local-relationships"></a>

### Lean templates with explicit local relationships

Realizes: [Candidate artifact stewardship](#candidate-artifact-stewardship).

The default Problem representation requires Requirements and Acceptance Criteria. Intent and Actors and Goals are optional sections that may be omitted when they add no useful subject-specific context; when present they retain the template order. Important motivation, scope, actor differences, and requirement origins remain available even when a section is omitted. Use Cases has no fixed section: useful externally meaningful interaction context remains near Intent or the relevant Requirements. This is a representation change and retains the Knowledge Model's Use Case concept and Acceptance Criteria ownership semantics.

The default Solution representation groups Capabilities, Responsibilities, and Components and Boundaries under Capabilities and Architecture. Each Capability may carry Responsibilities and Components and Boundaries subsections. Shared Architecture records responsibilities, components, or interfaces shared across Capabilities once; Capability-local references preserve their many-to-many assignments. Presentation beneath a Capability does not establish exclusive ownership. Responsibilities retain their distinction from concrete Components, and material interfaces and interaction boundaries remain explicit.

Problem and Solution documents omit the Related Knowledge section. Their useful relationships move beside the relevant Requirements, Capabilities, Responsibilities, Designs, or Decisions with precise relationship statements where known; removal of a section does not remove its durable relationships. Governance representation remains unchanged. Satisfies, Design and Decisions, and Verification Items remain separate Solution sections.

This choice reduces repetitive context and reading across distant sections. Compared with mandatory empty headings and independent capability/responsibility/component lists, it keeps each capability's realization close to its meaning. The trade-off is a deliberate need to identify shared architecture rather than duplicate it under each capability. Existing knowledge is reorganized while preserving its meaning and useful interaction context and repairing references under the active Schema; the Knowledge Model is unchanged and no semantic migration Crosswalk is needed for this reorganization.

<a id="superseded-relative-paths-with-numeric-object-anchors"></a>

### Superseded: relative paths with numeric object anchors

Superseded by [Descriptive document and object locations](#descriptive-document-and-object-locations). The previous Schema removed document IDs but retained document-local numeric objects and title-independent anchors. It remains historical representation context; the selected target locates objects by descriptive titles and repairs references when those titles change.

<a id="descriptive-document-and-object-locations"></a>

### Descriptive document and object locations

Realizes: [Candidate artifact stewardship](#candidate-artifact-stewardship).

The selected default Schema uses descriptive document paths and descriptive object headings without allocated document or object IDs. Referenceable objects use the title-derived fragment convention in [Descriptive headings determine object locators](knowledge-reference-lifecycle.md#descriptive-headings-determine-object-locators); explicit derived anchors make that locator available across renderers. Anchors are regenerated from title changes, with affected references repaired. Same-document titles and fragments must be unambiguous, while the same title may occur in different files.

Update Schema, selected templates, guide, README, and the existing `migrate-references` Skill together. The Skill's conflict assessment follows [Conflict-aware mapping retains source provenance](knowledge-reference-lifecycle.md#conflict-aware-mapping-retains-source-provenance), covering both document and object collisions, semantic duplication, provenance, and unresolved contradictions. Preserve the lean template structure and material relationship placement from [Lean templates with explicit local relationships](#lean-templates-with-explicit-local-relationships), and keep Model concept kinds and ownership explicit through sections or concept labels. This changes representation and Skill behavior without changing the Knowledge Model.

Design reconciliation precedes artifact implementation and then existing knowledge-format migration. [The represented-field Crosswalk](../governance/reference-representation-migration.md#numeric-local-objects-to-descriptive-title-derived-locators) distinguishes this target from the prior document-ID migration. The active artifacts and knowledge representation use descriptive titles and title-derived anchors; the design decision does not itself establish completed verification.

## Verification Items

<a id="materialized-markdown-guidance-availability"></a>

### Materialized Markdown guidance availability

Verifies:

- [Materialized guidance remains usable as Markdown](../problem/knowledge-reconstruction-and-learning.md#materialized-guidance-remains-usable-as-markdown).

Scope:

- availability of human-readable package candidate artifacts materialized into the active local Harness.

Expected evidence:

- The package exposes the candidate artifacts and Skills, including user-invoked workflow interfaces and model-invoked methods, for initialization and update comparison.

<a id="brownfield-reconstruction-preserves-confidence"></a>

### Brownfield reconstruction preserves confidence

Verifies:

- [Brownfield knowledge is reconstructed with warranted confidence](../problem/knowledge-reconstruction-and-learning.md#brownfield-knowledge-is-reconstructed-with-warranted-confidence).

Scope:

- evidence and uncertainty treatment during reconstruction, including shared terms originating in implementation and ambiguous code-only states.

Expected evidence:

- reconstruction guidance preserves evidence, scope, and uncertainty;
- established stakeholder terms retain their agreed meanings with the partitioning required by [Operational knowledge-space partitioning](../problem/knowledge-authority-and-customization.md#operational-knowledge-space-partitioning), while current internal identifiers, enums, and transitions are not promoted to business obligations solely from code or shared usage; and
- unsupported domain meanings and intended lifecycle behavior remain Inferred or Unknown even when names are familiar or have been reworded.

<a id="findings-are-generalized-with-justified-scope"></a>

### Findings are generalized with justified scope

Verifies:

- [Findings become durable knowledge only with justified scope](../problem/knowledge-reconstruction-and-learning.md#findings-become-durable-knowledge-only-with-justified-scope).

Scope:

- evidence-based conversion of a finding into durable knowledge.

Expected evidence:

- learning guidance requires analysis before a finding becomes a Control, Constraint, or Requirement.

<a id="packaged-harness-initializes-from-the-single-maintained-source"></a>

### Packaged Harness initializes from the single maintained source

Verifies:

- [Initialization materializes active guidance](../problem/knowledge-authority-and-customization.md#initialization-materializes-active-guidance).

Scope:

- the boundary from this repository's maintained `.scaffold/` artifacts through the actual package archive to initialization in another repository.

Expected evidence:

- the archive contains the complete distributable Harness from `.scaffold/`, including workflow interfaces and model-invoked Skills, without root `defaults/` or `skills/` duplicates or this repository's `metadata.md`, and its manifest requires no self-dependency or repository-local archive;
- initialization using the extracted package materializes the same artifacts in the target project's `.scaffold/`, generates target-specific metadata, and links workflow discovery to the target-local Skills; and
- artifact comparison excludes local metadata and reports changes against the bundled Harness without modifying the target's guidance.
