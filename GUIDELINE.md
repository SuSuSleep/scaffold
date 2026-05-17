# Documentation Structure & Template Guide

---

## 1. Directory Structure

```
/                                    # Project root
  README.md                          # Project entry point — navigation only
  CONVENTIONS.md                     # Coding standards, documentation rules, naming conventions

docs/                                # All documentation — centralized
  overview/                          # System-wide, rarely changes
    architecture.md                  # Module relationships, directory structure, key data flows
    glossary.md                      # Business term definitions
    test-strategy.md                 # Testing tools and layering strategy (project-level)
    api-spec.yaml                    # OpenAPI spec — source of truth for field-level API contracts
  adr/                               # Project-level confirmed architecture decisions
  drafts/                            # ALL work-in-progress (single location)
    use-cases/                       # Business-layer UC/US drafts
      uc-001-checkout/
        use-case.md
        us-001-payment.md
    modules/                         # Module-layer UC/US and ADR drafts
      payment-module/
        use-cases/
          uc-001-process-payment/
            use-case.md
            us-001-xxx.md
        adr/
          adr-draft-001-retry.md
      notification-module/
        use-cases/ ...
        adr/ ...
    plans/                           # Implementation and fix plans
      plan-001-checkout.md
    adr/                             # Project-level ADR drafts
      adr-draft-001-xxx.md
  use-cases/                         # Project-level confirmed features (business layer)
    uc-001-checkout/
      use-case.md
      us-001-payment.md
  modules/                           # Module-level documentation (implementation layer)
    payment-module/
      overview/                      # Optional — for modules too complex to document in README.md alone
      adr/                           # Module-internal confirmed decisions only
      use-cases/
        uc-001-process-payment/
          use-case.md
          us-001-xxx.md
    notification-module/
      ...

src/                                 # Pure implementation code — no documentation
  payment-module/
    payment.service.ts
    payment.handler.ts
  notification-module/
    notification.service.ts

tests/                               # Centralized tests — mirrors module structure
  behavioral/                        # Layer 1 — driven by US scenarios
    payment-module/
      us-001-payment-fail.test
    notification-module/
  implementation/                    # Layer 2 — developer's discretion
    payment-module/
      payment-service.test
    notification-module/
```

### Two Document Layers

| Layer                   | Location          | Owner                 | Purpose                               |
| ----------------------- | ----------------- | --------------------- | ------------------------------------- |
| Project (business)      | `docs/use-cases/` | Project manager agent | Cross-module business behavior        |
| Module (implementation) | `docs/modules/`   | Module manager agent  | Single module implementation contract |

### Why This Structure

```
docs/        → All documentation centralized — no tool interference with src/
src/         → Pure code — clean import paths, no extra nesting layers
tests/       → Centralized — mirrors module structure, consistent with most tool conventions
```

### Navigation Guide

| Goal                                       | Start here                                        |
| ------------------------------------------ | ------------------------------------------------- |
| Understand the project at a glance         | `README.md` (root)                                |
| Understand coding and documentation rules  | `CONVENTIONS.md` (root)                           |
| Understand confirmed business features     | `docs/use-cases/`                                 |
| Understand module implementation contracts | `docs/modules/`                                   |
| Understand in-progress drafts              | `docs/drafts/` (all active work in one place)     |
| Understand in-progress business drafts     | `docs/drafts/use-cases/`                          |
| Understand in-progress module drafts       | `docs/drafts/modules/`                            |
| Understand implementation batch planning   | `docs/drafts/plans/`                              |
| Understand architecture decisions          | `docs/adr/` or `docs/modules/{module}/adr/`       |
| Understand system structure and data flows | `docs/overview/architecture.md`                   |
| Look up API field specs                    | `docs/overview/api-spec.yaml`                     |
| Look up business term definitions          | `docs/overview/glossary.md`                       |
| Look up testing tools and strategy         | `docs/overview/test-strategy.md`                  |
| Look up quality commands (lint, format, test) | `CONVENTIONS.md`                              |

---

## 2. Two-Layer Document Model

### Business Layer (Project Manager Agent)

Owned by the project manager agent. Describes cross-module business behavior from the user's perspective.

```
docs/use-cases/uc-001-checkout/
  use-case.md       → Who wants to achieve what, across modules
  us-001-payment.md → User-facing scenarios — the contract

docs/adr/                  → Confirmed decisions that affect more than one module
docs/drafts/use-cases/     → In-progress business-layer work
docs/drafts/adr/           → In-progress project-level ADR drafts
```

### Implementation Layer (Module Manager Agent)

Owned by each module manager agent. Describes what a single module must do to fulfill its part of the business layer.

