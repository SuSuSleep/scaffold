# Project Knowledge Reconciliation Loop and Independent Review — PRD Delta

## Purpose

Refine Scaffold's Project Knowledge change lifecycle so correctness does not depend on a single Agent pass.

Project Knowledge changes SHALL converge through an iterative writer/reviewer loop. Git SHALL distinguish the recorded accepted baseline from the candidate Project-Knowledge diff. A clean independent review completes reconciliation; required project-owner review occurs after reconciliation and promotes the candidate to accepted knowledge:

```text
User Intent
    ↓
define-change
    ↓
Proposed Project Knowledge Delta
    ↓
reconcile-project-change
    │
    ├─ fresh update agent
    │      ↓
    │  update-knowledge
    │      ↓
    │  Candidate Project Knowledge
    │      ↓
    ├─ fresh review agent
    │      ↓
    │  review-change
    │      ↓
    │  findings?
    │    │      │
    │   yes     no
    │    │      │
    │    └──────┘ iterate
    │           ↓
    └──── Clean Reconciliation
                    ↓
             required owner review
                    ↓
         Accepted Project Knowledge
                    ↓
          implementation needed?
                 │       │
                yes      no
                 ↓       ↓
         implement-change done
```

The lifecycle explicitly separates:

- change definition;
- knowledge mutation;
- independent review;
- convergence;
- acceptance;
- executable implementation.

---

# 1. Scope

This PRD applies to **Project Knowledge**:

```text
Problem
Governance
Solution
```

Examples include:

- Requirements;
- Acceptance Criteria;
- External Contracts;
- Controls and Constraints;
- Capabilities;
- Responsibilities;
- Interfaces;
- Designs;
- Decisions;
- Verification Items.

This PRD does NOT define the lifecycle for:

```text
Project Rules
Knowledge Schema
Workflow
Skill
Template
```

Those remain governed by their respective Harness evolution Workflows.

---

# 2. Problem

A single review pass cannot reliably guarantee that a non-trivial Project Knowledge change has fully resolved:

- contradictions;
- stale relationships;
- dependent knowledge;
- semantic ambiguity;
- incomplete updates;
- incorrect assumptions;
- newly introduced inconsistencies.

A writer that reviews its own change is also vulnerable to retaining assumptions from its own previous reasoning.

For example:

```text
update REQ-003
    ↓
update DEC-002
    ↓
forget VER-004
```

or:

```text
fix conflict A
    ↓
creates new conflict B
```

Therefore Project Knowledge acceptance MUST NOT depend on:

```text
write once
→ review once
→ assume complete
```

---

# 3. Core Decision

Project Knowledge changes SHALL use an iterative convergence loop.

The responsibilities are:

```text
define-change
= define proposed semantic delta

update-knowledge
= mutate candidate Project Knowledge

review-change
= independently inspect candidate Project Knowledge

reconcile-project-change
= own Git-backed iteration, convergence, and clean-review result; route required owner review
```

---

# 4. New Workflow: `reconcile-project-change`

Scaffold SHALL introduce:

```text
workflows/reconcile-project-change.md
```

Its responsibility is to orchestrate Project Knowledge convergence.

It SHALL NOT itself replace the responsibilities of `update-knowledge` or `review-change`.

---

# 5. Reconciliation Workflow

Recommended phases:

```text
Establish Reconciliation Context
        ↓
Reconcile Candidate Knowledge
        ↓
Independently Review Candidate
        ↓
Resolve Review Result
        ├── findings → iterate
        ├── user decision → clarify → iterate
        └── clean → accept
        ↓
Determine Implementation Need
```

---

# 6. Phase — Establish Reconciliation Context

## Goal

Establish the proposed Project Knowledge delta and the materially affected knowledge scope.

## Required Outcome

The following are known:

- proposed semantic delta;
- active Knowledge Model;
- active Knowledge Schema;
- materially affected Project Knowledge;
- applicable Governance;
- applicable Project Rules;
- unresolved user intent already identified by `define-change`.

The affected scope SHALL be broad enough to include dependent knowledge that may become inconsistent.

---

# 7. Phase — Reconcile Candidate Knowledge

## Goal

Apply the proposed delta and current review findings to Candidate Project Knowledge.

## Required Outcome

A **fresh writer agent** executes `update-knowledge`.

The writer SHALL inspect the actual current repository state before modifying knowledge.

The writer MAY receive:

- original proposed delta;
- current unresolved review findings;
- clarified user decisions.

The writer MUST NOT receive authority to accept the result as correct.

