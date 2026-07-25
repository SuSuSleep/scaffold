---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-004
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

# UC-004: Reconstruct Business Documentation for an Existing Codebase

## Primary Actor

Project developer or maintainer.

## Preconditions

- An existing codebase needs documentation reconstructed from its implementation.
- The project documentation harness has been initialized through UC-001.
- The user has granted permission to create, update, review, and promote documentation files.
- The source root containing the project's modules is known or can be confirmed by the user.
- The user or an appropriate product/engineering stakeholder can supply business context that source code cannot reveal.

## Business Rules

- The coverage file SHALL be the authoritative, resumable tracker for brownfield documentation progress.
- A module SHALL be a direct child directory of the confirmed source root; nested directories belong to their parent module.
- The workflow SHALL process one module per loop and SHALL NOT silently expand a scan into another module.
- Technical facts with high inferability—interfaces, data shapes, flow, errors, and side effects—SHALL be derived from source code.
- Actor, goal, business value, and other low-inferability facts SHALL be elicited from a person and SHALL NOT be invented from code.
- Open cross-module relationships MAY remain explicitly deferred until the related module loop completes.
- A module SHALL NOT be promoted until its draft passes the brownfield module-document review gate.
- Business composition SHALL begin as soon as at least two completed module contracts describe a coherent user-facing flow; it need not wait for every module.
- A business composition SHALL include one happy-path scenario plus one exception scenario per cross-module failure seam.
- The workflow SHALL remain open until every coverage row is complete and final verification reports alignment.
- Known contract mismatch: `BROWNFIELD.md` requires `review-draft` and `merge` to review and promote module drafts, but their current module contracts only support business-draft review and completed-plan promotion. Those module contracts require correction before UC-004 can be considered ready for planning.

## Postconditions

- Every discovered module appears in `docs/drafts/coverage.md` and the architecture module inventory.
- Each completed module has code-derived technical documentation enriched with confirmed or explicitly deferred business context.
- Completed module drafts have passed review and been promoted to confirmed module documentation.
- Coherent cross-module journeys have corresponding business-layer UC/US documentation with implementation mappings and scenario contracts.
- Every coverage row is fully checked for scan, module documentation, and business documentation progress.
- Final verification confirms alignment among the reconstructed documentation, available behavioral evidence, and code, or UC-004 remains open with a named return loop.

## Main Flow

1. The project developer or maintainer starts the brownfield workflow for an existing codebase with an initialized documentation harness.
2. The system confirms the source root, discovers its direct-child modules, creates or extends the coverage tracker, and seeds the architecture inventory.
3. The system selects the first module whose scan is not yet complete.
4. The system reads that module's source, confirms its responsibility boundary with the user, and produces module UC/US drafts for its distinct entry points.
5. The system guides the user through actor, goal, value, flow-validation, business-rule, and exception-framing questions, preserving answers incrementally.
6. The completed module drafts pass the brownfield module-document review gate and are promoted; the coverage row records module completion.
7. Steps 3–6 repeat for subsequent modules, while open relationships to later modules remain explicitly deferred.
8. As soon as two or more completed module contracts form a coherent user journey, the system composes them into business UC/US drafts.
9. The composed business drafts pass review and are promoted; contributing module rows record their business-documentation coverage.
10. Module loops and business compositions continue until every coverage row is fully checked.
11. The system performs final alignment verification across confirmed documentation, behavioral evidence, and code.
12. When verification passes, the system reports that brownfield documentation reconstruction is complete.

## Exception Flows

- The source root is absent or has multiple candidates: the system lists discovered candidates or asks the user where module code lives before scanning. → See US-011
- A module scan is interrupted before its confirmation questions complete: no module drafts are written, its coverage row remains open, and the user can restart that module. → See US-012
- Elicitation is interrupted: answers already written remain available, and rerunning elicitation resumes with the remaining business-context fields. → See US-012
- Module review returns NEEDS REVIEW or BLOCKED: no promotion occurs; the user revises the module draft or escalates the missing business context. → See US-012
- Fewer than two completed modules form a coherent user journey: business composition waits while the workflow continues with another module loop. → See US-013
- A blocking business-context gap prevents business composition: no partial business UC/US is written; the user returns to elicitation for the affected module. → See US-013
- Business review or promotion fails: the business draft remains unconfirmed, coverage remains open, and the reported issue is corrected before retrying. → See US-013
- Final verification reports MISALIGNED: UC-004 remains open and the user returns to the affected module or business-documentation loop until verification passes. → See US-013

## Related Use Cases

- Prerequisite: [UC-001 Prepare a Project for AI-Assisted Development](../uc-001-prepare-project-for-ai-assisted-development/use-case.md)
- Optional prerequisite: [UC-002 Clarify a Project Change Before Committing to It](../uc-002-clarify-project-change/use-case.md)
- Related: UC-005 Evolve the Documentation System Safely.

## Implementation Layer Mapping

- `scan-all` → [UC-010: Bootstrap the brownfield documentation workflow](../../modules/scan-all/use-cases/uc-010-scan-all/use-case.md) (draft)
- `scan-deep` → [UC-011: Produce module drafts from source](../../modules/scan-deep/use-cases/uc-011-scan-deep/use-case.md) (draft)
- `elicit` → [UC-005: Fill module business-context fields](../../modules/elicit/use-cases/uc-005-elicit/use-case.md) (draft)
- `review-draft` → [UC-009: Review business-layer drafts](../../modules/review-draft/use-cases/uc-009-review-draft/use-case.md) (draft; module-draft review responsibility required by `BROWNFIELD.md` is not represented)
- `merge` → [UC-008: Promote completed-plan drafts](../../modules/merge/use-cases/uc-008-merge/use-case.md) (draft; brownfield module-only promotion responsibility is not represented)
- `compose` → [UC-002: Compose a business-layer document](../../modules/compose/use-cases/uc-002-compose-business-doc/use-case.md) (draft)
- `verify` → [UC-014: Verify three-way alignment](../../modules/verify/use-cases/uc-014-verify/use-case.md) (draft)
