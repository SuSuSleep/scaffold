---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-002
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  scenarios: Test Scenarios
---

# US-002: Configure the Project Harness

## Belongs to

- [UC-001: Prepare a Project for AI-Assisted Development](use-case.md)

## Related ADR

- None.

## Story

As a **project developer or maintainer**
When **the project scaffold has been initialized**
I want **a guided setup flow to record the project's actual conventions, domain knowledge, and test configuration**
So that **agents can orient themselves, follow conventions, run the correct tests, and begin feature work without repeated explanation**

## Expected Behavior

The user follows the `/setup` guide to replace relevant scaffold completion markers with project-specific decisions. Existing information is preserved unless the user confirms a change, while unavailable values remain explicit and the setup can be resumed later.

## API Contract

### Command

`/setup`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Project decisions, accepted defaults, and confirmations through the conversation.
- Stdout: Updated, created, and still-open project configuration summary.
- Stderr: Clear explanation when a requested update belongs to another workflow.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- The flow is resumable; initialized files are not discarded when setup is interrupted.

## Test Scenarios

### Scenario 1: Project Harness Configured

- **Given**: the initialized scaffold exists, the user has granted write permission, and conversation context or scaffold completion markers identify project-level gaps in `docs/overview/test-strategy.md`, `docs/overview/glossary.md`, `CONVENTIONS.md`, `README.md`, or shared test-support files
- **When**: the user runs `/setup`, answers the targeted questions for the identified gaps, and confirms any project-specific defaults or revisions
- **Then**: the system SHALL update only the in-scope project configuration docs or shared test-support files, preserve unrelated content, and report a harness ready for AI-assisted work

### Scenario 2: Setup Is Interrupted After Initialization

- **Given**: the initialized scaffold exists with project-specific completion markers and `/setup` has selected one or more target files to configure
- **When**: the setup flow is interrupted or fails before every selected value is recorded
- **Then**: the system SHALL preserve the initialized scaffold and any completed updates, leave remaining completion markers visible, and allow the user to rerun `/setup` to continue from the remaining gaps

### Scenario 3: Project Information Is Not Available Yet

- **Given**: `/setup` reaches a project-level value that is not established in conversation and the user cannot provide it
- **When**: the system updates the selected project configuration docs
- **Then**: the system SHALL write an explicit per-project completion marker instead of inventing the value, and list the affected file and section as still needing attention

### Scenario 4: Prepared Project Selects Its Next Workflow

- **Given**: initialization and setup have produced a usable project harness with known project conventions, test commands, glossary entries, README information, or explicitly marked remaining completion work
- **When**: the setup summary is printed
- **Then**: the system SHALL explain which files were updated, created, and still need attention, and direct a greenfield project toward `/draft` while offering a brownfield project the documentation-reconstruction workflow
