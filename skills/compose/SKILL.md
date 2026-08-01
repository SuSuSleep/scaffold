---
name: compose
description: >
  Synthesize confirmed module UC docs into a business-layer UC + US draft via a 3-phase interview.
  The "compose" step bridges module-level technical docs to the user-facing business story —
  cross-module flow, actor, goal, failure handling, and test scenarios. Use this skill whenever
  the user says "compose [module-a] and [module-b]", "create a business feature from these modules",
  "write the business UC", "let's put together the user-facing story", "connect these modules",
  "we have enough module docs to compose", or any phrase about creating a business-layer document
  from existing module documentation. Trigger when ≥2 modules have been through /elicit and the
  user wants to describe what the whole flow does from the user's perspective.
---

# /compose

After `/elicit`, each module has a complete technical + business picture — interface, flow,
errors, and who-uses-it-why. The missing piece is the cross-module story: when a user does
something that touches multiple modules, what does *that* look like from their perspective?

Your job is to synthesize those module docs into a single business-layer UC + US draft via a
3-phase interview. The interview answers tell you the user's journey, their goal, and what
they experience when things go wrong between modules.

The outputs go into `docs/drafts/use-cases/` — the business layer. The module docs are not
modified; they're linked from the new business UC via Implementation Layer Mapping.

---

## Step 0: Orient

### 0a. Load schema and rules

- Read `docs/schema/format.md` if it exists — extract section aliases for
  `use-case` and `user-story`. These are the doc-types compose creates.
- Read `docs/schema/workflow-rules.md` if it exists — extract `id-rules` for
  ID assignment in Step 4.
- If either is absent, use the embedded defaults stated inline below.

### 0b. Find the modules to compose

If the user names modules (e.g. "compose auth and payment"), use those names. Otherwise:

- Read `docs/drafts/coverage.md` to find modules with `Scan [x]` and `Module UC [ ]` (confirmed scan, unconfirmed business UC)
- List candidates and ask which to compose together

**Readiness check before proceeding:** Read each module's use-case docs. If any US file still has Story fields that are plain `TBD (...)` (not filled by /elicit), warn the user and ask if they want to proceed anyway or run /elicit first. The compose interview builds on the actor/goal/value from /elicit — it goes faster and better when those fields are already filled.

---

## Step 1: Read the module docs

For each module being composed, read:

