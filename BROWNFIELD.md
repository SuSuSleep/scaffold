# Brownfield Documentation Retrofit

> How to add documentation to an existing codebase from scratch.
> For new projects, follow the greenfield workflow in [GUIDELINE.md](GUIDELINE.md).
> Doc structure, templates, and maintenance rules are in [GUIDELINE.md Sections 1–7](GUIDELINE.md).

---

## How brownfield differs from greenfield

```
Greenfield:  requirements → docs → code
Brownfield:  code → infer → elicit → docs
```

The key challenge is that code tells you **what** a module does but rarely **why** it exists or
**who** it serves. The workflow separates these two sources of truth:

- High-inferrability fields (interface, flow, errors, data shapes) → derived from code via `/scan-deep`
- Low-inferrability fields (actor, goal, business value) → filled in via `/elicit`

Because a full codebase is too large for one pass, the workflow is iterative:
one loop per module, business-layer UC/US composed once enough module docs exist.

---

## 1. The Coverage File

**Location:** `docs/drafts/coverage.md`

The coverage file is the brownfield equivalent of a plan's checkboxes — it tracks
documentation status per module and serves as resume state across loops.

```markdown
# Documentation Coverage

| Module       | Source path         | Scan | Module UC | Business UC | Notes |
| ------------ | ------------------- | ---- | --------- | ----------- | ----- |
| auth         | src/auth/           | [ ]  | [ ]       | [ ]         |       |
| payment      | src/payment/        | [ ]  | [ ]       | [ ]         |       |
| notification | src/notification/   | [ ]  | [ ]       | [ ]         |       |
```

Column meanings:

| Column | Checked when |
| ------ | ------------ |
| Scan | Module code read; module UC draft produced with all inferrable fields filled |
| Module UC | Module UC draft reviewed (review-draft READY) and promoted to confirmed |
| Business UC | Business-layer UC/US composed, reviewed, and promoted — for this module's contribution |

Each loop starts from the first row with an empty `Scan` checkbox.
When all rows are `[x]`, run `/verify` for full alignment.

`/elicit` is idempotent — if a loop is interrupted before /elicit finishes, re-running it
will simply confirm already-filled fields and fill in the remaining TBDs. No extra column needed.

The **Notes** column captures brief observations during `/scan-all` and is updated throughout
loops. Examples: `no tests found`, `depends on Stripe API`, `single-file module — likely utility`,
`called by auth and payment`.

---

## 2. Conventions

### Module boundary

A module is any **direct subdirectory of `src/`**. Nested directories within a module
(e.g. `src/payment/handlers/`) are part of that module — not separate modules. Treat
each `src/` subdirectory as a self-contained mini-project with its own responsibility
boundary.

If the project has no `src/` directory, ask the user which directory holds module code
before running `/scan-all`.

### UC decomposition within a module

`/scan-deep` creates **one UC per distinct entry point** in a module. An entry point is
a route handler, exported function, event listener, or CLI command that represents a
distinct user goal. A module with login, token refresh, and password reset as separate
routes produces three UCs — one for each.

If two entry points serve the same user goal (e.g. GET and DELETE on the same resource),
group them under one UC with multiple USs rather than separate UCs.

The coverage file tracks progress at module level (one row per `src/` subdirectory),
not at UC level. The `Scan` checkbox means all UCs for that module have been produced
as drafts.

### Module US template

Module US documents use the **Business US detailed template** from GUIDELINE.md §6.
Store them at `docs/drafts/modules/{module}/use-cases/uc-xxx/us-xxx.md`.
Story fields (actor, trigger, goal, value) are TBD until `/elicit`. API Contract fields
are inferred from code at `/scan-deep` time.

### UC and US ID scheme

Module UC/US documents share the same ID namespace as business-layer UC/US.
Follow the same rule as `/draft`: scan `docs/drafts/`, `docs/use-cases/`, and
`docs/modules/` across all layers to find the highest existing ID, then increment by 1.
Do not fill gaps. The first module UC written in a fresh project becomes UC-001.

---

## 3. Inferability Guide

Use this to decide which fields to fill from code and which to leave as `TBD` for `/elicit`.

