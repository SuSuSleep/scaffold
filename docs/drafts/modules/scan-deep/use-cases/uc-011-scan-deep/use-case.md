---
schema: agent-skills
schema-version: 0
doc-type: use-case
id: UC-011
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

# UC-011: Produce module UC + US drafts per entry point from one module's source

Read the source code of **one** named module (or the first unchecked `Scan [ ]` row in `docs/drafts/coverage.md`), infer the distinct entry points, present a brief summary and **wait for the user to answer two mandatory confirmation questions** (Q1 module one-liner, Q2 cross-module responsibility) before any file is written. Then decompose per `decomposition.uc-rule` (default "one UC per distinct user goal"), assign IDs (default highest-plus-one), and write one folder per UC under `docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/` containing a code-derived `use-case.md` + an api-type-appropriate `us-{id}-{slug}.md` with TBDs left for `/elicit` to fill. On success, **flip the module's `Scan [ ]` checkbox in `coverage.md` to `[x]`** (closes a gap that exists in the source SKILL.md).

Strictly module-bounded: no cross-module fanout, no source code touched, no tests touched, no git operation.

## Primary Actor

Inbound CLI invocation via the `/scan-deep` slash command in Claude Code. Two invocation forms:

- With a module name (e.g. `/scan-deep auth`) → the named module is used
- Without arguments → the skill reads `docs/drafts/coverage.md`, picks the **first row** where `Scan = [ ]`, and uses that module. If no such row exists, the skill reports completion of brownfield scanning and suggests `/elicit` or `/verify`

## Source

TBD (will be linked after /compose) — belongs to the brownfield documentation workflow: `scan-all → /scan-deep → elicit → compose`.

## Preconditions

- `docs/drafts/coverage.md` exists — if absent, the skill refuses to run and tells the user to run `/scan-all` first
- The target module (either named or selected as the first unchecked Scan row) exists as a direct subdirectory of `src/` (or the user-confirmed equivalent root that `/scan-all` recorded)
- The module's `src/{module}/` is readable; at least one source file is present
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` are readable, or the embedded defaults apply
- The user is available to answer the two-question confirmation gate synchronously — `/scan-deep` is interactive, not batch

## Business Rules

None — the technical preconditions cover it.

## Postconditions

On success:

- A 3-line summary was shown to the user (Scanning: `{module}` / Files: `{N} — {file1}, …` / Found: `{N} entry point(s)`)
- The user **answered both Q1 and Q2** before any file was written — Q1 confirms or corrects the module one-liner; Q2 (when external calls exist) confirms ownership of cross-module / external-service interactions
- For each distinct user goal identified in the module, a folder `docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/` exists, containing:
  - `use-case.md` — module-layer UC with `serves` filled as TBD (will be linked after `/compose`), `implemented-by` omitted (module layer), code-derivable sections filled (Primary Actor as the trigger description, Preconditions as technical guards / input validation, Main Flow as numbered call sequence, Exception Flows as code-level exceptions with type names), and human-context sections left as TBD with **guiding questions**: `TBD (who calls this — end user, internal service, or automated process?)`, etc.
  - `us-{id}-{slug}.md` — module-layer US with `serves` filled as TBD; `api-type` chosen per the entry-point detection table (below); api-contract section filled from code; Story fields all TBD with guiding questions; Expected Behavior TBD; Test Scenarios skeleton with names TBD and Given/When/Then bodies TBD
- IDs assigned per `id-rules` (default highest-plus-one, no gaps, shared namespace across `docs/drafts/` and confirmed locations)
- Cross-module references found in code (e.g. calls to `src/other-module/`) are noted in `use-case.md`'s `related` section as `TBD (depends on {other-module} — will resolve when that module's loop completes)` — **never** as a proactive fanout to scan that other module
- **`docs/drafts/coverage.md` has the module's `Scan [ ]` flipped to `Scan [x]`** — this is a deliberate divergence from the source SKILL.md (which doesn't specify the update). The Notes column may be appended with a brief context like `1 UC (UC-{id})` or `{N} UCs`
- A final summary block was printed listing the produced files, the module one-liner confirmed in Q1, the entry points found, the IDs used, and the next step (`/elicit` to fill the TBD business-context layer)

On stop (Q1/Q2 not answered, or user requests cancellation): no files were written, `coverage.md` was not modified, the conversation can be resumed by re-invoking `/scan-deep {module}`.

