---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-008
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: Interface Contract
  scenarios: Test Scenarios
---

# US-008: Plan a Reviewed Business Change

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- Any ADR drafts required by the reviewed change are included in the resulting plan.

## Story

As a **project developer or maintainer**
When **business drafts describe the intended change**
I want **their quality checked and their READY intent translated into module contracts and executable batches**
So that **the AI agent can implement the change without rediscovering scope, dependencies, affected files, or scenario obligations**

## Expected Behavior

The system first returns a clear readiness verdict and planning relationships. Only READY drafts proceed to module decomposition and scenario-level plans, with greenfield paths marked, architectural decisions captured, and regression obligations collected in a final batch.

## Interface Contract

### Command

1. `/review-draft [UC IDs]`
2. `/design-plan [READY UC IDs]`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Selected business UC IDs and clarification of module mappings that are not specific enough to plan.
- Stdout: Review verdicts followed by module drafts, plan paths, ADR results, and affected-file summaries.
- Stderr: Blocking review findings or planning questions that prevent a trustworthy plan.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Planning trusts the READY review verdict and does not repeat the business review.

## Test Scenarios

### Scenario 1: READY Business Change Planned

- **Given**: the selected business drafts contain coherent stories, scenarios, and implementation mappings
- **When**: `/review-draft` returns READY and `/design-plan` runs for those UC IDs
- **Then**: the system SHALL create module contracts and scenario-level implementation batches for the reviewed change

### Scenario 2: Review Finds Blocking Business Gaps

- **Given**: one or more selected business drafts are missing required sections, scenarios, or coherent story-to-scenario alignment
- **When**: the `/review-draft` gate runs
- **Then**: the system SHALL preserve the drafts, report specific findings, and create no implementation plan

### Scenario 3: Module Mapping Blocks Planning

- **Given**: a READY business draft lacks a module mapping specific enough for module-level decomposition
- **When**: planning attempts to decompose the change
- **Then**: the system SHALL create no plan and report the mapping decision required from the user
