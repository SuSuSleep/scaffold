# Knowledge Authority and Customization

Document ID: PROB-002

## Intent

Scaffold must let projects customize operational guidance deliberately without diluting the shared semantic contract or implicitly combining incompatible sources of authority.

## Actors and Goals

- **Project owner**: replace full-replacement artifacts and evolve Project Rules as the project matures.
- **Developer or coding agent**: resolve the active knowledge and guidance authorities correctly before meaningful work.

## Use Cases

- A project supplies a local replacement for a shared artifact and Scaffold resolves it.
- Scaffold resolves shared and local Project Rules into the active Rule collection.
- A project routes an accepted artifact change through the appropriate evolution Workflow.

## Requirements

### REQ-002 — Explicit artifact resolution

A project-local Knowledge Schema, Workflow, Skill, or Template is authoritative in full; shared and local content must not be implicitly merged.

### REQ-003 — Shared knowledge model

The Knowledge Model is Harness-owned and non-replaceable; full-replacement artifacts include the Knowledge Schema, Workflows, Skills, and Templates. Project Rules are extensible with atomic same-identity replacement.

### REQ-011 — Extensible Project Rule collection

The Harness must represent Project Rules as a categorized effective collection. Rules have stable identities and applicability; local Rules may add identities or atomically replace matching shared identities without content merge.

### REQ-013 — Authority-safe artifact evolution

The Harness must support deliberate evolution of full-replacement artifacts and route accepted changes to the appropriate downstream Workflow without allowing an artifact to override a different authority domain.

## Acceptance Criteria

### AC-010 — Full-replacement artifacts resolve explicitly

For:

- REQ-002 — Explicit artifact resolution

Given:

- a project supplies a local replacement for a shared artifact.

When:

- Scaffold resolves that artifact.

Then:

- the local artifact replaces the shared artifact in full without implicit merging.

### AC-011 — The shared Knowledge Model remains authoritative

For:

- REQ-003 — Shared knowledge model

Given:

- a project has local Scaffold customizations.

When:

- an agent resolves knowledge semantics.

Then:

- it uses the shared Knowledge Model while applying local artifact replacement only where supported.

### AC-012 — Project Rules form an effective collection

For:

- REQ-011 — Extensible Project Rule collection

Given:

- shared Rules and optional local Rules have stable identities.

When:

- Scaffold resolves the active Rule set.

Then:

- local Rules add identities or atomically replace matching shared identities without content merge.

### AC-017 — Artifact evolution preserves authority boundaries

For:

- REQ-013 — Authority-safe artifact evolution

Given:

- an accepted change affects a full-replacement artifact.

When:

- the change is routed downstream.

Then:

- it uses the appropriate evolution path without allowing an artifact to override another authority domain.

## Related Knowledge

- SOL-001#CAP-002 — Artifact resolution.
- SOL-002#CAP-001 — Shared guidance artifact provision.
- SOL-003#CAP-002 — Deliberate guidance authority.
- GOV-002#CON-003 — Durable source-of-truth boundaries.
