---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-009
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
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

## API Contract

### Command

1. `/apply [plan]`
2. `/merge [completed plan]`
3. `/verify`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Selected plan when more than one plan is available and explicit confirmation for a final documentation commit when applicable.
- Stdout: Batch progress, promotion summary, verification report, and PR-readiness status.
- Stderr: Task failures, promotion blockers, or final alignment failures with a correction path.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Pushing and opening the pull request remain manual user actions.

## Test Scenarios

### Scenario 1: Reviewed Change Delivered and Ready for PR

- **Given**: a reviewed change has a complete implementation plan on a feature branch
- **When**: `/apply` completes every plan task, `/merge` promotes the completed drafts, and `/verify` reports CLEAN
- **Then**: the system SHALL report aligned code, tests, and confirmed documentation ready for the user to open a pull request

### Scenario 2: Promotion Gate Blocks Open Work

- **Given**: the plan has unchecked work or a required behavioral test file is missing
- **When**: the user runs `/merge`
- **Then**: the system SHALL promote nothing and report every blocking item

### Scenario 3: Final Verification Finds Misalignment

- **Given**: promoted working-tree documentation does not align with tests or implementation evidence
- **When**: the `/verify` gate runs
- **Then**: the system SHALL report MISALIGNED, leave the changes uncommitted, and tell the user not to open a pull request
