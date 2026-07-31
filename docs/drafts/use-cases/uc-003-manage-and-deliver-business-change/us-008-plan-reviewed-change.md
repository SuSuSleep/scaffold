---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-008
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
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
I want **their quality checked and their READY intent translated into implementation contracts and executable batches**
So that **the AI agent can implement the change without rediscovering scope, dependencies, affected files, or scenario obligations**

## Expected Behavior

The system first returns a clear readiness verdict and planning relationships. Only READY drafts proceed to implementation decomposition and scenario-level plans, with greenfield paths marked, architectural decisions captured, and regression obligations collected in a final batch.

## User Interaction

### Trigger

The user asks to move reviewed business intent toward implementation.

### User-Provided Information

- Selected business drafts, readiness corrections if any, and clarification for implementation boundaries that are not yet specific enough to plan.

### System Response

- Reports readiness findings, translates READY intent into implementation contracts and scenario-level batches, records affected files, and identifies decision records or regression obligations.

### Failure Signals

- Business drafts are not READY, implementation boundaries are ambiguous, or planning would require inventing missing decisions.

## Test Scenarios

### Scenario 1: READY Business Change Planned

- **Given**: the selected business drafts contain coherent stories, scenarios, and implementation boundaries
- **When**: business review returns READY and planning runs for those UC IDs
- **Then**: the system SHALL create implementation contracts and scenario-level implementation batches for the reviewed change

### Scenario 2: Review Finds Blocking Business Gaps

- **Given**: one or more selected business drafts are missing required sections, scenarios, or coherent story-to-scenario alignment
- **When**: the business-review gate runs
- **Then**: the system SHALL preserve the drafts, report specific findings, and create no implementation plan

### Scenario 3: Implementation Boundary Blocks Planning

- **Given**: a READY business draft lacks an implementation boundary specific enough for implementation decomposition
- **When**: planning attempts to decompose the change
- **Then**: the system SHALL create no plan and report the boundary decision required from the user
