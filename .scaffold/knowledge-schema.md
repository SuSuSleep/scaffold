# Default Knowledge Schema

## Purpose

This schema defines the default Markdown representation of durable project knowledge. Once materialized at `.scaffold/knowledge-schema.md`, this project-local Schema is the active representation authority. A project may deliberately replace it in full; no installed-package Schema is a runtime fallback or implicitly merged co-authority. The installed package supplies a candidate Schema for initialization and update review only. The active Knowledge Model defines the concepts and relationship semantics used here; this schema does not redefine them.

## Documents

The default representation stores durable knowledge in `knowledge/` using these locations:

- `problem/`: default Problem-document location.
- `project-context.md`: default Project Context record location.
- `solution/`: default Solution-document location.
- `governance/`: default Governance-document location.

These are default representation choices, not Knowledge Model concepts. Projects may replace this organization through their active Knowledge Schema.

## Structural Requirements

The default structural heading names and order are defined once, in the applicable standard template and incorporated here by reference:

- Problem documents: `templates/problem/standard.md`.
- Project Context records: `templates/project-context/standard.md`.
- Solution documents: `templates/solution/standard.md`.
- Governance documents: `templates/governance/standard.md`.

Every `##` heading in an applicable standard template is a **required structural section**, in the order shown, unless the heading is followed by the standalone comment `<!-- Optional section -->` (ignoring blank lines). A required section may remain empty when no applicable knowledge exists; its heading still provides deterministic document structure. An optional section may be omitted entirely when it adds no useful local context; when present, it retains its position in the template sequence. Optionality applies to the section, not to the preservation of material knowledge.

The standard templates are canonical structural manifests, not a second source of semantic meaning. They may provide template-local completion instructions that point to active-Model concepts; those instructions apply only to that template and must not redefine the concepts. Templates must retain the required heading sequence and the relative order of any included optional headings and must not introduce another required semantic section. Use this Schema for representation guidance and the active Knowledge Model for concept meaning.

Shared and project-local templates are organized by the knowledge space they start: `templates/problem/`, `templates/solution/`, and `templates/governance/`. `templates/project-context/` starts the project-wide orientation record; it does not introduce a fourth Knowledge Model space. This organization is a default representation choice; the active Knowledge Schema selects these standard templates as applicable and remains the authority for template applicability.

## Document Organization

The default representation uses one Project Context record for project-wide orientation. It records project purpose, top-level Goals, domain terms, scope or exclusions, and material unknowns. It is not a Problem document, does not own Actors, Use Cases, Requirements, or Acceptance Criteria, and creates no implicit containment relationship with other documents. Goals recorded there retain their active-Model Problem-space meaning.

Each Problem document represents one coherent subject. Extend a Problem document when added knowledge concerns that same subject; create a new Problem document when it concerns a different subject. Shared project purpose, Goals, Actors, dependencies, implementation areas, or repository layout do not by themselves establish document containment. Record material connections between documents explicitly using the relationship representation below.

Use stable identifiers for important knowledge objects when durable traceability is useful. Apply the identifier and reference conventions below; explicit relationship labels, Markdown links, and short relationship statements may supplement them.

## Identifiers and References

Identifiers, titles, and bodies have distinct roles:

```text
Identifier = stable identity
Title      = mutable semantic context
Body       = mutable authoritative meaning
```

### Identified Objects

An object that needs stable identity uses this format:

```text
<TYPE>-<LOCAL_NUMBER> — <DESCRIPTIVE_TITLE>
```

For example:

```markdown
<a id="req-001"></a>

### REQ-001 — Preserve queued tasks after restart
```

Do not define an identified object as only `REQ-001`; every identified object has a concise descriptive title. The type is a meaningful abbreviation for the represented Knowledge Model concept, such as `REQ` for Requirement, `CAP` for Capability, `RESP` for Responsibility, `DEC` for Decision, or `CTRL` for Control.

### Document Paths and Local Object Identity

A document is located by its descriptive repository file path; the default Schema has no `Document ID:` declaration or project-level document-number namespace. Search existing subjects before creating a file and choose a coherent descriptive filename. Distinct files do not require a shared counter. A path is a locator, not an immutable identity or a reservation.

Object identifiers are local to their containing document, not repository-global. Both `problem/task-recovery.md` and `problem/task-submission.md` may contain `REQ-001`. Use one writer at a time for a shared document, or reconcile local-ID allocations against its latest content before acceptance. Resolve conflicting paths, duplicate local IDs, and semantic duplication during reconciliation; different filenames alone do not prove distinct knowledge.

Every identified object has an explicit lowercase HTML anchor immediately before its heading:

```markdown
<a id="req-001"></a>

### REQ-001 — Preserve accepted queued work
```

The anchor is the lowercase form of the complete local ID. It remains unchanged during a title-only edit and does not depend on a renderer's generated heading slug. Give every identified object a concise descriptive title.

### References

Use relative Markdown links resolved from the referring file. An object reference uses the target file path plus its explicit local-ID anchor; a whole-document reference omits the fragment:

```markdown
- [REQ-003 — Queue work when resources are unavailable](../problem/task-recovery.md#req-003)
- [CAP-001 — Durable task scheduling](task-scheduling.md#cap-001)
- [Task lifecycle](../problem/task-recovery.md)
```

