---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-012
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
  scenarios: Test Scenarios
---

# US-012: Document an Existing Module

## Belongs to

- [UC-004: Reconstruct Business Documentation for an Existing Codebase](use-case.md)

## Related ADR

- None unless the reconstructed business context exposes a separate architectural decision.

## Story

As a **project developer or maintainer**
When **a module contains working code but lacks a trustworthy contract and business explanation**
I want **the system to derive technical facts from code and guide me through the business facts code cannot reveal**
So that **the module can be understood, reviewed, and maintained without manually reverse-engineering it again**

## Expected Behavior

The system scans one module, creates one UC per distinct goal-bearing entry point, and fills all high-inferability fields from code. It then incrementally elicits actor, goal, value, rules, and exception meaning before reviewing and promoting the completed module documentation.

## User Interaction

### Trigger

The user asks to document a module whose code exists but whose contract or business meaning is incomplete.

### User-Provided Information

- Module selection, responsibility-boundary confirmations, and answers for actor, goal, value, rules, and exception meaning.

### System Response

- Derives technical facts from code, captures business context from the user, reviews the module documentation, promotes completed implementation contracts, and updates coverage.

### Failure Signals

- Module source is missing, boundary questions are unanswered, business context remains open, or the module documentation fails review.

## Test Scenarios

### Scenario 1: Existing Module Documented and Promoted

- **Given**: coverage lists a module whose source is readable and whose module documentation remains open
- **When**: module scanning, business-context elicitation, brownfield module-document review, and promotion complete for that module
- **Then**: the system SHALL produce confirmed implementation contracts with technical facts derived from code and business facts confirmed by the user

### Scenario 2: Module Scan Is Interrupted Before Confirmation

- **Given**: the system has read a module but the user has not answered the required boundary questions
- **When**: the scan session ends
- **Then**: the system SHALL write no module drafts, leave the coverage row open, and allow the scan to restart

### Scenario 3: Elicitation Is Interrupted

- **Given**: some business-context phases have already been answered
- **When**: the elicitation session ends before completion
- **Then**: the system SHALL preserve written answers and resume later from the remaining business-context fields

### Scenario 4: Module Draft Does Not Pass Review

- **Given**: the module draft has open business context or inconsistent content
- **When**: the brownfield module-document review gate runs
- **Then**: the system SHALL leave the draft unpromoted and report the revisions or escalation required
