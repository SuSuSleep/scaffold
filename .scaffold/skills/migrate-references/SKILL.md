---
name: migrate-references
description: Prepare and verify repository reference repair and document or object conflict resolution after renames, parallel changes, reorganization, or representation changes.
---

# Migrate References

## Goal

Preserve what each referring statement relies on while repairing references, resolving document or object conflicts, and removing obsolete locations without aliases or redirect stubs.

## Entry Conditions

- A document or object change requires reference repair, or parallel changes expose a locator or meaning conflict.

## Phases

### Phase — Establish Migration Context

#### Goal

Identify source locations and competing contents, intended targets, applicable representation, and repair boundary.

#### Required Outcome

The caller's intended change, repository boundary, relevant source and target content, current changes, and applicable guidance are known. Identify the accepted Git baseline for Project Knowledge and available version evidence for other files; explicitly report an absent baseline or unavailable provenance. Missing evidence does not prohibit read-only assessment, but a missing accepted knowledge baseline prevents knowledge acceptance. For competing contents at one location, inspect available branch or version evidence and preserve each occurrence or version separately. Inventory source paths, titles, object locators, and provenance before renaming, merging, or removal. Existing unrelated edits remain outside scope. Resolve title/fragment conventions through the active Schema; this Skill does not require any particular ID or anchor format.

#### Relevant Rules

- core.*

#### Suggested Skills

- collect-context
- analyze-change-impact

### Phase — Inventory and Assess Referring Contexts

#### Goal

Find affected references and determine supported replacements according to each referring statement's meaning.

#### Required Outcome

Deterministic repository searches inventory old paths, titles, identifiers where applicable, fragments, and material textual mentions. Include same-document references affected by an object rename and outgoing relative links whose base changes after a move. Inspect source-version evidence in Git when relevant; exclude Git internals from ordinary active-reference repair. Record effective scope, errors, inaccessible sources, and exclusions such as dependencies, generated artifacts, and historical package archives; exclusions must not conceal active sources.

The host spawns read-only subagents, partitioned by referring file where practical. Supply the intended change, source snapshots including competing versions or occurrences, target content, applicable representation, and a bounded assessment assignment. Each returns referring locations, relied-on meaning, source provenance, supported target(s) or proposed relationship retirement, evidence, and unresolved choices. The same old path or fragment can require different targets in different referring contexts. A locator string alone is insufficient when its former target was ambiguous. A path substitution may suffice for a move; splits and merges may require multiple targets. A removed obligation may require revising the statement and retiring its relationship. Search similarity and a resolving link do not establish a valid mapping.

Record which source and target contents each assessment used so concurrent changes can be detected. If subagents are unavailable, report assessment incomplete; do not silently replace delegated assessment with coordinator self-review.

### Phase — Classify and Resolve Conflict Proposals

#### Goal

Separate naming collisions from duplicate meaning and substantive contradiction before choosing replacements.

#### Required Outcome

Subagent evidence and referring contexts distinguish these concerns at both levels:

- **Documents:** competing contents claim the same path, or apparently equivalent subjects occur at different paths. Preserve each source version and its applicable scope; do not overwrite a claimant or assume that the newest version is authoritative.
- **Objects:** the same title or normalized fragment denotes different contents, equivalent meaning appears under different titles, or claims contradict each other. Check fragment normalization as well as title text under the active Schema, including other targets in the containing document. Identical titles in different documents may be valid.

For distinct meanings, propose descriptive disambiguation and repair references according to provenance and intent. For evidence-supported equivalent meanings, propose consolidation that preserves obligations, ownership, scope, and relationships. Names alone do not establish equivalence, and distinct names do not establish different meaning. Do not invent order-dependent numeric suffixes as semantic resolution. A content contradiction remains unresolved until authoritative evidence or owner direction settles it; do not hide it through renaming or silently prefer a version. An underspecified referring statement remains unresolved even if other references to the same old locator can be mapped.

### Phase — Prepare Reconciliation Handoff

#### Goal

Consolidate supported mappings without accepting changed knowledge.

#### Required Outcome

Return a proposed delta containing the source inventory and provenance, conflict classifications, per-context mappings and rationale, affected relationships, intended disambiguation or consolidation, removals, coverage limits, and unresolved ambiguity. Recheck assessed sources and targets against current files and reassess material changes. Never guess an unsupported target.

For Project Knowledge, the caller routes this proposal through `reconcile-project-change` with fresh writer and reviewer contexts. This Skill does not invoke that workflow or accept its own proposal. A finding needing owner direction is supplied with evidence and viable alternatives through reconciliation. Return the handoff when acceptance is not yet available; resume realization only with an accepted mapping. Unavailable independent review leaves the knowledge migration incomplete.

### Phase — Realize Accepted Mappings

#### Goal

Apply authorized reference changes while preserving unrelated content.

#### Required Outcome

The caller realizes accepted mappings and mechanical synchronization within the authorized repository scope. Revalidate affected sources and targets immediately before editing; reassess concurrent changes rather than applying stale mappings. Repair incoming and same-document references, outgoing relative bases, object locators, copied titles, and referring statements as accepted. Regenerate locators when the active Schema makes them title-dependent. Preserve supported meaning and ownership while realizing accepted disambiguation, consolidation, or retirement; no old locator is an authority to redefine the target.

Remove obsolete files and object locators after their references have been accounted for. Keep no old numeric or title aliases, superseded files, or redirect stubs. External consumers cannot be repaired by repository edits and do not justify retaining obsolete locations. A newly discovered semantic change returns as a proposed reconciliation delta rather than being silently accepted during realization.

### Phase — Verify Migration Completion

#### Goal

Demonstrate that affected references resolve and retain their supported meaning.

#### Required Outcome

Search again for former locators and inspect the diff. Account for remaining occurrences: deliberate historical descriptions differ from live references needing repair. Check affected paths and object locators from their actual referring locations, including local fragments after title changes and outgoing links after moves. Confirm that referenceable titles/fragments are unambiguous under the active Schema, resolved conflicts preserve the accepted meanings and relationships, and independent knowledge review covers the result. Confirm obsolete files, old locator aliases, and redirect stubs are absent. A syntactically valid link or a conflict-free Git merge does not establish semantic preservation.

Report completed checks, assessed scope, exclusions, external-reference limits, and unresolved work. Missing targets, unsupported mappings, unresolved document/object conflicts, unreviewed source or target changes, or incomplete searches prevent a claim of complete migration. Do not add a deterministic semantic validator or a new agent runtime.

#### Suggested Skills

- verify-change

## Required Outcomes

- Per-context mappings preserve supported referring meaning and have the required independent reconciliation.
- Document and object conflicts have evidence-backed dispositions or remain explicitly unresolved.
- Applicable repository references resolve under the active representation.
- Obsolete files, old locator aliases, and redirect stubs are absent.
- Search limits, external consumers, and incomplete work are reported accurately.
