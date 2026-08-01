---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-004
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
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

## User Interaction

### Trigger

The user asks to capture a new feature, bug-fix goal, or newly understood business requirement.

### User-Provided Information

- Business goal, actor, scope, intended operation, constraints, and any decision context that may require an ADR.

### System Response

- Creates coherent business drafts with allocated IDs, records relevant relationships, identifies required decision records, and leaves unclear intent unwritten until clarified.

### Failure Signals

- Actor, scope, operation, or decision context is not specific enough to classify safely.

## Test Scenarios

### Scenario 1: New Requirement Captured

- **Given**: the user provides a feature or bug-fix goal with a clear actor, scope, and intended operation
- **When**: the user asks to update business documentation and the requirement-capture flow classifies the change as a new business requirement
- **Then**: the system SHALL create coherent business drafts with allocated IDs and relevant relationships

### Scenario 2: Requirement Intent Needs Clarification

- **Given**: the actor, scope, or intended operation is not specific enough to classify
- **When**: the system attempts to classify the requested change
- **Then**: the system SHALL ask a targeted clarification question and write nothing until the user supplies the missing decision

### Scenario 3: Requirement Requires an ADR

- **Given**: multiple implementation options were considered, multiple modules are affected, and the reason for the chosen approach is not inferable from the resulting documents
- **When**: the new requirement is captured
- **Then**: the system SHALL create a proposed ADR draft and link it from the affected business story
