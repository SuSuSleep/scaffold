---
name: merge
description: >
  Promote confirmed docs from docs/drafts/ to their permanent locations, rewrite
  US files to simplified format, and commit all doc changes in one git commit.
  Use this skill whenever the user says "merge the plan", "promote the docs",
  "confirm UC-xxx", "let's merge", "merge plan-xxx", or whenever /apply announces
  "Ready for /merge". Also triggers on "the plan is done, let's confirm it",
  "move the drafts to confirmed", or "promote this UC". Always reads the plan
  first — requires all plan checkboxes to be [x] before proceeding. Partial
  merges (some UCs done, others not) are not supported.
---

# Skill: merge

Promote a completed implementation plan's draft docs to their permanent
confirmed locations. This is the final documentation step after `/apply`
finishes: files move from `docs/drafts/` to their confirmed homes, US files
get simplified, module READMEs get updated, and everything goes into one clean
doc commit.

The promotion rule (`lifecycle.promotion-rule` in `workflow-rules.md`, default
`remove-drafts-prefix`) is simple: remove `drafts/` from the path. That is the
only structural change. The content changes are the US simplification and
README append.

---

## Step 0: Orient

### 0a. Load schema and rules

- Read `docs/schema/format.md` if it exists — extract section aliases for
  `user-story` (especially `api-contract` and `scenarios`) and for `use-case`.
  These tell you which section headings to find when simplifying US files.
- Read `docs/schema/workflow-rules.md` if it exists — extract `gates` (which
  conditions block vs warn), `lifecycle` (promotion rule, ADR transitions,
  supersession behavior), and `cross-references` (TBD handling).
- If either file is absent, use the embedded defaults stated inline below.

### 0b. Find the plan

If the user named a plan (e.g. "merge plan-002"), use it. Otherwise:

- Glob `docs/drafts/plans/plan-*.md`
- If exactly one exists, use it and announce it
- If multiple exist, list them and ask which to use

Read the plan file in full. Collect:

- Every `- [ ]` and `- [x]` item to verify completion
- The **Scope** section → which UCs are being confirmed
- The **Affected Files** section → which modules are touched
- The **Related ADRs** section → which ADR drafts to promote

### 0c. Verify all checkboxes are checked

Per `gates.merge-blocks-on: any-unchecked-plan-item`, count every `- [ ]` item.
If any remain unchecked, stop immediately:

```
Merge blocked — {N} tasks are not yet complete:
  - [ ] US-001 Scenario 2: Invalid card number
  - [ ] Final Batch: Integration Verification

Complete these with /apply before merging.
```

Do not proceed past this point until all items are `[x]`.

---

## Step 1: Pre-merge checklist

Apply `gates.merge-blocks-on` (hard) and `gates.merge-warns-on` (soft) from
`workflow-rules.md`. Default policy:

```
Hard blocker:  missing-behavioral-test-file
Warnings:      api-endpoint-missing-from-spec, stale-uc-main-flow,
               remaining-tbd-references, new-module-not-in-architecture
```

Run each check and report PASS / WARN / SKIP / BLOCKER. The goal is to give
the user a clear picture before files move.

**1. UC main flow** (warn-only) — read each `use-case.md` in scope. Does the
main flow section (alias from `format.md`, default "Main Flow") still describe
what the implementation actually does? Use your judgment. Report PASS if it
looks accurate, WARN if something seems stale.

**2. Behavioral tests** (HARD BLOCKER) — for each US in scope, check whether
a test file exists at the path defined by `test-conventions.behavioral-path-pattern`
in workflow-rules (default `tests/behavioral/{module}/us-{id}-*.test.*`).
Report PASS or BLOCKER (list missing files).

**3. Interface Contract vs api-spec** (warn-only) — for each US file in scope, read
its `api-type` frontmatter. If `api-type: rest`: find the api-contract section
(alias from `format.md`, default "Interface Contract") and its `### Endpoint`
sub-heading. Check whether that endpoint path appears in
`docs/overview/api-spec.yaml`. Report PASS if found, WARN if not. For any
other api-type (`function`, `event`, `cli`, `graphql`, `grpc`, `none`): SKIP
this check (api-spec.yaml is REST-specific).

