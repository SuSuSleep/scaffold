---
name: schema-update
description: >
  Evolve the project's document schema and migrate existing documents to match.
  Use this skill whenever the user wants to change the document format — adding
  sections, renaming section headings, removing sections, or changing workflow
  rules. Also use when upgrading an existing project to add docs/schema/format.md
  for the first time (bootstrapping frontmatter onto legacy documents).
  Triggers on phrases like "add a section to all use cases", "rename this heading",
  "change the doc format", "update the schema", "migrate documents", or
  "we need a new required field in every user story".
---

# Skill: schema-update

Evolve `docs/schema/format.md` and/or `docs/schema/workflow-rules.md`, then
migrate every affected document to match the new schema. Produces a migration
report listing what was auto-updated and what needs human content.

`format.md` defines document section aliases and templates. `workflow-rules.md`
defines lifecycle, gates, ADR triggers, ID rules, and other workflow policy.
Both are project-owned and can evolve independently.

---

## Step 0: Pre-flight

Check both schema files in `docs/schema/`:

- **`format.md`**
  - Exists → read its YAML frontmatter; note current `version` and all section
    aliases. This is the "old format schema".
  - Does not exist → bootstrap mode. Old format schema is web-service version 0.
- **`workflow-rules.md`**
  - Exists → read its YAML frontmatter; note current `version` and all rule
    sections (id-rules, lifecycle, gates, adr-triggers, etc.). This is the
    "old workflow schema".
  - Does not exist → bootstrap mode. Old workflow schema is web-service version 0.

If both are missing, this is a full bootstrap run: write both files for the
first time and add frontmatter to every existing document. Proceed to Step 2.

---

## Step 2: Interview

Ask what needs to change. Two categories — format (document shape) and
workflow rules (lifecycle/policy):

> **Format changes** (affect document section names and templates):
>
> 1. Rename a section heading (e.g. "Primary Actor" → "Requestor")
> 2. Add a new section to a doc-type (required or optional)
> 3. Remove a section from a doc-type
> 4. Change the api-type (rest / graphql / grpc / events / none)
> 5. Change the schema name (switching project archetype)
>
> **Workflow rule changes** (affect gates, policy, lifecycle):
>
> 6. Modify ID assignment policy (e.g. switch to gap-fill)
> 7. Change the ADR creation criteria
> 8. Add or modify a gate (e.g. require N scenarios per US before planning)
> 9. Change a lifecycle rule (e.g. allow direct edits to confirmed docs)
> 10. Modify the pre-merge checklist (block on more conditions)
> 11. Change test conventions (path pattern, naming)
>
> **Other:**
>
> 12. Something else — describe it

Collect all changes before proceeding. Do not start migrating until the full
change set is described.

If any change is ambiguous — "add a section" without a name, or "rename" without
specifying which — ask for clarification before continuing.

---

## Step 3: Classify changes

For each change, classify it:

```
Class 1 — Safe, auto-execute:
  - Section rename (old heading → new heading, no content change)
  - api-type change (frontmatter only)
  - Schema name change (frontmatter only)
  - Workflow rule value change (frontmatter only — no documents affected)

Class 2 — Auto-execute, flag for human content:
  - New section added (insert empty/placeholder section in every affected document)
  - New required gate added (skills now enforce — flag any existing drafts
    that don't yet meet the new gate)

Class 3 — Requires confirmation per document:
  - Section removed that has existing content
  - Section merged (two → one) or split (one → two)
  - Workflow rule change that invalidates existing artifacts (e.g. ID policy
    change that creates conflicts)
```

Show the classification to the user:

```
Change classification
──────────────────────────────────────────────────────
Class 1 (auto):   [list changes]
Class 2 (flag):   [list changes — will insert placeholders]
Class 3 (confirm): [list changes — will show content before deleting/restructuring]
```

Wait for the user to confirm before proceeding.

---

## Step 4: Update schema files

### 4a. Update format.md (only if format-side changes were collected)

1. Increment `version` by 1.
2. Apply all changes to the YAML frontmatter:
   - Update section aliases for renames
   - Add new section keys for additions
   - Remove section keys for removals
   - Update `api-type`, `schema` name if changed
   - Update `required-extra` lists
3. Update the markdown body:
   - Rename section headings in the template blocks to match new aliases
   - Add new template sections for added sections
   - Remove template sections for removed sections

Write the updated `docs/schema/format.md`.

### 4b. Update workflow-rules.md (only if workflow-rule changes were collected)

1. Increment its `version` by 1.
2. Apply changes to the YAML frontmatter:
   - Modify `id-rules`, `lifecycle`, `gates`, `adr-triggers`, `decomposition`,
     `cross-references`, `test-conventions` as needed
3. Update the markdown body to keep the human-readable explanation aligned with
   the frontmatter.

Write the updated `docs/schema/workflow-rules.md`.

Both files have independent versions. A user might change only format, only
workflow rules, or both in one session.

---

## Step 5: Find all affected documents

Skip this step if only workflow-rules.md changed and no format-side changes are
present (workflow rule changes don't require document migration — they take
effect at the next skill invocation).

For format changes, scan for every `use-case.md`, `us-*.md`, `adr-draft-*.md`,
and `plan-*.md` file across:

- `docs/drafts/`
- `docs/use-cases/`
- `docs/modules/`
- `docs/adr/`

For each file:

