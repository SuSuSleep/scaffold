---
name: verify
description: >
  Three-way alignment check between confirmed docs, behavioral tests, and code —
  run after /merge and before opening a PR to main. Use this skill whenever /merge
  announces "Ready for /verify", the user says "verify the implementation", "check
  alignment before PR", "is this ready to merge to main?", "run verify", or any
  moment after doc promotion where the user wants confidence that docs, tests, and
  code all tell the same story. This is the final gate on the feature branch before
  the PR to main — always use it after /merge completes.
---

# Skill: verify

Check that confirmed docs, behavioral tests, and code are fully aligned on this
feature branch before a PR to main.

This skill **reports only** — it does not fix anything. If misalignment is found,
the result is a clear diagnostic for the human to investigate. Misalignment at
this stage is a serious signal that something slipped through multiple prior gates;
automated fixes would hide the root cause rather than surface it.

---

## Step 0: Identify scope

The plan file has been deleted by /merge, so use git to find what changed on this
branch:

```bash
git diff main...HEAD --name-only
```

From the output, collect:

- Confirmed US files changed: paths matching `docs/use-cases/**/us-*.md` and
  `docs/modules/**/us-*.md`
- Confirmed UC files changed: paths matching `docs/use-cases/**/use-case.md` and
  `docs/modules/**/use-case.md`
- Source files changed: paths under `src/`
- Test files changed: paths under `tests/`

If the git diff returns nothing (branch is identical to main), report that and stop.

Also note the branch name: `git branch --show-current`

---

## Step 1: For each changed confirmed US — run four checks

For every US file in scope, run all four checks before moving to the next US.

---

### Check 1: Scenario count (hard)

Read the US file. Count the number of `### Scenario N:` headings — this is the
declared scenario count.

Find the corresponding behavioral test file. The naming convention is:
`tests/behavioral/{module}/us-{id}-{name}.test.*`

If the test file does not exist: **MISALIGNED** — flag as "no test file found".

If it exists: count the `[S{n}]` blocks (test cases referencing a scenario number).
The counts must match. If not: **MISALIGNED** — list which scenario numbers are
missing from the test file.

---

### Check 2: Reference correctness (hard)

In the behavioral test file, each test case should reference its source US by ID
and scenario number — either in the test name or a comment. Look for patterns like:
`[S1]`, `[S2]`, `US-001`, `Scenario 1`.

For each test case found:

- Does it cite a scenario number? If not: **MISALIGNED** — "test case missing
  scenario reference"
- Does the cited scenario number exist in the US file? If not: **MISALIGNED** —
  "test references scenario N but US only has M scenarios"

---

### Check 3: TBD references (hard)

Scan the confirmed US file (and its UC use-case.md if also changed) for any
remaining `TBD` strings.

If found: **MISALIGNED** — list each TBD reference with the line it appears on.
These should have been resolved or patched during /merge.

---

### Check 4: Behavioral alignment (soft — surface for review)

For each scenario's `Then: the system SHALL ...` clause in the US, find the
corresponding `[SN]` test case assertion. Read both and check whether they appear
to verify the same outcome.

This is a soft check — you cannot mechanically prove behavioral correctness, but
you can flag obvious mismatches:

- US says "SHALL return HTTP 422" but test asserts status 200
- US says "SHALL send a notification" but test has no notification assertion
- US says "SHALL return field X in response" but test never checks field X

Flag these as **PLEASE REVIEW** items, not hard failures. The human decides
whether the mismatch is a real problem or an acceptable implementation detail.

---

## Step 2: Print the report

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
Result: CLEAN / MISALIGNED
```

**CLEAN** — all hard checks pass. Soft items are listed as advisory but do not
block. End with:

```
CLEAN — ready to open PR to main.
```

**MISALIGNED** — one or more hard checks failed. List each failure with its US
path and a clear description of what is wrong. End with:

```
MISALIGNED — do not open PR. Human review required.
```

Do not suggest fixes. Do not create fix plans. Present the findings clearly and stop.

---

## Guardrails

- Never modify any file — this skill reads only
- Never create a fix plan or suggest code changes
- Scope is strictly the changed confirmed docs on this branch — don't check
  unchanged docs from prior features
- Soft (behavioral alignment) findings are advisory only — never elevate them
  to hard failures
- If git diff is unavailable (detached HEAD, etc.), ask the user to specify
  which UCs to check manually
