---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-013
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

# US-013: Run /setup to fill Tier-0 project configuration

## Belongs to

UC-013 — Fill project-level Tier-0 configuration (module `setup`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the project-bootstrap workflow business US, where the user-facing step is "after `/init` left placeholders for test strategy, glossary, conventions, README description, and shared test helpers — I want them populated with my actual project decisions in one structured pass, with framework-aware defaults I can accept, and without ever risking my feature workflow files getting touched."

## Story

- **As:** TBD (who calls this — end user, internal service, or automated process? In context: typically a developer just past `/init`, possibly after `/explore` aligned context; `/elicit` should confirm whether tech leads or onboarders are also direct actors.)
- **I want to:** TBD (what does the caller want to achieve? Likely: "fill in the project-config blanks `/init` left — test commands, coverage threshold, glossary terms, a CONVENTIONS section, a README — in one focused pass; accept framework-aware defaults where they're sensible; have shared test helpers created and auto-registered in `test-strategy.md`; and never accidentally touch UC/US/ADR/plan documents or `src/`.")
- **So that:** TBD (what stops working if this entry point disappears? Likely: "every project's Tier-0 config has to be authored by hand and re-derived per project; `test-strategy.md`'s scaffold-example layer rows leak into real projects; glossaries lose their append-only safety; `/apply` and `/design-plan` have nothing reliable to read for conventions and test commands.")
- **Trigger:** TBD (what makes them call this — on demand, event, schedule? Likely: on demand, shortly after `/init`, often after a `/explore` session that has aligned the project's testing / conventions / domain context.)

## Expected Behavior

TBD (fill in after /elicit) — the high-level promise from the caller's perspective: they invoke `/setup`, the skill reads conversation context first, asks only the targeted questions it can't answer from context, then writes the in-scope files with the three update modes (placeholder-replace / section-update / glossary-append). Shared test helpers are created in `tests/helpers/` or `tests/fixtures/` only — never in `tests/behavioral/` or `tests/implementation/` — and are auto-registered in `test-strategy.md`. Feature-workflow files are never touched. Unknown values become `(fill in per project)`, never invented.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Multi-turn within the conversation: read context → scan scaffold → identify targets → targeted questions → write → summary.

### Command

```
/setup
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| (none) | — | The skill takes no positional arguments; the scope comes from the conversation (what the user is asking to configure today + what `/explore` left in context). |

### Stdin

Not applicable in the OS sense — input is multi-turn conversational. The skill ingests:

- The user's stated request and current conversation (especially anything left by a prior `/explore` turn — primary input)
- Targeted answers to the gap questions in Step 5
- `docs/overview/` listing and contents (test-strategy.md, glossary.md if present)
- `CONVENTIONS.md` and `README.md` contents
- `tests/` directory listing (to understand what infrastructure already exists; behavioral/ and implementation/ are read-only — never written by this skill)
- Framework-default tables for test commands (Jest / Vitest / pytest / go test) — the user can accept defaults instead of typing

### Stdout

Multi-turn structured output:

- **Discovery / scope confirmation turn** (when ambiguity exists): "I found placeholders in: [list]. Which would you like to work on today?"
- **Targeted question turns**: one grouped block per file with gaps; framework defaults shown inline where applicable
- **Final summary**:

  ```
  Setup complete
  ──────────────────────────────────────────────────────
  Updated:
    docs/overview/test-strategy.md   → [what changed]
    CONVENTIONS.md                   → [which section, what changed]
    docs/overview/glossary.md        → [N terms added]
    README.md                        → [what filled in]

  Created:
    tests/helpers/[filename]         → [what it provides]

  Still needs attention:
    [any section still using placeholder values, with filename]

  ──────────────────────────────────────────────────────
  These conventions govern how /apply writes tests and code.
  When feature plans run, agents will read test-strategy.md and
  CONVENTIONS.md to follow the rules defined here.
  ```

Sections where nothing happened are omitted.

### Stderr

Not separately addressed. E4 (wrong-skill request — UC/US/ADR/plan or feature-doc folder), E5 (`src/` write request), E6 (behavioural/implementation test request), E10 (glossary remove/rename request) surface as inline refusals with redirection to the right skill.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success | In-scope files updated/created; glossary additions appended alphabetically; CONVENTIONS section scoped to the named section; test-strategy.md registers any new helper; summary printed |
| Partial — value unknown (E3) | `(fill in per project)` written; file listed in "Still needs attention" |
| Broad request, no `/explore` context (E1) | Skill asks user to pick a subset; no file written until scope is confirmed |
| Wrong-skill request (E4 / E5 / E6) | Refusal + redirect; no file written |
| Glossary remove/rename request (E10) | Refusal; user told to edit manually or use schema migration |
| Helper created but test-strategy.md can't be updated (E11) | Helper persists; failure to register surfaced in summary; user asked to update test-strategy.md manually |

### Side effects

- File writes/edits at:
  - `docs/overview/test-strategy.md` (placeholder-replace mode; placeholder Testing Layers rows replaced even when they look populated; Test Directories table + prose section auto-registered when a new helper is created)
  - `docs/overview/glossary.md` (additive only — alphabetical insert; never deletes; preserves manual edits between runs)
  - `CONVENTIONS.md` (section-scoped — only the named section is touched; all other sections preserved byte-for-byte)
  - `README.md` (placeholder-replace mode; manual prose preserved on update)
- File creates under:
  - `tests/helpers/{file}` and/or `tests/fixtures/{file}` (new files only; minimal content; follows CONVENTIONS.md naming)
- **No** writes under `src/` at any step (hard invariant)
- **No** writes under `tests/behavioral/` (owned by `/apply`)
- **No** writes under `tests/implementation/` (owned by `/apply`)
- **No** writes under `docs/use-cases/`, `docs/modules/`, `docs/drafts/`, `docs/adr/` (feature-workflow territory)
- **No** writes to `docs/schema/` (owned by `/init` for creation, `/schema-update` for evolution)
- **No** writes to `docs/drafts/coverage.md` (brownfield-loop state)
- **No** UC / US / ADR / plan / fix-plan document creation
- **No** git operation at any step: no `git add`, no `git commit`, no `git push`, no auto-`git init`
- **No** invocation of other skills — produces files and a summary, then stops

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/setup/us-013-*.test.*`.

### Scenario 1: TBD (happy path — first-time fill on test-strategy.md after pytest discussed in `/explore`; four commands and threshold populated; Testing Layers rows replaced with real project layers; summary printed)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (glossary — three new domain terms added in alphabetical order; existing entries untouched; re-run with same terms is a no-op)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (CONVENTIONS.md — "Git Conventions" section updated; "Code Naming" and "Test Structure" sections preserved byte-for-byte)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (README.md first-time fill — project name + description + quick-start populated; subsequent re-run preserves any prose the user added manually between runs)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (new shared helper at `tests/helpers/mock-llm.ts` created; `test-strategy.md` auto-updated with a Test Directories row + a "## Shared Mocks" prose section naming the file and its purpose)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (placeholder Testing Layers rows look like real decisions ("Unit / Integration / E2E") → still replaced with the project's actual layer model — scaffold examples are never preserved by accident)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (value unknown in conversation, user can't answer in Step 5 → E3: `(fill in per project)` written; file listed under "Still needs attention")

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (broad "set up the project" request with no `/explore` context → E1: skill lists files with placeholders and asks user to pick a subset; no file written until scope is confirmed)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (user asks `/setup` to update `docs/use-cases/uc-001-checkout/use-case.md` → E4: refusal + redirect to `/draft`; no file written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (user asks `/setup` to write `src/payment/service.ts` → E5: refusal + redirect to `/apply`; no file written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (user asks `/setup` to add a behavioural test at `tests/behavioral/payment/us-001.test.ts` → E6: refusal + redirect to `/apply`; no file written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (user asks `/setup` to remove a glossary entry → E10: refusal; user told to edit manually or use schema migration)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (existing test-strategy.md has real content the user is partially overwriting via re-run → E8: skill surfaces the diff before overwriting; preserves anything the user added manually)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (tests/ directory missing, user wants to add `tests/helpers/` → E9: parent + subdirectory created; surfaced in summary)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 15: TBD (helper file created but test-strategy.md is malformed/locked → E11: helper persists; summary flags failure to register; user told to update test-strategy.md manually)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 16: TBD (framework-aware defaults — user names pytest but doesn't know commands; skill presents pytest defaults inline; user accepts in one step; commands written without further questions)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 17: TBD (post-run `git status` shows the updated/created files as unstaged changes; no commit created by this skill)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the Tier-0 project-configuration step of the bootstrap workflow business US.
