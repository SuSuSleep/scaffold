---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-001
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

# UC-001: Implement a plan

Execute an implementation plan from `docs/drafts/plans/`, batch-by-batch, until every task is `[x]` and the result is committed — or stop early and surface a clear next action (fix-plan or hand-back) when something blocks progress.

## Primary Actor

Inbound CLI invocation via the `/apply` slash command in Claude Code (optionally with a plan name argument, e.g. `/apply plan-002`).

## Source

TBD (will be linked after /compose) — belongs to the greenfield implementation workflow: `explore → draft → review-draft → design-plan → /apply → merge → verify`.

## Preconditions

- A plan file exists at `docs/drafts/plans/plan-*.md`
  - If the user named one, it is used
  - If exactly one exists, it is used by default
  - If multiple exist and the user did not name one, the skill asks which to use
- The plan contains at least one `- [ ]` (pending) task, OR every task is already `[x]` (in which case the skill suggests `/merge` and stops)
- Each module US referenced by pending tasks exists at either
  `docs/drafts/modules/{module}/use-cases/` or `docs/modules/{module}/use-cases/`
- Quality commands are discoverable — from `CONVENTIONS.md` Quality Commands section, or by inference from `package.json` / `pyproject.toml` / `Makefile`, or by asking the user

## Business Rules

- A plan must have passed `/review-draft` upstream — `/apply` does NOT re-verify business-draft quality; it trusts the plan
- Only one `/apply` run per plan at a time — no concurrent runs on the same plan file (race conditions on checkboxes)
- No human approval gate between batches — the skill works autonomously until the 3-attempt rule trips or the Final Batch fails
- The skill **never pushes** — local commit only is a hard rule

## Postconditions

On successful completion (all tasks `[x]`):

- Every `- [ ]` in the plan file has been flipped to `- [x]`
- Source files written/modified under `src/{module}/` per each task
- Behavioral tests written/updated under `tests/behavioral/{module}/` following the pattern `us-{id}-*.test.*`, one test case per US scenario
- Implementation quality tests written under `tests/implementation/{module}/`
- The full behavioral suite is green (Final Batch verified)
- `format` and `lint` have been run (auto-fix only) and any resulting changes are included
- `typecheck` (if configured) is green
- A single git commit has been created including the plan file + all paths from the plan's Affected Files section — staged path-by-path, never `git add -A`
- No push is performed

On partial completion (stopped before all tasks done):

- Tasks that completed are `[x]`; tasks that failed remain `[ ]`
- No commit is created unless the Final Batch passed
- If the Final Batch failed: a fix-plan exists at `docs/drafts/plans/plan-{next-id}-fix-{kebab-name}.md` and is announced as the new unit of work

## Main Flow

1. **Locate the plan** — use the user-named plan, or glob `docs/drafts/plans/plan-*.md`; if multiple match, ask which to use
2. **Read the plan in full** — identify pending `- [ ]` tasks, the resume point (first `- [ ]`), and the Final Batch
3. **Read context** — each referenced module US file, `docs/schema/workflow-rules.md` (test-conventions), `CONVENTIONS.md` (Quality Commands + Config Files), `docs/overview/test-strategy.md`
4. **Discover quality commands** — verify, behavioral, coverage, format, lint, typecheck, build; announce the plan name and the commands found
5. **Regular batch loop** — for each non-Final batch sequentially:
   - For each pending task in the batch:
     1. Implement the code (minimal, scoped to the task)
     2. Run `typecheck` if configured — fix any errors before continuing (3-attempt rule)
     3. Write/update the behavioral test file for the US (one test case per scenario, referencing the source US/scenario)
     4. Run behavioral tests; fix on failure (3-attempt rule)
     5. Assess quality-test difficulty; if the code is too tangled, refactor under behavioral test protection and continue
     6. Write implementation quality tests under `tests/implementation/{module}/`; run them (3-attempt rule)
     7. Mark the task `- [x]` in the plan file
   - Announce batch completion: "Batch N complete — M/T tasks done overall."
6. **Final Batch** — collect all scenarios to verify: new scenarios from this plan + every existing scenario for every touched module (skip "No existing scenarios" notes)
7. **Run the full behavioral test suite** (not just new tests)
8. **If green**: run `format`, `lint`, then `typecheck`; mark every Final Batch item `[x]`; stage the plan file + each path from Affected Files (path-by-path); create a verbose commit naming the modules and listing implemented files; announce completion
9. **If red**: see Exception Flow E5

## Exception Flows

- **E1 — No plan found / multiple plans, none named** (recoverable): ask the user which plan to use (or report "no plan found" if the glob is empty) and stop until told
- **E2 — Plan already fully complete (all `[x]`)** (recoverable, informational): announce "plan complete" and suggest `/merge`; do not modify anything
- **E3 — Typecheck fails 3 times on the same task** (recoverable, human review): stop. Leave the checkbox `[ ]`. Report the error and what was tried. Wait for guidance. (Same 3-attempt rule applies to behavioral and quality tests.)
- **E4 — Refactoring signal during quality-test planning** (recoverable, auto-continue) — too many branches / nested conditions / tight coupling: announce the signal, refactor while keeping behavioral tests green, then re-assess. Do not stop, do not ask permission
- **E5 — Final Batch fails** (recoverable, fix-plan path): do NOT inline-fix. Leave failing Final Batch items `[ ]`. Create `docs/drafts/plans/plan-{next-id}-fix-{kebab-name}.md` using the `fix-plan` template (fall back to `skills/init/references/format.md` if the project has no `format.md`). Announce "Implementation Paused — Final Batch Failed" with the failing scenario, brief root cause, and the new fix-plan path. The fix-plan becomes the new unit of work
- **E6 — Quality commands cannot be discovered** (recoverable): ask "What command runs the behavioral tests?" before doing any code work
- **E7 — Referenced module US file missing** (recoverable, return to /design-plan): surface the missing path and stop before writing code — implementing without the contract is forbidden

## Serves

TBD (will be linked after /compose) — expected target: the greenfield implementation workflow business UC.
