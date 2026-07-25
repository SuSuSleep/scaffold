---
schema: agent-skills
schema-version: 0
doc-type: user-story
id: US-007
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

# US-007: Run /init to bootstrap a project's documentation scaffold

## Belongs to

UC-007 — Bootstrap the project documentation scaffold (module `init`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the project-bootstrap workflow business US, where the user-facing step is "I'm starting on a project (either empty, or with code but no docs) — I want the full scaffold (AGENTS.md, CLAUDE.md, README.md, CONVENTIONS.md, docs/overview/, docs/schema/, empty workflow folders, stack-aware .gitignore) written in one pass, committed as one commit, and ready for the workflow skills to operate on."

## Story

- **As:** Project developer or maintainer
- **I want to:** import the based files for scaffold.
- **So that:** User can not cowork with ai agent based on scaffold(docs for everything)
- **Trigger:** On demand when starting a new project

## Expected Behavior

`/init` gives a project developer or maintainer a guided way to import the base scaffold files into a new project. It creates the standard orientation, convention, schema, overview, and workflow folders so the repo has docs for everything the coding agent needs to understand. Without `/init`, the user cannot reliably collaborate with an AI agent through the scaffold because the shared documentation structure is missing.

## Interface Contract

**api-type: `cli`** — invoked as a Claude Code slash command. Multi-turn within the conversation: pre-flight → 4 interview phases → preview confirmation → single-pass write → commit → summary. Interactive checkpoints at pre-flight (if scaffold exists) and preview (mandatory confirmation).

### Command

```
/init
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| (none) | — | The skill takes no positional arguments; all configuration comes from the interview. |

### Stdin

Not applicable in the OS sense — input is multi-turn conversational. The skill ingests:

- The user's answers to interview Q1–Q11 across Phases 1–4
- Overwrite-or-skip decisions from the pre-flight check (E1)
- "Proceed?" confirmation at preview (Step 2)
- Optional in-line clarifications for E3 (unknown tool defaults), E4 (unknown stack), E9 (refused premature population requests)
- The templates bundled with the skill at `skills/init/references/templates.md`, `references/format.md`, `references/workflow-rules.md`
- Existing filesystem state: pre-flight scaffold-file presence, `.gitignore` presence, git-repo presence

### Stdout

Per-turn output across the interview, then preview, then write, then summary:

- **Pre-flight turn**: list of any existing scaffold files + overwrite/skip question (only when something already exists)
- **Phase 1 turn**: Q1 + Q2 (project identity)
- **Phase 2 turn**: Q3 (stack) → inferred naming table → Q4 (confirm)
- **Phase 3 turn**: Q5 + Q6 + Q7 (test tool + commands + coverage threshold)
- **Phase 3b turn**: inferred quality-tool table → Q8 (confirm) → Q9 (build step?)
- **Phase 4 turn**: Q10 (HTTP?) → Q11 (base path) if yes
- **Preview turn**: full file list with descriptions, "Proceed? (yes / change something first)"
- **Write turn**: brief progress lines as files land
- **Summary turn**:

  ```
  ## Init complete

  Created {N} files. {commit hash if committed, or "no git commit"}

  ### Next steps

  Before writing features, fill in the project knowledge the scaffold left blank:

    /explore + /setup  →  Define testing strategy, domain glossary, coding
                           conventions, and any shared test helpers.

  When project knowledge is in place:

    /draft  →  Write your first use case.
  ```

### Stderr

Not separately addressed. E2 (preview declined), E5 (no git repo), E6 (non-HTTP), E7 (.gitignore exists), E8 (missing templates), E9 (premature-population refusal) are surfaced inline in the conversational stream.

### Exit codes / outcomes

| Outcome | State after the run |
| ------- | ------------------- |
| Success (git repo) | Full scaffold written; one git commit created (no push); summary printed. Ready for `/explore + /setup` then `/draft` |
| Success (no git repo) | Full scaffold written; commit step skipped; summary notes "Not a git repository — files written, no commit created" |
| Stopped at preview (E2) | Nothing written; user told to amend interview answers; loops back to relevant phase |
| Overwrite/skip decision pending (E1) | Nothing written until user answers; per-file write behavior governed by their decision |
| Missing references (E8) | Nothing written; user told which template is missing |
| Stack not in inference table (E4) | Skill degrades to free-form input for naming / quality commands; interview continues |
| Non-HTTP project (E6) | api-spec.yaml not written; not listed in summary |
| User asks for premature population (E9) | Skill refuses politely; recommends the right downstream skill; interview continues |

### Side effects

- File writes at project root: `AGENTS.md`, `CLAUDE.md`, `README.md`, `CONVENTIONS.md`
- File writes under `docs/overview/`: `architecture.md`, `test-strategy.md`, `api-spec.yaml` (HTTP-only), `glossary.md` (stub)
- File writes under `docs/schema/`: `format.md` and `workflow-rules.md` (**copied verbatim** from `skills/init/references/`)
- Directory creates: `docs/schema/`, `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, `docs/adr/`
- `.gitignore` create-or-append: stack-specific block + universal block + tool-specific cache/output dirs identified in Phase 3/3b, framed by the section header `# ── Added by @sususleep/scaffold — {date} ({stack}) ──`
- One `git add` (explicit file list) + one `git commit` (fixed message format) — only when the working tree is a git repo
- **NO push** — local commit only
- **NO writes** to `src/`, `tests/`, or any project-source code
- **NO writes** to docs/drafts/coverage.md (owned by `/scan-all`)
- **NO ongoing schema evolution** — initial schema files are copied once; `/schema-update` owns later changes
- **NO filling-in** of `architecture.md` Module Overview (`/scan-all` + `/scan-deep` + `/merge`), `glossary.md` (`/setup`), or any UC/US/ADR/plan documents (their respective skills)
- **NO auto-`git init`** when the working tree is not a git repo — the commit step skips, but the user is not forced into a git repo

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/init/us-007-*.test.*`.

### Scenario 1: Base scaffold files imported into a new project

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (HTTP API project — Q10=yes, Q11 supplies base path → api-spec.yaml is written with that base path; non-HTTP path omits the file)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (no git repo at commit time → E5: files written, commit step silently skipped, summary notes "no git commit"; no auto-`git init`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD (pre-flight detects existing AGENTS.md → E1: skill lists existing files and asks overwrite-or-skip; user picks skip; existing files untouched, missing files still written)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (user declines preview at Step 2 → E2: nothing written, skill loops back to amend a specific phase based on user input)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (`.gitignore` already exists → E7: scaffold section appended at the end with the section header marker; existing entries not deduplicated or reordered)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (stack not in inference table → E4: skill degrades to free-form input for conventions / quality commands; interview continues without blocking)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (`skills/init/references/format.md` missing → E8: skill refuses to run and tells user to restore references; does not regenerate templates from memory)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (user asks `/init` to also write a first UC during the interview → E9: refusal + handoff suggestion to `/draft`; interview continues)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (`docs/schema/format.md` and `workflow-rules.md` written verbatim from `references/` — bytes match exactly, no placeholder substitution)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (Module Overview table in `architecture.md` is intentionally empty after init — confirms init owns stub creation, not stub filling)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (one git commit created with the fixed message format and the explicit file list; no `git push` is run)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 13: TBD (user doesn't know the lint command for Phase 3b → E3: skill proposes the stack-default and asks confirm; default-table proposing is init's job, ongoing tuning is `/setup`'s)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the project-bootstrap step of the workflow business US.
