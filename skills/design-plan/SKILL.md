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

1. **Scan `docs/drafts/use-cases/`** — which UC folders exist? Read the
   `use-case.md` for each UC in scope to find the Implementation Layer Mapping.
   If the user didn't specify which UCs to plan, ask.

2. **Check `docs/modules/`** — which modules already exist as confirmed docs?
   These are established; you know their structure.

3. **Check `src/`** — run `Glob('src/*/')` to see which module directories
   exist. Don't read file contents — just establish what's there. Modules with
   a `src/{module}/` directory are **implemented**; those without are
   **greenfield** and need `[proposed]` markers on file paths.

4. **Check `docs/drafts/plans/`** — what plan IDs are already in use?

5. **Assess plan-together need** — if multiple UCs are in scope, check:
   - Do two or more UCs name the same module in their Implementation Layer Mapping?
   - Does one UC's flow depend on state that only exists after another?
   If yes, they must be planned together; explain why in the "Why These UCs
   Are Planned Together" section of the plan.

Report what you found — established vs. greenfield modules, any ambiguous
mappings — before writing files.

---

## Step 1: Assign IDs

IDs must be assigned before writing any file.

**Plan ID:** scan `docs/drafts/plans/` for highest `plan-xxx` number → next = highest + 1. Start at `001` if empty.

**Module UC and US IDs:** each module has its own independent sequence.
For each module: scan both `docs/drafts/modules/{module}/use-cases/` and
`docs/modules/{module}/use-cases/` for highest existing UC/US IDs. UC and US
sequences are independent. Do not fill gaps. Assign all IDs now.

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

**What belongs only at the business layer (don't repeat at module level):**

- The user actor and user-facing language
- Cross-module orchestration steps
- Business validation that another module handles

### Create files

Folder: `docs/drafts/modules/{module}/use-cases/uc-{id}-{kebab-name}/`

Files:

- `use-case.md` — use the **Module Use Case template** from `references/templates.md`
- `us-{id}-{kebab-name}.md` — use the **Module User Story template** from `references/templates.md`

### Code context (established modules only)

For modules with an existing `src/{module}/` directory:

- `Glob('src/{module}/**/*.{ts,js,py,go,java}')` to see what files exist
- List the relevant ones under Affected Files in the plan
- Mark new files as `New:` and existing ones to change as `Modify:`

For greenfield modules:

- Propose file paths based on naming conventions (see CONVENTIONS.md)
- Mark every proposed path with `[proposed]`

### ADR assessment

For each module, run this check:

```
□ Does implementing this module UC require a design decision with multiple options?
□ Would a new engineer not understand why this approach was chosen just by reading the code?
□ Does this decision affect more than one module?
```

If the first two are yes: create a module-level ADR draft in
`docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md`.

If the third is also yes: create a project-level ADR draft in
`docs/drafts/adr/adr-draft-{id}-{name}.md` instead.

Read `references/templates.md` for the ADR draft template.

---

## Step 3: Write the implementation plan

File: `docs/drafts/plans/plan-{id}-{kebab-name}.md`

Use the **Implementation Plan template** from `references/templates.md`.

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

---

## Reference

Templates for all files written by this skill are in `references/templates.md`.
Read it when creating module use-case.md, module US, plan, or ADR draft files.
