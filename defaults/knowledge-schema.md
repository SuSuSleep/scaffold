# Default Knowledge Schema

## Purpose

This schema defines the default Markdown representation of durable project knowledge. It is authoritative only when `.scaffold/knowledge-schema.md` does not exist. A project-local Schema replaces this default representation contract in full and is never implicitly merged with it. The shared Knowledge Model defines the concepts and relationship semantics used here; this schema does not redefine them.

## Documents

The default representation stores durable knowledge in `knowledge/` using the following document types and locations:

- `problem/`: business intent, actors, goals, use cases, requirements, and acceptance criteria.
- `solution/`: capabilities, responsibilities, components and boundaries, interfaces, designs, decisions, and verification strategy.
- `governance/`: external constraints, policies, security controls, operational concerns, and reusable findings.

These are default representation choices, not Knowledge Model concepts. Projects may replace this organization through their active Knowledge Schema.

## Structural Requirements

Each section listed in the default document mappings below is a **required structural section**. A required section may remain empty when no applicable knowledge exists; its heading still provides deterministic document structure. The default Schema defines no optional or conditional sections.

The default templates must contain every required section for their corresponding document type and must not introduce another required semantic section. Templates provide only a concrete starting structure; use this Schema for representation guidance and the shared Knowledge Model for concept meaning.

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

The default document identifiers are `PROB-<NUMBER>` for Problem documents, `SOL-<NUMBER>` for Solution documents, and `GOV-<NUMBER>` for Governance documents. Do not encode mutable semantic classifications in an ID: prefer `PROB-001` over `PROBLEM-GPU-SCHEDULING-001`.

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

Assign an ID only when the object needs independent cross-reference, traceability, verification, lifecycle management, modification, deprecation or replacement, or durable relationship tracking. Ordinary explanatory bullets remain ordinary bullets.

Acceptance Criteria normally remain unnumbered children of their Requirement:

```markdown
### REQ-001 — Preserve queued work

Acceptance Criteria:

- Queued work remains available after restart.
- Completed work is not requeued.
```

Give a criterion its own ID only when it needs independent traceability or verification. If that is required, express ownership clearly, for example `REQ-001/AC-01`; this Schema does not require criterion-level IDs by default. Likewise, retain independent `RESP-*` objects only when a Responsibility has an independent lifecycle or relationships beyond one Capability; do not change Responsibility semantics merely to simplify numbering.

### Agent Review Guidance

Semantic validation remains agent-only. When reviewing knowledge, agents should detect and report duplicate object IDs in one document, missing document IDs for externally referenced objects, cross-document local-only references, identified objects without titles, conflicting copied titles, semantic ID reuse, and unnecessary IDs on explanatory bullets. Do not add a deterministic validator for these checks.

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

## Document Section Guidance

Use these descriptions before creating or updating a document from a default template. Keep the document focused on durable knowledge; link to related records rather than duplicating them.

### Problem Document

| Section | Record |
| --- | --- |
| Intent | The problem or opportunity, the desired outcome, and why it matters. Avoid solution design. |
| Actors and Goals | The people, roles, systems, or external parties involved and the outcome each needs. |
| Use Cases | Relevant externally meaningful interactions through which Actors pursue Goals. |
| Requirements | Observable obligations. Give important requirements stable local identifiers and descriptive titles, and state their origin when known. |
| Acceptance Criteria | Conditions and examples that demonstrate a requirement is satisfied from an external or stakeholder perspective. |
| Related Knowledge | Identifiers or links to connected governance, solution, or problem records. |

### Solution Document

| Section | Record |
| --- | --- |
| Capabilities | Solution abilities that satisfy one or more obligations. |
| Responsibilities | Ownership semantics that realize Capabilities before physical decomposition. |
| Components and Boundaries | Concrete architectural units, their assigned Responsibilities, and the Interfaces they expose. |
| Satisfies | The Requirements, Controls, or Constraints this solution addresses. |
| Design and Decisions | Durable technical behavior, structure, and the intentional choices that select or constrain it. |
| Verification Strategy | The evidence, tests, checks, or reviews that should verify the solution's important expectations. |
| Related Knowledge | Identifiers or links to connected problem, governance, or solution records. |

### Governance Document

| Section | Record |
| --- | --- |
| Context | The source, risk, external obligation, finding, policy, or operational condition that makes this governance knowledge necessary. |
| Obligation or Control | The required constraint, control, or reusable rule. State it accurately without turning contextual risks into universal prohibitions. |
| Applicability | The systems, data, conditions, or changes to which the obligation or control applies. |
| Verification | Evidence, checks, reviews, or tests that establish adherence to the obligation or control. |
| Related Knowledge | Identifiers or links to affected requirements, solutions, findings, or external contracts. |

## Relationship Representation

Represent relationships with stable identifiers, explicit labels, Markdown links, or short relationship statements as appropriate. When a specific shared Knowledge Model relationship is known, represent it explicitly: for example, prefer `Satisfies: PROB-001#REQ-021 — Submit an inference task` to placing the same relationship only under Related Knowledge. Use `related-to` only when no more precise relationship applies.

## Relationship Guidance

- Use the shared Knowledge Model relationship vocabulary (`motivates`, `derived-from`, `satisfies`, `realizes`, `constrains`, `assigned-to`, `exposes`, `verifies`, `supersedes`, and `related-to`) when it describes the connection.
- Requirements should identify their origin when known.
- Capabilities should identify the Requirements, Controls, or Constraints they satisfy; Responsibilities should identify the Capabilities they realize; and Components should identify assigned Responsibilities and exposed Interfaces when useful.
- Verification should identify the Requirement, Control, Interface expectation, or Design expectation it verifies.
- Many-to-many relationships are allowed; do not force them into a tree.
