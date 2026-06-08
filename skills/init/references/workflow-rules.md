---
schema: web-service
version: 1

# ── ID assignment ──────────────────────────────────────────────────────
id-rules:
  policy: highest-plus-one
  fill-gaps: false
  shared-namespace:
    - [drafts, confirmed]
  independent-sequences:
    - UC
    - US
    - ADR
    - plan
  per-module-sequences:
    - module-UC
    - module-US

# ── Document lifecycle ─────────────────────────────────────────────────
lifecycle:
  confirmed-docs-editable: false
  drafts-edit-in-place: true
  cancelled-drafts: delete-immediately
  promotion-rule: remove-drafts-prefix
  adr-proposed-to-adopted-on-merge: true
  adr-supersession-deletes-old: true

# ── Document layers ────────────────────────────────────────────────────
layers:
  business:
    location: docs/use-cases/
    owner: project-manager
    scope: cross-module-user-behavior
  implementation:
    location: docs/modules/{module}/
    owner: module-manager
    scope: single-module-contract

# ── Document types & update strategy ───────────────────────────────────
document-strategy:
  system-readme:          { location: /,                                  update: in-place }
  conventions:            { location: /,                                  update: in-place }
  workflow-rules:         { location: docs/schema/,                       update: in-place }
  format:                 { location: docs/schema/,                       update: via-schema-update }
  architecture:           { location: docs/overview/,                     update: on-structure-change }
  glossary:               { location: docs/overview/,                     update: in-place }
  test-strategy:          { location: docs/overview/,                     update: in-place }
  api-spec:               { location: docs/overview/api-spec.yaml,        update: in-place }
  business-uc-us-draft:   { location: docs/drafts/use-cases/,             update: in-place }
  business-uc-us:         { location: docs/use-cases/,                    update: in-place }
  module-uc-us-draft:     { location: docs/drafts/modules/{module}/,      update: in-place }
  module-uc-us:           { location: docs/modules/{module}/,             update: in-place }
  project-adr-draft:      { location: docs/drafts/adr/,                   update: in-place }
  project-adr:            { location: docs/adr/,                          update: delete-when-superseded }
  module-adr-draft:       { location: docs/drafts/modules/{module}/adr/,  update: in-place }
  module-adr:             { location: docs/modules/{module}/adr/,         update: delete-when-superseded }
  module-readme:          { location: docs/modules/{module}/README.md,    update: append-on-uc-us-confirmation }
  plan:                   { location: docs/drafts/plans/,                 update: check-off-then-delete }

# ── ADR creation triggers ──────────────────────────────────────────────
adr-triggers:
  required-when-all-true:
    - multiple-implementation-options-considered
    - decision-affects-multiple-modules
    - reason-not-obvious-from-result

# ── Decomposition rules ────────────────────────────────────────────────
decomposition:
  uc-rule: one-per-distinct-user-goal
  us-split-when-any:
    - distinct-exception-paths-need-own-contract
    - multiple-actor-perspectives
    - happy-path-has-discrete-failable-phases
  plan-together-when-any:
    - shared-module
    - ordering-dependency
    - shared-sub-flow
  greenfield-modules-need-proposed-marker: true

# ── Gates between skills ───────────────────────────────────────────────
gates:
  design-plan-requires:
    - review-draft-ready
  apply-requires:
    - plan-file-exists
    - drafts-confirmed-or-tbd
  merge-blocks-on:
    - any-unchecked-plan-item
    - missing-behavioral-test-file
  merge-warns-on:
    - api-endpoint-missing-from-spec
    - stale-uc-main-flow
    - remaining-tbd-references
    - new-module-not-in-architecture
  verify-required-before-pr-to-main: true

# ── Cross-reference rules ──────────────────────────────────────────────
cross-references:
  tbd-allowed-in-drafts: true
  tbd-resolved-by: verify
  adr-cascade-scan-scope: all-files
  inline-code-refs-updated-by: apply
  stale-ref-repair-on-delete: true
  link-style: relative-paths

# ── Test conventions (workflow side) ───────────────────────────────────
test-conventions:
  behavioral-path-pattern: "tests/behavioral/{module}/us-{id}-*.test.*"
  test-case-references-source: required
  behavioral-count-equals-scenarios: true
  quality-tests-doc-required: false

# ── ID format strings ──────────────────────────────────────────────────
id-format:
  project-adr: "ADR-{nnn}"
  module-adr: "{module}-ADR-{nnn}"
  use-case: "UC-{nnn}"
  user-story: "US-{nnn}"
  plan: "plan-{nnn}-{name}"
---

# Workflow Rules

This file defines workflow policy for the project — gates, rules, and lifecycle
decisions that skills enforce. The YAML frontmatter above is the machine-readable
contract that skills read; the markdown body below explains each rule for human
reviewers.

To change a rule: edit the YAML frontmatter, then run `/schema-update` to apply
the change consistently across the project.

---

## Document Layers

Two layers, two owners.

