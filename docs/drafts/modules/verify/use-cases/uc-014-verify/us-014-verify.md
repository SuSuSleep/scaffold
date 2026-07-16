---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-014
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

# US-014: Run /verify to check three-way alignment before opening a PR

## Belongs to

UC-014 — Verify three-way alignment on a feature branch (and conditionally commit) (module `verify`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the greenfield workflow business US, where the user-facing step is "before I open my PR to main, I want a delta-scoped three-way alignment check (docs ↔ tests ↔ code) — and if everything's clean, I want the option to commit my unstaged doc changes from `/merge` as the final feature-branch commit. If anything's misaligned, I want a clear report with recommendations but no automated fixes — misalignment at this stage means an upstream gate leaked."

## Story

- **As:** Project developer or maintainer
- **I want to:** quickly confirm all the merge doc are correct formatted, and after all correct, then commit.
- **So that:** If not skill, user need to review all doc manually.
- **Trigger:** On demand when they want to confirm the merged docs are correct and match the required format

## Expected Behavior

`/verify` helps a project developer or maintainer quickly confirm that merged confirmed docs are correctly formatted and aligned before opening a PR. It checks the branch's changed confirmed docs against related tests and code, reports whether the branch is CLEAN or MISALIGNED, and only after a clean result offers to commit the verified doc changes. Without `/verify`, the user has to manually review every merged doc before they can trust and commit the final branch state.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Mostly single-turn (orient → diff → checks → report). One conditional interactive moment: the commit-yes-no prompt when CLEAN AND working tree has uncommitted doc changes.

### Command

```
/verify
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| (none) | — | The skill takes no positional arguments; scope is derived from `git diff main...HEAD`. Manual scope fallback (E1) is conversational, not flag-based. |

### Stdin

Not applicable in the OS sense — input is mostly single-turn. The skill ingests:

- `git diff main...HEAD --name-only` output (scope)
- `git branch --show-current` (branch name for the report)
- `git status --porcelain` (whether the working tree has uncommitted changes for the commit prompt)
- Every changed confirmed US file (frontmatter `sections.scenarios` heading + body)
- Every changed confirmed UC `use-case.md` file (TBD scan in Check 3)
- The behavioural test files matched by `test-conventions.behavioral-path-pattern`
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` (or embedded defaults)
- One user answer to the commit prompt **only when** the report is CLEAN AND there are uncommitted changes
- Optional in-line clarifications for E1 (no diff), E3 (running on main), E9 (uncommitted source changes), E10/E11 (refusal cases)

### Stdout

Single-turn structured output (with a possible commit prompt before the final line):

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

Followed by:

- CLEAN AND working tree clean → `CLEAN — ready to open PR to main.`
- CLEAN AND uncommitted doc changes →

  ```
  All checks passed. The working tree has uncommitted doc changes from /merge.
  Shall I commit them as the final feature-branch commit before you open the PR? (yes / no)
  ```

  Then, on explicit yes:

  ```
  Committed {short-hash} — ready to open PR to main.
  ```

  On no / anything not-yes:

  ```
  CLEAN — working tree has uncommitted changes; commit manually when ready, then open PR to main.
  ```

- MISALIGNED → `MISALIGNED — do not open PR. Human review required.` followed (optionally) by inline recommendations naming the right next skill (`/apply`, `/draft`, etc.) — recommendations are conversational only, no file written, no skill invoked

### Stderr

Not separately addressed. E1 (no git diff), E3 (running on main), E10/E11 (fix request refusals) surface inline; E1 may halt before any check; E3 asks for explicit go-ahead.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| CLEAN + working tree clean | Report printed; "ready to open PR to main." No commit prompt, no writes |
| CLEAN + uncommitted doc changes + user says "yes" | Report printed; doc changes staged and committed (path-scoped, never `git add .`); commit hash printed; no push |
| CLEAN + uncommitted doc changes + user says anything not-"yes" | Report printed; working tree untouched; user told to commit manually |
| MISALIGNED | Report printed with each failure; optional inline recommendations; NO commit prompt; working tree untouched |
| Branch identical to main (E2) | "Nothing to verify" message; no report rendered; no commit |
| Not a git repo / detached HEAD (E1) | Skill asks for manual scope or stops; no writes |
| Run on `main` (E3) | User asked whether to proceed anyway; no writes until answer |
| Behavioural test file missing (E4) | MISALIGNED; recommend `/apply`; no writes |
| TBD found in confirmed doc (E5) | MISALIGNED; recommend `/draft`; no writes |
| User asks for inline fix (E10) | Refusal + redirect; no writes |
| User asks for a fix plan like /apply's (E11) | Refusal + explanation that this masks the upstream-gate signal; no writes |

### Side effects

- **Zero modifications to docs / tests / code at every step** — hard invariant
- **No fix plan written** — distinct from `/apply`'s Final Batch fix plan behaviour (intentional difference: at `/verify`'s stage, fix plans would mask upstream-gate leaks)
- **No skill invocation** — recommendations are conversational text only
- **Conditional git operation** (the only write of any kind):
  - Fires only when (a) report is CLEAN AND (b) working tree has uncommitted doc changes AND (c) user answered explicit "yes" to the prompt
  - `git add` is **path-scoped** to the specific doc paths from the verified scope — never `git add .` or `git add -A`
  - `git commit` with a message naming the verified UCs (e.g. `docs(release): UC-001 checkout verified, ready for PR`)
