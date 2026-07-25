---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-003
sections:
  actor: Primary Actor
  preconditions: Preconditions
  business-rules: Business Rules
  postconditions: Postconditions
  flow: Main Flow
  exceptions: Exception Flows
  related: Related Use Cases
  implemented-by: Implementation Layer Mapping
---

# UC-003: Manage and Deliver a Business Change

## Primary Actor

Project developer or maintainer.

## Preconditions

- The project has an initialized harness with readable workflow rules and documentation conventions.
- The user has granted permission to create or update in-scope project files.
- Work takes place on a feature branch suitable for eventual review through a pull request.
- The intended feature, bug fix, requirement revision, withdrawal, or architectural-decision change is sufficiently clear to capture; otherwise UC-002 is used first.

## Business Rules

- Each workflow stage SHALL proceed only after its preceding gate passes.
- A failed stage SHALL preserve valid prior work and provide a clear correction, return, or resume point.
- Confirmed documentation SHALL NOT be edited directly; affected confirmed documents are copied into drafts before modification.
- Missing business intent SHALL be clarified or explicitly marked for later completion, never invented.
- Requirement and plan IDs SHALL follow the configured allocation policy and be assigned before files are written.
- A plan SHALL cover one cohesive change set; independent changes receive independent plans.
- Cross-module architectural decisions SHALL be captured as ADR drafts when the configured ADR criteria are all satisfied.
- Only one implementation run may update a given plan at a time, and completed plan tasks SHALL remain recorded for resumability.
- Draft promotion SHALL be blocked while plan tasks remain open or required behavioral tests are missing.
- Final verification SHALL report alignment problems without silently fixing them.
- No stage SHALL push changes or open a pull request automatically.

## Postconditions

- The requested feature, bug fix, requirement revision, withdrawal, or architectural-decision change has been handled according to its approved business intent.
- When implementation is required, source code and behavioral evidence satisfy the reviewed scenarios.
- Draft documentation and applicable ADRs have been promoted to their confirmed locations only after implementation gates pass.
- Documentation, tests, and code have passed the final alignment gate, or the user has a precise upstream correction path.
- On full success, the feature branch is ready for the user to push and open a pull request; neither action is performed automatically.

## Main Flow

1. The project developer or maintainer describes a feature, bug fix, requirement revision, withdrawal, or architectural-decision change.
2. The system captures the intended business change in draft UC/US documents, including affected references and any required ADR draft.
3. The system reviews the business drafts for structure, substance, scenario coverage, coherence, and unrecorded decisions.
4. After every in-scope business draft is READY, the system translates the business intent into module contracts and one or more scenario-level implementation plans.
5. The system implements each plan batch, writes behavioral and implementation-quality tests, preserves completed task state, and runs the final regression batch.
6. After every plan item and required test passes, the system promotes the in-scope drafts and ADRs, updates module and architecture documentation when needed, and removes the completed plan.
7. The system verifies the feature-branch delta for alignment among confirmed scenarios, behavioral tests, and implementation evidence.
8. When all hard checks pass, the system reports that the feature branch is ready for the user to open a pull request.

## Exception Flows

- Draft review finds missing or inconsistent business intent: drafts remain available, findings identify the required revisions, and the user reruns the review after correction. → See US-004, US-005, US-006, or US-007
- A READY draft cannot be translated into a plan: no plan is written, and the blocking requirement, decision, or module mapping is reported. → See US-008
- Implementation cannot complete a task after the allowed attempts: completed tasks remain recorded, the failing task stays pending, and the user receives the attempted fixes and error details. → See US-010
- Final regression fails: no successful implementation commit is created, and a bounded fix plan becomes the next resumable unit of work. → See US-010
- Promotion gates fail: no documents are promoted, and unchecked tasks or missing behavioral tests are reported. → See US-009
- Final verification finds misalignment: promoted working-tree documents remain uncommitted, the report identifies each failure, and the user is told not to open a pull request. → See US-009

## Related Use Cases

- Prerequisite: [UC-001 Prepare a Project for AI-Assisted Development](../uc-001-prepare-project-for-ai-assisted-development/use-case.md)
- Optional prerequisite: [UC-002 Clarify a Project Change Before Committing to It](../uc-002-clarify-project-change/use-case.md)
- Related: UC-005 Evolve the Documentation System Safely.

## Implementation Layer Mapping

- `draft` → [UC-004: Express a business requirement change](../../modules/draft/use-cases/uc-004-draft/use-case.md) (draft)
- `review-draft` → [UC-009: Review business-layer drafts](../../modules/review-draft/use-cases/uc-009-review-draft/use-case.md) (draft)
- `design-plan` → [UC-003: Design an implementation plan](../../modules/design-plan/use-cases/uc-003-design-plan/use-case.md) (draft)
- `apply` → [UC-001: Implement a plan](../../modules/apply/use-cases/uc-001-implement-plan/use-case.md) (draft)
- `merge` → [UC-008: Promote completed-plan drafts](../../modules/merge/use-cases/uc-008-merge/use-case.md) (draft)
- `verify` → [UC-014: Verify three-way alignment](../../modules/verify/use-cases/uc-014-verify/use-case.md) (draft)