```
docs/modules/payment-module/
  use-cases/        → Module-internal confirmed contracts
  adr/              → Confirmed decisions scoped to this module only

docs/drafts/modules/payment-module/
  use-cases/        → In-progress module-level UC/US drafts
  adr/              → In-progress module-level ADR drafts
```

### How the Two Layers Connect

Business layer US references which modules are responsible:

```markdown
# US-001: Payment success sends notification (business layer)

## Implementation Layer Mapping

- payment-module → docs/modules/payment-module/use-cases/uc-001-process-payment/
- notification-module → docs/modules/notification-module/use-cases/uc-001-send-notification/
```

Module manager agents receive a business layer US as input and derive their own module-level UC / US independently.

### ADR Placement

| Decision affects           | Where to put it              |
| -------------------------- | ---------------------------- |
| More than one module       | `docs/adr/`                  |
| Only one module internally | `docs/modules/{module}/adr/` |

---

## 3. Drafts Workflow

### Core Concept

```
docs/drafts/use-cases/                    → Business-layer UC/US work in progress
docs/drafts/modules/{module}/use-cases/   → Module-level UC/US work in progress
docs/drafts/plans/                        → Implementation and fix plans
docs/drafts/adr/                          → Project-level ADR drafts
docs/drafts/modules/{module}/adr/         → Module-level ADR drafts
docs/use-cases/                           → Confirmed business features
docs/modules/{module}/use-cases/          → Confirmed module contracts
```

Promotion rule: remove `drafts/` from the path — that is the only change on merge.

### When to Scope a Plan Around One vs. Multiple UCs

| Situation                                            | Approach                               |
| ---------------------------------------------------- | -------------------------------------- |
| UCs are independent and touch different modules      | Plan separately per UC                 |
| UCs have ordering dependencies but different modules | Plan sequentially                      |
| Multiple UCs touch the same module                   | Plan together — avoid design conflicts |
| Multiple UCs share a sub-flow                        | Must plan together                     |

**Core question:** "If I implement A first, will I need to go back and change A when I implement B?"

- Yes → Plan together
- No → Can plan independently

### Full Workflow

```
0. Explore (optional — recommended for new or ambiguous requirements)
   → Think through the problem, map existing docs, clarify actors and goals before writing drafts
   → Also recommended before /setup when project knowledge is ambiguous
   → No required output — it is a thinking aid, not a document step
   → Skill: /explore

0b. Project setup (optional — recommended before /draft on a new project)
   → Fill in project-level knowledge that has no feature owner: domain glossary,
     testing strategy, coding conventions, README description, test framework helpers
   → Reads conversation context (best after /explore) to minimise questions
   → Can be re-run when project knowledge changes (e.g. switching test frameworks,
     adding domain terms, updating conventions)
   → Never writes UC/US documents, never touches src/
   → Skill: /setup

1. Business analysis
   → Create business-layer UC + US in docs/drafts/use-cases/
   → Scenarios are the contract — must be satisfied regardless of implementation order
   → Skill: /draft

2. Review business-layer UC/US drafts for quality
   → Check structural completeness, scenario substance (story ↔ scenario alignment,
     concrete values, coverage of common failure modes), and API contract alignment
   → Confirm all scenarios clearly defined before implementation begins
   → Skill: /review-draft
   → Commit: review-draft commits docs/drafts/ as a READY checkpoint when all UCs pass

3. Create an implementation plan
   → Add a plan under docs/drafts/plans/
   → Identify which modules are involved
   → Derive module-level UC / US under docs/drafts/modules/{module}/use-cases/
   → Skill: /plan

4. For each batch (sequentially):
   a. Implement the feature
   b. Write behavioral tests — confirm all scenarios pass
      → After 3 consecutive failed test runs on the same task, stop and report —
        do not continue guessing; the issue may be systemic
   c. Plan implementation quality tests
      → If planning is difficult (too many branches, complex conditions)
        → Refactoring signal — surface the reason, then refactor while behavioral
          tests stay green; continue automatically, do not pause for confirmation
        → Re-plan quality tests after refactoring
   d. Implement and pass implementation quality tests
   → Skill: /apply
   → Note: plan checkboxes ([ ] / [x]) are the resume state — re-running /apply
     picks up from the first unchecked item
   → Commit: apply commits code + plan file after Final Batch passes (before /merge)

5. Integration verification loop (before merge)
   → Run the final batch: new scenarios + existing scenarios of every touched module
   → If any test fails:
       a. Analyse root cause
       b. Create a fix plan in docs/drafts/plans/
       c. Stop — apply the fix plan as a new unit of work (→ Skill: /apply)
       d. Re-run the full final batch after the fix is applied
       e. Repeat until all green
   → Only merge when fully green

6. On PR merge
   → Business-layer US moves from docs/drafts/use-cases/ to docs/use-cases/
   → Module-layer US moves from docs/drafts/modules/{module}/use-cases/ to
     docs/modules/{module}/use-cases/
   → Project-level ADR moves from docs/drafts/adr/ to docs/adr/
   → Module-level ADR moves from docs/drafts/modules/{module}/adr/ to
     docs/modules/{module}/adr/
   → US API Contract section rewritten to simplified form (endpoint line only;
     full request/response tables are preserved in the API contract file)
   → Module US Interface Contract section simplified to a single "Accepts/Emits" summary line
   → Delete the plan
   → Update relevant module overviews
   → Update architecture.md if structure changed
   → Commit: one doc commit for all promotions
   → Skill: /merge

7. Verify alignment (still on feature branch, before PR to main)
   → Three-way alignment check: confirmed docs ↔ behavioral tests ↔ code
   → Scope: changed files on this branch (git diff main...HEAD)
   → CLEAN: all confirmed scenarios have matching tests, refs resolved → safe to open PR
   → MISALIGNED: specific gaps reported → human investigates and fixes
   → Triggered by: /merge announces "Ready for /verify" at the end
   → Skill: /verify
```

