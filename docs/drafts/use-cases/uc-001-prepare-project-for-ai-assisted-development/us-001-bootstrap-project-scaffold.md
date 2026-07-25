---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-001
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: Interface Contract
  scenarios: Test Scenarios
---

# US-001: Bootstrap the Project Documentation Scaffold

## Belongs to

- [UC-001: Prepare a Project for AI-Assisted Development](use-case.md)

## Related ADR

- None.

## Story

As a **project developer or maintainer**
When **I start preparing a project for AI-assisted development**
I want **a guided initialization flow to create the standard project scaffold**
So that **agents and contributors can immediately understand what the project does, where information belongs, and how work should proceed**

## Expected Behavior

The user follows the `/init` guide, supplies the available project information, reviews the complete change preview, and confirms how existing files should be handled. The system then creates the approved scaffold without silently overwriting existing project information.

## Interface Contract

### Command

`/init`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: Guided answers and explicit confirmation through the conversation.
- Stdout: Preview of proposed files followed by an initialization summary.
- Stderr: Clear blocking reason when initialization cannot proceed.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Re-running is safe only after the user confirms how existing files should be handled.

## Test Scenarios

### Scenario 1: Project Scaffold Initialized

- **Given**: the user is in an intended project directory, has granted write permission, and can answer or accept defaults for project identity, tech stack, naming conventions, testing, quality tooling, build requirements, and interface shape
- **When**: the user runs `/init`, completes each interview phase, reviews the scaffold preview, and confirms `Proceed`
- **Then**: the system SHALL create `AGENTS.md`, `CLAUDE.md`, `README.md`, `CONVENTIONS.md`, `docs/overview/architecture.md`, `docs/overview/test-strategy.md`, `docs/overview/glossary.md`, `docs/schema/format.md`, `docs/schema/workflow-rules.md`, `.gitignore`, and empty `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, and `docs/adr/` directories; it SHALL create `docs/overview/api-spec.yaml` only when the user says the project exposes an HTTP API; and it SHALL report the initialized project state

### Scenario 2: Existing Project Files Are Skipped

- **Given**: one or more scaffold target files already exist
- **When**: the user runs `/init` and chooses to skip existing files during the pre-flight check
- **Then**: the system SHALL leave existing scaffold files unchanged, create missing scaffold files and directories, append the scaffold section to `.gitignore` when appropriate, and report which files were skipped versus created

### Scenario 3: Permission Is Unavailable

- **Given**: the user is in the intended project directory but write permission for scaffold targets is not available
- **When**: the user runs `/init` and the initialization flow reaches the file-writing step
- **Then**: the system SHALL leave unauthorized files unchanged and explain that permission is required before retrying
