---
name: setup
description: >
  Fill in project-level knowledge that has no feature owner — test strategy,
  domain glossary, coding conventions, README description, and shared test
  helpers. Use this skill whenever the user wants to configure testing
  conventions, define domain terms, fill in placeholders left by /init,
  update CONVENTIONS.md, write test helpers or fixtures, set up any
  project-wide standards before feature work begins, or update existing
  project configuration (e.g. switching test frameworks, adding glossary
  entries, refining conventions). Also triggers when the user says "set up
  testing", "define our conventions", "fill in the glossary", "configure
  test strategy", "update test-strategy.md", "write a mock helper", or
  similar. Best run after /explore has aligned context — /setup reads the
  conversation to minimise questions. Never writes UC/US documents, never
  touches src/.
---

# Skill: setup

Populate project-level knowledge that the scaffold created as empty templates
or placeholders. These are Tier 0 concerns — they govern how features are
built but don't come from any feature requirement.

**Hard boundary**: Never touch `src/`, `docs/use-cases/`, `docs/modules/`,
`docs/drafts/`, or `docs/adr/`. Those belong to the feature workflow.
This skill only updates project configuration docs and shared test
infrastructure in `tests/`.

---

## Step 1: Read existing state and conversation context

### 1a. Extract decisions from conversation

Look back through the current conversation. What has the user discussed
or decided? Extract any concrete choices:

- Testing framework or tools named?
- Domain terms defined or mentioned?
- Convention rules stated?
- Commands, thresholds, or structure described?

If `/explore` was run earlier in this session, the conversation will carry
rich context — decisions, options rejected, and rationale. Treat that as
your primary input.

### 1b. Scan scaffold files for existing content

Read the files relevant to what's being configured. Check for placeholder
text (bracketed values, "fill in per project", "(per project)"):

```bash
ls docs/overview/ 2>/dev/null
ls tests/ 2>/dev/null
```

For each relevant file, understand whether this is:

- **First-time fill**: file exists as a template with placeholders
- **Update**: file has real content that needs partial revision
- **New file**: file doesn't exist yet (e.g. tests/helpers/)

### 1c. Identify target files

From the conversation and request, determine which files are in scope today.
If the request is broad ("set up the project") and no prior `/explore`
context exists, show which files have unfilled sections and ask:

> "I found placeholders in: [list]. Which would you like to work on today?"

Don't configure everything at once unless the conversation has covered all of it.

---

## Step 2: Assess sufficiency

For each target file, check: do I have enough information from the
conversation to fill it in without guessing?

### What each file requires

**`docs/overview/test-strategy.md`**

- Testing tools per layer (e.g. Layer 1 behavioral → pytest)
- Four commands: verify (all tests), behavioral (Layer 1 only), coverage, CI
- Coverage threshold and whether CI enforces it
- Test directory names

**`docs/overview/glossary.md`**

- Domain term + definition pairs
- At least the terms the user has mentioned

**`CONVENTIONS.md`** (specific section)

- Which section? (code naming, test structure, git conventions)
- Project-specific rules and real examples using the actual tech stack

**`README.md`**

- Project name and one-paragraph description
- Quick start commands: install, run, test

**`tests/helpers/` or `tests/fixtures/`**

- What utilities are needed (e.g. mock LLM client, fake database, test fixtures)
- Function signatures and minimal implementation discussed

### Result

For each target file, identify:

- Known from conversation: [list]
- Still missing: [list]

If all required fields are known → skip to Step 4.
If gaps exist → Step 3.

---

## Step 3: Ask targeted questions

Ask only about the specific gaps. Do not re-ask what was already established
in the conversation. Present grouped questions, not a full questionnaire.

**Example — test commands unknown but framework is known:**

> "What commands run your tests? I need:
>
> - **verify** (all tests, development): ?
> - **behavioral** (Layer 1 only): ?
> - **coverage** (with report): ?
> - **CI** (machine-readable output): ?
>
> Suggested defaults for pytest:
>
> - verify: `pytest`
> - behavioral: `pytest tests/behavioral/`
> - coverage: `pytest --cov`
> - CI: `pytest --tb=short -q`"

Common defaults by framework:

| Tool | verify | behavioral | coverage | CI |
|---|---|---|---|---|
| Jest | `npx jest` | `npx jest tests/behavioral/` | `npx jest --coverage` | `npx jest --ci --json --outputFile=report.json` |
| Vitest | `npx vitest run` | `npx vitest run tests/behavioral/` | `npx vitest run --coverage` | `npx vitest run --reporter=json` |
| pytest | `pytest` | `pytest tests/behavioral/` | `pytest --cov` | `pytest --tb=short -q` |
| go test | `go test ./...` | `go test ./tests/behavioral/...` | `go test -cover ./...` | `go test -json ./...` |

Wait for answers before writing anything.

---

## Step 4: Write the files

With all gaps resolved, update each target file.

### Update strategy

**Files with placeholders** (`test-strategy.md`, `README.md`):
Replace placeholder values directly. Preserve headings, prose explanations,
and section order — but treat table row content as project-configurable, not
fixed. Specifically: the **Testing Layers table** rows (layer names, what they
test, tools) are always project-specific and must be replaced to match this
project's actual layer model and tools, even if they contain plausible-sounding
generic names like "Unit", "Integration", or "E2E". Those are scaffold
examples, not real project decisions.

**Files with discrete sections** (`CONVENTIONS.md`):
Identify the specific section being updated. Replace that section's
content with the new version. Leave all other sections exactly as they are.

**Additive files** (`glossary.md`):
Add new entries in alphabetical order. Do not remove or alter existing
entries — a re-run only adds, never deletes.

**New infrastructure files** (`tests/helpers/`, `tests/fixtures/`):
Create the file with the content discussed. Follow naming conventions
from `CONVENTIONS.md`. Keep these files minimal — only the shared
utilities that `/apply` would actually import when writing feature tests.

When creating any new `tests/` file, also update `test-strategy.md`:

- Add the new directory to the Test Directories table
- Add a short prose section (e.g. "## Shared Mocks") naming the file and
  what it provides, so future agents know it exists and how to use it

### On re-runs

When the file already has real content (not a first-time fill), read
the existing content before writing. Update only what changed based on
the conversation — preserve everything else, including any additions
the user made manually between runs.

### Never guess

If a value wasn't established in conversation and wasn't answered in
Step 3, write `(fill in per project)` rather than inventing a value.

---

## Step 5: Print summary

```
Setup complete
──────────────────────────────────────────────────────
Updated:
  docs/overview/test-strategy.md   → [what changed]
  CONVENTIONS.md                   → [which section, what changed]
  docs/overview/glossary.md        → [N terms added]
  README.md                        → [what filled in]

Created:
  tests/helpers/[filename]         → [what it provides]

Still needs attention:
  [any section still using placeholder values, with filename]

──────────────────────────────────────────────────────
These conventions govern how /apply writes tests and code.
When feature plans run, agents will read test-strategy.md and
CONVENTIONS.md to follow the rules defined here.
```

Omit any section where nothing happened.
