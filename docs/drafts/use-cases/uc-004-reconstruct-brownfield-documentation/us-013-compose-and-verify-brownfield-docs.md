---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-013
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: Interface Contract
  scenarios: Test Scenarios
---

# US-013: Compose and Verify Brownfield Business Documentation

## Belongs to

- [UC-004: Reconstruct Business Documentation for an Existing Codebase](use-case.md)

## Related ADR

- Any cross-module decision discovered during composition is handled according to the project's ADR rules.

## Story

As a **project developer or maintainer**
When **multiple completed module contracts describe a coherent user-facing journey**
I want **them composed into reviewed business documentation and verified against the existing system**
So that **the project explains not only what individual modules do but why their combined behavior matters to users**

## Expected Behavior

The system composes completed module contracts as soon as they cover a coherent journey, captures cross-module seams as business scenarios, and promotes the business documentation after review. Once all coverage is complete, final verification must pass; misalignment returns the workflow to the affected loop.

## Interface Contract

### Command

1. `/compose [module-a module-b ...]`
2. `/review-draft [business UC]`
3. `/merge [business documentation]` (intended brownfield behavior)
4. `/verify`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Module grouping, journey answers, cross-module failure behavior, and any review corrections.
- Stdout: Business drafts, scenario inventory, coverage updates, promotion result, and final alignment verdict.
- Stderr: Insufficient composition readiness, blocking business-context gaps, failed review/promotion gates, or a MISALIGNED report.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Composition need not wait for every module, but final verification waits until all coverage rows are complete.

## Test Scenarios

### Scenario 1: Coherent Module Journey Composed

- **Given**: at least two completed module contracts form one coherent user-facing journey
- **When**: the user completes the `/compose` interview and the resulting business draft passes review and promotion gates
- **Then**: the system SHALL produce confirmed business documentation linked to every contributing module

### Scenario 2: No Coherent Composition Is Ready

- **Given**: fewer than two completed module contracts form a coherent user-facing journey
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
