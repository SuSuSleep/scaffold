# CLI and Guidance Baseline

> Implementation context: [`src/cli.js`](../../src/cli.js), [`src/project.js`](../../src/project.js), and [`test/cli.test.js`](../../test/cli.test.js), inspected 2026-11-13. The source materializes project-local guidance and provides two-way update comparison using the single-source package layout in [DEC-006](default-artifacts.md#dec-006). Extracted-package initialization and non-mutating comparison were verified on 2026-11-13.

## Capabilities and Architecture

<a id="cap-001"></a>

### CAP-001 — Harness lifecycle management

Initialize, inspect, and record update-review state for a target repository.

#### Responsibilities

Uses shared Responsibilities RESP-001, RESP-002 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-002"></a>

### CAP-002 — Superseded: shared/local artifact resolution

Superseded by CAP-005 — Materialized Harness lifecycle management. This historical capability described shared runtime defaults and an effective shared-plus-local Rule collection; it is not an active solution capability.

<a id="cap-003"></a>

### CAP-003 — Agent guidance integration

Provide a materialized project-local agent guide and managed instruction blocks for supported existing agent hosts without owning surrounding host instructions or supplying an agent runtime.

Relationships:

- Satisfies: [REQ-004 — Safe agent integration](../problem/scaffold-product.md#req-004).
- Related-to: [CAP-002 — Existing-agent tool integration](hybrid-agent-tool-architecture.md#cap-002).

#### Responsibilities

<a id="resp-003"></a>

##### RESP-003 — Host-instruction reconciler

Realizes: CAP-003

Create absent agent instruction files or update only an existing managed Scaffold block.

Uses shared Responsibilities RESP-001 defined in Shared Architecture.

#### Components and Boundaries

- **`AGENTS.md` and `CLAUDE.md` managed blocks** expose Scaffold guidance to the currently supported Codex and Claude Code host integrations. They preserve host-owned content and do not turn Scaffold into the agent runtime.

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-004"></a>

### CAP-004 — Retired: mechanical document-ID inspection

Retired with [REQ-012](../problem/scaffold-product.md#req-012) by DEC-008. The historical document-ID inspector Responsibility RESP-004 is retired; lifecycle components no longer own that Responsibility. This object remains historical context, not an active capability.

#### Responsibilities

<a id="resp-004"></a>

##### RESP-004 — Retired: document-ID inspector

Historical Responsibility of retired CAP-004; no current component assignment.

<a id="cap-005"></a>

### CAP-005 — Materialized Harness lifecycle management

Initialize a complete project-local Harness, inspect it, mechanically compare it with an installed candidate bundle, and record completion of owner-directed update review.

Relationships:

- Satisfies: [REQ-001 — Portable initialization](../problem/scaffold-product.md#req-001).
- CAP-005 supersedes CAP-002. CAP-002 remains as historical traceability only; active implementation and verification target CAP-005 and its listed current Requirements.

#### Responsibilities

Uses shared Responsibilities RESP-001, RESP-002 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

### Shared Architecture

#### Responsibilities

<a id="resp-001"></a>

##### RESP-001 — Command dispatcher

Realizes: CAP-001, CAP-003, CAP-005

Validate CLI commands and target path arguments, then delegate lifecycle work.

<a id="resp-002"></a>

##### RESP-002 — Project lifecycle service

Realizes: CAP-001, CAP-005

Create infrastructure, maintain metadata, resolve artifacts, and format lifecycle results.

Relationships:

- Lifecycle evidence: [Project metadata](../../.scaffold/metadata.md).

#### Components and Boundaries

- **`bin/scaffold.js`** exposes the command-line entry point.
- **`src/cli.js`** is assigned-to RESP-001 and exposes the `init`, `status`, and `update` command interface.
- **`src/project.js`** is assigned-to RESP-002 and RESP-003. It owns local filesystem interactions within the target project.
- **Project-local Harness artifacts** expose the active Knowledge Model, Schema, categorized Rules, workflow Skills, model-invoked Skills, templates, and agent guide. The agent guide directs meaningful work to the other materialized local guidance. The installed package distributes candidate artifacts for initialization and comparison only; it is never a runtime fallback.

<a id="ifc-001"></a>

##### IFC-001 — Scaffold command-line interface

Exposed by `bin/scaffold.js` through `src/cli.js`.

- `scaffold init [directory]` initializes Harness infrastructure and materializes the required active artifacts for the target repository.
- `scaffold status [directory]` reports the project-local active artifacts, including the agent guide, structural completeness, and update-review state as distinct observations.
- `scaffold update --diff [directory]` reports a two-way add/change/removal comparison between project-local active artifacts and the installed package candidate bundle, without edits or merge decisions.
- `scaffold update [directory]` records completed owner-directed update review without changing project-local artifacts.
- The former `scaffold id next` and `scaffold id check` commands are removed; `id` follows unknown-command handling under DEC-008.
- `scaffold --help` and `scaffold --version` report usage and the running package version; an unknown command or more than one directory argument returns a nonzero exit status.
- When existing `AGENTS.md` or `CLAUDE.md` lacks a managed Scaffold block, interactive execution may add or preview the block; non-interactive execution preserves the file and reports that integration remains incomplete.
- A legacy `.scaffold/project-rules.md` is reported and ignored; it requires deliberate project migration.

Relationships:

- [CON-001 — Supported Node.js runtime](../governance/runtime-and-distribution.md#con-001).
- **Known governance**: [CON-001](../governance/runtime-and-distribution.md#con-001) constrains the supported runtime. No external contracts or reusable security controls have been established for this project.

## Satisfies

- CAP-005 — Materialized Harness lifecycle management satisfies:
  - [REQ-001 — Portable initialization](../problem/scaffold-product.md#req-001)
  - [REQ-005 — Review-aware updates](../problem/scaffold-product.md#req-005)
  - [REQ-014 — Foundational Project Context baseline](../problem/scaffold-product.md#req-014)
  - [REQ-015 — Confirmed foundational Project Context](../problem/scaffold-product.md#req-015)
  - [REQ-016 — Rule-based engineering-practice baseline](../problem/scaffold-product.md#req-016)
  - [REQ-013 — Diff-led, project-owned update adoption](../problem/scaffold-product.md#req-013)
  - [REQ-016 — Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#req-016)
  - [REQ-017 — Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#req-017)
  - [REQ-018 — Project-local Project Rule collection](../problem/knowledge-authority-and-customization.md#req-018)
- CAP-003 — Agent guidance integration satisfies:
  - [REQ-004 — Safe agent integration](../problem/scaffold-product.md#req-004)

## Design and Decisions

<a id="dec-001"></a>

### DEC-001 — Project-local active Harness with package candidates

Initialization materializes the complete active Harness in `.scaffold/`; ordinary operation resolves only those project-local artifacts. The package ships a starter/candidate bundle used to seed initialization and produce update diffs, but it never becomes a runtime fallback. Its source is the Scaffold repository's active `.scaffold/`, as defined by [DEC-006 — One source for active and distributed Harness artifacts](default-artifacts.md#dec-006); the package's `.scaffold/` is the copy source for target initialization and comparison, with local metadata excluded.

Relationships:

- Related-to: [REQ-016 — Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#req-016).
- Related-to: [REQ-018 — Project-local Project Rule collection](../problem/knowledge-authority-and-customization.md#req-018).

<a id="dec-002"></a>

### DEC-002 — Materialized CLI initialization

`init` creates `.scaffold/` metadata, materializes the active Harness artifacts, and establishes agent-discovery infrastructure. The agent-run initialization workflow then establishes only the project's external-facing foundation in the Schema-selected Project Context representation: project purpose, domain terms and glossary, goals, scope and exclusions, and material unknowns. Before recording that representation, it presents evidence-derived context to the maintainer for confirmation or correction when repository evidence sufficiently establishes it. If repository evidence is insufficient, it asks the maintainer directly without suggesting invented project-specific content and does not create the Project Context before receiving the needed context. Project Context is orientation only; it does not create a fourth Knowledge Model space or make a Problem document necessary merely to record a project goal. The workflow records evidence-backed code-style, build or compiler, formatting or linting, testing or quality-gate, and Git/pull-request/branching/release practices as Project Rules; it leaves a Rule undefined when no reliable evidence or maintainer input establishes the practice. Project Context may identify an absent practice only when that absence is material to orientation, and never serves as its authoritative procedure or configuration record. Requirements and acceptance scenarios, architecture, integrations and external contracts, security and operational constraints, and Harness customization remain discovery- or change-driven unless current evidence makes them necessary.

Relationships:

- Related-to: [REQ-014 — Foundational Project Context baseline](../problem/scaffold-product.md#req-014).
- Related-to: [REQ-016 — Rule-based engineering-practice baseline](../problem/scaffold-product.md#req-016).
- Related-to: [REQ-015 — Confirmed foundational Project Context](../problem/scaffold-product.md#req-015).
- Related-to: [REQ-017 — Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#req-017).

<a id="dec-003"></a>

### DEC-003 — Managed-block integration

A bounded `<!-- scaffold:start -->` / `<!-- scaffold:end -->` block permits Scaffold to refresh its own instruction while preserving host-owned content. In a non-interactive terminal, an unintegrated existing host file is left unchanged.

<a id="dec-004"></a>

### DEC-004 — Diff-led, agent-mediated updates

The CLI produces only the current-project versus installed-package two-way diff and never merges artifacts or stores a baseline snapshot. The update-review Skill analyzes new capabilities and behavioral changes, discusses the project's actual needs with the owner, and records no artifact changes unless the owner decides to adopt, adapt, keep, retire, or defer them. `update` records the package version only after review.

Relationships:

- Related-to: [REQ-013 — Diff-led, project-owned update adoption](../problem/scaffold-product.md#req-013).

<a id="dec-005"></a>

### DEC-005 — Superseded: mechanical document-ID inspection

Superseded by DEC-008. The former CLI scanned Markdown document-ID declarations for availability; the path-based design no longer needs a document-ID allocation service.

<a id="dec-006"></a>

### DEC-006 — Superseded: pending local-only lifecycle implementation

This historical implementation-stage note is superseded by DEC-001 — Project-local active Harness with package candidates. Source inspection shows complete local Harness materialization, project-local artifact resolution, and mechanical two-way update comparison. The implemented consolidation changes the package artifact source as defined by [DEC-006](default-artifacts.md#dec-006); it does not restore shared-runtime resolution. Verification must still demonstrate the affected boundaries rather than infer success from source inspection.

<a id="dec-007"></a>

### DEC-007 — Separate Harness structure from update-review currency

Realizes: RESP-002 — Project lifecycle service.

Status inventories the active project-local agent guide, Knowledge Model, Knowledge Schema, Skills, Templates, and Rules. Its structural completeness check requires the root files `agent-guide.md`, `knowledge-model.md`, and `knowledge-schema.md`, and the `rules/`, `templates/`, and `skills/` directories. Missing or incorrectly typed entries are reported separately from the last-reviewed-version comparison. This mechanical check does not validate semantics, require candidate-named Skills or Templates, or introduce package fallback; projects retain deliberate local customization. A current review attestation alone does not establish structural completeness.

<a id="dec-008"></a>

### DEC-008 — Retire document-ID CLI commands

The path-based representation in [DEC-001](knowledge-reference-lifecycle.md#dec-001) removes the need for document-ID namespace inspection. Remove `id next` and `id check` from CLI dispatch, help, service exports, documentation, and required checks. An `id` invocation follows the ordinary unknown-command path and returns a nonzero exit status; it must not allocate or modify knowledge. Customized Schemas remain free to define identifiers but do not make the retired allocator a Scaffold obligation. Existing `init`, `status`, and `update` behavior remains unchanged.

CLI dispatch and service exports implement this retirement. It follows design reconciliation and precedes existing knowledge-format migration, as specified by [DEC-003](knowledge-reference-lifecycle.md#dec-003). VER-011 retains the bounded verification expectation.

## Verification Items

<a id="ver-001"></a>

### VER-001 — Repository initialization preserves structure

Verifies:

- [AC-007 — A repository initializes without restructuring](../problem/scaffold-product.md#ac-007).

Scope:

- `init` creates only Scaffold infrastructure in a selected repository.

Expected evidence:

- `init` preserves the existing repository structure while materializing the required active Harness guidance.

<a id="ver-002"></a>

### VER-002 — Managed agent integration preserves host content

Verifies:

- [AC-008 — Host-owned agent instructions are preserved](../problem/scaffold-product.md#ac-008).

Scope:

- replacement of the bounded Scaffold-managed instruction block.

Expected evidence:

- managed updates preserve surrounding `AGENTS.md` and `CLAUDE.md` content.

<a id="ver-003"></a>

### VER-003 — Update differences are reported and recorded safely

Verifies:

- [AC-016 — Update differences are visible and adopted deliberately](../problem/scaffold-product.md#ac-016).

Scope:

- `status`, `update --diff`, and update-review attestation behavior.

Expected evidence:

- `status` reports review drift; `update --diff` reports only the two-way artifact differences and causes no edits; and `update` records attestation only after owner-directed review, without changing project-local artifacts.

<a id="ver-005"></a>

### VER-005 — Legacy update-review attestation remains safe

Verifies:

- [AC-009 — Update review is visible and attested safely](../problem/scaffold-product.md#ac-009).

Scope:

- `status` review-drift reporting and `update` review attestation for existing project-local replacements.

Expected evidence:

- review drift is visible, and recording a review does not overwrite project-local replacements.

<a id="ver-004"></a>

### VER-004 — Retired: document-ID commands remain mechanical

Historical verification expectation for retired [AC-015](../problem/scaffold-product.md#ac-015). It no longer verifies active behavior; VER-011 targets the command-removal contract instead.

<a id="ver-006"></a>

### VER-006 — Initialization scopes the project baseline

Verifies:

- [AC-017 — Initialization establishes the foundational Project Context baseline](../problem/scaffold-product.md#ac-017).

Scope:

- the initialization workflow's classification of initial Project Knowledge and Project Rules, and its deferral of non-foundational knowledge.

Expected evidence:

- initialization records the project purpose, terms, goals, scope and exclusions, and material unknowns in Project Context without creating a Problem document merely to record a goal; captures or explicitly leaves unresolved evidence-based engineering and delivery practices as Project Rules; and does not require later discovery- or change-driven concerns for a usable baseline.

<a id="ver-007"></a>

### VER-007 — Initialization validates proposed Project Context

Verifies:

- [AC-018 — Initialization confirms Project Context before recording it](../problem/scaffold-product.md#ac-018).

Scope:

- the agent-run initialization workflow's treatment of evidence-derived and absent Project Context content.

Expected evidence:

- evidence-derived context is presented for maintainer confirmation or correction before recording; insufficient evidence causes direct maintainer questions without invented suggestions; and no Project Context is created before maintainer input.

<a id="ver-008"></a>

### VER-008 — Initialization classifies engineering practices as Rules

Verifies:

- [AC-019 — Initialization separates Project Context from Project Rules](../problem/scaffold-product.md#ac-019).

Scope:

- the agent-run initialization workflow's classification of evidence-backed and unresolved engineering and delivery practices.

Expected evidence:

- evidence-backed practices are represented by applicable Project Rules; absent practices remain undefined rather than inferred; and Project Context is not used as an authoritative procedure or configuration record.

<a id="ver-009"></a>

### VER-009 — Harness inventory and structural completeness remain distinct from review currency

Verifies:

- [AC-009 — Update review is visible and attested safely](../problem/scaffold-product.md#ac-009).

Scope:

- status reporting for intact, incomplete, and deliberately customized local Harness artifacts.

Expected evidence:

- status includes the local agent guide in its active artifact inventory;
- absent or incorrectly typed required root files or artifact directories are reported as structural incompleteness even when the reviewed version is current; and
- a structurally complete customized Harness is not reported incomplete merely because its Skill or Template names differ from the package candidate.

<a id="ver-011"></a>

### VER-011 — Removed ID commands are rejected

Verifies:

- [AC-002 — Independent files need no document-number allocation](../problem/knowledge-reference-lifecycle.md#ac-002).

Scope:

- CLI dispatch and help after retirement of the document-ID service.

Expected evidence:

- help exposes lifecycle commands without advertising an ID allocator;
- former `id next` and `id check` invocations return unknown-command failure without changing the target repository; and
- ordinary lifecycle commands still operate without document-ID declarations.
