---
schema: agent-skills
schema-version: 0
doc-type: use-case
id: UC-007
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

# UC-007: Bootstrap the project documentation scaffold

Run a structured 4-phase interview, show the user a complete preview, then write the entire documentation scaffold in one pass and commit it as a single git commit. After `/init`, an AI agent or new human contributor can open the project and orient immediately — without needing to ask what the project does, how it's tested, or where things go.

## Primary Actor

Inbound CLI invocation via the `/init` slash command in Claude Code, typically run as the **first** skill in a new project — when the user says "set up this project", "initialize the docs", "create the scaffold", "where do I start?" on a blank repo, or when a project has code but no `AGENTS.md` / no `docs/` folder yet.

## Source

TBD (will be linked after /compose) — belongs to the project-bootstrap workflow that precedes both the greenfield and brownfield loops.

## Preconditions

- The current working directory is the intended project root
- The user is available for a multi-turn synchronous interview (4 phases; phase 3 has a 3b sub-phase for quality tooling)
- `skills/init/references/templates.md`, `references/format.md`, and `references/workflow-rules.md` are readable (they are bundled with the skill and are the templates init writes from / copies verbatim)
- For the git-commit step at the end: a git repository is initialized — OR not, in which case the commit step is silently skipped (per Exception Flow E5) and the user is told no commit was made

## Business Rules

None — the technical preconditions cover it.

## Postconditions

On success (full interview + preview accepted + write + commit):

