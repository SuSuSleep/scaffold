---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-001
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

# UC-001: Prepare a Project for AI-Assisted Development

## Primary Actor

Project developer or maintainer.

## Preconditions

- The user is working in the intended project directory.
- The user has granted permission to create or update the project documentation and configuration files.
- The bundled scaffold templates and defaults are available to the initialization flow.

## Business Rules

- Existing project files SHALL NOT be overwritten without confirmation from the user.
- Information that the user cannot provide SHALL remain explicitly marked as incomplete; the system SHALL NOT invent project facts.
- An incomplete setup SHALL remain resumable without requiring the initialized scaffold to be recreated.

## Postconditions

- The project contains an agent-oriented documentation scaffold and project-specific configuration harness.
- Agents can orient themselves, follow the project's conventions, and discover the correct test and quality commands without the user repeatedly explaining the project.
- If project-specific configuration remains incomplete, its placeholders are visible and the user can rerun `/setup` later.

## Main Flow

1. The project developer or maintainer starts `/init` in the intended project directory and grants permission to create or update the scaffold.
2. The system guides the user through the project's purpose, technology, testing, quality-tooling, and API information.
3. The user reviews and approves the proposed scaffold changes, including how existing files will be handled.
4. The system creates the project documentation scaffold and reports the initialized project state.
5. The user starts `/setup` to complete the project-specific information left by initialization.
6. The system guides the user through the remaining testing strategy, domain glossary, README, conventions, and shared test-support decisions in scope.
7. The system records the supplied decisions while preserving existing information and explicitly marking anything still unknown.
8. The user receives a project harness from which they can begin greenfield feature work or rebuild documentation for a brownfield codebase.

## Exception Flows

- Initialization cannot proceed because permission is unavailable: no unauthorized file is changed, and the user can retry after granting permission. → See US-001
- Initialization finds existing project files: the system asks whether each affected file should be overwritten or preserved before proceeding. → See US-001
- Initialization succeeds but setup is interrupted or fails: the initialized scaffold remains usable with explicit placeholders, and the user can rerun `/setup`. → See US-002
- The user cannot supply a setup value: the value remains explicitly marked as incomplete and is reported as needing attention. → See US-002

## Related Use Cases

- Prerequisite: None.
- Follow-up for a greenfield project: UC-003 Manage and Deliver a Business Change.
- Follow-up for a brownfield project: UC-004 Reconstruct Business Documentation for an Existing Codebase.
- Optional follow-up: UC-002 Clarify a Project Change Before Committing to It.

## Implementation Layer Mapping

- `init` → [UC-007: Bootstrap the project documentation scaffold](../../modules/init/use-cases/uc-007-init/use-case.md) (draft)
- `setup` → [UC-013: Fill project-level Tier-0 configuration](../../modules/setup/use-cases/uc-013-setup/use-case.md) (draft)
