---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-005
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: Interface Contract
  scenarios: Test Scenarios
---

# US-005: Revise an Existing Business Requirement

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- Preserve or revise the requirement's existing ADR relationship as the change requires.

## Story

As a **project developer or maintainer**
When **business intent changes after a requirement has already been drafted or confirmed**
I want **the current working draft updated without corrupting the last confirmed state**
So that **the next implementation reflects current intent while the released documentation remains trustworthy**

## Expected Behavior

Existing drafts are updated in place. Confirmed requirements are first copied to their draft mirror and changed there, with related documents discovered and any structural references repaired.

## Interface Contract

### Command

`/draft [requirement revision described in conversation]`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: The requirement revision and clarification answers.
- Stdout: Updated draft paths, relationship effects, and items needing review.
- Stderr: A conflict report when the revision overlaps another goal or cannot be scoped safely.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Drafts represent current state; history remains in git.

## Test Scenarios

### Scenario 1: Existing Draft Revised In Place

- **Given**: a matching business requirement already exists under `docs/drafts/use-cases/`
- **When**: the user runs `/draft` and describes a revision that stays within the same business goal
- **Then**: the system SHALL update the affected draft sections while preserving unrelated content

### Scenario 2: Confirmed Requirement Revised Through a Draft Copy

- **Given**: the matching requirement exists only under `docs/use-cases/`
- **When**: the user runs `/draft` and describes a revision to that confirmed requirement
- **Then**: the system SHALL copy the confirmed requirement into its draft mirror and leave the confirmed version unchanged

### Scenario 3: Revision Overlaps Another User Goal

- **Given**: the requested revision materially overlaps a separate business goal
- **When**: the system decomposes the change
- **Then**: the system SHALL ask whether to modify, extract a shared flow, or create a sibling use case before writing
