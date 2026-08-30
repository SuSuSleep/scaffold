---
name: evolve-project-artifact
description: Deliberately add or replace a local Scaffold artifact and reconcile dependent guidance and knowledge.
---

# Evolve Project Artifact

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Deliberately add or replace a project-local Knowledge Model, Knowledge Schema, Skill, or Template without introducing implicit merge semantics.

## Entry Conditions

- A project-local full-replacement artifact change is intended or required.

## Phases

### Phase — Establish Artifact Context

#### Goal

Identify the shared artifact, active local artifact if any, and dependent knowledge or guidance.

#### Required Outcome

The artifact identity, active source, resolution behavior, and relevant dependencies are understood.

#### Suggested Skills

- collect-context

### Phase — Define Intended Evolution

#### Goal

Specify the intended addition or full replacement and its rationale.

#### Required Outcome

The proposed artifact change is sufficiently defined without assuming partial inheritance from the shared artifact.

### Phase — Determine Resolution Semantics

#### Goal

Confirm the artifact’s defined replacement behavior.

#### Required Outcome

Knowledge Model, Knowledge Schema, Skill, or Template is treated as a full replacement by identity. Project Rules are redirected to `evolve-project-rules` because their collection semantics differ.

### Phase — Review Dependency and Shadow Impact

#### Goal

Identify drift and affected knowledge or guidance before activating the local artifact.

#### Required Outcome

Affected workflows, skills, templates, project knowledge, and shadowed shared changes are reviewed. A Knowledge Model replacement identifies whether a project-owned Model Migration Crosswalk is required for concepts or relationships; a Schema replacement identifies whether one is required for represented fields. Cross-authority inconsistency is identified for reconciliation rather than solved through an invented precedence rule.

#### Suggested Skills

- analyze-impact

### Phase — Apply Artifact Change

#### Goal

Make the deliberate project-local artifact update.

#### Required Outcome

The local artifact is added or replaces the shared artifact in full, with no content-level merge.

### Phase — Reconcile Affected Knowledge or Guidance

#### Goal

Restore coherence in dependent artifacts and project knowledge.

#### Required Outcome

Affected knowledge or guidance is deliberately reconciled, and any unresolved owner decision is recorded.

## Required Outcomes

- Each full-replacement artifact retains its defined resolution behavior.
- Artifact authority does not override Knowledge Model semantics, Schema representation, workflow-Skill completion, or other artifact domains.
- Project Rules remain governed by their dedicated evolution workflow Skill.