| Field | Inferrability | Source | Confirmed in |
| ----- | ------------- | ------ | ------------ |
| Module boundary | High | Directory structure, package names | /scan-all |
| Interface contract | High | Function signatures, return types, exports | /scan-deep |
| Main flow | High | Core function body, call sequence | /scan-deep |
| Error cases | High | try/catch, error status codes, guard clauses | /scan-deep |
| Data shapes | High | Types, interfaces, schemas, models | /scan-deep |
| UC relationships | Medium | Import graph, cross-module calls | /scan-deep (TBD until related loops complete) |
| Actor (who uses this) | Low | Route names hint — always confirm | /elicit |
| Goal (what they want) | Low | Cannot reliably infer — ask | /elicit |
| Business value (why) | None | Must elicit from product owner or engineer | /elicit |

**The rule:** fill all High fields from code alone. Mark Low/None fields as `TBD` with a
guiding question in parentheses, e.g. `TBD (what does the user want to achieve here?)`.

> **Note — Module UC `Source` field:** The template says "Derived from business layer."
> In brownfield, the business layer doesn't exist yet when module docs are written.
> Leave `Source` as `TBD (will be linked after /compose)` and back-fill it once
> `/compose` produces the business UC.

---

## 4. The Loop

One loop covers one module. Loops repeat until the coverage file is fully checked.

```
Per-module loop
──────────────────────────────────────────────────────────────────────────
1. /scan-deep    read module code → show a 3-line scan summary + ask 2 questions
                 → then produce module UC draft:
                    High fields filled from code
                    Low fields as TBD with guiding questions
                    TBD references to related undocumented modules expected
                 See Elicitation Guides §/scan-deep for the confirm questions

2. /elicit       4-phase interview → fill TBD fields (actor, goal, value, flow)
                 resolve or explicitly defer TBD references to later loops
                 See Elicitation Guides §/elicit for the question series

3. /review-draft quality gate — same checks as greenfield
                 READY → proceed   NEEDS REVIEW → revise   BLOCKED → escalate

4. /merge        promote module UC draft → docs/modules/{module}/use-cases/
                 mark coverage file: Scan [x], Module UC [x]

5. /compose      once ≥2 confirmed module UCs describe a complete user flow:
                 3-phase synthesis → business-layer UC + US draft
                 → /review-draft → /merge → mark coverage file: Business UC [x]
                 See Elicitation Guides §/compose for the question series
──────────────────────────────────────────────────────────────────────────
Repeat from step 1 for the next unchecked module in coverage.md
When all rows [x]: run /verify
```

TBD references in early loops naturally point to later loops — they are the system
working as intended. They resolve as loops complete; don't try to resolve them early.

---

## 5. Field Confirmation per Step

Which document fields each step produces.

### /scan-all

Produces two outputs:

1. **`docs/drafts/coverage.md`** — one row per `src/` subdirectory, all checkboxes empty, Notes blank
2. **`docs/overview/architecture.md` Module Overview table** — pre-populated with one row per module,
   Responsibility set to `TBD (fill in after /scan-deep)`

```
| Module       | Responsibility                    |
| ------------ | --------------------------------- |
| auth         | TBD (fill in after /scan-deep)    |
| payment      | TBD (fill in after /scan-deep)    |
```

Responsibility fields are filled in when each module loop completes at `/merge`.

### /scan-deep

Produces one **Module UC + Module US draft per distinct entry point** (High fields from code only).
A module with three entry points produces three UC+US pairs.

| Document | Fields confirmed from code |
| -------- | -------------------------- |
| Module UC | Trigger, Preconditions (technical), Postconditions, Main Flow, Exception Flows (code-level), Interface: Accepts, Interface: Emits |
| Module US | API Endpoint, Request fields, Response fields, Error codes, Test Scenario structure (skeleton) |

Left as TBD (needs /elicit):

| Document | Fields deferred |
| -------- | --------------- |
| Module UC | Name (business), Preconditions (business), Source, Exception flow names, UC relationships |
| Module US | Story: Actor / Trigger / Goal / Value, Expected Behavior, Scenario names |

### /elicit

Fills TBD fields via conversation. Runs once per module — covers all UC+US pairs produced
by `/scan-deep` for that module in a single interview session.

