---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-008
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

# UC-008: Promote completed-plan drafts to confirmed docs (no commit)

Run after `/apply` finishes and every plan checkbox is `[x]`. Verify the plan is mergeable (hard gates and soft warnings via a 6-item pre-merge checklist), then promote the plan's drafts to their permanent confirmed locations: move business and module UC/US folders, simplify US `api-contract` sections to a single api-type-keyed summary line, promote ADR drafts (status `Proposed → Adopted`) and delete superseded confirmed ADRs, append rows to module `README.md` "Confirmed Use Cases" tables (or create the README if missing), conditionally update `architecture.md` (Module Overview row **and** the Mermaid system diagram itself), patch TBD references whose targets just became confirmed, and delete the plan file.

**This skill performs no git operation** — it stages no files, commits nothing, pushes nothing. Doc updates land in the working tree and wait for a downstream review step (`/verify`) before any commit is made.

## Primary Actor

Inbound CLI invocation via the `/merge` slash command in Claude Code, typically with a plan name (e.g. `/merge plan-002`). If no plan is named, the skill globs `docs/drafts/plans/plan-*.md`; uses the single match if exactly one exists; otherwise asks which to use.

## Source

TBD (will be linked after /compose) — belongs to the greenfield implementation workflow: `explore → draft → review-draft → design-plan → apply → /merge → verify`.

## Preconditions

