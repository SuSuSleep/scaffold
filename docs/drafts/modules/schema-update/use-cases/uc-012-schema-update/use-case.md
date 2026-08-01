---
schema: agent-skills
schema-version: 0
doc-type: use-case
id: UC-012
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

# UC-012: Evolve project schema and migrate every affected document

Independently version `docs/schema/format.md` (document section aliases + templates) and `docs/schema/workflow-rules.md` (lifecycle / gates / ADR triggers / ID rules / etc.), classify every requested change as Class 1 / 2 / 3, then migrate every UC/US/ADR/plan whose `schema-version` is stale. Supports a **bootstrap mode** (introduce a schema for the first time onto legacy documents that pre-date the schema concept) and per-version migration handlers (e.g. Step 7b's v1 → current cascade). Honest deferral on unknown documents — "Manual review needed" is a first-class report category, never an attempt to guess.

## Primary Actor

Inbound CLI invocation via the `/schema-update` slash command in Claude Code, with no positional arguments. The user describes the desired change set conversationally (during Step 2's interview); the skill collects everything before migrating.

## Source

TBD (will be linked after /compose) — belongs to the project-maintenance workflow that crosses both greenfield and brownfield loops; format evolution affects all downstream skills.

## Preconditions

- `docs/schema/` either:
  - Contains `format.md` and/or `workflow-rules.md` (→ **evolution mode**), or
  - Contains neither (→ **bootstrap mode**: schema is being introduced for the first time onto legacy documents)
- The user is available to answer the interview (Step 2) and per-document confirmations for Class 3 changes (Step 6)
- Documents to be migrated (under `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, `docs/adr/`) are readable and writable
- For bootstrap mode: `skills/init/references/format.md` and `references/workflow-rules.md` are readable as defaulting sources for the inferred aliases

## Business Rules

None — the technical preconditions cover it.

## Postconditions

On success (evolution mode, format changes only):

- `docs/schema/format.md` has its `version` incremented by 1; YAML frontmatter reflects every change (renamed aliases, added/removed section keys, updated api-type, schema name, required-extra lists); the markdown body's template blocks are kept aligned (renamed headings, new template stubs, removed template sections)
- Every UC/US/ADR/plan whose `schema-version` was stale has been migrated:
  - Class 1 changes applied byte-stably (heading text + sections-map key updates)
  - Class 2 changes inserted placeholder sections with `(to be filled in)` markers; the document is on the "Needs content" list in the report
  - Class 3 changes applied only after **per-document user confirmation**; documents the user declined are on the "Deferred" list
  - Each migrated document's `schema-version` is bumped to the new value
- A migration report has been printed listing Auto-updated count / Needs content count + paths / Deferred count + paths / Manual review count + paths

On success (evolution mode, workflow-rules-only changes):

- `docs/schema/workflow-rules.md` has its `version` incremented by 1; YAML frontmatter reflects every rule change; the markdown body's human-readable explanation is updated to match
- **No document migration runs** — workflow rules take effect at the next skill invocation, not via document rewrite
- The migration report notes "Workflow rules: updated — review docs/schema/workflow-rules.md" without per-document counts

On success (bootstrap mode):

- `docs/schema/format.md` and `docs/schema/workflow-rules.md` are written for the first time (copied from defaults if no specific changes requested, or assembled from the user's interview answers)
- Every legacy document found in `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, `docs/adr/` has had frontmatter inserted: `doc-type` inferred from path pattern (use-case vs user-story vs adr vs plan vs fix-plan), `api-type` inferred from existing API/Interface Contract section shape (REST/function/event/CLI/GraphQL/gRPC/none), `sections` map inferred from heading matches against default aliases, `schema-version` set to the new version
- Documents with unrecognised headings or unrecognised path patterns are **left unmodified** and flagged under "Manual review" in the report
- The migration report lists per-document outcomes including "bootstrapped" tags

Invariants (apply in every mode):

- **No source code touched** — `src/` is never read or written for schema purposes
- **No tests touched** — `tests/` is never read or written
- **No git operation** — no `git add`, no `git commit`, no `git push`, no auto-`git init`
- **No `docs/drafts/coverage.md` modification** — coverage is brownfield-loop state, not schema state
- **No silent edits to unrecognised documents** — Manual-review path is the only acceptable handling of ambiguity; guessing-and-corrupting is forbidden
- **Class 3 changes always confirmed per-document** — the user-confirmation step is load-bearing; no Class 3 write happens without an explicit yes
- **Independent versioning** — `format.md` and `workflow-rules.md` versions move independently; one session may bump only one, only the other, both, or neither

## Main Flow

1. **Pre-flight** — check `docs/schema/format.md` and `docs/schema/workflow-rules.md`:
   - Both present → **evolution mode** (note current versions and section/rule sets — the "old schemas")
   - Both absent → **bootstrap mode** (old schema baseline = agent-skills version 0)
   - One present, one absent → asymmetric: evolve the one present + bootstrap the one absent in the same run
2. **Interview** — present the 12-category change list (5 format-side + 6 workflow-side + "something else"); collect every change before proceeding. Ask for clarification on any ambiguous change ("add a section" without a name, "rename" without specifying which). Do NOT start migrating until the full change set is described and unambiguous
3. **Classify every collected change**:
   - **Class 1** (safe, auto-execute): section rename (heading + sections-map key, no content change); api-type change (frontmatter only); schema name change (frontmatter only); workflow rule value change (frontmatter only, no documents affected)
   - **Class 2** (auto-execute + flag for human content): new section added (insert placeholder in every affected document); new required gate added (skills now enforce; flag existing drafts that don't meet it)
   - **Class 3** (requires per-document confirmation): section removed that has existing content; section merged (2→1) or split (1→2); workflow rule change that invalidates existing artifacts (e.g. ID policy change that creates conflicts)
4. **Show the classification table** to the user (Class 1 list / Class 2 list / Class 3 list) and **wait for explicit "proceed" confirmation** before any file is modified
5. **Step 4a — Update format.md** (only if format-side changes were collected): increment `version` by 1; apply YAML frontmatter changes (renamed aliases, added/removed section keys, api-type, schema name, required-extra); update markdown body (rename headings in templates, add/remove template sections). Write the file
6. **Step 4b — Update workflow-rules.md** (only if workflow-rule changes were collected): increment its `version` by 1 (independent from format.md's version); apply YAML frontmatter changes to `id-rules` / `lifecycle` / `gates` / `adr-triggers` / `decomposition` / `cross-references` / `test-conventions`; update the markdown body's human-readable text to stay aligned. Write the file
7. **Step 5 — Find affected documents** (skip if only workflow-rules.md changed and no format-side changes): scan every `use-case.md`, `us-*.md`, `adr-draft-*.md`, `plan-*.md` under `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, `docs/adr/`. For each:
   - Read frontmatter `schema-version`; if < new format version → stale, add to migration set
   - No frontmatter at all → legacy (version 0), add to migration set as bootstrap candidate
8. **Step 6 — Migrate each document** (in order: Class 1 → Class 2 → Class 3):
   - **Class 1 — Rename**: find old heading exact match → replace heading text with new alias; update `sections` map key in frontmatter; bump `schema-version` to new version
   - **Class 2 — Add section**: insert new section at end of document body with placeholder `## {new section name}\n\n(to be filled in)`; add key to `sections`; bump `schema-version`; add this document to the "needs content" report list
   - **Class 3 — Remove / restructure**: show the affected section content to the user; ask "Confirm removal of this content? (yes / keep for now)"; on yes → remove section + remove from frontmatter; on no → skip this document; add to "deferred" report list
9. **Step 7 — Legacy bootstrap pass** — for every document with no frontmatter:
   - Infer `doc-type` from the file's path pattern (see the doc-type-to-path mapping in Step 7 of the SKILL.md; covers use-case / user-story / adr / plan / fix-plan)
   - Infer `sections` map by matching the document's headings against the default aliases for that doc-type (from `skills/init/references/format.md`)
   - For module-layer use-case/user-story: include `serves`; for project-layer use-case: include `implemented-by` if it lists modules
   - For user-story: infer `api-type` from the existing API/Interface Contract section shape (REST → `rest`; function-shaped → `function`; event-shaped → `event`; CLI-shaped → `cli`; GraphQL-shaped → `graphql`; gRPC-shaped → `grpc`; no interface section → `none`)
   - Insert the frontmatter with all the inferred values + `schema-version` set to the new version
   - Apply any rename/add/remove changes from the current change set on top
   - Mark as "bootstrapped" in the migration report
   - **If headings or path don't match any known alias → DO NOT modify the file**; add to "manual review needed" list
10. **Step 7b — Per-version migration handlers (e.g. v1 → current)** — for documents whose frontmatter has legacy doc-types (`module-use-case`, `module-user-story`):
    - Rename `doc-type` to the unified `use-case` / `user-story`
    - For `module-use-case` → `use-case`: keep `serves` (rename `source` key → `serves` if present); drop the `interface-contract` section key (Class 3 — requires confirmation, since the detailed contract now lives in the module US); the doc-type rename itself is Class 1
    - For `module-user-story` → `user-story`: rename `derived-from` key → `serves`; add `api-type: function` (or another api-type if user prefers — confirm); rename `interface-contract` key → `api-contract`
    - Bump `schema-version` to current
11. **Step 8 — Print migration report**:

    ```
    Schema update complete
    ──────────────────────────────────────────────────────
    Schema:       {schema-name} v{old} → v{new}
    Changes:
      Renamed:    [section aliases changed]
      Added:      [new sections]
      Removed:    [sections removed]
      api-type:   [old → new, or "unchanged"]

    Documents migrated: {N}
      Auto-updated:     {N} files
      Needs content:    {N} files — added placeholder "(to be filled in)"
      Deferred:         {N} files — user chose to keep existing content
      Manual review:    {N} files — unrecognized headings, no changes made

    Needs content (fill these in):
      [paths + section names that need content]

    Manual review:
      [paths + unrecognized headings found]
    ```

    If `workflow-rules.md` was modified, append: `Workflow rules: updated — review docs/schema/workflow-rules.md`

## Exception Flows

- **E1 — Both schema files missing AND no documents to bootstrap** (contact support): truly fresh project; suggest running `/init` instead; `/init` is the canonical bootstrap path for greenfield projects; `/schema-update` bootstrap mode is for adding a schema to a project that already has legacy documents
- **E2 — Ambiguous change in the interview** (recoverable): "add a section" without a name; "rename" without specifying which; ask for clarification; do NOT proceed until the change is unambiguous
- **E3 — User abandons during the classification confirmation (Step 4)** (recoverable): no file written; classifications can be recomputed on next invocation
- **E4 — Class 3 user declines on a document** (recoverable): skip that document; add to "deferred" list; continue with other documents; do NOT halt the run
- **E5 — Legacy document headings match no known alias** (recoverable): Step 7 fallthrough; **leave the document unmodified**; add to "Manual review" list with the unrecognised headings noted; report after all other documents are migrated
- **E6 — Path pattern matches no known doc-type** (recoverable): e.g. a UC file in an unexpected location; leave unmodified; add to "Manual review" with the path; report
- **E7 — Schema files exist but their frontmatter is malformed** (recoverable): refuse to read the version; surface the parse failure; ask the user to fix the schema file manually before re-running — do NOT auto-repair the frontmatter (risk of misinterpreting intent)
- **E8 — Concurrent `/apply` or `/draft` run mid-flight (detectable via uncommitted drafts modified after `format.md`'s mtime)** (contact support): warn the user that the in-flight skill may be operating against the old schema; ask whether to proceed (accepting that the in-flight skill's output may need a follow-up migration) or to abort and let the in-flight skill complete first
- **E9 — A document's existing frontmatter `schema-version` is HIGHER than the version currently in `format.md`** (contact support): do NOT downgrade; surface this as a Manual-review item and ask the user how to reconcile (likely the schema was updated elsewhere or the file was edited from a future version of the project)
- **E10 — User requests both bootstrap mode AND custom changes in the same run** (contact support): support it — bootstrap with the user's specified schema, then apply the changes on top in the same pass. Migration report should distinguish "bootstrapped" from "evolved"

## Serves

TBD (will be linked after /compose) — expected target: the project-maintenance step that crosses greenfield and brownfield workflows.
