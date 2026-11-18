# Knowledge Authority and Customization

## Intent

Scaffold must let projects customize knowledge and operational guidance deliberately without implicitly combining incompatible sources of authority.

Interaction context:

- `init` materializes the necessary Harness guidance in a project-local location.
- Scaffold resolves active guidance only from the project's materialized Harness.
- A project reviews installed-package artifact candidates and deliberately selects changes to adopt or adapt.
- A project routes an accepted artifact change through the appropriate evolution Workflow.

## Actors and Goals

- **Project owner**: tailor the materialized active Harness and decide which package candidates to adopt during an update review.
- **Developer or coding agent**: resolve the project-local knowledge and guidance authorities correctly before meaningful work.

## Requirements

<a id="superseded-explicit-artifact-resolution"></a>

### Superseded: explicit artifact resolution

Superseded by [Project-local active Harness authority](#project-local-active-harness-authority). This historical requirement described local replacement of a shared runtime artifact. The materialized-local Harness has no shared runtime artifact to replace, so [Superseded: explicit artifact resolution](#superseded-explicit-artifact-resolution) is not an active runtime obligation.

<a id="superseded-replaceable-knowledge-model"></a>

### Superseded: replaceable knowledge model

Superseded by [Project-local active Harness authority](#project-local-active-harness-authority). This historical requirement described the former installed-default fallback and shared-plus-local Rule behavior. It is not an active runtime obligation.

<a id="superseded-extensible-project-rule-collection"></a>

### Superseded: extensible Project Rule collection

Superseded by [Project-local Project Rule collection](#project-local-project-rule-collection). This historical requirement described the former shared-plus-local Rule collection. It is not an active runtime obligation.

<a id="authority-safe-artifact-evolution"></a>

### Authority-safe artifact evolution

The Harness must support deliberate evolution of full-replacement artifacts and route accepted changes to the appropriate downstream Workflow without allowing an artifact to override a different authority domain.

<a id="project-local-active-harness-authority"></a>

### Project-local active Harness authority

The active Harness is a complete project-local artifact set. Its Knowledge Model, Knowledge Schema, Skills, Templates, Project Rules, and agent guide are authoritative at runtime; shared package content is never a runtime fallback or co-authority. The active Model is the sole authority for concept and relationship meaning; the active Schema defines only representation.

Relationships:

- Satisfied-by: [Deliberate guidance authority](../solution/knowledge-architecture.md#deliberate-guidance-authority).
- Related-to: [Durable source-of-truth boundaries](../governance/product-operating-boundaries.md#durable-source-of-truth-boundaries).
- [Project-local active Harness authority](#project-local-active-harness-authority) supersedes [Superseded: explicit artifact resolution](#superseded-explicit-artifact-resolution); [Active artifacts resolve project-locally](#active-artifacts-resolve-project-locally) supersedes [Superseded: full-replacement artifacts resolve explicitly](#superseded-full-replacement-artifacts-resolve-explicitly).
- [Project-local active Harness authority](#project-local-active-harness-authority) supersedes [Superseded: replaceable knowledge model](#superseded-replaceable-knowledge-model); [Active artifacts resolve project-locally](#active-artifacts-resolve-project-locally) supersedes [Superseded: the active Knowledge Model resolves explicitly](#superseded-the-active-knowledge-model-resolves-explicitly).
- The superseded records remain only as historical traceability. Active design, implementation, and verification target [Project-local active Harness authority](#project-local-active-harness-authority), [Materialized Harness initialization](#materialized-harness-initialization), [Project-local Project Rule collection](#project-local-project-rule-collection), and [Operational knowledge-space partitioning](#operational-knowledge-space-partitioning) and their current Acceptance Criteria.

<a id="materialized-harness-initialization"></a>

### Materialized Harness initialization

Initialization must materialize all necessary active Harness guidance into `.scaffold/`: Knowledge Model, Knowledge Schema, Skills, Templates, Project Rules, and agent guide. The installed package distributes a candidate starter bundle for initialization and update comparison but does not supply active guidance after initialization.

Relationships:

- Satisfied-by: [Materialized Harness lifecycle management](../solution/cli-and-guidance.md#materialized-harness-lifecycle-management).
- Satisfied-by: [Package candidate and starter artifact provision](../solution/default-artifacts.md#package-candidate-and-starter-artifact-provision).

<a id="project-local-project-rule-collection"></a>

### Project-local Project Rule collection

The Harness must represent Project Rules as the project's categorized local collection. Rules retain stable identities and applicability, but no shared-plus-local collection, shadowing, or same-identity replacement behavior applies at runtime.

Relationships:

- [Project-local Project Rule collection](#project-local-project-rule-collection) supersedes [Superseded: extensible Project Rule collection](#superseded-extensible-project-rule-collection); [Project Rules are locally authoritative](#project-rules-are-locally-authoritative) supersedes [Superseded: Project Rules form an effective collection](#superseded-project-rules-form-an-effective-collection).

<a id="deliberate-knowledge-model-migration-mapping"></a>

### Deliberate Knowledge Model migration mapping

When a project replaces its Knowledge Model, the Harness must support a project-owned, reviewable crosswalk between source and target concepts or relationships. When a Schema replacement requires represented-field migration, the crosswalk must identify the source and target Schemas that own those fields. Every entry must state mapping kind, cardinality, identity and reference treatment, migration disposition, and unresolved ambiguity without making both Models active or automating semantic migration.

Relationships:

- Satisfied-by: [Deliberate model migration mapping](../solution/knowledge-architecture.md#deliberate-model-migration-mapping).

<a id="operational-knowledge-space-partitioning"></a>

### Operational knowledge-space partitioning

When creating or changing Project Knowledge, the Harness must make agents treat the active Knowledge Model's knowledge-space partitioning as operating policy: classify each claim as Project Context, Problem, Governance, or Solution before recording it; use the active Project Rules as the authority for how that work is performed; and retain explicit relationships between the resulting records. A claim that combines an externally meaningful behavior with an implementation consequence must establish or reuse the Problem obligation and observable acceptance first, then link the Solution knowledge that realizes it. Governance may derive a Problem obligation or constrain Solution knowledge directly according to applicability. A pure technical decision remains Solution-only unless it changes an external obligation or outcome, and classification must not manufacture Problem records solely to complete a partition.

The Harness must distinguish shared domain terminology and observable meaning from technical representation, regardless of where a term originated. Under the default Schema, shared definitions belong once in Project Context's Domain Terms, intended behavior belongs in Problem requirements and acceptance criteria, and representations or mappings worth retaining for future reasoning belong in linked Solution knowledge. A Problem obligation may use a shared term without mandating an internal identifier, field, enum, or transition model. Knowledge impact must follow changes in domain meaning, intended behavior, applicable contracts, or durable technical knowledge; a vocabulary-only change updates definitions and references as appropriate without inventing a changed behavioral obligation. An external mandate for exact values must retain its source and applicability in Governance and derive requirements or constrain interfaces as appropriate.

Relationships:

- Satisfied-by: [Durable knowledge separation](../solution/knowledge-architecture.md#durable-knowledge-separation).
- [Operational knowledge-space partitioning](#operational-knowledge-space-partitioning) constrains [Incremental brownfield reconstruction](knowledge-reconstruction-and-learning.md#incremental-brownfield-reconstruction).
- [Operational knowledge-space partitioning](#operational-knowledge-space-partitioning) is constrained by [Durable knowledge update threshold](../governance/product-operating-boundaries.md#durable-knowledge-update-threshold).

## Acceptance Criteria

<a id="superseded-full-replacement-artifacts-resolve-explicitly"></a>

### Superseded: full-replacement artifacts resolve explicitly

Historical acceptance criterion for superseded [Superseded: explicit artifact resolution](#superseded-explicit-artifact-resolution). Superseded by [Active artifacts resolve project-locally](#active-artifacts-resolve-project-locally); it is not an active acceptance target.

<a id="superseded-the-active-knowledge-model-resolves-explicitly"></a>

### Superseded: the active Knowledge Model resolves explicitly

Historical acceptance criterion for superseded [Superseded: replaceable knowledge model](#superseded-replaceable-knowledge-model). Superseded by [Active artifacts resolve project-locally](#active-artifacts-resolve-project-locally); it is not an active acceptance target.

<a id="superseded-project-rules-form-an-effective-collection"></a>

### Superseded: Project Rules form an effective collection

Historical acceptance criterion for superseded [Superseded: extensible Project Rule collection](#superseded-extensible-project-rule-collection). Superseded by [Project Rules are locally authoritative](#project-rules-are-locally-authoritative); it is not an active acceptance target.

<a id="artifact-evolution-preserves-authority-boundaries"></a>

### Artifact evolution preserves authority boundaries

For:

- [Authority-safe artifact evolution](#authority-safe-artifact-evolution)

Given:

- an accepted change affects a full-replacement artifact.

When:

- the change is routed downstream.

Then:

- it uses the appropriate evolution path without allowing an artifact to override another authority domain.

<a id="active-artifacts-resolve-project-locally"></a>

### Active artifacts resolve project-locally

For:

- [Project-local active Harness authority](#project-local-active-harness-authority)

Given:

- a project has been initialized with its materialized Harness.

When:

- Scaffold resolves that artifact.

Then:

- Scaffold resolves the project-local artifact as active and does not use package content as an implicit fallback or merge source.

<a id="initialization-materializes-active-guidance"></a>

### Initialization materializes active guidance

For:

- [Materialized Harness initialization](#materialized-harness-initialization)

Given:

- a repository is initialized with Scaffold.

When:

- initialization completes.

Then:

- the local Harness includes the Knowledge Model, Schema, Skills, Templates, Rules, and agent guide required for normal operation.

<a id="project-rules-are-locally-authoritative"></a>

### Project Rules are locally authoritative

For:

- [Project-local Project Rule collection](#project-local-project-rule-collection)

Given:

- project-local Rules have stable identities.

When:

- Scaffold resolves the active Rule set.

Then:

- the project resolves its local Rule collection without combining it with installed package Rules.

<a id="knowledge-model-migration-is-mapped-deliberately"></a>

### Knowledge Model migration is mapped deliberately

For:

- [Deliberate Knowledge Model migration mapping](#deliberate-knowledge-model-migration-mapping)

Given:

- a project replaces a Knowledge Model with concepts or relationships that require adaptation, or replaces a Schema with represented fields that require adaptation.

When:

- it prepares the migration.

Then:

- it records a reviewable crosswalk with source and target Models for semantic mappings and source and target Schemas for represented-field mappings, plus mapping kinds and cardinalities, identity and reference treatment, migration disposition, and unresolved ambiguity; no automatic semantic rewrite occurs.

<a id="knowledge-claims-are-partitioned-before-recording"></a>

### Knowledge claims are partitioned before recording

For:

- [Operational knowledge-space partitioning](#operational-knowledge-space-partitioning)

Given:

- an agent is creating or changing one or more durable Project Knowledge claims.

When:

- it prepares the affected records under the active Harness.

Then:

- it classifies every claim as Project Context, Problem, Governance, or Solution before recording it and applies the active Project Rules as policy authority for that work;
- for a mixed behavior-and-implementation claim, it establishes or reuses the Problem obligation and an observable acceptance criterion before linking the realizing Solution knowledge;
- it records applicable Governance as a source of a Problem obligation or as a direct Solution constraint, rather than forcing either form;
- it leaves a pure technical decision in Solution unless an external obligation or outcome changes, without creating an artificial Problem record; and
- when claims use established shared terms, it keeps their shared definitions in the default Schema's Project Context / Domain Terms, uses the terms in Problem obligations according to their domain meanings, and links any durable technical representation or mapping in Solution without making that representation a business obligation solely through shared naming.

<a id="internal-representation-changes-preserve-domain-obligations"></a>

### Internal representation changes preserve domain obligations

For:

- [Operational knowledge-space partitioning](#operational-knowledge-space-partitioning)

Given:

- a project has accepted domain meanings, intended behavior, and applicable contracts.

When:

- an internal status identifier is renamed or an internal state is split without changing those meanings, behavior, or contracts.

Then:

- the change does not require a Problem-obligation change;
- any affected durable Solution representation or mapping is reconciled; and
- a mechanical change that makes no durable knowledge stale requires no knowledge update.

<a id="domain-changes-and-vocabulary-changes-have-distinct-impact"></a>

### Domain changes and vocabulary changes have distinct impact

For:

- [Operational knowledge-space partitioning](#operational-knowledge-space-partitioning)

Given:

- accepted knowledge records shared domain terms and intended lifecycle behavior.

When:

- stakeholders change the intended domain meaning or observable lifecycle, or only change the vocabulary used for the same meaning and behavior.

Then:

- a domain-meaning or observable-lifecycle change reconciles the affected requirements and acceptance criteria, together with dependent knowledge; and
- a vocabulary-only change updates the shared definition and affected references as appropriate without changing behavioral obligations solely because the name changed.

<a id="mandated-exact-values-remain-traceable-obligations"></a>

### Mandated exact values remain traceable obligations

For:

- [Operational knowledge-space partitioning](#operational-knowledge-space-partitioning)

Given:

- an identified external contract requires exact status values at an applicable boundary.

When:

- the related domain and implementation claims are classified.

Then:

- Governance retains the contract's source and applicability;
- derived requirements or constrained interfaces preserve the mandated values; and
- abstraction of implementation details does not remove or weaken that external obligation.
