---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-003
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

# UC-003: Design an implementation plan from READY business drafts

Translate one or more READY business-layer UC/US drafts into two coupled outputs:

1. **Module-layer UC/US drafts** — one folder per module named in the business UC's `implemented-by` section, with the business intent re-expressed from each module's internal perspective (trigger replaces actor, interface contract replaces public API, module-internal steps replace user steps)
2. **An implementation plan** — batched, scenario-level tasks with affected-file lists, dependency notes, and a Final Batch that regression-tests every existing scenario in every touched module

Conditionally also produce ADR drafts (module-level or project-level) when a design decision meets the trigger criteria, and detect ADR supersession context to add an upfront rework batch.

## Primary Actor

Inbound CLI invocation via the `/design-plan` slash command in Claude Code, typically with one or more business UC IDs (e.g. `/design-plan UC-005` or `/design-plan UC-005 UC-006`). If no UC is named, the skill reads `docs/drafts/use-cases/` and asks which to plan.

## Source

TBD (will be linked after /compose) — belongs to the greenfield implementation workflow: `explore → draft → review-draft → /design-plan → apply → merge → verify`.

## Preconditions

- At least one business-layer UC exists under `docs/drafts/use-cases/uc-{N}-{slug}/` (named by the user, or selectable by the skill)
- Each named business UC has been through `/review-draft` and is in READY state — this UC assumes readiness; it does NOT itself review business drafts
- The business UC's `use-case.md` has a populated `implemented-by` (Implementation Layer Mapping) section that names every involved module
- For each module named, either an existing `docs/modules/{module}/use-cases/` exists (established) or no such folder exists (greenfield — flagged with `[proposed]` in the plan per `decomposition.greenfield-modules-need-proposed-marker`)
- `CONVENTIONS.md` is available so the skill can propose file paths consistent with project naming
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` are read if present; otherwise the embedded defaults from `skills/init/references/` are used

## Business Rules

- Trusts `/review-draft`'s READY verdict on the source business UC — `/design-plan` does NOT re-verify business-draft quality
- One plan per cohesive set of UCs — plan-together fires **only** when shared module / ordering dependency / shared sub-flow applies; otherwise one plan per UC
- **ADR decision authority sits here** — module-level vs project-level ADR creation follows the 3-question test in Step 9; the user is not asked to pick
- Greenfield modules require `[proposed]` markers on every Affected Files entry — no silent assumption that a path exists
- The skill **never** writes source code, **never** runs tests, **never** promotes drafts to confirmed — those are `/apply` and `/merge`'s jobs

## Postconditions

On success:

- A new folder `docs/drafts/modules/{module}/use-cases/uc-{module-uc-id}-{slug}/` exists for **every** module in the business UC's `implemented-by`, each containing:
  - `use-case.md` — module-layer UC with `serves` filled (pointing at the business UC) and `implemented-by` omitted
  - `us-{module-us-id}-{slug}.md` — module-layer US with `api-type` chosen for the module (default `function`; `rest`/`event`/etc. per the module's interface style), `serves` filled, and Story / api-contract / scenarios populated from the translation
- A new plan file `docs/drafts/plans/plan-{plan-id}-{slug}.md` exists with:
  - Goals listed as US IDs to implement
  - Affected Files listed per module, each marked `New:` or `Modify:` (and `[proposed]` for greenfield)
  - Batches organised by implementation dependency (sequential vs. parallel-eligible)
  - A Final Batch that lists every new scenario PLUS every existing scenario from every touched module's confirmed docs (regression coverage)
- ADR drafts conditionally exist at `docs/drafts/adr/adr-draft-{id}-{name}.md` (project-level) or `docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md` (module-level), one per qualifying decision
- If an ADR supersession was detected: the plan's batches begin with a dedicated "ADR rework — {module}" batch ahead of the scenario-driven batches
- No source code is written, no tests are run, no existing module docs are modified, no confirmed docs are promoted — those are explicitly other skills' jobs (`/apply`, `/merge`, `/verify`)

On partial completion (insufficient input):

- Nothing is written; the user is told what to fix (run `/review-draft`, run `/scan-all`, name a UC, etc.)

## Main Flow

1. **Pre-flight: load schema + rules** — read `docs/schema/format.md` and `docs/schema/workflow-rules.md` (or embedded defaults), extracting section aliases, `id-rules`, `decomposition.plan-together-when-any`, `decomposition.greenfield-modules-need-proposed-marker`, and `adr-triggers`
2. **Pre-flight: scan drafts** — list `docs/drafts/use-cases/`; for each business UC the user named (or for the candidate set if none named), read its `use-case.md` and extract `implemented-by` → the list of in-scope modules
3. **Pre-flight: classify modules** — for each in-scope module, glob `src/{module}/` and `docs/modules/{module}/`; classify each as **established** (src + docs exist) or **greenfield** (neither exists, or only one). Greenfield modules get `[proposed]` markers on all file paths in the plan
4. **Pre-flight: scan plans + ADR supersession** — list `docs/drafts/plans/` to pick the next plan ID; scan `docs/drafts/adr/` and `docs/drafts/modules/*/adr/` for ADR drafts whose Background references "supersedes ADR-xxx" or "replaces ADR-xxx" → if found, flag this run as an **ADR supersession plan** and record the superseded ADR ID
5. **Plan-together assessment** — apply `decomposition.plan-together-when-any`: if any pair of named UCs share a module, share a sub-flow, or have an ordering dependency, plan them together; record the rationale for the plan's "Why These UCs Are Planned Together" section
6. **Report findings to the user** — list established vs. greenfield modules, any ambiguous business-UC → module mappings, the ADR-supersession flag if set, the plan-together decision — *before* writing any file
7. **Assign IDs** — apply `id-rules` (default `highest-plus-one`, no gaps, independent sequences):
   - Plan ID = `docs/drafts/plans/` highest + 1
   - Per-module UC and US IDs = highest in (`docs/drafts/modules/{module}/use-cases/` ∪ `docs/modules/{module}/use-cases/`) + 1, independently per module
8. **For each in-scope module, translate business → module** — this is the core intellectual work owned by this skill:
   - Replace the business actor with a trigger ("event from auth-module", "HTTP POST from gateway", etc.)
   - Replace user-experience steps in Main Flow with module-internal steps
   - Replace the business API contract with the module's interface contract (chosen api-type variant from `format.md`)
   - Re-express each business scenario from the module's perspective (Given/When/Then preserved structurally, language shifted to module-internal terms)
   - Carry over only the business-rules that *this* module enforces; leave rules another module enforces for that module's UC
   - For established modules: glob `src/{module}/**` and list relevant files under Affected Files as `Modify:`; for greenfield: propose paths per CONVENTIONS.md and mark each `[proposed]`
9. **For each in-scope module, run ADR assessment** — apply `adr-triggers`:
   - Q1: does implementing this require a design decision with multiple options?
   - Q2: would a new engineer not understand why this approach was chosen just by reading the code?
   - Q3: does this decision affect more than one module?
   - Q1 + Q2 yes → create module-level ADR draft at `docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md`
   - Q1 + Q2 + Q3 all yes → create project-level ADR draft at `docs/drafts/adr/adr-draft-{id}-{name}.md` instead
   - Use the `## adr Template` from `format.md`
10. **Write the module UC/US files** — one folder per module under `docs/drafts/modules/{module}/use-cases/uc-{module-uc-id}-{slug}/`, with frontmatter from `format.md`'s `use-case.sections` and `user-story.sections`. At module layer: include `serves` (link to the business UC), omit `implemented-by` on the UC
11. **Write the implementation plan** at `docs/drafts/plans/plan-{plan-id}-{slug}.md`:
    - Frontmatter from `format.md`'s `plan.sections`
    - Goals = US IDs; Non-goals + Scope + Deferred explicit
    - Affected Files per module (with `New:`/`Modify:` and `[proposed]` markers)
    - Batches sequenced by dependency — each batch item = one US scenario; the per-batch sub-sequence is "implement → behavioral tests → quality test planning → quality test implementation"
    - If ADR supersession flagged: prepend a dedicated "ADR rework — {module}" batch before scenario batches per affected module
    - Final Batch lists every new scenario + every existing scenario from every touched module's confirmed docs (or "no existing scenarios — module is greenfield" if applicable)
12. **Print summary** — module drafts created, plan path, ADR draft paths (or "none"), proposed paths list (or "none"), and any notes the user should consider before `/apply`

## Exception Flows

- **E1 — No business UC named and `docs/drafts/use-cases/` is empty** (recoverable, return to /draft): tell the user to run `/draft` to capture the business intent first; make no changes
- **E2 — Named business UC doesn't exist** (recoverable): report which UC ID was not found — likely a typo or wrong ID; make no changes
- **E3 — Business UC `implemented-by` section is empty or missing** (recoverable, return to /review-draft): report that the business draft is not READY; tell the user to run `/review-draft` first; make no changes (this skill assumes review has already passed and trusts `implemented-by` as the authoritative module list)
- **E4 — Module named in `implemented-by` is ambiguous** (recoverable, user clarifies) — e.g. doesn't match any `src/` directory and has no existing module docs: report the ambiguity; ask the user whether the module is intentionally greenfield (proceed with `[proposed]`) or whether the business UC has a typo (stop)
- **E5 — ADR supersession detected but the superseded ADR ID cannot be located** in confirmed `docs/adr/` or `docs/modules/{module}/adr/` (recoverable, human review): report which referenced ADR ID is missing; stop before writing the plan (the rework batch needs the old decision to describe what's being replaced)
- **E6 — Multiple business UCs named but `plan-together-when-any` doesn't apply** (recoverable, auto-split): write a separate plan per UC (independent plan IDs, independent module-doc folders), not one combined plan
- **E7 — `format.md` and `workflow-rules.md` both missing AND `skills/init/references/` is also missing** (recoverable, return to /init): stop and tell the user to run `/init` — the skill cannot infer schema/rules from nothing
- **E8 — Greenfield module flagged but `CONVENTIONS.md` is missing or has no Coding section to infer file naming from** (recoverable, user confirms paths): ask the user to confirm the proposed path layout for each greenfield module before writing the plan (or to populate CONVENTIONS.md first)

## Serves

TBD (will be linked after /compose) — expected target: the planning step of the greenfield implementation workflow business UC.
