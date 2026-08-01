---
schema: agent-skills
version: 4
use-case:
  sections:
    actor: "Primary Actor"
    serves: "Source"
    preconditions: "Preconditions"
    business-rules: "Business Rules"
    postconditions: "Postconditions"
    flow: "Main Flow"
    exceptions: "Exception Flows"
    related: "Related Use Cases"
    implemented-by: "Implementation Layer Mapping"
    required-extra: []
user-story:
  api-type: rest
  sections:
    parent-link: "Belongs to"
    serves: "Derived from"
    adr-link: "Related ADR"
    story: "Story"
    expected-behavior: "Expected Behavior"
    api-contract: "Interface Contract"
    scenarios: "Test Scenarios"
    required-extra: []
adr:
  sections:
    status: "Status"
    background: "Background"
    options: "Options Considered"
    decision: "Decision"
    impact: "Impact"
    required-extra: []
plan:
  sections:
    goals: "Goals"
    non-goals: "Non-Goals"
    scope: "Scope"
    deferred: "Deferred"
    affected-files: "Affected Files"
    plan-together-rationale: "Why These UCs Are Planned Together"
    batches: "Implementation Batches"
    related-adrs: "Related ADRs"
    required-extra: []
fix-plan:
  sections:
    root-cause: "Root Cause"
    goals: "Goals"
    non-goals: "Non-Goals"
    scope: "Scope"
    affected-files: "Affected Files"
    batches: "Implementation Batches"
    required-extra: []
---

# Format: Agent Skills

This file defines the document schema for this project. Skills read the YAML
frontmatter above to know what sections to create and look for. Each document
created by `/draft`, `/design-plan`, `/scan-deep`, or `/compose` carries a copy
of its relevant section aliases in its own frontmatter — so reading skills
never need to consult this file again.

To customize: edit the YAML frontmatter above, then run `/schema-update` to
migrate existing documents to the new section names and add any new required
sections.

## Schema versioning

Documents carry a `schema-version` field in their frontmatter. The convention:

| Value         | Meaning                                                     |
|---------------|-------------------------------------------------------------|
| `0`           | Document was written when no project schema existed         |
|               | (no `docs/schema/format.md` at write time). `/schema-update` |
|               | will detect these as legacy and bootstrap them on next run. |
| `1`, `2`, `3`, `4` | Document was written under the named schema version of this |
|               | project's `format.md`. `/schema-update` migrates when the   |
|               | project's `format.md` version is bumped beyond a doc's      |
|               | recorded version.                                           |

When a skill writes a document and `docs/schema/format.md` doesn't exist in the
project, it still uses the shipped templates from
`skills/init/references/format.md` (currently v4) — but it stamps the document
as `schema-version: 0` because there is no project-level schema to bind to.
Later, `/schema-update` can adopt these docs into a real project schema.

---

## Document layers and section visibility

There are two doc-types — `use-case` and `user-story` — used at both the
**project layer** (`docs/use-cases/`) and the **module layer**
(`docs/modules/{module}/use-cases/`). Layer is determined by folder path, not
doc-type.

Several sections are layer-specific (optional in the schema; included by skills
based on where the document is being written):

| Section            | Project layer            | Module layer             |
|--------------------|--------------------------|--------------------------|
| `serves`           | omit (top-level)         | include (link upward)    |
| `implemented-by`   | include (lists modules)  | omit                     |
| `related`          | typical                  | optional                 |

All other sections are present at both layers — only the *content* varies (e.g.,
the Story actor is a person at project layer, a module name at module layer).

---

## use-case Template

Used by `/draft` (project layer, greenfield), `/compose` (project layer,
brownfield), `/design-plan` (module layer, greenfield), and `/scan-deep`
(module layer, brownfield) when creating a `use-case.md`.

Include or omit the optional sections (`serves`, `implemented-by`) based on
layer (see table above).

```markdown
# UC-{id}: [Goal Name]

## Primary Actor

(who/what initiates this — a user role at project layer, a caller/trigger at
module layer, e.g. "Customer" or "Inbound HTTP POST /payments")

## Source

(omit at project layer)
(at module layer: link to business UC — e.g.
 "docs/drafts/use-cases/uc-{id}-{name}/" — or "TBD (will be linked after
 /compose)" if creating from code first)

## Preconditions

(what must be true before this flow can begin. At project layer: user-visible
 state requirements such as "user is logged in", "cart is not empty". At
 module layer: technical guards such as input validation, format checks, and
 type constraints.)

## Business Rules

(rules that must be enforced during the flow — authorization, roles, quotas,
 rate limits, business-state requirements. These typically can't be inferred
 from code alone; they come from product requirements.)

## Postconditions

(what the system state looks like after the flow completes)

## Main Flow

1.
2.
3.

## Exception Flows

- [Scenario description]: → See US-xxx

## Related Use Cases

- Prerequisite: UC-xxx (what must be completed first)
- Follow-up: UC-xxx (what is triggered after completion)
- Related: UC-xxx (parallel related features)
- Shared sub-flow: UC-xxx (a flow referenced by this UC)

## Implementation Layer Mapping

(omit at module layer)
(at project layer: list which modules implement this UC)

- {module-a} → docs/modules/{module-a}/use-cases/uc-xxx/
- {module-b} → docs/modules/{module-b}/use-cases/uc-xxx/
```

