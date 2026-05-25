---
name: scan-deep
description: >
  Read one module's source code and produce Module UC + Module US drafts for each distinct
  entry point — the core scanning step in the brownfield documentation loop. Use this skill
  whenever the user says "scan the [module] module", "document [module]", "start documenting
  [module]", "/scan-deep", "next module", "scan the first unchecked module", "read the code
  and create docs", or any phrasing that means "read code and produce module-level draft
  documentation". Always run /scan-all first if docs/drafts/coverage.md doesn't exist.
  Takes the first unchecked Scan row in coverage.md by default, or the module the user names.
---

# Skill: scan-deep

Read one module's source code and produce a Module UC + Module US draft per distinct entry
point. High-inferrability fields (interface, flow, errors, data shapes) come from the code.
Low-inferrability fields (actor, goal, business value) are left as `TBD` — they get filled
in by `/elicit` in the next step of the loop.

An **entry point** is anything that represents a distinct user-facing capability: an HTTP
route handler, an exported function that callers invoke directly, an event listener, or a
CLI command.

---

## Step 0: Find the target module

If the user named a specific module (e.g. "scan-deep auth"), use it.

Otherwise, read `docs/drafts/coverage.md` and find the first row where `Scan = [ ]`.

- No coverage.md → "Run `/scan-all` first to create docs/drafts/coverage.md." Stop.
- All Scan rows checked → "All modules scanned. Run `/elicit` on any module with empty
  Module UC, or `/verify` if the coverage file is fully checked." Stop.

---

## Step 1: Read the module code

```bash
find src/{module}/ -type f | sort
```

Read all files. While reading, pay attention to:

- **Entry points** — route handlers, exported functions, event listeners, CLI commands
- **Data shapes** — TypeScript interfaces, function parameters, return types, request/response schemas
- **External dependencies** — calls to other modules in src/, calls to external services
- **Error handling** — try/catch, guard clauses (early returns on bad input), HTTP status codes, thrown error types
- **Side effects** — database writes, events emitted, notifications triggered

---

## Step 2: Show summary and ask 2 confirm questions

After reading, show a 3-line summary:

```
Scanning: {module}
Files:    {N} — {file1}, {file2}, ...
Found:    {N} entry point(s): {name1}, {name2}
```

Then ask — and **wait for the user to answer** before writing any documents:

> **Q1:** "I read this module as: `{one-liner description}`. Is that accurate, or should I
> reframe it?"

> **Q2 (only if external calls exist):** "I see calls to `{module-or-service}`. Should I
> treat those as this module's responsibility, or does a higher-level orchestrator own that
> interaction?"

These questions catch wrong assumptions before they propagate into all the documents.
Skip Q2 if the module makes no calls to other modules or external services.

---

## Step 3: Identify entry points and plan decomposition

After the user's confirmation, decide how many UCs to produce.

**One UC per distinct user goal.** Login, refresh-token, and logout are different goals →
three UCs. GET /subscription and DELETE /subscription both manage a subscription →
one UC, two USs (one per operation).

Announce the plan before writing:

```
→ {N} UC(s) identified:
  UC-{id}: {slug} — {one-liner}
  UC-{id}: {slug} — {one-liner}
Writing drafts...
```

---

## Step 4: Assign IDs

Find the highest existing UC/US ID across all layers:

```bash
find docs/drafts/ docs/use-cases/ docs/modules/ -name "use-case.md" -o -name "us-*.md" 2>/dev/null | sort
```

Parse file paths for `uc-NNN` and `us-NNN` patterns. Next ID = highest found + 1.
If no docs exist at all, start from 001. IDs are shared across business and module layers —
never fill gaps.

---

## Step 5: Write one UC + US pair per entry point

For each entry point:

```bash
mkdir -p docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/
```

Write two files:

1. `use-case.md` — Module UC using the template in `references/templates.md §1`
2. `us-{id}-{slug}.md` — Module US using the template in `references/templates.md §2`

Read `references/templates.md` before writing to get the exact format.

### What to fill vs. leave as TBD

| Field | Action |
|-------|--------|
| UC Trigger | Fill from code (what event/call/request causes this) |
| UC Preconditions | Fill technical guards only (missing field checks, format validation); leave business rules as TBD |
| UC Postconditions | Fill from code (DB writes, events emitted, response sent) |
| UC Main Flow | Fill as numbered steps tracing the call sequence |
| UC Exception Flows | List code-level exceptions (e.g. "Token expired → 401"); use code variable/type names |
| UC Interface Accepts | Fill from function signature / request schema |
| UC Interface Emits | Fill from return type / response shape / events fired |
| UC Source | Always: `TBD (will be linked after /compose)` |
| US Story (all 4 fields) | All TBD — see TBD format below |
| US Expected Behavior | `TBD (fill in after /elicit)` |
| US API/Interface Contract | Fill endpoint, request fields, response fields, error codes from code |
| US Test Scenarios | Write skeleton structure only — scenario names as TBD, Given/When/Then as TBD |

**TBD format** — always include a guiding question:

- Actor: `TBD (who calls this — end user, internal service, or automated process?)`
- Trigger: `TBD (what makes them call this — on demand, event, schedule?)`
- Goal: `TBD (what does the caller want to achieve?)`
- Value: `TBD (what stops working if this entry point disappears?)`

**Cross-module references**: if this module calls module X, note it in related UCs:
`TBD (depends on {module} — will resolve when that module's loop completes)`

### Interface vs. API Contract

For **HTTP modules**: use the API Contract format (Endpoint, Request table, Response table,
Error Codes table). For **non-HTTP modules** (exported functions, events, workers): use an
Interface Contract format with function signature, parameters, return type, and thrown errors.

---

## Step 6: Print summary

```
scan-deep complete — {module}
──────────────────────────────────────────────────────
Module one-liner:  {confirmed one-liner from Q1}
Entry points:      {N}
UC/US pairs:       {N}

Produced:
  docs/drafts/modules/{module}/use-cases/
    uc-{id}-{name}/use-case.md
    uc-{id}-{name}/us-{id}-{name}.md
    ...

IDs used: UC-{start}–UC-{end}, US-{start}–US-{end}

──────────────────────────────────────────────────────
TBD fields (need /elicit): Actor, Trigger, Goal, Value, Expected Behavior, Scenario names
Next: run /elicit to fill in what code can't tell you.
```

---

## Templates

Read `references/templates.md` for the exact markdown format of Module UC and Module US
files, with TBD placeholders pre-inserted in the right places.
