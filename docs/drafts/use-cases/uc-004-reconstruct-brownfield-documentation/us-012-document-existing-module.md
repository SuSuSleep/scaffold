---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-012
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
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

## API Contract

### Command

1. `/scan-deep [module]`
2. `/elicit [module]`
3. `/review-draft [module draft]` (intended brownfield behavior; current contract mismatch)
4. `/merge [module draft]` (intended brownfield behavior; current contract mismatch)

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Module selection, boundary confirmations, and business-context interview answers.
- Stdout: Code summary, module drafts, elicitation progress, review verdict, promotion result, and coverage updates.
- Stderr: Missing coverage, missing module source, unresolved review blockers, or the recorded review/promotion contract mismatch.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- The module loop is resumable and remains bounded to one module.

## Test Scenarios

### Scenario 1: Existing Module Documented and Promoted

- **Given**: TBD (coverage lists an undocumented module with readable source)
- **When**: TBD (scan, elicitation, review, and promotion complete)
- **Then**: the system SHALL produce confirmed module contracts with technical facts derived from code and business facts confirmed by the user

### Scenario 2: Module Scan Is Interrupted Before Confirmation

- **Given**: TBD (the system has read a module but the user has not answered the required boundary questions)
- **When**: TBD (the scan session ends)
- **Then**: the system SHALL write no module drafts, leave the coverage row incomplete, and allow the scan to restart

### Scenario 3: Elicitation Is Interrupted

- **Given**: TBD (some business-context phases have already been answered)
- **When**: TBD (the elicitation session ends before completion)
- **Then**: the system SHALL preserve written answers and resume later from the remaining TBD fields

### Scenario 4: Module Draft Does Not Pass Review

- **Given**: TBD (the module draft has unresolved or inconsistent content)
- **When**: TBD (the brownfield module-document review gate runs)
- **Then**: the system SHALL leave the draft unpromoted and report the revisions or escalation required
