---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-009
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
  scenarios: Test Scenarios
---

# US-009: Deliver a Reviewed Business Change

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- The implementation follows and promotes any ADR drafts named by the plan.

## Story

As a **project developer or maintainer**
When **a reviewed business change has an executable implementation plan**
I want **the system to implement, test, promote, and verify the change through explicit gates**
So that **the feature or bug fix reaches a PR-ready state with aligned code, tests, and documentation and less manual coordination**

## Expected Behavior

The system executes plan batches, creates the required behavioral and quality evidence, promotes drafts only after completion gates pass, and performs final three-way alignment checks. It stops at “ready to open PR”; it never pushes or opens the PR automatically.

## User Interaction

### Trigger

The user asks to deliver an approved implementation plan.

### User-Provided Information

- The approved plan, permission to update implementation files, and responses to any bounded recovery questions.

### System Response

- Implements plan batches, runs required checks, promotes completed documentation when gates pass, performs final alignment verification, and reports pull-request readiness.

### Failure Signals

- Plan work remains incomplete, required behavioral evidence is missing, promotion gates fail, or final alignment verification reports a mismatch.

## Test Scenarios

### Scenario 1: Reviewed Change Delivered and Ready for PR

- **Given**: a reviewed change has a complete implementation plan on a feature branch
- **When**: implementation completes every plan task, completed drafts are promoted, and final alignment verification passes
- **Then**: the system SHALL report aligned code, tests, and confirmed documentation ready for the user to open a pull request

### Scenario 2: Promotion Gate Blocks Open Work

- **Given**: the plan has unchecked work or a required behavioral test file is missing
- **When**: the user asks to promote completed drafts
- **Then**: the system SHALL promote nothing and report every blocking item

### Scenario 3: Final Verification Finds Misalignment

- **Given**: promoted working-tree documentation does not align with tests or implementation evidence
- **When**: the final alignment gate runs
- **Then**: the system SHALL report MISALIGNED, leave the changes uncommitted, and tell the user not to open a pull request
