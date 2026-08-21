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

### REQ-002 — Explicit artifact resolution

A project-local Knowledge Schema, Workflow, Skill, or Template is authoritative in full; shared and local content must not be implicitly merged.

### REQ-011 — Extensible Project Rule collection

The Harness must represent Project Rules as a categorized effective collection. Rules have stable identities and applicability; local Rules may add identities or atomically replace matching shared identities without content merge.

### REQ-003 — Shared knowledge model

The Knowledge Model is Harness-owned and non-replaceable; full-replacement artifacts include the Knowledge Schema, Workflows, Skills, and Templates. Project Rules are extensible with atomic same-identity replacement.

### REQ-004 — Safe agent integration

`AGENTS.md` and `CLAUDE.md` remain host-owned; Scaffold must preserve surrounding content.

### REQ-005 — Review-aware updates

Status must expose update-review drift, and update must record review completion without silently overwriting project-local replacements.

### REQ-006 — Incremental brownfield reconstruction

The Harness must support incremental reconstruction of durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

### REQ-007 — Evidence-based durable learning

The Harness must guide a project to convert relevant security, operational, and engineering findings into appropriately scoped durable knowledge when analysis justifies doing so.

### REQ-008 — Usable Markdown-first guidance

The Harness must provide usable default guidance and project knowledge representation in human-readable Markdown without requiring structured configuration for core operation.

### REQ-009 — Accepted-change lifecycle

The Harness must support a lifecycle in which a meaningful change is defined and reviewed for acceptance before downstream work, while allowing project-specific methods to satisfy the lifecycle outcomes.

### REQ-010 — Selective guidance consumption

The Harness must keep durable Governance separate from Project Rules and enable agents to consume only the Governance and Rules relevant to the current Workflow Phase.

### REQ-012 — Mechanical document-ID support

The CLI must provide repository-level next-ID and availability checks for document IDs without interpreting Knowledge Model semantics or hard-coding knowledge directories.

### REQ-013 — Authority-safe artifact evolution

The Harness must support deliberate evolution of full-replacement artifacts and route accepted changes to the appropriate downstream Workflow without allowing an artifact to override a different authority domain.

## Acceptance Criteria

### AC-001 — A project can adopt Scaffold without restructuring

Covers:

- REQ-001 — Portable initialization
- REQ-004 — Safe agent integration
- REQ-005 — Review-aware updates

Expected behavior:

- A new or existing repository initializes without a custom Schema or full restructuring.

### AC-002 — Shared and local guidance resolves by its defined semantics

Covers:

- REQ-002 — Explicit artifact resolution
- REQ-003 — Shared knowledge model
- REQ-011 — Extensible Project Rule collection

Expected behavior:

- Full-replacement artifacts shadow shared equivalents; local Rules add or atomically replace identities; the Harness contracts remain shared.

### AC-003 — Durable knowledge is interpreted safely

Covers:

- REQ-006 — Incremental brownfield reconstruction
- REQ-010 — Selective guidance consumption

Expected behavior:

- Agents load the Schema for material knowledge work, select relevant guidance semantically, and do not treat Inferred or Unknown reconstruction as authoritative without review.

### AC-004 — The CLI checks document-ID availability mechanically

Covers:

- REQ-012 — Mechanical document-ID support

Expected behavior:

- The CLI returns the next unused namespace ID and reports every path using an existing document ID.

### AC-005 — Accepted changes reach the correct lifecycle

Covers:

- REQ-009 — Accepted-change lifecycle
- REQ-013 — Authority-safe artifact evolution

Expected behavior:

- Review acceptance routes to implementation, knowledge update, Rule evolution, artifact evolution, or a necessary sequence.

### AC-006 — Durable guidance remains usable and evidence-based

Covers:

- REQ-007 — Evidence-based durable learning
- REQ-008 — Usable Markdown-first guidance

Expected behavior:

- Findings are generalized only with justified scope, and a project can begin using readable default guidance without mandatory structured configuration.

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
