---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-007
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  scenarios: Test Scenarios
---

# US-007: Replace an Architectural Decision

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- TBD (the new proposed ADR is created when a specific supersession is requested).

## Story

As a **project developer or maintainer**
When **an adopted architectural decision no longer serves the project**
I want **a replacement decision and its complete documentation and implementation impact handled as one traceable change**
So that **the project does not retain contradictory decisions, stale references, or code based on the superseded rationale**

## Expected Behavior

The system creates a proposed replacement ADR, discovers every affected document, and prepares a complete draft cascade before planning. Implementation updates code references, promotion adopts the replacement and removes the superseded decision, and final verification checks the resulting feature evidence.

## API Contract

### Command

`/draft [ADR supersession described in conversation]`

Followed after review by `/design-plan`, `/apply`, `/merge`, and `/verify` when implementation impact exists.

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: The decision being replaced, replacement intent, and any clarification.
- Stdout: Proposed ADR, complete affected-document set, implementation progress, promotion result, and verification verdict.
- Stderr: A missing superseded ADR, incomplete cascade, failing implementation gate, or final misalignment report.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- ADR supersession is all-or-nothing at requirement-capture time.

## Test Scenarios

### Scenario 1: Architectural Decision Replaced End to End

- **Given**: TBD (an adopted ADR exists and a clear replacement decision is requested)
- **When**: TBD (the user completes the reviewed change workflow)
- **Then**: the system SHALL adopt the replacement, remove the superseded decision, update affected evidence, and report readiness for PR

### Scenario 2: Superseded Decision Cannot Be Found

- **Given**: TBD (the requested superseded ADR identifier does not exist)
- **When**: TBD (the replacement cascade is prepared)
- **Then**: the system SHALL write no cascade and ask whether the identifier is wrong or a fresh ADR is intended

### Scenario 3: Impact Cascade Is Incomplete

- **Given**: TBD (one or more affected references cannot be prepared consistently)
- **When**: TBD (the supersession change set is assembled)
- **Then**: the system SHALL stop the supersession operation rather than leave a partial decision cascade