| Layer          | Location               | Owner                 | Scope                      |
| -------------- | ---------------------- | --------------------- | -------------------------- |
| Business       | docs/use-cases/        | Project manager agent | Cross-module user behavior |
| Implementation | docs/modules/{module}/ | Module manager agent  | Single module contract     |

The business layer describes what users do across modules. The implementation
layer describes what each module must do to fulfill its part.

---

## Document Types & Update Strategy

| Document                   | Location                              | Strategy                              |
| -------------------------- | ------------------------------------- | ------------------------------------- |
| System README              | /                                     | Update in place                       |
| CONVENTIONS                | /                                     | Update in place                       |
| Workflow Rules             | docs/schema/                          | Update in place (this file)           |
| Format                     | docs/schema/                          | Update via /schema-update             |
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

---

## Numbering and IDs

- Project ADRs: ADR-001, ADR-002, …
- Module ADRs: {module}-ADR-001, {module}-ADR-002, …
- Use cases: UC-001, UC-002, …
- User stories: US-001, US-002, …
- Plans: plan-001-{name}.md

**Rule:** find the highest existing ID across drafts and confirmed locations,
then assign next = highest + 1. Do not fill gaps. UC, US, ADR, and plan
sequences are independent. Module UC/US sequences are per-module.

---

## Document Lifecycle

- **Confirmed docs are read-only.** Any change to a confirmed UC/US/ADR
  requires first copying it to its draft mirror path under `docs/drafts/`.
  `/draft` does this automatically when a requirement changes a confirmed doc.
- **Draft docs are edited in place.** No in-file version history — git handles it.
- **Cancelled drafts are deleted immediately.** Do not keep them around.
- **Promotion rule:** `/merge` removes `drafts/` from the path. That is the only
  structural change. Content changes (US simplification, README append) happen
  on top of the move.
- **ADR transitions:** `Proposed` while in `docs/drafts/adr/`, `Adopted` after
  `/merge` promotes to `docs/adr/`.
- **ADR supersession:** when a new ADR supersedes an existing one, `/merge`
  deletes the old confirmed ADR file. The new ADR's Background section must
  name the superseded ADR.

---

## ADR Creation Triggers

An ADR draft is required when **all three** are true:

1. Multiple implementation options were considered
2. The decision affects more than one module
3. A new team member couldn't infer the "why" from the result alone

If any of these is false, a note in the relevant US's Expected Behavior section
is sufficient — no ADR needed.

---

## UC and US Decomposition

- **One UC per distinct user goal.** If a requirement spans two different
  user goals, create two UCs.
- **Multiple USs under one UC** when any of these apply:
  - Distinct exception paths need their own API contract
  - Multiple actor perspectives participate in the same goal
  - The happy path has discrete phases that can independently fail
- **Multiple UCs must be planned together** when any of these apply:
  - They share a module (touching the same code at once)
  - One depends on state created by the other
  - They share a sub-flow

---

## Linking Between Documents

Always use relative paths:

```
See [Architecture](docs/overview/architecture.md) for system context.
```

Mark unconfirmed references as TBD:

```
- Related ADR: TBD (under discussion, see docs/drafts/adr/adr-draft-001-xxx)
```

TBD references are allowed in drafts. They must be resolved (or explicitly
patched) before `/verify` passes.

---

## Gates Between Skills

| Gate                          | Requirement                                              |
| ----------------------------- | -------------------------------------------------------- |
| `/design-plan` proceeds       | `/review-draft` returned READY                           |
| `/apply` proceeds             | Plan file exists; referenced drafts confirmed or TBD     |
| `/merge` proceeds             | All plan checkboxes are `[x]`; no missing behavioral test |
| `/verify` returns CLEAN       | Required before PR to main                               |

---

## Pre-merge Checklist

`/merge` runs these checks before promoting files:

**Hard blockers** (stop the merge):

- Missing behavioral test file for any US in scope

**Warnings** (surface but don't block):

- API endpoint missing from `docs/overview/api-spec.yaml`
- UC main flow appears stale vs. implementation
- TBD references remaining (will be resolved during merge)
- New module not yet listed in `architecture.md`

---

## Cross-Reference Rules

- When a UC/US is deleted, scan `docs/drafts/` for references and fix them.
- When an ADR is superseded, scan **all** files (drafts + confirmed) for
  `Related ADR: ADR-{old-id}` references. Each match must be copied to drafts
  and updated.
- Inline code references (`// see ADR-xxx`) are updated by `/apply`, not
  `/draft` — they belong to the implementation cycle.

---

## Test Conventions (workflow side)

- Behavioral test file path: `tests/behavioral/{module}/us-{id}-*.test.*`
- Each test case must reference its source US ID and scenario number (e.g.
  `[S1]`, `[S2]`, or `US-001 Scenario 1` in name or comment)
- Behavioral test count must equal the US's scenario count
- Implementation quality tests have no documentation requirement

(Code-level naming conventions — file names, class names, etc. — live in
`CONVENTIONS.md`.)

---

## PR Checklist

```
□ Are all US scenarios satisfied?
□ Are all behavioral tests placed and named per the rules above?
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
