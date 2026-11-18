# Knowledge Reference Lifecycle

## Intent

Maintainers and coding agents need to locate precise knowledge directly and preserve the meaning of its references when documents are reorganized. Readers should be able to search and understand descriptive document and object locators without coordinating numeric allocation. Independent work must still reconcile naming and meaning conflicts. Reference repair is deliberate repository work; external consumers are outside its repair boundary.

## Requirements

<a id="superseded-direct-and-precise-knowledge-references"></a>

### Superseded: direct and precise knowledge references

Superseded by [Descriptive knowledge-object location](#descriptive-knowledge-object-location). This historical obligation required a title-independent object locator; title changes now require explicit reference migration rather than a preserved numeric identity.

<a id="meaning-preserving-repository-reference-migration"></a>

### Meaning-preserving repository reference migration

When documents or independently referenced objects are renamed, moved, split, merged, or removed, the Harness must support identifying affected repository references and reviewing each reference's intended meaning before selecting replacement targets, changing the referring statement, or removing an obsolete relationship. It must account for outgoing references whose relative base changes, same-document references affected by title changes, and incoming references. Collision repair must preserve which source version or occurrence a referring statement relied on; an ambiguous old locator alone must not select a replacement. Ambiguous or unsupported mappings and stale results caused by concurrent edits must remain unresolved until evidence or owner direction resolves them; no guessed replacement may be accepted. A completed migration must leave applicable repository references valid and semantically justified, remove obsolete files, and retain no superseded files or redirect stubs. Completion must state the searched scope and any inaccessible or external references; it must not claim to repair external consumers.

Relationships:

- Satisfied-by: [Semantic reference migration](../solution/knowledge-reference-lifecycle.md#semantic-reference-migration).
- Related-to: [Independently reconciled Project Knowledge](change-lifecycle-and-reconciliation.md#independently-reconciled-project-knowledge).

<a id="descriptive-knowledge-object-location"></a>

### Descriptive knowledge-object location

The default representation must locate independently referenced knowledge objects through descriptive titles within descriptive document paths, without separately allocated document or object numbers. A reader must be able to search the title and distinguish its object within the containing document. Title and locator changes must be reconciled with affected references while preserving supported meaning. The same title may occur in different documents; referenceable object locators within one document must be unambiguous after parallel changes are reconciled.

Relationships:

- Satisfied-by: [Direct knowledge location](../solution/knowledge-reference-lifecycle.md#direct-knowledge-location).
- [Descriptive knowledge-object location](#descriptive-knowledge-object-location) supersedes [Superseded: direct and precise knowledge references](#superseded-direct-and-precise-knowledge-references).

<a id="evidence-based-document-and-object-conflict-resolution"></a>

### Evidence-based document and object conflict resolution

The reference-maintenance workflow must assess both document conflicts and object conflicts. It must distinguish a shared locator for different meanings, duplicate representations of the same meaning, and contradictory claims. Equivalent meaning may be consolidated only with evidence and preserved relationships; different meanings must remain distinguishable. A material contradiction or uncertain referring intent must be resolved through authoritative evidence or owner direction before acceptance. The workflow must not silently overwrite one version, select the newest version, merge by name alone, or assign order-dependent numeric suffixes as a semantic resolution.

Relationships:

- Satisfied-by: [Semantic reference migration](../solution/knowledge-reference-lifecycle.md#semantic-reference-migration).
- Related-to: [Independently reconciled Project Knowledge](change-lifecycle-and-reconciliation.md#independently-reconciled-project-knowledge).

## Acceptance Criteria

<a id="superseded-title-independent-object-navigation"></a>

### Superseded: title-independent object navigation

Historical acceptance scenario for superseded [Superseded: direct and precise knowledge references](#superseded-direct-and-precise-knowledge-references). Replaced by [A title rename repairs descriptive references](#a-title-rename-repairs-descriptive-references); a title-only change now repairs the locator and references.

<a id="superseded-independent-files-with-numeric-local-objects"></a>

### Superseded: independent files with numeric local objects

Historical acceptance scenario for superseded [Superseded: direct and precise knowledge references](#superseded-direct-and-precise-knowledge-references). Replaced by [Independent creation needs no numeric allocation](#independent-creation-needs-no-numeric-allocation), which requires no separate document or object-number allocation.

<a id="reorganization-repairs-references-according-to-context"></a>

### Reorganization repairs references according to context

For:

- [Meaning-preserving repository reference migration](#meaning-preserving-repository-reference-migration).

Given:

- a selected document or object is renamed, moved, split, or merged, and repository references depend on different parts of its meaning.

When:

- a reference migration completes.

Then:

- each affected reference points to the justified replacement object or document, including multiple targets when necessary;
- outgoing relative references resolve from the new containing file;
- referring statements retain their intended supported meaning; and
- obsolete files and redirect stubs are absent.

<a id="missing-targets-and-concurrent-changes-prevent-false-completion"></a>

### Missing targets and concurrent changes prevent false completion

For:

- [Meaning-preserving repository reference migration](#meaning-preserving-repository-reference-migration).

Given:

- a former target has no supported replacement, its replacement is ambiguous, or a reviewed source has changed concurrently.

When:

- migration evaluates the affected reference.

Then:

- it does not silently redirect the reference or reuse stale conclusions;
- it obtains evidence or owner direction to revise or retire the relationship, or reports that migration remains incomplete;
- materially changed sources are reassessed before acceptance; and
- its report identifies repository search limits and external references without promising external repair.

<a id="a-title-rename-repairs-descriptive-references"></a>

### A title rename repairs descriptive references

For:

- [Descriptive knowledge-object location](#descriptive-knowledge-object-location).

Given:

- local and cross-document references locate an object by its descriptive title.

When:

- that title changes without changing the object's meaning and the reference migration completes.

Then:

- the object has the new descriptive locator, and all applicable repository references locate it with supported meaning preserved;
- the old object number or title locator is not retained as an alias; and
- a reader can search the new title and directly identify the target.

<a id="independent-creation-needs-no-numeric-allocation"></a>

### Independent creation needs no numeric allocation

For:

- [Descriptive knowledge-object location](#descriptive-knowledge-object-location).

Given:

- agents independently create different documents or distinct objects, including the same descriptive title in different documents.

When:

- their changes are reconciled.

Then:

- no shared document or object-number allocator is needed;
- each reference identifies the intended document and descriptive object location; and
- any conflicting location within a document is resolved before acceptance rather than relying on insertion order.

<a id="document-conflicts-preserve-source-meaning"></a>

### Document conflicts preserve source meaning

For:

- [Evidence-based document and object conflict resolution](#evidence-based-document-and-object-conflict-resolution).

Given:

- competing changes use the same document path for different subjects, or different paths appear to duplicate one subject, and referring statements depend on their content.

When:

- the workflow assesses the conflict.

Then:

- it examines the competing contents and their baseline or version provenance;
- it proposes distinct descriptive locations for distinct meanings or consolidation justified by equivalence, with per-reference mappings; and
- it does not overwrite a version or equate subjects solely from matching paths or similar names.

<a id="object-collisions-are-resolved-by-meaning"></a>

### Object collisions are resolved by meaning

For:

- [Evidence-based document and object conflict resolution](#evidence-based-document-and-object-conflict-resolution).

Given:

- one document contains competing object titles or titles that produce the same locator, or differently named objects appear to duplicate meaning.

When:

- the workflow assesses the conflict.

Then:

- it distinguishes collision from semantic equivalence;
- distinct objects receive descriptive disambiguation and equivalent objects are consolidated only when justified;
- each affected reference is mapped using its relied-on meaning and source occurrence; and
- no arbitrary numeric suffix or first matching heading silently decides the target.

<a id="contradictions-and-ambiguous-provenance-block-acceptance"></a>

### Contradictions and ambiguous provenance block acceptance

For:

- [Evidence-based document and object conflict resolution](#evidence-based-document-and-object-conflict-resolution).

Given:

- competing document or object claims contradict each other, or a shared old locator does not establish which source a referring statement intended.

When:

- the workflow cannot resolve the difference from authoritative evidence.

Then:

- it reports the competing meanings and viable alternatives for owner direction through reconciliation;
- it accepts no guessed mapping or automatic newest-version choice; and
- changed source or target content requires reassessment before the mapping can be accepted.
