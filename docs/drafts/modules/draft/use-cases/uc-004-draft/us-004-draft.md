---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-004
api-type: cli
sections:
  belongs-to: Belongs to
  derived-from: Derived from
  story: Story
  expected-behavior: Expected Behavior
  api-contract: Interface Contract
  test-scenarios: Test Scenarios
  serves: Serves
---

# US-004: Run /draft to translate a requirement change into docs/drafts/

## Belongs to

UC-004 — Express a business requirement change in docs/drafts/ (module `draft`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the greenfield workflow business US, where the user-facing step is "I have an idea, a change, or a cancellation in mind for what this project should do — I want it captured in docs/drafts/ as a coherent change set without having to manage IDs, ADR triggers, cross-references, or the confirmed-vs-draft boundary myself."

## Story

- **As:** product owner, engineer, or coding agent expressing business intent (anyone authorised to add / change / cancel a requirement, or supersede an ADR)
- **I want to:** describe a requirement change in plain language and end up with `docs/drafts/` reflecting that change correctly — including any ADR drafts, cross-reference repairs, and the copy-from-confirmed dance — without having to remember the lifecycle rules myself
- **So that:** without `/draft`, the project loses its "requirement intake" channel; every change to business intent has to manually navigate `docs/drafts/` plus the confirmed-doc copy rule, increasing the chance of accidental edits to confirmed files and broken cross-references
- **Trigger:** on demand — whenever business intent shifts: new feature requested, requirement reconsidered, feature dropped, or an architectural decision being reconsidered

## Expected Behavior

`/draft` reads the conversation, derives a complete operation set (any mix of CREATE, UPDATE, DELETE, COPY-from-confirmed, ADR-create, or ADR-supersession), and executes it in a single ordered pass over `docs/drafts/`. Confirmed docs in `docs/use-cases/`, `docs/modules/`, and `docs/adr/` are never edited directly — they are copied to their mirror path under `docs/drafts/` first and the change is applied to the copy. ADR supersession additionally scans every confirmed doc carrying the old ADR reference, copies each into drafts with the reference rewritten to TBD, and prints a `⚠ REVIEW REQUIRED` cascade block that gates downstream skills until the user reviews.

## Interface Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Predominantly a single-turn skill that derives the operation set from prior conversation; interactive only on E1 ambiguity and a few other exception paths.

### Command

```
/draft
```

(Most invocations carry no arguments — the requirement intent is supplied as conversational context. Implementations may accept an inline argument like `/draft cancel UC-007` as shorthand for a single operation, but the canonical form reads intent from the conversation.)

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| (positional / free-form) | optional | Shorthand for a single operation, e.g. `/draft cancel UC-007`, `/draft supersede ADR-012`. When omitted, the skill derives the operation set from prior conversation. |

### Stdin

Not applicable in the OS sense — input is conversational. The skill ingests:

- The user's requirement intent (current and prior conversation turns)
- `docs/schema/format.md` (or fallback `skills/init/references/format.md`)
- `docs/schema/workflow-rules.md` (or embedded defaults)
- Existing draft folder structure under `docs/drafts/`
- Confirmed docs under `docs/use-cases/`, `docs/modules/`, `docs/adr/`, `docs/modules/*/adr/`
- For ADR supersession: every file in those trees, scanned for `Related ADR: ADR-{old-id}` matches
- Optional in-line answers to E1 (ambiguity), E2 (cascade cancellation), E3 (missing ADR), E6 (overlap resolution)

### Stdout

Single-turn structured output, ending with one summary block (plus a second cascade block on supersession):

```
Draft update complete
──────────────────────────────────────────────────────
Created:    [list files with paths, or "none"]
Updated:    [list files with brief note on what changed, or "none"]
Deleted:    [list folders/files deleted, or "none"]
ADR:        [filename if created, or "not needed — [reason from checklist]"]
Refs fixed: [cross-references updated — omit if none]
May need review:
            [related docs found in Step 4 that weren't edited but might need
             human attention — omit if nothing flagged]
```

Appended only on ADR supersession:

```
ADR cascade
────────────────────────────────────────────────────────────────
Superseded:    [ADR-xxx — confirmed path]
New draft:     [docs/drafts/adr/adr-draft-{new-id}-{name}.md]
Affected docs: [every file copied to docs/drafts/ due to this ADR change,
                with the old ADR reference it carried]
Code refs:     Inline `// see ADR-{old-id}` in src/ will be updated by /apply
                — not done here.

⚠ REVIEW REQUIRED — [N] documents are affected by this ADR change.
  Review docs/drafts/ to confirm the scope and updated content
  before proceeding to /design-plan.
```

### Stderr

Not separately addressed. Ambiguity stops (E1, E3, E6) and conflict reports (E2, E4, E7, E8) are surfaced in the assistant's conversational message; E5 halts before any work.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success (no supersession) | `docs/drafts/` reflects the intended state; confirmed docs untouched; summary printed. Ready for `/review-draft` |
| Success (supersession) | Above + new ADR draft + impact-set copies + cascade summary; downstream skills are gated by `⚠ REVIEW REQUIRED` until the user acknowledges |
| Stopped on ambiguity (E1) | Nothing written; user asked a clarifying question |
| Stopped on missing referent (E3, E5) | Nothing written; user told what to fix (run `/init`; check ADR ID) |
| Cascade cancellation conflict (E2) | Partial change set executed up to the conflict; conflict surfaced; user asked whether to cascade |
| Copy-from-confirmed collision (E4) | Existing draft updated in place instead of overwritten; reported in summary |
| Overlap with existing UC (E6) | Nothing written until the user picks: modify existing / extract shared sub-UC / sibling UC |
| ID collision (E8) | Reassign and retry within the same run; never write under a colliding ID |

### Side effects

- File creates / writes / deletes under `docs/drafts/use-cases/`, `docs/drafts/adr/`
- For ADR supersession only: file creates under `docs/drafts/modules/{module}/use-cases/` (copies from confirmed module docs carrying the old ADR reference)
- Cross-reference text edits across `docs/drafts/` files
- **No** writes to confirmed locations: `docs/use-cases/`, `docs/modules/`, `docs/adr/`, `docs/modules/*/adr/`
- **No** writes to `src/` or `tests/` — including no edits to inline `// see ADR-{old-id}` comments (`/apply` owns that)
- **No** writes to `docs/drafts/coverage.md` (owned by `/scan-all`, `/scan-deep`, `/compose`)
- **No** writes to `docs/drafts/plans/` (owned by `/design-plan`)
- **No** git operations
- **No** test execution

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/draft/us-004-*.test.*`.

### Scenario 1: New requirement captured — UC + US folder created in docs/drafts/use-cases/

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (new requirement triggers all three ADR conditions → ADR draft auto-created alongside UC/US)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (requirement change to an existing draft → in-place edit per lifecycle.drafts-edit-in-place, no copy)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (requirement change to a confirmed UC → confirmed folder copied to docs/drafts/ mirror path and edited there; confirmed copy untouched)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (cancelled feature with no inbound references → folder deleted; summary lists deletion)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (cancelled feature with inbound draft references → references repaired first, then folder deleted)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (cancelled feature with inbound dependency another draft cannot survive → E2: conflict surfaced, user asked whether to cascade cancellation)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (ADR supersession — fan-out scan finds all docs with `Related ADR: ADR-{old-id}`, copies each to drafts, rewrites reference to TBD, prints cascade block with ⚠ REVIEW REQUIRED)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (ADR supersession but superseded ADR ID does not exist in confirmed docs → E3: cascade not written, user asked)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (ambiguous intent → E1: skill asks a clarifying question, makes no changes until answered)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (new requirement overlaps an existing UC → E6: skill asks whether to modify / extract shared sub-UC / create sibling)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (copy-from-confirmed target already has a draft → E4: existing draft updated in place, no overwrite)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (no schema and no embedded defaults → E5: skill refuses to write, tells user to run /init)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 14: TBD (mixed change set in one invocation — CREATE one feature + DELETE another + UPDATE a third → ordered execution: creates, then updates, then deletes, then ref repair; single summary block lists all)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 15: TBD (confirmed-doc inline `// see ADR-{old-id}` comments are NOT modified during ADR supersession — that remains /apply's job)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the requirement-capture step of the greenfield workflow business US.
