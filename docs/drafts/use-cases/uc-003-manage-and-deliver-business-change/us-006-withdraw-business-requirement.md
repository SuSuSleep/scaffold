---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-006
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: Interface Contract
  scenarios: Test Scenarios
---

# US-006: Withdraw an Existing Business Requirement

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- Preserve or remove related decision references according to the withdrawal impact.

## Story

As a **project developer or maintainer**
When **the business no longer wants an in-progress requirement**
I want **the draft removed with dependent references repaired or explicitly escalated**
So that **future planning does not implement cancelled intent or leave misleading documentation behind**

## Expected Behavior

The system discovers every in-draft dependency before deleting the cancelled requirement. Safe references are repaired automatically; a dependency that cannot survive the cancellation requires the user's cascade decision.

## Interface Contract

### Command

`/draft [requirement withdrawal described in conversation]`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: The requirement to withdraw and any cascade decision.
- Stdout: Deleted drafts and repaired references.
- Stderr: A dependency conflict requiring explicit user direction.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Cancellation is immediate for drafts after reference safety is established.

## Test Scenarios

### Scenario 1: Unreferenced Requirement Withdrawn

- **Given**: an in-progress business requirement exists under `docs/drafts/use-cases/` and no other draft references it
- **When**: the user runs `/draft` and requests withdrawal of that requirement
- **Then**: the system SHALL delete the draft and report the withdrawal

### Scenario 2: Referenced Requirement Withdrawn Safely

- **Given**: other drafts contain references to the requirement that can be removed or rewritten without changing their business goals
- **When**: the user runs `/draft` and requests withdrawal of that requirement
- **Then**: the system SHALL repair those references before deleting the cancelled draft

### Scenario 3: Withdrawal Requires a Cascade Decision

- **Given**: another draft depends on the requirement being withdrawn and cannot preserve its current business goal without it
- **When**: the user requests withdrawal
- **Then**: the system SHALL pause deletion and ask whether the dependent requirement should also be withdrawn