| Document | Fields confirmed |
| -------- | ---------------- |
| Module UC | Name (business-meaningful), Preconditions (business rules), Exception flow names |
| Module US | Story: Actor, Trigger, Goal, Value (So that), Expected Behavior, Scenario names |

### /compose

Composes business-layer documents from confirmed module docs. The user names which modules
to compose (e.g. "compose auth and payment"). If no modules are named, the skill reads
all coverage.md rows with Module UC [x] but Business UC [ ], proposes groupings based on
cross-module call references in the docs, and asks for confirmation.

| Document | Fields confirmed |
| -------- | ---------------- |
| Business UC | Name, Primary Actor, Preconditions (combined), Postconditions (combined), Main Flow (cross-module), Exception Flows, Related Use Cases (Prerequisite / Follow-up), Implementation Layer Mapping |
| Business US | Story (assembled from elicitation), Expected Behavior, API Contract, Test Scenarios (cross-module) |

**Test scenario synthesis rule:**

- **Happy path scenario** — composed from all contributing module main flows, framed in the
  actor's goal/value language from `/elicit`
- **Exception scenarios** — one scenario per cross-module failure point surfaced in `/compose`
  Phase 3 Q5; the interview answer directly writes the `Then` clause
- Count: 1 happy path + N exception scenarios (N = distinct failure points from Q5)

---

## 6. Elicitation Guides

Question scripts for steps that require human input. Ask in phases — present the draft
first, then one phase at a time. Never dump all questions at once.

### /scan-deep — 2-question confirm (before writing the draft)

After reading the module code, show a 3-line summary then ask:

> **Q1:** "I read this module as: `[inferred one-liner]`. Is that accurate, or should I reframe it?"
>
> **Q2:** "I see calls to `[module-X]` and `[external-service]`. Should I treat those as this module's responsibility, or does a higher-level orchestrator own that interaction?"

Then produce the full draft. These two questions catch a wrong assumption before it
cascades through the entire document.

---

### /elicit — 4-phase interview

Present the module UC draft first, then ask phase by phase. Wait for each answer.

**Phase 1: Actor** (anchor the who)
> **Q1:** "Who primarily interacts with this module — an end user, an API caller, an internal service, or an automated process?"
>
> **Q2:** "Do they trigger this on demand, or does it run automatically on a schedule or event?"

**Phase 2: Goal and value** (the most important — never skip)
> **Q3:** "Finish this sentence: 'This module exists so that [who] can [do what].'"
>
> **Q4:** "If this module disappeared overnight, what would stop working for the user?"

**Phase 3: Flow validation**
> **Q5:** "I inferred this main flow:
>
> 1. [step from code]
> 2. [step from code]
> 3. [step from code]
>
> Is the sequence right? What's missing or misordered?"
>
> **Q6:** "Are there business rules that should apply here but aren't enforced in the code yet?"

**Phase 4: Exception framing**
> **Q7:** "I found these error cases: `[list from code]`.
> From the user's perspective — which are recoverable (they can retry or fix something)
> and which are dead ends (contact support)?"

---

### /compose — 3-phase synthesis

List the confirmed module UCs being composed, then ask phase by phase.

**Phase 1: Journey boundary**
> **Q1:** "Which of these module flows chain together to form one complete action from the user's perspective?"
>
> **Q2:** "Walk me through what the user experiences start to finish, ignoring module internals."

**Phase 2: Actor and goal**
> **Q3:** "Who is the primary person doing this? Give them a role name."
>
> **Q4:** "What does success look like to them — what have they achieved when this flow ends?"

**Phase 3: Cross-module failure and relationships**
> **Q5:** "If `[module A]` succeeds but `[module B]` fails mid-flow — what does the user experience? Error message, silent retry, or rollback?"
>
> **Q6:** "Does starting this flow require anything to be true first? (Account created, record pre-existing, permissions granted?)"
>
> **Q7:** "Does completing this flow trigger anything else? (Email sent, record created that feeds a later flow?)"

Q6 and Q7 directly populate Business UC `Related Use Cases` → Prerequisite / Follow-up fields.

---

## 7. Bootstrap (run once before first loop)