---

## user-story Template

Used by `/draft` (project layer, greenfield), `/compose` (project layer,
brownfield), `/design-plan` (module layer, greenfield), and `/scan-deep`
(module layer, brownfield) when creating a `us-{id}-{name}.md`.

The `## Interface Contract` section's body shape varies by `api-type` (set in the
document's frontmatter). See "Interface Contract Variants" below for the sub-template
matching each api-type. Include the `Derived from` link only at module layer.

```markdown
# US-{id}: [Feature Name]

## Links

- Belongs to: UC-{id}
- Derived from: (omit at project layer)
  (at module layer: link to business US — e.g.
   "docs/drafts/use-cases/uc-{id}-{name}/us-{id}-{name}.md" — or "TBD (will be
   linked after /compose)" if creating from code first)
- Related ADR: ADR-xxx (mark as "TBD" if not yet confirmed)

## Story

As a/the **[actor — a user role at project layer, a module name at module layer]**
When **[context or trigger]**
I want **[capability or action]**
So that **[benefit or outcome]**

## Expected Behavior

(Describe what this feature does — user-visible at project layer,
 module-internal at module layer)

## Interface Contract

(Use the sub-template matching the document's api-type — see "Interface Contract
Variants" below.)

## Test Scenarios

### Scenario 1: [Scenario Name]

- **Given**: (precondition — use concrete values)
- **When**: (action taken)
- **Then**: the system SHALL (expected result — use concrete values)

### Scenario 2: [Scenario Name]

- **Given**:
- **When**:
- **Then**: the system SHALL

### Scenario 3: [Edge Case]

- **Given**:
- **When**:
- **Then**: the system SHALL
```

---

## Interface Contract Variants

Each variant replaces the body of the `## Interface Contract` section in the
user-story template. The chosen variant is determined by the document's
`api-type` frontmatter value.

### Variant: rest (default)

```markdown
### Endpoint

POST /api/v1/[path]

### Request

| Field   | Type   | Required | Rules                                  |
| ------- | ------ | -------- | -------------------------------------- |
| field_a | string | Yes      | UUID format                            |
| field_b | number | Yes      | Greater than 0, up to 2 decimal places |

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
- Other constraints
```

### Variant: function

```markdown
### Signature

{function name}({param: Type, …}) → {ReturnType}

### Parameters

| Parameter | Type   | Required | Rules             |
| --------- | ------ | -------- | ----------------- |
| {param}   | {type} | {Yes/No} | {validation rule} |

### Returns

| Field   | Type   | Description   |
| ------- | ------ | ------------- |
| {field} | {type} | {description} |

### Throws

| Error            | When               |
| ---------------- | ------------------ |
| {ErrorType/code} | {when this occurs} |

### Notes

- Idempotency: (does this deduplicate? how?)
- Retry behaviour: (safe to retry?)
```

### Variant: event

```markdown
### Event Subscribed

{event name / topic}

### Payload

| Field   | Type   | Description       |
| ------- | ------ | ----------------- |
| {field} | {type} | {description}     |

### Side Effects / Emitted Events

- {effect or emitted event name}

### Notes

- Delivery guarantee: (at-least-once, exactly-once, at-most-once)
- Idempotency:
```

### Variant: cli

```markdown
### Command

{tool} {subcommand} [flags] [args]

### Flags

| Flag        | Type    | Required | Description       |
| ----------- | ------- | -------- | ----------------- |
| --{flag}    | {type}  | {Yes/No} | {description}     |

### Stdin / Stdout / Stderr

- Stdin:  {expected input format, or "none"}
- Stdout: {output format}
- Stderr: {error output format}

### Exit Codes

| Code | Meaning             |
| ---- | ------------------- |
| 0    | success             |
| 1    | {failure reason}    |

### Notes

- Idempotency:
```

### Variant: graphql

