---
name: migrate-references
description: Prepare and verify context-sensitive repository reference repair after files or knowledge objects move, split, merge, are removed, or change representation.
---

# Migrate References

## Goal

Preserve what each referring statement relies on while repairing repository references and removing obsolete files without redirect stubs.

## Entry Conditions

- An intended file, object, or reference-representation change requires reference repair.

## Phases

### Phase — Establish Migration Context

#### Goal

Identify the retiring locations, intended targets, applicable representation, and repair boundary.

#### Required Outcome

The caller's intended change, repository boundary, relevant source and target content, accepted baseline, current candidate changes, and applicable guidance are known. Preserve a source-to-location inventory before removing declarations or files. Existing unrelated edits remain outside the migration scope.

#### Relevant Rules

- core.*

#### Suggested Skills

- collect-context
- analyze-change-impact

### Phase — Inventory and Assess Referring Contexts

#### Goal

Find affected references and determine supported replacements according to each referring statement's meaning.

#### Required Outcome

Deterministic repository searches inventory old paths, identifiers where applicable, fragments, and material textual mentions. Include outgoing relative links whose base changes after a move. Record effective search scope, errors, inaccessible sources, and exclusions such as dependency directories, Git internals, generated artifacts, and historical package archives; exclusions must not conceal active source references.

The host spawns read-only subagents, partitioned by referring file where practical. Supply the intended change, source snapshot, target content, applicable representation, and a bounded assessment assignment. Each returns referring locations, relied-on meaning, supported target(s) or proposed relationship retirement, evidence, and unresolved choices. A path substitution may suffice for a move; splits and merges may require different targets for different contexts or multiple targets for one statement. A removed obligation may require revising the referring statement and retiring its relationship. Search similarity and a resolving link alone do not establish a valid mapping.

Record which source contents each assessment used so concurrent edits can be detected. If subagents are unavailable, report assessment incomplete; do not silently replace the delegated assessment with coordinator self-review.

### Phase — Prepare Reconciliation Handoff

#### Goal

Consolidate supported mappings without accepting changed knowledge.

#### Required Outcome

Return a proposed delta containing the source inventory, per-context mappings and rationale, affected relationships, intended removals, coverage limits, and unresolved ambiguity. Recheck assessed content against the current files and reassess material changes. Never guess an unsupported target.

For Project Knowledge, the caller routes this proposal through `reconcile-project-change` with fresh writer and reviewer contexts. This Skill does not invoke that workflow or accept its own proposal. A finding needing owner direction is supplied with evidence and viable alternatives through reconciliation. Return the handoff when acceptance is not yet available; resume realization only with an accepted mapping. Unavailable independent review leaves the knowledge migration incomplete.

### Phase — Realize Accepted Mappings

#### Goal

Apply authorized reference changes while preserving unrelated content.

#### Required Outcome

The caller realizes accepted mappings and mechanical synchronization within the authorized repository scope. Revalidate affected sources immediately before editing; reassess concurrent changes rather than applying stale mappings. Repair incoming references, outgoing relative bases, object locators, and referring statements as accepted. Preserve local identity where meaning remains unchanged and reconcile collisions according to the active Schema.

Remove obsolete files after their references have been accounted for. Keep no superseded files or redirect stubs. External consumers cannot be repaired by repository edits and do not justify retaining obsolete files. A newly discovered semantic change returns as a proposed reconciliation delta rather than being silently accepted during realization.

### Phase — Verify Migration Completion

#### Goal

Demonstrate that affected references resolve and retain their supported meaning.

#### Required Outcome

Search again for former locators and inspect the diff. Account for every remaining occurrence: deliberate historical descriptions are distinct from live references that still need repair. Check affected paths and object locators from their actual referring locations, including outgoing links after moves. Confirm obsolete files and redirect stubs are absent and that independent knowledge review covers the realized relationships. A syntactically valid link is insufficient evidence of semantic preservation.

Report completed checks, assessed scope, exclusions, external-reference limits, and unresolved work. Missing targets, unsupported mappings, unreviewed source changes, or incomplete searches prevent a claim of complete migration. Do not add a deterministic semantic validator or a new agent runtime.

#### Suggested Skills

- verify-change

## Required Outcomes

- Per-context mappings preserve supported referring meaning and have the required independent reconciliation.
- Applicable repository references resolve under the active representation.
- Obsolete files and redirect stubs are absent.
- Search limits, external consumers, and incomplete work are reported accurately.
