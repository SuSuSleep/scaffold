---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-010
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

# US-010: Run /scan-all to bootstrap the brownfield doc workflow

## Belongs to

UC-010 — Bootstrap the brownfield documentation workflow (module `scan-all`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the brownfield workflow business US, where the user-facing step is "I have an existing codebase with no docs — I want a tracker that lists every module and a seed architecture.md so the rest of the brownfield skills (`/scan-deep`, `/elicit`, `/compose`) all know what's in scope without me re-listing my project structure each session."

## Story

- **As:** Project developer or maintainer
- **I want to:** start rebuilding document work for this brownfield project.
- **So that:** If this skill disappeared overnight, then user need to manually to do the checklist for reviewing project.
- **Trigger:** On demand when they want to understand how many modules exist in the project branch and what those modules are

## Expected Behavior

`/scan-all` helps a project developer or maintainer start rebuilding documentation for a brownfield project by discovering the project's modules and creating the coverage checklist used by later documentation steps. It records what modules exist, seeds the architecture overview, and gives the user a clear starting point for `/scan-deep`, `/elicit`, and `/compose`. Without `/scan-all`, the user has to manually inspect the project and build the checklist for reviewing and rebuilding the docs.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Single-turn structured output: pre-flight → discovery → write/append → summary. Interactive only when source-directory resolution is ambiguous (E1/E2/E3), the existing coverage table is malformed (E6), or architecture.md is missing the Module Overview section (E7).

### Command

```
/scan-all
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| (none) | — | The skill takes no positional arguments; the source directory is resolved by convention (`src/` default, fallbacks, or asks). |

### Stdin

Not applicable in the OS sense — input is conversational. The skill ingests:

- The project's directory layout: presence/absence of `src/`, `app/`, `lib/`, `cmd/`, `packages/`
- The direct subdirectory listing of the resolved source root
- For each module: a glob result for test files (`*.test.*` / `*_test.*` / `*spec*`) and a file count in the module's top level
- `docs/drafts/coverage.md` content (if present — for update mode)
- `docs/overview/architecture.md` content (if present — to find `## Module Overview` and decide between append vs full-stub creation)
- Optional in-line answers to E1 (single-fallback confirm), E2 (multi-fallback pick), E3 (manual source path), E6 (recreate-or-fix malformed coverage), E7 (architecture.md missing Module Overview)

### Stdout

Single-turn structured summary:

```
scan-all complete
──────────────────────────────────────────────────────
Modules found:   {N}
Mode:            {create | update — {N} new modules added}

Coverage file:   docs/drafts/coverage.md
Architecture:    docs/overview/architecture.md  (Module Overview updated)

Modules discovered:
  {module-a}    src/{module-a}/    {notes or —}
  {module-b}    src/{module-b}/    {notes or —}
  ...

──────────────────────────────────────────────────────
Next: run /scan-deep to start documenting the first unchecked module.
```

Special case (update mode, no new modules):

```
coverage.md is already up to date — no new modules found in `src/`.
```

E4 (no subdirectories) emits:

```
No module directories found in `{source-root}/`. Nothing to scan.
```

### Stderr

Not separately addressed. E1 / E2 / E3 / E6 / E7 surface inline as questions or warnings. E4 halts without writing anything; E5 is a benign success path.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success — create mode | `coverage.md` written from scratch; `architecture.md` either created from full stub or had Module Overview appended; summary printed. Ready for `/scan-deep` |
| Success — update mode with new modules | New rows appended to coverage.md and architecture.md; existing rows byte-stable. Ready for `/scan-deep` on the newly added modules |
| Success — update mode, no new modules (E5) | No file written; "coverage.md is already up to date" message |
| Stopped — no source directory (E3 unanswered) | Nothing written; user told to confirm where code lives |
| Stopped — no subdirectories (E4) | Nothing written; "no modules to scan" message |
| Stopped — malformed existing coverage (E6) | Nothing written; user asked whether to recreate (losing state) or fix the header manually |
| Partial success — architecture.md has no Module Overview (E7) | coverage.md updated; architecture.md untouched; warning surfaced |

### Side effects

- File writes (or appends) at:
  - `docs/drafts/coverage.md` (create mode: full file; update mode: rows appended to existing table)
  - `docs/overview/architecture.md` (create mode: full stub; update mode: rows appended to Module Overview table)
- Directory creates: `docs/drafts/` and `docs/overview/` (only if missing)
- **No** writes under `src/` at any step (hard invariant)
- **No** writes under `tests/` at any step (hard invariant)
- **No** module UC/US drafts created (that's `/scan-deep`'s job)
- **No** edits to existing rows in `coverage.md` or to existing checkbox states (append-only on update)
- **No** Notes re-derivation in update mode — Notes are a "first observation" snapshot
- **No** edits to `architecture.md` sections other than Module Overview when the file already exists
- **No** edits to the System Diagram or Mermaid block (creation-only inclusion of the empty placeholder; never modified afterward by this skill)
- **No** git operation at any step: no `git add`, no `git commit`, no `git push`, no auto-`git init`
- **No** invocation of other skills — produces files and a summary, then stops

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/scan-all/us-010-*.test.*`.

### Scenario 1: Brownfield documentation checklist created from discovered modules

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (update mode — coverage.md already lists 2 modules; 1 new module added to `src/`; new row appended; existing rows byte-stable; existing checkbox states untouched)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (update mode, no new modules → E5: no file written; "coverage.md is already up to date" message)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (nested module candidate — `src/payment/handlers/` exists; only `payment` becomes a module; `handlers` is silently ignored as a sub-implementation detail)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (no `src/`, one fallback present (e.g. `lib/`) → E1: skill asks "I found `lib/` — should I treat that as the modules directory?"; on yes, proceeds; on no, asks for path)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (no `src/`, multiple fallbacks present (e.g. `app/` AND `lib/`) → E2: skill lists candidates and asks which to use; never auto-guesses)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (no source directory at all → E3: skill asks "Where does this project keep its module code?"; waits for path)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (source directory exists but has zero subdirectories → E4: "no module directories found" message; nothing written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (Notes derivation — module with `*.test.ts` file → blank Notes; module with no tests → `no tests found`; module with exactly one source file → `single-file module`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (existing coverage.md has extra columns or non-standard header → E6: skill refuses to append; asks whether to recreate (loses state) or fix manually)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (existing architecture.md has no `## Module Overview` section → E7: coverage.md still updated; architecture.md untouched; warning in summary)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (post-run `git status` shows `coverage.md` and `architecture.md` as new/modified; no commit has been created by this skill)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (project has confirmed module docs already in `docs/modules/` → E9: scan-all proceeds normally; summary flags that confirmed docs exist for cross-reference awareness)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (update-mode coverage write — even if an existing row's `Notes` is now stale (e.g. tests were added since the original scan), scan-all does NOT update it; Notes are a first-observation snapshot)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the brownfield bootstrap step of the workflow business US.
