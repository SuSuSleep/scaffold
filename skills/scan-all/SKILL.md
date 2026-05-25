---
name: scan-all
description: >
  Bootstrap the brownfield documentation workflow — scan all modules in src/ to create
  docs/drafts/coverage.md (a documentation status tracker) and pre-populate the Module
  Overview table in docs/overview/architecture.md. Use this skill whenever the user wants
  to start documenting an existing undocumented codebase, after running /init on a project
  that already has code but no docs. Strong triggers: "scan all modules", "create coverage
  file", "start brownfield docs", "bootstrap documentation for existing code", "what modules
  do I have", "document my existing codebase", "set up coverage tracking". Always run this
  before /scan-deep on any brownfield project that doesn't yet have docs/drafts/coverage.md.
---

# Skill: scan-all

Bootstrap the brownfield documentation workflow. This skill discovers every module in the
project, creates a coverage tracker, and seeds the architecture overview — giving every
subsequent brownfield skill (`/scan-deep`, `/elicit`, `/compose`) a consistent starting point.

A module is any **direct subdirectory of `src/`**. Nested directories (e.g.
`src/payment/handlers/`) are part of their parent module, not separate modules.

---

## Step 0: Pre-flight check

**Find the source directory**

```bash
ls -d src/ 2>/dev/null || echo "not found"
```

If `src/` doesn't exist, look for other common layouts:

```bash
ls -d app/ lib/ cmd/ packages/ 2>/dev/null
```

- Found `src/` → proceed
- Found a different directory → confirm with the user: "I found `{dir}/` — should I treat that as the modules directory?"
- Nothing found → ask: "I couldn't find a `src/` directory. Where does this project keep its module code?"

Wait for confirmation before proceeding.

**Check existing state**

```bash
ls docs/drafts/coverage.md 2>/dev/null && echo "exists" || echo "missing"
ls docs/overview/architecture.md 2>/dev/null && echo "exists" || echo "missing"
```

- `coverage.md` missing → **create mode** (build from scratch)
- `coverage.md` exists → **update mode** (append new modules only, never touch existing rows)

---

## Step 1: Discover modules

List direct subdirectories only:

```bash
find src/ -mindepth 1 -maxdepth 1 -type d | sort
```

If zero directories are found:
> "No module directories found in `src/`. Nothing to scan."
> Stop here.

For each module, collect a brief initial observation for the Notes column:

```bash
# Any test files?
find src/{module}/ -name "*.test.*" -o -name "*_test.*" -o -name "*spec*" 2>/dev/null | head -1

# Single-file module?
find src/{module}/ -maxdepth 1 -type f 2>/dev/null | wc -l
```

Notes guidance:

- Has test files → leave Notes blank (normal)
- No test files anywhere in the module → `no tests found`
- Only one source file in the directory → `single-file module`
- Otherwise → leave blank

---

## Step 2: Write coverage.md

**Create mode** — create the directory if needed, then write the file:

```bash
mkdir -p docs/drafts
```

```markdown
# Documentation Coverage

| Module | Source path | Scan | Module UC | Business UC | Notes |
| ------ | ----------- | ---- | --------- | ----------- | ----- |
| {module} | src/{module}/ | [ ] | [ ] | [ ] | {notes} |
```

- One row per module, sorted alphabetically
- All checkboxes `[ ]`
- Notes: brief observation or blank

**Update mode** — read the existing file first, identify which modules are already listed
as rows, then append only the new modules (those not already in the file). Never rewrite
existing rows or change existing checkbox states.

---

## Step 3: Update architecture.md Module Overview

The Module Overview table tracks module names and their responsibilities. In a fresh
brownfield project, responsibilities are unknown — they get filled in as each module
loop completes via `/scan-deep` and `/merge`.

**If `docs/overview/architecture.md` exists:**

Find the `## Module Overview` section and its table. For each module not already listed,
append a row:

```markdown
| {module} | TBD (fill in after /scan-deep) |
```

Do not modify any existing rows or other sections.

**If `docs/overview/architecture.md` doesn't exist:**

Create `docs/overview/` if needed, then create the file with this stub:

```markdown
# Architecture

## Module Overview

| Module | Responsibility |
| ------ | -------------- |
| {module} | TBD (fill in after /scan-deep) |

## Directory Structure

The authoritative definition of what each directory is for.
AI must not create directories outside this structure without updating this file.

| Directory             | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| docs/use-cases/       | Business-layer confirmed features                         |
| docs/modules/         | Module-layer confirmed contracts                          |
| docs/adr/             | Project-level architecture decisions                      |
| docs/drafts/          | All work in progress                                      |
| src/{module}/         | Module implementation — no extra nesting                  |
| tests/behavioral/     | Layer 1 behavioral tests — driven by US scenarios         |
| tests/implementation/ | Layer 2 implementation quality tests                      |

## System Diagram

(Add Mermaid diagram here as modules are documented — see architecture.md conventions)

## Key Cross-Module Interaction Patterns

Document patterns here as they emerge.
```

---

## Step 4: Print summary

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

Special case — update mode with no new modules:
> "coverage.md is already up to date — no new modules found in `src/`."
