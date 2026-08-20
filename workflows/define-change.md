# Define Change

## Goal

Turn an idea, request, problem, or discovered need into a sufficiently defined proposed knowledge change.

## Entry Conditions

- A meaningful change intent exists.
- The intended project semantics are not yet sufficiently defined.

## Phases

### Phase — Establish Change Context

#### Goal

Understand the change intent, relevant existing knowledge, and applicable rules without assuming the user's wording is the final project semantics.

#### Required Outcome

The change intent, active Knowledge Schema, Project Rules, relevant durable knowledge, and authoritative project records are identified.

#### Suggested Skills

- collect-context

### Phase — Determine Knowledge Impact

#### Goal

Determine the semantic impact and the knowledge relationships affected by the intended change.

#### Required Outcome

Affected durable knowledge, material relationships, and potentially stale records are identified according to the active Knowledge Model and Knowledge Schema. Existing authoritative records are considered before creating duplicates.

#### Suggested Skills

- analyze-impact

### Phase — Resolve Semantics

#### Goal

Establish the intended project semantics and address material ambiguity or conflict.

#### Required Outcome

Material ambiguities that evidence cannot resolve are clarified with the user or explicitly recorded. Conflicts with active knowledge are addressed, while minor non-material assumptions are recorded.

### Phase — Apply Knowledge Delta

#### Goal

Record the sufficiently defined proposed knowledge change for review.

#### Required Outcome

The proposed knowledge delta is recorded clearly enough for review, using the active Knowledge Model for semantic ownership and the active Knowledge Schema for representation.

### Phase — Confirm Downstream Readiness

#### Goal

Confirm the proposed knowledge change is sufficiently defined for its review Workflow.

#### Required Outcome

The proposed change is sufficiently defined for `review-change`; it is not accepted until that Workflow establishes acceptance.

## Required Outcomes

- Intent and expected outcome are understood.
- Relevant existing knowledge, Project Rules, and Governance knowledge are considered.
- Material ambiguities are resolved or explicitly recorded.
- Conflicts with existing project knowledge are addressed.
- The intended knowledge delta is established without assuming knowledge is append-only.
- The proposed change is sufficiently defined for `review-change`.

## Conditional Outcomes

- Update Problem Space when externally expected behavior, stakeholder goals, Use Cases, requirements, or acceptance criteria change.
- Update Governance when external contracts, policies, security controls, operational constraints, or reusable engineering rules change.
- Update Solution Space only when a durable solution-level decision is part of the proposed change.
- Identify implementation impact without requiring production code changes.