Invariants:

- **No source code touched** at any step — `src/` is read-only
- **No tests touched** at any step — `tests/` is read-only
- **No git operation** at any step — no `git add`, no `git commit`, no `git push`; no auto-`git init`
- **Strictly module-bounded** — only one module's code is read in detail per run; cross-module dependencies are noted but never followed
- **No business-context filling** — that's `/elicit`'s job; Q1/Q2 are *interface confirmation*, not business-context elicitation

## Main Flow

1. **Orient** — read `docs/schema/format.md` (section aliases, `api-contract` variants table) and `docs/schema/workflow-rules.md` (id-rules, decomposition.uc-rule), falling back to embedded defaults if either is absent
2. **Resolve target module** — use the user-named module if supplied; otherwise read `docs/drafts/coverage.md` and pick the first row where `Scan = [ ]`. If `coverage.md` doesn't exist: refuse and tell the user to run `/scan-all` first (E1). If all rows are already `Scan = [x]`: report "all modules scanned" and suggest `/elicit` on the next module with TBD business context, or `/verify` if coverage is fully complete (E2)
3. **Read the module's source** — `find src/{module}/ -type f | sort`; read every file. Take note of: entry points (route handlers, exported functions, event listeners, CLI commands, GraphQL resolvers, gRPC methods, internal helpers); data shapes (interfaces, parameters, return types, request/response schemas); external dependencies (calls to other modules in `src/`, calls to external services); error handling (try/catch, guards, status codes, thrown types); side effects (DB writes, events emitted, notifications, file I/O)
4. **Show the 3-line summary** to the user:

   ```
   Scanning: {module}
   Files:    {N} — {file1}, {file2}, ...
   Found:    {N} entry point(s): {name1}, {name2}
   ```

5. **Ask the two mandatory confirmation questions and WAIT for the user to answer**:
   - **Q1**: "I read this module as: `{one-liner description}`. Is that accurate, or should I reframe it?"
   - **Q2** (only when the module makes calls to other modules or external services): "I see calls to `{module-or-service}`. Should I treat those as this module's responsibility, or does a higher-level orchestrator own that interaction?"

   No file is written until both questions are answered. Q2 is skipped only when the module has no external calls