---

# 8. Writer Independence Rule

Every reconciliation iteration SHALL use a fresh writer context.

The writer MUST NOT assume that:

```text
a previous iteration said something was fixed
```

means that the current repository is correct.

It SHALL read the actual current knowledge state.

Core invariant:

> **The Agent that mutates Candidate Project Knowledge does not have authority to accept that knowledge.**

---

# 9. `update-knowledge` Responsibility

`update-knowledge` SHALL become explicitly mutation-oriented.

Its responsibility is:

> Apply a sufficiently understood Project Knowledge delta and supplied review findings while restoring as much consistency as possible.

Its Required Outcome SHALL NOT state or imply:

```text
the Project Knowledge is now accepted
```

Instead:

> The current Candidate Project Knowledge reflects the requested semantic delta and addressed findings and is ready for independent review.

---

# 10. Phase — Independently Review Candidate

## Goal

Independently determine whether the resulting Candidate Project Knowledge is semantically acceptable.

## Required Outcome

A **fresh reviewer agent** executes `review-change`.

The reviewer SHALL independently inspect:

- actual repository state;
- proposed intent;
- affected Project Knowledge;
- Knowledge Model;
- active Knowledge Schema;
- applicable Governance;
- applicable Project Rules.

The reviewer MUST NOT trust the writer's completion summary as evidence of correctness.

---

# 11. Reviewer Read-Only Rule

`review-change` SHALL be read-only with respect to the Project Knowledge it reviews.

It MUST NOT:

```text
fix a Requirement;
rewrite an Acceptance Criterion;
update a Decision;
repair a relationship;
remove an Inferred marker;
silently resolve ambiguity.
```

It SHALL only report findings and its review result.

Core invariant:

> **A reviewer must not modify the Candidate Project Knowledge it is responsible for accepting or rejecting.**

---

# 12. Review Scope

Every review iteration SHALL re-review the materially affected knowledge scope.

Previous findings are mandatory re-check targets, but review MUST NOT be limited only to those findings.

Example:

```text
Iteration 1:
F1
F2
F3

Writer fixes F1–F3.

Iteration 2 reviewer:
re-check F1–F3
+
review affected scope again
+
may discover F4
```

This prevents a fix from introducing an unnoticed new contradiction.

---

# 13. Review Findings

`review-change` SHALL distinguish at least:

### Resolvable Finding

The repository contains enough authoritative information for the next writer to resolve the issue.

Examples:

```text
stale copied reference;
obsolete Verification Item;
inconsistent relationship;
Schema representation mismatch.
```

### User Decision Required

Available evidence cannot establish intended semantics.

Example:

```text
REQ says retry indefinitely;
DEC says retry three times;
no authoritative evidence resolves the intent.
```

### Blocking Conflict

The Candidate Project Knowledge currently contains incompatible authoritative statements.

### Unresolved Ambiguity

The meaning is insufficiently precise and different interpretations could materially change downstream implementation or knowledge.

---

# 14. Review Result

`review-change` SHALL produce one of two semantic outcomes:

```text
NOT ACCEPTABLE
ACCEPTABLE
```

`NOT ACCEPTABLE` includes concrete findings.

`ACCEPTABLE` means the exit conditions defined by this PRD are satisfied.

The reviewer SHALL NOT produce:

```text
probably acceptable
mostly complete
safe enough
```

when material uncertainty remains.

---

# 15. User Clarification Path

If a finding requires project-owner intent:

```text
review-change
    ↓
User Decision Required
    ↓
reconcile-project-change asks user
    ↓
decision becomes reconciliation input
    ↓
fresh update agent
    ↓
fresh review agent
```

The reviewer itself SHALL NOT invent the missing intent.

---

# 16. Inferred / Unknown Knowledge

If the Candidate Project Knowledge materially relies on:

```text
Status: Inferred
```

or:

```text
Status: Unknown
```

the reviewer SHALL treat that as unresolved unless sufficient review or user clarification establishes authoritative meaning.

Example:

```text
Implementation depends on REQ-006
REQ-006 is Inferred
```

Result:

```text
NOT ACCEPTABLE
→ User review required
```

After clarification:

```text
fresh writer
→ update / remove exceptional state

fresh reviewer
→ review again
```

---

# 17. Acceptance Boundary

A Project Knowledge change becomes authoritative only after a fresh `review-change` execution returns `ACCEPTABLE` and any required project-owner review accepts the reconciled candidate.

The writer cannot establish acceptance.

