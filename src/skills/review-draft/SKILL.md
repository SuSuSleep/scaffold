---
name: review-draft
description: >
  Review docs/drafts/ to determine whether business-layer UC and US documents
  are ready to proceed to implementation planning. Use this skill whenever the
  user asks to review drafts, check draft quality, validate scenarios, or wants
  a quality gate before planning or implementation. Strong triggers: "review the
  drafts", "are the drafts ready?", "can we start planning?", "is UC-xxx ready
  to implement?", "validate the scenarios", "check the docs", "review my UC",
  "is the documentation good enough?", or any moment after writing drafts where
  the user wants confidence before moving forward. Always use this skill before
  creating an implementation plan — skipping the review risks planning from
  incomplete or incoherent requirements.
---

# Skill: review-draft

Gate between "drafts are written" and "implementation begins." The goal is to
catch problems in UC and US documents before they become expensive surprises
mid-implementation.

This skill **reports only** — it does not modify documents. When blockers are
found, the user should update the drafts and re-run.

---

## Step 0: Orient

Read the project state so the review can be calibrated to what's actually
knowable right now.

1. Check `docs/modules/` — does it exist with real content?
   → Yes: **established project** — validate module names in Implementation Layer Mapping
   → No: **new project** — treat missing/TBD mappings as suggestions, not warnings

2. Check `docs/use-cases/` — are there confirmed UCs?
   → Yes: collect their IDs so cross-references can be validated
   → No: cross-references to other UCs can stay TBD without penalty

3. Check `docs/adr/` — collect any confirmed ADR IDs

4. Read all UC folders under `docs/drafts/use-cases/` (`uc-{id}-{name}/`). Also note
   any ADR draft files under `docs/drafts/adr/`.

If `docs/drafts/use-cases/` is empty or doesn't exist, report that and stop.

---

## Step 1: Three-pass review for each UC

Run all three passes per UC before moving on.

---

### Pass 1 — Structural completeness

Is the document well-formed? Are required fields present and filled with real
content (not template placeholders like `[Business Goal Name]` or `xxx`)?

**use-case.md:**

| Check | New project | Established project |
|---|---|---|
| Primary Actor present | BLOCKER if missing | BLOCKER if missing |
| Preconditions present | BLOCKER if missing | BLOCKER if missing |
| Main Flow has ≥1 step | BLOCKER if missing | BLOCKER if missing |
| Exception Flows reference real US files | TBD allowed | WARNING if unresolved |
| Implementation Layer Mapping filled | SUGGESTION | WARNING if empty |
| Module names match `docs/modules/` | N/A | WARNING if unknown module named |

**Each us-{id}-*.md:**

| Check | Severity |
|---|---|
| Story — all 4 lines present (As a / When / I want / So that) | BLOCKER |
| At least one test scenario | BLOCKER |
| Scenarios use Given / When / Then structure | BLOCKER |
| At least one happy-path scenario | WARNING |
| At least one exception or failure scenario | SUGGESTION |
| "the system SHALL" phrasing in Then clauses | WARNING |
| Concrete values in Given/When/Then (not vague generics) | WARNING |
| API Contract has at least an endpoint path | WARNING |

**What counts as concrete values:** things like `user_id: "abc-123"`, `amount:
$50.00`, `HTTP 422`. Phrases like "a valid user", "some amount", "certain
conditions" are not concrete — they leave the scenario unverifiable.

---

### Pass 2 — Substance review

Structural checks confirm presence. This pass reads the content and asks:
does it make sense?

**Story ↔ scenario alignment**

Read what the story promises — specifically the "I want" and "So that" lines —
then check whether the test scenarios actually verify that outcome. The most
common failure: the story claims a deliverable (a confirmation number, a
notification, a receipt) that appears in no scenario's Then clause and in no
response field.

Flag: "Story promises X but no scenario verifies X."

**Scenario coverage — obvious missing cases**

Given the domain context (payment, auth, notifications, etc.), are there
failure modes any practitioner would expect to see? Common gaps:

- No external-service failure scenario for flows that call external APIs
- No duplicate/idempotency scenario for flows that create resources
- No "resource not found" scenario for flows that operate on existing records
- No timeout/async failure for operations with eventual consistency

These are suggestions unless the US itself flags idempotency as required — in
which case missing a duplicate scenario becomes a warning.

**Scenario distinctness**

