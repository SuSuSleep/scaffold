# Guidance Context Resolution

Document ID: SOL-005

> Evidence source: [`.scaffold/agent-guide.md`](../../.scaffold/agent-guide.md), [`.scaffold/knowledge-schema.md`](../../.scaffold/knowledge-schema.md), [`.scaffold/rules/`](../../.scaffold/rules/), and [`.scaffold/skills/`](../../.scaffold/skills/), inspected 2026-11-17.

## Capabilities

### CAP-001 — Selective guidance context resolution

Enable agents to identify and consume only the Governance and Project Rules relevant to a Workflow Phase while retaining Governance as durable, independently evolvable project knowledge.

### CAP-002 — Rule-guided verification approach

Separate Rule-guided project-wide verification approach from the solution-specific expectations that must be demonstrated.

## Responsibilities

### RESP-001 — Phase-relevant guidance discovery

Realizes: CAP-001

Define the guidance evidence needed for the current work outcome and resolve applicable Governance and Project Rules by active-Model meaning. The caller owns the search target and sufficiency judgment; the executing agent uses reusable context-collection guidance within the supplied scope and authority constraints.

### RESP-002 — Verification responsibility separation

Realizes: CAP-002

Keep test methodology and evidence-selection strategy in Project Rules while Solution documents retain the specific verification items they must demonstrate.

## Components and Boundaries

- **The project-local agent guide** is assigned-to RESP-001 for Scaffold authority resolution, applicable classification-policy discovery, and invocation policy. It connects Workflow Phase intent and relevance declarations to the caller's context-collection assignment.
- **Project-local workflow Skills in `.scaffold/skills/`** are assigned-to RESP-001 for declaring phase outcomes and relevant semantic knowledge and Rule categories, without naming project-specific knowledge paths, fixing the default knowledge taxonomy, or duplicating shared authority and classification policy.
- **The external agent host** is assigned-to RESP-001 for interpreting the current request or Phase, defining the collection assignment, and executing adaptive evidence selection and applicability judgment.
- **The project-local `collect-context` Skill** is assigned-to RESP-001 for reusable search-method guidance. Its caller-to-method boundary carries a search target, completion criteria, and applicable scope and source-authority constraints. Its result distinguishes source-located observations from inferences answering the target; each inference links supporting evidence with concise rationale and material assumptions or conditions. Supported conclusions remain distinct from unverified hypotheses, and insufficient evidence may warrant no conclusion. The result also identifies material conflicts, gaps, or unknowns and assesses completion against the caller's criteria. It owns neither Scaffold policy nor a fixed source inventory. The installed package supplies candidate Skills only for initialization and update review.
- **Solution documents** are assigned-to RESP-002 for Solution verification items.
- **Project Rules** are assigned-to RESP-002 for project-wide verification approach and applicability guidance.

## Satisfies

- CAP-001 — Selective guidance context resolution satisfies:
  - PROB-005#REQ-010 — Selective guidance consumption
- CAP-002 — Rule-guided verification approach satisfies:
  - PROB-005#REQ-010 — Selective guidance consumption

## Design and Decisions

### DEC-001 — Scope is distinct from context loading

Governance and Project Rules may be project-wide in scope without being loaded for every activity. Workflow Phase intent determines relevant categories; agents resolve applicability semantically rather than through a deterministic routing engine. The agent guide owns shared authority resolution and applicability discovery, applicable Project Rules own operational classification guidance, and `collect-context` owns reusable search guidance. Workflow and method Skills consume these policies while defining their own task-specific results. This allocation avoids competing policy copies and lets changes to Model/Schema authority or classification policy remain in their owning artifacts rather than requiring parallel edits to generic Skills.

Lifecycle metadata is conditional evidence, not a prerequisite of context collection. The guide makes its relevance depend on missing lifecycle facts needed by the current task. This preserves access when lifecycle evidence matters without imposing a metadata read on unrelated searches.

### DEC-002 — Verification approach and item separation

Project Rules define how the project generally approaches verification. A Solution defines what it must demonstrate through Verification Items, which normally verify Acceptance Criteria and may directly verify technical expectations when needed. Execution results are not automatically durable knowledge. A Solution may specify a verification method only when an exceptional solution-specific constraint requires it.

## Verification Items

### VER-001 — Selective guidance consumption

Verifies:

- PROB-005#AC-014 — Agents consume only relevant durable guidance.

Scope:

- phase-relevant Governance and Rule resolution across the guide, caller, and context-method boundary.

Expected evidence:

- Workflow and Skill guidance refers to Governance and Rules by semantic category and never requires a project-specific path.
- Agents can identify phase-relevant guidance without loading every Governance record or Rule.
- A Skill-guided Phase scenario demonstrates that the caller supplies the evidence target and sufficiency criteria from Phase intent and relevance declarations, with authority constraints supplied by project guidance.
- Context-collection scenarios return source-located observations separately from evidence-linked inferences, with rationale and material conditions, and identify limits and completion against the supplied criteria. Supported conclusions and unverified hypotheses remain distinguishable; insufficient evidence is reported without forcing a conclusion.
- Context-collection scenarios distinguish an unrelated search from a task needing otherwise missing lifecycle facts: metadata is consulted only in the latter case. These scenarios demonstrate adaptive guidance use; instruction inspection alone does not demonstrate agent execution.

Assumptions:

- applicable Governance and Rules have been recorded with enough semantic context to resolve their applicability.

## Related Knowledge

- PROB-005#REQ-010 — Selective guidance consumption.
- SOL-003#CAP-002 — Deliberate guidance authority.
- SOL-004#RESP-003 — Reusable method guidance.
