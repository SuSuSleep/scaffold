# Knowledge Authority and Customization

Document ID: PROB-002

## Intent

Scaffold must let projects customize knowledge and operational guidance deliberately without implicitly combining incompatible sources of authority.

## Actors and Goals

- **Project owner**: tailor the materialized active Harness and decide which package candidates to adopt during an update review.
- **Developer or coding agent**: resolve the project-local knowledge and guidance authorities correctly before meaningful work.

## Use Cases

- `init` materializes the necessary Harness guidance in a project-local location.
- Scaffold resolves active guidance only from the project's materialized Harness.
- A project reviews installed-package artifact candidates and deliberately selects changes to adopt or adapt.
- A project routes an accepted artifact change through the appropriate evolution Workflow.

## Requirements

### REQ-002 — Superseded: explicit artifact resolution

Superseded by REQ-016 — Project-local active Harness authority. This historical requirement described local replacement of a shared runtime artifact. The materialized-local Harness has no shared runtime artifact to replace, so REQ-002 is not an active runtime obligation.

### REQ-003 — Superseded: replaceable knowledge model

Superseded by REQ-016 — Project-local active Harness authority. This historical requirement described the former installed-default fallback and shared-plus-local Rule behavior. It is not an active runtime obligation.

### REQ-011 — Superseded: extensible Project Rule collection

Superseded by REQ-018 — Project-local Project Rule collection. This historical requirement described the former shared-plus-local Rule collection. It is not an active runtime obligation.

### REQ-013 — Authority-safe artifact evolution

The Harness must support deliberate evolution of full-replacement artifacts and route accepted changes to the appropriate downstream Workflow without allowing an artifact to override a different authority domain.

### REQ-016 — Project-local active Harness authority

The active Harness is a complete project-local artifact set. Its Knowledge Model, Knowledge Schema, Skills, Templates, Project Rules, and agent guide are authoritative at runtime; shared package content is never a runtime fallback or co-authority. The active Model is the sole authority for concept and relationship meaning; the active Schema defines only representation.

### REQ-017 — Materialized Harness initialization

Initialization must materialize all necessary active Harness guidance into `.scaffold/`: Knowledge Model, Knowledge Schema, Skills, Templates, Project Rules, and agent guide. The installed package distributes a candidate starter bundle for initialization and update comparison but does not supply active guidance after initialization.

### REQ-018 — Project-local Project Rule collection

The Harness must represent Project Rules as the project's categorized local collection. Rules retain stable identities and applicability, but no shared-plus-local collection, shadowing, or same-identity replacement behavior applies at runtime.

### REQ-015 — Deliberate Knowledge Model migration mapping

When a project replaces its Knowledge Model, the Harness must support a project-owned, reviewable crosswalk between source and target concepts or relationships. When a Schema replacement requires represented-field migration, the crosswalk must identify the source and target Schemas that own those fields. Every entry must state mapping kind, cardinality, identity and reference treatment, migration disposition, and unresolved ambiguity without making both Models active or automating semantic migration.

### REQ-019 — Operational knowledge-space partitioning

When creating or changing Project Knowledge, the Harness must make agents treat the active Knowledge Model's knowledge-space partitioning as operating policy: classify each claim as Project Context, Problem, Governance, or Solution before recording it; use the active Project Rules as the authority for how that work is performed; and retain explicit relationships between the resulting records. A claim that combines an externally meaningful behavior with an implementation consequence must establish or reuse the Problem obligation and observable acceptance first, then link the Solution knowledge that realizes it. Governance may derive a Problem obligation or constrain Solution knowledge directly according to applicability. A pure technical decision remains Solution-only unless it changes an external obligation or outcome, and classification must not manufacture Problem records solely to complete a partition.
## Acceptance Criteria


### AC-010 — Superseded: full-replacement artifacts resolve explicitly

Historical acceptance criterion for superseded REQ-002. Superseded by AC-022 — Active artifacts resolve project-locally; it is not an active acceptance target.

### AC-011 — Superseded: the active Knowledge Model resolves explicitly

Historical acceptance criterion for superseded REQ-003. Superseded by AC-022 — Active artifacts resolve project-locally; it is not an active acceptance target.

### AC-012 — Superseded: Project Rules form an effective collection

Historical acceptance criterion for superseded REQ-011. Superseded by AC-024 — Project Rules are locally authoritative; it is not an active acceptance target.

### AC-017 — Artifact evolution preserves authority boundaries

For:

- REQ-013 — Authority-safe artifact evolution

Given:

- an accepted change affects a full-replacement artifact.

When:

- the change is routed downstream.

Then:

- it uses the appropriate evolution path without allowing an artifact to override another authority domain.

### AC-022 — Active artifacts resolve project-locally

For:

- REQ-016 — Project-local active Harness authority

Given:

- a project has been initialized with its materialized Harness.

When:

- Scaffold resolves that artifact.

Then:

- Scaffold resolves the project-local artifact as active and does not use package content as an implicit fallback or merge source.

### AC-023 — Initialization materializes active guidance

For:

- REQ-017 — Materialized Harness initialization

Given:

- a repository is initialized with Scaffold.

When:

- initialization completes.

Then:

- the local Harness includes the Knowledge Model, Schema, Skills, Templates, Rules, and agent guide required for normal operation.

### AC-024 — Project Rules are locally authoritative

For:

- REQ-018 — Project-local Project Rule collection

Given:

- project-local Rules have stable identities.

When:

- Scaffold resolves the active Rule set.

Then:

- the project resolves its local Rule collection without combining it with installed package Rules.

### AC-021 — Knowledge Model migration is mapped deliberately

For:

- REQ-015 — Deliberate Knowledge Model migration mapping

Given:

- a project replaces a Knowledge Model with concepts or relationships that require adaptation, or replaces a Schema with represented fields that require adaptation.

When:

- it prepares the migration.

Then:

- it records a reviewable crosswalk with source and target Models for semantic mappings and source and target Schemas for represented-field mappings, plus mapping kinds and cardinalities, identity and reference treatment, migration disposition, and unresolved ambiguity; no automatic semantic rewrite occurs.

### AC-025 — Knowledge claims are partitioned before recording

For:

- REQ-019 — Operational knowledge-space partitioning

Given:

- an agent is creating or changing one or more durable Project Knowledge claims.

When:

- it prepares the affected records under the active Harness.

Then:

- it classifies every claim as Project Context, Problem, Governance, or Solution before recording it and applies the active Project Rules as policy authority for that work;
- for a mixed behavior-and-implementation claim, it establishes or reuses the Problem obligation and an observable acceptance criterion before linking the realizing Solution knowledge;
- it records applicable Governance as a source of a Problem obligation or as a direct Solution constraint, rather than forcing either form; and
- it leaves a pure technical decision in Solution unless an external obligation or outcome changes, without creating an artificial Problem record.


## Related Knowledge

- SOL-003#CAP-001 — Durable knowledge separation.
- SOL-001#CAP-005 — Materialized Harness lifecycle management.
- SOL-002#CAP-004 — Package candidate and starter artifact provision.
- SOL-003#CAP-002 — Deliberate guidance authority.
- SOL-003#CAP-003 — Deliberate model migration mapping.
- GOV-002#CON-003 — Durable source-of-truth boundaries.
- REQ-016 supersedes REQ-002; AC-022 supersedes AC-010.
- REQ-016 supersedes REQ-003; AC-022 supersedes AC-011.
- REQ-018 supersedes REQ-011; AC-024 supersedes AC-012.
- The superseded records remain only as historical traceability. Active design, implementation, and verification target REQ-016 through REQ-019 and their current Acceptance Criteria.
