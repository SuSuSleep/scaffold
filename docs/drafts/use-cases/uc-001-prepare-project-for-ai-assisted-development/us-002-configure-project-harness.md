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

The user follows the `/setup` guide to replace relevant scaffold placeholders with project-specific decisions. Existing information is preserved unless the user confirms a change, while unknown values remain explicit and the setup can be resumed later.

## API Contract

### Command

`/setup`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Project decisions, accepted defaults, and confirmations through the conversation.
- Stdout: Updated, created, and still-incomplete project configuration summary.
- Stderr: Clear explanation when a requested update belongs to another workflow.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- The flow is resumable; initialized files are not discarded when setup is interrupted.

## Test Scenarios

### Scenario 1: Project Harness Configured

- **Given**: TBD (the project scaffold exists and the user has granted write permission)
- **When**: TBD (the user completes the relevant `/setup` questions)
- **Then**: the system SHALL record the supplied project decisions and report a harness ready for AI-assisted work

### Scenario 2: Setup Is Interrupted After Initialization

- **Given**: TBD (the initialized scaffold exists with unfinished project-specific placeholders)
- **When**: TBD (the setup flow is interrupted or fails before all selected information is recorded)
- **Then**: the system SHALL preserve the initialized scaffold and allow the user to rerun `/setup` to continue

### Scenario 3: Project Information Is Unknown

- **Given**: TBD (the user cannot provide a requested project-specific value)
- **When**: TBD (the setup flow reaches that value)
- **Then**: the system SHALL mark the value as incomplete instead of inventing it and list it as still needing attention

### Scenario 4: Prepared Project Selects Its Next Workflow

- **Given**: TBD (initialization and setup have produced a usable project harness)
- **When**: TBD (the preparation flow finishes)
- **Then**: the system SHALL direct a greenfield project toward new feature work and offer a brownfield project the documentation-reconstruction workflow
