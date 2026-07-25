---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-002
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

# UC-002: Clarify a Project Change Before Committing to It

## Primary Actor

Project developer or maintainer.

## Preconditions

- The user has an early idea, confusing situation, or implementation doubt that is not yet ready to become a repository change.
- Relevant project orientation material, documentation, or source code is readable when it exists.
- The user wants investigation or discussion rather than immediate repository changes.
- The user is available for an adaptive conversation.

## Business Rules

- Exploration SHALL remain read-only and SHALL NOT persist analysis or implementation changes to the repository.
- Recommendations SHALL be grounded in the project's actual documentation and source code when available.
- The system SHALL distinguish established facts, assumptions, trade-offs, and open questions rather than filling gaps with invented certainty.
- The user decides when exploration ends and whether its result should enter another workflow.

## Postconditions

- The user better understands the problem, relevant project context, available options, risks, and open questions.
- If a direction has crystallized, the user has a recommended next workflow without any automatic repository change.
- If certainty is not yet possible, the missing information and decision ownership are explicit.

## Main Flow

1. The project developer or maintainer describes an idea, problem, doubt, or design question.
2. The system reads the relevant project orientation, documentation chain, and source code without modifying them.
3. The system helps the user clarify the goal, assumptions, constraints, and points of disagreement between documentation and implementation.
4. The system compares viable approaches, surfaces risks and downstream effects, and answers questions grounded in the repository.
5. The user either selects a reasonable approach, identifies the decisions or information still needed, or decides that the exploration itself provided enough clarity.
6. The user may continue the same discussion, invoke `/explore` again for another question, or stop with the improved understanding gained so far.
7. When requested, the system identifies the appropriate follow-up workflow while leaving the repository unchanged.

## Exception Flows

- The user requests implementation or file changes during exploration: the system keeps the repository unchanged and asks the user to explicitly move to the appropriate writing or implementation workflow. → See US-003
- Project orientation material is missing: the system performs a breadth-first read-only scan and asks the user to confirm the inferred structure. → See US-003
- The available evidence cannot support a definitive answer: the system states what remains undecided and what information or stakeholder decision is required. → See US-003

## Related Use Cases

- Optional prerequisite: [UC-001 Prepare a Project for AI-Assisted Development](../uc-001-prepare-project-for-ai-assisted-development/use-case.md)
- Follow-up: UC-003 Manage and Deliver a Business Change.
- Follow-up: `/setup` when exploration resolves project-level configuration.
- Follow-up: `/draft`, `/design-plan`, or `/apply` according to how far the resulting change has already progressed.
- Related: UC-005 Evolve the Documentation System Safely.

## Implementation Layer Mapping

- `explore` → [UC-006: Enter explore mode](../../modules/explore/use-cases/uc-006-explore/use-case.md) (draft)
