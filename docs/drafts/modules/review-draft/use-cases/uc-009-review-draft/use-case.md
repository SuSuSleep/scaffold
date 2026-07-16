---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-009
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

# UC-009: Review business-layer drafts as a quality gate before planning

Read every business-layer UC and ADR under `docs/drafts/` (the output of the `/draft` skill — never module-layer drafts, never confirmed docs), run a three-pass review per UC (Structural / Substance / ADR-trigger), produce a per-UC verdict (READY / NEEDS REVIEW / BLOCKED), advise on which UCs should be planned together, and — only when **every** UC reaches READY — commit `docs/drafts/` as a review checkpoint so the exact reviewed state is traceable. The skill is **read-only on docs** at every step: when issues are found, the user updates the drafts and re-runs.

## Primary Actor

Inbound CLI invocation via the `/review-draft` slash command in Claude Code. Typically invoked after `/draft` writes or updates business-layer drafts, before `/design-plan`; also invoked any time the user wants a quality check ("are the drafts ready?", "is UC-xxx ready to implement?", "validate the scenarios").

## Source

TBD (will be linked after /compose) — belongs to the greenfield implementation workflow: `explore → draft → /review-draft → design-plan → apply → merge → verify`.

## Preconditions

- `docs/drafts/use-cases/` exists and contains at least one `uc-{id}-{name}/` folder; otherwise the skill reports "no drafts to review" and stops
- The drafts under review are business-layer (produced by `/draft` or `/compose`), not module-layer drafts (`/scan-deep` / `/design-plan` output is **explicitly out of scope** for this skill)
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` are readable, or the embedded defaults apply
- `docs/modules/`, `docs/use-cases/`, and `docs/adr/` are readable (or absent — calibrates "new" vs "established" project)
- A git repository exists at the working tree root **only if** the run reaches the commit step at full-READY; if not, the commit step degrades to "no git repo — files left as-is, no commit created"

## Business Rules

None — the technical preconditions cover it.

## Postconditions

Regardless of verdict:

- A structured review report has been printed listing per-UC verdicts (READY / NEEDS REVIEW / BLOCKED), individual findings (BLOCKERS / WARNINGS / SUGGESTIONS), and any plan-together advisory
- **No draft file has been modified** — the skill is read-only on docs at every step (hard invariant)
- **No confirmed doc has been read for review purposes** — `docs/use-cases/`, `docs/modules/`, and `docs/adr/` are read **only** to calibrate severities and resolve cross-references; never reviewed for quality
- **No module-layer draft has been reviewed** — module UC/US drafts under `docs/drafts/modules/` are out of scope
- **No code or test has been touched** — `src/` and `tests/` are not read for alignment (that's `/verify`'s job)

On full READY (every UC under `docs/drafts/use-cases/` reaches READY verdict):

- `docs/drafts/` has been staged via `git add docs/drafts/`
- A single git commit has been created at the working tree with a verbose message naming each reviewed item, its verdict, and a brief parenthetical summary (file count, blockers, warnings — or "clean" if nothing). Message form: `docs(drafts): {uc list} reviewed and ready`
- No `git push` is performed
- This commit anchors the **exact reviewed state** so that any later edit to a draft before planning starts is visible in git history. The motivation is traceability — a different reason than `/merge`'s no-commit policy (`/merge` defers commit policy to a downstream step; `/review-draft` commits because the review state itself is the artifact worth preserving)

On not-full-READY (any UC is NEEDS REVIEW or BLOCKED):

- **No git commit is created** — committing would imply the drafts are ready when they aren't
- The user is told what's blocking each UC and is expected to amend the drafts via `/draft` and re-invoke `/review-draft`

## Main Flow

1. **Orient and calibrate** — read `docs/schema/format.md` and `docs/schema/workflow-rules.md` (or embedded defaults); inspect project state: presence of `docs/modules/` with real content → established (stricter severities); absent or empty → new (relaxed severities). Collect existing confirmed UC/ADR IDs for cross-reference validation. Calibration is owned here, not delegated
2. **Scan drafts in scope** — list every `docs/drafts/use-cases/uc-{id}-{name}/` folder and every `docs/drafts/adr/adr-draft-*.md`. If `docs/drafts/use-cases/` is empty or absent, report "no drafts to review" and stop
3. **For each UC in scope, run the three review passes in order — each pass completed before moving to the next UC**:
   - **3a. Pass 1 — Structural completeness**: using each document's own frontmatter `sections` map to resolve heading names, check the use-case file for required sections (actor, preconditions, ≥1 flow step, exceptions reference real USs, implemented-by filled, module names match `docs/modules/` in established projects); check each us file for the Story 4 lines (As a / When / I want / So that), ≥1 scenario in Given/When/Then, happy-path coverage, exception-or-failure scenario, "the system SHALL" Then phrasing, concrete values in scenarios (not "a valid user" or "some amount"), api-contract endpoint present (skip if `api-type: none`). Severities follow the new-vs-established table from the source SKILL.md
   - **3b. Pass 2 — Substance review**: read the story's "I want" + "So that" lines and check that some scenario's Then clause actually verifies the promised outcome; look for obvious missing failure-mode coverage in the domain (external-service failure, idempotency for resource-create, not-found for record operations, timeouts for eventual-consistency flows) — these are suggestions unless the US itself flags idempotency as required (then warning); check scenario distinctness (two near-identical Given/When that differ only by which invalid input); check that the response contract contains the fields the story promises the caller will receive; check that every US in the UC describes the same user goal (administrative actions sitting inside a user-facing UC → flag for scoping)
   - **3c. Pass 3 — ADR trigger check**: apply the three-question test per US (multiple options implied? affects >1 module? "why" not inferable from result?); when ≥2 boxes are checked and no ADR is referenced + no matching `adr-draft-*.md` exists, raise a WARNING "Decision unrecorded — consider an ADR." Common hotspots: idempotency/retry strategy, cross-module event-vs-direct-call, auth approach inline, cross-module data ownership
4. **Run lighter checks on ADR drafts** in `docs/drafts/adr/`: Status field set to `Proposed` (WARNING if not), Background explains the problem (WARNING if missing), ≥2 options considered (SUGGESTION if not), Decision section present with reasoning (WARNING if missing)
5. **Plan-together assessment** — after individual UC reviews, flag UCs that share a module in `implemented-by`, reference each other, share a sub-flow, or where one's Main Flow depends on state created by another. This is advisory, not a verdict-affecting finding
6. **Compute verdicts and produce the report**:
   - Any BLOCKER on a UC → BLOCKED
   - Warnings or substance issues, no blockers → NEEDS REVIEW
   - Suggestions only, or fully clean → READY
   - Print the structured report (per-UC verdict lines + BLOCKERS / WARNINGS / SUGGESTIONS sections + PLANNING NOTE + overall result `N of M UCs ready to plan`)
   - When every UC is READY, end with: *"All drafts look ready — next step is an implementation plan."*
7. **Commit on full READY only** (the explicit boundary that distinguishes this skill from `/merge`):
   - Pre-check: every UC's verdict is READY; otherwise skip the commit step entirely and explain why ("X of M UCs are not READY — the commit anchors a reviewed state, not a partial one")
   - `git add docs/drafts/` (specifically the drafts subtree; never `git add .`)
   - `git commit` with the verbose multi-line message listing every reviewed UC (with verdict + parenthetical summary) and every reviewed ADR draft
   - Never `git push`; never `git add` anything outside `docs/drafts/`

## Exception Flows

- **E1 — `docs/drafts/use-cases/` empty or missing** (contact support): report "no drafts to review" and stop. No commit. Suggest running `/draft` first
- **E2 — Module-layer draft folder spotted under `docs/drafts/modules/`** (ignore): explicitly skip it; do NOT review it; if the user explicitly asks for module-layer review, refuse and explain that the scope is business-layer drafts from `/draft` only (module-layer review/quality is a gap — currently not owned by any skill). Suggest opening an issue or extending a future skill
- **E3 — Confirmed docs requested for review** (contact support): e.g. user says "review UC-001" and UC-001 is in `docs/use-cases/`; refuse politely; explain that confirmed docs are out of scope; if the user really wants to revisit them, the path is `/draft` → copy-from-confirmed → re-review the draft
- **E4 — Any UC verdict is NEEDS REVIEW or BLOCKED** (contact support): skip the commit step; print the report; tell the user to amend drafts via `/draft` and re-invoke `/review-draft`. Do NOT commit a partial-ready state — that would be misleading
- **E5 — User asks the skill to fix a BLOCKER inline** (contact support): refuse; this skill is read-only on docs by hard invariant. Direct the user to `/draft` (or to edit the file directly and re-run)
- **E6 — Working tree is not a git repo when full-READY is reached** (ignore): skip the commit step silently; note in the summary "Not a git repository — review report only, no commit created". Do NOT auto-`git init`
- **E7 — A draft file has no frontmatter `sections` map** (contact support): fall back to the default aliases from `format.md` / `skills/init/references/format.md` for that file; flag this as a SUGGESTION ("file lacks frontmatter — re-run `/draft` or `/scan-deep` to stamp it")
- **E8 — A US references a module in `implemented-by` that doesn't exist in `docs/modules/`** (recoverable): established project; WARNING "unknown module named in Implementation Layer Mapping" (not a BLOCKER — the module may simply be brand-new and not yet documented)
- **E9 — Plan-together assessment finds UCs that should be planned together** (recoverable): surface as an advisory note in the report; do NOT downgrade verdicts; the user/`/design-plan` decides whether to combine
- **E10 — A scenario uses vague language** (recoverable): ("a valid user", "some amount", "certain conditions"): flag as a WARNING (concrete values check); do not auto-rewrite
- **E11 — User runs `/review-draft` after a full-READY commit was already made** (recoverable): re-run is allowed; if no drafts changed, the report is identical and the commit step is a no-op (nothing to stage); if drafts changed since the last commit, the new review-state will be committed if it reaches full-READY again

## Serves

TBD (will be linked after /compose) — expected target: the quality-gate step of the greenfield workflow business UC (between requirement capture and planning).
