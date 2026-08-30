# Knowledge Authority and Customization

Document ID: PROB-002

## Intent

Scaffold must let projects customize knowledge and operational guidance deliberately without implicitly combining incompatible sources of authority.

## Actors and Goals

- **Project owner**: replace full-replacement artifacts and evolve Project Rules as the project matures.
- **Developer or coding agent**: resolve the active knowledge and guidance authorities correctly before meaningful work.

## Use Cases

- A project supplies a local replacement for a shared artifact and Scaffold resolves it.
- Scaffold resolves shared and local Project Rules into the active Rule collection.
- A project routes an accepted artifact change through the appropriate evolution Workflow.

## Requirements

### REQ-002 — Explicit artifact resolution

Each project-local Knowledge Model, Knowledge Schema, Skill, or Template is authoritative in full; shared and local content must not be implicitly merged. The active Model is the sole authority for concept and relationship meaning; the active Schema defines only representation.

### REQ-003 — Replaceable knowledge model

The installed default Knowledge Model is used when no local Model exists. `.scaffold/knowledge-model.md` fully replaces it when present; Knowledge Schema, Skills, and Templates use the same full-replacement behavior. Project Rules are extensible with atomic same-identity replacement.

### REQ-011 — Extensible Project Rule collection

The Harness must represent Project Rules as a categorized effective collection. Rules have stable identities and applicability; local Rules may add identities or atomically replace matching shared identities without content merge.

### REQ-013 — Authority-safe artifact evolution

The Harness must support deliberate evolution of full-replacement artifacts and route accepted changes to the appropriate downstream Workflow without allowing an artifact to override a different authority domain.

### REQ-015 — Deliberate Knowledge Model migration mapping

When a project replaces its Knowledge Model, the Harness must support a project-owned, reviewable crosswalk between source and target concepts or relationships. When a Schema replacement requires represented-field migration, the crosswalk must identify the source and target Schemas that own those fields. Every entry must state mapping kind, cardinality, identity and reference treatment, migration disposition, and unresolved ambiguity without making both Models active or automating semantic migration.

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

### AC-011 — The active Knowledge Model resolves explicitly

For:

- REQ-003 — Replaceable knowledge model

Given:

- a project has local Scaffold customizations.

When:

- an agent resolves knowledge semantics.

Then:

- it uses the project-local Knowledge Model when present, otherwise the installed default, without implicit content merging.

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

### AC-021 — Knowledge Model migration is mapped deliberately

For:

- REQ-015 — Deliberate Knowledge Model migration mapping

Given:

- a project replaces a Knowledge Model with concepts or relationships that require adaptation, or replaces a Schema with represented fields that require adaptation.

When:

- it prepares the migration.

Then:

- it records a reviewable crosswalk with source and target Models for semantic mappings and source and target Schemas for represented-field mappings, plus mapping kinds and cardinalities, identity and reference treatment, migration disposition, and unresolved ambiguity; no automatic semantic rewrite occurs.

## Related Knowledge

- SOL-001#CAP-002 — Artifact resolution.
- SOL-002#CAP-001 — Shared guidance artifact provision.
- SOL-003#CAP-002 — Deliberate guidance authority.
- SOL-003#CAP-003 — Deliberate model migration mapping.
- GOV-002#CON-003 — Durable source-of-truth boundaries.
