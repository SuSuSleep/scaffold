# Migrate Project

## Goal

Safely adapt a project when a Scaffold upgrade cannot be represented by ordinary artifact replacement.

## Entry Conditions

- The project is initialized with Scaffold.
- The changed shared behavior and installed project version are known.
- The affected project-local Knowledge Schema, Project Rules, workflows, and skills have been identified.

## Phases

### Phase — Establish Migration Context

#### Goal

Establish the versions, changed shared behavior, and affected local replacements.

#### Required Outcome

The old and new shared behavior and all affected project-local Knowledge Schema, Project Rules, workflows, and skills are identified.

#### Suggested Skills

- collect-context

### Phase — Determine Migration Impact

#### Goal

Determine which project-owned artifacts and knowledge require deliberate adaptation.

#### Required Outcome

Project-local schemas, rules, workflows, and skills are reviewed as explicit replacements, including Schema shadow drift caused by default Schema or template changes, and necessary knowledge changes are identified.

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
