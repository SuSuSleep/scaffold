---
name: apply
description: >
  Implement an implementation plan by writing code, behavioral tests, and
  implementation quality tests. Use this skill whenever the user wants to
  start implementing a plan, says "apply the plan", "implement plan-xxx",
  "let's start coding", "continue implementation", or "resume where we left
  off". Also use when the user says "run the apply skill", "implement the
  batches", or "work through the plan tasks". Always reads the plan file
  first — this skill assumes a plan under docs/drafts/plans/ already exists.
  Can resume mid-plan if some checkboxes are already checked.
---

# Skill: apply

Execute an implementation plan batch by batch: write code, write behavioral
tests, write implementation quality tests, and mark each task `[x]` when all
three pass. The plan's checkboxes are the state machine — a `[ ]` means not
done, an `[x]` means done. If you stop halfway, re-running `apply` resumes
from the first `[ ]`.

---

## Step 0: Orient

### 0a. Find the plan

If the user named a plan (e.g. "apply plan-002"), use it. Otherwise:

- Glob `docs/drafts/plans/plan-*.md`
- If exactly one exists, use it and announce it
- If multiple exist, list them and ask which to use

Read the plan file in full. Note:

- Every `- [ ]` item is pending
- Every `- [x]` item is already done
- The first `- [ ]` is your resume point
- The Final Batch is the last named batch — treat it specially (see Step 3)

If all items are `[x]`, the plan is complete — announce this and suggest `/merge`.

### 0b. Read context

Read these files before writing a single line of code:

1. The plan file itself (already done in 0a)
2. Each module US file referenced by pending tasks:
   - Look for the module UC/US in `docs/drafts/modules/{module}/use-cases/`
   - If not found there, try `docs/modules/{module}/use-cases/`
3. `docs/overview/test-strategy.md` if it exists — this tells you which test
   tools and directories the project uses

### 0c. Discover the test command

You need to know how to run tests before you can verify anything.

1. Check `docs/overview/test-strategy.md` — if it names tools (Jest, Vitest,
   pytest, etc.), use those
2. If not there, look for `package.json`, `pyproject.toml`, `Makefile`, or
   similar — infer the test command
3. If still unclear, ask the user: "What command runs the behavioral tests?"

Announce: "Using change: `{plan-name}`". Note the test command you found.

---

## Step 1: Regular batch loop

Work through each non-Final batch sequentially. Do not start a batch until
the previous one is complete. "Parallel with Batch N" in the plan is
informational — still run them sequentially.

For each pending `- [ ]` item in the current batch:

### 1a. Implement

Write the code. Keep changes minimal and scoped to what the task describes.
Follow `CONVENTIONS.md` for file naming, structure, and style.

- New files: follow `src/{module}/` structure
- Modified files: change only what the task requires
- If the affected file has `[proposed]` in the plan, create it now (no
  `[proposed]` marker goes into actual file paths — that was the plan's
  notation, not a real path component)

### 1b. Write behavioral tests

Write or update the behavioral test file for this US.

Rules from CONVENTIONS.md:

- One test file per US, placed in `tests/behavioral/{module}/`
- File named to match the US file (e.g. `us-001-payment-fail.test.ts`)
- Outer block: `describe "US-{id}: {feature name}"`
- Each scenario: `it "[S{n}] {scenario name} → {expected outcome}"`
- Every test references its source US and scenario number
- Never change an existing behavioral test unless the US scenario itself changed

Write tests for all scenarios in this US that belong to this batch's tasks.

### 1c. Run tests — 3-attempt rule

Run the test command. If tests pass: continue to 1d.

If tests fail:

- Read the error output carefully
- Fix the issue — this might be in implementation code or test setup
- Run again

After 3 failed attempts on the same task: stop. Leave the checkbox `[ ]`
unchecked. Report what failed and why. Wait for guidance.

Do not guess at failures after 3 attempts — the issue may be systemic
(missing dependency, wrong test setup, interface mismatch with another module).

### 1d. Quality test assessment

Before writing quality tests, assess whether they're easy or hard to plan:

**Easy**: the implementation has clear internal branches, error paths, and
boundary values that can be tested independently of the full scenario flow.

**Hard / refactoring signal**: if planning quality tests feels difficult
because the code has too many branches, deeply nested conditions, or tightly
coupled logic — this is a signal the code needs refactoring, not that quality
tests should be skipped.

**If refactoring signal triggered:**

Report it clearly:

```
Refactoring signal: [reason — e.g. "payment.service.ts has 6 nested conditions
that would require 15+ mock combinations to test independently"]

Refactoring under behavioral test protection now.
```

Refactor the implementation while keeping all behavioral tests green. Then
re-assess quality tests. Continue — do not stop or ask for permission.

### 1e. Write implementation quality tests

Write tests in `tests/implementation/{module}/`. These cover:

- Internal branches not covered by scenario-level behavioral tests
- Error handler paths
- State transitions
- Boundary values

These tests do NOT reference US or scenario numbers. They can be freely
changed during future refactoring. No documentation update required.

Run them. Apply the same 3-attempt rule as in 1c.

### 1f. Mark done

Once implementation + behavioral tests + quality tests all pass:

Update the plan file: change `- [ ]` to `- [x]` for this task.

Continue to the next `- [ ]` item in the current batch.

---

## Step 2: Announce batch completion

