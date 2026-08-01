---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-007
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
  scenarios: Test Scenarios
---

# US-007: Replace an Architectural Decision

## Belongs to

- [UC-003: Manage and Deliver a Business Change](use-case.md)

## Related ADR

- A new proposed ADR is created when a specific supersession is requested.

## Story

As a **project developer or maintainer**
When **an adopted architectural decision no longer serves the project**
I want **a replacement decision and its complete documentation and implementation impact handled as one traceable change**
So that **the project does not retain contradictory decisions, stale references, or code based on the superseded rationale**

## Expected Behavior

The system creates a proposed replacement ADR, discovers every affected document, and prepares a complete draft cascade before planning. Implementation updates code references, promotion adopts the replacement and removes the superseded decision, and final verification checks the resulting feature evidence.

## User Interaction

### Trigger

The user asks to replace an adopted architectural decision.

### User-Provided Information

- The decision being superseded, the replacement decision, rationale, scope, and expected implementation impact.

### System Response

- Creates a superseding decision draft, captures any related business-change work, and carries the change through review, implementation planning, delivery, promotion, and alignment verification when implementation impact exists.

### Failure Signals

- The superseded decision cannot be found, replacement rationale is incomplete, or implementation impact is unclear.

## Test Scenarios

### Scenario 1: Architectural Decision Replaced End to End

- **Given**: an adopted ADR exists in `docs/adr/` and the user requests a specific replacement decision with its intended implementation impact
- **When**: the user completes capture, review, planning, implementation, promotion, and verification for the supersession change
- **Then**: the system SHALL adopt the replacement, remove the superseded decision, update affected evidence, and report readiness for PR

### Scenario 2: Superseded Decision Cannot Be Found

- **Given**: the requested superseded ADR identifier does not match an adopted ADR in `docs/adr/` or `docs/modules/*/adr/`
- **When**: the replacement cascade is prepared
- **Then**: the system SHALL write no cascade and ask whether the identifier is wrong or a fresh ADR is intended

### Scenario 3: Impact Cascade Cannot Be Prepared

- **Given**: one or more affected references cannot be copied, rewritten, or linked consistently for the replacement decision
- **When**: the supersession change set is assembled
- **Then**: the system SHALL stop the supersession operation rather than leave a partial decision cascade
