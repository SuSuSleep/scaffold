# Init Templates Reference

All file templates used by the `init` skill. Substitute `{placeholders}` with
values collected during the interview.

---

## AGENTS.md

```markdown
# {service_name}

> Agent orientation file. Read this at the start of every session.

## What this service does

{description}

## Key rules

- Read docs/overview/architecture.md to understand current module structure
  and the authoritative directory layout before making any changes
- Follow coding and documentation standards in CONVENTIONS.md
- Confirm before editing any "update in place" document
- Never invent requirements not found in docs/use-cases/ or docs/drafts/
- Do not create directories not defined in docs/overview/architecture.md

## Workflow

Follow these steps in order — each skill is self-contained:

  /explore      → think through ambiguous requirements (optional, before drafting)
  /draft        → create business-layer UC/US in docs/drafts/use-cases/
  /review-draft → quality gate before planning
  /plan         → implementation plan + module-layer docs
  /apply        → implement code + behavioral + quality tests
  /merge        → promote confirmed docs out of drafts/
  /verify       → three-way alignment check before opening PR
```

---

## CLAUDE.md

```markdown
@AGENTS.md
```

---

## README.md

```markdown
# {service_name}

## What this service does

{description}

## Quick Navigation

- Confirmed business features → docs/use-cases/
- Module implementation contracts → docs/modules/
- In-progress drafts → docs/drafts/
- Implementation batch plans → docs/drafts/plans/
- Project architecture decisions → docs/adr/
- System structure & data flows → docs/overview/architecture.md
- API field specs → docs/overview/api-spec.yaml
- Business term glossary → docs/overview/glossary.md
- Testing strategy → docs/overview/test-strategy.md
- Coding & doc conventions → CONVENTIONS.md
```

---

## CONVENTIONS.md

```markdown
# Conventions

> Coding standards, documentation rules, and naming conventions for this project.
> AI must follow these. Humans should review and update as the project evolves.

---

## Code Conventions

### Naming

- Files: {file_naming}
- Components / Classes: {class_naming}
- Functions / Variables: {function_naming}
- Constants: {constant_naming}
- Database tables/columns: {db_naming}

### Comments

- Prefer self-documenting code over comments
- Comment the _why_, not the _what_
- All public functions need a one-line docstring
- For implementation choices that follow an ADR, reference it inline:
  `// Exponential backoff with 5-minute cap — see ADR-005`

### Test Structure

Tests are in two layers with distinct purposes. Behavioral and implementation
quality tests must always be stored separately.

**Layer 1 — Behavioral tests**

- One test file per US, named to match the US file
- Every test case must reference its source US and scenario number
- Scenarios in US documents are the contract — must be satisfied regardless
  of implementation order
- Must not be changed unless the US scenario itself changes
- Naming convention:
  Outer block: `US-{id}: {feature name}`
  Inner case: `[S{n}] {scenario name} → {expected outcome}`

**Layer 2 — Implementation quality tests**

- Written after behavioral tests pass
- Cover internal branches, error handlers, state transitions, boundary values
- Can be freely added, changed, or deleted during refactoring
- Do not reference US or scenario numbers
- No documentation update required

### Quality Commands

#### Style — auto-fix (run at end of each implementation batch)

| Label  | Command           | Effect                         |
| ------ | ----------------- | ------------------------------ |
| format | {format_command}  | Auto-fixes formatting in-place |
| lint   | {lint_command}    | Auto-fixes lintable issues     |

#### Correctness — AI fixes on failure (3-attempt rule)

| Label     | Command              | When to run                      |
| --------- | -------------------- | -------------------------------- |
| typecheck | {type_command}       | After each implement step        |
| build     | {build_command}      | Before tests (only if required)  |
| verify    | {verify_command}     | During development               |
| behavioral| {behavioral_command} | Behavioral layer only            |
| coverage  | {coverage_command}   | Before merge                     |

### Config Files

| Tool       | Config file        |
| ---------- | ------------------ |
| {linter}   | {linter_config}    |
| {formatter}| {formatter_config} |

---

## Documentation Conventions

### Core Principle

> Always maintain current state only. History goes to git. Decision reasoning
> goes to ADR. API specs go to docs/overview/api-spec.yaml. Scenarios declared
> in US documents are the contract — they must be satisfied. Implementation
> quality tests live in code only and require no documentation.

### Two Document Layers

| Layer          | Location               | Owner           | Scope                      |
| -------------- | ---------------------- | --------------- | -------------------------- |
| Business       | docs/use-cases/        | Project manager | Cross-module user behavior |
| Implementation | docs/modules/{module}/ | Module manager  | Single module contract     |

### Document Types and Update Strategy

| Document                   | Location                              | Strategy                              |
| -------------------------- | ------------------------------------- | ------------------------------------- |
| System README              | /                                     | Update in place                       |
| CONVENTIONS                | /                                     | Update in place                       |
| Architecture               | docs/overview/                        | Update when structure changes         |
| Glossary                   | docs/overview/                        | Update in place                       |
| Test strategy              | docs/overview/                        | Update in place                       |
| API spec                   | docs/overview/api-spec.yaml           | Update in place                       |
| Business UC/US (draft)     | docs/drafts/use-cases/                | Update in place                       |
| Business UC/US (confirmed) | docs/use-cases/                       | Update in place                       |
| Module UC/US (draft)       | docs/drafts/modules/{module}/         | Update in place                       |
| Module UC/US (confirmed)   | docs/modules/{module}/                | Update in place                       |
| Project ADR (draft)        | docs/drafts/adr/                      | Update in place                       |
| Project ADR (confirmed)    | docs/adr/                             | Delete when superseded                |
| Module ADR (draft)         | docs/drafts/modules/{module}/adr/     | Update in place                       |
| Module ADR (confirmed)     | docs/modules/{module}/adr/            | Delete when superseded                |
| Module README              | docs/modules/{module}/README.md       | Append on each UC/US confirmation     |
| Plan                       | docs/drafts/plans/                    | Check off items; delete on completion |

