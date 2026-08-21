# Review Change

## Goal

Determine whether a defined knowledge change is semantically correct, internally consistent, compliant with the active representation rules, and acceptable for downstream work.

## Entry Conditions

- A proposed durable knowledge change has been defined.

## Phases

### Phase — Review Semantic Correctness

#### Goal

Validate use of Knowledge Model concepts and their semantic boundaries.

#### Required Outcome

Requirements are not confused with Designs, Capabilities with Goals, Findings with Controls, Responsibilities with Components, or Decisions with redefinitions of Requirements. Each Acceptance Criterion has one Requirement owner; prerequisites are observable conditions rather than shared Criterion ownership, and required interactions become explicit Requirements.

### Phase — Review Representation

#### Goal

Validate the proposal against the active Knowledge Schema.

#### Required Outcome

Applicable document types, required sections, identifiers, relationship representation, and Schema-specific rules are satisfied.

### Phase — Review Relationships

#### Goal

Validate important semantic relationships affected by the proposal.

#### Required Outcome

Affected `derived-from`, `satisfies`, `realizes`, `constrains`, `assigned-to`, `exposes`, `verifies`, and `supersedes` relationships are internally consistent. Normal Verification Items target one Acceptance Criterion and state bounded evidence scope.

### Phase — Review Project Constraints

#### Goal

Check applicable Project Rules and Governance constraints.

#### Required Outcome

Applicable constraints are satisfied and no unresolved material rule conflict remains.

#### Relevant Governance

- Applicable Governance controls and constraints.

#### Relevant Rules

- verification.* when Solution verification items are affected
- Other Rules applicable to the proposed change

### Phase — Establish Acceptance

#### Goal

Determine whether the proposed change may become authoritative project knowledge.

#### Required Outcome

Material ambiguity or disagreement is resolved, appropriate explicit owner acceptance is obtained when needed, and the accepted change is routed to `update-knowledge`, `implement-change`, `evolve-project-rules`, `evolve-project-artifact`, or an appropriate sequence of those Workflows.

## Required Outcomes

- Semantic concepts are valid.
- The active Knowledge Schema is satisfied.
- Important relationships are consistent.
- Applicable Project Rules are satisfied.
- Material ambiguity is resolved.
- The accepted change has an explicit downstream Workflow route; implementation is not assumed to be the only destination.
