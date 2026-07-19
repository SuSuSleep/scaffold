---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-005
sections:
  actor: Primary Actor
  preconditions: Preconditions
  business-rules: Business Rules
  postconditions: Postconditions
  flow: Main Flow
  exceptions: Exception Flows
  related: Related Use Cases
  implemented-by: Implementation Layer Mapping
---

# UC-005: Evolve the Documentation System Safely

## Primary Actor

Project developer or maintainer.

## Preconditions

- The user has granted permission to update project schema, workflow, or documentation files.
- The user has provided enough context or information to define the intended new document or workflow version without invention.
- For schema evolution, the current schema files are readable and well formed.
- For legacy bootstrap, recognized UC, US, ADR, or plan documents already exist even though project schema files do not.
- No concurrent documentation-writing workflow is changing the same documents, or the user explicitly accepts the migration risk.

## Business Rules

- The system SHALL collect and clarify the complete requested change set before modifying any file.
- Migration SHALL preserve the existing meaning of documentation while aligning its content and format with the confirmed new version.
- The system SHALL classify changes as mechanically safe, content-adding, or potentially destructive and show the classification before migration.
- No migration SHALL begin until the user explicitly confirms the classified change set.
- Format-schema and workflow-rule versions SHALL advance independently according to which definition changed.
- A workflow-rule-only change SHALL NOT trigger unnecessary document-body migration.
- A mechanically safe transformation MAY run automatically after confirmation.
- A content-adding transformation SHALL insert explicit placeholders and report every document that still needs human content.
- A destructive transformation SHALL require confirmation for each affected document; declined documents remain completely untouched.
- Documents with malformed schema metadata, unrecognized structure, or a schema version newer than the project schema SHALL NOT be guessed, silently repaired, or downgraded.
- The workflow SHALL report migrated, bootstrapped, deferred, content-incomplete, and manual-review documents separately.
- The workflow SHALL NOT commit or push migration changes automatically.

## Postconditions

- The project schema and workflow definitions reflect the confirmed change set, or legacy projects have received initial schema definitions.
- Every safely migratable affected document conforms to the applicable schema version.
- Documents requiring content, deferred destructive changes, and unrecognized documents are explicitly listed for follow-up.
- No declined, future-version, malformed, or unrecognized document has been silently altered.

## Main Flow

1. The project developer or maintainer describes every desired document-format and workflow-policy change.
2. The system uses the context and information supplied by the user to clarify ambiguous changes and determine whether this is schema evolution, workflow evolution, legacy bootstrap, or a combined run.
3. The system classifies each change by migration risk and shows the full classification to the user.
4. The user explicitly confirms the classified change set.
5. The system updates the applicable schema and workflow definitions, advancing their versions independently.
6. The system discovers affected draft and confirmed documents of recognized types.
7. The system applies safe transformations, inserts explicit placeholders for new required content, and asks per-document confirmation before destructive transformations.
8. In legacy bootstrap mode, the system infers frontmatter only for documents whose paths and headings match recognized document types.
9. The system prints a migration report separating completed, incomplete, deferred, and manual-review results.
10. The user reviews and completes reported placeholders, deferred transformations, and manual-review files, then reruns `/schema-update` when further migration is required.

## Exception Flows

- The requested change is ambiguous: the system writes nothing and asks for the missing section name, old/new heading, policy value, or scope. → See US-014
- Existing schema metadata is malformed: the system stops and asks for manual repair rather than guessing its meaning. → See US-014
- A document carries a newer schema version than the project definition: the system leaves it unchanged and asks the user how to reconcile the versions. → See US-014
- The user declines a destructive transformation for a document: that document remains completely unchanged and appears in the deferred list. → See US-014
- A legacy document cannot be recognized by path and headings: it remains unchanged and appears in the manual-review list. → See US-015
- No schema and no legacy documents exist: the system makes no change and directs the user to UC-001 project preparation instead. → See US-015

## Related Use Cases

- Prerequisite for a fresh project: [UC-001 Prepare a Project for AI-Assisted Development](../uc-001-prepare-project-for-ai-assisted-development/use-case.md)
- Optional prerequisite: [UC-002 Clarify a Project Change Before Committing to It](../uc-002-clarify-project-change/use-case.md)
- Related: [UC-003 Manage and Deliver a Business Change](../uc-003-manage-and-deliver-business-change/use-case.md)
- Related: [UC-004 Reconstruct Business Documentation for an Existing Codebase](../uc-004-reconstruct-brownfield-documentation/use-case.md)
- Follow-up: review and complete every reported placeholder, deferred transformation, and manual-review document; rerun UC-005 as needed.

## Implementation Layer Mapping

- `schema-update` → [UC-012: Evolve project schema and migrate affected documents](../../modules/schema-update/use-cases/uc-012-schema-update/use-case.md) (draft)
