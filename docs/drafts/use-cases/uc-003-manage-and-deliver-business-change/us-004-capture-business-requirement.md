---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-004
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  scenarios: Test Scenarios
---

# US-004: Capture a New Business Requirement

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- Created only when the captured requirement satisfies every ADR trigger.

## Story

As a **project developer or maintainer**
When **I want to add a feature or capture a newly understood bug fix**
I want **the intent translated into coherent business drafts with the correct IDs, relationships, and decision records**
So that **implementation can begin from explicit business expectations rather than repeated prompting**

## Expected Behavior

The system turns the user's plain-language intent into one UC per distinct goal and the necessary business stories. It discovers related documentation, assesses ADR need, preserves lifecycle boundaries, and leaves intent that is not specific enough to classify unwritten until clarified.

## API Contract

### Command

`/draft [requirement described in conversation]`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: The new feature or bug-fix intent and clarification answers.
- Stdout: Created drafts, decision-record result, repaired references, and review notes.
- Stderr: A targeted clarification request when actor, scope, or operation is not specific enough to classify.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Confirmed files are never edited directly.

## Test Scenarios

### Scenario 1: New Requirement Captured

- **Given**: the user provides a feature or bug-fix goal with a clear actor, scope, and intended operation
- **When**: the user runs `/draft` and the requirement-capture flow classifies the change as a new business requirement
- **Then**: the system SHALL create coherent business drafts with allocated IDs and relevant relationships

### Scenario 2: Requirement Intent Needs Clarification

- **Given**: the actor, scope, or intended operation is not specific enough to classify
- **When**: the system attempts to classify the requested change
- **Then**: the system SHALL ask a targeted clarification question and write nothing until the user supplies the missing decision

### Scenario 3: Requirement Requires an ADR

- **Given**: multiple implementation options were considered, multiple modules are affected, and the reason for the chosen approach is not inferable from the resulting documents
- **When**: the new requirement is captured
- **Then**: the system SHALL create a proposed ADR draft and link it from the affected business story