- **Top-level files** exist at the project root, populated from interview answers:
  - `AGENTS.md` — project name, one-paragraph description, key rules, workflow steps
  - `CLAUDE.md` — single line: `@AGENTS.md`
  - `README.md` — project name, description, navigation links
  - `CONVENTIONS.md` — naming conventions (filled from Phase 2's stack-inferred table, confirmed in Q4), quality commands from Phase 3 (verify / behavioral / coverage / report) and Phase 3b (lint / format / typecheck / build), config files table, git rules
- **`docs/overview/`** populated:
  - `architecture.md` — empty Module Overview table + Directory Structure (the table is filled later by `/scan-all` + `/scan-deep` + `/merge`)
  - `test-strategy.md` — test case structure + coverage threshold from Q7 (default 80%)
  - `api-spec.yaml` — OpenAPI stub with base path from Q11 (projects with HTTP APIs only; absent otherwise)
  - `glossary.md` — empty stub (filled later by `/setup`)
- **`docs/schema/`** populated **verbatim** from `references/`:
  - `format.md` — document section format for the project; ongoing schema evolution is `/schema-update`'s job, not init's
  - `workflow-rules.md` — lifecycle, gates, ADR triggers, PR checklist; ongoing evolution is `/schema-update`'s
- **Empty workflow directories** exist as scaffolding for downstream skills:
  - `docs/drafts/`, `docs/use-cases/`, `docs/modules/`, `docs/adr/` (each filled by its respective skill — `/draft`, `/merge`, `/scan-all` → `/scan-deep`, etc.)
- **`.gitignore`** updated:
  - Created if not present; otherwise the scaffold section is appended at the end
  - Contains the universal block + stack-specific block + tool-specific cache/output entries identified in Phase 3/3b
  - Section header: `# ── Added by @sususleep/scaffold — {date} ({stack}) ──`
- **One git commit** has been created containing all written files (`AGENTS.md`, `CLAUDE.md`, `README.md`, `CONVENTIONS.md`, `docs/`, `.gitignore`) with the fixed commit message format (`chore: initialize project scaffold` + a `Created:` list); **NO push** is performed
- A summary block has been printed listing the created files, the commit hash (if committed) or "no git commit" (if not a git repo), and the next steps (`/explore + /setup → /draft`)

On stop (user declines the preview in Step 2, or pre-flight overwrite question goes unanswered): nothing is written, nothing is committed.

## Main Flow

1. **Pre-flight check** — list any existing scaffold files (`AGENTS.md`, `CLAUDE.md`, `README.md`, `CONVENTIONS.md`, `docs/overview/`); if any exist, ask the user whether to overwrite or skip the existing ones; wait for the answer before proceeding
2. **Phase 1 — Service purpose**: Q1 project name; Q2 one-paragraph description (what business problem, who uses it, what it produces). Wait for answers before continuing
3. **Phase 2 — Tech stack**: Q3 language + framework. Infer naming conventions from the stack table (TypeScript / Python / Go / Java / Kotlin / Ruby supported by default); show inferred conventions; Q4 confirms or amends them
4. **Phase 3 — Testing**: Q5 test tool; Q6 four commands (verify / behavioral / coverage / report); Q7 minimum coverage threshold (default 80%). Suggest sensible defaults from the testing-defaults table when the user doesn't know
5. **Phase 3b — Quality tooling**: infer linter, formatter, typecheck commands from the stack; show the inferred set; Q8 confirms or amends; Q9 asks whether a build/compile step is required before tests
6. **Phase 4 — Optional HTTP Interface**: Q10 asks whether the project exposes an HTTP API; Q11, only if yes, asks for the HTTP API base path (for the api-spec.yaml stub)
7. **Step 2 — Preview** — print the complete list of files that will be created, with descriptions; ask "Proceed? (yes / change something first)"; wait for confirmation
8. **Step 3 — Write all files (in this order, substituting interview values into templates from `references/templates.md`)**:
   - `AGENTS.md` → `CLAUDE.md` → `README.md` → `CONVENTIONS.md`
   - `docs/overview/architecture.md` → `test-strategy.md` → `api-spec.yaml` (HTTP-only) → `glossary.md`
   - `docs/schema/format.md` ← **copy verbatim** from `references/format.md` (no placeholder substitution — it is a schema template)
   - `docs/schema/workflow-rules.md` ← **copy verbatim** from `references/workflow-rules.md`
   - `.gitignore` ← create if absent, or append the scaffold section if present (universal block + stack block + tool-specific cache dirs)
   - Empty directories: `mkdir -p docs/schema docs/drafts docs/use-cases docs/modules docs/adr`
9. **Step 4 — Commit** — stage the exact file list (`git add AGENTS.md CLAUDE.md README.md CONVENTIONS.md docs/ .gitignore`); create one commit with the fixed message format; if not a git repo, skip the commit step and note "Not a git repository — files written, no commit created"; **NEVER push**
10. **Step 5 — Summary** — print "Init complete", the count of files created and commit hash (or "no git commit"), then the Next Steps block recommending `/explore + /setup` to fill in project knowledge, then `/draft` for the first feature

## Exception Flows

- **E1 — Some scaffold files already exist** (recoverable): pre-flight detects `AGENTS.md`, `docs/overview/`, etc.; list them, ask overwrite-or-skip; the user's answer determines per-file behavior in Step 3 (overwrite = full template; skip = leave existing untouched, but other files in the scaffold still proceed). Do NOT silently overwrite
- **E2 — User declines the preview in Step 2** (recoverable): stop without writing anything; ask what they want to change; loop back to the relevant interview phase
- **E3 — User says "I don't know" on a quality-tool / test-command question** (recoverable): propose the sensible default for the named tool from the defaults table; ask for confirm. Stack-aware defaulting is init's responsibility (Q2 boundary 2a); ongoing tuning is `/setup`'s
- **E4 — Stack is unknown / not in the inference tables** (recoverable): ask the user for the conventions, lint command, format command, typecheck command directly; do not block init on a stack not in the table — degrade to free-form input
- **E5 — Not a git repository at commit time** (recoverable): skip the `git add` + `git commit` step silently; note in the summary "Not a git repository — files written, no commit created"; do NOT auto-`git init` (that's a separate user choice). All file writes still persist
- **E6 — User says "no" to the HTTP API question (Q10)** (recoverable): skip the `api-spec.yaml` write; do not list it in the summary; do not refer to it anywhere else in the scaffold
- **E7 — `.gitignore` already exists with conflicting entries** (recoverable): append the scaffold section at the end (never deduplicate or reorganise existing entries — that's not init's job); rely on the section header (`# ── Added by @sususleep/scaffold — {date} ({stack}) ──`) to disambiguate
- **E8 — Templates in `references/` cannot be read** (contact support): refuse to run; report which template is missing; the user must restore the references before re-invoking. The skill does NOT regenerate template contents from memory — that risks divergence from `/schema-update`'s expected baseline
- **E9 — User asks init to populate Module Overview / glossary / draft folders during the interview** (contact support): refuse politely; explain that those are filled later by `/scan-all` + `/scan-deep` (architecture) / `/setup` (glossary) / `/draft` (drafts); offer to run those skills after `/init` completes

## Serves

TBD (will be linked after /compose) — expected target: the project-bootstrap step that precedes both the greenfield and brownfield workflows.