The orchestrator cannot infer acceptance from absence of obvious errors.

Acceptance is a positive reviewer result.

---

# 18. Acceptance Exit Conditions

`review-change` MAY return `ACCEPTABLE` only when, within the proposed change and its materially affected scope:

1. no material semantic contradiction remains;
2. no unresolved ambiguity could materially change intended meaning;
3. affected relationships are coherent;
4. affected knowledge follows the Knowledge Model;
5. representation follows the active Knowledge Schema;
6. applicable Governance constraints are satisfied;
7. applicable Project Rules are satisfied;
8. no known dependent durable knowledge remains materially stale;
9. no `Inferred` or `Unknown` item is being relied upon as authoritative;
10. no required user decision remains unresolved.

The entire repository does NOT need to be globally perfect.

The review boundary is:

> the proposed change and its materially affected knowledge scope.

---

# 19. One Clean Review Is the Default

Scaffold SHALL require one independent clean review after the latest writer iteration. That clean result completes reconciliation; required owner review occurs after reconciliation and before acceptance.

Default:

```text
writer
→ reviewer
→ ACCEPTABLE
→ convergence complete
```

Scaffold SHALL NOT require two consecutive clean reviews by default.

Projects MAY introduce stricter Project Rules for higher-risk work, such as:

```text
two independent clean reviews
security-owner review
domain-owner approval
```

Such policy is project-specific rather than a Harness invariant.

---

# 20. Thin Agent Handoff

Agents SHOULD communicate through durable state and concrete findings rather than narrative confidence.

## Writer → Reviewer

Useful input:

- original proposed semantic delta;
- affected scope;
- current repository state.

Avoid treating statements such as:

```text
"I fixed everything"
```

as review evidence.

## Reviewer → Writer

Provide:

- finding;
- evidence;
- affected knowledge references;
- why it conflicts or remains ambiguous;
- whether user clarification is required.

---

# 21. Actual Repository State Is Authoritative for Iteration

Every writer and reviewer iteration SHALL independently inspect current files.

Agent handoff summaries are context only.

They MUST NOT replace repository inspection.

Principle:

> **State is carried by the repository; findings are carried by the review result; confidence is not inherited between Agents.**

---

# 22. Project Knowledge vs Executable Implementation

Successful reconciliation establishes:

```text
what the software is intended to mean
```

It does NOT require all implementation choices to be known.

Example:

Accepted knowledge may establish:

```text
accepted work survives service restart
```

without deciding:

```text
PostgreSQL
SQLite
Redis
WAL
event sourcing
```

Those may be explored during implementation as long as the resulting realization satisfies authoritative Project Knowledge.

Therefore:

```text
Project semantic acceptance
≠ implementation design fully predetermined
```

---

# 23. Downstream Implementation

After Project Knowledge converges:

```text
implementation impact?
```

If no:

```text
reconciliation complete
```

If yes:

```text
implement-change
```

`implement-change` SHALL consume the newly authoritative Project Knowledge as its specification boundary.

---

# 24. Harness Evolution Is Explicitly Excluded

The following SHALL NOT use this Project Knowledge writer/reviewer loop by default:

```text
Project Rules
Knowledge Schema
Workflow
Skill
Template
```

Their semantic artifacts are themselves the Harness realization.

They remain under:

```text
evolve-project-rules
evolve-project-artifact
```

Those Workflows may contain their own internal semantic review, but they do not route through Project Knowledge `review-change`.

---

# 25. Updated Lifecycle

The intended normal Project Knowledge lifecycle becomes:

```text
User Intent
    ↓
define-change
    ↓
Proposed Project Knowledge Delta
    ↓
reconcile-project-change
    ↓
┌─────────────────────────────┐
│ update-knowledge            │
│      ↓                      │
│ review-change               │
│      ↓                      │
│ findings → loop             │
└─────────────────────────────┘
    ↓
Clean Reconciliation
    ↓
required owner review
    ↓
Accepted Project Knowledge
    ↓
implementation required?
    │
    ├─ no → complete
    │
    └─ yes
         ↓
   implement-change
```

---

# 26. Workflow Responsibility Summary

| Workflow                   | Responsibility                                                                   |
| -------------------------- | -------------------------------------------------------------------------------- |
| `define-change`            | Convert user intent into a sufficiently defined proposed Project Knowledge delta |
| `reconcile-project-change` | Own Git-backed writer/reviewer iteration, convergence, and required owner-review routing |
| `update-knowledge`         | Mutate Candidate Project Knowledge according to the proposal and review findings |
| `review-change`            | Independently and read-only review Candidate Project Knowledge                   |
| `implement-change`         | Realize authoritative Project Knowledge in executable implementation             |

