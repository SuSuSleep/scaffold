---
schema: agent-skills
schema-version: 0
doc-type: use-case
id: UC-013
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

# UC-013: Fill project-level Tier-0 configuration

Populate the project-level knowledge that the `/init` scaffold left empty — `docs/overview/test-strategy.md`, `docs/overview/glossary.md`, `CONVENTIONS.md` (named sections only), `README.md`, and shared test infrastructure under `tests/helpers/` or `tests/fixtures/`. Read conversation context first (especially anything left by `/explore`) to minimise questions, then ask **targeted** questions only for genuinely missing values. **Never writes UC/US/ADR/plan documents, never touches `src/`, never touches `tests/behavioral/` or `tests/implementation/`** — those belong to the feature workflow (`/draft` → `/design-plan` → `/apply` → `/merge`).

## Primary Actor

Inbound CLI invocation via the `/setup` slash command in Claude Code. Typically run shortly after `/init` (and ideally after `/explore` has aligned context), with the user describing their decisions conversationally or accepting framework-aware defaults.

## Source

TBD (will be linked after /compose) — belongs to the project-bootstrap workflow that follows `/init` and precedes feature work; sits parallel to the brownfield and greenfield loops.

## Preconditions

- `docs/overview/` exists with at least one of `test-strategy.md`, `glossary.md` present (typically from `/init`); OR the user is requesting first-time creation of files setup owns
- `CONVENTIONS.md` exists (from `/init`), or the user explicitly accepts a first-time creation
- The user is available to answer targeted questions when conversation context is insufficient
- For shared test infrastructure work: `tests/` directory exists or the user accepts its creation under setup's narrow remit (`tests/helpers/`, `tests/fixtures/` only — never `tests/behavioral/` or `tests/implementation/`)

## Business Rules

None — the technical preconditions cover it.

## Postconditions

On success (per file in scope):

- **`docs/overview/test-strategy.md`** (first-time fill OR update): Testing Layers table reflects the project's actual layer model (placeholder rows like "Unit / Integration / E2E" are **replaced**, not preserved); four commands (verify / behavioral / coverage / CI) populated; coverage threshold + CI enforcement noted; Test Directories table reflects the actual test layout; any shared test infrastructure files created in this run are registered here with a short prose section
- **`docs/overview/glossary.md`** (always additive — never deletes on re-runs): new domain term/definition pairs inserted in alphabetical order; existing entries untouched, including ones added manually between runs
- **`CONVENTIONS.md`** (one named section per write): the named section (e.g. code naming, test structure, git conventions) replaced with the new content; all other sections preserved byte-for-byte
- **`README.md`** (first-time fill OR update): project name, one-paragraph description, quick-start commands (install / run / test) populated; other prose preserved on update
- **`tests/helpers/{file}` or `tests/fixtures/{file}`** (new files only — never modifies `tests/behavioral/` or `tests/implementation/`): the shared utility file written with the minimal content discussed (signatures, fixtures, mocks); naming follows `CONVENTIONS.md`; the file is registered in `test-strategy.md`'s Test Directories table + a "## Shared Mocks" (or similar) prose section

Invariants (apply at every step):

- **Hard boundary — never writes**: `src/**`, `docs/use-cases/**`, `docs/modules/**`, `docs/drafts/**`, `docs/adr/**`, `tests/behavioral/**`, `tests/implementation/**`. These belong to the feature workflow
- **Never guesses values**: when a value isn't established in conversation and the user doesn't answer the targeted question, write `(fill in per project)` rather than inventing one
- **Additive guarantee on glossary**: re-runs of `/setup` never delete glossary entries; only insert new ones in alphabetical order
- **Section-scoped writes on CONVENTIONS.md**: only the named section is touched per write; other sections (including ones the user added manually) preserved
- **No git operation**: no `git add`, no `git commit`, no `git push`, no auto-`git init` (consistent with the workflow pattern: only `/init` and `/review-draft` commit)
- **No UC/US/ADR/plan creation**: setup is Tier-0 config; feature documents are out of scope

## Main Flow

