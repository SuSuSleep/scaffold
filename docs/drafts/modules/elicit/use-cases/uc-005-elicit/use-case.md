---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-005
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

# UC-005: Fill TBD business-context fields in module drafts via 4-phase interview

After `/scan-deep` produces module UC/US drafts with TBD placeholders for everything the code can't tell you (actor, trigger, goal, value, business rules, exception severity, scenario names), conduct a focused 4-phase interview that captures those answers and writes them back into the module docs incrementally — one phase per turn, with file writes between turns so an interrupted session preserves progress.

Strictly a brownfield-loop skill — runs on `/scan-deep`'s output, not on `/design-plan`'s.

## Primary Actor

Inbound CLI invocation via the `/elicit` slash command in Claude Code, optionally with a module name (e.g. `/elicit auth`). If no module is named, the skill globs `docs/drafts/modules/*/` for modules whose docs still contain TBD placeholders, optionally consults `docs/drafts/coverage.md` for intended ordering, and asks the user which to start with.

## Source

TBD (will be linked after /compose) — belongs to the brownfield documentation workflow: `scan-all → scan-deep → /elicit → compose`.

## Preconditions

- At least one module exists under `docs/drafts/modules/{module}/use-cases/` (produced earlier by `/scan-deep`)
- The named module's UC/US docs still carry TBD placeholders requiring business context — if a module has none, the skill reports "nothing to elicit" and stops
- Each draft file has a frontmatter `sections` map (`/scan-deep` stamps this); the skill resolves heading names from that map per file, never hardcoded
- `docs/schema/format.md` exists, **or** the embedded defaults from `skills/init/references/format.md` are usable
- The user is available to answer the multi-turn interview synchronously — elicit is interactive, not batch
- The module was produced via the brownfield loop (`/scan-deep`); the skill does NOT run on module drafts produced by `/design-plan` (greenfield)

## Business Rules

- Every brownfield module must go through `/elicit` before it can be included in `/compose`
- `/elicit` does not need to be re-run on a module whose TBDs are already filled, unless the user explicitly requests it
- The Goal (Q3 answer) must be written in user-facing language — not internal/implementation terms

## Postconditions

On success (full 4-phase interview completes):

