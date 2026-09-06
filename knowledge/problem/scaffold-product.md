# Harness Lifecycle and Repository Integration

Document ID: PROB-001

## Intent

Scaffold must let a project adopt and operate the Harness safely in an existing repository, while retaining clear lifecycle visibility and mechanical document-ID support.

## Actors and Goals

- **Project maintainer**: initialize and maintain Scaffold in a repository without restructuring existing work.
- **Project maintainer**: establish a lightweight, evidence-based project baseline before undertaking later change work.
- **Developer or coding agent**: discover the active Harness state before meaningful work.

## Use Cases

- A maintainer initializes a new or existing repository with the `init` command.
- A maintainer establishes the initial project baseline from existing repository evidence and known project context.
- A maintainer inspects the materialized active Harness and update-review status with `status`.
- A maintainer obtains a mechanical two-way diff between project-local Harness artifacts and the installed package candidate bundle.
- A maintainer records completion of a user-reviewed update with `update`, after selecting project-local changes.
- A maintainer obtains a next document ID or checks an ID declaration mechanically.

## Requirements

### REQ-001 — Portable initialization

The CLI must initialize the Harness in a repository while preserving existing project structure.

### REQ-004 — Safe agent integration

`AGENTS.md` and `CLAUDE.md` remain host-owned; Scaffold must preserve surrounding content.

### REQ-005 — Review-aware updates

Status must expose update-review drift, and update must record review completion without silently overwriting project-local replacements.

### REQ-013 — Diff-led, project-owned update adoption

The CLI must expose update-review drift and mechanically compare the complete project-local Harness with the installed package candidate bundle. It must report additions, changes, and package removals without editing either artifact set or attempting a merge. An update-review workflow must analyze the behavioral implications and discuss material choices with the project owner; only after that review may `update` record the reviewed version. No update action may silently overwrite project-local artifacts.

### REQ-012 — Mechanical document-ID support

The CLI must provide repository-level next-ID and availability checks for document IDs without interpreting Knowledge Model semantics or hard-coding knowledge directories.

### REQ-014 — Foundational Project Context baseline

Initialization must guide the project to establish a lightweight, external-facing Project Context baseline for useful work. The context records the project's top-level purpose, stakeholder or project goals, project-specific domain terms and glossary, scope and exclusions, and material unknowns. The Project Context is an orientation representation selected by the active Knowledge Schema, not a Problem document or a fourth Knowledge Model space. It must not introduce Actors, Use Cases, Requirements, or Acceptance Criteria; Goals retain their Problem-space meaning.

Initialization records the initial terms and goals in Project Context and must not create a Problem document merely to record a project goal. The reusable engineering and delivery practices—code and style conventions, reusable testing practices and quality gates, and Git, pull-request, branching, and release conventions—are Project Rules; selected starter templates may support those Rules where the active Schema makes them applicable. The baseline must be grounded in existing repository evidence or explicit project context and must not invent conventions.

Requirements and their acceptance scenarios, architecture, integrations and external contracts, security and operational constraints, and Harness customization are not required for this initial baseline. They are established later when discovery or a change workflow makes them relevant.

## Acceptance Criteria

### AC-007 — A repository initializes without restructuring

For:

- REQ-001 — Portable initialization

Given:

- a new or existing repository is selected.

When:

- the maintainer runs `scaffold init`.

Then:

- Scaffold infrastructure is initialized without restructuring the repository.

### AC-008 — Host-owned agent instructions are preserved

For:

- REQ-004 — Safe agent integration

Given:

- `AGENTS.md` or `CLAUDE.md` contains host-owned content.

When:

- Scaffold initializes or refreshes its managed instruction.

Then:

- surrounding host-owned content remains preserved.

### AC-009 — Update review is visible and attested safely

For:

- REQ-005 — Review-aware updates

Given:

- a Scaffold project has a recorded reviewed version.

When:

- a maintainer checks status or records an update review.

Then:

- review drift is visible and local replacements are not overwritten.

### AC-016 — Update differences are visible and adopted deliberately

For:

- REQ-013 — Diff-led, project-owned update adoption

Given:

- a Scaffold project has a recorded reviewed version.

When:

- a maintainer checks status, requests an update diff, or completes an owner-directed update review.

Then:

- `status` reports review drift.
- `scaffold update --diff` reports the mechanical two-way add/change/package-removal differences between project-local active artifacts and the installed package candidate bundle, and changes no artifact.
- After owner-directed decisions to adopt, adapt, keep, retire, or defer candidate content, `scaffold update` records the reviewed version without changing project-local artifacts.

### AC-015 — Document IDs are inspected mechanically

For:

- REQ-012 — Mechanical document-ID support

Given:

- a repository contains Markdown document identifiers.

When:

- a maintainer asks Scaffold for the next ID or checks an ID.

Then:

- Scaffold reports availability and declarations without interpreting knowledge semantics or requiring a fixed knowledge layout.

### AC-017 — Initialization establishes the foundational Project Context baseline

For:

- REQ-014 — Foundational Project Context baseline

Given:

- a maintainer is initializing a repository with available project evidence or explicit project context.

When:

- the maintainer establishes initial Project Knowledge and Project Rules through the initialization workflow.

Then:

- Project Context records the project purpose, goals, terms or glossary, scope and exclusions, and material unknowns from the available evidence or explicit project context.
- initial terms and goals are recorded in Project Context, without creating a Problem document merely to record a project goal.
- Project Context remains an orientation representation and does not introduce Actors, Use Cases, Requirements, or Acceptance Criteria or a fourth Knowledge Model space.
- code and style, reusable testing and quality-gate, and Git, pull-request, branching, and release practices are captured or explicitly left unresolved as Project Rules, without inventing them.
- requirements, acceptance scenarios, architecture, integrations or external contracts, security or operational constraints, and Harness customization remain discovery- or change-driven unless already needed by available evidence.

## Related Knowledge

- SOL-001#CAP-005 — Materialized Harness lifecycle management.
- SOL-001#CAP-003 — Agent guidance integration.
- SOL-001#CAP-004 — Mechanical document-ID inspection.
- GOV-001#CON-001 — Supported Node.js runtime.
