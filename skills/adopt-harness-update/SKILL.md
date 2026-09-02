---
name: adopt-harness-update
description: Review and safely adopt a new installed Scaffold version before recording the update review.
---

# Adopt Harness Update

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Help the project owner deliberately decide which changes from the installed Scaffold candidate bundle belong in its project-local Harness.

## Entry Conditions

- The running Scaffold version differs from the project's last reviewed version.

## Phases

### Phase — Establish Update Context

#### Goal

Identify the difference between the active project-local Harness and the installed candidate bundle.

#### Required Outcome

`scaffold update --diff` identifies added, changed, and package-removed candidate artifacts. The active local artifacts and the candidate versions are available for review; no artifact becomes active merely because it appears in the installed package.

#### Suggested Skills

- collect-context

### Phase — Review Impact

#### Goal

Explain the candidate's behavioral and capability changes, then determine which changes the project actually needs.

#### Required Outcome

For each material difference, explain what it adds, changes, or retires; its effect on current project behavior; and relevant trade-offs. Discuss unresolved needs with the project owner. Project knowledge is not automatically rewritten; deliberate semantic migration follows the migration Workflow when needed.

#### Suggested Skills

- analyze-impact
- analyze-rule-conflicts

### Phase — Apply Project-Owned Adjustments

#### Goal

Deliberately adapt project-owned artifacts where the review established a need.

#### Required Outcome

Only owner-approved decisions are applied. Record each artifact as `adopt`, `adapt`, `keep`, `retire`, or `defer`; do not perform an automatic content merge.

### Phase — Determine Migration Need

#### Goal

Decide whether the selected project-local changes require deliberate migration.

#### Required Outcome

When an approved update requires semantic project migration, `migrate-project` is selected and completed before this update review is marked complete.

### Phase — Verify Project Consistency

#### Goal

Confirm the selected project-local Harness remains coherent.

#### Required Outcome

Relevant local artifacts, project knowledge, and applicable constraints have been reviewed and no selected change remains unresolved.

#### Suggested Skills

- verify-change

### Phase — Mark Update Review Complete

#### Goal

Record completion only after the update review lifecycle has closed.

#### Required Outcome

The running Scaffold version is eligible to be recorded as reviewed with `scaffold update`.

## Required Outcomes

- Candidate differences and their behavior effects are identified.
- The project owner has made necessary adopt/adapt/keep/retire/defer decisions.
- Necessary project-local adjustments and any required migration are completed deliberately.
- Project consistency is verified before the current Harness version is recorded as reviewed.
