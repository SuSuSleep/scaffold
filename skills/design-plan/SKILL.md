---
name: design-plan
description: >
  Create implementation plans and module-layer UC/US drafts from reviewed
  business-layer drafts. Use this skill whenever the user wants to start
  planning implementation, says "create a plan for UC-xxx", "let's plan this
  feature", "write the implementation plan", "which files will be affected",
  "plan these UCs together", or after the review-draft skill gives a READY
  verdict. Also triggers when the user says "what modules are involved",
  "derive the module docs", "what do we need to implement", or "break this
  down by module". Always run review-draft first — this skill assumes
  business drafts have already passed review.
---

# Skill: plan

Translate READY business-layer drafts into two concrete outputs:

1. **Module UC/US drafts** — what each involved module must do, written into
   `docs/drafts/modules/{module}/use-cases/`
2. **Implementation plan** — batched work items with affected files, written
   into `docs/drafts/plans/`

The goal is to give every module a clear, self-contained contract derived
from the business layer, and give the implementing engineer a sequenced
checklist that maps directly to those contracts.

---

## Step 0: Pre-flight check

Understand what context is available before writing anything.

1. **Load schema and rules.**
   - Read `docs/schema/format.md` if it exists — extract section aliases for
     `use-case` (especially `implemented-by`, default "Implementation Layer
     Mapping") and `user-story` (the doc-types created at module layer here).
     Read the `## use-case Template`, `## user-story Template`, `## API
     Contract Variants`, and `## plan Template` body sections.
   - Read `docs/schema/workflow-rules.md` if it exists — extract `id-rules`,
     `decomposition.plan-together-when-any`, `decomposition.greenfield-modules-need-proposed-marker`,
     and `adr-triggers`.
   - If either is absent, use the embedded defaults stated inline below.

2. **Scan `docs/drafts/use-cases/`** — which UC folders exist? Read each UC's
   `use-case.md` and find its implemented-by section (alias from format.md, default "Implementation Layer Mapping") to
   identify which modules are in scope. If the user didn't specify which UCs to
   plan, ask.

3. **Check `docs/modules/`** — which modules already exist as confirmed docs?
   These are established; you know their structure.

4. **Check `src/`** — run `Glob('src/*/')` to see which module directories
   exist. Don't read file contents — just establish what's there. Modules with
   a `src/{module}/` directory are **implemented**; those without are
   **greenfield**. Per `decomposition.greenfield-modules-need-proposed-marker`
   (default: true), greenfield modules need `[proposed]` markers on file paths.

5. **Check `docs/drafts/plans/`** — what plan IDs are already in use?

6. **Check for ADR supersession** — scan `docs/drafts/adr/` and
   `docs/drafts/modules/*/adr/` for any ADR draft whose Background section names
   a superseded confirmed ADR (look for phrases like "supersedes ADR-xxx" or
   "replaces ADR-xxx"). If found, flag this as an **ADR supersession plan** and
   note which confirmed ADR is being replaced. This changes how Step 2 and Step 3
   work — the batches must include implementation rework items, not just new
   scenario coverage.

7. **Assess plan-together need.** Apply `decomposition.plan-together-when-any`
   from workflow-rules. Default policy: plan multiple UCs together when any apply:
   - They share a module (`shared-module`)
   - One depends on state created by another (`ordering-dependency`)
   - They share a sub-flow (`shared-sub-flow`)

   If yes, explain why in the "Why These UCs Are Planned Together" section of
   the plan.

Report what you found — established vs. greenfield modules, any ambiguous
mappings — before writing files.

---

## Step 1: Assign IDs

Apply `id-rules` from workflow-rules.md (default: `highest-plus-one`, no gaps,
independent sequences). Assign all IDs before writing any file:

- **Plan ID:** scan `docs/drafts/plans/` for highest `plan-xxx` → next = highest + 1
- **Module UC and US IDs:** per-module sequences. For each module, scan both
  `docs/drafts/modules/{module}/use-cases/` and `docs/modules/{module}/use-cases/`
  for highest existing UC/US IDs. UC and US sequences are independent across modules.

---

## Step 2: Derive module UC/US drafts

For each module involved, do the following.

### Translate business → module

The business-layer US describes the user's goal. The module-layer UC/US
describes what *this module* must do to fulfil its part of that goal. The
translation is the core intellectual work:

- The **trigger** replaces the primary actor (it's "what calls into this module")
- The **main flow** describes module-internal steps, not user steps
- The **interface contract** replaces the public API contract — it describes
  what this module accepts and emits (events, responses, side effects)
- **Test scenarios** mirror the business-layer scenarios but expressed from
  the module's perspective (e.g., "payment-module receives a valid charge
  request" not "user submits card details")

**What to carry over from the business-layer US:**

- The scenario structure (Given/When/Then), adapted to module perspective
- The happy path and all exception scenarios
- Idempotency/retry requirements if the module owns that concern

**What to carry over from the business-layer UC (`use-case.md`):**

- Business rules that this module is responsible for enforcing (authorization,
  quotas, rate limits) → write into the module UC's `business-rules` section.
  Only include the rules this module actually enforces; rules enforced by
  another module belong in that module's UC.

**What belongs only at the business layer (don't repeat at module level):**

- The user actor and user-facing language
- Cross-module orchestration steps
- Business validation that another module handles

### Create files

Folder: `docs/drafts/modules/{module}/use-cases/uc-{id}-{kebab-name}/`

Files (project and module layers share the same doc-types; layer is determined
by folder path). Set `schema-version` in each file's
frontmatter per the "Schema versioning" section in
`skills/init/references/format.md` (use the project's `docs/schema/format.md`
version if present; otherwise 0).

- `use-case.md` — prepend frontmatter (doc-type `use-case`, schema name and
  version from `format.md`, sections map from `format.md`'s `use-case.sections`).
  At module layer: **include** the `serves` section (filled with the link to the
  business UC); **omit** the `implemented-by` section. Write the body from
  `docs/schema/format.md`'s `## use-case Template`.
- `us-{id}-{kebab-name}.md` — prepend frontmatter (doc-type `user-story`,
  schema info, sections from `format.md`'s `user-story.sections`, plus
  `api-type` chosen for this module). At module layer: **include** the `serves`
  section (filled with the link to the business US). Pick the api-type based
  on the module's interface style (default `function` for modules; use `rest`
  if the module exposes HTTP endpoints, `event` for event-driven modules,
  etc.). Use the body from `docs/schema/format.md`'s `## user-story Template`
  with the matching variant from `## Interface Contract Variants`.

If `docs/schema/format.md` does not exist in the project, use the shipped
defaults from `skills/init/references/format.md` (the agent-skills schema).

### Code context (established modules only)

For modules with an existing `src/{module}/` directory:

- `Glob('src/{module}/**/*.{ts,js,py,go,java}')` to see what files exist
- List the relevant ones under Affected Files in the plan
- Mark new files as `New:` and existing ones to change as `Modify:`

For greenfield modules:

- Propose file paths based on naming conventions (see CONVENTIONS.md)
- Mark every proposed path with `[proposed]`

### ADR supersession (when flagged in Step 0)

When this plan involves an ADR supersession, the module UC/US translation changes:

- Read the new ADR draft in full before writing any module doc — the decision it
  describes is the implementation target.
- In the module UC's **Main Flow**, describe what the module must now do under the
  new decision (not what it currently does). Be explicit about what changes: e.g.,
  "validate session token from cookie" instead of "validate JWT from Authorization header".
- In the module US's **api-contract section / Expected Behavior**, describe the new
  interface shape the ADR introduces. The api-contract section's shape depends
  on the doc's api-type (see format.md's "Interface Contract Variants").
- Do not document the old approach — the draft reflects the desired future state.

If the module has an existing confirmed UC/US that was copied to `docs/drafts/` as
part of the ADR cascade (by `/draft`), use it as your baseline — carry forward
everything that stays the same and update only what the ADR changes.

### ADR assessment

Apply `adr-triggers` from workflow-rules.md. Default policy — for each module,
run this check:

```
□ Does implementing this module UC require a design decision with multiple options?
□ Would a new engineer not understand why this approach was chosen just by reading the code?
□ Does this decision affect more than one module?
```

If the first two are yes: create a module-level ADR draft in
`docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md`.

If the third is also yes: create a project-level ADR draft in
`docs/drafts/adr/adr-draft-{id}-{name}.md` instead.

Use the `## adr Template` from `docs/schema/format.md` for the ADR body.

---

## Step 3: Write the implementation plan

File: `docs/drafts/plans/plan-{id}-{kebab-name}.md`

Prepend frontmatter (doc-type `plan`, schema info, sections map from format.md's
`plan.sections`). Set `schema-version` per the "Schema versioning" section in
`skills/init/references/format.md`. Then write the body from
`docs/schema/format.md`'s `## plan Template`.

### Goals and scope

- Goals map directly to US stories — "implement UC-001 US-001 and US-002"
- Non-goals: explicitly list anything adjacent that is NOT being done
- Scope: list UC → US IDs being covered
- Deferred: any US that is explicitly excluded and why

### Affected files

List per module. For each file, say whether it's `New:` or `Modify:`.
Use `[proposed]` for files that don't exist yet. Derive these from your
Glob results and the module US you just wrote.

### Batches

Organise batches by implementation dependency — what can run in parallel vs.
what must be sequential. Each batch item is one US scenario:

```
- [ ] US-001 Scenario 1: Valid payment creates a transaction
```

The standard per-batch sequence:

1. Implement the feature
2. Write behavioral tests — confirm all scenarios pass
3. Plan implementation quality tests
   → If difficult: refactoring signal
4. Implement and pass implementation quality tests

### ADR supersession batches (when flagged in Step 0)

When this plan is an ADR supersession plan, affected modules need implementation
rework, not just new scenario additions. Add a dedicated rework batch **before**
the scenario-driven batches for each affected module:

```
### Batch N: ADR rework — {module-name}

Depends on: nothing (this is the foundation other batches build on)

- [ ] Rework {file} to implement {new-ADR-approach} replacing {old-ADR-approach} — see ADR-{new-id}
  [repeat per Modify: file in this module affected by the ADR change]
- [ ] Update inline code references: replace `// see ADR-{old-id}` → `// see ADR-{new-id}`
  in all affected src/ files
```

The rework batch must come first — behavioral test batches run after the rework, not
before, since the existing behavioral tests must continue to pass under the new approach.

### Final batch — integration verification

Include ALL of:

- Every scenario from this plan (new scenarios)
- Every existing scenario from every **touched module** (regression check)

To find existing scenarios: read each confirmed US file in
`docs/modules/{module}/use-cases/` for touched modules. If there are none
yet, note "no existing scenarios to regress".

---

## Step 4: Print summary

```
Plan complete
──────────────────────────────────────────────────────
Module drafts created:
  docs/drafts/modules/{module}/use-cases/uc-{id}-{name}/
    use-case.md
    us-{id}-{name}.md
  [repeat per module]

Plan created:
  docs/drafts/plans/plan-{id}-{name}.md

ADR drafts created: [filename, or "none"]

[proposed] paths: [list any file paths that are proposals, or "none"]

Notes:
  [anything the user should know — ambiguous mappings, TBD module
   assignments, decisions worth discussing before implementation]
```
