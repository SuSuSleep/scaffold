---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-014
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

# UC-014: Verify three-way alignment on a feature branch (and conditionally commit)

The final gate on a feature branch before opening a PR to main. Identify the changed confirmed docs / source files / test files on this branch via `git diff main...HEAD --name-only`, then run **four checks** per changed confirmed US: (1) scenario count match (hard), (2) test-case reference correctness (hard), (3) zero TBD residual in confirmed docs (hard), (4) behavioural alignment between US `SHALL` clauses and test assertions (soft — PLEASE REVIEW only, never elevates to hard failure). Produces a `CLEAN` or `MISALIGNED` report.

**Read-only on docs / tests / code** at every step — never modifies any file. **No fix plan creation**, **no automated suggestions written to disk** — when MISALIGNED, the skill may *recommend* a fix path inline, but the user decides what to do next.

**Conditional commit step**: when the report is CLEAN AND the working tree has unstaged changes from `/merge` (or any other predecessor) that aren't yet committed, **ask the user** whether to stage and commit the doc changes. Commit only on explicit "yes". Never push. This is the final commit on the feature branch before the human opens the PR.

## Primary Actor

Inbound CLI invocation via the `/verify` slash command in Claude Code, typically with no arguments. Run immediately after `/merge` announces "Ready for /verify", or any time the user wants confidence that docs / tests / code are aligned on the current feature branch before opening a PR to main.

## Source

TBD (will be linked after /compose) — belongs to the greenfield implementation workflow: `explore → draft → review-draft → design-plan → apply → merge → /verify` (final gate before PR).

## Preconditions