- A plan file exists at `docs/drafts/plans/plan-{id}-{name}.md` (named, or the unambiguous single match)
- **Every `- [ ]` item in the plan is `- [x]`** — this is a hard gate (`gates.merge-blocks-on: any-unchecked-plan-item`). If anything remains unchecked, the skill refuses to touch any file
- Each UC in the plan's Scope has draft files under `docs/drafts/use-cases/uc-{id}-{name}/` and corresponding module drafts under `docs/drafts/modules/{module}/use-cases/uc-{id}-{name}/` per the plan's Affected Files
- For every US in scope, a behavioral test file exists at the path defined by `test-conventions.behavioral-path-pattern` (default `tests/behavioral/{module}/us-{id}-*.test.*`) — this is the second hard gate (HARD BLOCKER on the pre-merge checklist)
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` are readable, or the embedded defaults apply

## Business Rules

TBD (what business rules should apply here — e.g. is `/merge` allowed on a plan owned by someone else? Must `/review-draft` have run on the original business drafts at some point? Can `/merge` skip the diagram-update step for plans that don't introduce new modules? Are there guardrails on deleting superseded ADRs without a snapshot?) — `/elicit` fills this.

## Postconditions

On success:

- **Promoted UC/US folders**: every UC in the plan's Scope has moved from `docs/drafts/use-cases/uc-{id}-{name}/` → `docs/use-cases/uc-{id}-{name}/`; every module folder in the plan's Affected Files has moved from `docs/drafts/modules/{module}/use-cases/uc-{id}-{name}/` → `docs/modules/{module}/use-cases/uc-{id}-{name}/`. The structural change is exactly the `lifecycle.promotion-rule` default `remove-drafts-prefix`
- **Simplified US `api-contract` sections**: each promoted US's api-contract section body has been replaced with a single summary line keyed off the document's `api-type` frontmatter:

  | api-type | Summary line shape |
  | -------- | ------------------ |
  | `rest` | `- Endpoint: POST /api/v1/payments` |
  | `function` | `- Signature: someFunction(args) → ReturnType` |
  | `event` | `- Event: order.created` |
  | `cli` | `- Command: tool subcommand [flags]` |
  | `graphql` | `- Operation: mutation processPayment` |
  | `grpc` | `- Service: PaymentService.Charge` |
  | `none` | (section removed entirely) |

  All other sections are unchanged. Legacy docs without `api-type` frontmatter have it inferred from the sub-headings present.
- **Promoted ADRs**: every ADR listed in the plan's Related ADRs has been moved from `docs/drafts/adr/adr-draft-{id}-{name}.md` → `docs/adr/{id}-{name}.md` (project-level) or `docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md` → `docs/modules/{module}/adr/{id}-{name}.md` (module-level), and the `Status: Proposed (date)` line has been changed to `Status: Adopted (today's date)`
- **Superseded ADRs deleted**: if a promoted ADR's Background section names a superseded ADR, the old confirmed ADR file has been deleted (`lifecycle.adr-supersession-deletes-old` default true). Inline `// see ADR-{old-id}` comments in `src/` are **not** updated here — `/apply` already updated them during the rework batch of the implementation cycle
- **Module READMEs updated**: for each module in scope, one new row per newly-confirmed UC/US has been appended to the `## Confirmed Use Cases` table. If `docs/modules/{module}/README.md` did not exist, it was created with the standard template (module name, "What this module does" placeholder, "Design Patterns" placeholder left unfilled, link to architecture.md, the Confirmed Use Cases table with the new rows). The "Design Patterns" placeholder is **never** auto-filled — that section reflects engineer judgment, not the plan
- **architecture.md updated (conditional)**: if Step 1 flagged a new module/dependency, the Module Overview table has been appended with a new row (placeholder description), AND **the Mermaid system diagram has been updated** to include the new module — this skill performs the diagram update directly, including its positioning and edges to neighboring modules
- **TBD reference patching**: every TBD reference in the just-promoted files whose target was also promoted in this run has been rewritten to point at the new confirmed path. TBDs whose targets remain in drafts are left as TBD — `/verify` flags them for follow-up
- **Plan file deleted**: `docs/drafts/plans/plan-{id}-{name}.md` has been removed
- **Draft directories preserved**: empty `docs/drafts/{use-cases,modules,...}` subfolders are LEFT in place — other drafts may be added to the same module folder later
- **No git operation has run** — no `git add`, no `git commit`, no `git push`. Doc changes are visible in `git status` but unstaged; a downstream review step (`/verify`) is expected to handle commit/staging policy as part of its responsibility
- **No writes to `src/` or `tests/`** at any step — those are owned by `/apply`. This skill's writes are exclusively under `docs/`, plus deletion of the plan file
- A summary block has been printed listing what was Promoted, Updated, Cleaned up, and any Warnings from the pre-merge checklist; ends with `Ready for /verify`

On block (any plan checkbox unchecked, OR any behavioral test file missing for a US in scope): nothing is written, nothing is moved, nothing is deleted; the skill reports what's blocking and stops.

## Main Flow

1. **Load schema and rules** — read `docs/schema/format.md` (section aliases for `use-case` and `user-story`, especially `api-contract` and `scenarios`) and `docs/schema/workflow-rules.md` (`gates`, `lifecycle`, `cross-references`); fall back to embedded defaults if either is absent
2. **Resolve the plan** — use the user-named plan; otherwise glob `docs/drafts/plans/plan-*.md` and pick the single match (or ask if multiple). Read it in full
3. **Verify all plan checkboxes are `[x]`** — count every `- [ ]` item; if any remain unchecked, print a `Merge blocked — {N} tasks are not yet complete` block listing the unchecked items and stop. Do NOT touch any file before this check passes
4. **Pre-merge checklist** (6 items):
   1. UC main flow — read each `use-case.md` in scope; PASS if the Main Flow looks consistent with the implementation, WARN if stale
   2. Behavioral tests — for each US in scope, verify a file exists at `tests/behavioral/{module}/us-{id}-*.test.*`; PASS or **HARD BLOCKER** (list missing files; stop)
   3. API Contract vs api-spec — for each US whose `api-type: rest`, verify its `### Endpoint` appears in `docs/overview/api-spec.yaml`; PASS / WARN. SKIP for non-rest api-types
   4. TBD references — scan all draft files being promoted for `TBD` strings; note which targets will be resolved in Step 6
   5. New module or dependency — does Affected Files name a module whose `src/` didn't exist before? Does any UC reference a new external service not in `architecture.md`? PASS / WARN
   6. ADR supersession (only when the plan's Related ADRs include a new ADR superseding an existing one) — confirm the old confirmed ADR exists at its current path; scan `docs/drafts/` for any residual `Related ADR: ADR-{old-id}` references (should be 0 after `/draft`'s cascade); scan `src/` for `// see ADR-{old-id}` or `ADR-{old-id}` strings (should be 0 after `/apply`'s rework batch); PASS / WARN
5. **Promote files (lock-step substeps)** — perform in order so each move precedes any rewrite on the moved file:
   - **5a. Business-layer UC/US**: move `docs/drafts/use-cases/uc-{id}-{name}/` → `docs/use-cases/uc-{id}-{name}/`; for each US in the moved folder, simplify the `api-contract` section to the one-line summary per api-type
   - **5b. Module-layer UC/US**: move `docs/drafts/modules/{module}/use-cases/uc-{id}-{name}/` → `docs/modules/{module}/use-cases/uc-{id}-{name}/`; apply the same api-contract simplification (module USs typically use api-types `function`, `event`, `cli`, etc.)
   - **5c. ADR drafts**: move project-level drafts `docs/drafts/adr/adr-draft-{id}-{name}.md` → `docs/adr/{id}-{name}.md`; move module-level drafts to their confirmed mirror path; flip `Status: Proposed (date)` → `Status: Adopted (today)`; if Background names a superseded ADR, delete that old confirmed ADR file
   - **5d. Module README**: for each module in scope, append a `| UC-{id} | US-{id} | {description from US Story} |` row to the `## Confirmed Use Cases` table; create the README from template if absent; leave the Design Patterns section unfilled
   - **5e. architecture.md (conditional — only when Step 4.5 flagged a new module/dependency)**: append the new module's row to the Module Overview table with a placeholder description, **and directly update the Mermaid system diagram** to include the new module — pick reasonable positioning relative to nearest neighbors and add edges to the modules it interacts with based on the plan's cross-module references. (This is a divergence from the source SKILL.md, which left a TODO comment instead; the intended responsibility here is for `/merge` to own the diagram update directly.)
   - **5f. TBD reference patching**: in all just-promoted files, find references like `TBD (under discussion, see docs/drafts/adr/adr-draft-{id}-{name})` and, if the target was also promoted in this run, rewrite to point at the new confirmed path. Leave TBDs whose targets remain in drafts unchanged
6. **Cleanup** — delete `docs/drafts/plans/plan-{id}-{name}.md`; do NOT delete empty draft directories (they will be reused)
7. **Print summary** — Promoted / Updated / Cleaned up / Warnings (omit if none); end with `Ready for /verify — run it to confirm doc/code/test alignment before opening a PR to main.`

**No commit step.** The Main Flow ends at the summary print. Staging and committing are out of scope for this skill — a downstream review step (`/verify`) is expected to handle commit policy as part of its responsibility.

## Exception Flows

- **E1 — Plan has unchecked items**: report `Merge blocked — {N} tasks are not yet complete` with the list; stop before touching any file. Tell the user to run `/apply` to complete the remaining tasks
- **E2 — No plan named and no plan glob matches**: report "no plan found in `docs/drafts/plans/`" and stop. If multiple match without a name, list them and ask which to use
- **E3 — Behavioral test file missing for an in-scope US** (HARD BLOCKER on the pre-merge checklist): list the missing test file paths and stop without touching anything. Tell the user to add the tests via `/apply` first
- **E4 — User asks to merge only some UCs from the plan** ("partial merge"): refuse and explain that partial merges are not supported by this UC; ask whether to defer or to complete the rest of the plan via `/apply`
- **E5 — `lifecycle.adr-supersession-deletes-old` is `false`** (project policy override): skip the deletion of the old confirmed ADR; the new ADR's Background still names the superseded one as a textual reference; report this in the summary so the user knows the old file persists
- **E6 — Module README `## Confirmed Use Cases` table missing or malformed in an existing README**: do NOT auto-fix the table layout; report the malformation in the warnings; leave the README untouched and ask the user to repair it before re-running merge for that module
- **E7 — `architecture.md` doesn't exist when a new-module flag fires**: create it from a minimal stub (Module Overview table with the new module + Directory Structure boilerplate + empty Mermaid diagram block) and flag it in the warnings — this is the only path through which `/merge` creates `architecture.md`; normally `/init` owns its creation
- **E8 — TBD reference target is ambiguous** (the path string in the TBD doesn't uniquely identify a promoted file): leave the TBD as-is and add a warning to the summary; `/verify` will surface it for human resolution
- **E9 — Source SKILL.md still says "add a TODO comment near the diagram"** — this UC explicitly overrides that behavior. If a future skill revision tries to revert merge to the TODO-comment behavior, the change should re-confirm with the user; the current intended responsibility is direct diagram update
- **E10 — User asks merge to also run `git add` / `git commit`**: refuse and remind the user that commit policy is a downstream step. This UC explicitly excludes git operations. (Suggested phrasing: *"This skill only updates the docs and stops. `/verify` is the next step — it owns the review and any commit policy that follows."*)

## Serves

TBD (will be linked after /compose) — expected target: the promotion / pre-PR step of the greenfield workflow business UC.
