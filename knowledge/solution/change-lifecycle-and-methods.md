# Change Lifecycle and Method Boundaries

Document ID: SOL-004

> Evidence source: [`workflows/`](../../workflows/), [`skills/`](../../skills/), [`defaults/agent-guide.md`](../../defaults/agent-guide.md), and [`PRD.md`](../../PRD.md), inspected 2026-08-20.

## Capabilities

### CAP-001 — Accepted-change lifecycle management

Guide meaningful work from project initialization through change definition, review and acceptance, implementation, verification, knowledge update, and explicit migration when ordinary replacement is insufficient.

### CAP-002 — Method-flexible work guidance

Support reusable methods without allowing a selected method or Skill to redefine the sequencing and required outcomes of a Workflow.

### CAP-003 — Context and impact collection

Provide reusable guidance for collecting sufficient project, implementation, verification, instruction, and external context before a meaningful decision or change.

## Responsibilities

### RESP-001 — Workflow lifecycle definition

Realizes: CAP-001

Define lifecycle phases, entry conditions, and required outcomes for project initialization, change definition and review, implementation, knowledge updates, reconstruction, learning, local Rule evolution, and migration.

### RESP-002 — Acceptance-gate enforcement

Realizes: CAP-001

Require `review-change` to establish acceptance of a proposed durable change before `implement-change` realizes it.

### RESP-003 — Reusable method guidance

Realizes: CAP-002 and CAP-003

Provide concise Skills for methods such as context collection, impact analysis, optional TDD, and verification without embedding project policy or complete lifecycle logic in a Skill.

## Components and Boundaries

- **`workflows/define-change.md`**, **`workflows/review-change.md`**, and **`workflows/implement-change.md`** are assigned-to RESP-001 and RESP-002. Together, they define the normal accepted-change path.
- **`workflows/initialize-project.md`**, **`workflows/update-knowledge.md`**, **`workflows/reconstruct-project-knowledge.md`**, **`workflows/learn-from-finding.md`**, **`workflows/evolve-project-rules.md`**, **`workflows/adopt-harness-update.md`**, and **`workflows/migrate-project.md`** are assigned-to RESP-001 for their specialized work categories.
- **`skills/collect-context/`**, **`skills/analyze-impact/`**, **`skills/analyze-rule-conflicts/`**, **`skills/implement-with-tdd/`**, and **`skills/verify-change/`** are assigned-to RESP-003.
- A Workflow may suggest a Skill, but a phase is complete when its required outcome is achieved. Project Rules may require a method, such as TDD, without changing the Workflow.

## Satisfies

- CAP-001 — Accepted-change lifecycle management satisfies:
  - PROB-001#REQ-009 — Accepted-change lifecycle
- CAP-002 — Method-flexible work guidance satisfies:
  - PROB-001#REQ-009 — Accepted-change lifecycle
- CAP-003 — Context and impact collection supports CAP-001 and CAP-002.

## Design and Decisions

### DEC-001 — Workflow owns outcomes; Skill owns method

Workflows own sequence, phase intent, entry conditions, and completion outcomes. Skills are tactical, reusable method guidance. This keeps a project free to require or replace an implementation method without creating hidden workflow branches or changing the intended work result.

### DEC-002 — Explicit specialization and migration

A substantially different work category receives an explicit additional Workflow rather than implicit inheritance or conditional complexity. When a Scaffold update cannot be adopted through ordinary replacement, migration is a deliberate project-owned Workflow rather than an automatic semantic rewrite.

### DEC-003 — Small, evidence-driven Skill set

Shared Skills remain concise, tactical, and reusable across Workflows. A new Skill is added only when an activity needs independent reusable guidance; candidate activities may remain represented by Workflow phases or existing Skills rather than proliferating overlapping artifacts.

## Verification Items

### VER-001 — Accepted-change gate

Verifies:

- CAP-001 — Accepted-change lifecycle management.

Expected evidence:

- A proposed change is accepted through `review-change` before `implement-change` realizes it.

### VER-002 — Method boundary

Verifies:

- CAP-002 — Method-flexible work guidance.

Expected evidence:

- A Project Rule can require a method without changing a Workflow's required outcome.

## Related Knowledge

- PROB-001#REQ-006 — Incremental brownfield reconstruction.
- PROB-001#REQ-007 — Evidence-based durable learning.
- PROB-001#REQ-009 — Accepted-change lifecycle.
- SOL-002#CAP-002 — Evidence-based knowledge reconstruction.
- SOL-002#CAP-003 — Finding-to-knowledge learning.
- GOV-002#CON-002 — Agent-mediated semantic validation.
