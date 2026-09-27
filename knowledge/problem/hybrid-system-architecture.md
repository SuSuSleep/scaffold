# Hybrid System Architecture

Document ID: PROB-006

## Intent

Projects need the default Harness to describe hybrid systems without forcing all behavior into a deterministic program or treating AI-guided work as an unspecified implementation detail. Maintainers must be able to understand which behavior is adaptive, which is exact and repeatable, how the parts cooperate, and how those boundaries will be verified while continuing to use existing general-purpose agent hosts.

## Actors and Goals

- **Project maintainer**: wants a durable, reviewable allocation of hybrid-system behavior so implementation does not overfit either deterministic programs or AI-guided work.
- **Solution contributor**: wants enough responsibility, dependency, authority, failure, and verification context to implement or change a hybrid solution safely.
- **Existing general-purpose agent host**: an external system that consumes project guidance and tools while executing adaptive behavior.
- CTX-001#GOAL-003 — Support explicit hybrid solution architecture motivates this subject.

## Use Cases

- A maintainer defines or reconstructs a solution containing both adaptive and deterministic behavior and can identify the owner and boundary of each material responsibility.
- A contributor implements a Skill that relies on a deterministic operation and can identify the interface and integration needed to make that operation available to an existing agent host.
- A maintainer reviews verification expectations for a hybrid workflow and can distinguish component evidence from evidence of the real agent/tool interaction.

## Requirements

### REQ-001 — Explicit hybrid responsibility allocation

For a hybrid solution, the project must make the ownership of each material adaptive, deterministic, and integration responsibility explicit, together with material interfaces and dependencies, allocation rationale, and applicable authority and failure concerns.

### REQ-002 — Existing-agent portability

Hybrid architecture support must remain usable with existing general-purpose agent hosts without requiring the project to implement a new AI agent or inference runtime, adopt a new vendor adapter, or introduce mandatory machine-readable configuration.

### REQ-003 — Hybrid-boundary verification

The project must define observable verification expectations for deterministic behavior, Skill-guided adaptive behavior, and material end-to-end agent/tool interactions without substituting the interaction when that boundary is the verification target.

## Acceptance Criteria

### AC-001 — Hybrid responsibilities are distinguishable

For:

- REQ-001 — Explicit hybrid responsibility allocation.

Given:

- a project has a solution containing adaptive agent behavior and deterministic program behavior.

When:

- the project's architecture is defined or reconstructed with the default Harness.

Then:

- each material responsibility identifies whether an agent host guided by a Skill, a deterministic tool or bridge, or an integration component owns it;
- material interfaces, tool dependencies, and allocation rationale are visible; and
- permissions or authority, configuration ownership, and failure handling are recorded when they affect safe operation.

### AC-002 — Existing hosts remain sufficient

For:

- REQ-002 — Existing-agent portability.

Given:

- a project uses a supported existing general-purpose agent host such as Codex or Claude Code.

When:

- the project defines a hybrid solution with the default Harness.

Then:

- the architecture can be represented in human-readable Markdown and implemented through Skills, deterministic programs, and necessary integrations without a Scaffold-owned agent runtime, a new vendor adapter, or a mandatory machine-readable tool manifest.

### AC-003 — Hybrid evidence covers components and interaction

For:

- REQ-003 — Hybrid-boundary verification.

Given:

- a Skill-guided workflow depends on a deterministic tool exposed to an agent host.

When:

- verification expectations are defined.

Then:

- bounded evidence is expected for the deterministic tool behavior and the Skill-guided scenario; and
- end-to-end evidence keeps the real agent/tool interaction in scope when that interaction is the target.

## Related Knowledge

- SOL-006#CAP-001 — Hybrid responsibility architecture satisfies REQ-001.
- SOL-006#CAP-002 — Existing-agent tool integration satisfies REQ-002.
- SOL-006#CAP-003 — Layered hybrid verification satisfies REQ-003.
- GOV-002#CON-001 — Markdown-first core operation constrains the representation of this subject.
- GOV-002#CON-002 — Agent-mediated semantic validation constrains how hybrid responsibility allocation is interpreted.