### Merge Checklist

```
□ Does the UC's main flow reflect the final implementation?
□ Are all US scenarios satisfied?
□ Are all behavioral tests placed and named per CONVENTIONS?
□ Does the API contract file match the implementation?
  → If docs/overview/api-spec.yaml exists: check each new endpoint is registered (WARN if missing)
  → If docs/overview/api-spec.yaml does not exist: SKIP (non-HTTP project)
□ Do any module overviews need updating?
□ Are all referenced UCs / USs / ADRs in the confirmed folders?
  → If not, mark as "TBD"
□ Is there a new cross-module decision that requires a project-level ADR?
□ Does this merge introduce a new module, dependency, external resource,
  or cross-module interaction pattern?
  → Yes: update architecture.md
□ Is the final batch fully green?
```

### Drafts Cleanup Rules

```
Cancelled requirements                             → Delete immediately
Completed plans                                    → Delete after merge
Drafts with no updates for more than one iteration → Review at sprint planning
```

---

## 4. Document Templates

---

### 1. README.md (Project Root)

```markdown
# [Project Name]

## What this service does

One paragraph describing the business positioning of this project.

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

### 2. CONVENTIONS.md (Project Root)

```markdown
# Conventions

> Coding standards, documentation rules, and naming conventions for this project.
> AI must follow these. Humans should review and update as the project evolves.

---

## Code Conventions

### Naming

- Files: kebab-case
- Components / Classes: PascalCase
- Functions / Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Database tables/columns: snake_case

### Comments

- Prefer self-documenting code over comments
- Comment the _why_, not the _what_
- All public functions need a one-line docstring
- For implementation choices that follow an ADR, reference it inline:
  // Exponential backoff with 5-minute cap — see ADR-005

### Test Structure

Tests are separated into two layers with distinct purposes and rules.
The exact directory names and locations follow tool conventions and are
defined in architecture.md. The principle is that behavioral tests and
implementation quality tests must always be stored separately.

Layer 1 — Behavioral tests

- One test file per US, named to match the US file
- Every test case must reference its source US and scenario number
- Scenarios declared in US documents are the contract — must be satisfied
  regardless of implementation order or approach
- Must not be changed unless the US scenario itself changes
- Naming convention:
  Outer block: US-{id}: {feature name}
  Inner case: [S{n}] {scenario name} → {expected outcome}

Example (language-agnostic pseudocode):
describe "US-001: Payment Failure Handling"
it "[S2] invalid card number → the system SHALL show error message"
it "[S3] insufficient balance → the system SHALL show retry button"

When a test fails, the output directly identifies the US and scenario:
✗ US-001: Payment Failure Handling > [S2] invalid card number
→ docs/use-cases/uc-001-checkout/us-001-payment-fail.md — Scenario 2

Layer 2 — Implementation quality tests

- Written after behavioral tests pass
- Cover internal branches, error handlers, state transitions, boundary values
- Can be freely added, changed, or deleted during refactoring
- Do not reference US or scenario numbers
- No documentation update required

Refactoring signal: if planning implementation quality tests feels difficult
(too many branches, overly complex conditions), this is a signal that the
code needs refactoring. Refactor while behavioral tests remain green, then
re-plan quality tests.

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
> goes to ADR. API specs go to docs/overview/api-spec.yaml. Scenarios declared in US documents
> are the contract — they must be satisfied. Implementation quality tests
> live in code only and require no documentation.

### Two Document Layers

