# Scaffold Agent Guide

## Start Every Meaningful Request Here

1. Read the current user request and inspect the repository context.
2. Read `.scaffold/metadata.md` and run `scaffold status` when the shared package location or active replacements are needed.
3. Read the shared Knowledge Model from the installed Scaffold package. It is a Harness-level semantic contract and cannot be replaced by `.scaffold/knowledge-model.md`.
4. Resolve each replaceable Scaffold artifact explicitly: use the project-local Knowledge Schema, Project Rules, Workflow, Skill, or Template when it exists; otherwise use the corresponding shared artifact. Never merge local and shared artifacts implicitly. Template availability does not make it applicable; the active Knowledge Schema selects applicable template types.
5. When creating or updating project knowledge, use this precedence: shared Knowledge Model for semantic meaning, active Knowledge Schema for representation, applicable Template for starting structure, then existing Project Knowledge for local coherence. Do not infer semantic meaning solely from template headings.
6. Resolve material ambiguity from authoritative project evidence first; ask the user only when unresolved ambiguity would materially change the durable knowledge outcome.

## Choose Guidance by Request Type

| Request | Primary Workflow | Useful Skills |
| --- | --- | --- |
| Establish or adopt Scaffold in a repository | `initialize-project` | `collect-context` |
| Define an ambiguous request, problem, requirement, or discovered need | `define-change` | `collect-context`, `analyze-impact` |
| Review a proposed durable change before implementation | `review-change` | `collect-context`, `analyze-impact` |
| Implement an accepted change | `implement-change` | `collect-context`, `analyze-impact`, `verify-change` |
| Change requirements, design, or governance knowledge | `update-knowledge` | `collect-context`, `analyze-impact` |
| Turn a defect, incident, or security finding into reusable knowledge | `learn-from-finding` | `collect-context`, `analyze-impact`, `verify-change` |
| Adapt to an incompatible Scaffold change | `migrate-project` | `collect-context`, `analyze-impact`, `verify-change` |

Workflows define the ordered Phases and their required outcomes. A Phase defines its local intent and can be completed without a Skill. Skills provide reusable, suggested methods; project rules may require or prohibit a particular method. A project may replace a workflow or skill with a local artifact.

Use `define-change` when the requested semantics are not sufficiently defined. Its output is a sufficiently defined proposed knowledge change, not acceptance. Route proposed-but-not-yet-accepted durable changes through `review-change`; only an accepted change enters `implement-change`.

Use `update-knowledge` when the exact durable knowledge change is already known.

## Knowledge Discipline

Update durable project knowledge when a change affects externally observable behavior, requirements, interfaces, responsibilities, security assumptions, or important design reasoning. Do not create knowledge updates for purely mechanical changes.

When sources disagree, analyze the inconsistency. Do not automatically treat code, tests, or temporary work artifacts as the sole authority.

Classify durable knowledge before recording it: keep stakeholder intent and externally meaningful obligations in Problem Space; retain external contracts, findings, policies, controls, constraints, and applicability in Governance Space; and record solution capabilities, responsibilities, components, interfaces, designs, decisions, and verification in Solution Space. Preserve the Model invariants: do not turn a Finding directly into a universal Control, do not put unmandated implementation detail into a Requirement, and do not claim Verification evidence that has not occurred.

Templates provide starting structure only. Apply the active Schema when updating records and preserve existing project knowledge coherently rather than mechanically rewriting it for a Schema or Template change.
