# CLI and Guidance Baseline

Document ID: SOL-001

> Evidence source: [`src/cli.js`](../../src/cli.js), [`src/project.js`](../../src/project.js), and [`test/cli.test.js`](../../test/cli.test.js), inspected 2026-08-30. These sources currently evidence the older shared-runtime implementation; they do not establish the materialized-local design proposed in this candidate knowledge change.

## Capabilities

### CAP-001 — Harness lifecycle management

Initialize, inspect, and record update-review state for a target repository.

### CAP-002 — Superseded: shared/local artifact resolution

Superseded by CAP-005 — Materialized Harness lifecycle management. This historical capability described shared runtime defaults and an effective shared-plus-local Rule collection; it is not an active solution capability.

### CAP-003 — Agent guidance integration

Provide a materialized project-local agent guide and managed instruction blocks without owning surrounding host instructions.

### CAP-004 — Mechanical document-ID inspection

Provide next-unused and availability inspection for project document IDs without interpreting Knowledge Model concepts.

### CAP-005 — Materialized Harness lifecycle management

Initialize a complete project-local Harness, inspect it, mechanically compare it with an installed candidate bundle, and record completion of owner-directed update review.

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
- **Project-local Harness artifacts** expose the active Knowledge Model, Schema, categorized Rules, workflow Skills, model-invoked Skills, templates, and agent guide. The agent guide directs meaningful work to the other materialized local guidance. The installed package distributes candidate artifacts for initialization and comparison only; it is never a runtime fallback.

### IFC-001 — Scaffold command-line interface

Exposed by `bin/scaffold.js` through `src/cli.js`.

- `scaffold init [directory]` initializes Harness infrastructure and materializes the required active artifacts for the target repository.
- `scaffold status [directory]` reports the project-local active artifacts and update-review state.
- `scaffold update --diff [directory]` reports a two-way add/change/removal comparison between project-local active artifacts and the installed package candidate bundle, without edits or merge decisions.
- `scaffold update [directory]` records completed owner-directed update review without changing project-local artifacts.
- `scaffold id next PREFIX [directory]` returns the next unused document ID in a namespace.
- `scaffold id check ID [directory]` reports document-ID availability and every existing declaration.
- `scaffold --help` and `scaffold --version` report usage and the running package version; an unknown command or more than one directory argument returns a nonzero exit status.
- When existing `AGENTS.md` or `CLAUDE.md` lacks a managed Scaffold block, interactive execution may add or preview the block; non-interactive execution preserves the file and reports that integration remains incomplete.
- A legacy `.scaffold/project-rules.md` is reported and ignored; it requires deliberate project migration.

## Satisfies

- CAP-005 — Materialized Harness lifecycle management satisfies:
  - PROB-001#REQ-001 — Portable initialization
  - PROB-001#REQ-014 — Foundational Project Context baseline
  - PROB-001#REQ-015 — Confirmed foundational Project Context
  - PROB-001#REQ-016 — Rule-based engineering-practice baseline
  - PROB-001#REQ-013 — Diff-led, project-owned update adoption
  - PROB-002#REQ-016 — Project-local active Harness authority
  - PROB-002#REQ-017 — Materialized Harness initialization
  - PROB-002#REQ-018 — Project-local Project Rule collection
- CAP-003 — Agent guidance integration satisfies:
  - PROB-001#REQ-004 — Safe agent integration
- CAP-004 — Mechanical document-ID inspection satisfies:
  - PROB-001#REQ-012 — Mechanical document-ID support

## Design and Decisions

### DEC-001 — Project-local active Harness with package candidates

Initialization materializes the complete active Harness in `.scaffold/`; ordinary operation resolves only those project-local artifacts. The package ships a starter/candidate bundle used to seed initialization and produce update diffs, but it never becomes a runtime fallback.

### DEC-002 — Materialized CLI initialization

`init` creates `.scaffold/` metadata, materializes the active Harness artifacts, and establishes agent-discovery infrastructure. The agent-run initialization workflow then establishes only the project's external-facing foundation in the Schema-selected Project Context representation: project purpose, domain terms and glossary, goals, scope and exclusions, and material unknowns. Before recording that representation, it presents evidence-derived context to the maintainer for confirmation or correction when repository evidence sufficiently establishes it. If repository evidence is insufficient, it asks the maintainer directly without suggesting invented project-specific content and does not create the Project Context before receiving the needed context. Project Context is orientation only; it does not create a fourth Knowledge Model space or make a Problem document necessary merely to record a project goal. The workflow records evidence-backed code-style, build or compiler, formatting or linting, testing or quality-gate, and Git/pull-request/branching/release practices as Project Rules; it leaves a Rule undefined when no reliable evidence or maintainer input establishes the practice. Project Context may identify an absent practice only when that absence is material to orientation, and never serves as its authoritative procedure or configuration record. Requirements and acceptance scenarios, architecture, integrations and external contracts, security and operational constraints, and Harness customization remain discovery- or change-driven unless current evidence makes them necessary.

### DEC-003 — Managed-block integration

A bounded `<!-- scaffold:start -->` / `<!-- scaffold:end -->` block permits Scaffold to refresh its own instruction while preserving host-owned content. In a non-interactive terminal, an unintegrated existing host file is left unchanged.

