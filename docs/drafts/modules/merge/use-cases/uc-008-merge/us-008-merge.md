---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-008
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

# US-008: Run /merge to promote completed-plan drafts to confirmed docs (no commit)

## Belongs to

UC-008 — Promote completed-plan drafts to confirmed docs (no commit) (module `merge`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the greenfield workflow business US, where the user-facing step is "the plan I implemented is done — every checkbox is `[x]`, all tests pass — I want the drafts moved to their permanent homes, the US files trimmed to their confirmed shape, the module READMEs and architecture diagram brought up to date, and the plan file cleaned up; I do not want this step to commit anything because review comes next."

## Story

- **As:** Project developer or maintainer
- **I want to:** merge the docs from drafts to persistent store.
- **So that:** Then there are 2 version of ducument. One is original doc but doesn't match user requirement and code. Another one is drafts doc only updated part not full information.
- **Trigger:** On demand after implementing workable code and preparing to merge docs from drafts to persistent doc storage

## Expected Behavior

`/merge` gives a project developer or maintainer a controlled way to move completed documentation from `docs/drafts/` into persistent confirmed documentation after workable code has been implemented. It removes the draft-path boundary, promotes the updated docs to their permanent storage locations, and cleans up the plan state without committing the changes. Without `/merge`, the project keeps two competing document versions: older confirmed docs that no longer match the user requirement or code, and draft docs that contain only the updated portion rather than the full persistent source of truth.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Single-pass: pre-flight check → checklist → promotion (lock-step substeps) → cleanup → summary. Interactive only when the plan name is ambiguous or a behavioral test BLOCKER fires.

### Command

```
/merge [plan-name]
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `plan-name` | optional | Specific plan to merge, e.g. `plan-002` or `plan-002-checkout`. When omitted, the skill globs `docs/drafts/plans/plan-*.md`; uses the single match if present; otherwise lists candidates and asks. |

### Stdin

Not applicable in the OS sense — input is conversational. The skill ingests:

- The named plan file (or the glob match) under `docs/drafts/plans/`
- `docs/schema/format.md` and `docs/schema/workflow-rules.md` (or embedded defaults)
- Every UC/US folder named in the plan's Scope under `docs/drafts/use-cases/` and `docs/drafts/modules/{module}/use-cases/`
- Every behavioral test file at `tests/behavioral/{module}/us-{id}-*.test.*` (checked for existence — content not parsed)
- `docs/overview/api-spec.yaml` (for the rest api-type endpoint check)
- `src/` (only for the ADR-supersession inline-comment cleanliness check — never written to)
- Module README files at `docs/modules/{module}/README.md` (for append; created if absent)
- `docs/overview/architecture.md` (read for Module Overview check; written for the new-module case, including the Mermaid diagram)
- Optional in-line answers to E2 (plan ambiguity), E4 (partial-merge refusal), E6 (malformed README), E10 (commit-request refusal)

### Stdout

Single-turn structured output:

```
Pre-merge checklist
────────────────────────────────────────
UC main flow     PASS
Behavioral tests PASS  (4 files verified)
API Contract     WARN  POST /payments not found in api-spec.yaml
TBD references   2 found — will resolve
New module       SKIP  (no new module detected)
ADR supersession PASS  (include only when ADR supersession is involved)
────────────────────────────────────────
1 warning — proceeding. Review warnings in final summary.
```

…followed by promotion progress lines, then:

```
## Merge Complete

Plan:    {plan-name}

### Promoted
- docs/use-cases/uc-{id}-{name}/              (business layer)
- docs/modules/{module}/use-cases/uc-{id}-…/  (module layer)
- docs/adr/{id}-{name}.md                      (if any ADRs)

### Updated
- docs/modules/{module}/README.md              (UC-001 US-001, US-002 appended)
- docs/overview/architecture.md                (Module Overview + system diagram)

### Cleaned up
- docs/drafts/plans/{plan-name}.md             (deleted)

### Warnings
- [API Contract: POST /payments not found in api-spec.yaml]
- [TBD: ADR-002 reference in UC-001 could not be resolved — still in drafts]

Ready for /verify — run it to confirm doc/code/test alignment before opening a PR to main.
```

Notably absent: any "Commit: {hash}" line — this skill performs no git operation. If there are no warnings, the Warnings section is omitted.

### Stderr

Not separately addressed. E1 (unchecked plan items), E3 (missing test files), and the BLOCKER row in the pre-merge checklist halt the skill inline before any move; E4 / E5 / E6 / E10 surface inline and continue or halt depending on the case.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success | Drafts promoted; US api-contracts simplified; ADRs adopted (and superseded ones deleted); READMEs appended; architecture.md + diagram updated when needed; plan file deleted; doc changes unstaged in the working tree. Ready for `/verify` |
| Blocked — unchecked plan items (E1) | Nothing moved or deleted; user told which items remain `[ ]` |
| Blocked — missing behavioral test file (E3 / pre-merge HARD BLOCKER) | Nothing moved or deleted; user told which test paths are missing |
| Refused — partial merge (E4) | Nothing moved or deleted; user told partial merges are not supported |
| Refused — commit request (E10) | Promotion still completes (if pre-flight passes); skill refuses the commit and tells the user `/verify` is the next step |
| Warnings only | Promotion completes; warnings printed in the summary; user can elect to resolve them before `/verify` |

### Side effects

- **File moves** (using `git mv` semantics where appropriate; if not in a git repo, plain rename):
  - `docs/drafts/use-cases/uc-{id}-{name}/*` → `docs/use-cases/uc-{id}-{name}/*`
  - `docs/drafts/modules/{module}/use-cases/uc-{id}-{name}/*` → `docs/modules/{module}/use-cases/uc-{id}-{name}/*`
  - `docs/drafts/adr/adr-draft-{id}-{name}.md` → `docs/adr/{id}-{name}.md`
  - `docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md` → `docs/modules/{module}/adr/{id}-{name}.md`
- **File edits**: api-contract section body replaced with the api-type-keyed one-line summary in every moved US; ADR `Status: Proposed (date)` → `Status: Adopted (today)` in every moved ADR; module README `## Confirmed Use Cases` table rows appended (or README created from template); `architecture.md` Module Overview table row appended **and the Mermaid system diagram block directly edited** to include the new module + edges; TBD references in just-moved files patched where their target was also moved
- **File deletes**: the plan file `docs/drafts/plans/plan-{id}-{name}.md`; superseded confirmed ADR(s) when `lifecycle.adr-supersession-deletes-old: true`
- **Preserved**: empty `docs/drafts/` subfolders remain after promotion (reused by future drafts)
- **No writes to `src/` or `tests/`** at any step (hard invariant)
- **No `git add`, no `git commit`, no `git push`** at any step (hard invariant — this is the explicit boundary from UC-008)
- **No auto-`git init`** if the working tree is not a git repo — the file moves still happen as plain renames
- **No** modifications to `docs/drafts/coverage.md` — that file is brownfield-loop state (`/scan-all`, `/scan-deep`, `/compose`), not merge's concern
- **No** auto-fill of the "Design Patterns" section in module READMEs — that's engineer judgment

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/merge/us-008-*.test.*`.

### Scenario 1: Docs merged from drafts to persistent storage

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (plan has unchecked items → E1: nothing moved, skill lists unchecked items, exits)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (behavioral test file missing for an in-scope US → pre-merge HARD BLOCKER: nothing moved, missing paths listed)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (US with `api-type: rest` → api-contract section collapses to `- Endpoint: {method} {path}`; legacy doc without api-type frontmatter has type inferred from sub-headings)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (US with `api-type: function` → api-contract section collapses to `- Signature: {sig}`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (US with `api-type: none` → api-contract section is removed entirely)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (ADR draft in scope → moved to confirmed location with Status flipped to Adopted; if Background names a superseded ADR, the old confirmed ADR file is deleted)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (module README doesn't exist → created from template; "Design Patterns" placeholder NOT auto-filled)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (new-module flag fires → Module Overview table row appended AND the Mermaid system diagram is directly edited to include the new module with edges to its neighbors)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (TBD reference in a just-moved file points to another file moved in the same run → reference is patched to the new confirmed path; TBDs whose target stays in drafts are left unchanged)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (user invokes `/merge` and asks for partial promotion of only some UCs from the plan → E4: skill refuses, makes no changes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (`architecture.md` doesn't exist when new-module flag fires → E7: skill creates a stub with the new module already in the Module Overview + a minimal Mermaid diagram; flags it in warnings)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (user asks merge to also run `git commit` → E10: skill refuses, completes promotion if pre-flight passed, reminds user `/verify` is the next step)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (after a successful run, `git status` shows the doc changes as unstaged — no commit was created by this skill)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 15: TBD (no `src/` or `tests/` file is touched anywhere in the run — confirmed by a post-run scan)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the promotion / pre-PR step of the greenfield workflow business US.
