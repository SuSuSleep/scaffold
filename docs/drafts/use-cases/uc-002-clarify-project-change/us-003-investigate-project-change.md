---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-003
api-type: cli
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  scenarios: Test Scenarios
---

# US-003: Investigate a Project Change

## Belongs to

- [UC-002: Clarify a Project Change Before Committing to It](use-case.md)

## Related ADR

- None.

## Story

As a **project developer or maintainer**
When **I have an incomplete idea, confusing problem, or doubt about an approach**
I want **an AI thinking partner to investigate the actual project with me without changing it**
So that **I can choose a direction with a clear understanding of its assumptions, trade-offs, risks, and downstream effects**

## Expected Behavior

The system explores the user's question through a grounded, adaptive conversation that may include repository navigation, comparisons, and diagrams. The user can continue or reinvoke the skill until the codebase, reasonable approaches, and remaining ambiguities are understood. The system preserves a strict read-only boundary and leaves the user—not the system—in control of when to capture or implement a conclusion.

## API Contract

### Command

`/explore [topic]`

### Flags

None.

### Stdin / Stdout / Stderr

- Stdin: The user's topic, answers, corrections, and decisions through conversation.
- Stdout: Grounded analysis, questions, comparisons, diagrams, risks, and optional handoff guidance.
- Stderr: A clear boundary reminder when the user requests repository changes while exploration remains active.

### Exit Codes

Not applicable to the conversational slash-command interface.

### Notes

- Exploration is read-only and has no automatic terminal state.

## Test Scenarios

### Scenario 1: Project Change Clarified Without Repository Changes

- **Given**: TBD (the user has a project question and relevant context is readable)
- **When**: TBD (the user explores the question with the system)
- **Then**: the system SHALL provide grounded clarity while leaving repository files unchanged

### Scenario 2: User Requests a Repository Change During Exploration

- **Given**: TBD (exploration mode is active)
- **When**: TBD (the user asks the system to write a file or implement an option)
- **Then**: the system SHALL keep the repository unchanged and require an explicit handoff to the appropriate workflow

### Scenario 3: Evidence Is Insufficient for a Definitive Answer

- **Given**: TBD (the available project evidence leaves a material question unresolved)
- **When**: TBD (the user asks for a definitive recommendation)
- **Then**: the system SHALL identify the unresolved information and decision owner instead of inventing certainty

### Scenario 4: User Continues Exploration

- **Given**: TBD (one exploration topic has produced new questions or remaining ambiguity)
- **When**: TBD (the user continues the conversation or invokes `/explore` again)
- **Then**: the system SHALL retain the grounded context and continue helping the user understand the codebase and reasonable approaches without modifying files
