---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-009
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

# US-009: Run /review-draft to gate business drafts before planning

## Belongs to

UC-009 — Review business-layer drafts as a quality gate before planning (module `review-draft`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the greenfield workflow business US, where the user-facing step is "I've drafted (or amended) business UCs and USs — before I let `/design-plan` translate them, I want a structured review that catches blockers, suggests improvements, and — only if everything looks good — pins the reviewed state into git so any later edit is traceable."

## Story

- **As:** Project developer or maintainer
- **I want to:** check whether the document in draft is complete or needs to write down more details.
- **So that:** If I don't have this skill, I need to read all of the rules and understand all the content of the document in draft. Then I can do the suggestion.
- **Trigger:** On demand when they need to check whether drafts match the required format and rules

## Expected Behavior

`/review-draft` gives a project developer or maintainer a structured way to check whether draft documents are complete, follow the required format and workflow rules, and need more detail before planning. It reads the draft documents, applies the scaffold review rules, and reports what is READY, what NEEDS REVIEW, and what is BLOCKED without editing the drafts directly. Without `/review-draft`, the user has to read all rules and understand every draft document manually before they can make useful suggestions.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Single-turn structured output: orient → scan → 3-pass review per UC → ADR drafts → plan-together → report → conditional commit. No multi-phase interview; no follow-up turns required.

### Command

```
/review-draft
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| (none) | — | The skill takes no positional arguments; it reviews all UC folders under `docs/drafts/use-cases/` and all ADR drafts under `docs/drafts/adr/` in a single run. |

### Stdin

Not applicable in the OS sense — input is conversational. The skill ingests:

- All UC folders under `docs/drafts/use-cases/` (each `use-case.md` + all `us-*.md`)
- All ADR drafts under `docs/drafts/adr/`
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` (or embedded defaults)
- `docs/modules/` (presence + content — for new-vs-established calibration AND to validate module names in `implemented-by` sections)
- `docs/use-cases/` (presence + IDs — for cross-reference resolution)
- `docs/adr/` (presence + IDs — for cross-reference resolution)
- Git working-tree state (for the conditional commit step)
- Optional in-line answers to E3 (confirmed-doc review request refusal), E5 (inline-fix request refusal)

### Stdout

Single-turn structured report:

```
Draft review
────────────────────────────────────────────────────
Project: [new / established]   Modules known: [names, or "none yet"]

UC-001: [name]
  Structural  ✓ clean  /  ✗ [n blockers]  [n warnings]
  Substance   ✓ clean  /  ⚠ [n issues]
  ADR check   ✓ not needed  /  ⚠ [finding]
  → READY / BLOCKED / NEEDS REVIEW

[repeat for each UC]
────────────────────────────────────────────────────
Result: N of M UCs ready to plan

BLOCKERS — must resolve before planning
  UC-xxx / file.md — [specific description]

WARNINGS — should resolve
  UC-xxx / file.md — [specific description]

SUGGESTIONS — consider
  UC-xxx / file.md — [specific description]

PLANNING NOTE
  [If UCs should be planned together: which ones and why]
```

When every UC reached READY, ends with:

```
All drafts look ready — next step is an implementation plan.

Committed: {short hash} — docs(drafts): {uc list} reviewed and ready
```

When not full-READY, ends with the report only — no commit, no "ready" footer.

### Stderr

Not separately addressed. E1 (no drafts), E3 / E5 (refusal cases), E6 (no git repo at commit time) are surfaced inline; only E1 halts before the report.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Full READY + git repo | Report printed; `docs/drafts/` staged and committed; ready for `/design-plan` |
| Full READY + no git repo (E6) | Report printed; commit skipped silently with note "Not a git repository — review report only, no commit created" |
| Mixed verdicts | Report printed; NO commit (E4); user told what to amend via `/draft` and re-run |
| No drafts (E1) | "No drafts to review" message; no report, no commit |
| Confirmed doc review requested (E3) | Refusal + explanation that scope is business-layer drafts under `docs/drafts/` only |
| Inline-fix request (E5) | Refusal + explanation that this skill is read-only on docs; pointer to `/draft` |
| Re-run after a clean commit (E11) | Allowed; if no draft changed, the commit is a no-op (nothing to stage); if drafts changed, a new commit is created if the new state is full-READY |

### Side effects

- **Zero modifications to draft files** — hard invariant (read-only on docs)
- **Zero modifications to confirmed docs** — confirmed docs are read only for cross-reference validation
- **Zero modifications to `src/` or `tests/`** — out of scope
- **Zero modifications to `docs/drafts/coverage.md`** — brownfield-loop state, not this skill's concern
- **Single conditional git operation**: when every UC reaches READY → `git add docs/drafts/` + `git commit`. Path-scoped staging (never `git add .`); never push
- **No auto-`git init`** when the working tree is not a git repo — commit step silently skips
- **No** invocation of other skills — the skill produces a report and either commits or asks the user to amend; it does NOT call `/draft` or `/design-plan` itself

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/review-draft/us-009-*.test.*`.

### Scenario 1: Draft documents checked for completeness and readiness

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (`docs/drafts/use-cases/` empty → E1: "no drafts to review" message, no report rendered, no commit)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (Pass 1 — UC use-case.md missing the actor section → BLOCKER, verdict BLOCKED, no commit)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (Pass 1 — US has no scenarios → BLOCKER; report names the file + section; no commit)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (Pass 1 — US scenarios use vague phrases like "a valid user" → WARNING "concrete values"; verdict NEEDS REVIEW; no commit)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (Pass 2 — story promises a confirmation number but no scenario's Then verifies it → WARNING "story↔scenario alignment"; verdict NEEDS REVIEW)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (Pass 2 — UC contains a US that addresses an admin action sitting inside a user-facing UC → WARNING "UC coherence — scoping issue")

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (Pass 3 — US implies retry strategy but no ADR is referenced and no draft ADR exists → WARNING "Decision unrecorded — consider an ADR")

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (ADR draft has no Decision section → WARNING; verdict NEEDS REVIEW until amended)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (Plan-together — two UCs share module `auth` in `implemented-by` → PLANNING NOTE flags them as joint-plan candidates; verdicts unaffected)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (Established project — UC `implemented-by` empty → WARNING (vs. SUGGESTION in a new project); severity correctly calibrated to `docs/modules/` presence)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (User asks for review of `docs/use-cases/uc-001` (confirmed) → E3: refusal + explanation; the only path is via `/draft` copy-from-confirmed)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (User asks the skill to fix a BLOCKER inline → E5: refusal + pointer to `/draft`; no file modified)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (User asks for review of a module-layer draft under `docs/drafts/modules/` → E2: skill explicitly skips it; explains scope is business-layer drafts from `/draft` only)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 15: TBD (Mixed verdicts — one UC BLOCKED, others READY → E4: no commit; user told to amend the blocked UC and re-run)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 16: TBD (Full-READY but working tree is not a git repo → E6: report printed normally; commit step silently skipped with note; no auto-`git init`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 17: TBD (Re-run after a clean commit, no drafts changed → E11: report identical; `git add` finds nothing to stage; no second commit created)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the quality-gate step of the greenfield workflow business US.
