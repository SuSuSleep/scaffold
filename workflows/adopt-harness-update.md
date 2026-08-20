# Adopt Harness Update

## Goal

Ensure the project can safely operate with the currently installed shared Scaffold version.

## Entry Conditions

- The running Scaffold version differs from the project's last reviewed version.

## Phases

### Phase — Establish Update Context

#### Goal

Identify the newly active shared guidance and affected active replacements.

#### Required Outcome

Relevant shared changes, including default Knowledge Schema and template changes, and affected project-local artifacts are identified.

#### Suggested Skills

- collect-context

### Phase — Review Impact

#### Goal

Classify conflicts and drift introduced by the newly active shared guidance.

#### Required Outcome

Active Conflicts between authoritative artifacts are resolved. Shadow Drift—especially a default Schema change hidden by a project-local Schema—is reviewed for continued relevance. Project knowledge is not automatically rewritten; deliberate semantic migration follows the migration Workflow when needed.

#### Suggested Skills

- analyze-impact

### Phase — Apply Project-Owned Adjustments

#### Goal

Deliberately adapt project-owned artifacts where the review established a need.

#### Required Outcome

Necessary project-local Schema, Rules, Workflow, Skill, Template, or knowledge adjustments are made without automatically rewriting project knowledge solely because shared Schema or Template defaults changed.

### Phase — Determine Migration Need

#### Goal

Decide whether ordinary replacement is sufficient for the adopted shared behavior.

#### Required Outcome

When the update requires semantic project migration, `migrate-project` is selected and completed before this update review is marked complete.

### Phase — Verify Project Consistency

#### Goal

Confirm the project remains coherent under the active Harness generation.

#### Required Outcome

Relevant active artifacts, project knowledge, and applicable constraints have been reviewed and no Active Conflict remains unresolved.

#### Suggested Skills

- verify-change

### Phase — Mark Update Review Complete

#### Goal

Record completion only after the update review lifecycle has closed.

#### Required Outcome

The running Scaffold version is eligible to be recorded as reviewed with `scaffold update`.

## Required Outcomes

- Relevant changed shared guidance is identified.
- Active Conflicts are resolved and Shadow Drift is deliberately reviewed.
- Necessary project-owned adjustments and any required migration are completed deliberately.
- Project consistency is verified before the current Harness version is recorded as reviewed.
