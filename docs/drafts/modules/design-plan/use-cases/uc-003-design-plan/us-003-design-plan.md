---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-003
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

# US-003: Run /design-plan to produce module drafts + an implementation plan

## Belongs to

UC-003 — Design an implementation plan from READY business drafts (module `design-plan`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the greenfield implementation workflow business US, where the user-facing step is "I have READY business drafts; I want a concrete plan that names every affected file and breaks the work into batches I can implement against, plus a per-module contract the implementing engineer can rely on."

## Story

- **As:** developer or coding agent who just received a READY verdict from `/review-draft`
- **I want to:** turn reviewed business intent into per-module contracts and a sequenced implementation plan, without manually deriving which files each scenario touches or which decisions warrant an ADR
- **So that:** without `/design-plan`, the project loses its bridge from business-layer decisions to module-layer contracts; `/apply` has no plan to follow; ADR-worthy decisions get embedded silently in code instead of being captured as explicit drafts
- **Trigger:** on demand — immediately after `/review-draft` returns READY for one or more business UCs

## Expected Behavior

`/design-plan` reads READY business UCs and translates each one into module-layer UC/US drafts (one folder per module in `implemented-by`) plus a single implementation plan with batched, scenario-level tasks and an explicit Affected Files list. Greenfield modules get `[proposed]` markers; the three-question ADR-trigger check fires per module and emits module-level or project-level ADR drafts when warranted; ADR supersession is detected and adds an upfront rework batch. The skill never writes code, runs tests, or promotes drafts — those are explicitly `/apply`'s and `/merge`'s jobs.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Predominantly a single-turn skill: it does a pre-flight pass, reports findings, writes everything in one shot, and prints a summary. The interactive moments are constrained to specific exception flows (E4 module ambiguity, E8 greenfield path confirmation).

### Command

```
/design-plan [UC-id [UC-id ...]]
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `UC-id, UC-id, …` | optional but recommended | One or more business UC IDs to plan. When omitted, the skill lists business UC folders under `docs/drafts/use-cases/` and asks which to plan. Multiple IDs trigger the plan-together assessment. |

### Stdin

Not applicable in the OS sense — input is conversational. The skill ingests:

- The named business UC(s) (`use-case.md` + every `us-*.md` in the folder)
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` (or embedded defaults)
- `docs/drafts/use-cases/`, `docs/drafts/plans/`, `docs/drafts/adr/`, `docs/drafts/modules/*/adr/` listings
- `docs/modules/{module}/use-cases/` for every module named in `implemented-by` (to classify established vs. greenfield)
- `Glob('src/{module}/**')` results (to detect implemented modules and list `Modify:` files)
- `CONVENTIONS.md` (for `[proposed]` path naming)
- Optional in-line answers to E4 (module ambiguity) and E8 (greenfield path confirmation)

### Stdout

Single-turn structured output:

1. **Pre-flight report** (before any file is written):

   ```
   Planning: UC-005 [+ UC-006 if plan-together]
   Modules:
     established: auth (src/auth/, docs/modules/auth/)
     greenfield:  payment-history [proposed]
   ADR supersession: none [or "supersedes ADR-012 — adding rework batch"]
   Plan-together: yes — UC-005 and UC-006 share module 'auth'
   Notes: [any ambiguity or unusual finding]
   ```

2. **Per-module translation announcements** (briefly state what's being written for each module)

3. **ADR draft announcements** (when triggers fire, name each ADR and its scope)

4. **Final summary block**:

   ```
   Plan complete
   ──────────────────────────────────────────────────────
   Module drafts created:
     docs/drafts/modules/{module}/use-cases/uc-{id}-{name}/
       use-case.md
       us-{id}-{name}.md
     [repeat per module]

   Plan created:
     docs/drafts/plans/plan-{id}-{name}.md

   ADR drafts created: [filename, or "none"]
   [proposed] paths:    [list, or "none"]
   Notes:               [anything the user should know]
   ```

### Stderr

Not separately addressed. Insufficient-input failures (E1, E2, E3) and ambiguity stops (E4, E5, E7, E8) are surfaced in the assistant's conversational message and halt the skill before any write.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success | Module UC/US folders written for every in-scope module; plan written; ADR drafts written when triggered; nothing else modified. Ready for `/apply` |
| Stopped on missing input (E1, E2, E3) | Nothing written; user told what to fix (run `/draft` or `/compose`; check UC ID; run `/review-draft`) |
| Stopped on module ambiguity (E4) | Nothing written until user clarifies whether the module is greenfield or a typo |
| Stopped on ADR supersession lookup failure (E5) | Nothing written; user told which superseded ADR ID is missing |
| Multiple UCs but plan-together criteria not met (E6) | Multiple separate plans + independent module-doc folders written; one summary block per plan |
| Schema + rules + defaults all missing (E7) | Nothing written; user told to run `/init` |
| Greenfield + no CONVENTIONS.md guidance (E8) | Skill pauses to confirm proposed paths with user; writes only after confirmation |

### Side effects

- File writes under `docs/drafts/modules/{module}/use-cases/` (UC + US per module)
- File write at `docs/drafts/plans/plan-{id}-{slug}.md`
- Conditional file writes under `docs/drafts/adr/` or `docs/drafts/modules/{module}/adr/`
- **No** modifications to existing files in `docs/drafts/` — design-plan only writes new files
- **No** modifications to `docs/modules/`, `docs/use-cases/`, `docs/adr/` (those are confirmed; only `/merge` writes there)
- **No** writes under `src/` or `tests/`
- **No** git operations
- **No** test execution
- **No** edits to `docs/drafts/coverage.md` — the coverage tracker is owned by the brownfield loop (`/scan-all`, `/scan-deep`, `/compose`)

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/design-plan/us-003-*.test.*`.

### Scenario 1: READY business UC translated — module drafts + plan written, ready for /apply

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (plan-together — two UCs share a module → single combined plan with "Why These UCs Are Planned Together" rationale)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (greenfield module → every file in plan's Affected Files for that module is marked `[proposed]`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (ADR trigger Q1+Q2 yes, Q3 no → module-level ADR draft created under `docs/drafts/modules/{module}/adr/`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (ADR trigger Q1+Q2+Q3 all yes → project-level ADR draft created under `docs/drafts/adr/`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (ADR supersession detected → plan's first batch per affected module is "ADR rework — {module}" before scenario batches)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (Final Batch lists every new scenario + every existing scenario in every touched module's confirmed docs)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (no UC named + docs/drafts/use-cases empty → E1, no writes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (UC ID not found → E2, no writes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (business UC `implemented-by` empty → E3: tells user to run /review-draft, no writes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (module in implemented-by has no src/ and no docs/modules/ → E4: asks user whether greenfield or typo)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (ADR supersession reference can't be resolved → E5, no plan written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (multiple UCs named but plan-together criteria don't match → E6: one plan per UC, all written in one run)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (greenfield module + CONVENTIONS.md silent on naming → E8: pauses to confirm proposed paths with user before writing)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the planning step of the greenfield workflow business US.
