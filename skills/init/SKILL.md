---
name: init
description: >
  Initialize a new project with the standard documentation scaffold — AGENT.md,
  CLAUDE.md, README.md, CONVENTIONS.md, and the full docs/overview/ structure.
  Use this skill whenever the user starts a new project, says "set up this project",
  "initialize the docs", "create the scaffold", "set up AGENT.md", "bootstrap this
  repo", or any phrase suggesting the project has no documentation structure yet.
  Also triggers when a project has code but no AGENT.md, no docs/ folder, or the
  user asks "where do I start?" on a blank repo. Always run this before /draft on
  any project that doesn't already have docs/overview/architecture.md.
---

# Skill: init

Guide the user through a structured interview, then write the complete project
scaffold in one pass. The goal: after init, an AI agent (or new human contributor)
can open the project and orient immediately — without needing to ask what the
service does, how it's tested, or where things go.

All file templates are in `references/templates.md`. Read that file before
writing anything in Step 3.

---

## Step 0: Pre-flight check

Check whether scaffold files already exist:

```bash
ls AGENT.md CLAUDE.md README.md CONVENTIONS.md docs/overview/ 2>/dev/null
```

If any exist, list them and ask: "Some files already exist. Do you want to
overwrite them, or skip the ones already present?"

Wait for the answer before proceeding.

---

## Step 1: Interview

Ask in phases. Present each phase, wait for the answer, then continue.
Do not ask all questions at once — it overwhelms new users.

### Phase 1: Service identity

> **1.** What's the name of this project?
> **2.** In one paragraph: what does it do? What business problem does it
> solve, who uses it, and what does it produce?

### Phase 2: Tech stack

> **3.** What language and framework does this service use?
> (e.g. TypeScript + NestJS, Python + FastAPI, Go + Gin)

Infer naming conventions from the stack:

| Stack | Files | Classes | Functions/Vars | Constants | DB tables |
|---|---|---|---|---|---|
| TypeScript / JavaScript | kebab-case | PascalCase | camelCase | UPPER_SNAKE_CASE | snake_case |
| Python | snake_case | PascalCase | snake_case | UPPER_SNAKE_CASE | snake_case |
| Go | snake_case | PascalCase | camelCase | UPPER_SNAKE_CASE | snake_case |
| Java / Kotlin | PascalCase | PascalCase | camelCase | UPPER_SNAKE_CASE | snake_case |
| Ruby | snake_case | PascalCase | snake_case | UPPER_SNAKE_CASE | snake_case |

Then show the inferred conventions and ask:

> **4.** Here are the naming conventions I inferred for {stack}:
>
> - Files: {file_naming}
> - Classes/Components: {class_naming}
> - Functions/Variables: {function_naming}
> - Constants: {constant_naming}
> - DB tables/columns: {db_naming}
>
>         Does this look right, or do you want to change anything?

### Phase 3: Testing

> **5.** What test tool do you use? (e.g. Jest, Vitest, pytest, go test)
> **6.** What are your test commands? I need four:
>
> - **verify**: run all tests (used during development)
> - **behavioral**: run tests/behavioral/ only
> - **coverage**: run with coverage report
> - **report**: CI machine-readable output
> **7.** Minimum coverage threshold? (press enter for 80%)

If the user doesn't know a command, suggest a sensible default for the tool
they named. Common defaults:

| Tool | verify | behavioral | coverage | report |
|---|---|---|---|---|
| Jest | `npx jest` | `npx jest tests/behavioral/` | `npx jest --coverage` | `npx jest --ci --json --outputFile=report.json` |
| Vitest | `npx vitest` | `npx vitest tests/behavioral/` | `npx vitest --coverage` | `npx vitest --reporter=json` |
| pytest | `pytest` | `pytest tests/behavioral/` | `pytest --cov` | `pytest --tb=short -q` |
| go test | `go test ./...` | `go test ./tests/behavioral/...` | `go test -cover ./...` | `go test -json ./...` |

### Phase 4: API

> **8.** Is this an HTTP service? (yes / no)

If yes:

> **9.** What's the API base path? (e.g. /api/v1)

If no: skip api-spec.yaml.

---

## Step 2: Show preview

Print a preview of everything that will be created. Do not write anything yet.

```
Init preview
──────────────────────────────────────────────────────
Will create:
  AGENT.md                      service identity + rules + workflow
  CLAUDE.md                     @AGENT.md reference only
  README.md                     navigation guide
  CONVENTIONS.md                {stack} naming + doc + git rules
  docs/overview/
    architecture.md             empty module table, directory structure
    test-strategy.md            {tool}, {threshold}% coverage threshold
    api-spec.yaml               OpenAPI stub — base path: {path}    ← only if HTTP
    glossary.md                 empty stub
  docs/drafts/                  (empty)
  docs/use-cases/               (empty)
  docs/modules/                 (empty)
  docs/adr/                     (empty)

Proceed? (yes / change something first)
```

Wait for confirmation.

---

## Step 3: Write all files

Read `references/templates.md` now. It contains all templates.

Write in this order, substituting values from the interview:

1. **AGENT.md** — service name + description + rules + workflow steps
2. **CLAUDE.md** — single line: `@AGENT.md`
3. **README.md** — service name + description + navigation links
4. **CONVENTIONS.md** — filled naming conventions + doc rules + git rules
5. **docs/overview/architecture.md** — empty module table + directory structure
6. **docs/overview/test-strategy.md** — test tool + commands + threshold
7. **docs/overview/api-spec.yaml** — OpenAPI stub (HTTP projects only)
8. **docs/overview/glossary.md** — empty stub

Create empty directories:

```bash
mkdir -p docs/drafts docs/use-cases docs/modules docs/adr
```

---

## Step 4: Commit

Stage and commit everything:

```bash
git add AGENT.md CLAUDE.md README.md CONVENTIONS.md docs/
```

Commit message:

```
chore: initialize project scaffold

Created:
  AGENT.md, CLAUDE.md, README.md, CONVENTIONS.md
  docs/overview/ (architecture, test-strategy, glossary{, api-spec})
  docs/drafts/, docs/use-cases/, docs/modules/, docs/adr/
```

If `git` is not initialized, skip this step and note: "Not a git repository —
files written, no commit created."

Do not push.

---

## Step 5: Summary

```
## Init complete

Created {N} files. {commit hash if committed, or "no git commit"}

### Next steps

Before writing features, fill in the project knowledge the scaffold left blank:

  /explore + /setup  →  Define testing strategy, domain glossary, coding
                         conventions, and any shared test helpers. /explore
                         aligns context; /setup writes the files.

When project knowledge is in place:

  /draft  →  Write your first use case.
```
