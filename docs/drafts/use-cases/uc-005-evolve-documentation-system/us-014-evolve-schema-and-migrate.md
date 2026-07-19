---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-014
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  scenarios: Test Scenarios
---

# US-014: Evolve Schema and Migrate Documents

## Belongs to

- [UC-005: Evolve the Documentation System Safely](use-case.md)

## Related ADR

- None unless a separate cross-module architectural decision satisfies every ADR trigger.

## Story

As a **project developer or maintainer**
When **new context or information changes the project's document format, content expectations, or workflow policy**
I want **the definitions updated and every recognized affected document migrated according to explicit risk rules**
So that **the documentation system evolves consistently without silent data loss or a manual document-by-document rewrite**

## Expected Behavior

The system derives the proposed new version from user-provided context, collects the full change set, classifies its migration risk, and waits for explicit confirmation. It preserves the existing meaning of recognized documents while aligning their content and format, then gives an honest report of incomplete, deferred, or manually reviewable results.

## API Contract

### Command

`/schema-update`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Complete schema/workflow change set, clarifications, classification confirmation, and per-document destructive-change decisions.
- Stdout: Classification table, migration progress, and categorized migration report.
- Stderr: Ambiguous request, malformed schema metadata, future-version conflict, or concurrent-write warning.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Schema and workflow versions are independent.

## Test Scenarios

### Scenario 1: Schema Change Migrates Recognized Documents

- **Given**: TBD (the project has a valid schema and recognized documents)
- **When**: TBD (the user confirms an unambiguous format change and its classification)
- **Then**: the system SHALL update the schema, migrate affected recognized documents, and report every result category

### Scenario 2: Workflow-Only Change Avoids Document Migration

- **Given**: TBD (the user requests only a workflow-rule change)
- **When**: TBD (the confirmed change is applied)
- **Then**: the system SHALL update only the workflow definition and skip document-body migration

### Scenario 3: New Required Content Is Explicitly Incomplete

- **Given**: TBD (a confirmed schema change adds a required section whose content cannot be inferred)
- **When**: TBD (affected documents are migrated)
- **Then**: the system SHALL insert explicit placeholders and list every document that needs human content

### Scenario 4: Destructive Change Is Declined for a Document

- **Given**: TBD (a confirmed schema change would remove populated content from a specific document)
- **When**: TBD (the user declines that document's destructive transformation)
- **Then**: the system SHALL leave the entire document unchanged and list it as deferred

### Scenario 5: Schema Version Conflict Requires Manual Review

- **Given**: TBD (a document's schema version is newer than the project schema)
- **When**: TBD (migration discovers the version conflict)
- **Then**: the system SHALL leave the document unchanged and ask the user how to reconcile the versions

### Scenario 6: Incomplete Migration Is Reviewed and Resumed

- **Given**: TBD (a migration report lists placeholders, deferred transformations, or manual-review documents)
- **When**: TBD (the user supplies the missing decisions or content and reruns `/schema-update`)
- **Then**: the system SHALL preserve completed migration work and process the remaining confirmed updates against the new version
