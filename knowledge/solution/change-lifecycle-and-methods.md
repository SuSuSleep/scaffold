# Change Lifecycle and Method Boundaries

Document ID: SOL-004

> Evidence source: [`skills/`](../../skills/) and [`defaults/agent-guide.md`](../../defaults/agent-guide.md), inspected 2026-08-30.

## Capabilities

### CAP-001 — Accepted-change lifecycle management

Guide meaningful work from project initialization through change definition, iterative Project Knowledge reconciliation, immediate conflict clarification when needed, automatic acceptance after clean independent review, appropriate downstream routing, implementation, verification, knowledge update, artifact evolution, and explicit migration when ordinary replacement is insufficient.

### CAP-002 — Method-flexible work guidance

Support reusable methods without allowing a model-invoked Skill to redefine a workflow Skill's sequence and required outcomes.

### CAP-003 — Context and impact collection

Provide reusable guidance for collecting sufficient project, implementation, verification, instruction, and external context before a meaningful decision or change.

### CAP-004 — Project Knowledge reconciliation

Converge a proposed Project Knowledge delta through separate fresh writer and reviewer subagent executions, using Git to distinguish the accepted baseline from candidate knowledge.

## Responsibilities

### RESP-001 — Workflow lifecycle definition

Realizes: CAP-001

Define lifecycle phases, entry conditions, and required outcomes for project initialization, evidence-led change definition, Project Knowledge reconciliation, implementation, knowledge updates, reconstruction, learning, local Harness evolution, update adoption review, and migration.

### RESP-002 — Acceptance-gate enforcement

Realizes: CAP-001

Require `reconcile-project-change` to obtain a clean independent review of candidate Project Knowledge, immediately seek user direction for unresolved conflicts or material ambiguities, and route a clean candidate to acceptance and implementation when applicable. A writer cannot accept its own change and a reviewer cannot modify the candidate it reviews.

### RESP-004 — Candidate-state boundary

Realizes: CAP-004

Use a recorded Git baseline for accepted Project Knowledge and the current Project-Knowledge diff for the candidate state. Preserve findings as review output rather than as inherited reviewer confidence.

### RESP-003 — Reusable method guidance

Realizes: CAP-002 and CAP-003

Provide concise Skills for methods such as context collection, impact analysis, optional TDD, and verification without embedding project policy or complete lifecycle logic in a Skill.

## Components and Boundaries

- **Project-local workflow Skills in `.scaffold/skills/`** are assigned-to RESP-001, RESP-002, and RESP-004. Their user interfaces define the normal Project Knowledge path: define, reconcile candidate knowledge, immediately clarify unresolved conflicts with the user, automatically accept a clean candidate, and implement when needed, as well as specialized work categories. The update-review workflow examines the two-way package candidate diff, explains additions and behavioral changes, and discusses material adoption choices with the project owner.
- **`.scaffold/skills/collect-context/`**, **`.scaffold/skills/analyze-impact/`**, **`.scaffold/skills/analyze-rule-conflicts/`**, **`.scaffold/skills/implement-with-tdd/`**, and **`.scaffold/skills/verify-change/`** are project-local model-invoked Skills assigned-to RESP-003. The installed package supplies corresponding candidate Skills only for initialization and update review.
- A workflow Skill may use a model-invoked Skill, but a phase is complete when its required outcome is achieved. Project Rules may require a method, such as TDD, without changing the workflow Skill.

## Satisfies

- CAP-001 — Accepted-change lifecycle management satisfies:
  - PROB-004#REQ-009 — Accepted-change lifecycle
- CAP-002 — Method-flexible work guidance satisfies:
  - PROB-004#REQ-009 — Accepted-change lifecycle
- CAP-003 — Context and impact collection supports CAP-001 and CAP-002.
- CAP-004 — Project Knowledge reconciliation satisfies:
  - PROB-004#REQ-014 — Independently reconciled Project Knowledge

## Design and Decisions

### DEC-001 — Workflow Skill owns outcomes; model-invoked Skill owns method

User-invoked workflow Skills own sequence, phase intent, entry conditions, and completion outcomes. Model-invoked Skills are tactical, reusable method guidance. This keeps a project free to require or replace an implementation method without creating hidden workflow branches or changing the intended work result. Project Knowledge review is read-only and feeds reconciliation; artifact and Rule evolution retain their own workflow Skills.

### DEC-004 — Git-backed candidate knowledge and independent reconciliation

