---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-010
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
  scenarios: Test Scenarios
---

# US-010: Resume or Recover an Implementation

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- Preserve any ADR scope already recorded by the original plan or generated fix plan.

## Story

As a **project developer or maintainer**
When **implementation is interrupted or a bounded failure prevents completion**
I want **the system to preserve completed work and resume from an explicit next unit**
So that **I do not repeat successful work or manually reconstruct what failed and how to continue**

## Expected Behavior

Re-running implementation starts at the first pending task and retains every completed checkbox. Repeated task failure stops with evidence for human guidance, while final regression failure creates a separate fix plan instead of hiding the failure with unplanned inline changes.

## User Interaction

### Trigger

The user asks to resume incomplete implementation work or recover from repeated verification failure.

### User-Provided Information

- The original or recovery plan, observed failure details, and permission to continue from the recorded state.

### System Response

- Preserves completed work, resumes pending tasks, creates a bounded recovery plan when required, and reports attempted fixes and remaining blockers.

### Failure Signals

- The same task repeatedly fails, the plan state is inconsistent, or the remaining blocker requires user or external correction.

## Test Scenarios

### Scenario 1: Partially Completed Plan Resumed

- **Given**: a plan file contains one or more completed `[x]` tasks followed by pending `[ ]` tasks
- **When**: the user resumes implementation for that plan
- **Then**: the system SHALL preserve completed tasks and continue from the first pending task

### Scenario 2: Task Fails After the Allowed Attempts

- **Given**: a task's required typecheck, behavioral test, or implementation-quality test repeatedly fails during implementation
- **When**: the allowed correction attempts are exhausted
- **Then**: the system SHALL leave that task pending, preserve prior completed work, and report the error and attempted fixes

### Scenario 3: Final Regression Creates a Fix Plan

- **Given**: regular implementation tasks are complete but the final behavioral regression suite fails
- **When**: the final batch runs
- **Then**: the system SHALL create and announce a bounded fix plan without committing the failed result
