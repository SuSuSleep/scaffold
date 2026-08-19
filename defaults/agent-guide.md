# Scaffold Agent Guide

## Start Every Meaningful Request Here

1. Read the current user request and inspect the repository context.
2. Read `.scaffold/metadata.md` and run `scaffold status` when the shared package location or active replacements are needed.
3. Resolve each Scaffold artifact explicitly:
   - use the project-local artifact in `.scaffold/` when it exists;
   - otherwise use the corresponding shared artifact from the installed Scaffold package;
   - never merge the two implicitly.
4. Read the active Knowledge Model, Knowledge Schema, and Project Rules before changing durable knowledge or implementation behavior. Use the Model to classify Problem, Governance, and Solution knowledge and their relationships; use the Schema only for representation.
5. Resolve material ambiguity from authoritative project evidence first; ask the user only when unresolved ambiguity would materially change the durable knowledge outcome.

## Choose Guidance by Request Type

| Request | Primary Workflow | Useful Skills |
| --- | --- | --- |
| Establish or adopt Scaffold in a repository | `initialize-project` | `collect-context` |
| Define an ambiguous request, problem, requirement, or discovered need | `define-change` | `collect-context`, `analyze-impact` |
| Implement an accepted change | `implement-change` | `collect-context`, `analyze-impact`, `verify-change` |
| Change requirements, design, or governance knowledge | `update-knowledge` | `collect-context`, `analyze-impact` |
| Turn a defect, incident, or security finding into reusable knowledge | `learn-from-finding` | `collect-context`, `analyze-impact`, `verify-change` |
| Adapt to an incompatible Scaffold change | `migrate-project` | `collect-context`, `analyze-impact`, `verify-change` |

Workflows define the ordered Phases and their required outcomes. A Phase defines its local intent and can be completed without a Skill. Skills provide reusable, suggested methods; project rules may require or prohibit a particular method. A project may replace a workflow or skill with a local artifact.

Use `define-change` when the requested semantics are not sufficiently defined. Inspect existing knowledge before creating a record, prefer updating authoritative records over duplicating them, and consider removals or deprecations as well as additions. Do not implement production code before the change is sufficiently defined unless the user explicitly directs it.

Use `update-knowledge` when the exact durable knowledge change is already known.

## Knowledge Discipline

Update durable project knowledge when a change affects externally observable behavior, requirements, interfaces, responsibilities, security assumptions, or important design reasoning. Do not create knowledge updates for purely mechanical changes.

When sources disagree, analyze the inconsistency. Do not automatically treat code, tests, or temporary work artifacts as the sole authority.

Classify durable knowledge before recording it: keep stakeholder intent and externally meaningful obligations in Problem Space; retain external contracts, findings, policies, controls, constraints, and applicability in Governance Space; and record solution capabilities, responsibilities, components, interfaces, designs, decisions, and verification in Solution Space. Preserve the Model invariants: do not turn a Finding directly into a universal Control, do not put unmandated implementation detail into a Requirement, and do not claim Verification evidence that has not occurred.