For Project Knowledge, reconciliation records a Git baseline that represents the accepted state and reviews the candidate Project-Knowledge diff against that baseline. Every writer and reviewer iteration uses a fresh subagent context; the two roles must be distinct. “Fresh” means the cleanest available context: the agent independently reads the current repository and receives findings as evidence, not the previous agent’s confidence. A reviewer-discovered conflict or material ambiguity, including one missed in an earlier phase, makes the candidate `NOT ACCEPTABLE` until authoritative evidence resolves it or the user provides direction. When user direction is needed, the agent immediately asks how to resolve the matter, identifying the conflict and evidence, viable selectable alternatives and their effects, and affected candidate knowledge. The answer refreshes reconciliation context and begins a fresh writer/reviewer iteration. Blocking conflicts and unresolved ambiguities remain non-accepted. A clean independent review automatically accepts the candidate; `REVIEW_UNAVAILABLE` remains an operational result rather than an acceptance state. On completion, the workflow shows the changed Project Knowledge records and a concise semantic delta, while Git remains available for detailed inspection.

### DEC-005 — Evidence-led definition and non-mutating handoff

`define-change` establishes a shared picture before proposing a Project Knowledge delta. It researches facts available in the repository, active knowledge, Rules, and tools; resolves material user decisions in prerequisite-aware rounds; and carries settled decisions, scenarios, assumptions, unknowns, and affected knowledge into its handoff. It does not create, edit, or draft Project Knowledge. Candidate knowledge mutation belongs only to a fresh `update-knowledge` writer within `reconcile-project-change`, followed by independent review; an unresolved conflict or material ambiguity prompts an immediate user question before a fresh iteration.

### DEC-002 — Explicit specialization, update adoption, and migration

A substantially different work category receives an explicit additional workflow Skill rather than implicit inheritance or conditional complexity. An update-review Skill is an owner-facing adoption conversation: it analyzes what candidate artifacts add or change, what the project retains or loses by keeping local content, and whether each material difference serves the project's actual Harness needs. It asks the owner to choose `adopt`, `adapt`, `keep`, `retire`, or `defer`; it does not automatically merge. When an adopted Scaffold change requires durable semantic adaptation, migration is a deliberate project-owned workflow Skill rather than an automatic semantic rewrite.

### DEC-003 — Small, evidence-driven Skill set

Model-invoked Skills remain concise, tactical, and reusable across workflow Skills. A new Skill is added only when an activity needs independent reusable guidance; candidate activities may remain represented by workflow phases or existing Skills rather than proliferating overlapping artifacts.

## Verification Items

### VER-001 — Project Knowledge reconciliation gate

Verifies:

- PROB-004#AC-016 — Accepted changes are reviewed before downstream work.

Scope:

- independent review as the gate before downstream implementation routing, with immediate user clarification only when a conflict or material ambiguity prevents a clean review.

Expected evidence:

- A proposed Project Knowledge delta is reconciled through distinct fresh writer and reviewer subagents; a clean review automatically accepts it before any implementation begins.

### VER-002 — Method boundary

Verifies:

- PROB-004#AC-016 — Accepted changes are reviewed before downstream work.

Scope:

- separation between Workflow outcomes and project-selected methods.

Expected evidence:

- A Project Rule can require a method without changing a Workflow's required outcome.

### VER-003 — Definition-to-reconciliation mutation boundary

Verifies:

- PROB-004#AC-016 — Accepted changes are reviewed before downstream work.

Scope:

- evidence-led change definition, non-mutating proposal handoff, and reconciliation-owned candidate knowledge mutation.

Expected evidence:

- `define-change` gathers a sufficiently detailed shared picture and supplies a proposed delta without editing Project Knowledge; only a fresh `update-knowledge` writer within `reconcile-project-change` mutates the candidate before independent review.

### VER-004 — Review-conflict decision routing

Verifies:

- PROB-004#AC-020 — Project Knowledge is independently reconciled.

Scope:

- reviewer-discovered conflicts or unresolved ambiguities during reconciliation, including immediate user decision routing and return to a fresh iteration.

Expected evidence:

- A reviewer reports a candidate with a conflict or material ambiguity, including one missed earlier, as `NOT ACCEPTABLE`; if authoritative evidence cannot resolve it, the agent immediately asks the user with the conflict and evidence, viable selectable alternatives and their effects, and affected candidate knowledge. The user clarification refreshes context and is followed by distinct fresh writer and reviewer executions. The conflict or ambiguity remains non-accepted until a clean review, which automatically accepts the candidate and shows the changed knowledge records with a concise semantic delta.

## Related Knowledge

- PROB-003#REQ-006 — Incremental brownfield reconstruction.
- PROB-003#REQ-007 — Evidence-based durable learning.
- PROB-004#REQ-009 — Accepted-change lifecycle.
- SOL-002#CAP-002 — Evidence-based knowledge reconstruction.
- SOL-002#CAP-003 — Finding-to-knowledge learning.
- GOV-002#CON-002 — Agent-mediated semantic validation.
- GOV-002#CON-006 — Git-backed candidate-state boundary.
