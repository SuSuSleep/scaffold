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

Use descriptive titles to locate independently referenced knowledge objects. Apply the title and reference conventions below; explicit relationship labels and short relationship statements retain their Model-defined meaning.

## Titles and References

A descriptive title makes an object readable and searchable. Its containing path and title-derived fragment provide its current locator; its body carries authoritative meaning. The default Schema allocates no numeric or opaque document or object IDs. A title or path change is a locator change and requires reference maintenance, even when the underlying meaning is unchanged.

### Descriptive Objects

Use a concise descriptive heading for each independently referenced object, without a type-number prefix. Keep its Knowledge Model concept clear from its section or an explicit concept label where necessary. Removing IDs does not remove Requirement/Acceptance-Criterion ownership, Capability/Responsibility distinctions, or any other Model relationship.

```markdown
<a id="preserve-accepted-work"></a>

### Preserve accepted work
```

Ordinary explanatory bullets do not need object locators. Referenceable Acceptance Criteria and Verification Items use descriptive headings and links just like other objects; they retain the active Model's ownership semantics.

### Document Paths and Title-Derived Fragments

Locate a document by its descriptive repository file path. Search existing subjects before creation and reconcile competing path claims or duplicate subjects before acceptance. Different paths do not prove different meaning; neither a path nor a title reserves knowledge identity.

For each referenceable object, derive its fragment from the plain-text title:

1. Normalize Unicode to NFC and lowercase.
2. Retain Unicode letters, combining marks, numbers, whitespace, hyphens and underscores; remove other punctuation and symbols.
3. Trim surrounding whitespace, then replace each remaining whitespace run with one hyphen.

The result must be nonempty. Put an explicit HTML anchor with that derived value immediately before the heading. For example, `Preserve accepted work` derives `preserve-accepted-work`, while `保留已接受的工作` remains descriptive Unicode text. The explicit anchor avoids reliance on a renderer's implicit slug rules; it is derived from the title and is not a separately allocated stable identity. Recompute template anchors when substituting actual titles.

Referenceable titles and fragments must unambiguously locate their objects within the document, accounting for other explicit or rendered section targets. Different titles can normalize to the same fragment, such as `Retry work!` and `Retry work?`. Reconcile these collisions by meaning: choose more specific descriptive titles for distinct objects or consolidate equivalent knowledge with preserved relationships. Do not use order-dependent numeric suffixes as a resolution. The same title in different files is allowed because the file path distinguishes the objects.

### References

Use relative Markdown links resolved from the referring file. An object link uses its target file and descriptive title-derived fragment; a whole-document link omits the fragment:

```markdown
- [Preserve accepted work](../problem/task-recovery.md#preserve-accepted-work)
- [Durable task scheduling](task-scheduling.md#durable-task-scheduling)
- [Task lifecycle](../problem/task-recovery.md)
```

Use descriptive title labels rather than copied IDs. Within the same document, use a local fragment link when precise location is needed, such as `[Preserve accepted work](#preserve-accepted-work)`. Ordinary prose may name a title when the intended object is already unambiguous.

Default Acceptance-Criterion records use these fields. The default Knowledge Model defines their ownership, semantics, and dependency rules.

```markdown
<a id="accepted-work-survives-recovery"></a>

### Accepted work survives recovery

For:

- [Preserve accepted work](#preserve-accepted-work)

Given:

- an accepted work request is queued.

When:

- the service restarts.

Then:

- the accepted request remains available for processing.
```

### Rename and Conflict Maintenance

Title changes regenerate the derived fragment and repair affected same-document and cross-document references and copied labels. Document or object moves also change locators and may change outgoing relative bases. Do not retain old numeric anchors, old-title aliases, superseded files, or redirect stubs. External consumers are outside repository repair and must be reported as a scope limit.

Use `migrate-references` for affected reference repair and document or object conflicts. Distinguish locator collisions, duplicate meaning, and contradictory claims. Inspect competing source versions or occurrences and each referring context before selecting targets; the same old locator can have different meanings. Do not overwrite a version, prefer the newest version by default, or merge solely by name. Consolidate only evidence-supported equivalent meaning; retain distinct meanings with descriptive disambiguation. Unsupported or material ambiguous decisions require authoritative evidence or owner direction through independent reconciliation. Recheck source and target contents before application so parallel edits cannot silently invalidate the assessment.

### Agent Review Guidance

Semantic validation remains agent-only. Review descriptive titles, nonempty and unambiguous derived fragments, matching anchors, relative bases, copied labels, preserved object meaning and ownership, semantic duplication, contradictions, and source provenance when locators collide. A resolving link or a clean Git merge does not establish semantic correctness. Do not add a deterministic semantic validator for these checks.

### Brownfield Trust States

Normal Project Knowledge is accepted project truth and has no status marker. During reconciliation, Git distinguishes a recorded accepted baseline from the current candidate Project-Knowledge diff; candidate state is not a document status marker and is not authoritative merely because it is present in the working tree. Use `Status: Inferred` only when evidence suggests a conclusion that has not been accepted, and `Status: Unknown` only when the project lacks sufficient trusted information. A link to either state requires project-owner review before material reliance or acceptance; once accepted or corrected, replace the exceptional state with normal authoritative knowledge.

### Complete Example

```markdown
# Task Lifecycle

## Requirements

<a id="preserve-accepted-work"></a>

### Preserve accepted work

The system must preserve accepted queued work across service recovery.
```

```markdown
# Task Scheduling

## Capabilities and Architecture

<a id="durable-task-scheduling"></a>

### Durable task scheduling

Satisfies:

- [Preserve accepted work](../problem/task-recovery.md#preserve-accepted-work)
```

## Relationship Representation

Represent relationships with descriptive Markdown links, explicit relationship labels, or short relationship statements as appropriate. The default Knowledge Model defines which relationships exist and what they mean; this Schema only defines permitted representation forms. For example, use `Satisfies: [Submit an inference task](../problem/task-submission.md#submit-an-inference-task)` and place it beside the relevant object rather than relying on a generic relationship list. Problem and Solution documents do not use a `Related Knowledge` section; preserve material relationships beside their relevant objects, or in the existing `Satisfies` section where appropriate. Governance templates retain their relationship section.

When reorganizing existing records, preserve supported object meaning, meaningful interaction context, and material relationships while repairing changed locators. Removing a fixed section does not retire its Knowledge Model concepts. Preserve useful Use Case context in Problem Intent or beside the relevant Requirements when the fixed Use Cases section is removed.

Solution documents organize architecture under Capabilities without implying exclusive ownership. Define a shared Responsibility, Component, or Interface once and reference it from other Capabilities; use `Shared Architecture` within `Capabilities and Architecture` when useful. Nesting is a reading arrangement and must preserve explicit many-to-many relationships.

## Model Migration Crosswalk Representation

Record a Model Migration Crosswalk as a Governance record when a Knowledge Model or Knowledge Schema replacement requires deliberate migration. It is an optional `Records` entry, not a required document section.

The default Crosswalk field names and order are defined once in `templates/governance/model-migration-crosswalk.md` and incorporated here by reference. Use a descriptively titled mapping entry when a Crosswalk mapping must be independently reviewed or referenced.

The active Knowledge Model defines the mapping semantics. Under the default Model, a concept or relationship mapping identifies the source and target Models; a represented-field mapping also identifies the source and target Schemas. Use `maps-to` for a reviewed correspondence when a relationship is useful; use `supersedes` only when an older durable knowledge object is intentionally replaced. A Crosswalk never activates two Models, supplies an implicit fallback, or authorizes automatic semantic rewrites.
