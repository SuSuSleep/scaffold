---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-011
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
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

## API Contract

### Command

`/scan-all`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Source-root confirmation when discovery is ambiguous.
- Stdout: Discovered modules, coverage mode, updated paths, and the recommended first module loop.
- Stderr: A clear request for a valid source root or repair of a malformed existing tracker.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Existing coverage rows and checkbox states are preserved in update mode.

## Test Scenarios

### Scenario 1: Brownfield Module Inventory Created

- **Given**: TBD (an initialized project contains an existing source root with direct-child modules)
- **When**: TBD (the user starts brownfield inventory)
- **Then**: the system SHALL create a coverage row and architecture entry for every discovered module

### Scenario 2: Source Root Requires Confirmation

- **Given**: TBD (the default source root is absent or multiple alternatives exist)
- **When**: TBD (module discovery starts)
- **Then**: the system SHALL ask the user to confirm the source root before creating or updating the inventory

### Scenario 3: Existing Coverage Is Extended

- **Given**: TBD (coverage exists and the source root contains newly added modules)
- **When**: TBD (the inventory flow reruns)
- **Then**: the system SHALL append only the new modules and preserve all existing progress states