**4. TBD references** (warn-only) — scan all draft files being promoted for
`TBD` strings. Note which ones point to paths that are now confirmed (resolve
them in Step 2f). Report how many were found.

**5. New module or dependency** (warn-only) — does the plan's Affected Files
section list a module whose `src/` directory didn't exist before this plan?
Does any UC reference a new external service not in `architecture.md`? WARN if
yes.

**6. ADR supersession** (include only when the plan's Related ADRs contains a new
ADR that supersedes an existing one — check the new ADR draft's Background section):

- Confirm the old confirmed ADR file still exists at its current path (it will be
  deleted in Step 2c)
- Search `docs/drafts/` for any remaining `Related ADR: ADR-{old-id}` references —
  they should all have been changed to TBD during `/draft`. Report WARN if any remain.
- Search `src/` for `// see ADR-{old-id}` or `ADR-{old-id}` inline references —
  they should all have been updated by `/apply`. Report WARN if any remain, PASS if none.

Print the checklist results before proceeding:

```
Pre-merge checklist
────────────────────────────────────────
UC main flow     PASS
Behavioral tests PASS  (4 files verified)
Interface Contract     WARN  POST /payments not found in api-spec.yaml
TBD references   2 found — will resolve
New module       SKIP  (no new module detected)
ADR supersession PASS  (include only when ADR supersession is involved)
────────────────────────────────────────
1 warning — proceeding. Review warnings in final summary.
```

If a behavioral test BLOCKER was found, stop here and list what's missing.

---

## Step 2: Promote files

Work through each sub-step in order. Moving files before rewriting them avoids
editing files in two places.

### 2a. Business-layer UC/US

For each UC in the plan's Scope:

1. Move the entire folder (applies the `lifecycle.promotion-rule`):
   `docs/drafts/use-cases/uc-{id}-{name}/` → `docs/use-cases/uc-{id}-{name}/`

2. For each US file in the moved folder, simplify the api-contract section
   using the section name from its own frontmatter (`sections.api-contract`,
   default "Interface Contract"). The summary form depends on the document's
   `api-type` frontmatter:

   | api-type   | Extract                                    | Summary line                                 |
   |------------|--------------------------------------------|----------------------------------------------|
   | `rest`     | `### Endpoint` value                       | `- Endpoint: POST /api/v1/payments`          |
   | `function` | `### Signature` value                      | `- Signature: someFunction(args) → ReturnType` |
   | `event`    | `### Event Subscribed` value               | `- Event: order.created`                     |
   | `cli`      | `### Command` value                        | `- Command: tool subcommand [flags]`         |
   | `graphql`  | `### Operation` value                      | `- Operation: mutation processPayment`       |
   | `grpc`     | `### Service / RPC` value                  | `- Service: PaymentService.Charge`           |
   | `none`     | (none — remove section entirely)           | —                                            |

   Replace the entire api-contract section body with the single summary line.
   Keep all other sections unchanged.

   If the document has no `api-type` in frontmatter (legacy doc), infer it from
   the section's sub-headings and apply the matching rule.

### 2b. Module-layer UC/US

For each module in the plan's Affected Files:

1. Move: `docs/drafts/modules/{module}/use-cases/uc-{id}-{name}/` →
   `docs/modules/{module}/use-cases/uc-{id}-{name}/`

2. For each US file: apply the same simplification rules as 2a. Module US
   files use the same `user-story` doc-type as project US files;
   the only difference at the module layer is that the api-type is typically
   `function` (or `event`/`cli`/etc.) instead of `rest`. The simplification
   table in 2a covers all api-types.

### 2c. ADR drafts

Apply `lifecycle.adr-proposed-to-adopted-on-merge` (default: true). For each
ADR listed in the plan's Related ADRs:

- If at `docs/drafts/adr/adr-draft-{id}-{name}.md`:
  → Move to `docs/adr/{id}-{name}.md`
  → Change `Status: Proposed (date)` → `Status: Adopted (today's date)`

- If at `docs/drafts/modules/{module}/adr/adr-draft-{id}-{name}.md`:
  → Move to `docs/modules/{module}/adr/{id}-{name}.md`
  → Same status update

**If the promoted ADR supersedes an existing confirmed ADR** (per
`lifecycle.adr-supersession-deletes-old`, default: true):

- Read the new ADR's Background section to identify which ADR it supersedes
- Delete the old confirmed ADR file (`docs/adr/{old-id}-{name}.md` or
  `docs/modules/{module}/adr/{old-id}-{name}.md`)
- Stage this deletion in the same commit as the promotion (Step 4)

### 2d. Module README

For each module in scope:

**If `docs/modules/{module}/README.md` exists:**

- Find the `## Confirmed Use Cases` table
- Append one row per newly confirmed UC/US:
  `| UC-001 | US-001 | {feature description from the US Story line} |`

**If it doesn't exist — create it:**

```markdown
# {Module Name}

## What this module does

(Describe the module's responsibility here)

## Design Patterns

(Document the design patterns this module uses — fill in after implementation)

See [Architecture](../../overview/architecture.md) for cross-module interaction patterns.

## Confirmed Use Cases

| UC     | US     | Description                     |
| ------ | ------ | ------------------------------- |
| UC-001 | US-001 | {feature description}           |
```

Do not fill in the Design Patterns section automatically — leave the
placeholder. That section reflects architectural decisions the engineer makes,
not something derivable from the plan.

### 2e. Architecture.md (conditional)

Only if Step 1 flagged a new module or dependency:

- Open `docs/overview/architecture.md`
- Add the new module to the Module Overview table with a placeholder description
- Add a `<!-- TODO: update system diagram to include {module-name} -->` comment
  near the Mermaid diagram — don't modify the diagram itself, as diagram layout
  requires human judgment about positioning

### 2f. TBD reference patching

Per `cross-references.tbd-resolved-by: verify` (default), TBD references
should be resolved when their target is now confirmed. In all files just
promoted, find references like:

```
TBD (under discussion, see docs/drafts/adr/adr-draft-001-retry)
```

If the referenced file was promoted in this merge, update the reference to
point to the new confirmed path. If the referenced file is still in drafts,
leave it as TBD — `/verify` will flag it for follow-up.

---

## Step 3: Cleanup

Delete the plan file: `docs/drafts/plans/plan-{id}-{name}.md`

Leave empty draft directories in place — don't delete them. Other drafts may
be added to the same module folder later.

---

## Step 4: Commit

Stage the specific files changed in this merge — not everything:

```bash
git add docs/use-cases/ docs/modules/ docs/adr/ docs/overview/architecture.md
# Stage only the paths that were actually changed — review what git status shows
# Do NOT use git add . or git add -A
```

Commit with a message that names the UCs confirmed:

```
docs(use-cases): confirm UC-001 checkout, UC-002 notification
```

If only one UC: `docs(use-cases): confirm UC-001 checkout`

Do not push. Commit only.

---

## Step 5: Summary

```
## Merge Complete

Plan:    {plan-name}
Commit:  {short hash} — {commit message}

### Promoted
- docs/use-cases/uc-{id}-{name}/              (business layer)
- docs/modules/{module}/use-cases/uc-{id}-…/  (module layer)
- docs/adr/{id}-{name}.md                      (if any ADRs)

### Updated
- docs/modules/{module}/README.md              (UC-001 US-001, US-002 appended)
- docs/overview/architecture.md                (if updated)

### Cleaned up
- docs/drafts/plans/{plan-name}.md             (deleted)

### Warnings
- [Interface Contract: POST /payments not found in api-spec.yaml]
- [TBD: ADR-002 reference in UC-001 could not be resolved — still in drafts]
```

If there are no warnings, omit the Warnings section.

End with:

```
Ready for /verify — run it to confirm doc/code/test alignment before opening a PR to main.
```

---

## Guardrails

- If any `[ ]` remain in the plan → stop before touching any files
- Partial merge (only some UCs from a plan) → not supported; tell the user
- Never `git add .` or `git add -A` — only stage the specific doc paths changed
- Never push — local commit only
- Never write or modify anything in `src/` or `tests/`
- Never auto-fill the Design Patterns section of module READMEs
- Never modify the Mermaid diagram in architecture.md — add a TODO comment instead
- If architecture.md doesn't exist when you need to update it → create a stub and flag it