- **No `git push`** at any step (under any conditions) — opening the PR is the user's manual next step
- **No auto-`git init`** when the working tree is not a git repo — E1 halts instead
- **No** writes under `src/`, `tests/`, `docs/schema/`, `docs/drafts/`, `docs/drafts/coverage.md` at any step
- **No** UC/US/ADR/plan/fix-plan document creation

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/verify/us-014-*.test.*`.

### Scenario 1: Merged docs verified and ready for PR

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (CLEAN + uncommitted doc changes + user says "yes" — git add scoped to doc paths only; commit created with verified-UC list message; hash printed; no push)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (CLEAN + uncommitted doc changes + user says "no" — working tree untouched; message "commit manually when ready" printed)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (CLEAN + uncommitted doc changes + user says "ok" — treated as NOT yes per E8; working tree untouched; explicit-yes-required behaviour upheld)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (Check 1 MISALIGNED — US has 3 scenarios, behavioural test has 2 → `✗ scenario mismatch` line; MISALIGNED verdict; no commit prompt)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (Check 1 MISALIGNED — behavioural test file doesn't exist → "no test file found"; recommend `/apply` inline)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (Check 2 MISALIGNED — test case doesn't cite a scenario number → "test case missing scenario reference")

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (Check 2 MISALIGNED — test cites `[S5]` but US has only 3 scenarios → "test references scenario 5 but US only has 3 scenarios")

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (Check 3 MISALIGNED — `TBD` found in confirmed UC's `related` section on line 14 → recommend `/draft` to resolve)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (Check 4 — US says "SHALL return HTTP 422" but test asserts 200 → PLEASE REVIEW item; verdict still CLEAN if no hard failure; commit prompt still fires when uncommitted changes exist)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (Branch identical to main → E2: "nothing to verify"; no report rendered; no commit)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (Not a git repo / detached HEAD → E1: skill asks for manual scope or stops; no writes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (Run on `main` directly → E3: skill warns and asks whether to proceed; user explicit-no halts)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (Working tree has uncommitted **source** changes (not just docs) → E9: advisory in the report; verdict not blocked by it; user decides)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 15: TBD (User asks `/verify` to fix the test count mismatch inline → E10: refusal + redirect to `/apply`; no writes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 16: TBD (User asks `/verify` to create a fix plan like `/apply` does on Final Batch failure → E11: refusal + explanation of upstream-gate signal; no writes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 17: TBD (Project workflow-rules.md has `test-case-references-source: optional` → E6: Check 2 cite-presence requirement degrades to advisory; only "scenario doesn't exist" remains hard)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 18: TBD (Project workflow-rules.md has `behavioral-count-equals-scenarios: false` → E7: Check 1 count-equality requirement degrades to advisory; only "no test file found" remains hard)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 19: TBD (Commit step is strictly path-scoped — `git add` lists every changed doc path from the verified scope, never `git add .` or `git add -A`; `git push` is NEVER invoked under any circumstances)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 20: TBD (Soft Check 4 items NEVER elevate to MISALIGNED — even when there are multiple PLEASE REVIEW items, the verdict is CLEAN if all three hard checks pass; commit prompt still fires when applicable)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the final-gate / pre-PR step of the greenfield workflow business US.
