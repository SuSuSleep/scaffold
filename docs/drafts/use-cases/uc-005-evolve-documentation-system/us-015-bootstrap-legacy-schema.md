---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-015
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  scenarios: Test Scenarios
---

# US-015: Bootstrap Schema onto Legacy Documents

## Belongs to

- [UC-005: Evolve the Documentation System Safely](use-case.md)

## Related ADR

- None.

## Story

As a **project developer or maintainer**
When **an established repository contains legacy documentation but no project schema definitions**
I want **recognized documents adopted into an explicit schema with their existing meaning preserved**
So that **future documentation workflows can read, validate, and evolve them consistently**

## Expected Behavior

The system creates the initial schema definitions, recognizes legacy document types from approved paths and headings, and adds inferred metadata without rewriting unrecognized structures. Bootstrap and any custom evolution requested in the same run are reported separately.

## API Contract

### Command

`/schema-update`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Optional custom schema changes and confirmation of inferred legacy document types when necessary.
- Stdout: Bootstrapped definitions, adopted documents, and manual-review inventory.
- Stderr: Truly fresh-project redirect, unrecognized structure, or metadata that cannot be inferred safely.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- A project with neither schemas nor legacy documents belongs in UC-001 instead.

## Test Scenarios

### Scenario 1: Recognized Legacy Documents Adopted

- **Given**: legacy UC/US documents exist at recognized paths and no project schema exists
- **When**: the user runs `/schema-update` to start schema bootstrap
- **Then**: the system SHALL create initial schema definitions and add inferred metadata to recognized documents

### Scenario 2: Unrecognized Legacy Document Requires Manual Review

- **Given**: a legacy document's path or headings do not match a recognized document type
- **When**: bootstrap scans existing documentation
- **Then**: the system SHALL leave the document unchanged and list its unrecognized structure for manual review

### Scenario 3: Fresh Project Is Redirected to Initialization

- **Given**: the project has neither schema definitions nor legacy documents to adopt
- **When**: the user starts schema bootstrap
- **Then**: the system SHALL make no changes and direct the user to project initialization

### Scenario 4: Bootstrap and Custom Evolution Run Together

- **Given**: legacy documents need adoption and the user also requests a custom schema change
- **When**: the combined change set is confirmed
- **Then**: the system SHALL bootstrap first, apply the custom evolution second, and distinguish both result sets in the report