- Read its frontmatter `schema-version` (refers to the format schema version)
- If `schema-version` < new format version → mark as stale, add to migration set
- If no frontmatter at all → mark as legacy (version 0), add to migration set

---

## Step 6: Migrate each document

Process in this order: Class 1 changes, then Class 2, then Class 3.

### Class 1: Rename

For each stale document:

1. Find the old heading (exact match of old section alias)
2. Replace the heading text with the new alias
3. Update the `sections` map in the document's frontmatter
4. Update `schema-version` to new version

### Class 2: Add section

For each stale document:

1. Insert the new section at the end of the document (before the closing of
   the last section, if structure allows — otherwise append)
2. Insert placeholder content:

   ```markdown
   ## {new section name}

   (to be filled in)
   ```

3. Add the new key to `sections` in the document's frontmatter
4. Update `schema-version` to new version
5. Add this document to the "needs human content" list in the migration report

### Class 3: Remove / restructure

For each stale document:

1. Show the section content that will be affected
2. Ask: "Confirm removal of this content? (yes / keep for now)"
3. If confirmed → remove the section + remove from frontmatter `sections`
   Update `schema-version` to new version
4. If not confirmed → skip this document; add to the "deferred" list in the report

---

## Step 7: Handle legacy documents (no frontmatter)

For any document with no frontmatter (legacy, version 0):

1. Determine its `doc-type` from path and filename. As of schema v3, there are
   five doc-types (`use-case`, `user-story`, `adr`, `plan`, `fix-plan`) — layer
   for `use-case`/`user-story` is determined by folder path, not doc-type:
   - `docs/{drafts/,}use-cases/uc-*/use-case.md` → `use-case` (project layer)
   - `docs/{drafts/,}use-cases/uc-*/us-*.md` → `user-story` (project layer)
   - `docs/{drafts/,}modules/*/use-cases/uc-*/use-case.md` → `use-case` (module layer)
   - `docs/{drafts/,}modules/*/use-cases/uc-*/us-*.md` → `user-story` (module layer)
   - `docs/{drafts/adr/adr-draft-*,adr/*}.md`, `docs/{drafts/,}modules/*/adr/*.md` → `adr`
   - `docs/drafts/plans/plan-*-fix-*.md` → `fix-plan` (filename contains `-fix-`)
   - `docs/drafts/plans/plan-*.md` → `plan` (all other plan files)
2. Infer section names by matching headings against the web-service default aliases
   for that doc-type (see `skills/init/references/format.md`).
3. For module-layer use-case / user-story: include the `serves` section in the
   document's `sections` frontmatter; the source/derived-from link goes in the
   document body.
4. For project-layer use-case: include `implemented-by` if it lists modules.
5. For user-story: infer `api-type` from the existing API/Interface Contract section:
   - HTTP-shaped (Endpoint/Request/Response/Error Codes) → `rest`
   - Function-shaped (Signature/Parameters/Returns/Throws) → `function`
   - Event-shaped (Event Subscribed/Payload) → `event`
   - CLI-shaped (Command/Flags/Stdout/Stderr) → `cli`
   - GraphQL-shaped (Operation/Arguments/Returns) → `graphql`
   - gRPC-shaped (Service / RPC) → `grpc`
   - No interface section → `none`
6. Insert frontmatter with the new schema values (correct `doc-type`, `sections`
   map, `api-type` for user-stories, `schema`, `schema-version`).
7. Apply any rename/add/remove changes on top.
8. Mark as "bootstrapped" in the migration report.

If a legacy document has headings that don't match any known alias, or a file
that doesn't match any known doc-type path pattern, flag it in the report under
"manual review needed" — do not modify it.

---

## Step 7b: Handle schema v1 → current migration (module-* doc-types)

Documents written under schema v1 may have `doc-type: module-use-case` or
`doc-type: module-user-story` in their frontmatter. Under the current schema,
module and project documents share the same doc-types, with layer determined
by folder path.

For any document with v1 module-* doc-types:

1. **`doc-type: module-use-case` → `doc-type: use-case`**
   - Keep the `serves` section (was `source` in v1 — rename the key if present)
   - If a `## Interface Contract` section exists (v1 module UCs had this), move
     its Accepts/Emits content into the parent UC's `interface-contract` field
     OR drop it (your call — the current module UC no longer has this section
     by default). Default: drop with confirmation, since the detailed contract
     lives in the module US.
   - Drop the `interface-contract` section key from frontmatter.

2. **`doc-type: module-user-story` → `doc-type: user-story`**
   - Rename `derived-from` section key → `serves`.
   - Add `api-type: function` to frontmatter (the v1 module-user-story had a
     function-shaped Interface Contract). Confirm with the user if any other
     api-type fits better (e.g., event listeners → `event`).
   - Rename `interface-contract` section key → `api-contract`. The section
     heading in the body becomes whatever the new `api-contract` alias is
     (default "API Contract"). If the user prefers to keep "Interface Contract"
     as the heading, set `sections.api-contract: "Interface Contract"` in the
     project's format.md and apply that.
3. Bump `schema-version` to current.

This migration is Class 3 (requires confirmation per document) for the
Interface Contract drop and the api-type assignment. Class 1 for the doc-type
rename and key renames.

---

## Step 8: Print migration report

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
  [list of file paths with the section name that needs content]

Manual review:
  [list of file paths + the unrecognized headings found]
```

If `workflow-rules.md` was modified, append:

```
Workflow rules: updated — review docs/schema/workflow-rules.md
```
