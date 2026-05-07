---
name: draft
description: >
  Manage the docs/drafts/ folder — create, update, and delete draft documents
  (use cases, user stories, ADR drafts) in response to new or changing business
  requirements. Use this skill whenever the user describes a new feature
  requirement, changes an existing requirement, cancels a feature, or says
  anything that implies docs/drafts/ should change. Also triggers on phrases
  like "add a draft", "document this requirement", "new feature:", "requirement
  changed", "we're dropping UC-xxx", "update the draft for", "let's define the
  flow for", "this feature is cancelled", or "the business wants X instead".
  A single invocation handles any mix of creates, updates, and deletes — it
  derives the full change set from context and executes everything in one pass.
  Use this skill even when the user hasn't finished thinking — ask a clarifying
  question rather than skipping the skill.
---

# Skill: draft

Translate business requirement changes into `docs/drafts/` — creating, editing,
and deleting UCs, USs, and ADR drafts as needed. A single invocation may do any
combination of these operations; the skill derives the complete change set from
context and executes it all.

This skill is self-contained. All templates and rules are embedded below.

---

## Step 0: Orient

1. Scan `docs/drafts/use-cases/` to understand what already exists — folder names,
   IDs in use, and content of any files that might be relevant to the current change.
2. If `docs/drafts/use-cases/` doesn't exist, create it (and `docs/drafts/` if needed).
3. If `docs/modules/` exists, note the module names — you'll use them during
   discovery.

---

## Step 1: Understand the full change

Read everything in the conversation about what is new, changing, or being dropped.

Map the intent to operations:

```
New requirement      → CREATE new UC folder + US file(s) + optional ADR draft
Requirement changes  → UPDATE existing UC/US/ADR files
Cancelled feature    → DELETE draft folder/files + repair cross-references
```

A single invocation can involve all three. Derive the **complete operation set**
before touching any files.

**If anything is genuinely ambiguous** — the actor is unclear, the scope is
unclear, or you can't tell which existing draft is meant — ask the user before
proceeding. Don't guess.

---

## Step 2: Discover related existing docs

Extract keywords from the requirement (business terms, actor names, data entities,
system names). Search for those keywords across:

- `docs/drafts/use-cases/` — other in-progress drafts that overlap or would be affected
- `docs/use-cases/` — confirmed features this requirement relates to or extends
- `docs/drafts/adr/` and `docs/adr/` — architecture decisions that constrain this requirement
- `docs/modules/` — modules likely responsible for implementation (skip if absent)

**What to do with what you find:**

- **Structural impact** (the operation changes something other drafts reference,
  e.g., a UC-ID is being deleted or renamed): these files must be updated as part
  of the operation set — add them to Step 6.
- **Conceptual impact** (the new requirement overlaps with or extends something,
  but no file structure is broken): flag these in the summary for human review.
  Don't touch them unless the user directs you to.

Also check whether the new UC's "Related Use Cases" section can be populated from
what you find. Fill in any genuine relationships (prerequisite, follow-up, related,
shared sub-flow) rather than leaving the template placeholder.

---

## Step 3: Assign IDs for new documents

Scan **both** `docs/drafts/use-cases/` and `docs/use-cases/` to find the highest
existing ID in each sequence — drafts and confirmed docs share the same ID namespace.
UC and US ID sequences are independent of each other.

**Rule**: Find the highest existing ID across both locations → next ID = highest + 1.
Do not fill gaps. If `uc-001` and `uc-003` exist across both folders, the next UC is `uc-004`.
If both locations are empty or newly created, start at `001`.

Assign all IDs for the full operation set **before writing any files**, so a
single change that creates multiple documents doesn't produce ID conflicts.

ADR drafts have their own independent ID sequence. Find the highest
`adr-draft-xxx` in `docs/drafts/adr/` and increment from there.

---

## Step 4: Decompose into UCs and USs

**One UC per distinct user goal.** A UC is one reason a user would enter the
system. If a requirement spans two different user goals, create two separate UCs.

**Create multiple USs under one UC when:**

- The flow has distinct exception paths that each need their own API contract
- The same goal involves multiple actor perspectives (e.g., buyer and seller both
  participate in "checkout")
- The happy path has discrete phases that can independently fail (initiate →
  confirm → complete)

**Practical rule of thumb**: if you'd write more than one HTTP endpoint, consider
splitting into multiple USs. If the user's goal changes between those endpoints,
split into multiple UCs instead.

**Handling overlapping UCs:**

| Situation | How to handle |
|---|---|
| Multiple UCs share steps | Extract a shared sub-UC; original UCs reference it |
| Scope expands on existing UC | Modify the existing UC; add new US files |
| Goal fundamentally changes | Delete old UC; rebuild a new one |

---

## Step 5: Assess whether an ADR draft is needed

For any new requirement or significant change, run this checklist:

```
□ Did we consider multiple implementation options?
□ Does this decision affect more than one module?
□ Would a new team member not understand why this was done just by reading the result?
```

