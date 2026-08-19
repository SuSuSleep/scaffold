# Implement Change

## Goal

Bring the implementation into compliance with an accepted change while preserving knowledge consistency.

## Entry Conditions

- An accepted change request exists.

## Phases

### Phase — Establish Context

#### Goal

Establish the request, constraints, and relevant project context.

#### Required Outcome

The requested change, applicable rules, active Knowledge Model, relevant knowledge, and affected scope are understood.

#### Suggested Skills

- collect-context

### Phase — Determine Impact

#### Goal

Determine the change's effects on behavior, interfaces, tests, and durable knowledge.

#### Required Outcome

Affected Requirements, Controls, Constraints, Contracts, implementation areas, verification needs, and knowledge updates are identified. Trace obligations through the relevant Solution concepts: Capabilities that satisfy obligations, Responsibilities that realize Capabilities, Components assigned Responsibilities, Interfaces they expose, durable Designs, and Decisions that select or constrain those Designs.

#### Suggested Skills

- analyze-impact

### Phase — Realize Change

#### Goal

Make the accepted change while preserving applicable constraints.

#### Required Outcome

The implementation satisfies the accepted change and required durable knowledge is updated without treating Components as Actors, Responsibilities as Components, Capabilities as Goals, or Decisions as replacements for Requirements.

#### Suggested Skills

- implement-with-tdd

### Phase — Verify Result

#### Goal

Demonstrate that the completed change satisfies its requirements without unacceptable regression risk.

#### Required Outcome

Proportionate verification is complete and any remaining limits or risks are known.

#### Suggested Skills

- verify-change

### Phase — Reconcile Knowledge

#### Goal

Ensure durable project knowledge reflects discoveries made while realizing and verifying the change.

#### Required Outcome

Durable discoveries are reconciled, and obsolete or incomplete knowledge is corrected where needed. Record Verification only as a strategy or as completed evidence according to what actually occurred, and preserve explicit traceability to the expectations it verifies.

## Required Outcomes

- The accepted change is implemented.
- Required durable knowledge is current.
- Proportionate verification is complete.
