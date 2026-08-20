# Scaffold Product Baseline

Document ID: PROB-001

## Intent

Scaffold is a portable, knowledge-first development harness for human developers and coding agents. It enables a repository to retain durable intent, constraints, technical reasoning, and verification expectations in Markdown while allowing a project to replace shared operational artifacts deliberately.

## Actors and Goals

- **Project maintainer**: initialize and maintain Scaffold in a repository without restructuring existing work.
- **Developer or coding agent**: discover applicable guidance and project knowledge before meaningful work.
- **Project owner**: replace schemas, workflows, skills, or templates in full, and extend or atomically replace individual Project Rules as the project matures.

## Use Cases

- A maintainer initializes a new or existing repository with the `init` command.
- A developer or agent resolves the active shared or project-local guidance before performing meaningful work.
- A maintainer inspects active artifacts and update-review status with `status`.
- A maintainer records completion of an update review with `update` without overwriting project-local replacements.

## Requirements

### REQ-001 — Portable initialization

The CLI must initialize the Harness in a repository while preserving existing project structure.

Acceptance Criteria:

- A repository can be initialized and can use the default Scaffold without a custom schema.
- An existing repository can adopt Scaffold without full restructuring.

### REQ-002 — Explicit artifact resolution

A project-local Knowledge Schema, Workflow, Skill, or Template is authoritative in full; shared and local content must not be implicitly merged.

Acceptance Criteria:

- Local schemas, workflows, skills, and templates resolve as full replacements and are reported as shadowing shared equivalents.
- The Knowledge Model, Harness resolution semantics, and agent bootstrap contract remain Harness-owned and non-replaceable.

### REQ-011 — Extensible Project Rule collection

The Harness must represent Project Rules as a categorized effective collection. Rules have stable identities and applicability; local Rules may add identities or atomically replace matching shared identities without content merge.

Acceptance Criteria:

- Shared and local Rules coexist, with local additions and same-identity replacements reported distinctly.
- The old monolithic `.scaffold/project-rules.md` is not silently interpreted as a Rule collection.
- Agents review semantic conflict, redundancy, specialization, and unknown intent without a deterministic conflict engine.

### REQ-003 — Shared knowledge model

The Knowledge Model is Harness-owned and non-replaceable; full-replacement artifacts include the Knowledge Schema, Workflows, Skills, and Templates. Project Rules are extensible with atomic same-identity replacement.

Acceptance Criteria:

- A local Knowledge Model is ignored and reported while the shared model remains active.

### REQ-004 — Safe agent integration

`AGENTS.md` and `CLAUDE.md` remain host-owned; Scaffold must preserve surrounding content.

Acceptance Criteria:

- Initialization preserves non-Scaffold content in host-owned agent instruction files.

### REQ-005 — Review-aware updates

Status must expose update-review drift, and update must record review completion without silently overwriting project-local replacements.

Acceptance Criteria:

- Updates preserve local replacement contents and record review attestation.

### REQ-006 — Incremental brownfield reconstruction

The Harness must support incremental reconstruction of durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

Acceptance Criteria:

- A project can identify coherent knowledge subjects and document them incrementally.
- Reconstructed conclusions distinguish known evidence, inference, and unresolved uncertainty.

### REQ-007 — Evidence-based durable learning

The Harness must guide a project to convert relevant security, operational, and engineering findings into appropriately scoped durable knowledge when analysis justifies doing so.

Acceptance Criteria:

- Finding analysis records the evidence, root cause, and affected scope before generalizing a reusable obligation.
- A finding is not represented as a universal control or requirement without justified applicability.

### REQ-008 — Usable Markdown-first guidance

The Harness must provide usable default guidance and project knowledge representation in human-readable Markdown without requiring structured configuration for core operation.

Acceptance Criteria:

- A new project can begin useful work with the default Knowledge Schema, Project Rules, Workflows, and Skills.
- A project may customize replaceable guidance, but customization is not required before useful work begins.

### REQ-009 — Accepted-change lifecycle

The Harness must support a lifecycle in which a meaningful change is defined and reviewed for acceptance before implementation, while allowing project-specific methods to satisfy the lifecycle outcomes.

Acceptance Criteria:

- `define-change` produces a sufficiently defined proposed durable change.
- `review-change` establishes semantic correctness, representation compliance, relationship consistency, project-constraint compliance, and acceptance before `implement-change` begins.
- A Project Rule may require a method such as TDD without changing the Workflow's required outcomes.

### REQ-010 — Selective guidance consumption

The Harness must keep durable Governance separate from Project Rules and enable agents to consume only the Governance and Rules relevant to the current Workflow Phase.

Acceptance Criteria:

- Governance records state when they apply and when they do not normally apply.
- Solution records define solution-specific verification items; applicable verification Rules guide the project-wide approach unless a Solution has an exceptional constraint.
- Shared Workflows and Skills refer to Governance and Rules by semantic subject rather than project-specific file paths.
- No deterministic context-routing engine is required.

## Acceptance Criteria

## Related Knowledge

- SOL-001#CAP-001 — Harness lifecycle management.
- SOL-001#CAP-002 — Artifact resolution.
- SOL-001#CAP-003 — Agent guidance integration.
- SOL-002#CAP-002 — Evidence-based knowledge reconstruction.
- SOL-002#CAP-003 — Finding-to-knowledge learning.
- SOL-003#CAP-002 — Deliberate guidance authority.
- SOL-004#CAP-001 — Accepted-change lifecycle management.
- SOL-004#CAP-002 — Method-flexible work guidance.
- SOL-005#CAP-001 — Selective guidance context resolution.
- GOV-002#CON-001 — Markdown-first core operation.
- GOV-002#CON-002 — Agent-mediated semantic validation.
- GOV-002#CON-003 — Durable source-of-truth boundaries.
- GOV-002#CON-004 — Initial product scope boundaries.
- GOV-001#CON-001 — Supported Node.js runtime.