```
Bootstrap
──────────────────────────────────────────────────────────────────────────
1. /init        create doc structure: AGENTS.md, CLAUDE.md, README.md,
                CONVENTIONS.md, docs/overview/, .gitignore
                (same as greenfield — run the interview, fill in what you know)

2. /scan-all    scan src/ subdirectories → produce docs/drafts/coverage.md
                (one row per module, all checkboxes empty)
                + pre-populate architecture.md Module Overview table
                (one row per module, Responsibility = TBD)
──────────────────────────────────────────────────────────────────────────
Then start the first loop.
```

---

## 8. When to Compose

Don't wait for all modules. Compose as soon as you have enough module docs to describe
a coherent user-facing flow.

```
Keep looping when:                    Compose when:
──────────────────────────────────    ──────────────────────────────────────────
Module UC draft incomplete            ≥2 confirmed module UCs cover one user flow
TBD fields not yet resolved           Actor and goal are both known
review-draft not yet READY            No critical TBD reference blocks the story
```

---

## 9. AI Collaboration Workflows

### Scenario B-0: Bootstrap an undocumented project

```
Input:  Existing codebase — no AGENTS.md, no docs/, no coverage file
Output: AGENTS.md, CLAUDE.md, README.md, CONVENTIONS.md
        docs/overview/ (architecture, test-strategy, glossary, api-spec if HTTP)
        docs/drafts/coverage.md — one row per src/ subdirectory, all checkboxes empty
        docs/overview/architecture.md Module Overview — one row per module, Responsibility TBD
→ Skills: /init, /scan-all
```

### Scenario B-1: Scan one module

```
Input:  Module path (first unchecked Scan row in coverage.md)
Output: 3-line scan summary + 2 confirm questions answered
        docs/drafts/modules/{module}/use-cases/ — one UC + US pair per entry point:
          uc-{id}-{name}/use-case.md   High fields filled; Low fields TBD
          uc-{id}-{name}/us-{id}-{name}.md   API contract filled; Story TBD
          TBD references to related undocumented modules in both files
→ Skill: /scan-deep
```

### Scenario B-2: Fill in what code can't tell you

```
Input:  Module UC draft with TBD placeholders
Output: Actor, goal, business value, exception framing filled in
        TBD references resolved or explicitly deferred to a named later loop
→ Skill: /elicit
```

### Scenario B-3: Review the module draft

```
Input:  Completed module UC draft (all TBDs resolved or deferred)
Output: Review report — READY / NEEDS REVIEW / BLOCKED
        Same structural and substance checks as greenfield /review-draft
→ Skill: /review-draft
```

### Scenario B-4: Merge module UC

```
Input:  Module UC draft with review-draft READY
Output: Module UC promoted to docs/modules/{module}/use-cases/
        coverage.md updated: Scan [x], Module UC [x]
→ Skill: /merge
```

### Scenario B-5: Compose business-layer UC/US

```
Input:  Two or more confirmed module UCs covering a user-facing flow
        User names the modules to compose (e.g. "compose auth and payment")
        If unspecified: skill proposes groupings from coverage.md and asks to confirm
Output: Business-layer UC + US draft under docs/drafts/use-cases/
        Cross-module actor/goal/flow documented
        Module-layer implementation mapping filled in
        Test Scenarios: 1 happy path + N exception scenarios from Phase 3 interview
→ Skill: /compose
→ Then: /review-draft → /merge to confirm business UC
        coverage.md: Business UC [x] for all contributing modules
```

### Scenario B-6: Full alignment check

```
Input:  All rows in coverage.md fully checked
Output: Three-way alignment report: confirmed docs ↔ tests ↔ code
        Same hard/soft checks as greenfield /verify
→ Skill: /verify
```

---

## 10. Relationship to GUIDELINE.md

The brownfield workflow produces the same doc structure as greenfield.
Refer to GUIDELINE.md for anything not covered here.

| Topic | Where to look |
| ----- | ------------- |
| Directory structure | GUIDELINE.md §1 |
| Two-layer document model | GUIDELINE.md §2 |
| Drafts workflow and promotion rules | GUIDELINE.md §3 |
| All document templates (UC, US, ADR, Plan) | GUIDELINE.md §4 |
| Maintenance principles | GUIDELINE.md §5 |
| ADR trigger rules | GUIDELINE.md §7 |
| Brownfield workflow | This file |
