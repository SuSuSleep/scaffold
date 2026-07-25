---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-005
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

# US-005: Run /elicit to fill module-doc TBDs through a guided interview

## Belongs to

UC-005 — Fill TBD business-context fields in module drafts via 4-phase interview (module `elicit`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the brownfield workflow business US, where the user-facing step is "the module docs `/scan-deep` produced for me have everything code could tell me; I want the human-context layer (who uses this, why, what errors mean to them) filled in without having to remember exactly which sections need what."

## Story

- **As:** Developer or maintainer of this repo, or a coding agent acting on their behalf
- **I want to:** complete the module documentation by answering a small, focused set of business questions and having those answers land in the right module-doc sections — without manually editing each file, hunting for the right heading, or remembering which fields are TBD
- **So that:** without `/elicit`, a brownfield module's docs stay full of TBD placeholders, making them impossible to rebuild into a reliable source of truth for the existing code, and too incomplete to infer a business-layer UC/US from
- **Trigger:** On demand

## Expected Behavior

`/elicit` runs a guided, four-phase interview that lets a developer, maintainer, or coding agent fill in the business-context TBDs left in a brownfield module's docs after `/scan-deep` — who uses it, why it exists, and what its errors mean to users. Without it, module docs stay full of TBD placeholders, so they can't serve as a reliable source of truth for the existing code, and there's no way to derive a business-layer doc or hand the module off to `/compose`.

## Interface Contract

**api-type: `cli`** — invoked as a Claude Code slash command. The interview is multi-turn within the conversation: four phases, one phase per assistant turn, with file writes after each phase (so an interrupted session doesn't lose progress).

### Command

```
/elicit [module-name]
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `module-name` | optional | The module to elicit (e.g. `auth`, `payment`). When omitted, the skill globs `docs/drafts/modules/*/` for modules with remaining TBD placeholders, optionally consults `docs/drafts/coverage.md` for intended order, and asks which to start with. |

### Stdin

Not applicable in the OS sense — input is multi-turn conversational. The skill ingests:

- The named module's UC and US files (read once at the start; section heading names resolved from each file's own frontmatter `sections` map)
- `docs/schema/format.md` (or fallback `skills/init/references/format.md`) for default aliases when a file lacks frontmatter
- `docs/drafts/coverage.md` (optional, for ordering hints)
- The user's answers to interview Q1–Q7 (one phase per turn) plus optional answers to cross-module deferral prompts
- Optional in-line answers to E1 (module missing), E5 (multi-actor disambiguation), E8 (rename collision), E9 (greenfield rejection)

### Stdout

Per-turn output across the interview:

- Turn 1: opening summary — "I've read **[module]** ([N] entry point(s): [list UC names]). I'll ask four short sets of questions. Each set takes about a minute. Ready?"
- Turn 2 (after user is ready): Phase 1 questions Q1 + Q2 (Actor / Trigger); after the user's answer, the skill writes the answers to each US's `story` section immediately, then in the **same** turn moves to Phase 2 questions Q3 + Q4 with a Q3 lead-in based on Q1
- Turn 3: confirms the drafted `expected-behavior` narrative, then Phase 3 — presents the code-inferred Main Flow for Q5 review and asks Q6 (business rules); writes to UC `flow` and `business-rules`
- Turn 4: Phase 4 — Q7 (classify each exception as recoverable / contact support); writes `(recoverable)` / `(contact support)` labels and Scenario 1 names; then runs the cross-module TBD pass on UC `related`, asking once per unresolved cross-module reference
- Turn 5: summary block — Filled / Still TBD / next step (`Ready for /compose` if ≥2 modules complete, else `Ready for /scan-deep` on next module)

(Phase boundaries are approximate — the SKILL.md allows bundling Phase 2 with Phase 1's write step, and the cross-module pass with Phase 4. The hard invariant is "write to files **between** phases, not all at the end.")

### Stderr

Not separately addressed. E1 (module not found), E2 (nothing to elicit), E9 (greenfield rejection) halt before any interview begins. E3 (skip), E4 (abandonment), E6 (missing frontmatter), E7 (cross-module unresolvable), E8 (rename collision) are surfaced inline; only E8 blocks progress until the user supplies a different name.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success — full interview | Every answerable TBD replaced in-place; cross-module deferrals annotated; summary printed. Ready for `/compose` when ≥2 modules are through `/elicit`, else `Ready for /scan-deep` on next module. coverage.md NOT updated (known gap — see UC's Postconditions) |
| Partial success — user abandoned mid-interview | File writes up to the last completed phase persist; remaining TBDs untouched; resumable on next `/elicit` invocation |
| Stopped — module not found (E1) | Nothing written; user told to run `/scan-deep {module}` |
| Stopped — module already complete (E2) | Nothing written; user told the module is ready for `/compose` (or `/scan-deep` on the next module) |
| Stopped — module is greenfield, not brownfield (E9) | Nothing written; user told `/elicit` is brownfield-only |
| Stopped — rename collision (E8) | The rename portion of Phase 3 is blocked; the rest of the writes (`flow`, `business-rules`, the non-rename portions) still persisted; user is asked for a non-colliding name |

### Side effects

- File writes to **module draft files only**: `docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/use-case.md` and `us-{id}-{slug}.md`
- Specific sections written per draft file (heading names resolved from each file's own frontmatter `sections` map):
  - US `story` (Actor, Trigger, Goal, Value)
  - US `expected-behavior`
  - US `scenarios` (Scenario 1 name only — Given/When/Then bodies remain TBD)
  - UC `flow` (corrections from Q5)
  - UC `business-rules` (Q6 answer or `None — the technical preconditions cover it.`)
  - UC `exceptions` (`(recoverable)` / `(contact support)` labels appended)
  - UC `related` (cross-module TBDs resolved or annotated `TBD (deferred until {other-module}'s loop completes)`)
- Optional folder/file rename within `docs/drafts/modules/{module}/use-cases/` if the user accepts a UC-rename suggestion in Phase 3
- **No** writes outside `docs/drafts/modules/{module}/use-cases/`
- **No** writes to `docs/drafts/coverage.md` (the `Module UC [x]` column update is the known gap documented in the UC's Postconditions)
- **No** writes to confirmed locations (`docs/use-cases/`, `docs/modules/`, `docs/adr/`)
- **No** writes to `src/` or `tests/`
- **No** proactive cross-module loop triggering — cross-module TBDs are at most annotated, never resolved by invoking other skills
- **No** git operations, no test execution

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit` (on this very module). Each scenario maps to one behavioural test in `tests/behavioral/elicit/us-005-*.test.*`.

### Scenario 1: Module documentation completed — all four phases answered, TBDs filled, summary printed

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (no module named → skill globs drafts/modules/, lists candidates with remaining TBDs, asks user to pick)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (multi-UC module with different actors per UC → Phase 1 + Phase 2 questions asked per-US; Phases 3 + 4 per-UC)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (user says "skip" on Q3 → corresponding US Goal becomes `TBD (ask product team)` rather than disappearing; summary lists it as Still TBD)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (Phase 3 reveals Q5+Q6 suggest a more business-meaningful UC name; user accepts rename; folder + slug change but ID stays)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (Phase 3 rename suggested but new slug collides with existing UC folder → E8: rename blocked, user asked for a different name, non-rename writes still applied)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (Phase 4 cross-module TBD pass — one cross-module reference resolves to a confirmed UC, the other remains deferred; both annotated correctly)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (user abandons mid-interview after Phase 2 → file writes for Phases 1+2 persist; re-running `/elicit` on the same module detects remaining TBDs and resumes from Phase 3)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (named module doesn't exist → E1: skill tells user to run `/scan-deep`, makes no changes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (named module has no TBD placeholders → E2: skill reports nothing to elicit, suggests next step)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (module was produced by `/design-plan` rather than `/scan-deep` → E9: skill refuses to run, tells user it's brownfield-only)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (draft file lacks frontmatter `sections` map → E6: skill falls back to format.md default aliases and warns user to re-run `/scan-deep`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (`docs/drafts/coverage.md` is NOT updated even on full success — known gap; column `Module UC [x]` stays `[ ]`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the business-context-capture step of the brownfield workflow business US.
