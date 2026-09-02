---
name: migrate-project
description: Safely adapt a project when an approved Scaffold candidate update needs deliberate migration.
---

# Migrate Project

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Safely adapt a project when an approved candidate update requires more than deliberate project-local artifact changes.

## Entry Conditions

- A Scaffold update requires deliberate project migration.

## Phases

### Phase — Establish Migration Context

#### Goal

Establish the versions, candidate differences, and affected project-local artifacts.

#### Required Outcome

The current project-local behavior, candidate differences, and all affected Knowledge Schema, Project Rules, workflows, and skills are identified. A legacy monolithic Project Rules file is treated as an explicit migration subject, not an active Rule collection.

#### Suggested Skills

- collect-context

### Phase — Define Model Migration Crosswalk

#### Goal

Make semantic correspondences and non-correspondences between a retiring and target Knowledge Model explicit before adapting project knowledge.

#### Required Outcome

When a Knowledge Model changes, a project-owned Model Migration Crosswalk identifies source and target Model identities for concept and relationship mappings. When represented fields require migration, it also identifies the source and target Schema identities that own those fields. Each entry records mapping kinds and cardinalities, ID and reference treatment, migration disposition, review decisions, and unresolved ambiguity. The Crosswalk does not activate both Models or authorize automatic semantic rewriting.

### Phase — Determine Migration Impact

#### Goal

Determine which project-owned artifacts and knowledge require deliberate adaptation.

#### Required Outcome

Project-local schemas, workflows, skills, and Rules are reviewed as active artifacts; candidate differences, Rule migration, necessary knowledge changes, and any Model Migration Crosswalk are identified.

#### Suggested Skills

- analyze-impact

### Phase — Realize Migration

#### Goal

Apply the necessary project-owned migration decisions safely.

#### Required Outcome

Necessary changes to durable project knowledge are made deliberately rather than by automatic rewrite for a Schema or template change, and decisions that cannot be safely inferred are recorded for the project owner.

### Phase — Verify Migration

#### Goal

Confirm the migrated project has the intended version and remains usable.

#### Required Outcome

The project metadata reflects the intended Scaffold version and proportionate migration verification is complete.

#### Suggested Skills

- verify-change

## Required Outcomes

- The project is deliberately adapted to the intended Scaffold version.

## Conditional Outcomes

- Create a specialized project migration workflow when the project has materially different migration needs.
