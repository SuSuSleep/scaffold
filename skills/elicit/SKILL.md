---
name: elicit
description: >
  Fill the TBD business-context fields left by /scan-deep in module UC and US drafts.
  Runs a 4-phase structured interview (Actor, Goal/Value, Flow validation, Exception framing)
  to capture what code can't tell you: who uses the module, why it exists, and how users
  experience errors. Use this skill whenever the user says "elicit [module]",
  "fill in the TBDs for [module]", "let's do the business context", "answer the questions
  in the [module] docs", "what questions do I need to answer", or any phrase suggesting
  they want to populate TBD placeholders in module documentation. Always trigger after
  /scan-deep has been run and the user is ready to add human context.
---

# /elicit

After `/scan-deep`, module docs have two layers:

- **Filled** — everything the code tells you: interface, flow, errors, data shapes
- **TBD** — everything code can't tell you: who uses this, why they care, what errors mean to them

Your job is to fill the TBD layer through a focused interview — four phases, one turn each. The answers turn technical scaffolding into documentation a product person can actually read.

---

## Step 0: Find the target module

If the user names a module (e.g. "elicit auth"), use it. Otherwise:

- Glob `docs/drafts/modules/*/` to list available modules
- Find those that still contain TBD placeholders
- If more than one, list them and ask which to start with

Read the coverage file at `docs/drafts/coverage.md` if present — it may tell you the intended order.

---

## Step 1: Read the draft files

Read every file under `docs/drafts/modules/{module}/use-cases/`:

- All `use-case.md` files — note the UC names, main flows, error cases, and any TBD fields
- All `us-*.md` files — note which US files exist, what entry points they cover, and what TBDs remain

Take note of:

- How many UCs/US pairs exist (determines whether to ask actor questions per-US or once for the module)
- What the technical interface looks like (informs better questions — e.g., if a function is clearly called from within the app rather than by a user directly, you can suggest that as the actor)
- Which exception names are already from code vs still generic

---

## Step 2: Opening summary

Before the interview, show a brief orientation so the user knows what to expect:

> I've read the **[module]** module — [N] entry point(s): [list UC names].
>
> I'll ask four short sets of questions. The answers fill in the "who/why/what it means" layer that the code couldn't tell me. Each set takes about a minute. Ready?

If the user says yes or just responds, proceed to Phase 1.

---

## Step 3: Four-phase interview

One phase per turn. Ask the questions, wait for the user's response, write the answers to files immediately, then move to the next phase. Don't bundle phases together.

### Phase 1 — Actor (anchor the who)

Ask these two questions together:

> **Q1:** Who primarily interacts with this module — an end user, an API caller, an internal service, or an automated process?
>
> **Q2:** Do they trigger this on demand, or does it run automatically on a schedule or event?

**If the module has multiple UCs with potentially different actors**, add:
> *(If the answer differs between [UC-A] and [UC-B], tell me separately.)*

**Write Phase 1 answers immediately to files:**

- `Story` → `As a **[Q1 answer]**` and `When **[Q2 answer]**`
- Remove the hint text in parentheses — write the plain answer

### Phase 2 — Goal and value (never skip)

Show a draft of what you're about to fill in, based on the technical context you already know, then ask for confirmation or correction:

> **Q3:** Finish this sentence — *"This [entry point] exists so that [Q1 answer] can ______."*
>
> **Q4:** If this [entry point] disappeared overnight, what would stop working for the user?

After getting answers, derive the `Expected Behavior` as well: a 2–3 sentence plain-English description of what the feature does and why it matters. Draft it yourself from Q3+Q4 and the code context, present it to the user for confirmation, and adjust if needed.

**Write Phase 2 answers immediately:**

- `Story` → `I want **[Q3 answer]**` and `So that **[Q4 answer]**`
- `Expected Behavior` → Replace `TBD (fill in after /elicit)` with the confirmed plain-English description

### Phase 3 — Flow validation

Show the main flow steps you inferred from the code, then ask:

> **Q5:** I inferred this main flow:
>
> 1. [step from code]
> 2. [step from code]
> 3. [...]
>
> Is the sequence right? What's missing or misordered?
>
> **Q6:** Are there business rules that should apply here but aren't enforced in the code yet — things like authorization requirements, quotas, or rate limits?

**Write Phase 3 answers immediately:**

- If Q5 reveals corrections → update the Main Flow steps in `use-case.md`
- Q6 answer → fill `Business: TBD (what business rules should apply here?)` in `use-case.md`
  - If no additional rules: write `Business: None — the technical preconditions cover it`
- If Q5+Q6 suggest a more business-meaningful UC name than the current one: offer to rename it and ask for confirmation before renaming

### Phase 4 — Exception framing

List the error cases from the code:

> **Q7:** I found these error cases: `[list from code]`.
>
> From the user's perspective — which are recoverable (they can retry or fix something) and which are dead ends (contact support)?

**Write Phase 4 answers:**

- Name the happy path Test Scenario based on Q3 (the user's goal). Rename:
  `### Scenario 1: TBD (happy path name — fill in after /elicit)` → `### Scenario 1: [goal-based name, e.g. "Valid credentials — access token issued"]`
- Add a brief characterization after each exception flow in `use-case.md`:
  - Recoverable errors: append `(recoverable)` to the exception flow line
  - Dead-end errors: append `(contact support)` to the exception flow line
- The Given/When/Then test scenario bodies remain TBD — that level of detail is for later

---

## Step 4: TBD references to other modules

After Phase 4, check whether any `Related Use Cases` or `Depends on` lines still say
`TBD (depends on {module-name} — will resolve when that module's loop completes)`.

For each one, ask:
> The [UC] depends on the **[other-module]** module. Has that module's loop completed yet?
>
> - If yes → link to its confirmed use case
> - If no → leave as TBD and note the deferred dependency

Don't try to resolve these proactively — just ask once and move on.

---

## Step 5: Summary

Print what was filled in and what remains:

```
## Elicit Complete — [module] module

### Filled
- UC-001 [name]: Business Preconditions, Exception labels
- US-001 [name]: Story (Actor, Trigger, Goal, Value), Expected Behavior, Scenario 1 name
- US-002 [name]: Story, Expected Behavior, Scenario 1 name

### Still TBD
- [field]: [reason — e.g., "user said to ask product team"]
- [cross-module ref]: deferred until [other-module] loop completes

Ready for /review-draft
```

---

## Field-writing rules

When writing answers back to files:

- **Replace TBD markers in-place** — don't rewrite surrounding content
- **Remove hint text** — `TBD (who calls this...)` becomes just the answer, no parenthetical
- **Write the exact wording the user confirms**, not a paraphrase
- **If the user says "skip" or "not sure"** — leave the TBD marker but update it:
  `TBD (ask product team)` or `TBD (deferred)` so it's clear this was consciously left open
- **Write after each phase**, not all at the end — this preserves progress if the session is interrupted

---

## Handling multiple UCs

When a module has several UC/US pairs (e.g. login + refresh-token, or sendEmail + sendSMS):

- Phases 1–2 often apply at the module level — ask once and confirm whether the same actor/goal applies to all entry points
- If entry points differ significantly (different callers, different goals): ask the story questions separately per US file
- Phases 3–4 are always per-UC — flows and exceptions differ for each entry point
