---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-012
api-type: cli
sections:
  belongs-to: Belongs to
  derived-from: Derived from
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  test-scenarios: Test Scenarios
  serves: Serves
---

# US-012: Run /schema-update to evolve the project schema and migrate documents

## Belongs to

UC-012 — Evolve project schema and migrate every affected document (module `schema-update`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the project-maintenance workflow business US, where the user-facing step is "I want to evolve how documents are shaped (rename a heading, add a section, change a workflow rule) and have every affected document migrated in one structured pass — with explicit confirmation before anything destructive, and an honest report of what couldn't be auto-handled."

## Story

- **As:** Project developer or maintainer
- **I want to:** quickly review the difference between the new schema and the current document. Then they can easily update the current document to match the new schema.
- **So that:** If without this skill, they need to review all the documents manually.
- **Trigger:** On demand when the schema updates and current documents need to match the new schema

## Expected Behavior

`/schema-update` helps a project developer or maintainer compare the current document set against a new schema and update affected documents to match it. It classifies schema changes, migrates documents where it can, asks for confirmation before destructive changes, and reports what was updated, deferred, or left for manual review. Without `/schema-update`, the user has to inspect every document manually to understand schema differences and bring the docs back into alignment.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Multi-turn: interview → classification confirmation → schema-file writes → document migration (with per-document Class 3 confirmations) → migration report.

### Command

```
/schema-update
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| (none) | — | The skill takes no positional arguments; the desired change set is collected conversationally during the interview step. |

### Stdin

Not applicable in the OS sense — input is multi-turn conversational. The skill ingests:

- The user's description of the desired change set across the 12 categories (5 format-side + 6 workflow-side + "something else")
- Optional clarifications when changes are ambiguous (E2)
- Explicit "proceed" confirmation on the classification table (Step 4)
- Per-document yes/no on Class 3 changes (Step 6)
- Per-document confirmation on the v1 → current cascade (Step 7b — Interface Contract drop, api-type assignment)
- Existing `docs/schema/format.md` and `docs/schema/workflow-rules.md` (when present)
- Defaults from `skills/init/references/format.md` and `references/workflow-rules.md` (for bootstrap-mode baseline)
- Every UC/US/ADR/plan file under `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, `docs/adr/` (for stale-version detection + migration)

### Stdout

Multi-turn structured output:

- **Interview turn**: 12 categories presented; collect answers
- **Classification turn**:

  ```
  Change classification
  ──────────────────────────────────────────────────────
  Class 1 (auto):   [list of changes]
  Class 2 (flag):   [list of changes — will insert placeholders]
  Class 3 (confirm): [list of changes — will show content before deleting/restructuring]
  ```

- **Per-document Class 3 prompts** (during Step 6):

  ```
  Document: docs/drafts/use-cases/uc-005-checkout/use-case.md
  Affected section: "Notes"
    [section body content shown verbatim]
  Confirm removal of this content? (yes / keep for now)
  ```

- **Final migration report**:

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

  If workflow-rules.md was modified: append `Workflow rules: updated — review docs/schema/workflow-rules.md`

### Stderr

Not separately addressed. E1 (truly fresh project — suggest `/init`), E2 (ambiguous change), E3 (abandonment), E7 (malformed schema frontmatter), E8 (concurrent in-flight skill), E9 (document has higher version than schema) surface inline; only E1 and E7 typically halt before any writes.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success — format changes only | format.md version bumped; every stale document migrated; per-class report printed |
| Success — workflow-rules changes only | workflow-rules.md version bumped; NO document migration runs; report notes the workflow-rules update |
| Success — both | Both files version-bumped independently; document migration runs |
| Success — bootstrap mode | Both schema files written for the first time; legacy documents have frontmatter inserted; "bootstrapped" tags in report |
| Stopped — truly fresh project (E1) | Nothing written; user told to run `/init` instead |
| Stopped — ambiguous change (E2 unresolved) | Nothing written; user asked to clarify |
| Stopped — abandonment at classification (E3) | Nothing written |
| Class 3 user declines on a document (E4) | That document deferred; other documents continue; reported in summary |
| Legacy document with unrecognised headings (E5) | Document unmodified; flagged in "Manual review" |
| Path doesn't match any known doc-type (E6) | Document unmodified; flagged in "Manual review" |
| Schema frontmatter malformed (E7) | Nothing written; user told to repair manually |
| Concurrent in-flight skill detected (E8) | User warned; asked whether to proceed or abort |
| Document has higher version than schema (E9) | Document not downgraded; flagged for Manual review |
| Bootstrap + changes in same run (E10) | Bootstrap first, then changes applied on top; report distinguishes "bootstrapped" from "evolved" |

### Side effects

- File writes at `docs/schema/format.md` (when format-side changes) — version field bumped, YAML frontmatter and markdown body updated
- File writes at `docs/schema/workflow-rules.md` (when workflow-side changes) — independent version bump, YAML frontmatter and body updated
- File edits to every stale document under `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, `docs/adr/`:
  - Heading text edits (Class 1 renames)
  - Section inserts with placeholder content (Class 2 adds)
  - Section deletions (Class 3 removes — only after per-document confirmation)
  - Frontmatter inserts (bootstrap mode for legacy files)
  - `schema-version` bump on every successfully-migrated document
- **No** writes under `src/` (hard invariant)
- **No** writes under `tests/` (hard invariant)
- **No** writes to `docs/drafts/coverage.md` (brownfield-loop state)
- **No** edits to unrecognised documents — Manual-review path is the only acceptable handling
- **No** Class 3 writes without per-document user confirmation (load-bearing)
- **No** auto-repair of malformed schema frontmatter (risk of misinterpreting intent)
- **No** silent version-downgrade of documents whose frontmatter is ahead of the schema
- **No** git operation at any step: no `git add`, no `git commit`, no `git push`, no auto-`git init`
- **No** invocation of other skills

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/schema-update/us-012-*.test.*`.

### Scenario 1: Documents updated to match the new schema

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (happy path Class 2 — add a "Compliance Notes" section to every UC → placeholder `(to be filled in)` inserted; report's "Needs content" list names every UC + the new section name)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (happy path Class 3 — remove a section with content → per-document prompts shown; user confirms on 3, declines on 2; 3 are removed, 2 are deferred; report shows both lists)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (workflow-rules-only change — switch ID policy from highest-plus-one to gap-fill → workflow-rules.md version bumped; NO document migration runs; report notes workflow-rules update only)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (both schemas changed in one run — format add-section + workflow rule change → format.md and workflow-rules.md independently version-bumped; document migration runs for the format side only)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (bootstrap mode — no docs/schema/ at all, but docs/use-cases/uc-001/ has legacy files → schema files written for first time; legacy files get frontmatter inserted with doc-type/sections/api-type inferred from path + headings + interface section shape)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (v1 → current cascade — document has `doc-type: module-use-case` → renamed to `use-case`; `source` key → `serves`; `interface-contract` drop confirmed per-document; schema-version bumped)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (v1 → current cascade — document has `doc-type: module-user-story` → renamed to `user-story`; `derived-from` → `serves`; `interface-contract` key → `api-contract`; api-type defaults to `function` unless user confirms otherwise)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (ambiguous change "add a section" without a name → E2: skill asks for clarification; nothing written until name supplied)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (legacy document with unrecognised headings → E5: document untouched; flagged in "Manual review" with the unrecognised headings listed)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (legacy document at an unrecognised path — e.g. docs/notes/random.md → E6: untouched; flagged in "Manual review" with the path)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (truly fresh project with no docs and no schema → E1: skill suggests `/init` instead; makes no changes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (existing schema frontmatter is malformed YAML → E7: skill refuses to read the version, asks user to fix manually; nothing written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (a UC document's frontmatter `schema-version: 3` while format.md is at `version: 2` → E9: never downgrade; flag for Manual review; user asked how to reconcile)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 15: TBD (concurrent in-flight `/apply` detected (recent drafts modified after format.md mtime) → E8: warn user; ask whether to proceed or abort)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 16: TBD (bootstrap mode + custom changes in same run — E10: bootstrap first, then changes on top; report distinguishes "bootstrapped" tags from "evolved" tags)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 17: TBD (post-run `git status` shows schema files + every migrated document as unstaged changes; no commit created by this skill)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 18: TBD (Class 3 confirmation is genuinely per-document — user confirms on 3 of 5, declines on 2; the 2 declined documents are completely untouched (no heading edit, no sections-map edit, no schema-version bump))

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the project-maintenance step of the cross-workflow business US.
