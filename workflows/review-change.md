# Review Change

## Goal

Independently and read-only determine whether candidate Project Knowledge is semantically correct, internally consistent, and compliant with active representation rules.

## Entry Conditions

- A proposed Project Knowledge delta and candidate state exist within `reconcile-project-change`.

## Phases

### Phase — Review Semantic Correctness

#### Goal

Validate use of Knowledge Model concepts and their semantic boundaries.

#### Required Outcome

The candidate uses the active Knowledge Model's concepts, distinctions, ownership rules, evidence boundaries, invariants, and relationship semantics correctly.

### Phase — Review Representation

#### Goal

Validate the proposal against the active Knowledge Schema.

#### Required Outcome

Applicable document types, required sections, identifiers, relationship representation, and Schema-specific rules are satisfied.

### Phase — Review Relationships

#### Goal

Validate important semantic relationships affected by the proposal.

#### Required Outcome

Affected relationships are valid and internally consistent according to the active Knowledge Model.

### Phase — Review Project Constraints

#### Goal

Check applicable Project Rules and durable project constraints.

#### Required Outcome

Applicable constraints are satisfied and no unresolved material rule conflict remains.

#### Relevant Knowledge

- Applicable active-Model records that constrain the change.

#### Relevant Rules

- verification.* when Solution verification items are affected
- Other Rules applicable to the proposed change

### Phase — Report Review Result

#### Goal

Report whether the candidate can complete reconciliation; do not accept it, obtain owner approval, or mutate it.

#### Required Outcome

The reviewer reports `ACCEPTABLE` only when, within the proposed change and materially affected scope, no material semantic contradiction, unresolved ambiguity, incoherent relationship, Schema or Model violation, applicable knowledge or Rule violation, materially stale dependent knowledge, authoritative reliance on `Inferred` or `Unknown`, or required user decision remains. Otherwise it reports `NOT ACCEPTABLE` with findings classified as Resolvable, User Decision Required, Blocking Conflict, or Unresolved Ambiguity. The reviewer does not modify Project Knowledge or treat a writer summary as evidence.

## Required Outcomes

- Semantic concepts are valid.
- The active Knowledge Schema is satisfied.
- Important relationships are consistent.
- Applicable Project Rules are satisfied.
- The reviewer reports `ACCEPTABLE` or `NOT ACCEPTABLE` with concrete findings.
- Reviewed Project Knowledge remains unmodified by this Workflow.