- Every TBD placeholder for which the user provided an answer has been replaced in-place inside the module's draft files — no surrounding content rewritten
- US `story` section (alias from frontmatter, default "Story") populated: Actor (Q1), Trigger (Q2), Goal (Q3), Value (Q4); hint text in parentheses removed
- US `expected-behavior` section populated with a 2–3 sentence plain-English description derived from Q3+Q4+code context and confirmed by the user
- US `scenarios` section: the happy-path Scenario 1 has a goal-based name (Given/When/Then bodies remain TBD — that's `/review-draft` → `/apply`'s job)
- UC `flow` section: any corrections from Q5 applied
- UC `business-rules` section: Q6 answer captured — explicit business rules listed, or `None — the technical preconditions cover it.` when the user states none apply
- UC `exceptions` section: each exception line has an appended `(recoverable)` or `(contact support)` label
- UC `related` section: each cross-module TBD has either been resolved (linked to the other module's confirmed UC if its loop completed) or annotated `TBD (deferred until {other-module}'s loop completes)`
- If the interview surfaced a more business-meaningful UC name, the user was offered a rename and confirmation; if accepted, the folder + file IDs stay the same, only the title/slug changed (rename mechanics owned here; cross-reference repair is best-effort within the module's own files)
- A summary block has been printed listing what was Filled and what is Still TBD

**Known gap (out of scope for this UC):** elicit does NOT update `docs/drafts/coverage.md`. The middle column `Module UC [x]` semantically corresponds to "module-layer business context complete" — exactly what this skill produces — but the SKILL.md does not specify the update, and this UC documents that as an intentional limitation. The gap may be closed by a future revision of either `/elicit` or `/compose` (which currently flips `Business UC [x]` and could plausibly flip `Module UC [x]` as a side check). Until then, the column is updated manually or by a future skill iteration.

On stop (user says "skip" / "not sure" on a TBD): the marker stays as `TBD (ask product team)` or `TBD (deferred)` — consciously left open, not a forgotten gap.

## Main Flow

1. **Load schema** — read `docs/schema/format.md` (or fall back to `skills/init/references/format.md`); take note of section aliases for `use-case` and `user-story`, but treat each draft file's own frontmatter `sections` map as authoritative
2. **Resolve target module** — use user-named module if supplied; otherwise glob `docs/drafts/modules/*/`, filter to those with TBD placeholders still present, optionally cross-check `docs/drafts/coverage.md` ordering, and ask the user to pick
3. **Read module drafts** — read every `use-case.md` and `us-*.md` under `docs/drafts/modules/{module}/use-cases/`; for each file extract the frontmatter `sections` map, the UC/US names, the technical Main Flow (inferred from code by `/scan-deep`), and the code-derived exception list
4. **Opening summary** — tell the user how many UCs/USs are in the module, that the interview is 4 phases / one turn each, and ask "ready?"
5. **Phase 1 — Actor** (Q1: who interacts; Q2: on-demand vs. event/schedule). If the module has multiple UCs with potentially different actors, ask the user to differentiate. Write answers immediately to the `story` section of each US file (Actor + Trigger lines), removing hint text
6. **Phase 2 — Goal and value** (Q3: "this entry point exists so that [Q1 answer] can ___"; Q4: what stops working if it disappears). Draft an `expected-behavior` 2–3 sentence narrative from Q3+Q4+code context, present it for confirmation, adjust if needed. Write `story.Goal`, `story.Value`, and `expected-behavior` to each US file immediately
7. **Phase 3 — Flow validation** (Q5: present the code-inferred Main Flow and ask for corrections; Q6: business rules — authorization, quotas, rate limits — beyond what the code enforces). Write Q5 corrections to UC `flow`; write Q6 to UC `business-rules` (or `None — the technical preconditions cover it.` if no rules apply). If Q5+Q6 suggest a more business-meaningful UC name, offer a rename and ask for confirmation before renaming
8. **Phase 4 — Exception framing** (Q7: present the code-derived exception list and ask the user to classify each as recoverable or dead-end). Write the labels by appending `(recoverable)` or `(contact support)` to each exception line in UC `exceptions`; name the happy-path Scenario 1 in each US's `scenarios` section using the user's goal phrase from Q3
9. **Cross-module TBD pass** — in UC `related`, look for any line `TBD (depends on {other-module} — will resolve when that module's loop completes)`; for each, ask once whether the other module's loop has completed. If yes, link to its confirmed UC; if no, annotate `TBD (deferred until {other-module}'s loop completes)` and move on. Do NOT proactively trigger the other module's `/scan-deep` or `/elicit`
10. **Print summary block** — list per-UC and per-US what was filled, what remains TBD (with the reason — "ask product team", "deferred"), and the next step (`Ready for /compose` when ≥2 modules have been through this, otherwise `Ready for /scan-deep` on the next module)

## Exception Flows

- **E1 — Named module doesn't exist under `docs/drafts/modules/`**: report which module path was searched and not found; suggest running `/scan-deep {module}` first; stop
- **E2 — Module exists but has no TBD placeholders**: report "nothing to elicit — module's business context is already complete"; suggest `/compose` if ≥2 modules are ready, otherwise `/scan-deep` on the next module
- **E3 — User says "skip" or "not sure" on a TBD**: leave the marker but rewrite it as `TBD (ask product team)` or `TBD (deferred)` — never silently drop the TBD; record the reason so the summary block can list it
- **E4 — User abandons mid-interview**: file writes already happened up to the last completed phase, so partial progress is preserved; do NOT roll back; on next `/elicit` invocation the user can resume — the skill detects which TBDs remain and continues from there
- **E5 — Module has multiple UCs with materially different actors / goals**: in Phase 1 and Phase 2, ask the questions separately per US file (or per UC, depending on where the divergence sits); Phases 3 and 4 are always per-UC since flows and exceptions differ
- **E6 — Module's draft file lacks a frontmatter `sections` map** (older `/scan-deep` output or hand-written drafts): fall back to the default aliases from `format.md` / `skills/init/references/format.md`, but warn the user that the file's heading names may not match the schema — recommend re-running `/scan-deep` to restamp frontmatter
- **E7 — Cross-module reference can't be resolved AND the user can't confirm the other module's status**: leave as `TBD (deferred until {other-module}'s loop completes)`; do NOT block the interview
- **E8 — User offers a UC rename in Phase 3 but the new slug would collide with an existing UC folder**: report the collision; ask for a different name; do not rename until a non-colliding slug is given
- **E9 — Module was produced by `/design-plan`, not `/scan-deep`** (detectable by inspecting whether `docs/drafts/use-cases/uc-{N}/use-case.md` references this module's UC via `implemented-by`, or whether the module folder has a `serves` link to a business UC drafted by `/draft`): refuse to run; tell the user `/elicit` is brownfield-only and the greenfield equivalent for filling these TBDs lives elsewhere (currently a gap — no greenfield-elicit skill exists)

## Serves

TBD (will be linked after /compose) — expected target: the business-context-capture step of the brownfield workflow business UC.
