---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-011
api-type: cli
sections:
  belongs-to: Belongs to
  derived-from: Derived from
  story: Story
  expected-behavior: Expected Behavior
  api-contract: Interface Contract
  test-scenarios: Test Scenarios
  serves: Serves
---

# US-011: Run /scan-deep to draft module docs from one module's source

## Belongs to

UC-011 — Produce module UC + US drafts per entry point from one module's source (module `scan-deep`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the brownfield workflow business US, where the user-facing step is "I have an existing module with code but no docs; I want a complete first-pass module UC + US per entry point — code-derivable fields filled, business-context fields explicitly marked TBD with guiding questions — so I can run `/elicit` next and finish the human-context layer."

## Story

- **As:** Project developer or maintainer
- **I want to:** understand what each module does, such as entry point, flow in each module, what functions module have.
- **So that:** If the skill disappear overnight, user need to review all of the code by themselves.
- **Trigger:** On demand when they want to understand what kind of work each module does

## Expected Behavior

`/scan-deep` helps a project developer or maintainer understand what one module does by reading its source and producing first-pass module documentation. It identifies the module's entry points, internal flow, functions, data shapes, side effects, and code-derived exceptions, then writes module UC/US drafts with business-context fields left for `/elicit`. Without `/scan-deep`, the user has to review all module code manually to understand what each module does before rebuilding documentation.

## Interface Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Multi-turn within the conversation: turn 1 = 3-line summary + Q1/Q2; turn 2 (after user answers) = file writes + final summary. Two-turn minimum; the gate at Q1/Q2 is mandatory before any write.

### Command

```
/scan-deep [module-name]
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `module-name` | optional | The module to scan (e.g. `auth`, `payment`). When omitted, the skill reads `docs/drafts/coverage.md` and uses the **first row** where `Scan = [ ]`. |

### Stdin

Not applicable in the OS sense — input is conversational. The skill ingests:

- The named module's source: every file under `src/{module}/`
- `docs/drafts/coverage.md` (for unnamed-invocation module selection AND for the post-write `Scan [x]` flip)
- `docs/schema/format.md` (`use-case.sections`, `user-story.sections`, `## use-case Template`, `## user-story Template`, `## Interface Contract Variants`); falls back to `skills/init/references/format.md`
- `docs/schema/workflow-rules.md` (`id-rules`, `decomposition.uc-rule`); falls back to embedded defaults
- All existing UC/US IDs from `docs/drafts/use-cases/`, `docs/drafts/modules/`, `docs/use-cases/`, `docs/modules/` (for ID assignment)
- The user's answer to Q1 (one-liner confirmation/correction)
- The user's answer to Q2 (cross-module responsibility, only when external calls exist)
- Optional in-line answers to E7 (folder collision), E10 (code/coverage divergence)

### Stdout

Per-turn structured output:

- **Turn 1** (after reading source):

  ```
  Scanning: {module}
  Files:    {N} — {file1}, {file2}, ...
  Found:    {N} entry point(s): {name1}, {name2}

  Q1: I read this module as: `{one-liner}`. Is that accurate, or should I reframe it?
  Q2 (if applicable): I see calls to `{module-or-service}`. Should I treat those as
      this module's responsibility, or does a higher-level orchestrator own that?
  ```

- **Turn 2** (after the user answers): decomposition announcement + per-file write progress + final summary block:

  ```
  → {N} UC(s) identified:
    UC-{id}: {slug} — {one-liner}
  Writing drafts...

  scan-deep complete — {module}
  ──────────────────────────────────────────────────────
  Module one-liner:  {confirmed one-liner}
  Entry points:      {N}
  UC/US pairs:       {N}

  Produced:
    docs/drafts/modules/{module}/use-cases/
      uc-{id}-{name}/use-case.md
      uc-{id}-{name}/us-{id}-{name}.md
      ...

  IDs used: UC-{start}–UC-{end}, US-{start}–US-{end}

  TBD fields (need /elicit): Actor, Trigger, Goal, Value,
                             Expected Behavior, Scenario names
  Next: run /elicit to fill in what code can't tell you.
  ```

### Stderr

