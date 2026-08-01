---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-015
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
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

## User Interaction

### Trigger

The user asks to adopt the current documentation schema for legacy documents that lack schema metadata.

### User-Provided Information

- Confirmation to bootstrap recognized legacy documents and any decisions needed for ambiguous document structure.

### System Response

- Creates schema and workflow definitions when absent, adds inferred frontmatter to recognized documents, preserves content, and reports files requiring manual review.

### Failure Signals

- No recognizable legacy documents exist, document headings do not match known formats, or metadata cannot be inferred without guessing.

## Test Scenarios

### Scenario 1: Recognized Legacy Documents Adopted

- **Given**: legacy UC/US documents exist at recognized paths and no project schema exists
- **When**: the user starts schema bootstrap to start schema bootstrap
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
