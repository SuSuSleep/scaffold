---
schema: business-capability
schema-version: 0
doc-type: user-story
id: US-003
sections:
  parent-link: Belongs to
  adr-link: Related ADR
  story: Story
  expected-behavior: Expected Behavior
  interaction: User Interaction
  scenarios: Test Scenarios
---

# US-003: Investigate a Project Change

## Belongs to

- [UC-002: Clarify a Project Change Before Committing to It](use-case.md)

## Related ADR

- None.

## Story

As a **project developer or maintainer**
When **I have an early idea, confusing problem, or doubt about an approach**
I want **an AI thinking partner to investigate the actual project with me without changing it**
So that **I can choose a direction with a clear understanding of its assumptions, trade-offs, risks, and downstream effects**

## Expected Behavior

The system explores the user's question through a grounded, adaptive conversation that may include repository navigation, comparisons, and diagrams. The user can continue or continue the investigation until the codebase, reasonable approaches, and remaining open questions are understood. The system preserves a strict read-only boundary and leaves the user—not the system—in control of when to capture or implement a conclusion.

## User Interaction

### Trigger

The user asks for help understanding an idea, confusing situation, or possible approach before committing to repository changes.

### User-Provided Information

- The question or topic, available project context, and any constraints or decisions already known.

### System Response

- Performs read-only investigation, compares options, surfaces risks and open questions, and recommends an appropriate next workflow only when the user asks for one.

### Failure Signals

- Relevant context is missing, evidence cannot support a definitive answer, or the user asks for file changes before leaving the exploration boundary.

## Test Scenarios

### Scenario 1: Project Change Clarified Without Repository Changes

- **Given**: the user has a project question and relevant orientation files, docs, or source code are readable
- **When**: the user starts a read-only investigation and discusses the question while the system reads the relevant project context
- **Then**: the system SHALL provide grounded clarity while leaving repository files unchanged

### Scenario 2: User Requests a Repository Change During Exploration

- **Given**: exploration mode is active and the repository has not been handed off to a writing or implementation workflow
- **When**: the user asks the system to write a file or implement an option
- **Then**: the system SHALL keep the repository unchanged and require an explicit handoff to the appropriate workflow

### Scenario 3: Evidence Is Insufficient for a Definitive Answer

- **Given**: the available project evidence leaves a material question open
- **When**: the user asks for a definitive recommendation
- **Then**: the system SHALL identify the open information and decision owner instead of inventing certainty

### Scenario 4: User Continues Exploration

- **Given**: one exploration topic has produced new questions or remaining open decisions
- **When**: the user continues the conversation or continues the investigation workflow
- **Then**: the system SHALL retain the grounded context and continue helping the user understand the codebase and reasonable approaches without modifying files
