---
schema: agent-skills
schema-version: 0
doc-type: use-case
id: UC-010
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

# UC-010: Bootstrap the brownfield documentation workflow

Discover every module in the project, create a coverage tracker (`docs/drafts/coverage.md`) so subsequent brownfield skills (`/scan-deep`, `/elicit`, `/compose`) have a consistent starting point, and seed `docs/overview/architecture.md`'s Module Overview table with one TBD row per discovered module. Strict one-level module definition: a module is a **direct subdirectory of `src/`** (or the user-confirmed equivalent root); nested directories are part of their parent module. Update mode is **strictly append-only** — never rewrites existing rows or flips checkbox states.

## Primary Actor

Inbound CLI invocation via the `/scan-all` slash command in Claude Code. Typically run immediately after `/init` on a project that already has code but no documentation, or any time the user wants to start brownfield documentation on an existing undocumented codebase.

## Source

TBD (will be linked after /compose) — belongs to the brownfield documentation workflow: `/scan-all → scan-deep → elicit → compose`.

## Preconditions

- A source directory exists in the project: `src/` is the default; if absent, the skill looks for `app/`, `lib/`, `cmd/`, `packages/`; if multiple alternative roots exist, the skill asks the user which one to use; if nothing is found, the skill asks the user where module code lives
- At least one direct subdirectory of the source root exists — otherwise the skill reports "no module directories found" and stops
- `docs/drafts/coverage.md` either does not exist (→ **create mode**) or exists with a parseable Markdown table (→ **update mode**, strictly append-only)
- `docs/overview/architecture.md` either does not exist (→ scan-all creates the full stub) or exists with a `## Module Overview` section that has a Markdown table (→ scan-all appends rows only)
- The user is available for synchronous confirmation when the source-directory resolution is ambiguous (E1, E2, E3)

## Business Rules

None — the technical preconditions cover it.

## Postconditions

On success (create mode):

- `docs/drafts/coverage.md` exists with one row per module discovered, sorted alphabetically. Row format: `| {module} | src/{module}/ | [ ] | [ ] | [ ] | {notes} |` where `{notes}` is `no tests found`, `single-file module`, or blank (based on per-module observation)
- `docs/overview/architecture.md` exists; either it was created from the full stub (Module Overview table with all discovered modules + Directory Structure boilerplate + System Diagram placeholder + Key Cross-Module Interaction Patterns section), or its existing `## Module Overview` table was appended with one TBD row per newly-discovered module
- `docs/drafts/` and `docs/overview/` directories exist (created if needed)
- A summary block has been printed listing modules found, mode used, file paths created/updated, and the recommended next step (`/scan-deep` on the first unchecked module)

On success (update mode):

- `docs/drafts/coverage.md` has one new row appended per module that wasn't already listed; all existing rows are byte-for-byte unchanged (no checkbox state changed, no Notes re-derived, no rows reordered)
- `docs/overview/architecture.md` has one new Module Overview row appended per new module; existing rows and all other sections (Directory Structure, System Diagram, Key Cross-Module Interaction Patterns) are unchanged
- If no new modules were found, both files are left untouched; the summary states "`coverage.md` is already up to date — no new modules found in `src/`"

Invariants (apply in both modes):

- **No source code touched**: zero writes under `src/`
- **No tests touched**: zero writes under `tests/`
- **No git operation**: zero `git add`, zero `git commit`, zero `git push`; no auto-`git init`
- **No module UC/US drafts created** — that's `/scan-deep`'s job
- **No Notes re-derivation in update mode** — Notes are a "first observation" snapshot per module; later changes are owned by `/scan-deep` or by manual edits
- **Strict one-level module definition** — `src/payment/handlers/` does NOT become its own module; it is part of `payment`

## Main Flow

1. **Pre-flight — find source directory**:
   - Check `src/`. If present → use it
   - Otherwise check `app/`, `lib/`, `cmd/`, `packages/`. If exactly one is present, ask the user to confirm "I found `{dir}/` — should I treat that as the modules directory?"; wait for confirmation
   - If multiple alternatives exist, list them and ask the user which to use; do NOT guess
   - If nothing matches, ask the user where module code lives. Do NOT proceed until a directory is confirmed
2. **Pre-flight — detect mode**:
   - `ls docs/drafts/coverage.md` — present → **update mode**; absent → **create mode**
   - `ls docs/overview/architecture.md` — present → append; absent → full-stub creation
