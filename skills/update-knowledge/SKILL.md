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

The accepted baseline, candidate diff, intended semantic change, its explicit knowledge-space partition, active Knowledge Schema, selected Template, existing related project knowledge, and applicable rules are understood before material interpretation or change. Apply `core.knowledge-space-partition` when it is active. The active Knowledge Model defines meaning, the Schema defines representation, and the selected Template provides its local completion instructions and starting structure.

#### Relevant Knowledge

- Active-Model records being created or updated, when applicable.

#### Relevant Rules

- core.knowledge-space-partition when active
- documentation.*

#### Suggested Skills

- collect-context

### Phase — Determine Knowledge Impact

#### Goal

Identify knowledge that depends on or is contradicted by the intended change.

#### Required Outcome

Dependent knowledge, material relationship effects, and required consistency updates are identified according to the active Knowledge Model and Knowledge Schema.

#### Relevant Knowledge

- Any applicable active-Model record that constrains or is affected by the intended change.

#### Suggested Skills

- analyze-impact

### Phase — Reconcile Knowledge

#### Goal

Make the semantic change while restoring candidate knowledge consistency.

#### Required Outcome

Resolvable stale knowledge is corrected, removed, or explicitly superseded; each affected claim remains in its proper knowledge space; material cross-space relationships are explicit; each affected field is completed according to the selected Template's local instructions; the active Knowledge Schema is respected; and the candidate is ready for independent review. Schema or Template changes do not automatically rewrite project knowledge; use deliberate migration when semantic adaptation is required. This Workflow does not accept candidate knowledge.

#### Relevant Knowledge

- Durable project knowledge remains independently evolvable and does not require Harness reinitialization.

## Required Outcomes

- Candidate Project Knowledge reflects the intended semantic change and addressed findings, ready for independent review.
