# Update Knowledge

## Goal

Change durable project knowledge while preserving internal logical consistency.

## Entry Conditions

- A durable knowledge change is requested or discovered.

## Phases

### Phase — Establish Knowledge Context

#### Goal

Understand the authoritative document, intended semantic change, and applicable project rules.

#### Required Outcome

The authoritative document, intended semantic change, shared Knowledge Model, active Knowledge Schema, and applicable rules are understood.

#### Suggested Skills

- collect-context

### Phase — Determine Knowledge Impact

#### Goal

Identify knowledge that depends on or is contradicted by the intended change.

#### Required Outcome

Dependent knowledge and required consistency updates are identified, including affected `derived-from`, `satisfies`, `realizes`, `constrains`, `assigned-to`, `exposes`, `verifies`, and `supersedes` relationships where applicable.

#### Suggested Skills

- analyze-impact

### Phase — Reconcile Knowledge

#### Goal

Make the semantic change while restoring internal knowledge consistency.

#### Required Outcome

Obsolete knowledge is corrected, removed, or explicitly superseded, the active Knowledge Schema is respected, and Model boundaries remain intact: Findings are not promoted directly to universal Controls, Requirements do not gain unmandated implementation detail, and completed Verification evidence is not invented.

## Required Outcomes

- Durable project knowledge reflects the intended semantic change consistently.