3. **Discover modules** — `find {source-root}/ -mindepth 1 -maxdepth 1 -type d | sort`. If zero directories: report "no module directories found in `{source-root}/`" and stop. **Hard invariant**: never descend deeper than one level; nested dirs are part of their parent
4. **Collect Notes per module** — for each discovered module:
   - Test files? `find {source-root}/{module}/ -name "*.test.*" -o -name "*_test.*" -o -name "*spec*" | head -1` — if no hits anywhere in the subtree → `no tests found`
   - Single-file? `find {source-root}/{module}/ -maxdepth 1 -type f | wc -l` — if exactly 1 → `single-file module`
   - Otherwise → blank
5. **In update mode — diff against existing coverage**:
   - Read `docs/drafts/coverage.md`; parse the existing rows; identify the set of modules already listed
   - Compute the diff: modules discovered in Step 3 minus modules already listed → the "new modules" set
   - If new modules is empty, skip Step 6 and Step 7 (no writes); print the "coverage.md is already up to date" message in Step 8
6. **Write/append `docs/drafts/coverage.md`**:
   - Create mode: `mkdir -p docs/drafts`; write the file with the standard header (`# Documentation Coverage` + the table header) and one row per discovered module, alphabetically sorted, all checkboxes `[ ]`
   - Update mode: append one row per new module at the end of the existing table; do NOT modify any existing row (including checkbox states, Notes, and ordering)
7. **Write/append `docs/overview/architecture.md`**:
   - Architecture exists: find `## Module Overview` and its table; append one `| {module} | TBD (fill in after /scan-deep) |` row per new module. Do NOT touch any other section
   - Architecture doesn't exist: `mkdir -p docs/overview`; write the full stub: H1 `# Architecture`, the `## Module Overview` table populated with all discovered modules + TBD responsibilities, the standard `## Directory Structure` table, an empty `## System Diagram` block with a parenthetical placeholder, and an empty `## Key Cross-Module Interaction Patterns` section
8. **Print summary block** — modules found / mode used / coverage.md and architecture.md paths / modules discovered (one line per module with source path and notes) / recommended next step (`/scan-deep` to start documenting the first unchecked module)
9. **Stop without committing** — no `git add`, no `git commit`, no `git push`. The workflow expects later skills (`/scan-deep`, `/elicit`, `/compose`, `/merge`) to make their own decisions about staging and commit policy. The files are visible in `git status` as new or modified

## Exception Flows

- **E1 — `src/` is absent and exactly one fallback exists** (recoverable): ask the user "I found `{dir}/` — should I treat that as the modules directory?"; wait for yes/no. Do NOT proceed on assumption
- **E2 — Multiple fallback directories exist** (recoverable): e.g. both `app/` and `lib/`; list them; ask the user which one is the modules directory; do NOT guess. This avoids accidentally bootstrapping coverage for the wrong tree
- **E3 — No source directory found at all** (contact support): ask the user "Where does this project keep its module code?"; accept their path and proceed. Do NOT default to creating `src/`
- **E4 — Source directory exists but has zero subdirectories** (recoverable): report "no module directories found in `{source-root}/`. Nothing to scan." Stop. Do NOT create empty coverage.md / architecture.md
- **E5 — Update mode but no new modules** (recoverable): skip the file-write steps; print "coverage.md is already up to date — no new modules found in `src/`". This is success, not failure
- **E6 — Existing `coverage.md` has a non-standard table layout** (recoverable): extra columns, different header, etc.; refuse to append (would risk corrupting the user's customisations); report the structural mismatch; ask the user whether to recreate it (which would lose state) or to fix the header manually first
- **E7 — `architecture.md` exists but has no `## Module Overview` section** (recoverable): do NOT auto-add the section (that risks disturbing the user's organisation); report the missing section as a warning; the coverage.md update still proceeds; the user can add the section manually and re-run, or `/scan-deep` can later prompt
- **E8 — A nested directory looks like it might be a sibling module** (recoverable): e.g. `src/payment/auth/` looks like an auth module; explicitly does NOT register it. The one-level rule is a hard invariant. If the project's structure genuinely has logical modules at depth >1, the user must reshape `src/` (move them up, or convert to a monorepo `packages/` layout) before re-running
- **E9 — User invokes `/scan-all` on a project that already has confirmed module docs** (contact support): under `docs/modules/`; proceed normally in update mode. The presence of confirmed module docs does NOT block scan-all (the workflow expressly supports late-arriving brownfield documentation on top of existing artifacts); flag in the summary that confirmed module docs exist so the user knows scan-all does not re-verify them

## Serves

TBD (will be linked after /compose) — expected target: the brownfield bootstrap step of the workflow business UC.