### Numbering and IDs

- Project ADRs: ADR-001, ADR-002, …
- Module ADRs: {module}-ADR-001, {module}-ADR-002, …
- Use cases: UC-001, UC-002, …
- User stories: US-001, US-002, …
- Plans: plan-001-{name}.md

### Linking Between Documents

Always use relative paths:
`See [Architecture](docs/overview/architecture.md) for system context.`

Mark unconfirmed references as TBD:
`- Related ADR: TBD (under discussion, see docs/drafts/adr/adr-draft-001-xxx)`

---

## Git Conventions

### Branch Naming

- Feature: `feat/short-description`
- Bug fix: `fix/short-description`
- Docs: `docs/short-description`
- Chore: `chore/short-description`

### Commit Messages

Follow Conventional Commits. Include enough context to explain _why_:

```

feat(payment): add retry logic for failed transactions
docs(use-cases): move uc-001-checkout from drafts after confirmation

```

### PR Checklist

```

□ Are all US scenarios satisfied?
□ Are all behavioral tests placed and named per CONVENTIONS?
□ Does the API contract file match the implementation?
  → If docs/overview/api-spec.yaml exists: check each new endpoint is registered (WARN if missing)
  → If docs/overview/api-spec.yaml does not exist: SKIP (non-HTTP project)
□ Do any module overviews need updating?
□ Are all referenced UCs / USs / ADRs in the confirmed folders?
  → If not, mark as "TBD"
□ Is there a new cross-module decision requiring a project-level ADR?
□ Does this merge introduce a new module, dependency, or interaction pattern?
  → Yes: update architecture.md
□ Is the final batch fully green?

```
```

---

## docs/overview/architecture.md

````markdown
# Architecture

## Module Overview

| Module | Responsibility |
| ------ | -------------- |

Modules are added here as features are planned and merged. Start with /draft.

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

Note: The exact names of test directories follow the conventions of the
testing tools used in this project. The principle — behavioral and
implementation quality tests must be stored separately — always applies.

## System Diagram

```mermaid
graph TD
User[/User/]

classDef user fill:#7ED321,color:#fff
class User user
```

Add modules and interactions here as the system grows.

## Key Cross-Module Interaction Patterns

Document patterns here as they emerge.

## When to Update This File

- A new module is added
- A new dependency between modules is introduced
- A new external resource is introduced
- A new cross-module interaction pattern emerges
- The directory structure changes
````

---

## docs/overview/test-strategy.md

```markdown
# Test Strategy

## Testing Layers

| Layer          | What it tests             |
| -------------- | ------------------------- |
| Behavioral     | US scenario contracts     |
| Implementation | Internal code quality     |

See `CONVENTIONS.md` for all quality commands (verify, coverage, lint, format, typecheck).

## Two Test Layers

### Layer 1: Behavioral Tests

- Driven by US test scenarios — one test file per US
- Scenarios are the contract: must be satisfied regardless of implementation order
- Must not be changed unless the US scenario itself changes
- Named and placed per CONVENTIONS

### Layer 2: Implementation Quality Tests

- Written after behavioral tests pass
- Cover internal branches, error handlers, state transitions, boundary values
- Can be freely changed during refactoring
- No documentation update required

## Refactoring Signal

If planning implementation quality tests feels difficult, this signals the code
needs refactoring — not that tests should be skipped.

Correct response:
1. Confirm behavioral tests are green
2. Refactor under their protection
3. Re-plan implementation quality tests

## Test Case Structure

One test file per US, placed in `tests/behavioral/{module}/`.

Outer describe block: `US-{id}: {feature name}`
Inner test case: `[S{n}] {scenario name} → {expected outcome}`

Example output on failure:
  ✗ US-001: {feature} > [Sn] {scenario} → {expected outcome}
  → Path to the US doc — Scenario N

## Test Directories

| Type           | Location                       |
| -------------- | ------------------------------ |
| Behavioral     | tests/behavioral/{module}/     |
| Implementation | tests/implementation/{module}/ |

## Coverage Policy

- Metric: line coverage
- Minimum threshold: {threshold}%
- Enforced: CI blocks merge if below threshold

## General Principles

- Scenarios are the contract — implementation order is secondary
- Behavioral and implementation quality tests serve different purposes
- Every plan ends with a final integration batch covering new and existing scenarios
- If verification fails, create a fix plan and apply it — repeat until fully green
- Cross-module flows should prioritize integration tests
- Internal logic of third-party services is out of scope
```

---

## docs/overview/api-spec.yaml

```yaml
openapi: "3.0.3"
info:
  title: {service_name}
  version: "0.1.0"
  description: {description}
servers:
  - url: "{base_path}"
    description: Default server
paths: {}
```

---

## docs/overview/glossary.md

```markdown
# Glossary

Business term definitions for {service_name}.

| Term | Definition |
| ---- | ---------- |

Add terms here as they emerge from business analysis.
```