6. **Decompose** per `decomposition.uc-rule` (default "one UC per distinct user goal"): login + refresh-token + logout = 3 UCs; GET /subscription + DELETE /subscription = 1 UC + 2 USs. Announce the plan: `→ {N} UC(s) identified: UC-{id}: {slug} — {one-liner}` per UC, then `Writing drafts...`
7. **Assign IDs** per `id-rules` (highest-plus-one, no gaps, shared across `docs/drafts/`, `docs/use-cases/`, `docs/modules/`). Scan `docs/drafts/`, `docs/use-cases/`, `docs/modules/` for highest existing UC/US ID
8. **For each UC, write the UC + US pair**:
   - `mkdir -p docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/`
   - Write `use-case.md`: frontmatter (doc-type `use-case`, schema name, schema-version per the Schema versioning rules, sections map from `format.md`'s use-case.sections at module layer — include `serves`, omit `implemented-by`); body using `format.md`'s `## use-case Template`. Fill the Primary Actor section with the trigger description from code; fill Preconditions with technical guards only; fill Postconditions from code (DB writes, events, response sent); fill Main Flow as numbered call sequence; fill Exception Flows with code-level exceptions and type names. Leave Business Rules as `TBD (what business rules should apply here — authorization, quotas, rate limits?)`; leave Source as `TBD (will be linked after /compose)`
   - Write `us-{id}-{slug}.md`: frontmatter (doc-type `user-story`, schema info, sections from `format.md`'s user-story.sections at module layer — include `serves`, with the `api-type` chosen from the **entry-point detection table** below); body using `format.md`'s `## user-story Template` + the matching variant from `## Interface Contract Variants`. Fill the api-contract section from code (Endpoint / Signature / Event / Command / Operation / Service depending on api-type, or omit the section entirely if `api-type: none`). Leave the Story section's four fields as `TBD (...)` with the **guiding questions** (Actor: who calls this; Trigger: on demand vs event vs schedule; Goal: what they want; Value: what stops working if it disappears). Leave Expected Behavior as `TBD (fill in after /elicit)`. Write the Test Scenarios skeleton with scenario names as `TBD (happy path name — fill in after /elicit)` and Given/When/Then bodies as TBD
9. **Note cross-module dependencies** — for each call from this module to another module's symbol, append a line to `use-case.md`'s `related` section: `TBD (depends on {other-module} — will resolve when that module's loop completes)`. **Never** scan the other module here
10. **Update `docs/drafts/coverage.md`** — find the row for this module and flip `Scan [ ]` → `Scan [x]`. Optionally append a Notes hint like `; {N} UC(s) (UC-{first}..UC-{last})`. This is the deliberate divergence from the source SKILL.md
11. **Print the final summary**:

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

    TBD fields (need /elicit): Actor, Trigger, Goal, Value,
                               Expected Behavior, Scenario names
    Next: run /elicit to fill in what code can't tell you.
    ```

**Entry-point detection table (used in Step 8 for api-type selection):**

| Entry point in code | api-type | Contract shape |
| ------------------- | -------- | -------------- |
| HTTP route handler | `rest` | Endpoint / Request / Response / Error Codes |
| Exported function (lib export) | `function` | Signature / Parameters / Returns / Throws |
| Event listener / queue consumer | `event` | Event Subscribed / Payload / Side Effects |
| CLI command | `cli` | Command / Flags / Stdin / Stdout / Stderr / Exit Codes |
| GraphQL resolver | `graphql` | Operation / Arguments / Returns / Errors |
| gRPC service method | `grpc` | Service / RPC, Request / Response Messages, Status Codes |
| Internal helper (no external caller) | `none` | (omit api-contract section entirely) |

A module that mixes shapes (e.g. a route handler AND an event listener) produces **separate UC/US pairs with different api-types** — same module folder, different UC subfolders. api-type lives per UC, not per module.

## Exception Flows

- **E1 — `docs/drafts/coverage.md` does not exist** (contact support): refuse to run; tell the user to run `/scan-all` first. Make no changes
- **E2 — All `Scan` rows are already `[x]`** (contact support): report "all modules scanned"; suggest `/elicit` on any module with TBD business context, or `/verify` if the workflow is fully complete; make no changes
- **E3 — Named module doesn't exist in `src/`** (contact support): or doesn't appear as a row in `coverage.md`; report the lookup failure; suggest `/scan-all` to refresh the tracker; make no changes
- **E4 — User doesn't answer Q1 (and/or Q2) — abandons the confirmation gate** (contact support): no file is written; `coverage.md` is not modified; the conversation can be resumed later by re-invoking `/scan-deep {module}`. This is a hard precondition for any write
- **E5 — User corrects the module one-liner in Q1** (recoverable): incorporate the correction; the corrected one-liner becomes the framing for all derived UC bodies (specifically the use-case.md title line and the Primary Actor description). Do NOT silently use the original one-liner
- **E6 — User says cross-module calls in Q2 belong to a higher-level orchestrator, not this module** (recoverable): scope the module UC's Postconditions and Main Flow to the boundary the user described — write the dependency in `related` as a TBD without claiming this module owns the orchestration
- **E7 — Module folder for an existing UC already exists in `docs/drafts/modules/{module}/use-cases/uc-{id}-{slug}/`** (recoverable): do NOT overwrite silently; surface the collision and ask the user whether to (a) skip that UC, (b) assign new IDs and write alongside, or (c) delete the existing draft and rewrite. The default is (b) (preserve everything)
- **E8 — Module has zero entry points** (recoverable): e.g. all files are internal helpers or constants with no exported surface; use `api-type: none` and write a single UC describing the module's internal role; in the summary, flag that the module may not warrant business-layer composition (no entry point = no business UC to derive)
- **E9 — User explicitly asks `/scan-deep` to also fanout to another module's code** (recoverable): during the same run, refuse and explain the boundary — `/scan-deep` is single-module per invocation; the user should run `/scan-deep {other-module}` separately
- **E10 — Source code reading reveals significant divergence between code structure and the coverage.md row** (contact support): e.g. the module turns out to be empty / renamed / a stub; surface the mismatch; do NOT silently flip `Scan [x]`; ask the user whether to update `coverage.md` (preferably via re-running `/scan-all`) or to proceed with what's there

## Serves

TBD (will be linked after /compose) — expected target: the per-module documentation step of the brownfield workflow business UC.
