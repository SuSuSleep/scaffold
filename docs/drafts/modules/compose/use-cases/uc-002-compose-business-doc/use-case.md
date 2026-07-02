---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-002
sections:
  primary-actor: Primary Actor
  source: Source
  preconditions: Preconditions
  business-rules: Business Rules
  postconditions: Postconditions
  main-flow: Main Flow
  exception-flows: Exception Flows
  serves: Serves
---

# UC-002: Compose a business-layer document from module docs

Take two or more module-layer UC/US docs and synthesise them into a single business-layer UC + US draft, via a 3-phase interview that captures the cross-module user journey, the primary actor, and what happens at the seams between modules. If a module-layer TBD is blocking the synthesis, ask the user for the missing answer and write it back into the upstream module doc before continuing.

## Primary Actor

Inbound CLI invocation via the `/compose` slash command in Claude Code, typically with module names as arguments (e.g. `/compose auth payment`). If no modules are named, the skill consults `docs/drafts/coverage.md` for candidates (modules with `Scan [x]` and `Business UC [ ]`) and asks the user which to compose.

## Source

TBD (will be linked after /compose) — belongs to the brownfield documentation workflow: `scan-all → scan-deep → elicit → /compose`.

## Preconditions

- At least **two** modules are named (by the user) or selectable from coverage.md
- Each named module has at least one `use-case.md` under `docs/drafts/modules/{module}/use-cases/` (or the confirmed equivalent under `docs/modules/`)
- Each named module has at least one `us-*.md` paired with that UC
- `docs/drafts/coverage.md` exists (so the skill can mark `Business UC [x]` afterward)
- The user is available to answer the multi-turn interview synchronously — compose is interactive, not batch

## Business Rules

- Must compose **≥2** modules — single-module composition is refused
- Contributing module docs must have been through `/scan-deep` (and ideally `/elicit`) — `/compose` does NOT itself produce module docs
- The user-facing entry point of the composed flow drives the api-type — internal-only modules contribute to `implemented-by` but are not the entry
- The narrow write-back to module docs (E4 — answer a blocking TBD in-line) is the **only** path through which `/compose` modifies module-layer files, and only after explicit user input

## Postconditions

On success:

- A new directory `docs/drafts/use-cases/uc-{N}-{slug}/` exists, containing:
  - `use-case.md` (business-layer UC) with sections populated from interview answers + module docs
  - `us-{N}-{slug}.md` (business-layer US) with story / expected-behavior / api-contract filled, scenarios skeleton TBD (filled later by `/review-draft` → `/apply`)
- The business UC's `implemented-by` section links every contributing module's UC path
- `docs/drafts/coverage.md` has `Business UC [x]` for every contributing module, with a Notes entry pointing at the new UC (`→ UC-{N} {name}`)
- Business UC `business-rules` section is the deduplicated union of every contributing module's `business-rules` plus any cross-module rules surfaced in interview Q8

On partial success (TBD found mid-compose that blocked synthesis):

- The blocking TBD has been resolved by asking the user in-line, and the answer has been **written back into the upstream module doc** (US Story field, UC business-rules, etc.) — this is the only path by which `compose` modifies module docs
- The business UC/US has been written using the now-filled value
- If the user could not answer, the business UC/US is **not** written — compose stops and tells the user to run `/elicit` on the blocking module

## Main Flow

1. **Resolve modules** — use user-named modules; if absent, read `docs/drafts/coverage.md` and present candidates (`Scan [x]` + `Business UC [ ]`); ask which to compose
2. **Readiness check** — read each module's UCs and USs; if any US Story field is bare `TBD (...)` (untouched by `/elicit`), warn the user, list the gaps, and ask whether to proceed anyway
3. **Read module docs** — collect for each module: entry points, story (actor/goal/value/trigger), api-contract, exceptions, business-rules. Build a mental map of cross-module flow and data hand-offs
4. **Opening summary** — state the modules read, list their entry points, propose a 1-2 sentence narrative of the likely user journey, confirm the user is ready for the interview
5. **Phase 1 — Journey boundary** (Q1: which module flows chain together; Q2: walk through end-to-end user experience). Write notes for Main Flow construction
6. **Phase 2 — Actor and goal** (Q3: primary actor role; Q4: what success looks like). Write to UC Primary Actor and US Story
7. **Phase 3 — Cross-module seams** (Q5: per-handoff failure UX, asked once per seam; Q6: prerequisites; Q7: follow-ups; Q8: cross-module rules beyond what individual modules listed). Q6 → preconditions; Q7 → related/follow-up; Q8 → business-rules union
8. **Assign IDs** — scan `docs/drafts/use-cases/`, `docs/use-cases/`, `docs/drafts/modules/` for the highest existing UC/US; next ID = highest + 1, no gaps
9. **Write the business UC** at `docs/drafts/use-cases/uc-{N}-{slug}/use-case.md` — title as user-goal phrase; populate sections per template; `implemented-by` lists every module → its module-UC path
10. **Write the business US** at `docs/drafts/use-cases/uc-{N}-{slug}/us-{N}-{slug}.md` — Story from Q3/Q4, expected-behavior from Q2+Q4, api-contract = the user-facing entry point(s), scenarios = Scenario 1 happy path + one scenario per Q5 failure point (Given/When/Then bodies left TBD)
11. **Update coverage.md** — for each contributing module: flip `Business UC [ ]` → `[x]`, append `→ UC-{N} {name}` to Notes
12. **Print summary** — created files, contributing modules + entry points, scenario list, coverage updates, "Ready for /review-draft"

## Exception Flows

- **E1 — Only one module named (or only one selectable in coverage.md)** (recoverable): tell the user compose needs ≥2; ask which other module should join; optionally suggest pairs based on cross-module dependency notes in coverage.md. Do not write anything until ≥2 modules are confirmed
- **E2 — Named module has no use-case.md drafted yet** (recoverable, return to /scan-deep): report which module is missing docs; suggest running `/scan-deep` on it first; stop
- **E3 — Module US Story fields still TBD (readiness check fails)** (recoverable, user choice): warn the user, list the gaps; if they elect to proceed anyway, use whatever is filled and mark the corresponding fields in the business US as `TBD (pending /elicit on {module})`
- **E4 — A TBD in module docs blocks synthesis mid-flow** (recoverable, two branches) — e.g. business UC `business-rules` cannot be deduplicated because module X's business-rules are still TBD; or the user journey can't be narrated because module Y's Story Goal is TBD: pause synthesis, ask the user the missing question(s), **write the answer back into the upstream module doc** (the only path through which compose modifies upstream files), then continue. If the user can't answer, abort writing the business UC/US and tell them to run `/elicit` on the blocking module
- **E5 — Coverage.md missing** (recoverable, return to /scan-all): tell the user to run `/scan-all` first; stop
- **E6 — Background / internal-only module included** (recoverable, auto-frame) — a module that's only ever called by other modules, never by the user: frame the Main Flow steps from the user's perspective ("the system sends a confirmation") rather than exposing the internal call; still list the module under `implemented-by`
- **E7 — User abandons the interview mid-phase** (recoverable, resumable): do not write partial business UC/US; preserve the user's answers so far in the conversation; on the next `/compose` invocation, offer to resume from where they left off

## Serves

TBD (will be linked after /compose) — expected target: the brownfield documentation workflow business UC.