1. **Read conversation context** — look back through the current conversation for any user decisions: testing framework or tools named, domain terms defined or mentioned, convention rules stated, commands / thresholds / structure described. If `/explore` ran earlier in the session, treat its conversation contents as primary input
2. **Scan scaffold files** — list `docs/overview/` and `tests/`; for each relevant file determine: **first-time fill** (file exists as template with placeholders), **update** (file has real content needing partial revision), or **new file** (file doesn't exist yet, e.g. `tests/helpers/`)
3. **Identify target files** — derive scope from the user's request and what conversation context covers. If the request is broad ("set up the project") and prior `/explore` context is absent, list files with unfilled sections and ask which to work on today. Do NOT configure everything at once unless conversation has covered all of it
4. **Assess sufficiency per target file** — for each in-scope file, list "Known from conversation" and "Still missing" values:
   - `test-strategy.md` requires: testing tools per layer, four commands (verify / behavioral / coverage / CI), coverage threshold + CI enforcement, test directory names
   - `glossary.md` requires: domain term + definition pairs (at minimum the terms the user has mentioned)
   - `CONVENTIONS.md` requires: which section, project-specific rules, real examples using the actual stack
   - `README.md` requires: project name, one-paragraph description, quick-start commands
   - `tests/helpers/` or `tests/fixtures/` requires: what utilities are needed, function signatures, minimal implementation discussed
5. **Targeted questions** — for each gap, ask **only** about that specific gap. Group related questions; do NOT re-ask anything already established. Use framework-aware defaults (Jest / Vitest / pytest / go test default-table for test commands) and let the user accept them in one step. Wait for answers before writing
6. **Write the files** per the update strategy:
   - **Placeholder files** (`test-strategy.md`, `README.md`): replace placeholder values; **Testing Layers table rows are project-configurable and must be replaced even when they look like plausible scaffold examples** (Unit / Integration / E2E are NOT real project decisions). Preserve headings, prose, section order
   - **Section-scoped files** (`CONVENTIONS.md`): replace only the named section; leave all other sections exactly as they are
   - **Additive files** (`glossary.md`): insert new entries alphabetically; never remove or alter existing entries
   - **New infrastructure files** (`tests/helpers/{file}`, `tests/fixtures/{file}`): create with minimal content (only what `/apply` would actually import); follow `CONVENTIONS.md` naming; **also update `test-strategy.md` to register the new directory + prose section**
   - **Re-runs**: read existing content first; update only what changed based on conversation; preserve everything else including manual edits between runs
7. **Print summary** — Updated / Created / Still needs attention sections, naming each file and what changed. Omit sections where nothing happened. Footer:

   ```
   These conventions govern how /apply writes tests and code.
   When feature plans run, agents will read test-strategy.md and
   CONVENTIONS.md to follow the rules defined here.
   ```

## Exception Flows

- **E1 — Broad request ("set up the project") with no `/explore` context** (not an error): list files with unfilled sections; ask the user which to work on today; do NOT configure everything in one go
- **E2 — Conversation context covers some values but not others** (recoverable): ask targeted questions only for the gaps; do NOT re-ask the established values
- **E3 — User can't answer a targeted question** (recoverable): write `(fill in per project)` in that slot instead of inventing a value; add the file to "Still needs attention" in the summary
- **E4 — User asks `/setup` to update a UC, US, ADR, plan, or anything under `docs/use-cases/`, `docs/modules/`, `docs/drafts/`, `docs/adr/`** (contact support): refuse with a "wrong skill" message; redirect to `/draft` (business UC/US), `/design-plan` (module drafts + plan), `/scan-deep` (brownfield module docs), or the schema/migration skill as appropriate; make no changes
- **E5 — User asks `/setup` to write source code or modify `src/`** (contact support): refuse; redirect to `/apply` (which writes implementation code under a plan) or `/explore` (if the user is still thinking); make no changes
- **E6 — User asks `/setup` to add behavioural or implementation tests under `tests/behavioral/` or `tests/implementation/`** (contact support): refuse; explain that those test directories are `/apply`'s responsibility (driven by US scenarios and quality-test plans); offer to write shared helpers/fixtures instead if appropriate
- **E7 — `test-strategy.md` has placeholder rows that look like real layer decisions (e.g. "Unit / Integration / E2E")** (recoverable): replace them per the project's actual model; do NOT preserve them just because they look populated
- **E8 — Existing `test-strategy.md` has real content the user didn't mention but is overwriting via a re-run** (recoverable): read existing content first; surface "I see you currently have X for behavioral; you've described Y — apply the change?" before overwriting; preserve manual additions
- **E9 — `tests/` doesn't exist but the user wants to create `tests/helpers/`** (recoverable): create the parent + the subdirectory; flag this in the summary so the user knows the structure was bootstrapped
- **E10 — User wants to remove or rename a glossary entry** (recoverable): refuse — `/setup` is append-only on glossary by invariant; tell the user to edit `glossary.md` directly or use a schema migration if it's a project-wide rename
- **E11 — A new shared helper file is created but `test-strategy.md` cannot be updated** (contact support): locked, missing, malformed; write the helper anyway; surface the failure to register it in the summary; ask the user to update `test-strategy.md` manually

## Serves

TBD (will be linked after /compose) — expected target: the project-bootstrap workflow business UC (Tier-0 configuration step, after `/init`).
