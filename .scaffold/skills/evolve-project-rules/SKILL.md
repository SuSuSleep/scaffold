---
name: evolve-project-rules
description: Deliberately add, revise, or retire project-local Rules while reviewing the local Rule collection.
---

# Evolve Project Rules

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Deliberately add, replace, revise, or retire project-local Rules while preserving a coherent effective Rule set.

## Entry Conditions

- A Project Rule change is intended or required.

## Phases

### Phase — Establish Rule Context

#### Goal

Identify the active project-local Rules relevant to the intended change.

#### Required Outcome

The relevant local Rules, evidence, applicability, and current project guidance are understood.

#### Suggested Skills

- collect-context

### Phase — Define Rule Change

#### Goal

Specify the stable identity, applicability, guidance, and evidence for the local Rule change.

#### Required Outcome

The change is expressed as a local addition, revision, or retirement without relying on implicit content merge.

### Phase — Resolve Local Rule Collection

#### Goal

Determine the active collection after the proposed change.

#### Required Outcome

Project-local Rules are identified by stable identity; duplicate local identities are resolved deliberately.

### Phase — Review Conflicts

#### Goal

Review the proposed effective set for material semantic conflict or drift.

#### Required Outcome

Overlapping Rules are classified as compatible overlap, specialization, contradiction, redundancy, or unknown intent. Material unresolved conflict is surfaced rather than silently accepted.

#### Suggested Skills

- analyze-rule-conflicts

### Phase — Accept Rule Change

#### Goal

Make and communicate the deliberate local Rule update.

#### Required Outcome

The local Rule collection reflects the accepted change, affected guidance is reconciled, and unresolved intent is recorded for the project owner.

## Required Outcomes

- Every independently resolvable Rule has a stable identity and applicability.
- The project-local Rule collection has unique stable identities.
- Semantic conflict review is agent-driven and does not invent project intent.