| Layer          | Location               | Owner           | Scope                      |
| -------------- | ---------------------- | --------------- | -------------------------- |
| Business       | docs/use-cases/        | Project manager | Cross-module user behavior |
| Implementation | docs/modules/{module}/ | Module manager  | Single module contract     |

### Document Types and Update Strategy

| Document                   | Location                         | Strategy                              |
| -------------------------- | -------------------------------- | ------------------------------------- |
| System README              | /                                | Update in place                       |
| CONVENTIONS                | /                                | Update in place                       |
| Architecture               | docs/overview/                   | Update when structure changes         |
| Glossary                   | docs/overview/                   | Update in place                       |
| Test strategy              | docs/overview/                   | Update in place                       |
| Business UC/US (draft)     | docs/drafts/use-cases/                      | Update in place                       |
| Business UC/US (confirmed) | docs/use-cases/                             | Update in place                       |
| Module UC/US (draft)       | docs/drafts/modules/{module}/use-cases/     | Update in place                       |
| Module UC/US (confirmed)   | docs/modules/{module}/use-cases/            | Update in place                       |
| Project ADR (draft)        | docs/drafts/adr/                            | Update in place                       |
| Project ADR (confirmed)    | docs/adr/                                   | Delete when superseded                |
| Module ADR (draft)         | docs/drafts/modules/{module}/adr/           | Update in place                       |
| Module ADR (confirmed)     | docs/modules/{module}/adr/                  | Delete when superseded                |
| Module README              | docs/modules/{module}/README.md             | Append on each UC/US confirmation     |
| Plan                       | docs/drafts/plans/                          | Check off items; delete on completion |

### Numbering and IDs

- Project ADRs: ADR-001, ADR-002, …
- Module ADRs: {module}-ADR-001, {module}-ADR-002, …
- Use cases: UC-001, UC-002, …
- User stories: US-001, US-002, …
- Plans: plan-001-{name}.md

### Linking Between Documents

Always use relative paths:
See [Architecture](../overview/architecture.md) for system context.

Mark unconfirmed references as TBD:

- Related ADR: TBD (under discussion, see docs/drafts/adr/adr-draft-001-xxx)

---

## Git Conventions

### Branch Naming

- Feature: feat/short-description
- Bug fix: fix/short-description
- Docs: docs/short-description
- Chore: chore/short-description

### Commit Messages

Follow Conventional Commits. Include enough context to explain _why_:

feat(payment): add retry logic for failed transactions
docs(use-cases): move uc-001-checkout from drafts after confirmation

For changes that overturn a previous approach:

feat(payment): switch session-based auth to JWT

Mobile app support requires stateless auth.
Previous approach documented in ADR-002 (now deleted).
See ADR-007 for the new decision.

### PR Checklist

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

---

### 3. Architecture (docs/overview/architecture.md)

> Maintenance principle: Update only when a new module, dependency, external resource,
> cross-module interaction pattern, or directory structure changes.
>
> Diagram conventions (Mermaid — no subgraph wrappers):
>
> - Internal modules: rectangle `[name]` — blue
> - External services: rounded rectangle `(name)` — grey
> - Databases: cylinder `[(name)]` — orange
> - Users / actors: trapezoid `[/name\]` — green

```markdown
# Architecture

## Module Overview

| Module              | Responsibility |
| ------------------- | -------------- |
| payment-module      |                |
| notification-module |                |

## Directory Structure

The authoritative definition of what each directory is for.
AI must not create directories outside this structure without updating this file.

| Directory             | Purpose                                                              |
| --------------------- | -------------------------------------------------------------------- |
| docs/use-cases/       | Business-layer confirmed features                                    |
| docs/modules/         | Module-layer confirmed contracts                                     |
| docs/adr/             | Project-level architecture decisions                                 |
| docs/drafts/          | Project-level work in progress                                       |
| src/{module}/         | Module implementation — no extra nesting                             |
| tests/behavioral/     | Layer 1 behavioral tests — adapt name to tool convention             |
| tests/implementation/ | Layer 2 implementation quality tests — adapt name to tool convention |

Note: The exact names of test directories follow the conventions of the
testing tools used in this project. The principle — behavioral and
implementation quality tests must be stored separately — always applies.

## System Diagram

'''mermaid
graph TD
User[/User/]
PaymentModule[payment-module]
NotificationModule[notification-module]
ExtService(External Payment Gateway)
DB[(Database)]

User --> PaymentModule
PaymentModule --> ExtService
PaymentModule --> DB
PaymentModule --> NotificationModule

classDef internal fill:#4A90D9,color:#fff
classDef external fill:#E8E8E8,color:#555
classDef database fill:#F5A623,color:#fff
classDef user fill:#7ED321,color:#fff

class PaymentModule,NotificationModule internal
class ExtService external
class DB database
class User user
'''

## Key Cross-Module Interaction Patterns

Grouped by interaction type — one pattern may be shared by multiple UCs.

### Pattern 1: [Pattern Name]

UCs that follow this pattern: UC-001, UC-003

'''mermaid
sequenceDiagram
participant A as module-a
participant B as module-b
participant E as External Service

A->>B: request
B->>E: call
E-->>B: response
B-->>A: result
'''

## When to Update This File

- A new module is added
- A new dependency between modules is introduced
- A new external resource is introduced
- A new cross-module interaction pattern emerges
- The directory structure changes
```

