# Default Knowledge Schema

## Purpose

This schema defines the default Markdown representation of durable project knowledge. It is authoritative only when `.scaffold/knowledge-schema.md` does not exist. A project-local Schema replaces this default representation contract in full and is never implicitly merged with it. The active Knowledge Model defines the concepts and relationship semantics used here; this schema does not redefine them.

## Documents

The default representation stores durable knowledge in `knowledge/` using these locations:

- `problem/`: default Problem-document location.
- `solution/`: default Solution-document location.
- `governance/`: default Governance-document location.

These are default representation choices, not Knowledge Model concepts. Projects may replace this organization through their active Knowledge Schema.

## Structural Requirements

Each section listed in the default document structures below is a **required structural section**. A required section may remain empty when no applicable knowledge exists; its heading still provides deterministic document structure. The default Schema defines no optional or conditional sections.

The default templates must contain every required section for their corresponding document type and must not introduce another required semantic section. Templates provide only a concrete starting structure; use this Schema for representation guidance and the active Knowledge Model for concept meaning.

Shared and project-local templates are organized by the knowledge space they start: `templates/problem/`, `templates/solution/`, and `templates/governance/`. This organization is a default representation choice; the active Knowledge Schema remains the authority for template applicability.

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
### REQ-001 — Preserve queued tasks after restart
```

Do not define an identified object as only `REQ-001`; every identified object has a concise descriptive title. The type is a meaningful abbreviation for the represented Knowledge Model concept, such as `REQ` for Requirement, `CAP` for Capability, `RESP` for Responsibility, `DEC` for Decision, or `CTRL` for Control.

### Scope and Document Identity

Object identifiers are local to their containing document, not repository-global. Each document that exposes externally referenceable objects has a stable typed document identifier near its title:

```text
Document ID: PROB-001
```

The default document identifiers are `PROB-<NUMBER>` for Problem documents, `SOL-<NUMBER>` for Solution documents, and `GOV-<NUMBER>` for Governance documents. A document ID is unique within its project-level type namespace: no two project documents may declare the same `PROB-*`, `SOL-*`, or `GOV-*` ID. Before creating a new default-Schema document, determine the prefix from this Schema and use `scaffold id next <PREFIX>` or `scaffold id check <DOCUMENT_ID>` to inspect availability. Do not encode mutable semantic classifications in an ID: prefer `PROB-001` over `PROBLEM-GPU-SCHEDULING-001`.

Local numbering may therefore repeat across documents. For example, both `PROB-001` and `PROB-002` may contain `REQ-001`. Do not invent a repository-wide counter.

### References

The canonical cross-document identity is:

```text
<DOCUMENT_ID>#<OBJECT_ID>
```

Use a qualified reference whenever a relationship crosses document boundaries, for example:

```markdown
- PROB-001#REQ-003 — Queue work when resources are unavailable
- SOL-002#CAP-001 — Durable task scheduling
- SOL-002#DEC-004 — Persist accepted pending work
```

Include the copied descriptive title when practical. It is intentionally denormalized semantic context, not part of identity. Within the containing document, a local identifier is sufficient when its namespace is already unambiguous: `REQ-003 is constrained by REQ-005.`

### Stability, Replacement, and Titles

An identifier remains unchanged when wording changes without changing the underlying object. For example, `REQ-003 — Preserve queued tasks after restart` may become `REQ-003 — Preserve accepted work across service recovery`.

A semantically different obligation, decision, capability, or other object receives a new identifier. Do not reuse the old ID; retain it as deprecated or superseded when that history is useful. The `supersedes` relationship may express that connection, but is not required solely for this purpose.

When an identified object's title changes, update copied titles in cross-document references when practical. A reference such as `PROB-001#REQ-003` remains valid even until its copied title is synchronized.

### When to Assign an Identifier

Assign an ID only when the object needs independent cross-reference, traceability, verification, lifecycle management, modification, deprecation or replacement, or durable relationship tracking. Ordinary explanatory bullets remain ordinary bullets. Independently referenceable Acceptance Criteria use stable local `AC-<NUMBER>` identifiers; Verification Items use stable local `VER-<NUMBER>` identifiers.

Default Acceptance-Criterion records use the following fields. The default Knowledge Model defines their ownership, semantics, and dependency rules.

```markdown
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

Semantic validation remains agent-only. When reviewing knowledge, agents should detect and report duplicate object IDs in one document, missing document IDs for externally referenced objects, cross-document local-only references, identified objects without titles, conflicting copied titles, semantic ID reuse, and unnecessary IDs on explanatory bullets. Do not add a deterministic validator for these checks.

### Brownfield Trust States

Normal Project Knowledge is accepted project truth and has no status marker. During reconciliation, Git distinguishes a recorded accepted baseline from the current candidate Project-Knowledge diff; candidate state is not a document status marker and is not authoritative merely because it is present in the working tree. Use `Status: Inferred` only when evidence suggests a conclusion that has not been accepted, and `Status: Unknown` only when the project lacks sufficient trusted information. A link to either state requires project-owner review before material reliance or acceptance; once accepted or corrected, replace the exceptional state with normal authoritative knowledge.

### Complete Example

```markdown
# Task Lifecycle

Document ID: PROB-001

## Requirements

### REQ-001 — Preserve accepted queued work

The system must preserve accepted queued work across service recovery.
```

```markdown
# Task Scheduling

Document ID: SOL-001

## Capabilities

### CAP-001 — Durable task scheduling

Satisfies:

- PROB-001#REQ-001 — Preserve accepted queued work
```

## Default Document Structures

These lists define only required heading names and order. The default Knowledge Model defines the meaning and appropriate content of each section.

### Problem Document

#### Intent

#### Actors and Goals

#### Use Cases

#### Requirements

#### Acceptance Criteria

#### Related Knowledge

### Solution Document

#### Capabilities

#### Responsibilities

#### Components and Boundaries

#### Satisfies

#### Design and Decisions

#### Verification Items

#### Related Knowledge

### Governance Document

#### Purpose

#### Applies When

#### Does Not Normally Apply When

#### Records

#### Verification

#### Related Knowledge

## Relationship Representation

Represent relationships with stable identifiers, explicit labels, Markdown links, or short relationship statements as appropriate. The default Knowledge Model defines which relationships exist and what they mean; this Schema only defines permitted representation forms. For example, use `Satisfies: PROB-001#REQ-021 — Submit an inference task` rather than placing a relationship only under `Related Knowledge`.
