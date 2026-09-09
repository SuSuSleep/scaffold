---
name: reconcile-project-change
description: Reconcile a proposed Project Knowledge change through independent writing, direct user conflict resolution, and automatic clean-review acceptance.
---

# Reconcile Project Change

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Converge a proposed Project Knowledge delta through independent review, resolve material findings directly with the user, and automatically accept a clean candidate.

## Entry Conditions

- A sufficiently defined proposed Project Knowledge delta exists.
- A Git baseline that represents the accepted Project Knowledge state can be identified.

## Phases

### Phase — Establish Reconciliation Context

#### Goal

Establish the intended delta, accepted baseline, candidate scope, and applicable constraints.

#### Required Outcome

The proposed semantic delta, its explicit knowledge-space partition, recorded Git baseline, materially affected Project Knowledge, applicable active-Model knowledge and Project Rules, and unresolved user intent are known. Apply `core.knowledge-space-partition` when it is active. The candidate state is the current Project-Knowledge diff from that baseline; unrelated repository changes are excluded from the review scope.

### Phase — Reconcile Candidate Knowledge

#### Goal

Update candidate Project Knowledge from the proposal and current resolvable findings.

#### Required Outcome

A fresh writer subagent executes `update-knowledge`, independently inspects the current repository, applies the active knowledge-space partition Rule, and updates the candidate state. The writer has no authority to accept the result.

### Phase — Independently Review Candidate

#### Goal

Determine whether the current candidate state is semantically acceptable.

#### Required Outcome

A distinct fresh reviewer subagent executes `review-change`. It independently inspects the Git baseline, candidate Project-Knowledge diff, current repository, proposed intent, materially affected knowledge, active Model and Schema, and applicable active-Model knowledge and Rules. The reviewer does not modify reviewed Project Knowledge.

### Phase — Resolve Review Result

#### Goal

Route findings without treating narrative confidence as evidence.

#### Required Outcome

Resolvable findings are inputs to another fresh writer/reviewer iteration. A reviewer-discovered conflict or material ambiguity, including one not identified in an earlier phase, is `NOT ACCEPTABLE` until authoritative evidence resolves it or the user provides direction. When a finding needs user direction, the agent immediately asks the user how to resolve it; the question identifies the finding and evidence, viable selectable alternatives and their effects, and the affected candidate knowledge. The user response refreshes the reconciliation context and starts another fresh writer/reviewer iteration. Blocking Conflicts and Unresolved Ambiguities remain non-accepted until resolved. Unavailable independent review produces `REVIEW_UNAVAILABLE`. A clean independent review automatically accepts the candidate and shows the changed Project Knowledge records with a concise semantic delta.

### Phase — Determine Implementation Need

#### Goal

Route accepted Project Knowledge to executable implementation only when needed.

#### Required Outcome

`implement-change` begins only when the Project Knowledge is `ACCEPTED` and implementation impact exists. A no-impact accepted knowledge change completes here. A discovery during implementation that materially changes Project Knowledge semantics returns to this Workflow; mechanical synchronization may remain in implementation.

## Required Outcomes

- Candidate Project Knowledge is distinguishable from its accepted Git baseline.
- Every writer and reviewer iteration uses distinct fresh subagent contexts.
- `review-change` is read-only and reports either `ACCEPTABLE` or `NOT ACCEPTABLE` with findings.
- Project Knowledge is accepted automatically after clean independent review, and completion shows the changed records with a concise semantic delta.
