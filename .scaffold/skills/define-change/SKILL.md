---
name: define-change
description: Turn an ambiguous request, problem, requirement, or discovered need into a proposed Project Knowledge change ready for reconciliation.
---

# Define Change

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Turn an idea, request, problem, or discovered need into a sufficiently defined proposed knowledge change.

## Entry Conditions

- A meaningful change intent exists.
- The intended project semantics are not yet sufficiently defined.

## Phases

### Phase — Establish Change Context

#### Goal

Understand the change intent, relevant existing knowledge, and applicable rules without assuming the user's wording is the final project semantics.

#### Required Outcome

The change intent, active Knowledge Schema, applicable `core.knowledge-space-partition` Rule, relevant durable knowledge, and authoritative project records are identified.

#### Suggested Skills

- collect-context

### Phase — Build a Shared Change Picture

#### Goal

Elicit the decisions needed to understand the intended change without silently filling material gaps.

#### Required Outcome

The intent is represented as a decision tree. The user and agent share a detailed, evidence-informed picture of the desired outcome, scope, constraints, and observable success; material uncertainty is either resolved or explicitly retained for reconciliation or an owner decision.

#### Method

- Research facts from the repository, active knowledge, rules, and available tools before asking the user. Do not ask the user for information that can be found reliably.
- Begin with decisions whose prerequisites are known. Ask the whole currently answerable frontier as one concise round, including a recommended answer and the trade-off when useful. Defer dependent questions until their prerequisites are settled.
- Recompute the decision tree after each answer. Continue until every material branch is settled, explicitly unknown, or intentionally out of scope.
- Explore the dimensions that apply: desired outcome and rationale; users or other affected parties; current and desired behavior; scope and non-goals; scenarios and observable acceptance conditions; constraints and dependencies; failure, boundary, and lifecycle cases; data, security, compatibility, operational, rollout, and migration implications; alternatives and their trade-offs.
- Apply `core.knowledge-space-partition` when it is active. Partition material claims into Project Context, Problem, Governance, and Solution spaces, and retain the resulting disposition in the shared picture. For mixed externally meaningful behavior and technical realization, establish or reuse the Problem obligation and observable acceptance condition before proposing linked Solution knowledge.
- Treat minor, reversible assumptions as assumptions. Treat an ambiguity as material when a reasonable answer would change durable knowledge, acceptance conditions, scope, or implementation direction.

### Phase — Determine Knowledge Impact

#### Goal

Determine the semantic impact and the knowledge relationships affected by the shared change picture.

#### Required Outcome

Affected durable knowledge, material relationships, and potentially stale records are identified according to the active Knowledge Model and Knowledge Schema. The active Model’s ownership, evidence, and relationship rules are applied. Existing authoritative records are considered before creating duplicates.

#### Suggested Skills

- analyze-impact

### Phase — Prepare Reconciliation Handoff

#### Goal

Provide `reconcile-project-change` with a sufficiently defined, non-mutating proposal.

#### Required Outcome

The handoff states the change intent and rationale; settled decisions, scenarios, and acceptance conditions; the explicit knowledge-space partition and resulting relationships; scope and non-goals; evidence and assumptions; unresolved material questions or conflicts; affected knowledge and relationships; potentially stale records; and the proposed semantic delta. It is sufficiently defined for `reconcile-project-change` and is not accepted Project Knowledge.

Do not create, edit, or draft Project Knowledge documents in this Workflow. `reconcile-project-change` owns candidate-document editing through its fresh `update-knowledge` writer, followed by independent review and any required owner decision.

## Required Outcomes

- Intent and expected outcome are understood.
- Relevant existing knowledge and Project Rules are considered.
- A detailed shared change picture is established through evidence gathering and prerequisite-aware questioning.
- Material ambiguities are resolved or explicitly recorded.
- Conflicts with existing project knowledge are addressed.
- The intended knowledge delta is established without assuming knowledge is append-only.
- The proposed Project Knowledge delta is sufficiently defined for `reconcile-project-change`.

## Conditional Outcomes

- Use `evolve-project-rules` when project-wide engineering practices change.
- Identify implementation impact without requiring production code changes.