---

### 4. Use Case (Business Layer)

> Same template for drafts/ and use-cases/. Describes cross-module user goals.

```markdown
# UC-001: [Business Goal Name]

## Basic Information

- Primary Actor:
- Preconditions:
- Postconditions:

## Main Flow

1.
2.
3.

## Exception Flows

- [Scenario]: → See US-xxx

## Related Use Cases

- Prerequisite: UC-xxx
- Follow-up: UC-xxx
- Related: UC-xxx
- Shared sub-flow: UC-xxx

## Implementation Layer Mapping

- {module-a} → docs/modules/{module-a}/use-cases/uc-xxx/
- {module-b} → docs/modules/{module-b}/use-cases/uc-xxx/
```

---

### 5. Use Case (Module Layer)

> Owned by the module manager agent. Derived from a business-layer US.
> Describes what this module must do to fulfill its part of the contract.

```markdown
# UC-001: [Module-Internal Goal Name]

## Source

Derived from business layer: docs/use-cases/uc-001-checkout/

## Basic Information

- Trigger: (what causes this module to act)
- Preconditions:
- Postconditions:

## Main Flow

1.
2.
3.

## Exception Flows

- [Scenario]: → See US-xxx

## Interface Contract

- Accepts: (input from other modules or external callers)
- Emits: (events or responses this module produces)
```

---

### 6. User Story — Detailed Version (drafts/)

> Test scenarios are the contract — must be satisfied regardless of implementation order.
> See CONVENTIONS for writing rules.

```markdown
# US-001: [Feature Name]

## Links

- Belongs to: UC-001
- Related ADR: ADR-xxx (mark as "TBD" if not yet confirmed)

## Story

As a **_
When _**
I want **_
So that _**

## Expected Behavior

(Describe the expected behavior of this feature)

## API Contract

### Endpoint

POST /api/v1/[path]

### Request

| Field   | Type   | Required | Rules                                  |
| ------- | ------ | -------- | -------------------------------------- |
| field_a | string | Yes      | UUID format                            |
| field_b | number | Yes      | Greater than 0, up to 2 decimal places |
| field_c | string | No       | Enum: value_a, value_b                 |

### Response

| Field      | Type   | Description              |
| ---------- | ------ | ------------------------ |
| id         | string | UUID                     |
| status     | string | pending, success, failed |
| created_at | string | ISO 8601                 |

### Error Codes

| Status | Error Code    | Description             |
| ------ | ------------- | ----------------------- |
| 400    | INVALID_FIELD | Field format is invalid |
| 404    | NOT_FOUND     | Resource does not exist |
| 422    | DUPLICATE     | Duplicate operation     |

### Notes

- Idempotency: (is this idempotent? how should the caller handle failures?)

## Test Scenarios

### Scenario 1: [Happy Path Name]

- **Given**: (precondition — use concrete values)
- **When**: (action taken)
- **Then**: the system SHALL (expected result — use concrete values)

### Scenario 2: [Exception Case Name]

- **Given**:
- **When**:
- **Then**: the system SHALL

### Scenario 3: [Edge Case Name]

- **Given**:
- **When**:
- **Then**: the system SHALL
```

---

### 7. User Story — Simplified Version (use-cases/)

```markdown
# US-001: [Feature Name]

## Links

- Belongs to: UC-001
- Related ADR: ADR-xxx (mark as "TBD" if not yet confirmed)

## Story

As a **_
When _**
I want **_
So that _**

## Current Behavior

(Describe current behavior only — no history)

## API Contract

- Endpoint: (e.g. POST /api/v1/payments, or "CLI: payments process", or "Event: payment.requested")

## Test Scenarios

### Scenario 1: [Happy Path Name]

- **Given**: (precondition — use concrete values)
- **When**: (action taken)
- **Then**: the system SHALL (expected result — use concrete values)

### Scenario 2: [Exception Case Name]

- **Given**:
- **When**:
- **Then**: the system SHALL

### Scenario 3: [Edge Case Name]

- **Given**:
- **When**:
- **Then**: the system SHALL
```

---

### 8. Implementation Plan (docs/drafts/plans/)

