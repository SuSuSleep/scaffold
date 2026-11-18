# Change Lifecycle and Method Boundaries

> Evidence source: [`.scaffold/skills/`](../../.scaffold/skills/) and [`.scaffold/agent-guide.md`](../../.scaffold/agent-guide.md), inspected 2026-11-17.

## Capabilities and Architecture

<a id="cap-001"></a>

### CAP-001 — Accepted-change lifecycle management

Guide meaningful work from project initialization through change definition, iterative Project Knowledge reconciliation, immediate conflict clarification when needed, automatic acceptance after clean independent review, appropriate downstream routing, implementation, verification, knowledge update, artifact evolution, and explicit migration when ordinary replacement is insufficient.

Relationships:

- Satisfies: [REQ-009 — Accepted-change lifecycle](../problem/change-lifecycle-and-reconciliation.md#req-009).

#### Responsibilities

<a id="resp-001"></a>

##### RESP-001 — Workflow lifecycle definition

Realizes: CAP-001

Define lifecycle phases, entry conditions, and required outcomes for project initialization, evidence-led change definition, Project Knowledge reconciliation, implementation, knowledge updates, reconstruction, learning, local Harness evolution, update adoption review, and migration.

Relationships:

- Related-to: [REQ-006 — Incremental brownfield reconstruction](../problem/knowledge-reconstruction-and-learning.md#req-006).
- Related-to: [REQ-007 — Evidence-based durable learning](../problem/knowledge-reconstruction-and-learning.md#req-007).
- Related-to: [CAP-002 — Evidence-based knowledge reconstruction](default-artifacts.md#cap-002).
- Related-to: [CAP-003 — Finding-to-knowledge learning](default-artifacts.md#cap-003).

<a id="resp-002"></a>

##### RESP-002 — Acceptance-gate enforcement

Realizes: CAP-001

Require `reconcile-project-change` to obtain a clean independent review of candidate Project Knowledge, immediately seek user direction for unresolved conflicts or material ambiguities, and route a clean candidate to acceptance and implementation when applicable. A writer cannot accept its own change and a reviewer cannot modify the candidate it reviews.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-002"></a>

### CAP-002 — Method-flexible work guidance

Support reusable methods without allowing a model-invoked Skill to redefine a workflow Skill's sequence and required outcomes.

#### Responsibilities

Uses shared Responsibilities RESP-003 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-003"></a>

### CAP-003 — Context and impact collection

Provide reusable guidance for collecting evidence, deriving supported conclusions for a caller-defined decision or outcome, and tracing the direct and consequential effects of a specified change, with the caller selecting relevant content and completion criteria.

#### Responsibilities

Uses shared Responsibilities RESP-003 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-004"></a>

### CAP-004 — Project Knowledge reconciliation

Converge a proposed Project Knowledge delta through separate fresh writer and reviewer subagent executions, using Git to distinguish the accepted baseline from candidate knowledge.

#### Responsibilities

<a id="resp-004"></a>

##### RESP-004 — Candidate-state boundary

Realizes: CAP-004

Use a recorded Git baseline for accepted Project Knowledge and the current Project-Knowledge diff for the candidate state. Preserve findings as review output rather than as inherited reviewer confidence.

Relationships:

- Related-to: [CON-006 — Git-backed candidate-state boundary](../governance/product-operating-boundaries.md#con-006).

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

### Shared Architecture

#### Responsibilities

<a id="resp-003"></a>

##### RESP-003 — Reusable method guidance

Realizes: CAP-002 and CAP-003

Provide concise Skills for methods such as context collection, change impact analysis, optional TDD, and verification without embedding project policy or complete lifecycle logic in a Skill. Context collection takes its target, completion criteria, and applicable scope and authority constraints from its caller, and returns source-located observations, evidence-linked inferences with rationale and material conditions, limits, and a completion assessment. Supported conclusions are distinguished from unverified hypotheses, and insufficient evidence does not require an inference. The external agent host executes these adaptive methods; the Skill supplies guidance rather than an independent runtime.

Relationships:

- Related-to: [CON-002 — Agent-mediated semantic validation](../governance/product-operating-boundaries.md#con-002).
- Related-to: [RESP-001 — Adaptive behavior guidance](hybrid-agent-tool-architecture.md#resp-001).
- Related-to: [RESP-001 — Phase-relevant guidance discovery](governance-context-resolution.md#resp-001).

#### Components and Boundaries

- **Project-local workflow Skills in `.scaffold/skills/`** are assigned-to RESP-001, RESP-002, and RESP-004. Their user interfaces define the normal Project Knowledge path: define, reconcile candidate knowledge, immediately clarify unresolved conflicts with the user, automatically accept a clean candidate, and implement when needed, as well as specialized work categories. The update-review workflow examines the two-way package candidate diff, explains additions and behavioral changes, and discusses material adoption choices with the project owner.
- **`.scaffold/skills/collect-context/`**, **`.scaffold/skills/analyze-change-impact/`**, **`.scaffold/skills/analyze-rule-conflicts/`**, **`.scaffold/skills/implement-with-tdd/`**, and **`.scaffold/skills/verify-change/`** are project-local model-invoked Skills assigned-to RESP-003. The installed package supplies corresponding candidate Skills only for initialization and update review.
- **The project-local agent guide** owns the shared convention for loading named internal Skills and supplying Scaffold policy to their callers. Workflow and tactical Skills depend on that convention rather than maintaining separate copies.
- A workflow Skill may use a model-invoked Skill, but a phase is complete when its required outcome is achieved. Project Rules may require a method, such as TDD, without changing the workflow Skill.

## Satisfies

- CAP-001 — Accepted-change lifecycle management satisfies:
  - [REQ-009 — Accepted-change lifecycle](../problem/change-lifecycle-and-reconciliation.md#req-009)
- CAP-002 — Method-flexible work guidance satisfies:
  - [REQ-009 — Accepted-change lifecycle](../problem/change-lifecycle-and-reconciliation.md#req-009)
- CAP-003 — Context and impact collection supports CAP-001 and CAP-002.
- CAP-004 — Project Knowledge reconciliation satisfies:
  - [REQ-014 — Independently reconciled Project Knowledge](../problem/change-lifecycle-and-reconciliation.md#req-014)

## Design and Decisions

<a id="dec-001"></a>

### DEC-001 — Workflow Skill owns outcomes; model-invoked Skill owns method

User-invoked workflow Skills own sequence, phase intent, entry conditions, and completion outcomes. Model-invoked Skills are tactical, reusable method guidance. For context collection, the caller selects the search content and defines sufficient evidence; the reusable method does not select a Scaffold source inventory or redefine the caller's assignment. The agent guide resolves Scaffold-specific authority, applicable guidance, and invocation policy; applicable Project Rules supply operational knowledge-classification policy. Workflow and method Skills retain task-specific outcomes and relevant-guidance declarations without restating Model/Schema authority, classification procedures, or the default knowledge taxonomy. This keeps a project free to require or replace an implementation method without creating hidden workflow branches or changing the intended work result. Project Knowledge review is read-only and feeds reconciliation; artifact and Rule evolution retain their own workflow Skills.

Returning an inference from context collection does not accept it as Project Knowledge. A proposed durable knowledge change still follows reconciliation and independent review; the lookup result supplies evidence and reasoning to its caller rather than acceptance authority.

<a id="dec-004"></a>

### DEC-004 — Git-backed candidate knowledge and independent reconciliation

For Project Knowledge, reconciliation records a Git baseline that represents the accepted state and reviews the candidate Project-Knowledge diff against that baseline. Every writer and reviewer iteration uses a fresh subagent context; the two roles must be distinct. “Fresh” means the cleanest available context: the agent independently reads the current repository and receives findings as evidence, not the previous agent’s confidence. A reviewer-discovered conflict or material ambiguity, including one missed in an earlier phase, makes the candidate `NOT ACCEPTABLE` until authoritative evidence resolves it or the user provides direction. When user direction is needed, the agent immediately asks how to resolve the matter, identifying the conflict and evidence, viable selectable alternatives and their effects, and affected candidate knowledge. The answer refreshes reconciliation context and begins a fresh writer/reviewer iteration. Blocking conflicts and unresolved ambiguities remain non-accepted. A clean independent review automatically accepts the candidate; `REVIEW_UNAVAILABLE` remains an operational result rather than an acceptance state. On completion, the workflow shows the changed Project Knowledge records and a concise semantic delta, while Git remains available for detailed inspection.

<a id="dec-005"></a>

### DEC-005 — Evidence-led definition and non-mutating handoff

`define-change` establishes a shared picture before proposing a Project Knowledge delta. It researches facts available in the repository, active knowledge, Rules, and tools; resolves material user decisions in prerequisite-aware rounds; and carries settled decisions, scenarios, assumptions, unknowns, and affected knowledge into its handoff. It does not create, edit, or draft Project Knowledge. Candidate knowledge mutation belongs only to a fresh `update-knowledge` writer within `reconcile-project-change`, followed by independent review; an unresolved conflict or material ambiguity prompts an immediate user question before a fresh iteration.

<a id="dec-002"></a>

### DEC-002 — Explicit specialization, update adoption, and migration

A substantially different work category receives an explicit additional workflow Skill rather than implicit inheritance or conditional complexity. An update-review Skill is an owner-facing adoption conversation: it analyzes what candidate artifacts add or change, what the project retains or loses by keeping local content, and whether each material difference serves the project's actual Harness needs. It asks the owner to choose `adopt`, `adapt`, `keep`, `retire`, or `defer`; it does not automatically merge. When an adopted Scaffold change requires durable semantic adaptation, migration is a deliberate project-owned workflow Skill rather than an automatic semantic rewrite.

<a id="dec-003"></a>

### DEC-003 — Small, evidence-driven Skill set

Model-invoked Skills remain concise, tactical, and reusable across workflow Skills. A new Skill is added only when an activity needs independent reusable guidance; candidate activities may remain represented by workflow phases or existing Skills rather than proliferating overlapping artifacts.

`analyze-change-impact` traces the direct and consequential effects of a specified proposed change and identifies necessary implementation, verification, or knowledge follow-up. Its caller supplies the change, scope, impact question, and applicable evidence constraints. This boundary keeps dependency tracing distinct from methods for root-cause analysis, safe generalization, performance measurement, option or adoption evaluation, and conflict analysis. Those activities use their own applicable methods; different subjects or qualitative versus quantitative results do not by themselves require separate Skills.

Change definition, candidate knowledge writing, implementation, artifact evolution, and migration use this method to identify affected elements and consistency work. Update adoption separates candidate-change effects from project-specific trade-offs and owner decisions; `analyze-rule-conflicts` retains Rule conflict analysis. Finding learning retains root-cause and generalization outcomes without assigning them to change impact analysis. Independent review may use change impact tracing to inspect dependent knowledge, while semantic and representation review remain the reviewer's responsibility.

## Verification Items

<a id="ver-001"></a>

### VER-001 — Project Knowledge reconciliation gate

Verifies:

- [AC-016 — Accepted changes are reviewed before downstream work](../problem/change-lifecycle-and-reconciliation.md#ac-016).

Scope:

- independent review as the gate before downstream implementation routing, with immediate user clarification only when a conflict or material ambiguity prevents a clean review.

Expected evidence:

- A proposed Project Knowledge delta is reconciled through distinct fresh writer and reviewer subagents; a clean review automatically accepts it before any implementation begins.

<a id="ver-002"></a>

### VER-002 — Method boundary

Verifies:

- [AC-016 — Accepted changes are reviewed before downstream work](../problem/change-lifecycle-and-reconciliation.md#ac-016).

Scope:

- separation between Workflow outcomes and project-selected methods.

Expected evidence:

- A Project Rule can require a method without changing a Workflow's required outcome.
- Changes confined to Model/Schema authority resolution or classification policy are made in the guide and applicable Rules without copying those policies into Workflow or method Skills. Task-specific review, representation, migration, and lifecycle outcomes remain explicit.

<a id="ver-003"></a>

### VER-003 — Definition-to-reconciliation mutation boundary

Verifies:

- [AC-016 — Accepted changes are reviewed before downstream work](../problem/change-lifecycle-and-reconciliation.md#ac-016).

Scope:

- evidence-led change definition, non-mutating proposal handoff, and reconciliation-owned candidate knowledge mutation.

Expected evidence:

- `define-change` gathers a sufficiently detailed shared picture and supplies a proposed delta without editing Project Knowledge; only a fresh `update-knowledge` writer within `reconcile-project-change` mutates the candidate before independent review.

<a id="ver-004"></a>

### VER-004 — Review-conflict decision routing

Verifies:

- [AC-020 — Project Knowledge is independently reconciled](../problem/change-lifecycle-and-reconciliation.md#ac-020).

Scope:

- reviewer-discovered conflicts or unresolved ambiguities during reconciliation, including immediate user decision routing and return to a fresh iteration.

Expected evidence:

- A reviewer reports a candidate with a conflict or material ambiguity, including one missed earlier, as `NOT ACCEPTABLE`; if authoritative evidence cannot resolve it, the agent immediately asks the user with the conflict and evidence, viable selectable alternatives and their effects, and affected candidate knowledge. The user clarification refreshes context and is followed by distinct fresh writer and reviewer executions. The conflict or ambiguity remains non-accepted until a clean review, which automatically accepts the candidate and shows the changed knowledge records with a concise semantic delta.
