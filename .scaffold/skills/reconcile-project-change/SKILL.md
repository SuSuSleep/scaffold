---
name: reconcile-project-change
description: Reconcile a proposed Project Knowledge change through independent writing, review, and required owner decisions.
---

# Reconcile Project Change

## Goal

Converge a proposed Project Knowledge delta into a reviewed candidate state, then obtain required project-owner review before it becomes accepted Project Knowledge.

## Entry Conditions

- A sufficiently defined proposed Project Knowledge delta exists.
- A Git baseline that represents the accepted Project Knowledge state can be identified.

## Phases

### Phase — Establish Reconciliation Context

#### Goal

Establish the intended delta, accepted baseline, candidate scope, and applicable constraints.

#### Required Outcome

The proposed semantic delta, recorded Git baseline, materially affected Project Knowledge, applicable active-Model knowledge and Project Rules, and unresolved user intent are known. The candidate state is the current Project-Knowledge diff from that baseline; unrelated repository changes are excluded from the review scope.

### Phase — Reconcile Candidate Knowledge

#### Goal

Update candidate Project Knowledge from the proposal and current resolvable findings.

#### Required Outcome

A fresh writer subagent executes `update-knowledge`, independently inspects the current repository, and updates the candidate state. The writer has no authority to accept the result.

### Phase — Independently Review Candidate

#### Goal

Determine whether the current candidate state is semantically acceptable.

#### Required Outcome

A distinct fresh reviewer subagent executes `review-change`. It independently inspects the Git baseline, candidate Project-Knowledge diff, current repository, proposed intent, materially affected knowledge, active Model and Schema, and applicable active-Model knowledge and Rules. The reviewer does not modify reviewed Project Knowledge.

### Phase — Resolve Review Result

#### Goal

Route findings without treating narrative confidence as evidence.

#### Required Outcome

Resolvable findings are inputs to another fresh writer/reviewer iteration. A required user decision produces `AWAITING_USER_DECISION`; unavailable independent review produces `REVIEW_UNAVAILABLE`. A clean review completes reconciliation and produces `AWAITING_OWNER_REVIEW` when owner review is required, otherwise `ACCEPTED`.

### Phase — Obtain Required Owner Review

#### Goal

Obtain the project-owner decision after clean reconciliation when applicable.

#### Required Outcome

Required owner review either promotes the clean candidate to `ACCEPTED`, supplies a new clarification for another reconciliation iteration, or leaves the change `AWAITING_OWNER_REVIEW`. Owner review is not performed by the writer or reviewer subagent.

### Phase — Determine Implementation Need

#### Goal

Route accepted Project Knowledge to executable implementation only when needed.

#### Required Outcome

`implement-change` begins only when the Project Knowledge is `ACCEPTED` and implementation impact exists. A no-impact accepted knowledge change completes here. A discovery during implementation that materially changes Project Knowledge semantics returns to this Workflow; mechanical synchronization may remain in implementation.

## Required Outcomes

- Candidate Project Knowledge is distinguishable from its accepted Git baseline.
- Every writer and reviewer iteration uses distinct fresh subagent contexts.
- `review-change` is read-only and reports either `ACCEPTABLE` or `NOT ACCEPTABLE` with findings.
- Project Knowledge is accepted only after clean reconciliation and any required owner review.