- All `use-case.md` files under `docs/drafts/modules/{module}/use-cases/` (or the confirmed path under `docs/modules/`)
- All `us-*.md` files — especially the story section (alias from each file's
  frontmatter, default "Story") and api-contract section (alias from frontmatter;
  shape varies by the doc's `api-type` — e.g., rest, function, event)

Build a mental map:

- What does each module do at its entry point?
- In what order would a user invoke these modules to accomplish something?
- What data flows between them? (e.g. auth returns a token that payment uses)
- What could go wrong at the seams — where does one module hand off to another?

---

## Step 2: Opening summary

Before the interview, show what you've learned:

> I've read **[module-a]** ([entry points]) and **[module-b]** ([entry points]).
>
> Based on the module docs, here's the likely user journey:
> [1-2 sentence narrative from your read of the flows]
>
> I'll ask three sets of questions to confirm the journey, identify the user, and figure out what happens at the cross-module seams. Ready?

---

## Step 3: Three-phase interview

One phase per turn. Write answers to files immediately after each phase.

### Phase 1 — Journey boundary

> **Q1:** Which of these module flows chain together to form one complete action from the user's perspective? (Are there any that should be excluded from this composition?)
>
> **Q2:** Walk me through what the user experiences start to finish — ignoring module internals. What do they do, what do they see, what changes?

**Write Phase 1 notes** to a scratch block — you'll use these to build the Business UC Main Flow.

### Phase 2 — Actor and goal

> **Q3:** Who is the primary person doing this? Give them a role name (e.g. "Registered customer", "Admin user", "Fulfillment service").
>
> **Q4:** What does success look like to them — what have they achieved when this flow ends?

**Write Phase 2 answers** to the UC actor section (alias from format.md, default
"Primary Actor") and US story section (default "Story"). Derive the expected-behavior
section (default "Expected Behavior") from Q3+Q4.

### Phase 3 — Cross-module failure, relationships, and rules

> **Q5:** If **[module-a]** succeeds but **[module-b]** fails mid-flow — what does the user experience? Error message, silent retry, or rollback?
>
> (Ask once per module handoff point — e.g. if there are 3 modules and 2 handoffs, ask twice.)
>
> **Q6:** Does starting this flow require anything to be true first? (e.g. account already created, item in stock, prior step completed)
>
> **Q7:** Does completing this flow trigger anything else downstream? (e.g. email sent, record created that feeds a later flow)
>
> **Q8:** Here are the business rules I see in the contributing modules:
>
> [list each module's `business-rules` bullets, grouped by module]
>
> Are there any **cross-module** rules that don't belong to any single module — things like "no module may proceed if the user is suspended" or "the whole flow is rate-limited to 5/min per account"? List any new rules; otherwise say "no, the module rules cover it".

Q6 → Business UC related section (alias `related`, default "Related Use Cases") → Prerequisite
Q7 → Business UC related section → Follow-up
Q8 → Business UC business-rules section: union of (each module's business-rules) + (new cross-module rules from Q8). See Step 5.

---

## Step 4: Assign IDs

Apply `id-rules` from `workflow-rules.md` (default: highest + 1, no gaps,
shared namespace across drafts and confirmed). Scan `docs/drafts/use-cases/`,
`docs/use-cases/`, and `docs/drafts/modules/` for the highest existing UC/US ID.

Example: if the highest existing ID is UC-002 across all docs, the new business UC is UC-003.

---

## Step 5: Write business UC + US

Use the `use-case` and `user-story` doc-types from `docs/schema/format.md`.
Compose writes at the **project layer**, so include `implemented-by` on the UC
and omit `serves` on both UC and US.

Prepend frontmatter to each file (schema, schema-version, doc-type, id,
sections, and `api-type` on the US — typically `rest` for HTTP-fronted business
flows; pick from format.md's Interface Contract Variants based on what the contributing
modules expose at the user-facing entry point). Set `schema-version` per the
"Schema versioning" section in `skills/init/references/format.md` (use the
project's `docs/schema/format.md` version if present; otherwise 0). Then write
the body using format.md's `## use-case Template` and `## user-story Template`
(with the api-type-matching variant for the Interface Contract section).

Two files go under: `docs/drafts/use-cases/uc-{N}-{slugified-name}/`

**Business UC (`use-case.md`)** — populate the schema sections using:

- UC title: a user-goal phrase (not a technical name) — e.g. "Complete Checkout"
- actor section: from Q3
- preconditions: from Q6, plus any technical preconditions from module docs
- business-rules: deduplicated union of (each contributing module's
  business-rules, filled by `/elicit`) **+** any new cross-module rules from
  Q8. Group module-owned rules under a `From {module}:` sub-bullet and
  cross-module rules under `Cross-module:`. If a module still has TBD in its
  business-rules, mark the business UC's entry for that module
  `TBD (pending /elicit on {module})`.
- postconditions: composed from module postconditions
- flow section: numbered steps across modules at the user-experience level
  (not implementation). Reference module entry points where they occur.
  Derive from Q2 + module flows.
- exceptions section: one per cross-module failure point from Q5. Reference the relevant US.
- related section: Q6 → Prerequisite, Q7 → Follow-up
- implemented-by section: one line per module → its confirmed UC path

**Business US (`us-{N}-{name}.md`)** — populate the schema sections using:

- story section: Actor from Q3, Trigger from Q2, Goal from Q4, Value: what breaks if this flow disappears
- expected-behavior section: 2-3 sentence plain-English narrative from Q2+Q4
- api-contract section: The primary user-facing entry point. If the flow has multiple
  user-facing endpoints, list them in order with a brief role for each (table form
  with Step | Method | Path | Role columns is fine when there are multiple).
- scenarios section:
  - **Scenario 1**: happy path — composed from the successful completion of all modules in sequence
  - **Scenario 2..N**: one per cross-module failure point from Q5 answers. For each: the `Then` clause uses the exact user experience the user described in Q5.
  - Keep Given/When/Then bodies as skeleton TBD — they'll be filled by /review-draft → /apply

---

## Step 6: Update coverage.md

After writing the files, update `docs/drafts/coverage.md`:

- For each contributing module row, mark `Business UC [x]`
- Add a Notes entry pointing to the new UC: `→ UC-{N} {name}`

---

## Step 7: Summary

```
## Compose Complete

### Created
- docs/drafts/use-cases/uc-{N}-{name}/use-case.md
- docs/drafts/use-cases/uc-{N}-{name}/us-{N}-{name}.md

### Contributing modules
- {module-a} → UC-{id} {entry-point}
- {module-b} → UC-{id} {entry-point}

### Test scenarios
- Scenario 1: {happy path name}
- Scenario 2: {cross-module failure description}

### Coverage updated
- {module-a}: Business UC [x]
- {module-b}: Business UC [x]

Ready for /review-draft
```

---

## Edge cases

**Module docs still have TBD Story fields:** Warn the user and ask — if they want to proceed anyway, use whatever is filled and note the gaps in the business US.

**Three or more modules:** Phases 1-2 work the same. Phase 3 Q5 gets asked once per handoff seam (A→B and B→C separately). The Implementation Layer Mapping lists all modules.

**Notification or background service module:** If one of the modules is internal (called by another module, never directly by the user), it still contributes to the business flow but is not the user's entry point. Frame the Main Flow steps from the user's perspective ("the system sends a confirmation") rather than exposing the internal call.

**Only one module named:** Tell the user that compose needs at least two module docs. Ask which other module should join — or suggest which modules in coverage.md might pair well based on cross-module dependency notes.

---

## References

Templates: `docs/schema/format.md` (or `skills/init/references/format.md` for defaults)

- `## use-case Template` — Business UC body
- `## user-story Template` — Business US body
