---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-011
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
  scenarios: Test Scenarios
---

# US-011: Inventory an Existing Codebase

## Belongs to

- [UC-004: Reconstruct Business Documentation for an Existing Codebase](use-case.md)

## Related ADR

- None.

## Story

As a **project developer or maintainer**
When **an existing codebase has no reliable documentation coverage view**
I want **the system to discover its modules and create a resumable documentation tracker**
So that **I know what must be documented and can continue the retrofit across multiple sessions without rescanning everything**

## Expected Behavior

The system identifies the user-confirmed source root, treats each direct child directory as one module, and creates or append-only updates the coverage and architecture inventories. Existing progress is preserved.

## User Interaction

### Trigger

The user asks to begin reconstructing documentation for an existing codebase.

### User-Provided Information

- The source root to inspect when it is not obvious, and confirmation of discovered module boundaries.

### System Response

- Inventories direct-child modules, creates or append-only updates coverage tracking, seeds the architecture inventory, and preserves existing progress.

### Failure Signals

- No source root is available, multiple candidate roots require selection, or existing coverage data is unreadable.

## Test Scenarios

### Scenario 1: Brownfield Module Inventory Created

- **Given**: an initialized project contains a confirmed source root with direct-child module directories
- **When**: the user starts codebase inventory
- **Then**: the system SHALL create a coverage row and architecture entry for every discovered module

### Scenario 2: Source Root Requires Confirmation

- **Given**: the default `src/` root is absent or multiple alternative roots such as `app/`, `lib/`, `cmd/`, or `packages/` exist
- **When**: module discovery starts
- **Then**: the system SHALL ask the user to confirm the source root before creating or updating the inventory

### Scenario 3: Existing Coverage Is Extended

- **Given**: `docs/drafts/coverage.md` exists and the confirmed source root contains newly added direct-child modules
- **When**: the inventory flow reruns
- **Then**: the system SHALL append only the new modules and preserve all existing progress states