Include the local ID and a descriptive title in an object link's label when practical. The copied title supplies semantic context, not identity. Within the containing document, a local ID is sufficient when unambiguous; a fragment link such as `[REQ-003](#req-003)` may provide navigation.

Moving a document changes its path. Moving an object changes its full locator even if its local ID is preserved. Before removing a former location, account for incoming references and outgoing relative links whose base changes. Use contextual reference migration to repair affected repository references; keep no superseded files or redirect stubs. A split or merge may require different targets for different referring statements, multiple targets, or deliberate relationship retirement. Resolve unsupported mappings through evidence or owner direction rather than guessing. External references are outside repository repair and must be reported as a scope limit.

### Stability, Replacement, and Titles

An identifier remains unchanged when wording changes without changing the underlying object. For example, `REQ-003 — Preserve queued tasks after restart` may become `REQ-003 — Preserve accepted work across service recovery`.

A semantically different obligation, decision, capability, or other object receives a new identifier. Do not reuse the old ID; retain it as deprecated or superseded when that history is useful. The `supersedes` relationship may express that connection, but is not required solely for this purpose.

When an identified object's title changes, update copied titles in cross-document references when practical. An object link such as `task-recovery.md#req-003` remains valid after a title-only edit even until its copied title is synchronized. A merge with colliding local IDs requires deliberate reassignment and repair of affected references.

### When to Assign an Identifier

Assign an ID only when the object needs independent cross-reference, traceability, verification, lifecycle management, modification, deprecation or replacement, or durable relationship tracking. Ordinary explanatory bullets remain ordinary bullets. Independently referenceable Acceptance Criteria use stable local `AC-<NUMBER>` identifiers; Verification Items use stable local `VER-<NUMBER>` identifiers.

Default Acceptance-Criterion records use the following fields. The default Knowledge Model defines their ownership, semantics, and dependency rules.

```markdown
<a id="ac-001"></a>

### AC-001 — Accepted work survives recovery

For:

- REQ-001 — Accept queued work.

Given:

- a valid work request is available.

When:

- the request is accepted.

Then:

- the work is accepted for processing.
```

### Agent Review Guidance

Semantic validation remains agent-only. When reviewing knowledge, agents should detect and report duplicate object IDs in one document, missing or mismatched explicit anchors, broken or misbased relative paths, cross-document local-only references, identified objects without titles, conflicting copied titles, semantic ID reuse, and unnecessary IDs on explanatory bullets. Do not add a deterministic validator for these checks.

### Brownfield Trust States

Normal Project Knowledge is accepted project truth and has no status marker. During reconciliation, Git distinguishes a recorded accepted baseline from the current candidate Project-Knowledge diff; candidate state is not a document status marker and is not authoritative merely because it is present in the working tree. Use `Status: Inferred` only when evidence suggests a conclusion that has not been accepted, and `Status: Unknown` only when the project lacks sufficient trusted information. A link to either state requires project-owner review before material reliance or acceptance; once accepted or corrected, replace the exceptional state with normal authoritative knowledge.

### Complete Example

```markdown
# Task Lifecycle

## Requirements

<a id="req-001"></a>

### REQ-001 — Preserve accepted queued work

The system must preserve accepted queued work across service recovery.
```

```markdown
# Task Scheduling

## Capabilities and Architecture

<a id="cap-001"></a>

### CAP-001 — Durable task scheduling

Satisfies:

- [REQ-001 — Preserve accepted queued work](../problem/task-recovery.md#req-001)
```

## Relationship Representation

Represent relationships with stable identifiers, explicit labels, Markdown links, or short relationship statements as appropriate. The default Knowledge Model defines which relationships exist and what they mean; this Schema only defines permitted representation forms. For example, use `Satisfies: [REQ-021 — Submit an inference task](../problem/task-submission.md#req-021)` and place it beside the relevant object rather than relying on a generic relationship list. Problem and Solution documents do not use a `Related Knowledge` section; preserve material relationships beside their relevant objects, or in the existing `Satisfies` section where appropriate. Governance templates retain their relationship section.

When reorganizing existing records, preserve stable IDs, meaningful interaction context, and material relationships. Removing a fixed section does not retire its Knowledge Model concepts. Preserve useful Use Case context in Problem Intent or beside the relevant Requirements when the fixed Use Cases section is removed.

Solution documents organize architecture under Capabilities without implying exclusive ownership. Define a shared Responsibility, Component, or Interface once and reference it from other Capabilities; use `Shared Architecture` within `Capabilities and Architecture` when useful. Nesting is a reading arrangement and must preserve explicit many-to-many relationships.

## Model Migration Crosswalk Representation

Record a Model Migration Crosswalk as a Governance record when a Knowledge Model or Knowledge Schema replacement requires deliberate migration. It is an optional `Records` entry, not a required document section.

The default Crosswalk field names and order are defined once in `templates/governance/model-migration-crosswalk.md` and incorporated here by reference. Use its `MAP-<NUMBER>` entry when a Crosswalk mapping must be independently reviewed or referenced.

The active Knowledge Model defines the mapping semantics. Under the default Model, a concept or relationship mapping identifies the source and target Models; a represented-field mapping also identifies the source and target Schemas. Use `maps-to` for a reviewed correspondence when a relationship is useful; use `supersedes` only when an older durable knowledge object is intentionally replaced. A Crosswalk never activates two Models, supplies an implicit fallback, or authorizes automatic semantic rewrites.