- The working tree is a git repository on a feature branch with at least one commit divergence from `main` (the skill needs `git diff main...HEAD` to produce a scope)
- The branch has been through `/merge` (or at least has confirmed UC/US doc changes vs `main` — `/verify`'s scope is defined as the diff)
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` are readable (or embedded defaults apply) — used to resolve the US `sections.scenarios` heading and the `test-conventions.behavioral-path-pattern`
- The user is available synchronously **only when** the report is CLEAN AND a commit prompt is warranted — that's the one interactive moment in this skill

## Business Rules

None — the technical preconditions cover it.

## Postconditions

On success (CLEAN — all hard checks pass):

- A `Verification report` block has been printed listing the branch name, scope (`N` US files checked, list of UC IDs), per-US lines with `✓` marks, any soft "Please review" items, and the final verdict `CLEAN — ready to open PR to main.`
- If the working tree has **unstaged doc changes** (from `/merge` or another predecessor) AND the report is CLEAN: the skill has asked the user `"Shall I commit the doc changes?"` and either committed (on explicit "yes") or left the working tree as-is (on "no" or anything not-yes). The commit, when made, uses `git add` on the specific doc paths that changed (never `git add .`) and a message naming the verified UCs (`docs(release): UC-001 checkout verified, ready for PR` or similar)
- If the working tree is **already clean** (everything is committed): no commit prompt is shown; the report just ends with `CLEAN — ready to open PR to main.`
- **No push is performed** in any scenario — opening the PR is the user's manual next step
- No file has been modified other than the conditional commit (which doesn't modify file contents, only stages and records them)

On failure (MISALIGNED — one or more hard checks failed):

- The same `Verification report` block has been printed, with each failure named: the US path, which check failed, and what is wrong (`scenario mismatch — US has 3, test has 2 ([S3] missing)`, `TBD found (line 14)`, etc.)
- The final verdict is `MISALIGNED — do not open PR. Human review required.`
- The skill **may recommend** a fix direction inline (e.g. "Consider re-running `/apply` after amending US-001 Scenario 3 to match the implementation" or "TBD on line 14 references a draft ADR — return to `/draft` to resolve") — but **never creates a fix plan**, never writes any file, never invokes another skill
- **No commit prompt** is shown when MISALIGNED — the user must address the misalignment first
- The working tree is left exactly as the skill found it

Invariants (apply in every mode):

- **Read-only on docs / tests / code at every step** — the skill never edits a confirmed UC/US, never edits a test file, never edits source code, never creates a fix plan
- **No silent commit** — the commit step only fires when (a) the report is CLEAN AND (b) the working tree has uncommitted changes AND (c) the user explicitly says yes
- **No `git push`** at any step
- **No auto-`git init`** — if the working tree is not a git repo, the skill cannot do scope detection and stops with a clear message
- **Scope is strictly the branch-vs-main delta** — `/verify` is a delta check, not a full-project audit; unchanged docs from prior features are NOT re-verified
- **Soft findings never elevate to hard failures** — Check 4's "Please review" items are advisory; they do not block the CLEAN verdict
- **No fix plan created** — distinct from `/apply`'s Final Batch failure (which DOES create a fix plan). At `/verify`'s stage, the root cause is upstream-gate failure, and creating a fix plan would mask the signal

## Main Flow

1. **Load schema and rules** — read `docs/schema/format.md` (section aliases — especially `sections.scenarios` defaulting to "Test Scenarios") and `docs/schema/workflow-rules.md` (`test-conventions` — `behavioral-path-pattern` defaulting to `tests/behavioral/{module}/us-{id}-*.test.*`, `test-case-references-source` defaulting to `required`, `behavioral-count-equals-scenarios` defaulting to `true`); fall back to embedded defaults if absent
2. **Identify scope via git diff**:
   - `git diff main...HEAD --name-only` → collect changed paths
   - Filter by pattern:
     - Confirmed US: `docs/use-cases/**/us-*.md` + `docs/modules/**/us-*.md`
     - Confirmed UC: `docs/use-cases/**/use-case.md` + `docs/modules/**/use-case.md`
     - Source: `src/**`
     - Tests: `tests/**`
   - Also capture `git branch --show-current` for the report
   - If diff is empty (branch is identical to main): report "no changes vs main — nothing to verify" and stop
3. **Per changed confirmed US, run the four checks in order before moving to the next US**:
   - **Check 1 — Scenario count (hard)**: read the US file; use frontmatter `sections.scenarios` to locate the scenarios section; count `### Scenario N:` sub-headings → declared count. Find the corresponding behavioural test file via `test-conventions.behavioral-path-pattern`. If file missing → MISALIGNED ("no test file found"). If present → count `[S{n}]` blocks (test cases referencing a scenario number). Per `behavioral-count-equals-scenarios`, counts must match. If not → MISALIGNED ("US has X, test has Y — [S3] missing")
   - **Check 2 — Reference correctness (hard)**: per `test-case-references-source: required`, every test case must cite its source US ID + scenario number (`[S1]`, `[S2]`, `US-001`, `Scenario 1` in test name or comment). For each test case: cite present → check the cited scenario number exists in the US file; cite missing → MISALIGNED ("test case missing scenario reference"); cited scenario doesn't exist → MISALIGNED ("test references scenario N but US only has M scenarios")
   - **Check 3 — TBD references (hard)**: scan the confirmed US file (and its UC `use-case.md` if also changed) for any `TBD` strings. If found → MISALIGNED ("TBD found on line N"). These should have been resolved or patched during `/merge`; their presence here is the last-line-of-defence catch for upstream-gate leaks
   - **Check 4 — Behavioural alignment (soft, PLEASE REVIEW only)**: for each scenario's `Then: the system SHALL ...` clause, find the corresponding `[SN]` test case assertion; read both and check whether they appear to verify the same outcome. Flag obvious mismatches as PLEASE REVIEW (e.g. "US says 'SHALL return HTTP 422' but test asserts status 200"). Never elevate to hard failure — the human decides
4. **Compute the verdict and print the report**:
   - All hard checks pass → CLEAN (soft items listed as advisory, do not block)
   - Any hard check failed → MISALIGNED (list every failure with US path + clear description)

   Report format:

   ```
   Verification report
   ────────────────────────────────────────────────────────
   Branch: {branch-name}
   Scope:  {N} US files checked ({list UC IDs})

   {UC-001} {US-001}  ✓ 4/4 scenarios  ✓ refs correct  ✓ no TBD
   {UC-001} {US-002}  ✗ scenario mismatch — US has 3, test has 2 ([S3] missing)
   {UC-002} {US-001}  ✓ 2/2 scenarios  ✓ refs correct  ✗ TBD found (line 14)

   Please review:
     UC-001 US-002 [S2]: US says "SHALL return HTTP 422 with DUPLICATE code"
                         Test asserts status 422 but no error code assertion found
   ────────────────────────────────────────────────────────
   Result: CLEAN  /  MISALIGNED
   ```

5. **End-of-run conditional commit step** (only when the report is CLEAN):
   - Check `git status --porcelain` — does the working tree have uncommitted changes within the scope of paths verified (docs/use-cases, docs/modules, docs/adr, docs/overview/architecture.md, docs/modules/*/README.md)?
   - **No uncommitted changes** → end with `CLEAN — ready to open PR to main.` (no commit prompt; everything's already committed)
   - **Uncommitted changes present** → ask the user: `"All checks passed. The working tree has uncommitted doc changes from /merge. Shall I commit them as the final feature-branch commit before you open the PR? (yes / no)"`
     - **yes** → `git add` the specific doc paths that changed (path-scoped, never `git add .`); `git commit` with a message like `docs(release): UC-001 checkout verified, ready for PR` listing the verified UCs; print the commit hash; end with `Committed {hash} — ready to open PR to main.`
     - **no / anything not-yes** → leave the working tree as-is; end with `CLEAN — working tree has uncommitted changes; commit manually when ready, then open PR to main.`
   - Under no circumstances `git push` — the user opens the PR manually
6. **End-of-run on MISALIGNED**: skip the commit step entirely; end with `MISALIGNED — do not open PR. Human review required.` Optionally include inline recommendations (e.g. "Consider re-running `/apply` on US-001 to add the missing `[S3]` test case", or "TBD on `use-case.md:14` points to a draft ADR — return to `/draft` to resolve"). Recommendations are conversational only; nothing is written, no skill is invoked

## Exception Flows

- **E1 — `git diff` is unavailable** (not a git repo, or detached HEAD, or `main` ref is missing): report the failure clearly; ask the user to either set up the branch state properly or to manually specify which UCs to verify (the skill can fall back to manual scope if the user lists files). Make no changes. (contact support)
- **E2 — Branch is identical to `main`**: report "no changes vs main — nothing to verify"; stop. This is a benign no-op, not a failure. (recoverable)
- **E3 — Working tree on `main` directly**: warn the user (`/verify` is intended for feature branches before PR); ask whether to proceed anyway (the four checks still work on whatever local changes exist); make no changes until the user answers. (recoverable)
- **E4 — Behavioural test file missing** (Check 1 cannot find a test file matching the path pattern): MISALIGNED with "no test file found"; report which US is affected; recommend `/apply` if the US was promoted without tests (a serious upstream-gate leak — `/merge`'s pre-merge checklist should have caught this as a HARD BLOCKER). (recoverable)
- **E5 — TBD found in confirmed doc** (Check 3 fails): MISALIGNED with the line numbers; recommend whether `/merge`'s TBD-patch step failed (return to `/draft` to resolve the TBD's target) or whether `/review-draft`'s ADR-trigger check leaked (the missing decision should be drafted via `/draft`); never auto-fix. (contact support)
- **E6 — `test-conventions.test-case-references-source` is set to `optional` in the project's workflow-rules.md**: Check 2's cite-presence requirement degrades to advisory; only the "cited scenario doesn't exist in US" condition remains a hard failure. (contact support)
- **E7 — `behavioral-count-equals-scenarios: false` in the project's workflow-rules.md**: Check 1's count-equality requirement degrades to advisory; only the "no test file found" condition remains a hard failure. (contact support)
- **E8 — User answers anything other than explicit "yes" to the commit prompt**: leave the working tree as-is; end with the "commit manually when ready" message. Do NOT interpret silence, "ok", "sure", or "go" as yes — require explicit "yes" because this is the final feature-branch commit before PR. (recoverable)
- **E9 — Working tree has uncommitted **source** changes (not just doc changes)**: surface this in the report as an advisory — `/verify`'s scope is documentation alignment, but a feature branch with uncommitted source changes is probably not ready for PR regardless of the verification verdict. Do NOT block; let the user decide. (recoverable)
- **E10 — User asks `/verify` to fix a MISALIGNED finding inline** ("just fix the test count to match"): refuse and explain that `/verify` is read-only by hard invariant; recommend the appropriate skill (`/apply` for test additions, `/draft` for TBD resolution); make no changes. (contact support)
- **E11 — User asks `/verify` to create a fix plan** like `/apply` does on Final Batch failure: refuse and explain the difference — `/apply`'s Final Batch fix plan addresses a contained regression mid-implementation; `/verify`'s misalignment signals an upstream-gate leak (something escaped `/review-draft`, `/design-plan`, `/apply`, `/merge`), and creating a fix plan here would mask the root-cause signal. Recommend that the user investigate which upstream gate let the issue through. (contact support)

## Serves

TBD (will be linked after /compose) — expected target: the final-gate / pre-PR step of the greenfield workflow business UC.