```markdown
# Plan-001: [Feature Area Name]

## Goals

- (Specific and verifiable — maps to one or more US scenarios)

## Non-Goals

- (Explicitly out of scope)

## Scope

- UC-001 Checkout → US-001, US-002
- UC-003 Refund → US-005

## Deferred

- UC-003 US-006: deferred (reason: ...)

## Affected Files

- payment-module:
  - New: src/payment-module/payment-fail.handler.ts
  - Modify: src/payment-module/payment.service.ts
- notification-module:
  - Modify: src/notification-module/notification.service.ts

## Why These UCs Are Planned Together

(Explain the dependency or module overlap.)

## Implementation Batches

Each batch:

1. Implement the feature
2. Write behavioral tests — confirm all scenarios pass
3. Plan implementation quality tests
   → If difficult: refactoring signal — refactor under behavioral test
   protection, then re-plan
4. Implement and pass implementation quality tests

### Batch 1: Core Interface

- [ ] US-001 Scenario 1: Valid payment creates a transaction

### Batch 2: Failure Handling

Depends on Batch 1.

- [ ] US-001 Scenario 2: Invalid card number
- [ ] US-001 Scenario 3: Insufficient balance
- [ ] US-001 Scenario 4: Duplicate payment rejected

### Batch 3: Discount Code

Depends on Batch 1. Parallel with Batch 2.

- [ ] US-002 Scenario 1: Valid discount code applied
- [ ] US-002 Scenario 2: Expired discount code rejected

### Final Batch: Integration Verification

> If any item fails: analyse root cause → create fix plan → implement →
> re-run this entire batch → repeat until all green → then merge.

#### New scenarios (this plan)

- [ ] US-001 Scenario 1: Valid payment creates a transaction
- [ ] US-001 Scenario 2: Invalid card number
- [ ] US-001 Scenario 3: Insufficient balance
- [ ] US-001 Scenario 4: Duplicate payment rejected
- [ ] US-002 Scenario 1: Valid discount code applied
- [ ] US-002 Scenario 2: Expired discount code rejected

#### Existing scenarios of touched modules (regression check)

- [ ] US-00x Scenario n: [existing scenario name]

## Related ADRs

- ADR-xxx: (not yet confirmed — affects Batch n)
```

---

### 9. Fix Plan (docs/drafts/plans/)

```markdown
# Plan-002: Fix [description of regression]

## Root Cause

Which plan's verification surfaced this, which test failed, and why.

## Goals

- (Specific fix — maps to the failing scenario)

## Non-Goals

- (What will not change — keeps scope minimal)

## Scope

- US-001 → Scenario 2

## Affected Files

- Modify: src/payment-module/payment.service.ts

## Implementation Batches

### Batch 1: Fix [description]

- [ ] US-001 Scenario 2: Invalid card number

### Final Batch: Integration Verification

#### Fixed scenarios

- [ ] US-001 Scenario 2: Invalid card number

#### Full regression check

- [ ] US-001 Scenario 1: Valid payment creates a transaction
- [ ] (all other scenarios from the original plan)
```

---

### 10. ADR

```markdown
# ADR-001: [Decision Name]

## Status

Adopted (yyyy-mm-dd)

## Background

Why this decision was needed and what problem it addressed.
(If this overturns a previous approach, explain why reverting is not an option.)

## Options Considered

- Option A: pros / cons
- Option B: pros / cons

## Decision

What was chosen and the core reasoning.

## Impact

### New Capabilities

- [capability-id]: brief description

### Unchanged

- (existing behavior unaffected)

### Affected Files and Documents

- Affected modules:
- Files to modify:
- Documents that need updating:
```

#### ADR Status Labels

| Status     | Description                   |
| ---------- | ----------------------------- |
| Proposed   | Under discussion              |
| Adopted    | Confirmed, being implemented  |
| Deprecated | No longer applicable — remove |

#### ADR Placement

| Decision scope                     | Location                     |
| ---------------------------------- | ---------------------------- |
| Affects more than one module       | `docs/adr/`                  |
| Affects only one module internally | `docs/modules/{module}/adr/` |

---

### 11. Module README (docs/modules/{module}/README.md)

> Owned by the module team. Updated in place whenever a new UC/US is confirmed
> for this module. Created as a stub on first merge that touches this module.

```markdown
# {Module Name}

## What this module does

(One paragraph describing the module's responsibility)

## Design Patterns

- (e.g. Repository pattern — isolates data access from business logic)
- (e.g. Strategy pattern — swappable gateway implementations)

See [Architecture](../../overview/architecture.md) for cross-module interaction patterns.

## Confirmed Use Cases

| UC     | US     | Description                        |
| ------ | ------ | ---------------------------------- |
| UC-001 | US-001 | [feature name — happy path]        |
| UC-001 | US-002 | [feature name — failure handling]  |
```