If two scenarios have nearly identical Given/When structure and only differ in
which specific invalid value is used (e.g., "invalid card number" vs "expired
card"), flag it: they may be one scenario with examples rather than two
separate contract points. This is a suggestion — let the user decide.

**API contract ↔ story alignment**

Does the response contract contain what the story promises the caller will
receive? Scan for fields mentioned in the story (confirmation ID, redirect URL,
status, notification flag) that are absent from the Response table.

**UC coherence**

Does every US in this UC describe the same user goal? If a US appears to
address an administrative or system-level action sitting inside a user-facing
UC, flag it as a potential scoping issue — it may belong in its own UC.

---

### Pass 3 — ADR trigger check

For each US, look for design choices embedded in the content that may warrant
an ADR. Apply the three-question test:

```
□ Are multiple implementation options implied or discussed?
□ Does this decision affect more than one module?
□ Would a new team member not understand why this approach was chosen
  just by reading the result?
```

If two or more boxes are checked and no ADR is referenced (and no matching
`adr-draft-*.md` exists in `docs/drafts/`), flag it as a WARNING: "Decision
unrecorded — consider an ADR."

Common places to look for hidden ADR triggers:

- Idempotency / retry strategy described in the Notes section
- Cross-module event vs. direct-call patterns implied in the flow
- Auth approach described inline rather than referenced
- Data ownership or consistency approach between modules

---

## Step 2: ADR drafts (if any)

For each ADR draft file in `docs/drafts/adr/`, run lighter checks:

| Check | Severity |
|---|---|
| Status field set to `Proposed` | WARNING |
| Background section explains the problem | WARNING |
| At least two options considered | SUGGESTION |
| Decision section present with reasoning | WARNING |

---

## Step 3: Plan-together assessment

After reviewing all UCs individually, check whether any should be planned
together rather than independently. Flag this if:

- Two or more UCs name the same module in their Implementation Layer Mapping
- Two or more UCs reference each other or share a sub-flow
- One UC's Main Flow depends on state that only exists after another draft UC completes

This is not a blocker — it's an advisory note before the user creates a plan.
The relevant question is: "If I implement A first, will I need to go back and
change A when I implement B?" If yes, they should be planned together.

---

## Step 4: Output the report

```
Draft review
────────────────────────────────────────────────────
Project: [new / established]   Modules known: [names, or "none yet"]

UC-001: [name]
  Structural  ✓ clean  /  ✗ [n blockers]  [n warnings]
  Substance   ✓ clean  /  ⚠ [n issues]
  ADR check   ✓ not needed  /  ⚠ [finding]
  → READY / BLOCKED / NEEDS REVIEW

[repeat for each UC]
────────────────────────────────────────────────────
Result: N of M UCs ready to plan

BLOCKERS — must resolve before planning
  UC-xxx / file.md — [specific description]

WARNINGS — should resolve
  UC-xxx / file.md — [specific description]

SUGGESTIONS — consider
  UC-xxx / file.md — [specific description]

PLANNING NOTE
  [If UCs should be planned together: which ones and why]
```

**Verdict rules:**

- **BLOCKED** — any BLOCKER finding
- **NEEDS REVIEW** — warnings or substance issues, no blockers
- **READY** — suggestions only, or fully clean

When all UCs are READY, end with: "All drafts look ready — next step is an
implementation plan."

---

## Step 5: Commit on full READY

If every UC reached READY verdict, commit the current state of `docs/drafts/` as a review checkpoint. This matters because it anchors the exact document state that passed review — if any draft is later edited before planning begins, that change is traceable in git.

Stage everything under `docs/drafts/`:

```bash
git add docs/drafts/
```

Commit with a verbose message that names what was reviewed and the outcome:

```
docs(drafts): UC-001 checkout, UC-002 refund reviewed and ready

Reviewed:
  UC-001 checkout      READY  (2 US files — 0 blockers, 1 suggestion)
  UC-002 refund        READY  (1 US file  — 0 blockers, 0 warnings)
  adr-draft-001-retry  READY

All drafts approved for implementation planning.
```

Include each reviewed item as a line, with its verdict and a brief parenthetical summary (file count, blockers, warnings found — or "clean" if nothing). This creates a useful paper trail: a future reader can see at a glance what the review found at this snapshot.

If the result is NEEDS REVIEW or BLOCKED for any UC, do not commit — the drafts are not ready and committing them would imply they are.

Do not push. Commit only.

---

## What this skill does not review

- `docs/use-cases/` — confirmed docs are out of scope
- `docs/modules/` — module-layer docs are out of scope
- Code vs. documentation alignment — that's the pre-merge review