**All three "yes"** → auto-create an ADR draft. Do not ask — just create it.
Use `Status: Proposed` and the ADR template in the Reference section below.

**Any "no"** → skip the ADR. A note in the US's Expected Behavior section is enough.

---

## Step 6: Execute the full operation set

**Order**: creates first, then updates, then deletes, then cross-reference repairs.
This ensures you don't delete something before you've updated what references it.

### Creating new UC drafts

Folder: `docs/drafts/uc-{id}-{kebab-case-name}/`

Files to create:

- `use-case.md` — use the **Use Case template** from the Reference section below
- `us-{id}-{kebab-case-name}.md` for each user story — use the **User Story
  (Detailed) template** from the Reference section below

Fill every section you can derive from the requirement. Sections where the
requirement doesn't provide enough detail can stay as template placeholders —
incomplete content is explicitly allowed in drafts.

**Dangling references**: if a new doc references something still in drafts/ (e.g.,
a related ADR not yet confirmed), write `TBD` with a note pointing to the draft:

```markdown
- Related ADR: TBD (retry strategy under discussion, see docs/drafts/adr-draft-001-retry)
```

### Updating existing drafts

Overwrite affected sections directly — drafts always reflect the current state,
not a history. There is no version tracking inside the file itself; git handles
history.

**When a UC's goal changes fundamentally**: delete the old `use-case.md` and
write a new one from the template. Then evaluate each existing US file under that
UC:

- Still aligned with the new goal → keep it, update the `Belongs to:` link if needed
- Partially aligned → update it
- No longer relevant → delete it and repair any references to it

**When only a US needs updating**: edit the US file directly. If the change adds
a new exception flow complex enough to need its own API contract, create a new US
file rather than expanding the existing one.

### Deleting cancelled drafts

Cancelled requirements are deleted immediately — do not keep them.

Before deleting:

1. Scan all other files in `docs/drafts/` for references to the UC/US being deleted
2. Update those references — remove the reference line, or replace it with a
   note that the feature was cancelled
3. Then delete the folder and all its contents

### Repairing cross-references

After creates, updates, and deletes, scan `docs/drafts/` for stale cross-references
(pointing to a file you renamed, split, or deleted). Fix them. Don't touch
references in `docs/use-cases/` — those are confirmed documents and outside this
skill's scope.

---

## Step 7: Print summary

```
Draft update complete
──────────────────────────────────────────────────────
Created:   [list files with paths, or "none"]
Updated:   [list files with brief note on what changed, or "none"]
Deleted:   [list folders/files deleted, or "none"]
ADR:       [filename if created, or "not needed — [reason from checklist]"]
Refs fixed: [cross-references updated — omit section if none were touched]
May need review:
           [related docs found in Step 2 that weren't edited but might need
            human attention — omit section if nothing was flagged]
```

---

## Reference: File naming

| Document | Path pattern |
|---|---|
| Business UC folder | `docs/drafts/use-cases/uc-{id}-{kebab-name}/` |
| Use case file | `docs/drafts/use-cases/uc-{id}-{name}/use-case.md` |
| User story (detailed) | `docs/drafts/use-cases/uc-{id}-{name}/us-{id}-{kebab-name}.md` |
| Project ADR draft | `docs/drafts/adr/adr-draft-{id}-{kebab-name}.md` |

Kebab-case name is derived from the document title. Keep it short (2–4 words),
lowercase letters, digits, and hyphens only.

---

## Reference: Templates

### Use Case template

```markdown
# UC-001: [Business Goal Name]

## Basic Information

- Primary Actor: (who is trying to accomplish this)
- Preconditions: (what must be true before entering this flow)
- Postconditions: (what the system state looks like after the flow completes)

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

- {module-a} → docs/modules/{module-a}/use-cases/uc-xxx/
- {module-b} → docs/modules/{module-b}/use-cases/uc-xxx/
```

---

### User Story (Detailed) template

Use this template for all US files inside `docs/drafts/`. It is the
pre-implementation reference — define the API Contract in full here.
Incomplete sections are allowed; the document evolves throughout development.

```markdown
# US-001: [Feature Name]

## Links

- Belongs to: UC-001
- Related ADR: ADR-xxx (mark as "TBD" if not yet confirmed)

## Story

As a **[actor]**
When **[context or trigger]**
I want **[action or capability]**
So that **[benefit or outcome]**

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
- Other special constraints

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

### ADR draft template

Use this for `adr-draft-{id}-{name}.md` files in `docs/drafts/`.
Status must be `Proposed` while in drafts. Move to `docs/adr/` and change status
to `Adopted` only when the decision is confirmed.

```markdown
# ADR-001: [Decision Name]

## Status

Proposed (yyyy-mm-dd)

## Background

Why this decision was needed and what problem it addresses.
(If this overturns a previous approach, explain the context and why reverting is
not an option.)

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
