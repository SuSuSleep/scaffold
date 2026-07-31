---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-013
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
  scenarios: Test Scenarios
---

# US-013: Compose and Verify Brownfield Business Documentation

## Belongs to

- [UC-004: Reconstruct Business Documentation for an Existing Codebase](use-case.md)

## Related ADR

- Any cross-module decision discovered during composition is handled according to the project's ADR rules.

## Story

As a **project developer or maintainer**
When **multiple completed implementation contracts describe a coherent user-facing journey**
I want **them composed into reviewed business documentation and verified against the existing system**
So that **the project explains not only what individual modules do but why their combined behavior matters to users**

## Expected Behavior

The system composes completed implementation contracts as soon as they cover a coherent journey, captures cross-module seams as business scenarios, and promotes the business documentation after review. Once all coverage is complete, final verification must pass; misalignment returns the workflow to the affected loop.

## User Interaction

### Trigger

The user asks to turn completed module documentation into coherent business documentation.

### User-Provided Information

- Candidate modules or confirmation of proposed groupings, cross-module journey context, and answers for blocking business-context gaps.

### System Response

- Composes business UC/US drafts, runs review and promotion gates, updates coverage, and performs final alignment verification across documentation, evidence, and code.

### Failure Signals

- Fewer than two modules form a coherent journey, business context is still missing, review or promotion fails, or final alignment verification reports a mismatch.

## Test Scenarios

### Scenario 1: Coherent Module Journey Composed

- **Given**: at least two completed implementation contracts form one coherent user-facing journey
- **When**: the user completes the business-composition interview and the resulting business draft passes review and promotion gates
- **Then**: the system SHALL produce confirmed business documentation linked to every contributing module

### Scenario 2: No Coherent Composition Is Ready

- **Given**: fewer than two completed implementation contracts form a coherent user-facing journey
- **When**: the workflow assesses composition readiness
- **Then**: the system SHALL defer composition and continue with the next open module loop

### Scenario 3: Blocking Business Context Prevents Composition

- **Given**: a contributing module lacks business context required to explain the journey
- **When**: business composition begins
- **Then**: the system SHALL write no partial business UC/US and direct the user back to elicitation for the affected module

### Scenario 4: Final Verification Reports Misalignment

- **Given**: coverage is complete but confirmed documentation, evidence, and code are not aligned
- **When**: final verification runs
- **Then**: the system SHALL keep UC-004 open and direct the user back to the affected module or business-documentation loop
