---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-001
api-type: cli
sections:
  belongs-to: Belongs to
  derived-from: Derived from
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  test-scenarios: Test Scenarios
  serves: Serves
---

# US-001: Run /apply to implement a plan

## Belongs to

UC-001 — Implement a plan (module `apply`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the greenfield implementation workflow business US, where the user-facing step is "I want my reviewed plan turned into shipped code, tests, and a commit."

## Story

- **As:** developer or coding agent
- **I want to:** advance a reviewed plan from drafted state to merged-ready code without having to re-explain the plan, the conventions, or the test commands each session
- **So that:** without `/apply`, the project loses its automated path from plan → code; every implementation cycle reverts to manual prompting and per-task hand-holding, breaking the workflow's resumability guarantee (re-running `/apply` mid-plan picks up at the first `[ ]`)
- **Trigger:** on demand — typically immediately after `/design-plan` produces a plan, or when resuming a partially-completed plan

## Expected Behavior

`/apply` walks an implementation plan batch by batch — writing code, behavioural tests, and quality tests for each US scenario, marking each `[ ]` as `[x]` only when all three pass. It uses the plan file as a state machine, so an interrupted run can be resumed by simply invoking `/apply` again. On the Final Batch the full behavioural suite runs as an integration regression check; on success it stages and commits the work, on failure it creates a fix-plan as the new unit of work.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Runs in conversation context; no separate process / stdin / exit codes apply, but the slash-command shape still fits the CLI variant.

### Command

```
/apply [plan-name]
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `plan-name` | optional | Specific plan to apply, e.g. `plan-002` or `plan-002-checkout`. When omitted, the skill globs `docs/drafts/plans/plan-*.md`; uses the single match if there is one; otherwise asks which to pick. |

### Stdin

Not applicable — the skill runs inside a Claude Code conversation. The "input" is the plan file referenced by `plan-name` (or discovered via glob) plus all context files listed in UC-001's Main Flow step 3.

### Stdout

Structured progress output as the skill works through the plan:

- Header: `## Applying: {plan-name}` and the discovered quality commands
- Per batch: `### Batch N: {batch name}` followed by per-task lines:

  ```
  Task N/T: US-XXX Scenario N: {name}
    → Implementing {file path}
    → Typecheck: ✓
    → Writing {test path}
    → Tests: ✓ (X/Y passed)
    → Quality tests: ✓
    ✓ Done
  ```

- Batch footer: `Batch N complete — M/T tasks done overall.`
- Final completion: `## Implementation Complete` block with plan name, commit hash, progress totals, and list of newly checked tasks
- Final failure: `## Implementation Paused — Final Batch Failed` block with plan name, failing scenario, root cause, and the path to the new fix-plan

### Stderr

Not separately addressed — failures are surfaced inline in the stdout-equivalent stream (the assistant's user-facing message). The 3-attempt rule limits how much failure detail accumulates before the skill stops and asks for guidance.

### Exit codes / outcomes

Outcomes are state changes, not exit codes:

| Outcome | State after the run |
| ------- | ------------------- |
| Success | All `- [ ]` flipped to `- [x]`; one new git commit; behavioral + quality tests green; format/lint applied; `typecheck` green. Ready for `/merge`. |
| Plan already complete | No changes; user told to run `/merge`. |
| Stopped on task failure (3-attempt rule) | Affected checkbox stays `[ ]`; partial progress preserved; no commit; user told what failed and what was tried. |
| Final Batch failed | Final Batch items stay `[ ]`; no commit; fix-plan created at `docs/drafts/plans/plan-{next-id}-fix-{kebab-name}.md`; user told to run `/apply` on the fix-plan. |
| Refactoring signal | Refactor performed under behavioral test protection; the skill continues without stopping. Surface to the user as a brief signal note, but no pause. |

### Side effects

- File writes under `src/{module}/`, `tests/behavioral/{module}/`, `tests/implementation/{module}/`
- Edits to the plan file itself (`- [ ]` → `- [x]`)
- Possible creation of a fix-plan in `docs/drafts/plans/`
- One `git add` per affected path + one `git commit`; **never** `git push`; **never** `git add -A`

## Test Scenarios

> Skeleton only — scenario names and Given/When/Then are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/apply/us-001-*.test.*`.

### Scenario 1: Reviewed plan implemented — code + tests committed, ready for /merge

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (resume — re-running /apply on a partially-completed plan picks up at the first `[ ]`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (no plan name + multiple plans → user is asked which to use)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (plan already fully `[x]` → skill suggests `/merge` and makes no changes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (typecheck fails 3 times on a task → checkbox stays `[ ]`, skill stops with error report)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (behavioral tests fail 3 times → same stop behaviour)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (refactoring signal during quality-test planning → refactor under behavioral test protection, continue without stopping)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (Final Batch fails → fix-plan is created and announced, no commit made)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (referenced module US file is missing → skill stops before any code is written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the implementation step of the greenfield workflow business US.
