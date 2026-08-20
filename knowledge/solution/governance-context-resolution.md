# Governance Context Resolution

Document ID: SOL-005

> Evidence source: [`PRD_delta1.md`](../../PRD_delta1.md), [`defaults/knowledge-schema.md`](../../defaults/knowledge-schema.md), [`workflows/`](../../workflows/), and [`skills/`](../../skills/), inspected 2026-08-20.

## Capabilities

### CAP-001 — Selective Governance context resolution

Enable agents to identify and consume only the project Governance relevant to a Workflow Phase while retaining Governance as durable, independently evolvable project knowledge.

### CAP-002 — Project-level verification strategy

Separate project-wide verification approach from the solution-specific expectations that must be demonstrated.

## Responsibilities

### RESP-001 — Phase-relevant Governance discovery

Realizes: CAP-001

Identify relevant Governance categories from the current Workflow Phase, locate applicable records through the active Schema and Project Knowledge, and expand context only when dependencies or uncertainty require it.

### RESP-002 — Verification responsibility separation

Realizes: CAP-002

Keep test methodology and evidence-selection strategy in Governance while Solution documents retain the specific verification items they must demonstrate.

## Components and Boundaries

- **Shared Workflows** are assigned-to RESP-001. They identify semantic Governance categories such as Documentation Standards, Coding Standards, Verification Strategy, Security Controls, and Architecture Constraints without naming project file paths.
- **Shared Skills** are assigned-to RESP-001. They provide reusable methods and consult applicable project Governance without encoding project-specific strategy.
- **Solution documents** are assigned-to RESP-002 for Solution verification items.
- **Governance records** are assigned-to RESP-002 for project-wide verification strategy and applicability guidance.

## Satisfies

- CAP-001 — Selective Governance context resolution satisfies:
  - PROB-001#REQ-010 — Selective Governance consumption
- CAP-002 — Project-level verification strategy satisfies:
  - PROB-001#REQ-010 — Selective Governance consumption

## Design and Decisions

### DEC-001 — Scope is distinct from context loading

Governance may be project-wide in scope without being loaded for every activity. Workflow Phase intent determines relevant Governance categories; agents resolve applicability semantically rather than through a deterministic routing engine.

### DEC-002 — Verification strategy and item separation

Governance defines how the project generally approaches verification. A Solution defines what it must demonstrate through verification items and expected evidence. A Solution may specify a verification method only when an exceptional solution-specific constraint requires it.

## Verification Items

### VER-001 — Selective Governance consumption

Verifies:

- PROB-001#REQ-010 — Selective Governance consumption.

Expected evidence:

- Workflow and Skill guidance refers to Governance by semantic category and never requires a project-specific Governance path.
- Agents can identify a phase-relevant Governance record without loading every Governance record.

## Related Knowledge

- PROB-001#REQ-010 — Selective Governance consumption.
- GOV-003#CTRL-001 — Project verification strategy.
- SOL-003#CAP-002 — Deliberate guidance authority.
