# Templates Reference

All templates used by the `plan` skill.

---

## Module Use Case (use-case.md)

> Owned by the module manager agent. Derived from a business-layer US.
> Describes what this module must do to fulfil its part of the contract.

```markdown
# UC-001: [Module-Internal Goal Name]

## Source

Derived from business layer: docs/drafts/use-cases/uc-001-{name}/

## Basic Information

- Trigger: (what causes this module to act — an API call, an event, etc.)
- Preconditions: (state that must be true before this module acts)
- Postconditions: (state after this module completes successfully)

## Main Flow

1.
2.
3.

## Exception Flows

- [Scenario description]: → See US-xxx

## Interface Contract

- Accepts: (input from callers — fields, events, messages)
- Emits: (responses, events, side effects this module produces)
```

---

## Module User Story — Detailed Version

> Used for all US files in `docs/drafts/modules/{module}/use-cases/`.
> Scenarios are written from the module's perspective, not the user's.

```markdown
# US-001: [Module-Internal Feature Name]

## Links

- Belongs to: UC-001 (module layer)
- Derived from: docs/drafts/use-cases/uc-001-{name}/us-001-{name}.md
- Related ADR: TBD (mark as ADR ID once confirmed)

## Story

As the **[module name]**
When **[trigger — e.g., "a charge request arrives"]**
I want **[action — e.g., "to validate and process the payment"]**
So that **[outcome — e.g., "the caller receives a transaction result"]**

## Expected Behavior

(Describe the expected internal behavior — focus on what this module does,
not what the user sees)

## Interface Contract

### Input

| Field   | Type   | Required | Rules       |
| ------- | ------ | -------- | ----------- |
| field_a | string | Yes      | UUID format |

### Output

| Field   | Type   | Description  |
| ------- | ------ | ------------ |
| field_b | string | UUID         |
| status  | string | success/fail |

### Error Cases

| Code          | Description             |
| ------------- | ----------------------- |
| INVALID_INPUT | Field format is invalid |
| NOT_FOUND     | Resource does not exist |

### Notes

- Idempotency: (does this module deduplicate? how?)
- Retry behaviour: (can callers retry safely?)
- Other constraints

## Test Scenarios

### Scenario 1: [Happy Path Name]

- **Given**: (module precondition — use concrete values)
- **When**: (input arrives)
- **Then**: the system SHALL (expected module output — use concrete values)

### Scenario 2: [Exception Case Name]

- **Given**:
- **When**:
- **Then**: the system SHALL

### Scenario 3: [Edge Case Name]

- **Given**:
- **When**:
- **Then**: the system SHALL
```

---

## Implementation Plan

> File: `docs/drafts/plans/plan-{id}-{kebab-name}.md`

```markdown
# Plan-001: [Feature Area Name]

## Goals

- (Specific and verifiable — maps to one or more US scenarios)

## Non-Goals

- (Explicitly out of scope)

## Scope

- UC-001 Checkout → US-001, US-002
- UC-003 Refund → US-005

## Deferred

- UC-003 US-006: deferred (reason: ...)

## Affected Files

- payment-module:
  - New: src/payment-module/payment-fail.handler.ts [proposed]
  - Modify: src/payment-module/payment.service.ts
- notification-module:
  - Modify: src/notification-module/notification.service.ts

## Why These UCs Are Planned Together

(Explain if multiple UCs are in scope — what dependency or shared module
makes it necessary to plan them in one batch. Omit section for single UC.)

## Implementation Batches

Each batch follows this sequence:
1. Implement the feature
2. Write behavioral tests — confirm all scenarios pass
3. Plan implementation quality tests
   → If difficult: refactoring signal — refactor under behavioral test
     protection, then re-plan quality tests
4. Implement and pass implementation quality tests

### Batch 1: [Core Interface Name]

- [ ] US-001 Scenario 1: Valid payment creates a transaction

### Batch 2: [Failure Handling Name]

Depends on Batch 1.

- [ ] US-001 Scenario 2: Invalid card number
- [ ] US-001 Scenario 3: Insufficient balance
- [ ] US-001 Scenario 4: Duplicate payment rejected

### Final Batch: Integration Verification

> If any item fails: analyse root cause → create fix plan → implement →
> re-run this entire batch → repeat until all green → then merge.

#### New scenarios (this plan)

- [ ] US-001 Scenario 1: Valid payment creates a transaction
- [ ] US-001 Scenario 2: Invalid card number
- [ ] US-001 Scenario 3: Insufficient balance
- [ ] US-001 Scenario 4: Duplicate payment rejected

#### Existing scenarios of touched modules (regression check)

- [ ] US-00x Scenario n: [existing scenario name]
  (or: "No existing scenarios — module is greenfield")

## Related ADRs

- ADR-xxx: (decision title — affects Batch n)
  (or: TBD — mark as TBD if a draft exists but isn't confirmed)
```

---

## ADR Draft

> File: `docs/drafts/adr/adr-draft-{id}-{name}.md` (project-level)
> or: `docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md` (module-level)

```markdown
# ADR-001: [Decision Name]

## Status

Proposed (yyyy-mm-dd)

## Background

Why this decision was needed and what problem it addresses.

## Options Considered

- Option A: pros / cons
- Option B: pros / cons

## Decision

What was chosen and the core reasoning.

## Impact

### New Capabilities

- brief description

### Unchanged

- (existing behaviour unaffected)

### Affected Files and Documents

- Affected modules:
- Files to modify:
- Documents that need updating:
```
