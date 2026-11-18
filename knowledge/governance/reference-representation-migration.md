# Reference Representation Migration Crosswalk

## Purpose

Record successive deliberate represented-field migrations: the historical removal of document IDs with retained numeric local objects, followed by the selected move from numeric objects to descriptive title-derived locators. This Crosswalk satisfies [Deliberate Knowledge Model migration mapping](../problem/knowledge-authority-and-customization.md#deliberate-knowledge-model-migration-mapping) and constrains [Design, implementation, then representation migration](../solution/knowledge-reference-lifecycle.md#design-implementation-then-representation-migration). It supplies mapping decisions, not a second active Schema or authority to infer changed obligations.

## Applies When

Migrating this repository's existing knowledge under the selected representation in [Descriptive document and object locations](../solution/default-artifacts.md#descriptive-document-and-object-locations), after its non-knowledge artifact implementation. [Document-ID locators to relative paths and local anchors](#document-id-locators-to-relative-paths-and-local-anchors) records the prior intermediate representation; [Numeric local objects to descriptive title-derived locators](#numeric-local-objects-to-descriptive-title-derived-locators) governs the selected title-derived target.

## Does Not Normally Apply When

Only body wording changes without changing a locator or meaning, or a project uses a different Schema without adopting the selected target. A descriptive title change does require reference repair under [Numeric local objects to descriptive title-derived locators](#numeric-local-objects-to-descriptive-title-derived-locators). Future semantic splits and merges require their own contextual mapping rather than treating this equivalent-location mapping as authorization.

## Records

<a id="document-id-locators-to-relative-paths-and-local-anchors"></a>

### Document-ID locators to relative paths and local anchors

Source Model:

- Default Knowledge Model at `.scaffold/knowledge-model.md`; unchanged by this representation migration.

Target Model:

- The same Default Knowledge Model; no concepts or relationships are replaced.

Source Schema:

- Default Knowledge Schema at `.scaffold/knowledge-schema.md`, source snapshot inspected 2026-11-18 before this proposal's artifact implementation, SHA-256 `8cbee397a974bf3862d45b71e9eccfa014da16b756921f5f737a8e5df4bad132`. It includes the existing lean-template changes and uses `Document ID:` declarations plus `<DOCUMENT_ID>#<OBJECT_ID>` references.

Target Schema:

- Default Knowledge Schema at the same path, target representation selected by [Superseded: relative paths with numeric object anchors](../solution/default-artifacts.md#superseded-relative-paths-with-numeric-object-anchors) and [Superseded: paths with stable numeric object anchors](../solution/knowledge-reference-lifecycle.md#superseded-paths-with-stable-numeric-object-anchors) on 2026-11-18, implemented artifact SHA-256 `c7a7e623f5334b80d2cbf28a0e87bd11376267ff9658a36e96ed4ec6d3a091a6`. This implemented intermediate representation is the source of [Numeric local objects to descriptive title-derived locators](#numeric-local-objects-to-descriptive-title-derived-locators). Its historical selection does not make it co-authoritative with a subsequently activated target.

Mapping kind:

- equivalent

Source:

- Document identity declarations, whole-document ID mentions, qualified document/object locators, and the local object IDs used in headings and same-document references.

Target:

- Remove document-ID declarations. Resolve former document IDs to their actual retained file paths. Use relative Markdown links from each referring file, omit fragments for whole documents, and use explicit lowercase local-ID anchors for object targets. Preserve existing local object IDs and descriptive titles unless a separately reconciled semantic change requires otherwise.

Cardinality:

- one-to-one for each retained document and knowledge object in this format migration; this mapping does not authorize splitting, merging, or retiring their meaning.

Identity and references:

- Preserve each retained object's semantic identity and document-local ID. Replace its document-ID locator with the actual file location and explicit anchor; do not infer a filename from an ID. Reference labels remain readable semantic context. The source declarations must be inventoried before removal, and all material qualified and whole-document references must be accounted for. Any reorganization or local-ID collision requires a separately reviewed contextual mapping under [Contextual migration without retained obsolete files](../solution/knowledge-reference-lifecycle.md#contextual-migration-without-retained-obsolete-files).

Migration disposition:

- Reconcile design first, realize non-knowledge changes second, and migrate knowledge format last. Deliberately apply the supported location mapping and inspect resulting links and relationships. Keep no superseded files or redirect stubs; Git retains source history. External consumers are outside the repository repair boundary.

Review:

- Owner selected the target and execution order on 2026-11-18. The mapping preserves concept meanings and local object identity; no unresolved representation choice is intentionally deferred. Migration completion and verification require separate evidence and are not implied by the mapping decision.

<a id="numeric-local-objects-to-descriptive-title-derived-locators"></a>

### Numeric local objects to descriptive title-derived locators

Source Model:

- Default Knowledge Model at `.scaffold/knowledge-model.md`; unchanged by this representation migration.

Target Model:

- The same Default Knowledge Model; concept meanings, relationships, and ownership invariants are preserved.

Source Schema:

- Default Knowledge Schema at `.scaffold/knowledge-schema.md` in accepted Git baseline `52023626d318e1baeeb46634b67bd5702ce7c305`, SHA-256 `c7a7e623f5334b80d2cbf28a0e87bd11376267ff9658a36e96ed4ec6d3a091a6`. It uses relative file links, numeric document-local object headings, and explicit lowercase local-ID anchors.

Target Schema:

- Default Knowledge Schema at the same path, title-derived representation specified by [Descriptive document and object locations](../solution/default-artifacts.md#descriptive-document-and-object-locations) and [Descriptive headings determine object locators](../solution/knowledge-reference-lifecycle.md#descriptive-headings-determine-object-locators). Implemented artifact SHA-256 `222d28baa2bd416f460d616b0334cc8c15bed6de2294c28e1bd9e5ad180c5630`. This project-local artifact is the active Schema; the source snapshot remains migration evidence rather than a second active authority.

Mapping kind:

- equivalent

Source:

- Numeric object prefixes, local-ID anchors, same-document ID references, and object-ID labels or fragments in cross-document links.

Target:

- Descriptive headings without allocated object IDs, explicit descriptive anchors derived from plain-text titles using the selected normalization convention, and relative or same-document links whose labels and fragments locate the descriptive target. Whole-document relative paths remain unchanged. Section context or explicit concept labels preserve object kinds and ownership.

Cardinality:

- one-to-one for each retained meaning in this representation conversion. A title or normalized-fragment collision requires a separately reviewed contextual disambiguation; this field mapping alone does not authorize consolidating meanings. The [Phase-relevant guidance consumption Requirement](../problem/selective-guidance-consumption.md#phase-relevant-guidance-consumption) retains its body while its descriptive title distinguishes it from its document H1; no meanings are consolidated.

Identity and references:

- Inventory original path, ID, title, and source occurrence before removing numeric notation. Preserve each retained meaning and relationship rather than retaining its old numeric locator. Derive the descriptive fragment, repair incoming local and cross-document references, and keep no old numeric or title aliases. Future title changes require recomputing the descriptive locator and repairing affected fragments or reference labels. Competing meanings or ambiguous old locators are handled by [Conflict-aware mapping retains source provenance](../solution/knowledge-reference-lifecycle.md#conflict-aware-mapping-retains-source-provenance) with version or occurrence provenance.

Migration disposition:

- Reconcile design first, implement non-knowledge artifacts second, and convert existing knowledge last with independent review. Inspect normalized-title collisions before applying the mapping. Retain no superseded files or redirect stubs; external consumers remain outside repository repair. A semantic discrepancy returns to reconciliation rather than being hidden by format conversion.

Review:

- The project owner selected descriptive object titles and conflict-aware migration at document and object levels. The mapping changes representation without changing Model concepts or accepting unresolved knowledge contradictions. Actual realization and verification require separate evidence.

## Verification

- For historical [Document-ID locators to relative paths and local anchors](#document-id-locators-to-relative-paths-and-local-anchors), source and intermediate target identities retain their recorded Schema digests and field treatment.
- For [Numeric local objects to descriptive title-derived locators](#numeric-local-objects-to-descriptive-title-derived-locators), confirm retained target meanings, relative bases, Model ownership, and descriptive title-derived locators; old numeric notation is historical source evidence rather than a live alias.
- Inspect title and normalized-fragment collisions, and preserve version or occurrence provenance when a former locator is ambiguous.
- Use [Descriptive rename navigation](../solution/knowledge-reference-lifecycle.md#descriptive-rename-navigation) and [Descriptive creation without allocated numbers](../solution/knowledge-reference-lifecycle.md#descriptive-creation-without-allocated-numbers) for title-derived representation; [Document-conflict assessment](../solution/knowledge-reference-lifecycle.md#document-conflict-assessment), [Object-conflict assessment](../solution/knowledge-reference-lifecycle.md#object-conflict-assessment), and [Unresolved conflict handling](../solution/knowledge-reference-lifecycle.md#unresolved-conflict-handling) cover conflict assessment. These are expectations, not completed evidence.

## Related Knowledge

- [Deliberate Knowledge Model migration mapping](../problem/knowledge-authority-and-customization.md#deliberate-knowledge-model-migration-mapping).
- [Descriptive knowledge-object location](../problem/knowledge-reference-lifecycle.md#descriptive-knowledge-object-location).
- [Descriptive document and object locations](../solution/default-artifacts.md#descriptive-document-and-object-locations).
- [Design, implementation, then representation migration](../solution/knowledge-reference-lifecycle.md#design-implementation-then-representation-migration).