### DEC-004 — Diff-led, agent-mediated updates

The CLI produces only the current-project versus installed-package two-way diff and never merges artifacts or stores a baseline snapshot. The update-review Skill analyzes new capabilities and behavioral changes, discusses the project's actual needs with the owner, and records no artifact changes unless the owner decides to adopt, adapt, keep, retire, or defer them. `update` records the package version only after review.

### DEC-005 — Mechanical document-ID inspection

The CLI scans Markdown `Document ID:` declarations and reports availability only. The active Schema remains responsible for selecting the document-ID prefix and representing Project Knowledge.

### DEC-006 — Pending local-only lifecycle implementation

CAP-005 and DEC-001 through DEC-004 intentionally define the target design, not current source behavior. Current source and tests still initialize project-local Skills only, resolve package defaults and shared Rules as runtime authority, use a package-resolved bootstrap guide, and lack the specified `update --diff` behavior. After this Project Knowledge change is accepted, implementation must materialize and resolve the complete local Harness, provide the mechanical two-way diff, and revise bootstrap and update behavior; verification must demonstrate the active Acceptance Criteria rather than infer them from the current implementation.

## Verification Items

### VER-001 — Repository initialization preserves structure

Verifies:

- PROB-001#AC-007 — A repository initializes without restructuring.

Scope:

- `init` creates only Scaffold infrastructure in a selected repository.

Expected evidence:

- `init` preserves the existing repository structure while materializing the required active Harness guidance.

### VER-002 — Managed agent integration preserves host content

Verifies:

- PROB-001#AC-008 — Host-owned agent instructions are preserved.

Scope:

- replacement of the bounded Scaffold-managed instruction block.

Expected evidence:

- managed updates preserve surrounding `AGENTS.md` and `CLAUDE.md` content.

### VER-003 — Update differences are reported and recorded safely

Verifies:

- PROB-001#AC-016 — Update differences are visible and adopted deliberately.

Scope:

- `status`, `update --diff`, and update-review attestation behavior.

Expected evidence:

- `status` reports review drift; `update --diff` reports only the two-way artifact differences and causes no edits; and `update` records attestation only after owner-directed review, without changing project-local artifacts.

### VER-005 — Legacy update-review attestation remains safe

Verifies:

- PROB-001#AC-009 — Update review is visible and attested safely.

Scope:

- `status` review-drift reporting and `update` review attestation for existing project-local replacements.

Expected evidence:

- review drift is visible, and recording a review does not overwrite project-local replacements.

### VER-004 — Document-ID commands remain mechanical

Verifies:

- PROB-001#AC-015 — Document IDs are inspected mechanically.

Scope:

- next-ID and availability inspection across repository Markdown files.

Expected evidence:

- ID commands report available and duplicate declarations without requiring a fixed knowledge layout.

### VER-006 — Initialization scopes the project baseline

Verifies:

- PROB-001#AC-017 — Initialization establishes the foundational Project Context baseline.

Scope:

- the initialization workflow's classification of initial Project Knowledge and Project Rules, and its deferral of non-foundational knowledge.

Expected evidence:

- initialization records the project purpose, terms, goals, scope and exclusions, and material unknowns in Project Context without creating a Problem document merely to record a goal; captures or explicitly leaves unresolved evidence-based engineering and delivery practices as Project Rules; and does not require later discovery- or change-driven concerns for a usable baseline.

### VER-007 — Initialization validates proposed Project Context

Verifies:

- PROB-001#AC-018 — Initialization confirms Project Context before recording it.

Scope:

- the agent-run initialization workflow's treatment of evidence-derived and absent Project Context content.

Expected evidence:

- evidence-derived context is presented for maintainer confirmation or correction before recording; insufficient evidence causes direct maintainer questions without invented suggestions; and no Project Context is created before maintainer input.

### VER-008 — Initialization classifies engineering practices as Rules

Verifies:

- PROB-001#AC-019 — Initialization separates Project Context from Project Rules.

Scope:

- the agent-run initialization workflow's classification of evidence-backed and unresolved engineering and delivery practices.

Expected evidence:

- evidence-backed practices are represented by applicable Project Rules; absent practices remain undefined rather than inferred; and Project Context is not used as an authoritative procedure or configuration record.


## Related Knowledge

- PROB-001#REQ-001 — Portable initialization.
- PROB-001#REQ-014 — Foundational Project Context baseline.
- PROB-001#REQ-016 — Rule-based engineering-practice baseline.
- PROB-001#REQ-015 — Confirmed foundational Project Context.
- PROB-002#REQ-016 — Project-local active Harness authority.
- PROB-002#REQ-018 — Project-local Project Rule collection.
- PROB-002#REQ-017 — Materialized Harness initialization.
- PROB-001#REQ-004 — Safe agent integration.
- PROB-001#REQ-013 — Diff-led, project-owned update adoption.
- GOV-001#CON-001 — Supported Node.js runtime.
- [Project metadata](../../.scaffold/metadata.md).
- **Known governance**: GOV-001#CON-001 constrains the supported runtime. No external contracts or reusable security controls have been established for this project.
- CAP-005 supersedes CAP-002. CAP-002 remains as historical traceability only; active implementation and verification target CAP-005 and its listed current Requirements.