> **Merge skill rule**: append newly confirmed UC/US rows to the table.
> Design Patterns section is filled in by the engineer — not auto-generated.

---

### 12. Test Strategy (docs/overview/test-strategy.md)

```markdown
# Test Strategy

## Testing Layers

| Layer       | What it tests              | Tools         |
| ----------- | -------------------------- | ------------- |
| Unit        | Individual function logic  | (per project) |
| Integration | Cross-module collaboration | (per project) |
| E2E         | Full user flows            | (per project) |

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

If planning implementation quality tests feels difficult, this signals the
code needs refactoring — not that tests should be skipped.

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

See `CONVENTIONS.md` for all quality commands (verify, coverage, lint, format, typecheck).

## Test Directories

| Type           | Location                        |
| -------------- | ------------------------------- |
| Behavioral     | tests/behavioral/{module}/      |
| Implementation | tests/implementation/{module}/  |

## Coverage Policy

- Metric: line coverage
- Minimum threshold: (fill in per project, e.g. 80%)
- Enforced: (fill in per project, e.g. CI blocks merge if below threshold)

## General Principles

- Scenarios are the contract — implementation order is secondary
- Behavioral and implementation quality tests serve different purposes
- Every plan ends with a final integration batch covering new and existing scenarios
- If verification fails, create a fix plan and apply it — repeat until fully green
- Cross-module flows should prioritize Integration tests
- Internal logic of third-party services is out of scope
```

---

## 5. Maintenance Principles Summary

> **Always maintain current state only. History goes to git. Decision reasoning goes to ADR.
> API specs go to docs/overview/api-spec.yaml. Scenarios are the contract. Implementation quality tests live in
> code only. Directory structure is defined in architecture.md — AI must not deviate from it.**

| Document       | Location                        | How to update                       |
| -------------- | ------------------------------- | ----------------------------------- |
| README.md      | Project root                    | Overwrite directly                  |
| CONVENTIONS.md | Project root                    | Overwrite directly                  |
| Architecture   | docs/overview/                  | Update when structure changes       |
| API spec       | docs/overview/api-spec.yaml     | Update in place                     |
| Business UC/US (draft)     | docs/drafts/use-cases/                  | Overwrite directly                  |
| Business UC/US (confirmed) | docs/use-cases/                         | Overwrite directly                  |
| Module UC/US (draft)       | docs/drafts/modules/{module}/use-cases/ | Overwrite directly                  |
| Module UC/US (confirmed)   | docs/modules/{module}/use-cases/        | Overwrite directly                  |
| Plan                       | docs/drafts/plans/                      | Check off items; delete after merge |
| Fix Plan                   | docs/drafts/plans/                      | Same as Plan; delete after merge    |
| Project ADR (draft)        | docs/drafts/adr/                        | Overwrite directly                  |
| Project ADR (confirmed)    | docs/adr/                               | Delete when superseded              |
| Module ADR (draft)         | docs/drafts/modules/{module}/adr/       | Overwrite directly                  |
| Module ADR (confirmed)     | docs/modules/{module}/adr/              | Delete when superseded              |
| Test Strategy  | docs/overview/                  | Overwrite directly                  |

---

## 6. Handling Overlapping Use Cases

| Situation                                     | How to handle                                      |
| --------------------------------------------- | -------------------------------------------------- |
| Flow overlap (multiple UCs share steps)       | Extract a shared sub-UC; original UCs reference it |
| Scope expansion (range grows)                 | Modify existing UC; add new User Stories           |
| Full replacement (goal fundamentally changes) | Delete old UC; rebuild; ADR explains context       |

---

## 7. When to Open an ADR

```
□ Did we consider other options?
□ Does this decision affect anything outside of a single module?
□ Would a new team member not know why this was done just by looking at the result?
```

All three "yes" → Project-level ADR draft in docs/drafts/adr/ → confirmed to docs/adr/
Affects only one module → Module-level ADR draft in docs/drafts/modules/{module}/adr/ → confirmed to docs/modules/{module}/adr/
Any "no" → Code comment or user story note is sufficient

---

## 8. AI Collaboration Workflows

### Scenario 0: Explore an unfamiliar problem or codebase

```
Input:  Vague requirement, question, or "I don't know where to start"
Output: Mapped doc chain, open questions surfaced, design options compared
        → No documents written — thinking aid only
→ Skill: /explore
```

### Scenario 0b: Fill in project knowledge

