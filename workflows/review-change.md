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

Requirements are not confused with Designs, Capabilities with Goals, Findings with Controls, Responsibilities with Components, or Decisions with redefinitions of Requirements.

### Phase — Review Representation

#### Goal

Validate the proposal against the active Knowledge Schema.

#### Required Outcome

Applicable document types, required sections, identifiers, relationship representation, and Schema-specific rules are satisfied.

### Phase — Review Relationships

#### Goal

Validate important semantic relationships affected by the proposal.

#### Required Outcome

Affected `derived-from`, `satisfies`, `realizes`, `constrains`, `assigned-to`, `exposes`, `verifies`, and `supersedes` relationships are internally consistent.

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

Material ambiguity or disagreement is resolved, appropriate explicit owner acceptance is obtained when needed, and the change is accepted for downstream work.

## Required Outcomes

- Semantic concepts are valid.
- The active Knowledge Schema is satisfied.
- Important relationships are consistent.
- Applicable Project Rules are satisfied.
- Material ambiguity is resolved.
- The knowledge change is accepted for downstream work.
