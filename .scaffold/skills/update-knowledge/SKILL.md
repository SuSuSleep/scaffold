---
name: update-knowledge
description: Write a proposed Project Knowledge delta as the reconciliation writer step; this skill never accepts the candidate.
---

# Update Knowledge

## Goal

Mutate candidate Project Knowledge while restoring as much internal consistency as current evidence permits.

## Entry Conditions

- A sufficiently understood Project Knowledge delta is being reconciled.

## Phases

### Phase — Establish Knowledge Context

#### Goal

Understand the accepted Git baseline, current candidate state, intended semantic change, and applicable project rules.

#### Required Outcome

The accepted baseline, candidate diff, intended semantic change, classification decisions, selected Template when applicable, existing related project knowledge, and applicable guidance are understood before editing.

#### Relevant Knowledge

- Active-Model records being created or updated, when applicable.

#### Relevant Rules

- core.*
- documentation.*

#### Suggested Skills

- collect-context

### Phase — Determine Knowledge Impact

#### Goal

Identify knowledge that depends on or is contradicted by the intended change.

#### Required Outcome

Dependent knowledge, material relationship effects, and required consistency updates are identified.

#### Relevant Knowledge

- Any applicable active-Model record that constrains or is affected by the intended change.

#### Suggested Skills

- analyze-change-impact

### Phase — Reconcile Knowledge

#### Goal

Make the semantic change while restoring candidate knowledge consistency.

#### Required Outcome

Resolvable stale knowledge is corrected, removed, or explicitly superseded; classification decisions and material relationships are represented; each affected field is completed according to the selected Template's local instructions when applicable; and the candidate is ready for independent review. Necessary semantic migration is identified for deliberate handling. This Workflow does not accept candidate knowledge.

#### Relevant Knowledge

- Durable project knowledge remains independently evolvable and does not require Harness reinitialization.

## Required Outcomes

- Candidate Project Knowledge reflects the intended semantic change and addressed findings, ready for independent review.
