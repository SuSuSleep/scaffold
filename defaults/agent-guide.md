# Scaffold Agent Guide

## Start Every Meaningful Request Here

1. Read the current user request and inspect the repository context.
2. Read `.scaffold/metadata.md` and run `scaffold status` when the shared package location or active replacements are needed.
3. Resolve each Scaffold artifact explicitly:
   - use the project-local artifact in `.scaffold/` when it exists;
   - otherwise use the corresponding shared artifact from the installed Scaffold package;
   - never merge the two implicitly.
4. Read the active Knowledge Schema and Project Rules before changing durable knowledge or implementation behavior.
5. Ask the user when an important requirement, constraint, or intended behavior is unclear.

## Choose Guidance by Request Type

| Request | Primary Workflow | Useful Skills |
| --- | --- | --- |
| Establish or adopt Scaffold in a repository | `initialize-project` | `collect-context` |
| Implement or change behavior | `implement-change` | `collect-context`, `analyze-impact`, `verify-change` |
| Change requirements, design, or governance knowledge | `update-knowledge` | `collect-context`, `analyze-impact` |
| Turn a defect, incident, or security finding into reusable knowledge | `learn-from-finding` | `collect-context`, `analyze-impact`, `verify-change` |
| Adapt to an incompatible Scaffold change | `migrate-project` | `collect-context`, `analyze-impact`, `verify-change` |

Workflows define the ordered Phases and their required outcomes. A Phase defines its local intent and can be completed without a Skill. Skills provide reusable, suggested methods; project rules may require or prohibit a particular method. A project may replace a workflow or skill with a local artifact.

## Knowledge Discipline

Update durable project knowledge when a change affects externally observable behavior, requirements, interfaces, responsibilities, security assumptions, or important design reasoning. Do not create knowledge updates for purely mechanical changes.

When sources disagree, analyze the inconsistency. Do not automatically treat code, tests, or temporary work artifacts as the sole authority.
