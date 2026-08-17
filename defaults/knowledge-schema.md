# Default Knowledge Schema

## Purpose

This schema defines the default Markdown representation of durable project knowledge. It is authoritative only when `.scaffold/knowledge-schema.md` does not exist.

## Documents

Store durable knowledge in `knowledge/` using the following document types:

- `problem/`: business intent, actors, goals, use cases, requirements, and acceptance criteria.
- `solution/`: capabilities, designs, decisions, interfaces, and verification strategy.
- `governance/`: external constraints, policies, security controls, operational concerns, and reusable findings.

Each document should state its purpose, the durable facts it records, and meaningful relationships to other knowledge. Use stable identifiers for important requirements and decisions when traceability is useful.

## Relationships

- Requirements should identify their origin when known.
- Solution responsibilities should identify the requirements or constraints they satisfy.
- Verification should identify the requirement or design expectation it verifies.
- Many-to-many relationships are allowed; do not force them into a tree.

## Change Discipline

Update durable knowledge when a change affects observable behavior, requirements, interfaces, responsibilities, security assumptions, or important design reasoning. Do not create knowledge documents for purely mechanical changes.
