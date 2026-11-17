---
name: define-change
description: Turn an ambiguous request, problem, requirement, or discovered need into a proposed Project Knowledge change ready for reconciliation.
---

# Define Change

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

- Use the collected evidence to establish settled decisions and prerequisites in the change-decision tree before eliciting the remaining choices.
- Begin with decisions whose prerequisites are known. Ask the whole currently answerable frontier as one concise round, including a recommended answer and the trade-off when useful. Defer dependent questions until their prerequisites are settled.
- Recompute the decision tree after each answer. Continue until every material branch is settled, explicitly unknown, or intentionally out of scope.
- Explore the dimensions that apply: desired outcome and rationale; users or other affected parties; current and desired behavior; scope and non-goals; scenarios and observable acceptance conditions; constraints and dependencies; failure, boundary, and lifecycle cases; data, security, compatibility, operational, rollout, and migration implications; alternatives and their trade-offs.
- When a proposed solution combines agent-executed adaptive behavior with deterministic programs, elicit the material responsibility allocation, agent host and Skill distinction, tool and integration interfaces, dependencies, rationale, authority and failure concerns, and layered verification expectations. Do not assume the project must implement an agent runtime or move behavior into a program merely because it can be automated.
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
