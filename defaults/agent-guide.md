# Scaffold Agent Guide

## Start Every Meaningful Request Here

1. Read the current user request and inspect the repository context.
2. Read `.scaffold/metadata.md` and run `scaffold status` when the shared package location or active replacements are needed.
3. Read the shared Knowledge Model from the installed Scaffold package. It is a Harness-level semantic contract and cannot be replaced by `.scaffold/knowledge-model.md`.
4. Resolve each Scaffold artifact explicitly. Knowledge Schema, Workflow, Skill, and Template use full project-local replacement when present. Project Rules are an effective collection: combine shared and local rules by stable identity, with a local rule atomically replacing a shared rule of the same identity. Never merge artifact or rule content implicitly. Template availability does not make it applicable; the active Knowledge Schema selects applicable template types.
5. Resolve the active Knowledge Schema before materially interpreting, creating, updating, or reviewing Project Knowledge. When creating or updating it, use this precedence: shared Knowledge Model for semantic meaning, active Knowledge Schema for representation, applicable Template for starting structure, then existing Project Knowledge for local coherence. Do not infer semantic meaning solely from template headings. A purely mechanical repository operation need not load the Schema.
6. Resolve material ambiguity from authoritative project evidence first; ask the user only when unresolved ambiguity would materially change the durable knowledge outcome.

## Choose Guidance by Request Type

| Request | Primary Workflow | Useful Skills |
| --- | --- | --- |
| Establish or adopt Scaffold in a repository | `initialize-project` | `collect-context` |
| Reconstruct documentation or recover durable knowledge from an existing repository area | `reconstruct-project-knowledge` | `collect-context` |
| Define an ambiguous request, problem, requirement, or discovered need | `define-change` | `collect-context`, `analyze-impact` |
| Review a proposed durable change before implementation | `review-change` | `collect-context`, `analyze-impact` |
| Implement an accepted change | `implement-change` | `collect-context`, `analyze-impact`, `verify-change` |
| Change requirements, design, or governance knowledge | `update-knowledge` | `collect-context`, `analyze-impact` |
| Deliberately add, replace, or retire project-local Rules | `evolve-project-rules` | `analyze-rule-conflicts` |
| Deliberately replace or add a Schema, Workflow, Skill, or Template | `evolve-project-artifact` | `collect-context`, `analyze-impact` |
| Turn a defect, incident, or security finding into reusable knowledge | `learn-from-finding` | `collect-context`, `analyze-impact`, `verify-change` |
| Adapt to an incompatible Scaffold change | `migrate-project` | `collect-context`, `analyze-impact`, `verify-change` |

Workflows define the ordered Phases and their required outcomes. A Phase defines its local intent and can be completed without a Skill. Skills provide reusable, suggested methods; project rules may require or prohibit a particular method. A project may replace a workflow or skill with a local artifact.

Use `define-change` when the requested semantics are not sufficiently defined. Its output is a sufficiently defined proposed knowledge change, not acceptance. Route proposed-but-not-yet-accepted durable changes through `review-change`. Acceptance selects the appropriate downstream Workflow: `update-knowledge`, `implement-change`, `evolve-project-rules`, `evolve-project-artifact`, or a necessary sequence.

Use `update-knowledge` when the exact durable knowledge change is already known.

Use `reconstruct-project-knowledge` for requests such as “reconstruct project documentation,” “document this existing subsystem,” or “recover knowledge from this codebase.” Treat implementation as evidence, not unquestionable intent; record exceptional `Inferred` and `Unknown` states. Do not materially rely on either state without review or clarification.

## Knowledge Discipline

Update durable project knowledge when a change affects externally observable behavior, requirements, interfaces, responsibilities, security assumptions, or important design reasoning. Do not create knowledge updates for purely mechanical changes.

When sources disagree, analyze the inconsistency. Do not automatically treat code, tests, or temporary work artifacts as the sole authority. Project-wide engineering practices belong in Project Rules; only record a Governance object when it is durable project truth such as a constraint, external obligation, control, finding, evidence, or rationale.

Classify durable knowledge before recording it: keep stakeholder intent and externally meaningful obligations in Problem Space; retain external contracts, findings, policies, controls, constraints, and applicability in Governance Space; and record solution capabilities, responsibilities, components, interfaces, designs, decisions, and verification in Solution Space. Preserve the Model invariants: do not turn a Finding directly into a universal Control, do not put unmandated implementation detail into a Requirement, and do not claim Verification evidence that has not occurred.

For Requirement work, locate its owned Acceptance Criteria and read each criterion's observable `Given`, `When`, and `Then`. A Criterion has one primary Requirement owner; a dependency is a concrete `Given` precondition, not an additional owner. If the interaction between Requirements is itself an obligation, model it as a Requirement with its own Criteria. For verification, locate the relevant Verification Items, keep each item within its declared evidence boundary, and use controlled dependency substitutes only outside that boundary. Preserve the real interaction when the interaction itself is being verified.

Governance may be project-wide in scope without being relevant to every activity. Begin each Workflow Phase from its Goal and Required Outcome, identify the relevant Governance categories and Project Rule identities or categories, and read only the applicable records and rules. Resolve categories semantically rather than from hard-coded project file paths; expand context only when dependencies or uncertainty require it. Project Rules define how work should or must be performed, while Governance records durable constraints, evidence, obligations, and rationale.

Templates provide starting structure only. Apply the active Schema when updating records and preserve existing project knowledge coherently rather than mechanically rewriting it for a Schema or Template change.

## Identifier and Reference Discipline

Use the active Knowledge Schema as the authority for identifier and reference representation. Under the default Schema, determine the containing document first, then use `scaffold id next <PROB|SOL|GOV>` or `scaffold id check <DOCUMENT_ID>` before creating a document; document IDs are unique within their type namespace. Object IDs remain document-local. Give every identified object a concise descriptive title.

Use local IDs for same-document references and qualified `<DOCUMENT_ID>#<OBJECT_ID>` references for cross-document relationships. Include the copied title when practical, recognizing that it is a semantic hint rather than identity.

Preserve an ID when ordinary wording changes retain the same knowledge object. Allocate a new ID when the semantic identity changes, and do not assign IDs merely because content appears in a list. Review identifier consistency semantically; the default representation deliberately has no deterministic semantic validator.
