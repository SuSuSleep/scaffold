# CLI and Guidance Baseline

> Implementation context: [`src/cli.js`](../../src/cli.js), [`src/project.js`](../../src/project.js), and [`test/cli.test.js`](../../test/cli.test.js), inspected 2026-11-13. The source materializes project-local guidance and provides two-way update comparison using the single-source package layout in [One source for active and distributed Harness artifacts](default-artifacts.md#one-source-for-active-and-distributed-harness-artifacts). Extracted-package initialization and non-mutating comparison were verified on 2026-11-13.

## Capabilities and Architecture

<a id="harness-lifecycle-management"></a>

### Harness lifecycle management

Initialize, inspect, and record update-review state for a target repository.

#### Responsibilities

Uses shared Responsibilities [Command dispatcher](#command-dispatcher), [Project lifecycle service](#project-lifecycle-service) defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="superseded-sharedlocal-artifact-resolution"></a>

### Superseded: shared/local artifact resolution

Superseded by [Materialized Harness lifecycle management](#materialized-harness-lifecycle-management). This historical capability described shared runtime defaults and an effective shared-plus-local Rule collection; it is not an active solution capability.

<a id="agent-guidance-integration"></a>

### Agent guidance integration

Provide a materialized project-local agent guide and managed instruction blocks for supported existing agent hosts without owning surrounding host instructions or supplying an agent runtime.

Relationships:

- Satisfies: [Safe agent integration](../problem/scaffold-product.md#safe-agent-integration).
- Related-to: [Existing-agent tool integration](hybrid-agent-tool-architecture.md#existing-agent-tool-integration).

#### Responsibilities

<a id="host-instruction-reconciler"></a>

##### Host-instruction reconciler

Realizes: [Agent guidance integration](#agent-guidance-integration)

Create absent agent instruction files or update only an existing managed Scaffold block.

Uses shared Responsibilities [Command dispatcher](#command-dispatcher) defined in Shared Architecture.

#### Components and Boundaries

- **`AGENTS.md` and `CLAUDE.md` managed blocks** expose Scaffold guidance to the currently supported Codex and Claude Code host integrations. They preserve host-owned content and do not turn Scaffold into the agent runtime.

See Shared Architecture for component assignments and interaction boundaries.

<a id="retired-mechanical-document-id-inspection"></a>

### Retired: mechanical document-ID inspection

Retired with [Retired: mechanical document-ID support](../problem/scaffold-product.md#retired-mechanical-document-id-support) by [Retire document-ID CLI commands](#retire-document-id-cli-commands). The historical document-ID inspector Responsibility [Retired: document-ID inspector](#retired-document-id-inspector) is retired; lifecycle components no longer own that Responsibility. This object remains historical context, not an active capability.

#### Responsibilities

<a id="retired-document-id-inspector"></a>

##### Retired: document-ID inspector

Historical Responsibility of retired [Retired: mechanical document-ID inspection](#retired-mechanical-document-id-inspection); no current component assignment.

<a id="materialized-harness-lifecycle-management"></a>

### Materialized Harness lifecycle management

Initialize a complete project-local Harness, inspect it, mechanically compare it with an installed candidate bundle, and record completion of owner-directed update review.

Relationships:

- Satisfies: [Portable initialization](../problem/scaffold-product.md#portable-initialization).
- [Materialized Harness lifecycle management](#materialized-harness-lifecycle-management) supersedes [Superseded: shared/local artifact resolution](#superseded-sharedlocal-artifact-resolution). [Superseded: shared/local artifact resolution](#superseded-sharedlocal-artifact-resolution) remains as historical traceability only; active implementation and verification target [Materialized Harness lifecycle management](#materialized-harness-lifecycle-management) and its listed current Requirements.

#### Responsibilities

Uses shared Responsibilities [Command dispatcher](#command-dispatcher), [Project lifecycle service](#project-lifecycle-service) defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

### Shared Architecture

#### Responsibilities

<a id="command-dispatcher"></a>

##### Command dispatcher

Realizes: [Harness lifecycle management](#harness-lifecycle-management), [Agent guidance integration](#agent-guidance-integration), [Materialized Harness lifecycle management](#materialized-harness-lifecycle-management)

Validate CLI commands and target path arguments, then delegate lifecycle work.

<a id="project-lifecycle-service"></a>

##### Project lifecycle service

Realizes: [Harness lifecycle management](#harness-lifecycle-management), [Materialized Harness lifecycle management](#materialized-harness-lifecycle-management)

Create infrastructure, maintain metadata, resolve artifacts, and format lifecycle results.

Relationships:

- Lifecycle evidence: [Project metadata](../../.scaffold/metadata.md).

#### Components and Boundaries

- **`bin/scaffold.js`** exposes the command-line entry point.
- **`src/cli.js`** is assigned-to [Command dispatcher](#command-dispatcher) and exposes the `init`, `status`, and `update` command interface.
- **`src/project.js`** is assigned-to [Project lifecycle service](#project-lifecycle-service) and [Host-instruction reconciler](#host-instruction-reconciler). It owns local filesystem interactions within the target project.
- **Project-local Harness artifacts** expose the active Knowledge Model, Schema, categorized Rules, workflow Skills, model-invoked Skills, templates, and agent guide. The agent guide directs meaningful work to the other materialized local guidance. The installed package distributes candidate artifacts for initialization and comparison only; it is never a runtime fallback.

<a id="scaffold-command-line-interface"></a>

##### Scaffold command-line interface

Concept: Interface

Exposed by `bin/scaffold.js` through `src/cli.js`.

- `scaffold init [directory]` initializes Harness infrastructure and materializes the required active artifacts for the target repository.
- `scaffold status [directory]` reports the project-local active artifacts, including the agent guide, structural completeness, and update-review state as distinct observations.
- `scaffold update --diff [directory]` reports a two-way add/change/removal comparison between project-local active artifacts and the installed package candidate bundle, without edits or merge decisions.
- `scaffold update [directory]` records completed owner-directed update review without changing project-local artifacts.
- The former `scaffold id next` and `scaffold id check` commands are removed; `id` follows unknown-command handling under [Retire document-ID CLI commands](#retire-document-id-cli-commands).
- `scaffold --help` and `scaffold --version` report usage and the running package version; an unknown command or more than one directory argument returns a nonzero exit status.
- When existing `AGENTS.md` or `CLAUDE.md` lacks a managed Scaffold block, interactive execution may add or preview the block; non-interactive execution preserves the file and reports that integration remains incomplete.
- A legacy `.scaffold/project-rules.md` is reported and ignored; it requires deliberate project migration.

Relationships:

- [Supported Node.js runtime](../governance/runtime-and-distribution.md#supported-nodejs-runtime).
- **Known governance**: [Supported Node.js runtime](../governance/runtime-and-distribution.md#supported-nodejs-runtime) constrains the supported runtime. No external contracts or reusable security controls have been established for this project.

## Satisfies

- [Materialized Harness lifecycle management](#materialized-harness-lifecycle-management) satisfies:
  - [Portable initialization](../problem/scaffold-product.md#portable-initialization)
  - [Review-aware updates](../problem/scaffold-product.md#review-aware-updates)
  - [Foundational Project Context baseline](../problem/scaffold-product.md#foundational-project-context-baseline)
  - [Confirmed foundational Project Context](../problem/scaffold-product.md#confirmed-foundational-project-context)
  - [Rule-based engineering-practice baseline](../problem/scaffold-product.md#rule-based-engineering-practice-baseline)
  - [Diff-led, project-owned update adoption](../problem/scaffold-product.md#diff-led-project-owned-update-adoption)
  - [Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#project-local-active-harness-authority)
  - [Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#materialized-harness-initialization)
  - [Project-local Project Rule collection](../problem/knowledge-authority-and-customization.md#project-local-project-rule-collection)
- [Agent guidance integration](#agent-guidance-integration) satisfies:
  - [Safe agent integration](../problem/scaffold-product.md#safe-agent-integration)

## Design and Decisions

The entries in this section are Decisions; explicitly superseded entries remain historical.

<a id="project-local-active-harness-with-package-candidates"></a>

### Project-local active Harness with package candidates

Initialization materializes the complete active Harness in `.scaffold/`; ordinary operation resolves only those project-local artifacts. The package ships a starter/candidate bundle used to seed initialization and produce update diffs, but it never becomes a runtime fallback. Its source is the Scaffold repository's active `.scaffold/`, as defined by [One source for active and distributed Harness artifacts](default-artifacts.md#one-source-for-active-and-distributed-harness-artifacts); the package's `.scaffold/` is the copy source for target initialization and comparison, with local metadata excluded.

Relationships:

- Related-to: [Project-local active Harness authority](../problem/knowledge-authority-and-customization.md#project-local-active-harness-authority).
- Related-to: [Project-local Project Rule collection](../problem/knowledge-authority-and-customization.md#project-local-project-rule-collection).

<a id="materialized-cli-initialization"></a>

### Materialized CLI initialization

`init` creates `.scaffold/` metadata, materializes the active Harness artifacts, and establishes agent-discovery infrastructure. The agent-run initialization workflow then establishes only the project's external-facing foundation in the Schema-selected Project Context representation: project purpose, domain terms and glossary, goals, scope and exclusions, and material unknowns. Before recording that representation, it presents evidence-derived context to the maintainer for confirmation or correction when repository evidence sufficiently establishes it. If repository evidence is insufficient, it asks the maintainer directly without suggesting invented project-specific content and does not create the Project Context before receiving the needed context. Project Context is orientation only; it does not create a fourth Knowledge Model space or make a Problem document necessary merely to record a project goal. The workflow records evidence-backed code-style, build or compiler, formatting or linting, testing or quality-gate, and Git/pull-request/branching/release practices as Project Rules; it leaves a Rule undefined when no reliable evidence or maintainer input establishes the practice. Project Context may identify an absent practice only when that absence is material to orientation, and never serves as its authoritative procedure or configuration record. Requirements and acceptance scenarios, architecture, integrations and external contracts, security and operational constraints, and Harness customization remain discovery- or change-driven unless current evidence makes them necessary.

Relationships:

- Related-to: [Foundational Project Context baseline](../problem/scaffold-product.md#foundational-project-context-baseline).
- Related-to: [Rule-based engineering-practice baseline](../problem/scaffold-product.md#rule-based-engineering-practice-baseline).
- Related-to: [Confirmed foundational Project Context](../problem/scaffold-product.md#confirmed-foundational-project-context).
- Related-to: [Materialized Harness initialization](../problem/knowledge-authority-and-customization.md#materialized-harness-initialization).

<a id="managed-block-integration"></a>

### Managed-block integration

A bounded `<!-- scaffold:start -->` / `<!-- scaffold:end -->` block permits Scaffold to refresh its own instruction while preserving host-owned content. In a non-interactive terminal, an unintegrated existing host file is left unchanged.

<a id="diff-led-agent-mediated-updates"></a>

### Diff-led, agent-mediated updates

The CLI produces only the current-project versus installed-package two-way diff and never merges artifacts or stores a baseline snapshot. The update-review Skill analyzes new capabilities and behavioral changes, discusses the project's actual needs with the owner, and records no artifact changes unless the owner decides to adopt, adapt, keep, retire, or defer them. `update` records the package version only after review.

Relationships:

- Related-to: [Diff-led, project-owned update adoption](../problem/scaffold-product.md#diff-led-project-owned-update-adoption).

<a id="superseded-mechanical-document-id-inspection"></a>

### Superseded: mechanical document-ID inspection

Superseded by [Retire document-ID CLI commands](#retire-document-id-cli-commands). The former CLI scanned Markdown document-ID declarations for availability; the path-based design no longer needs a document-ID allocation service.

<a id="superseded-pending-local-only-lifecycle-implementation"></a>

### Superseded: pending local-only lifecycle implementation

This historical implementation-stage note is superseded by [Project-local active Harness with package candidates](#project-local-active-harness-with-package-candidates). Source inspection shows complete local Harness materialization, project-local artifact resolution, and mechanical two-way update comparison. The implemented consolidation changes the package artifact source as defined by [One source for active and distributed Harness artifacts](default-artifacts.md#one-source-for-active-and-distributed-harness-artifacts); it does not restore shared-runtime resolution. Verification must still demonstrate the affected boundaries rather than infer success from source inspection.

<a id="separate-harness-structure-from-update-review-currency"></a>

### Separate Harness structure from update-review currency

Realizes: [Project lifecycle service](#project-lifecycle-service).

Status inventories the active project-local agent guide, Knowledge Model, Knowledge Schema, Skills, Templates, and Rules. Its structural completeness check requires the root files `agent-guide.md`, `knowledge-model.md`, and `knowledge-schema.md`, and the `rules/`, `templates/`, and `skills/` directories. Missing or incorrectly typed entries are reported separately from the last-reviewed-version comparison. This mechanical check does not validate semantics, require candidate-named Skills or Templates, or introduce package fallback; projects retain deliberate local customization. A current review attestation alone does not establish structural completeness.

<a id="retire-document-id-cli-commands"></a>

### Retire document-ID CLI commands

The path-based representation in [Superseded: paths with stable numeric object anchors](knowledge-reference-lifecycle.md#superseded-paths-with-stable-numeric-object-anchors) removes the need for document-ID namespace inspection. Remove `id next` and `id check` from CLI dispatch, help, service exports, documentation, and required checks. An `id` invocation follows the ordinary unknown-command path and returns a nonzero exit status; it must not allocate or modify knowledge. Customized Schemas remain free to define identifiers but do not make the retired allocator a Scaffold obligation. Existing `init`, `status`, and `update` behavior remains unchanged.

CLI dispatch and service exports implement this retirement. It follows design reconciliation and precedes existing knowledge-format migration, as specified by [Design, implementation, then representation migration](knowledge-reference-lifecycle.md#design-implementation-then-representation-migration). [Removed ID commands are rejected](#removed-id-commands-are-rejected) retains the bounded verification expectation.

## Verification Items

<a id="repository-initialization-preserves-structure"></a>

### Repository initialization preserves structure

Verifies:

- [A repository initializes without restructuring](../problem/scaffold-product.md#a-repository-initializes-without-restructuring).

Scope:

- `init` creates only Scaffold infrastructure in a selected repository.

Expected evidence:

- `init` preserves the existing repository structure while materializing the required active Harness guidance.

<a id="managed-agent-integration-preserves-host-content"></a>

### Managed agent integration preserves host content

Verifies:

- [Host-owned agent instructions are preserved](../problem/scaffold-product.md#host-owned-agent-instructions-are-preserved).

Scope:

- replacement of the bounded Scaffold-managed instruction block.

Expected evidence:

- managed updates preserve surrounding `AGENTS.md` and `CLAUDE.md` content.

<a id="update-differences-are-reported-and-recorded-safely"></a>

### Update differences are reported and recorded safely

Verifies:

- [Update differences are visible and adopted deliberately](../problem/scaffold-product.md#update-differences-are-visible-and-adopted-deliberately).

Scope:

- `status`, `update --diff`, and update-review attestation behavior.

Expected evidence:

- `status` reports review drift; `update --diff` reports only the two-way artifact differences and causes no edits; and `update` records attestation only after owner-directed review, without changing project-local artifacts.

<a id="legacy-update-review-attestation-remains-safe"></a>

### Legacy update-review attestation remains safe

Verifies:

- [Update review is visible and attested safely](../problem/scaffold-product.md#update-review-is-visible-and-attested-safely).

Scope:

- `status` review-drift reporting and `update` review attestation for existing project-local replacements.

Expected evidence:

- review drift is visible, and recording a review does not overwrite project-local replacements.

<a id="retired-document-id-commands-remain-mechanical"></a>

### Retired: document-ID commands remain mechanical

Historical verification expectation for retired [Retired: document IDs are inspected mechanically](../problem/scaffold-product.md#retired-document-ids-are-inspected-mechanically). It no longer verifies active behavior; [Removed ID commands are rejected](#removed-id-commands-are-rejected) targets the command-removal contract instead.

<a id="initialization-scopes-the-project-baseline"></a>

### Initialization scopes the project baseline

Verifies:

- [Initialization establishes the foundational Project Context baseline](../problem/scaffold-product.md#initialization-establishes-the-foundational-project-context-baseline).

Scope:

- the initialization workflow's classification of initial Project Knowledge and Project Rules, and its deferral of non-foundational knowledge.

Expected evidence:

- initialization records the project purpose, terms, goals, scope and exclusions, and material unknowns in Project Context without creating a Problem document merely to record a goal; captures or explicitly leaves unresolved evidence-based engineering and delivery practices as Project Rules; and does not require later discovery- or change-driven concerns for a usable baseline.

<a id="initialization-validates-proposed-project-context"></a>

### Initialization validates proposed Project Context

Verifies:

- [Initialization confirms Project Context before recording it](../problem/scaffold-product.md#initialization-confirms-project-context-before-recording-it).

Scope:

- the agent-run initialization workflow's treatment of evidence-derived and absent Project Context content.

Expected evidence:

- evidence-derived context is presented for maintainer confirmation or correction before recording; insufficient evidence causes direct maintainer questions without invented suggestions; and no Project Context is created before maintainer input.

<a id="initialization-classifies-engineering-practices-as-rules"></a>

### Initialization classifies engineering practices as Rules

Verifies:

- [Initialization separates Project Context from Project Rules](../problem/scaffold-product.md#initialization-separates-project-context-from-project-rules).

Scope:

- the agent-run initialization workflow's classification of evidence-backed and unresolved engineering and delivery practices.

Expected evidence:

- evidence-backed practices are represented by applicable Project Rules; absent practices remain undefined rather than inferred; and Project Context is not used as an authoritative procedure or configuration record.

<a id="harness-inventory-and-structural-completeness-remain-distinct-from-review-currency"></a>

### Harness inventory and structural completeness remain distinct from review currency

Verifies:

- [Update review is visible and attested safely](../problem/scaffold-product.md#update-review-is-visible-and-attested-safely).

Scope:

- status reporting for intact, incomplete, and deliberately customized local Harness artifacts.

Expected evidence:

- status includes the local agent guide in its active artifact inventory;
- absent or incorrectly typed required root files or artifact directories are reported as structural incompleteness even when the reviewed version is current; and
- a structurally complete customized Harness is not reported incomplete merely because its Skill or Template names differ from the package candidate.

<a id="removed-id-commands-are-rejected"></a>

### Removed ID commands are rejected

Verifies:

- [Independent creation needs no numeric allocation](../problem/knowledge-reference-lifecycle.md#independent-creation-needs-no-numeric-allocation).

Scope:

- CLI dispatch and help after retirement of the document-ID service.

Expected evidence:

- help exposes lifecycle commands without advertising an ID allocator;
- former `id next` and `id check` invocations return unknown-command failure without changing the target repository; and
- ordinary lifecycle commands still operate without document-ID declarations.
