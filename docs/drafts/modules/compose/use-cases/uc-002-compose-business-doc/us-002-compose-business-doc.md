---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-002
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

# US-002: Run /compose to synthesise a business-layer doc

## Belongs to

UC-002 — Compose a business-layer document from module docs (module `compose`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the brownfield documentation workflow business US, where the user-facing step is "I have module docs that explain individual capabilities; I want one document that tells the cross-module story from the user's perspective."

## Story

- **As:** documentation owner or coding agent (typically the same role who ran `/scan-deep` and `/elicit` on the contributing modules)
- **I want to:** produce a single business-layer UC + US that ties multiple modules together into one user-visible flow, without re-deriving the actor / goal / cross-module rules from scratch
- **So that:** without `/compose`, the project has module-layer technical docs but no user-facing narrative; the workflow loses its bridge from module contracts to business stories, and `/review-draft` / `/design-plan` have nothing to gate
- **Trigger:** on demand — once ≥2 module docs have been through `/elicit` and the user is ready to write the cross-module user-facing story

## Expected Behavior

`/compose` ingests two or more module-layer UC docs, runs a 3-phase interview (journey boundary → actor & goal → cross-module seams), and produces a single business-layer UC + US draft in `docs/drafts/use-cases/` that links every contributing module under `implemented-by`. Module docs are not modified — except in the narrow case where a blocking TBD must be resolved in-line and written back to the upstream module doc with the user's answer. The new business doc captures the cross-module Main Flow, the deduplicated business-rules union, the user journey from Q2, and one scenario per cross-module failure seam from Q5.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. The interview is multi-turn within the conversation: one phase per assistant turn, with user answers in between.

### Command

```
/compose [module-a module-b ...]
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `module-a, module-b, …` | optional but recommended | Names of two or more modules to compose. When omitted, the skill reads `docs/drafts/coverage.md`, lists modules with `Scan [x]` and `Business UC [ ]`, and asks which to compose. |

### Stdin

Not applicable in the OS sense — input is multi-turn conversational. The skill ingests:

- The named modules' UC and US files (read once at the start)
- `docs/drafts/coverage.md`
- The user's answers to interview questions Q1–Q8 (one phase per turn)
- Optional in-line answers to "this TBD is blocking me" prompts triggered by Exception Flow E4

### Stdout

Per-turn output across the interview:

- Turn 1: opening summary — modules read, entry points, proposed user journey narrative, "Ready?"
- Turn 2 (after the user is ready): Phase 1 questions Q1 + Q2
- Turn 3 (after Phase 1 answers): Phase 1 notes echoed back, then Phase 2 questions Q3 + Q4
- Turn 4: Phase 3 questions Q5 (once per handoff seam), Q6, Q7, Q8 — with each module's `business-rules` enumerated for Q8
- Turn 5: file-creation summary — UC + US paths, contributing modules, scenario list, coverage updates, "Ready for /review-draft"

Mid-flow blocker (Exception Flow E4) interleaves an extra prompt: "Module X's `business-rules` is still TBD — answer Y so I can continue?"

### Stderr

Not separately addressed. Failures (missing module docs, only one module named, coverage.md missing) are surfaced in the assistant's conversational message and stop the flow.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success | `docs/drafts/use-cases/uc-{N}-{slug}/` contains UC + US; coverage.md updated; no module docs modified (unless E4 fired). Ready for `/review-draft` |
| Stopped on insufficient input (E1, E2, E5) | Nothing written; user told what to do (name another module / run `/scan-deep` / run `/scan-all`) |
| Stopped on TBD that user can't answer (E4 abort branch) | Nothing written to `docs/drafts/use-cases/`; any partial answer the user did give is preserved in the module doc; user told to run `/elicit` on the blocking module |
| Proceeded despite TBD Story (E3) | Business UC/US written with `TBD (pending /elicit on {module})` markers in affected fields |
| User abandoned mid-interview (E7) | Nothing written; interview state preserved in conversation for resume on next `/compose` |

### Side effects

- File writes under `docs/drafts/use-cases/uc-{N}-{slug}/` (UC + US, both new)
- Edits to `docs/drafts/coverage.md` (flip `Business UC [ ]` → `[x]` per contributing module; append `→ UC-{N} {name}` to Notes)
- **Conditional** edits to upstream module docs in `docs/drafts/modules/{module}/use-cases/`: only when Exception Flow E4 fires, and only the specific TBD that's blocking synthesis — never a wholesale rewrite. Compose is the **only** brownfield-loop skill besides `/elicit` permitted to write back into module docs, and only by this narrow path
- No git operations
- No external service calls

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/compose/us-002-*.test.*`.

### Scenario 1: Two elicited modules composed — business UC + US written, coverage updated

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (no modules named → skill reads coverage.md, lists candidates, asks user to choose; proceeds only after ≥2 are picked)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (only one module named → E1: skill refuses to compose, asks for another)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (named module has no use-case.md yet → E2: skill tells user to run /scan-deep first, makes no changes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (readiness check fails — US Story still TBD; user chooses to proceed → E3: business doc written with `TBD (pending /elicit on {module})` markers)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (TBD discovered mid-flow blocks synthesis; user answers in-line → E4: answer written back to upstream module doc; business doc completes successfully)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (TBD discovered mid-flow blocks synthesis; user can't answer → E4 abort branch: business doc NOT written; user told to run /elicit on blocking module)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (background/internal-only module included → E6: Main Flow framed from user perspective, internal module still listed under `implemented-by`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (three modules with two handoff seams → Phase 3 Q5 asked twice; resulting business US has scenarios for both failure seams)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (coverage.md missing → E5: skill tells user to run /scan-all, makes no changes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the synthesis step of the brownfield workflow business US.
