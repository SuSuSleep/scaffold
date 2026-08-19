# Default Knowledge Schema

## Purpose

This schema defines the default Markdown representation of durable project knowledge. It is authoritative only when `.scaffold/knowledge-schema.md` does not exist. The active Knowledge Model defines the concepts and relationship semantics used here; this schema does not redefine them.

## Documents

Store durable knowledge in `knowledge/` using the following document types:

- `problem/`: business intent, actors, goals, use cases, requirements, and acceptance criteria.
- `solution/`: capabilities, responsibilities, components and boundaries, interfaces, designs, decisions, and verification strategy.
- `governance/`: external constraints, policies, security controls, operational concerns, and reusable findings.

Each document should state its purpose, the durable facts it records, and meaningful relationships to other knowledge. Use stable identifiers for important requirements and decisions when traceability is useful.

## Document Section Guidance

Use these descriptions before creating or updating a document from a default template. Keep the document focused on durable knowledge; link to related records rather than duplicating them.

### Problem Document

| Section | Record |
| --- | --- |
| Intent | The problem or opportunity, the desired outcome, and why it matters. Avoid solution design. |
| Actors and Goals | The people, roles, systems, or external parties involved and the outcome each needs. |
| Requirements | Observable obligations. Give important requirements stable identifiers and state their origin when known. |
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

## Relationships

- Use the active Knowledge Model relationship vocabulary (`motivates`, `derived-from`, `satisfies`, `realizes`, `constrains`, `assigned-to`, `exposes`, `verifies`, `supersedes`, and `related-to`) when it describes the connection.
- Requirements should identify their origin when known.
- Capabilities should identify the Requirements, Controls, or Constraints they satisfy; Responsibilities should identify the Capabilities they realize; and Components should identify assigned Responsibilities and exposed Interfaces when useful.
- Verification should identify the Requirement, Control, Interface expectation, or Design expectation it verifies.
- Many-to-many relationships are allowed; do not force them into a tree.

## Change Discipline

Update durable knowledge when a change affects observable behavior, requirements, interfaces, responsibilities, security assumptions, or important design reasoning. Do not create knowledge documents for purely mechanical changes.
