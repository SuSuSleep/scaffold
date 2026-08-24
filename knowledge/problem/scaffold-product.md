# Harness Lifecycle and Repository Integration

Document ID: PROB-001

## Intent

Scaffold must let a project adopt and operate the Harness safely in an existing repository, while retaining clear lifecycle visibility and mechanical document-ID support.

## Actors and Goals

- **Project maintainer**: initialize and maintain Scaffold in a repository without restructuring existing work.
- **Developer or coding agent**: discover the active Harness state before meaningful work.

## Use Cases

- A maintainer initializes a new or existing repository with the `init` command.
- A maintainer inspects active artifacts and update-review status with `status`.
- A maintainer records completion of an update review with `update` without overwriting project-local replacements.
- A maintainer obtains a next document ID or checks an ID declaration mechanically.

## Requirements

### REQ-001 — Portable initialization

The CLI must initialize the Harness in a repository while preserving existing project structure.

### REQ-004 — Safe agent integration

`AGENTS.md` and `CLAUDE.md` remain host-owned; Scaffold must preserve surrounding content.

### REQ-005 — Review-aware updates

Status must expose update-review drift, and update must record review completion without silently overwriting project-local replacements.

### REQ-012 — Mechanical document-ID support

The CLI must provide repository-level next-ID and availability checks for document IDs without interpreting Knowledge Model semantics or hard-coding knowledge directories.

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

### AC-015 — Document IDs are inspected mechanically

For:

- REQ-012 — Mechanical document-ID support

Given:

- a repository contains Markdown document identifiers.

When:

- a maintainer asks Scaffold for the next ID or checks an ID.

Then:

- Scaffold reports availability and declarations without interpreting knowledge semantics or requiring a fixed knowledge layout.

## Related Knowledge

- SOL-001#CAP-001 — Harness lifecycle management.
- SOL-001#CAP-003 — Agent guidance integration.
- SOL-001#CAP-004 — Mechanical document-ID inspection.
- GOV-001#CON-001 — Supported Node.js runtime.