Not separately addressed. E1 (no coverage.md), E2 (all scanned), E3 (module not in src/), E4 (Q1/Q2 abandonment), E8 (no entry points), E9 (fanout request) surface as conversational messages and may halt before the write turn.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success | Module folder(s) + UC + US written under `docs/drafts/modules/{module}/use-cases/`; `Scan [x]` flipped in `coverage.md`; summary printed. Ready for `/elicit` |
| Stopped — coverage.md missing (E1) | Nothing written; user told to run `/scan-all` |
| Stopped — all modules already scanned (E2) | Nothing written; user told to run `/elicit` or `/verify` |
| Stopped — module not found (E3) | Nothing written; user told to run `/scan-all` or check spelling |
| Stopped — Q1/Q2 unanswered (E4) | Nothing written; coverage.md NOT modified; resumable on next `/scan-deep {module}` |
| Q1 correction applied (E5) | The corrected one-liner is used in all derived UC bodies and the final summary |
| Q2 orchestrator-owns answer (E6) | Module UC scoped narrower; cross-module references marked TBD in `related` without claiming this module owns the interaction |
| Folder collision (E7) | User asked whether to skip / assign new IDs / overwrite; default is "assign new IDs and write alongside" |
| Zero entry points (E8) | Single UC with `api-type: none`; summary flags that no business-layer composition may be warranted |
| Cross-module fanout request (E9) | Refused; user told to invoke `/scan-deep` separately on the other module |
| Code/coverage divergence (E10) | `Scan [x]` NOT flipped silently; user asked to reconcile |

### Side effects

- File writes under `docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/` — one folder per identified UC, each containing `use-case.md` + `us-{id}-{slug}.md`
- File edit to `docs/drafts/coverage.md` — flip `Scan [ ]` → `Scan [x]` for the target module's row (deliberate divergence from the source SKILL.md). Optionally append a Notes hint like `; {N} UC(s) (UC-{first}..UC-{last})`
- **Zero** writes under `src/` at any step (hard invariant)
- **Zero** writes under `tests/` at any step (hard invariant)
- **Zero** writes to `docs/use-cases/`, `docs/modules/`, `docs/adr/` (those are confirmed locations — only `/merge` writes there)
- **Zero** writes to `docs/drafts/use-cases/` or `docs/drafts/adr/` (those are business-layer; this skill is module-layer)
- **Zero** writes to other modules' folders under `docs/drafts/modules/` — strictly one module per run
- **Zero** git operations: no `git add`, no `git commit`, no `git push`, no auto-`git init`
- **Zero** invocation of other skills — produces drafts, flips the column, prints a summary, stops
- **Zero** scanning of cross-module dependencies' source code — calls to other modules are noted as TBD in `related` only

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/scan-deep/us-011-*.test.*`.

### Scenario 1: Module source reviewed and first-pass docs produced

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (no module name → first unchecked Scan row in coverage.md is used; same outputs as Scenario 1)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (module mixes shapes — one route handler + one event listener → two separate UC/US pairs with `api-type: rest` and `api-type: event`; both folders under same module dir)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (Q1 — user corrects the one-liner → corrected wording propagates to UC title + Primary Actor framing in every produced doc)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (Q2 — user says cross-module calls belong to a higher-level orchestrator → UC Postconditions and Main Flow scoped narrower; cross-module deps noted in `related` as TBD)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (E1 — coverage.md missing → refuse to run; tell user to `/scan-all`; no file written; no checkbox flipped)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (E2 — all coverage.md rows are Scan [x] → report "all modules scanned"; suggest `/elicit` or `/verify`; no file written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (E3 — named module doesn't exist in src/ → report lookup failure; suggest `/scan-all`; no file written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (E4 — user abandons before answering Q1/Q2 → no file written; coverage.md NOT flipped; conversation resumable)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (E7 — module's UC folder already exists for the assigned ID → user asked to skip / new IDs / overwrite; default is new IDs, no silent overwrite)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (E8 — module has zero entry points (only internal helpers) → single UC with `api-type: none`; api-contract section omitted; summary flags possible no-composition-warranted)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (E9 — user asks `/scan-deep` to also scan another module mid-run → refused; user told to invoke separately)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (E10 — code structure diverges significantly from coverage.md row (e.g. module renamed) → `Scan [x]` NOT flipped silently; user asked to reconcile via `/scan-all`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (cross-module dependency note — module calls `src/other-module/foo`; UC's `related` section gets `TBD (depends on other-module — will resolve when that module's loop completes)`; other-module source NEVER read)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 15: TBD (TBDs in produced docs use **guiding questions** verbatim, not bare TBD — Actor TBD is `TBD (who calls this — end user, internal service, or automated process?)` etc.; the questions are what `/elicit` will surface)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 16: TBD (`Scan [x]` flip on success — the row corresponding to the scanned module flips from `[ ]` to `[x]`; other rows untouched; Notes column optionally appended with UC ID range)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 17: TBD (api-type detection table — exported function entry point → `api-type: function` with Signature/Parameters/Returns/Throws section shape filled from code)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 18: TBD (post-run `git status` shows new module-doc folder + the coverage.md edit as unstaged changes; no git commit created by this skill)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the per-module documentation step of the brownfield workflow business US.