```markdown
### Operation

`{query|mutation|subscription} {OperationName}({args}): {ReturnType}`

### Arguments

| Argument | Type      | Required | Description   |
| -------- | --------- | -------- | ------------- |
| {arg}    | {GqlType} | {Yes/No} | {description} |

### Returns

| Field   | Type      | Description   |
| ------- | --------- | ------------- |
| {field} | {GqlType} | {description} |

### Errors

| Error code      | Description       |
| --------------- | ----------------- |
| {error}         | {when}            |

### Notes
```

### Variant: grpc

```markdown
### Service / RPC

`{ServiceName}.{RpcMethod}({RequestMessage}) returns ({ResponseMessage})`

### Request Message

| Field   | Type      | Description   |
| ------- | --------- | ------------- |
| {field} | {protobuf type} | {description} |

### Response Message

| Field   | Type      | Description   |
| ------- | --------- | ------------- |
| {field} | {protobuf type} | {description} |

### Status Codes

| Code               | Description       |
| ------------------ | ----------------- |
| OK                 | success           |
| INVALID_ARGUMENT   | {when}            |
| NOT_FOUND          | {when}            |

### Notes
```

### Variant: none

(Omit the `## Interface Contract` section entirely. Use for user stories that describe
internal behavior with no externally visible contract — rare; usually a sign
the story belongs elsewhere.)

---

## adr Template

Used when creating a new `adr-draft-{id}-{name}.md`.

```markdown
# ADR-{id}: [Decision Name]

Status: Proposed

## Context

(What is the situation and why does a decision need to be made?)

## Decision

(What did we decide and why?)

## Consequences

(What are the results of this decision — both good and bad?)
```

---

## plan Template

Used by `/design-plan` when creating `plan-{id}-{name}.md`.

```markdown
# Plan-{id}: [Feature Area Name]

## Goals

- (Specific and verifiable — maps to one or more US scenarios)

## Non-Goals

- (Explicitly out of scope)

## Scope

- UC-{id} {name} → US-{id}, US-{id}

## Deferred

- UC-{id} US-{id}: deferred (reason: ...)

## Affected Files

- {module-a}:
  - New: src/{module-a}/{file}.{ext} [proposed]
  - Modify: src/{module-a}/{file}.{ext}
- {module-b}:
  - Modify: src/{module-b}/{file}.{ext}

## Why These UCs Are Planned Together

(Explain if multiple UCs are in scope — what dependency or shared module
makes it necessary to plan them in one batch. Omit section for single UC.)

## Implementation Batches

Each batch follows this sequence:
1. Implement the feature
2. Write behavioral tests — confirm all scenarios pass
3. Plan implementation quality tests
   → If difficult: refactoring signal — refactor under behavioral test
     protection, then re-plan quality tests
4. Implement and pass implementation quality tests

### Batch 1: [Core Interface Name]

- [ ] US-{id} Scenario 1: [scenario name]

### Batch 2: [Failure Handling Name]

Depends on Batch 1.

- [ ] US-{id} Scenario 2: [scenario name]
- [ ] US-{id} Scenario 3: [scenario name]

### Final Batch: Integration Verification

> If any item fails: analyse root cause → create fix plan → implement →
> re-run this entire batch → repeat until all green → then merge.

#### New scenarios (this plan)

- [ ] US-{id} Scenario 1: [scenario name]
- [ ] US-{id} Scenario 2: [scenario name]

#### Existing scenarios of touched modules (regression check)

- [ ] US-{id} Scenario {n}: [existing scenario name]
  (or: "No existing scenarios — module is greenfield")

## Related ADRs

- ADR-{id}: (decision title — affects Batch n)
  (or: TBD — mark as TBD if a draft exists but isn't confirmed)
```

---

## fix-plan Template

Used by `/apply` when the Final Batch integration verification fails and a
regression fix plan must be created. Structurally similar to `plan`, but adds
a Root Cause section up front and omits sections that don't apply to a scoped
regression fix (no Deferred list, no plan-together rationale, no Related ADRs
by default — add them as `required-extra` if your project needs them).

```markdown
# Plan-{id}: Fix [description of regression]

## Root Cause

(Which plan's verification surfaced this, which test failed, and why.)

## Goals

- (Specific fix — maps to the failing scenario)

## Non-Goals

- (What will not change — keeps scope minimal)

## Scope

- US-{id} → Scenario {n}

## Affected Files

- Modify: src/{module}/

## Implementation Batches

### Batch 1: Fix [description]

- [ ] US-{id} Scenario {n}: [scenario name]

### Final Batch: Integration Verification

#### Fixed scenarios

- [ ] US-{id} Scenario {n}: [scenario name]

#### Full regression check

- [ ] US-{id} Scenario {n}: [existing scenario]
- [ ] (all other scenarios from the original plan)
```
