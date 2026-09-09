# Scaffold Agent Guide

## Start Every Meaningful Request Here

1. Read the current user request and inspect the repository context.
2. Read `.scaffold/metadata.md` and run `scaffold status` when the installed candidate version or active project-local artifacts are needed.
3. Resolve the active Knowledge Model from `.scaffold/knowledge-model.md`. Read that active Model before materially interpreting, creating, updating, or reviewing Project Knowledge.
4. Resolve every active Scaffold artifact from `.scaffold/`: Knowledge Model, Knowledge Schema, Skills, Templates, and Project Rules are project-local runtime authority. The installed package is a candidate bundle for initialization and deliberate update review, never a runtime fallback. Template availability does not make it applicable; the active Knowledge Schema selects applicable template types.
5. Resolve the active Knowledge Schema before materially interpreting, creating, updating, or reviewing Project Knowledge. When creating or updating it, use this precedence: active Knowledge Model for semantic meaning, active Knowledge Schema for representation, applicable Template for starting structure, then existing Project Knowledge for local coherence. Do not infer semantic meaning solely from template headings. A purely mechanical repository operation need not load the Schema.
6. Resolve material ambiguity from authoritative project evidence first; ask the user only when unresolved ambiguity would materially change the durable knowledge outcome.

## Choose Guidance by Request Type

| Request | User-invoked workflow Skill | Model-invoked Skills |
| --- | --- | --- |
| Establish or adopt Scaffold in a repository | `initialize-project` | `collect-context` |
| Reconstruct documentation or recover durable knowledge from an existing repository area | `reconstruct-project-knowledge` | `collect-context` |
| Define an ambiguous request, problem, requirement, or discovered need | `define-change` | `collect-context`, `analyze-impact` |
| Reconcile a proposed Project Knowledge change | `reconcile-project-change` | `collect-context`, `analyze-impact` |
| Independently review a reconciliation candidate | `reconcile-project-change` (which delegates `review-change`) | `collect-context`, `analyze-impact`, `review-change` |
| Implement an accepted change | `implement-change` | `collect-context`, `analyze-impact`, `verify-change` |
| Mutate Project Knowledge during reconciliation | `reconcile-project-change` (which delegates `update-knowledge`) | `collect-context`, `analyze-impact`, `update-knowledge` |
| Deliberately add, replace, or retire project-local Rules | `evolve-project-rules` | `analyze-rule-conflicts` |
| Deliberately replace or add a Schema, Skill, or Template | `evolve-project-artifact` | `collect-context`, `analyze-impact` |
| Turn a defect, incident, or security finding into reusable knowledge | `learn-from-finding` | `collect-context`, `analyze-impact`, `verify-change` |
| Adapt to an incompatible Scaffold change | `migrate-project` | `collect-context`, `analyze-impact`, `verify-change` |

Workflow Skills are the high-level user interface. They define ordered Phases and their required outcomes, and expose an `agents/openai.yaml` interface so a user can call them directly. Skills without an interface are model-invoked components: tactical methods such as `collect-context`, and internal lifecycle steps such as `update-knowledge` and `review-change`. A workflow Skill may use model-invoked Skills, never another workflow Skill. A project may replace a Skill as a local artifact.

Use `define-change` when the requested Project Knowledge semantics are not sufficiently defined. Its output is a sufficiently defined proposed Project Knowledge delta, not acceptance. Route it through `reconcile-project-change`: a fresh writer subagent runs `update-knowledge`, then a distinct fresh reviewer subagent runs read-only `review-change`. Use Git to identify the accepted baseline and the candidate Project-Knowledge diff. A finding that needs user direction immediately prompts the user with evidence, selectable alternatives, and effects; the answer begins a fresh iteration. A clean independent review automatically accepts the candidate and shows the changed Project Knowledge. Only accepted Project Knowledge enters `implement-change` when implementation is needed.

Use `update-knowledge` only as the writer step in `reconcile-project-change`; it produces candidate state and cannot accept it.

Use `reconstruct-project-knowledge` for requests such as “reconstruct project documentation,” “document this existing subsystem,” or “recover knowledge from this codebase.” Treat implementation as evidence, not unquestionable intent; record exceptional `Inferred` and `Unknown` states. When reconstruction changes normal Project Knowledge, send its proposed delta through `reconcile-project-change`. A link to an `Inferred` or `Unknown` record requires project-owner review before material reliance or acceptance.

## Knowledge Discipline

Update durable project knowledge when a change affects behavior, constraints, interfaces, responsibilities, evidence, or important design reasoning as defined by the active Model. Do not create knowledge updates for purely mechanical changes.

When sources disagree, analyze the inconsistency. Do not automatically treat code, tests, or temporary work artifacts as the sole authority. Project-wide engineering practices belong in Project Rules; record durable project truth only in the active Model's appropriate knowledge category.

Classify durable knowledge according to the active Knowledge Model before recording it. Preserve that Model's distinctions, relationship semantics, ownership rules, evidence boundaries, and invariants. Do not infer concepts or constraints solely from a template heading or an implementation detail.

For a proposed knowledge change, apply `core.knowledge-space-partition` when it is active. Partition material claims into Project Context, Problem, Governance, and Solution spaces before recording or reviewing them. Mixed externally meaningful behavior and technical realization require an established or reused Problem obligation and observable acceptance condition before linked Solution knowledge; Governance and purely technical changes follow the Rule's applicable paths. Workflows must read and apply the active Rule Markdown as operating policy rather than treating copied workflow prose as an independent policy authority.

Begin each workflow Skill Phase from its Goal and Required Outcome, identify the active Model's relevant knowledge categories and Project Rule identities or categories, and read only the applicable records and rules. Resolve categories semantically rather than from hard-coded project file paths; expand context only when dependencies or uncertainty require it. Project Rules define how work should or must be performed; the active Model defines durable project knowledge.

Templates provide starting structure only. Apply the active Schema when updating records and preserve existing project knowledge coherently rather than mechanically rewriting it for a Schema or Template change.

Under the default Schema, record project-wide purpose, top-level Goals, terms, scope or exclusions, and material unknowns in the Project Context record; do not create a Problem document merely to record a project goal. A Problem document represents one coherent subject: extend it only when the added knowledge concerns that same subject, otherwise create a new Problem document. Shared project membership, goals, actors, dependencies, implementation areas, or repository layout do not create document containment; represent material connections explicitly.

## Identifier and Reference Discipline

Use the active Knowledge Schema as the authority for identifier and reference representation. Under the default Schema, determine the containing document first, then use `scaffold id next <CTX|PROB|SOL|GOV>` or `scaffold id check <DOCUMENT_ID>` before creating a document; document IDs are unique within their type namespace. Object IDs remain document-local. A replacement Schema defines its own identifier conventions. Give every identified object a concise descriptive title when its Schema requires one.

Use local IDs for same-document references and qualified `<DOCUMENT_ID>#<OBJECT_ID>` references for cross-document relationships. Include the copied title when practical, recognizing that it is a semantic hint rather than identity.

Preserve an ID when ordinary wording changes retain the same knowledge object. Allocate a new ID when the semantic identity changes, and do not assign IDs merely because content appears in a list. Review identifier consistency semantically; the default representation deliberately has no deterministic semantic validator.
