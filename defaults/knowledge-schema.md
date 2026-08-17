# Default Knowledge Schema

## Purpose

This schema defines the default Markdown representation of durable project knowledge. It is authoritative only when `.scaffold/knowledge-schema.md` does not exist.

## Documents

Store durable knowledge in `knowledge/` using the following document types:

- `problem/`: business intent, actors, goals, use cases, requirements, and acceptance criteria.
- `solution/`: capabilities, designs, decisions, interfaces, and verification strategy.
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
| Responsibilities | The capability or component responsibilities and their boundaries. |
| Satisfies | The requirements, controls, or constraints this solution addresses. |
| Design and Decisions | Important interfaces, data or state semantics, technical choices, alternatives, and their reasoning. |
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

- Requirements should identify their origin when known.
- Solution responsibilities should identify the requirements or constraints they satisfy.
- Verification should identify the requirement or design expectation it verifies.
- Many-to-many relationships are allowed; do not force them into a tree.

## Change Discipline

Update durable knowledge when a change affects observable behavior, requirements, interfaces, responsibilities, security assumptions, or important design reasoning. Do not create knowledge documents for purely mechanical changes.
