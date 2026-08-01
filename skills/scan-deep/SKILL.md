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

## Step 0: Orient

### 0a. Load schema and rules

- Read `docs/schema/format.md` if it exists — extract section aliases for
  `use-case` and `user-story` (the doc-types this skill creates; layer
  determined by folder path). Read the body templates and the "Interface Contract
  Variants" section for api-type sub-templates.
- Read `docs/schema/workflow-rules.md` if it exists — extract `id-rules`
  (default highest-plus-one, no gaps) and `decomposition.uc-rule` (default
  "one UC per distinct user goal").
- If either is absent, use the embedded defaults stated inline below.

### 0b. Find the target module

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

Apply `decomposition.uc-rule` from workflow-rules.md. Default: **one UC per
distinct user goal**. Login, refresh-token, and logout are different goals →
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

Apply `id-rules` from workflow-rules.md (default: highest-plus-one, no gaps,
shared namespace across drafts/confirmed).

```bash
find docs/drafts/ docs/use-cases/ docs/modules/ -name "use-case.md" -o -name "us-*.md" 2>/dev/null | sort
```

Parse file paths for `uc-NNN` and `us-NNN` patterns. Next ID = highest found + 1.
If no docs exist at all, start from 001.

---

## Step 5: Write one UC + US pair per entry point

For each entry point:

```bash
mkdir -p docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/
```

Write two files (prepend frontmatter to each — see "Frontmatter for created
documents" below). Both use the unified doc-types (`use-case`, `user-story`),
since scan-deep writes at the module layer, the folder path tells skills to
include the layer-appropriate sections:

1. `use-case.md` — use `docs/schema/format.md`'s `## use-case Template`.
   Module-layer means: include the `serves` section (link to business UC,
   filled as "TBD" since /compose hasn't run yet); omit `implemented-by`.
2. `us-{id}-{slug}.md` — use `docs/schema/format.md`'s `## user-story Template`.
   Module-layer means: include the `serves` section (filled as TBD).
   Pick the Interface Contract sub-template based on the entry-point detected in
   Step 1 — see "Entry-point detection and api-type" below for the mapping.

### Frontmatter for created documents

Set the document's `schema-version` per the "Schema versioning" section in
`skills/init/references/format.md` (use the project's format.md version if it
exists; otherwise 0).

For `use-case.md`:

```yaml
---
schema: {schema name from format.md, or "agent-skills"}
schema-version: {per Schema versioning rules}
doc-type: use-case
id: UC-{id}
sections:
  {copy use-case.sections from format.md — at module layer, include `serves`,
   omit `implemented-by`}
---
```

For `us-{id}-{slug}.md`:

```yaml
---
schema: {schema}
schema-version: {per Schema versioning rules}
doc-type: user-story
id: US-{id}
api-type: {one of rest, function, event, cli, graphql, grpc, none — chosen
            per the entry-point detection in Step 1}
sections:
  {copy user-story.sections from format.md — at module layer, include `serves`}
---
```

### What to fill vs. leave as TBD

Section names below use the default `use-case` and `user-story` aliases
(Primary Actor, Source, Preconditions, Business Rules, Postconditions, Main
Flow, Exception Flows, Belongs to, Derived from, Story, Expected Behavior,
Interface Contract, Test Scenarios). When format.md defines different aliases, use
those instead — but the fill/TBD decisions stay the same. (Note: under schema
v4, the module UC has no high-level Interface Contract section — the detailed
contract lives entirely in the module US's api-contract section.)

| Field | Action |
|-------|--------|
| UC actor section ("Primary Actor") | Fill with the trigger description from code (e.g., "Inbound HTTP POST /payments", "Event listener on payment.created") |
| UC serves section ("Source") | Always: `TBD (will be linked after /compose)` |
| UC preconditions | Fill technical guards only — input validation, format checks, type constraints |
| UC business-rules ("Business Rules") | Always: `TBD (what business rules should apply here — authorization, quotas, rate limits?)` — `/elicit` fills this |
| UC postconditions | Fill from code (DB writes, events emitted, response sent) |
| UC flow section | Fill as numbered steps tracing the call sequence |
| UC exceptions section | List code-level exceptions (e.g. "Token expired → 401"); use code variable/type names |
| US parent-link | Fill: belongs to the module UC just created |
| US serves ("Derived from") | Always: `TBD (will be linked after /compose)` |
| US story section (all 4 fields) | All TBD — see TBD format below |
| US expected-behavior section | `TBD (fill in after /elicit)` |
| US api-contract section | Fill the api-type-appropriate sub-template (endpoint/signature/event/command/etc.) from code |
| US scenarios section | Write skeleton structure only — scenario names as TBD, Given/When/Then as TBD |

**TBD format** — always include a guiding question:

- Actor: `TBD (who calls this — end user, internal service, or automated process?)`
- Trigger: `TBD (what makes them call this — on demand, event, schedule?)`
- Goal: `TBD (what does the caller want to achieve?)`
- Value: `TBD (what stops working if this entry point disappears?)`

**Cross-module references**: if this module calls module X, note it in related UCs:
`TBD (depends on {module} — will resolve when that module's loop completes)`

### Entry-point detection and api-type

All entry-point variants use the same `user-story` doc-type — the `api-type`
frontmatter field controls the Interface Contract section's shape. Pick the variant
from `format.md`'s "Interface Contract Variants" section based on what you detected
in Step 1:

| Entry point in code             | api-type    | Contract shape                                       |
|---------------------------------|-------------|------------------------------------------------------|
| HTTP route handler              | `rest`      | Endpoint, Request, Response, Error Codes             |
| Exported function (lib export)  | `function`  | Signature, Parameters, Returns, Throws               |
| Event listener / queue consumer | `event`     | Event Subscribed, Payload, Side Effects              |
| CLI command                     | `cli`       | Command, Flags, Stdin/Stdout/Stderr, Exit Codes      |
| GraphQL resolver                | `graphql`   | Operation, Arguments, Returns, Errors                |
| gRPC service method             | `grpc`      | Service/RPC, Request/Response Messages, Status Codes |
| Internal helper (no caller)     | `none`      | Omit the Interface Contract section                 |

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

- **Module UC** body: `docs/schema/format.md` → `## use-case Template`
  (module-layer means include `serves`, omit `implemented-by`)
- **Module US** body: `docs/schema/format.md` → `## user-story Template` plus
  the appropriate variant from `## Interface Contract Variants`, selected by the
  api-type for the entry point (see "Entry-point detection and api-type" above)

When writing, prepend the YAML frontmatter described in Step 5 to each file.
