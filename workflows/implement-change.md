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

The requested change, applicable rules, relevant durable knowledge, and affected scope are understood.

#### Relevant Governance

- Applicable Security Controls and Architecture Constraints.

#### Relevant Rules

- coding.*
- documentation.*
- security.*
- architecture.*

#### Suggested Skills

- collect-context

### Phase — Determine Impact

#### Goal

Determine the change's effects on behavior, interfaces, tests, and durable knowledge.

#### Required Outcome

Relevant obligations, constraints, implementation areas, verification needs, and durable knowledge updates are identified according to the active Knowledge Model and Knowledge Schema.

#### Relevant Governance

- Applicable Security Controls and Architecture Constraints.

#### Relevant Rules

- verification.*
- security.*

#### Suggested Skills

- analyze-impact

### Phase — Realize Change

#### Goal

Make the accepted change while preserving applicable constraints.

#### Required Outcome

The implementation satisfies the accepted change, applicable constraints are preserved, and required durable knowledge is updated according to the active Knowledge Model and Knowledge Schema.

#### Relevant Governance

- Applicable Security Controls and Architecture Constraints.

#### Relevant Rules

- coding.*
- security.*
- architecture.*

#### Suggested Skills

- implement-with-tdd

### Phase — Verify Result

#### Goal

Demonstrate that the completed change satisfies its requirements without unacceptable regression risk.

#### Required Outcome

Proportionate verification is complete and any remaining limits or risks are known.

#### Relevant Governance

- Applicable Security Controls.

#### Relevant Rules

- verification.*
- security.*

#### Suggested Skills

- verify-change

### Phase — Reconcile Knowledge

#### Goal

Ensure durable project knowledge reflects discoveries made while realizing and verifying the change.

#### Required Outcome

Durable discoveries are reconciled and obsolete or incomplete knowledge is corrected where needed, with evidence and relationships represented according to the active Knowledge Model and Knowledge Schema.

#### Relevant Governance

- Any Governance subject affected by a durable discovery.

#### Relevant Rules

- documentation.*

## Required Outcomes

- The accepted change is implemented.
- Required durable knowledge is current.
- Proportionate verification is complete.
