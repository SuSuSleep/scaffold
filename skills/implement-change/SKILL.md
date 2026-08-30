---
name: implement-change
description: Implement an accepted change, verify it proportionately, and reconcile resulting durable knowledge.
---

# Implement Change

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Bring the implementation into compliance with an accepted change while preserving knowledge consistency.

## Entry Conditions

- `reconcile-project-change` has produced `ACCEPTED` Project Knowledge for an implementation-affecting change.

## Phases

### Phase — Establish Context

#### Goal

Establish the request, constraints, and relevant project context.

#### Required Outcome

The requested change, applicable rules, relevant durable knowledge, and affected scope are understood.

#### Relevant Knowledge

- Applicable active-Model constraints.

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

Relevant active-Model obligations or other durable expectations, constraints, implementation areas, evidence boundaries, and durable knowledge updates are identified according to the active Knowledge Model and Knowledge Schema.

#### Relevant Knowledge

- Applicable active-Model constraints.

#### Relevant Rules

- verification.*
- security.*

#### Suggested Skills

- analyze-impact

### Phase — Realize Change

#### Goal

Make the accepted change while preserving applicable constraints.

#### Required Outcome

The implementation satisfies the accepted change, applicable constraints are preserved, and required durable knowledge is updated according to the active Knowledge Model and Knowledge Schema. Evidence and dependency handling follow the active Model and applicable Project Rules.

#### Relevant Knowledge

- Applicable active-Model constraints.

#### Relevant Rules

- coding.*
- security.*
- architecture.*

#### Suggested Skills

- implement-with-tdd

### Phase — Verify Result

#### Goal

Demonstrate that the completed change satisfies its accepted expectations without unacceptable regression risk.

#### Required Outcome

Proportionate verification is complete and any remaining limits or risks are known.

#### Relevant Knowledge

- Applicable active-Model constraints.

#### Relevant Rules

- verification.*
- security.*

#### Suggested Skills

- verify-change

### Phase — Reconcile Knowledge

#### Goal

Ensure durable project knowledge reflects discoveries made while realizing and verifying the change.

#### Required Outcome

Mechanical durable synchronization is completed where needed, with evidence and relationships represented according to the active Knowledge Model and Knowledge Schema. A discovery that materially changes Project Knowledge semantics returns through `reconcile-project-change`; the implementation agent must not silently accept it.

#### Relevant Knowledge

- Any active-Model knowledge affected by a durable discovery.

#### Relevant Rules

- documentation.*

## Required Outcomes

- The accepted change is implemented.
- Required durable knowledge is current.
- Proportionate verification is complete.
