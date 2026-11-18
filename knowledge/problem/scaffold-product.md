# Harness Lifecycle and Repository Integration

## Intent

Scaffold must let a project adopt and operate the Harness safely in an existing repository, while retaining clear lifecycle visibility. Knowledge-reference lifecycle obligations are recorded separately in [Knowledge Reference Lifecycle](knowledge-reference-lifecycle.md).

Interaction context:

- A maintainer initializes a new or existing repository with the `init` command.
- A maintainer establishes the initial project baseline from existing repository evidence and known project context.
- A maintainer inspects the materialized active Harness and update-review status with `status`.
- A maintainer obtains a mechanical two-way diff between project-local Harness artifacts and the installed package candidate bundle.
- A maintainer records completion of a user-reviewed update with `update`, after selecting project-local changes.

## Actors and Goals

- **Project maintainer**: initialize and maintain Scaffold in a repository without restructuring existing work.
- **Project maintainer**: establish a lightweight, evidence-based project baseline before undertaking later change work.
- **Developer or coding agent**: discover the active Harness state before meaningful work.

## Requirements

<a id="req-001"></a>

### REQ-001 — Portable initialization

The CLI must initialize the Harness in a repository while preserving existing project structure.

Relationships:

- Satisfied-by: [CAP-005 — Materialized Harness lifecycle management](../solution/cli-and-guidance.md#cap-005).
- [CON-001 — Supported Node.js runtime](../governance/runtime-and-distribution.md#con-001).

<a id="req-004"></a>

### REQ-004 — Safe agent integration

`AGENTS.md` and `CLAUDE.md` remain host-owned; Scaffold must preserve surrounding content.

Relationships:

- Satisfied-by: [CAP-003 — Agent guidance integration](../solution/cli-and-guidance.md#cap-003).

<a id="req-005"></a>

### REQ-005 — Review-aware updates

Status must expose update-review drift and the active Harness inventory, including its agent guide. It must distinguish recorded review currency from structural completeness and report missing required Harness structure without substituting package content. Update must record review completion without silently overwriting project-local replacements.

<a id="req-013"></a>

### REQ-013 — Diff-led, project-owned update adoption

The CLI must expose update-review drift and mechanically compare the complete project-local Harness with the installed package candidate bundle. It must report additions, changes, and package removals without editing either artifact set or attempting a merge. An update-review workflow must analyze the behavioral implications and discuss material choices with the project owner; only after that review may `update` record the reviewed version. No update action may silently overwrite project-local artifacts.

<a id="req-012"></a>

### REQ-012 — Retired: mechanical document-ID support

Retired by the path-based reference design in [DEC-001](../solution/knowledge-reference-lifecycle.md#dec-001). Repository-level document-ID allocation and availability inspection are no longer product obligations. This historical object is not an active requirement; its ID is not reused.

<a id="req-014"></a>

### REQ-014 — Foundational Project Context baseline

Initialization must guide the project to establish a lightweight, external-facing Project Context baseline for useful work. The context records the project's top-level purpose, stakeholder or project goals, project-specific domain terms and glossary, scope and exclusions, and material unknowns. The Project Context is an orientation representation selected by the active Knowledge Schema, not a Problem document or a fourth Knowledge Model space. It must not introduce Actors, Use Cases, Requirements, or Acceptance Criteria; Goals retain their Problem-space meaning.

Initialization records the initial terms and goals in Project Context and must not create a Problem document merely to record a project goal. The reusable engineering and delivery practices—code and style conventions, reusable testing practices and quality gates, and Git, pull-request, branching, and release conventions—are Project Rules; selected starter templates may support those Rules where the active Schema makes them applicable. The baseline must be grounded in existing repository evidence or explicit project context and must not invent conventions.

Requirements and their acceptance scenarios, architecture, integrations and external contracts, security and operational constraints, and Harness customization are not required for this initial baseline. They are established later when discovery or a change workflow makes them relevant.

<a id="req-015"></a>

### REQ-015 — Confirmed foundational Project Context

The agent-run initialization workflow must validate the proposed Project Context with the project maintainer before recording it. When repository evidence sufficiently establishes proposed Project Context content—purpose, goals, terms, scope, exclusions, or material unknowns—the workflow must present that evidence-derived context and ask the maintainer to confirm or correct it. When the repository does not supply sufficient context, including a greenfield repository, the workflow must ask the maintainer directly for the needed context without inventing or suggesting project-specific answers. It must not create a Project Context record until the maintainer has supplied, confirmed, or corrected its content.

<a id="req-016"></a>

### REQ-016 — Rule-based engineering-practice baseline

The agent-run initialization workflow must classify reusable engineering and delivery practices as Project Rules rather than Project Context content. When repository evidence or maintainer input establishes a code-style, build or compiler, formatting or linting, testing or quality-gate, or Git, pull-request, branching, or release practice, the workflow must create or revise the applicable Project Rule. When no reliable evidence or maintainer input establishes such a practice, the workflow must leave the corresponding Rule undefined rather than infer it. Project Context may identify the absence only when it is a material project-level unknown; it must not become the authoritative procedure or configuration record for an engineering or delivery practice.

## Acceptance Criteria

<a id="ac-007"></a>

### AC-007 — A repository initializes without restructuring

For:

- REQ-001 — Portable initialization

Given:

- a new or existing repository is selected.

When:

- the maintainer runs `scaffold init`.

Then:

- Scaffold infrastructure is initialized without restructuring the repository.

<a id="ac-008"></a>

### AC-008 — Host-owned agent instructions are preserved

For:

- REQ-004 — Safe agent integration

Given:

- `AGENTS.md` or `CLAUDE.md` contains host-owned content.

When:

- Scaffold initializes or refreshes its managed instruction.

Then:

- surrounding host-owned content remains preserved.

<a id="ac-009"></a>

### AC-009 — Update review is visible and attested safely

For:

- REQ-005 — Review-aware updates

Given:

- a Scaffold project has a recorded reviewed version.

When:

- a maintainer checks status or records an update review.

Then:

- review drift is visible and local replacements are not overwritten;
- status identifies active Harness artifacts, including the agent guide, and reports missing required structure separately from review currency; and
- a recorded current review remains distinguishable from an incomplete Harness, including when the project has customized its local Skills or Templates.

<a id="ac-016"></a>

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

<a id="ac-015"></a>

### AC-015 — Retired: document IDs are inspected mechanically

Historical acceptance condition of retired REQ-012. It no longer defines required CLI behavior or an active verification target; see [DEC-008 — Retire document-ID CLI commands](../solution/cli-and-guidance.md#dec-008).

<a id="ac-017"></a>

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

<a id="ac-018"></a>

### AC-018 — Initialization confirms Project Context before recording it

For:

- REQ-015 — Confirmed foundational Project Context

Given:

- a maintainer starts the agent-run initialization workflow.

When:

- repository evidence is sufficient to propose Project Context content.

Then:

- the workflow presents the evidence-derived content and asks the maintainer to confirm or correct it before recording the Project Context.

Given:

- repository evidence is insufficient to establish Project Context content, including in a greenfield repository.

When:

- the workflow establishes the foundational context.

Then:

- it asks the maintainer directly for the required context without proposing invented project-specific answers.
- it creates no Project Context record before the maintainer supplies, confirms, or corrects the content.

<a id="ac-019"></a>

### AC-019 — Initialization separates Project Context from Project Rules

For:

- REQ-016 — Rule-based engineering-practice baseline

Given:

- repository evidence or maintainer input establishes an engineering or delivery practice.

When:

- the agent-run initialization workflow establishes the baseline.

Then:

- it records the practice in an applicable Project Rule rather than Project Context.
- Project Context contains no authoritative engineering or delivery procedure or configuration.

Given:

- no reliable evidence or maintainer input establishes a relevant engineering or delivery practice.

When:

- the workflow establishes the baseline.

Then:

- it leaves the corresponding Project Rule undefined rather than inferring a convention.
- it records the absence in Project Context only when that absence is material to project orientation.
