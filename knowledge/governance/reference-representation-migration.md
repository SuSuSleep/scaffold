# Reference Representation Migration Crosswalk

## Purpose

Record the deliberate represented-field migration selected by the project owner on 2026-11-18: document-ID references become relative file links while document-local object IDs remain. This Crosswalk satisfies [REQ-015](../problem/knowledge-authority-and-customization.md#req-015) and constrains [DEC-003](../solution/knowledge-reference-lifecycle.md#dec-003). It supplies mapping decisions, not a second active Schema or authority to infer changed obligations.

## Applies When

Migrating this repository's existing knowledge after the non-knowledge implementation of [DEC-008 — Relative-path references with local object anchors](../solution/default-artifacts.md#dec-008).

## Does Not Normally Apply When

Only descriptive wording changes, or a project uses a different Schema without adopting this target. Future semantic splits and merges require their own contextual mapping rather than treating this equivalent-location mapping as authorization.

## Records

<a id="map-001"></a>

### MAP-001 — Document-ID locators to relative paths and local anchors

Source Model:

- Default Knowledge Model at `.scaffold/knowledge-model.md`; unchanged by this representation migration.

Target Model:

- The same Default Knowledge Model; no concepts or relationships are replaced.

Source Schema:

- Default Knowledge Schema at `.scaffold/knowledge-schema.md`, source snapshot inspected 2026-11-18 before this proposal's artifact implementation, SHA-256 `8cbee397a974bf3862d45b71e9eccfa014da16b756921f5f737a8e5df4bad132`. It includes the existing lean-template changes and uses `Document ID:` declarations plus `<DOCUMENT_ID>#<OBJECT_ID>` references.

Target Schema:

- Default Knowledge Schema at the same path, target representation selected by [DEC-008](../solution/default-artifacts.md#dec-008) and [DEC-001](../solution/knowledge-reference-lifecycle.md#dec-001) on 2026-11-18, implemented artifact SHA-256 `c7a7e623f5334b80d2cbf28a0e87bd11376267ff9658a36e96ed4ec6d3a091a6`. This project-local artifact is the active Schema; the source snapshot is retained only as migration evidence.

Mapping kind:

- equivalent

Source:

- Document identity declarations, whole-document ID mentions, qualified document/object locators, and the local object IDs used in headings and same-document references.

Target:

- Remove document-ID declarations. Resolve former document IDs to their actual retained file paths. Use relative Markdown links from each referring file, omit fragments for whole documents, and use explicit lowercase local-ID anchors for object targets. Preserve existing local object IDs and descriptive titles unless a separately reconciled semantic change requires otherwise.

Cardinality:

- one-to-one for each retained document and knowledge object in this format migration; this mapping does not authorize splitting, merging, or retiring their meaning.

Identity and references:

- Preserve each retained object's semantic identity and document-local ID. Replace its document-ID locator with the actual file location and explicit anchor; do not infer a filename from an ID. Reference labels remain readable semantic context. The source declarations must be inventoried before removal, and all material qualified and whole-document references must be accounted for. Any reorganization or local-ID collision requires a separately reviewed contextual mapping under [DEC-002](../solution/knowledge-reference-lifecycle.md#dec-002).

Migration disposition:

- Reconcile design first, realize non-knowledge changes second, and migrate knowledge format last. Deliberately apply the supported location mapping and inspect resulting links and relationships. Keep no superseded files or redirect stubs; Git retains source history. External consumers are outside the repository repair boundary.

Review:

- Owner selected the target and execution order on 2026-11-18. The mapping preserves concept meanings and local object identity; no unresolved representation choice is intentionally deferred. Migration completion and verification require separate evidence and are not implied by the mapping decision.

## Verification

- Confirm every migrated reference retains its supported target meaning, relative base, and existing local ID; check object fragments against explicit anchors.
- Review removal of document-ID declarations only after all relevant source locators have been accounted for.
- Use [VER-001](../solution/knowledge-reference-lifecycle.md#ver-001) and [VER-002](../solution/knowledge-reference-lifecycle.md#ver-002) for the target representation, and [VER-003](../solution/knowledge-reference-lifecycle.md#ver-003) and [VER-004](../solution/knowledge-reference-lifecycle.md#ver-004) when reorganization needs contextual migration. These are evidence expectations, not completed evidence.

## Related Knowledge

- [REQ-015 — Deliberate Knowledge Model migration mapping](../problem/knowledge-authority-and-customization.md#req-015).
- [REQ-001 — Direct and precise knowledge references](../problem/knowledge-reference-lifecycle.md#req-001).
- [DEC-008 — Relative-path references with local object anchors](../solution/default-artifacts.md#dec-008).
- [DEC-003 — Design, implementation, then representation migration](../solution/knowledge-reference-lifecycle.md#dec-003).