---

# 27. Required Changes — `define-change`

Update `define-change` so its terminal outcome is:

> A sufficiently defined proposed **Project Knowledge delta** is ready for reconciliation.

Remove routing from `define-change` / `review-change` to:

```text
evolve-project-rules
evolve-project-artifact
```

Harness semantic changes use their evolution Workflows directly.

---

# 28. Required Changes — `review-change`

Refactor `review-change` into a focused independent review Workflow.

Suggested phases:

```text
Establish Review Context
        ↓
Review Semantic and Representation Consistency
        ↓
Review Conflicts and Dependencies
        ↓
Report Review Result
```

It SHALL NOT modify Project Knowledge.

Its output is:

```text
ACCEPTABLE
```

or:

```text
NOT ACCEPTABLE
+
findings
```

---

# 29. Required Changes — `update-knowledge`

Refactor `update-knowledge` into the candidate mutation Workflow.

Suggested phases:

```text
Establish Update Context
        ↓
Apply Semantic Change
        ↓
Address Review Findings
        ↓
Reconcile Dependent Knowledge
        ↓
Prepare Candidate for Review
```

It SHALL NOT claim acceptance.

---

# 30. Required Changes — `implement-change`

Update its Entry Conditions from a generic accepted change to:

> Authoritative Project Knowledge exists for the implementation-affecting change.

Implementation MAY discover additional durable knowledge issues.

If such discoveries materially change authoritative Project Knowledge semantics, they MUST return through the Project Knowledge reconciliation lifecycle rather than being silently rewritten and accepted by the implementation Agent.

Mechanical knowledge synchronization that does not alter semantics MAY remain part of implementation reconciliation.

---

# 31. Subagent Execution Contract

`reconcile-project-change` SHALL require distinct fresh subagent executions for mutation and review. “Fresh” means the cleanest available context: each subagent independently inspects the current repository and treats handoff findings as evidence rather than inheriting another agent's confidence.

Conceptually:

```text
Iteration N:

Agent U-N
→ update-knowledge

Agent R-N
→ review-change
```

The same Agent context MUST NOT perform both roles in one iteration.

A new iteration MUST use new fresh subagent contexts again:

```text
U-1 → R-1
U-2 → R-2
U-3 → R-3
```

---

# 32. Failure to Obtain Independent Review

If the execution environment cannot obtain an independent fresh reviewer, the Workflow MUST NOT falsely report full reconciliation acceptance. It SHALL report `REVIEW_UNAVAILABLE` and block acceptance and implementation.

---

# 33. Required Agent Guide Changes

Update the default Agent Guide to explain:

```text
Project Knowledge change
→ define-change
→ reconcile-project-change
→ implement-change when needed
```

It SHALL explicitly state:

- writer and reviewer roles are separate;
- reviewer is read-only;
- acceptance belongs to the reconciliation lifecycle;
- actual repository state must be independently inspected;
- Harness changes use separate evolution Workflows.

---

# 34. Required Durable Knowledge Changes

Reconcile Scaffold's own Project Knowledge describing:

- accepted-change lifecycle;
- Workflow responsibilities;
- Agent method boundaries;
- Project Knowledge authority;
- update/review responsibilities;
- implementation entry conditions.

At minimum review:

```text
knowledge/problem/scaffold-product.md
knowledge/solution/change-lifecycle-and-methods.md
knowledge/solution/knowledge-architecture.md
knowledge/solution/default-artifacts.md
```

---

# 35. Acceptance Criteria

- [ ] Project Knowledge changes support iterative reconciliation.
- [ ] A dedicated `reconcile-project-change` Workflow owns the loop.
- [ ] `update-knowledge` mutates Candidate Project Knowledge but cannot accept it.
- [ ] `review-change` reviews but does not mutate Project Knowledge.
- [ ] Every update iteration uses a fresh writer Agent context.
- [ ] Every review iteration uses a fresh reviewer Agent context.
- [ ] Writer and reviewer are not the same Agent execution.
- [ ] Reviewers inspect actual repository state rather than trusting writer summaries.
- [ ] Previous findings are rechecked but do not restrict the next review scope.
- [ ] A new review may discover new findings introduced by previous fixes.
- [ ] Findings distinguish resolvable issues from required user decisions.
- [ ] Unresolved user intent prevents acceptance.
- [ ] Material reliance on `Inferred` or `Unknown` prevents acceptance.
- [ ] One independent clean review closes reconciliation by default; required owner review accepts the candidate afterwards.
- [ ] Projects may require stronger review policy through Project Rules.
- [ ] Successful reconciliation plus any required owner review makes Project Knowledge authoritative.
- [ ] Executable implementation begins only after required Project Knowledge has converged.
- [ ] Harness semantic artifacts do not use this Project Knowledge loop by default.