When all items in a regular batch are `[x]`:

```
Batch N complete — M/T tasks done overall.
```

Then begin the next batch (Step 1 again), or proceed to Step 3 if the only
remaining batch is the Final Batch.

---

## Step 3: Final Batch

The Final Batch is different from regular batches. It runs ALL scenarios
together — new ones from this plan plus existing ones from every touched
module — to verify nothing regressed.

### 3a. Collect all scenarios to verify

From the plan's Final Batch section, read the two sub-lists:

1. **New scenarios (this plan)** — all the `- [ ]` items listed under "New scenarios"
2. **Existing scenarios of touched modules** — listed under "Existing scenarios"

If the plan says "No existing scenarios — module is greenfield" for a module,
skip that module's existing scenarios.

For each existing scenario listed, find its behavioral test and confirm it
exists in `tests/behavioral/{module}/`.

### 3b. Run the full test suite

Run all behavioral tests at once (not just the new ones). This is the
integration verification — it must be fully green before you can say the plan
is done.

### 3c. If all green

Mark every Final Batch item `[x]`. Then commit everything before announcing completion.

**Stage the files changed by this plan.** The plan's Affected Files section is the authoritative list — use it, not a hardcoded `src/` or `tests/` glob. The implementation may have touched CI/CD configs, infra files, scripts, or other paths outside the typical source tree. Stage each listed path (stripping the `[proposed]` marker if present, since that was just planning notation). Also stage the plan file itself — it now has all `[x]` and represents the completed unit of work.

```bash
git add docs/drafts/plans/{plan-name}.md
# then add each path from the plan's Affected Files section
# e.g.:
git add src/payment-module/ tests/behavioral/payment-module/ tests/implementation/payment-module/
# Do NOT use git add . or git add -A
```

Commit with a verbose message that names the modules and lists what was implemented:

```
feat(payment-module): implement UC-001 checkout

Plan: plan-001-checkout.md
Implemented:
  src/payment-module/payment.service.ts       (new)
  tests/behavioral/payment-module/us-001-payment.test.ts  (new)
  tests/implementation/payment-module/payment.quality.test.ts  (new)

Behavioral tests:  4/4 ✓
Quality tests:     6/6 ✓
```

For multi-module plans, list all modules in the parentheses and all implemented files:

```
feat(payment-module, notification-module): implement UC-001 checkout, UC-002 notify
```

Do not push. Commit only.

Announce:

```
## Implementation Complete

Plan:     {plan-name}
Commit:   {short hash} — {commit message first line}
Progress: {total}/{total} tasks complete ✓

### Completed this session
[list of newly checked tasks]

All tasks complete. Ready for /merge.
```

### 3d. If any test fails

This is not a regular fix — it means something regressed or the integration
revealed a design gap. Do NOT keep trying to fix it inline.

Instead:

1. Leave the failing Final Batch item(s) as `[ ]`
2. Create a fix plan in `docs/drafts/plans/` using this template:

```markdown
# Plan-{id}: Fix [description of regression]

## Root Cause

Which plan's verification surfaced this, which test failed, and why.

## Goals

- (Specific fix — maps to the failing scenario)

## Non-Goals

- (What will not change — keeps scope minimal)

## Scope

- US-{id} → Scenario {n}

## Affected Files

- Modify: src/{module}/

## Implementation Batches

### Batch 1: Fix [description]

- [ ] US-{id} Scenario {n}: [scenario name]

### Final Batch: Integration Verification

#### Fixed scenarios

- [ ] US-{id} Scenario {n}: [scenario name]

#### Full regression check

- [ ] US-{id} Scenario {n}: [existing scenario]
- [ ] (all other scenarios from the original plan)
```

3. Announce:

```
## Implementation Paused — Final Batch Failed

Plan:    {plan-name}
Failed:  {scenario name}
Cause:   {brief root cause}

Fix plan created: docs/drafts/plans/{fix-plan-name}.md

Run /apply on the fix plan to continue.
```

Then stop. The fix plan becomes the new unit of work.

---

## Output format during implementation

```
## Applying: {plan-name}

### Batch 1: {batch name}

Task 1/{total}: US-001 Scenario 1: Valid payment creates a transaction
  → Implementing src/payment-module/payment.service.ts
  → Writing tests/behavioral/payment-module/us-001-payment.test.ts
  → Tests: ✓ (3/3 passed)
  → Quality tests: ✓
  ✓ Done

Task 2/{total}: US-001 Scenario 2: Invalid card number
  → ...
  ✓ Done

Batch 1 complete — 2/{total} tasks done.

### Batch 2: {batch name}
...
```

---

## Guardrails

- Always read context files (plan + module US docs) before writing any code
- Sequential batches only — never skip ahead, even if the plan marks them parallel
- Behavioral tests are the contract — never change them unless the US scenario changed
- 3-attempt rule: after 3 failures on the same task, stop and report — don't guess
- Refactoring signal: surface and continue, do not stop
- Final Batch failure: create fix plan and stop — do not try inline fixes
- Mark `[x]` only after code + behavioral tests + quality tests all pass
- Use `[proposed]` paths from the plan as real paths without the `[proposed]` marker
- Keep code changes minimal and scoped to each task
- Stage only the specific paths from the plan's Affected Files — never `git add .` or `git add -A`
- Never push — local commit only
