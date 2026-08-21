# CLI and Guidance Baseline

Document ID: SOL-001

> Evidence source: [`src/cli.js`](../../src/cli.js), [`src/project.js`](../../src/project.js), and [`test/cli.test.js`](../../test/cli.test.js), inspected 2026-08-20.

## Capabilities

### CAP-001 — Harness lifecycle management

Initialize, inspect, and record update-review state for a target repository.

### CAP-002 — Artifact resolution

Resolve shared defaults, full project-local replacements, and the effective Project Rule collection deterministically.

### CAP-003 — Agent guidance integration

Provide a package-resolved bootstrap guide and managed instruction blocks without owning surrounding host instructions.

### CAP-004 — Mechanical document-ID inspection

Provide next-unused and availability inspection for project document IDs without interpreting Knowledge Model concepts.

## Responsibilities

### RESP-001 — Command dispatcher

Validate CLI commands and target path arguments, then delegate lifecycle work.

### RESP-002 — Project lifecycle service

Create infrastructure, maintain metadata, resolve artifacts, and format lifecycle results.

### RESP-003 — Host-instruction reconciler

Create absent agent instruction files or update only an existing managed Scaffold block.

### RESP-004 — Document-ID inspector

Search Markdown document declarations recursively and report namespace availability without assuming a project knowledge directory.

## Components and Boundaries

- **`bin/scaffold.js`** exposes the command-line entry point.
- **`src/cli.js`** is assigned-to RESP-001 and exposes the `init`, `status`, `update`, and `id` command interface.
- **`src/project.js`** is assigned-to RESP-002, RESP-003, and RESP-004. It owns local filesystem interactions within the target project.
- **Shared package artifacts** expose the Knowledge Model, default Schema, categorized Rules, workflows, skills, and templates. Templates are grouped by Problem, Solution, and Governance space. Schema, Workflows, Skills, and Templates are fully replaceable; local Rules add identities or atomically replace matching shared identities.

### IFC-001 — Scaffold command-line interface

Exposed by `bin/scaffold.js` through `src/cli.js`.

- `scaffold init [directory]` initializes Harness infrastructure for the target repository.
- `scaffold status [directory]` reports the effective artifacts and update-review state.
- `scaffold update [directory]` records completed update-review attestation without overwriting project-local replacements.
- `scaffold id next PREFIX [directory]` returns the next unused document ID in a namespace.
- `scaffold id check ID [directory]` reports document-ID availability and every existing declaration.
- `scaffold --help` and `scaffold --version` report usage and the running package version; an unknown command or more than one directory argument returns a nonzero exit status.
- When existing `AGENTS.md` or `CLAUDE.md` lacks a managed Scaffold block, interactive execution may add or preview the block; non-interactive execution preserves the file and reports that integration remains incomplete.
- A legacy `.scaffold/project-rules.md` is reported and ignored; it requires deliberate project migration.

## Satisfies

- CAP-001 — Harness lifecycle management satisfies:
  - PROB-001#REQ-001 — Portable initialization
  - PROB-001#REQ-005 — Review-aware updates
- CAP-002 — Artifact resolution satisfies:
  - PROB-001#REQ-002 — Explicit artifact resolution
  - PROB-001#REQ-003 — Shared knowledge model
  - PROB-001#REQ-011 — Extensible Project Rule collection
- CAP-003 — Agent guidance integration satisfies:
  - PROB-001#REQ-004 — Safe agent integration
- CAP-004 — Mechanical document-ID inspection satisfies:
  - PROB-001#REQ-012 — Mechanical document-ID support

## Design and Decisions

### DEC-001 — Package-managed shared defaults

Shared defaults are read from the running package rather than copied into a project. This keeps shared guidance current while preserving full artifact replacements and effective Project Rule resolution.

### DEC-002 — Metadata-only CLI initialization

`init` creates `.scaffold/metadata.md`, extension directories, and agent-discovery infrastructure; representation-specific project knowledge is established through the active schema and initialization workflow.

### DEC-003 — Managed-block integration

A bounded `<!-- scaffold:start -->` / `<!-- scaffold:end -->` block permits Scaffold to refresh its own instruction while preserving host-owned content. In a non-interactive terminal, an unintegrated existing host file is left unchanged.

### DEC-004 — Attestation-based updates

`update` records that review is complete but does not claim deterministic semantic validation or perform migration.

### DEC-005 — Mechanical document-ID inspection

The CLI scans Markdown `Document ID:` declarations and reports availability only. The active Schema remains responsible for selecting the document-ID prefix and representing Project Knowledge.

## Verification Items

### VER-001 — CLI lifecycle behavior

Verifies:

- PROB-001#REQ-001 — Portable initialization.
- PROB-001#AC-001 — A project can adopt Scaffold without restructuring.
- PROB-001#AC-004 — The CLI checks document-ID availability mechanically.

Expected evidence:

- `init`, `status`, and `update` preserve their documented lifecycle and artifact-resolution behavior.
- Managed agent-instruction integration preserves host-owned content.

## Related Knowledge

- PROB-001#REQ-001 — Portable initialization.
- PROB-001#REQ-002 — Explicit artifact resolution.
- PROB-001#REQ-011 — Extensible Project Rule collection.
- PROB-001#REQ-003 — Shared knowledge model.
- PROB-001#REQ-004 — Safe agent integration.
- PROB-001#REQ-005 — Review-aware updates.
- GOV-001#CON-001 — Supported Node.js runtime.
- [Project metadata](../../.scaffold/metadata.md).
- **Known governance**: GOV-001#CON-001 constrains the supported runtime. No external contracts or reusable security controls have been established for this project.