---

# Core Invariants

1. **Project Knowledge correctness is achieved through convergence, not assumed from one pass.**
2. **The writer cannot accept its own knowledge change.**
3. **The reviewer cannot modify the knowledge it reviews.**
4. **Every review independently inspects actual repository state.**
5. **A review iteration covers the materially affected scope, not only previous findings.**
6. **Material ambiguity and contradiction block acceptance.**
7. **User intent is requested rather than fabricated when evidence is insufficient.**
8. **Project Knowledge becomes authoritative only after an independent clean review and any required project-owner review.**
9. **Semantic acceptance does not eliminate legitimate implementation freedom.**
10. **Harness semantic evolution remains a separate lifecycle.**

---

# Implementation Worklist

## P0 — Workflow Architecture

### 1. Add `reconcile-project-change`

Create:

```text
workflows/reconcile-project-change.md
```

Implement phases for:

- reconciliation context;
- fresh writer dispatch;
- fresh reviewer dispatch;
- review-result handling;
- user clarification;
- iteration;
- acceptance;
- implementation routing.

---

### 2. Refocus `define-change`

Update:

```text
workflows/define-change.md
```

Its output SHALL be:

```text
sufficiently defined proposed Project Knowledge delta
```

Remove responsibility for Harness artifact evolution.

Remove downstream routing to:

```text
evolve-project-rules
evolve-project-artifact
```

---

### 3. Make `review-change` read-only

Update:

```text
workflows/review-change.md
```

Remove any responsibility to:

- apply changes;
- accept and write Project Knowledge;
- invoke Harness evolution.

Add explicit:

```text
MUST NOT modify reviewed Project Knowledge
```

Output only:

```text
ACCEPTABLE
```

or:

```text
NOT ACCEPTABLE + findings
```

---

### 4. Refocus `update-knowledge`

Update:

```text
workflows/update-knowledge.md
```

Make it explicitly candidate-state mutation.

Required Outcome:

```text
Candidate Project Knowledge is ready for independent review.
```

Remove any claim that consistency is finally established.

---

## P0 — Independent Agent Contract

### 5. Define fresh writer execution

`reconcile-project-change` SHALL state that every update pass runs in a fresh Agent/subagent context.

The writer must inspect current files.

---

### 6. Define fresh reviewer execution

Every review pass SHALL use a fresh Agent/subagent context independent from the writer.

The reviewer must independently inspect current files.

---

### 7. Prevent role collapse

Add explicit guidance that one Agent execution cannot serve simultaneously as:

```text
writer
+
accepting reviewer
```

for the same iteration.

---

### 8. Define unsupported-runtime behavior

If fresh independent delegation is unavailable:

```text
reconciliation acceptance remains incomplete
```

Do not falsely declare the knowledge accepted.

---

## P0 — Review Semantics

### 9. Define clean-review exit criteria

Add the ten acceptance conditions from this PRD to `review-change`.

Keep scope limited to:

```text
proposed change
+
materially affected knowledge
```

---

### 10. Define finding categories

At minimum:

```text
Resolvable
User Decision Required
Blocking Conflict
Unresolved Ambiguity
```

---

### 11. Require full affected-scope re-review

Previous findings SHALL be mandatory targets but not the full next review scope.

Document explicitly:

```text
fixing existing findings may introduce new findings
```

---

### 12. Integrate Inferred / Unknown boundary

If materially relied upon:

```text
Inferred
Unknown
```

→ review cannot return `ACCEPTABLE`.

---

## P1 — Lifecycle Integration

### 13. Update Agent Guide routing

Change normal Project Knowledge path to:

```text
define-change
→ reconcile-project-change
→ implement-change if needed
```

Harness path:

```text
evolve-project-rules
or
evolve-project-artifact
```

---

### 14. Update `implement-change` entry conditions

Require authoritative Project Knowledge for semantic changes.

Clarify that implementation freedom remains as long as the realization satisfies authoritative knowledge.

---

### 15. Define implementation discovery behavior

If implementation discovers a semantic Project Knowledge change:

```text
do not silently self-accept
→ initiate Project Knowledge reconciliation
```

Purely mechanical synchronization may remain local to implementation.

---

## P1 — Existing Workflow Cleanup

### 16. Remove duplicate acceptance from `update-knowledge`

Search for wording implying:

```text
update-knowledge establishes correctness
update-knowledge accepts knowledge
```

Replace with candidate-state semantics.

---

### 17. Remove Harness routing from `review-change`

Remove:

```text
evolve-project-rules
evolve-project-artifact
```

from Project Knowledge review completion.

---

### 18. Review `learn-from-finding`

If it produces new Project Knowledge, determine whether its output should:

```text
feed reconcile-project-change
```

rather than directly becoming authoritative.

A finding-derived Control / Constraint / Requirement should not bypass independent knowledge review.

---

### 19. Review reconstruction acceptance

`reconstruct-project-knowledge` produces `Inferred` / `Unknown` candidate knowledge.

Ensure any knowledge promoted to authoritative state uses an independent review boundary consistent with this PRD.

---

## P1 — Durable Scaffold Knowledge

### 20. Update lifecycle Solution knowledge

Review and reconcile:

```text
knowledge/solution/change-lifecycle-and-methods.md
```

Document:

```text
define
→ reconcile writer/reviewer loop
→ authoritative knowledge
→ executable implementation
```

---

### 21. Update Product Requirements / AC

Review:

```text
knowledge/problem/scaffold-product.md
```

Add or revise requirements covering:

- iterative Project Knowledge convergence;
- independent review;
- writer/reviewer separation;
- acceptance only after clean review.

---

### 22. Update authority knowledge

Review:

```text
knowledge/solution/knowledge-architecture.md
```

Clarify:

```text
Project Knowledge authority
≠ writer authority

review acceptance
→ promotes candidate state to authoritative state
```

---

## P1 — Skills

### 23. Review `collect-context`

Writer and reviewer both need actual current repository context.

Ensure it does not encourage trusting previous Agent summaries over repository state.

---

### 24. Review `analyze-impact`

Reviewer should use impact analysis to establish materially affected knowledge scope.

Do not require whole-repository review by default.

---

## P1 — Tests

### 25. Workflow structure tests

Verify:

```text
reconcile-project-change
```

exists and defines explicit iterative writer/reviewer phases.

---

### 26. Reviewer read-only contract test

Assert `review-change` contains explicit read-only semantics and does not instruct modification of reviewed Project Knowledge.

---

### 27. Writer non-acceptance test

Assert `update-knowledge` does not claim final acceptance.

---

### 28. Routing tests

Ensure Agent Guide routes:

```text
Project Knowledge
→ reconcile-project-change

Harness Rules
→ evolve-project-rules

Schema / Workflow / Skill / Template
→ evolve-project-artifact
```

---

### 29. Inferred/Unknown review test

Default guidance must state that material reliance on either exceptional trust state blocks acceptance.

---

### 30. Independent review test

Test documentation/guidance for:

```text
fresh writer
fresh reviewer
actual repository inspection
```

Avoid merely testing the words `subagent`; test the semantic contract.

---

## P2 — Documentation Cleanup

### 31. Update README lifecycle explanation

Show the two distinct paths:

```text
Project semantic change
→ reconcile
→ implementation

Harness semantic change
→ evolve
→ complete
```

---

### 32. Remove stale lifecycle descriptions

Search repository for assumptions such as:

```text
review-change → update-knowledge
review-change → evolve-project-rules
review-change → evolve-project-artifact
single-pass acceptance
```

Reconcile them with this PRD.

---

# Recommended Execution Order

```text
1. Update durable lifecycle semantics
2. Add reconcile-project-change
3. Refactor review-change
4. Refactor update-knowledge
5. Refocus define-change
6. Update implement-change
7. Reconcile learn-from-finding / reconstruction routing
8. Update Agent Guide
9. Update Skills
10. Update Scaffold's own Problem/Solution knowledge
11. Update tests
12. Full repository lifecycle consistency review
```

## Final Exit Condition

This change is complete when Scaffold can express the following without ambiguity:

```text
A Project Knowledge change is not authoritative because an Agent wrote it.

It becomes authoritative only after an independent reviewer,
operating from the resulting repository state, finds no material
conflict, unresolved ambiguity, stale affected knowledge, or unresolved
required user decision, and after any required project-owner review accepts
the reconciled candidate.

If findings remain, a fresh writer updates the knowledge and a fresh
reviewer reviews it again until the affected scope converges.
```
