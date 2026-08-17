# Migrate Project

## Goal

Safely adapt a project when a Scaffold upgrade cannot be represented by ordinary artifact replacement.

## Entry Conditions

- The project is initialized with Scaffold.
- The changed shared behavior and installed project version are known.
- The affected project-local replacements have been identified.

## Required Outcomes

- Old and new shared behavior are compared.
- Project-local schemas, rules, workflows, and skills are reviewed as explicit replacements.
- Necessary changes to durable project knowledge are made deliberately.
- Decisions that cannot be safely inferred are recorded for the project owner.
- The project metadata reflects the intended Scaffold version after the migration is complete.

## Conditional Outcomes

- Create a specialized project migration workflow when the project has materially different migration needs.

## Suggested Skills

- collect-context
- analyze-impact
- verify-change