```
Input:  Conversation context (from /explore or direct user request)
Output: One or more scaffold files updated with real project content:
          test-strategy.md  (tools, test case structure, coverage policy)
          CONVENTIONS.md    (quality commands: lint, format, typecheck, build, test)
          glossary.md       (domain term definitions)
          CONVENTIONS.md    (project-specific convention sections)
          README.md         (project description, quick start commands)
          tests/helpers/ or tests/fixtures/ (shared test utilities, if needed)
        No UC/US documents. No src/ changes.
→ Best after /explore — /setup reads conversation context to minimise questions
→ Skill: /setup
```

### Scenario 1: New requirement — create drafts

```
Input:  Requirement description
Output: Business-layer UC + US draft under docs/drafts/use-cases/
        + List of modules involved
        + Implementation layer mapping in the UC
        + Assessment of whether a project-level ADR is needed
→ Skill: /draft
```

### Scenario 2: Review drafts before planning

```
Input:  Business-layer UC/US drafts
Output: Review report — READY / NEEDS REVIEW / BLOCKED per UC
        + Structural completeness findings (missing fields, placeholder text)
        + Substance findings (story ↔ scenario alignment, concrete values, coverage gaps)
        + ADR trigger findings (unrecorded cross-module decisions)
        + Advisory: which UCs should be planned together
→ Skill: /review-draft
```

### Scenario 3: Create an implementation plan

```
Input:  Business-layer UC/US drafts (after review)
Output: Module-level UC + US under docs/drafts/modules/{module}/use-cases/
        + Plan under docs/drafts/plans/
        + Goals and Non-Goals
        + Affected files per module
        + Batches: implement → behavioral tests → quality test planning
          (refactor if signal) → quality tests
        + Final batch: new + existing scenarios of touched modules
→ Skill: /plan
```

### Scenario 4: Apply an implementation plan

```
Input:  Implementation plan + module UC/US drafts
Output: Code in src/{module}/
        + Behavioral tests in tests/behavioral/{module}/
        + Implementation quality tests in tests/implementation/{module}/
        + Plan checkboxes updated [ ] → [x] as each task completes
        + Fix plan created if Final Batch verification fails
→ Skill: /apply
```

### Scenario 5: Integration verification fails

```
Input:  Failing test + plan that surfaced it
Output: Fix plan
        + Root cause analysis
        + Minimal scope fix
        + Final batch: fixed scenario + full regression of all touched modules
→ Apply the fix plan to continue: /apply
→ Skill: /apply (on the fix plan)
```

### Scenario 6: Prepare to merge

```
Input:  Documents ready to merge + implementation code
Output: Merge checklist results
        + API contract file vs implementation confirmation
        + Behavioral test placement and naming check
        + Dangling references to mark as "TBD"
        + Business-layer US: move from docs/drafts/use-cases/ → docs/use-cases/
        + Module-layer US: move from docs/drafts/modules/{module}/use-cases/ → docs/modules/{module}/use-cases/
        + Project ADR: move from docs/drafts/adr/ → docs/adr/
        + Module ADR: move from docs/drafts/modules/{module}/adr/ → docs/modules/{module}/adr/
        + Architecture.md update assessment
```

### Scenario 7: Verify alignment before PR

```
Input:  Feature branch after /merge — confirmed docs + code + behavioral tests
Output: Three-way alignment report: confirmed docs ↔ tests ↔ code
        Checks per confirmed US:
          - Every scenario has a matching behavioral test case [hard]
          - Each test case references the correct US and scenario number [hard]
          - No remaining TBD references in confirmed docs [hard]
          - "system SHALL" clauses in Then clauses match test assertions [soft — surface for review]
        CLEAN      → all hard checks pass → safe to open PR to main
        MISALIGNED → any hard check fails → stop, human investigates
        Note: misalignment here is a serious signal — do not auto-fix; human takes over
→ Skill: /verify
```

### Granularity Mapping

```
Business-layer UC/US        ↔  Cross-module user behavior
Module-layer UC/US          ↔  Single module implementation contract
Plan                        ↔  One batch of work across one or more UCs
Fix Plan                    ↔  Targeted fix for a regression
Project ADR                 ↔  Cross-module decision
Module ADR                  ↔  Single-module internal decision
API field specs             ↔  API contract file (post-implementation source of truth)
US scenarios                ↔  The contract — must be satisfied
Behavioral tests            ↔  Contract verification — protected
Implementation quality tests↔  Code quality — flexible, code only
Difficult quality test plan ↔  Refactoring signal (surface reason, continue automatically)
Plan checkboxes ([ ] / [x]) ↔  Resume state — /apply picks up from first unchecked item
3 failed test attempts      ↔  Stop and report — issue may be systemic, don't guess
Architecture diagram        ↔  System structure and interaction patterns
Directory structure         ↔  Defined in architecture.md — AI must not deviate
```
