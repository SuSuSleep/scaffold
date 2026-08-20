# CLI and Guidance Baseline

Document ID: SOL-001

> Evidence source: [`src/cli.js`](../../src/cli.js), [`src/project.js`](../../src/project.js), and [`test/cli.test.js`](../../test/cli.test.js), inspected 2026-08-20.

## Capabilities

### CAP-001 — Harness lifecycle management

Initialize, inspect, and record update-review state for a target repository.

### CAP-002 — Artifact resolution

Resolve shared defaults and project-local replacements deterministically.

### CAP-003 — Agent guidance integration

Provide a package-resolved bootstrap guide and managed instruction blocks without owning surrounding host instructions.

## Responsibilities

### RESP-001 — Command dispatcher

Validate CLI commands and target path arguments, then delegate lifecycle work.

### RESP-002 — Project lifecycle service

Create infrastructure, maintain metadata, resolve artifacts, and format lifecycle results.

### RESP-003 — Host-instruction reconciler

Create absent agent instruction files or update only an existing managed Scaffold block.

## Components and Boundaries

- **`bin/scaffold.js`** exposes the command-line entry point.
- **`src/cli.js`** is assigned-to RESP-001 and exposes the `init`, `status`, and `update` command interface.
- **`src/project.js`** is assigned-to RESP-002 and RESP-003. It owns local filesystem interactions within the target project.
- **Shared package artifacts** expose the Knowledge Model and default schemas, rules, workflows, skills, and templates; project-local artifacts may replace only the documented replaceable types.

## Satisfies

- CAP-001 — Harness lifecycle management satisfies:
  - PROB-001#REQ-001 — Portable initialization
  - PROB-001#REQ-005 — Review-aware updates
- CAP-002 — Artifact resolution satisfies:
  - PROB-001#REQ-002 — Explicit replacement
  - PROB-001#REQ-003 — Shared knowledge model
- CAP-003 — Agent guidance integration satisfies:
  - PROB-001#REQ-004 — Safe agent integration

## Design and Decisions

### DEC-001 — Package-managed shared defaults

Shared defaults are read from the running package rather than copied into a project. This keeps shared guidance current while preserving explicit project replacements.

### DEC-002 — Metadata-only CLI initialization

`init` creates `.scaffold/metadata.md`, extension directories, and agent-discovery infrastructure; representation-specific project knowledge is established through the active schema and initialization workflow.

### DEC-003 — Managed-block integration

A bounded `<!-- scaffold:start -->` / `<!-- scaffold:end -->` block permits Scaffold to refresh its own instruction while preserving host-owned content. In a non-interactive terminal, an unintegrated existing host file is left unchanged.

### DEC-004 — Attestation-based updates

`update` records that review is complete but does not claim deterministic semantic validation or perform migration.

## Verification Strategy

- Run `npm test` to verify CLI behavior, artifact resolution, managed-block preservation, and default-document structure.
- Run `node bin/scaffold.js status` in the target repository to verify active artifact sources, agent integration, and update-review state.

## Related Knowledge

- PROB-001#REQ-001 — Portable initialization.
- PROB-001#REQ-002 — Explicit replacement.
- PROB-001#REQ-003 — Shared knowledge model.
- PROB-001#REQ-004 — Safe agent integration.
- PROB-001#REQ-005 — Review-aware updates.
- [Project metadata](../../.scaffold/metadata.md).
- **Unknown**: No external contracts, security controls, or other reusable governance obligations have been established for this project; add governance knowledge when evidence identifies one.
