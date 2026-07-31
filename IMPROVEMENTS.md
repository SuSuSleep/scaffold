# Improvement List

> Current-state list of documentation and workflow improvements worth preserving
> across future edits.

## Open Items

### Separate Business Intent From Implementation Skills

Status: Addressed in current business drafts; keep as a review guardrail.

Problem:

Business-layer drafts under `docs/drafts/use-cases/` exposed concrete skill and
slash-command names in user-facing requirements. That couples business intent to
the current implementation and can make later implementation planning overfit to
the existing skill set.

Why it matters:

- Requirement authors should only need to describe the outcome they need.
- Business use cases should remain stable if the implementation changes from one
  skill to several skills, a script, a UI, or another orchestration layer.
- Concrete skill names belong in module-layer contracts and implementation plans,
  not in business-layer requirements.

Preferred direction:

- Business UC/US documents describe user goals, interactions, inputs, outcomes,
  gates, and failure signals in capability language.
- Module docs and plans map those capabilities to concrete skills, commands,
  files, and tests.
- Future review should flag business drafts that mention slash commands,
  implementation module names, or skill names outside explicitly technical
  sections.
