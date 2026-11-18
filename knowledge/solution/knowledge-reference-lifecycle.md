# Knowledge Reference Representation and Migration

> Design basis: project-owner decisions to use descriptive paths and object titles, extend contextual migration to document and object conflicts, retain no superseded files, and sequence design knowledge before artifacts before knowledge-format migration. [Descriptive headings determine object locators](#descriptive-headings-determine-object-locators) and [Conflict-aware mapping retains source provenance](#conflict-aware-mapping-retains-source-provenance) specify the design implemented by the Schema, templates, guide, and migration Skill. Knowledge objects use descriptive titles and derived anchors. Verification Items state expectations rather than completed evidence.

## Capabilities and Architecture

<a id="direct-knowledge-location"></a>

### Direct knowledge location

Represent documents by descriptive relative paths and independently referenced objects by descriptive title-derived locators, without document or object-number allocation.

#### Responsibilities

<a id="reference-representation-stewardship"></a>

##### Reference representation stewardship

Realizes: [Direct knowledge location](#direct-knowledge-location)

The project-local Schema defines link and anchor representation; selected templates and the agent guide teach it consistently. The existing agent host chooses coherent file boundaries, descriptive object titles, and unambiguous locators during reconciliation.

#### Components and Boundaries

- **The active Knowledge Schema, selected templates, and agent guide** are assigned-to [Reference representation stewardship](#reference-representation-stewardship); they are instruction artifacts, not an executing runtime. [Candidate artifact stewardship](default-artifacts.md#candidate-artifact-stewardship) owns their package distribution.
- **Existing agent hosts** interpret the guidance and edit files. Exact search and filesystem operations remain tool responsibilities.

<a id="semantic-reference-migration"></a>

### Semantic reference migration

Provide a dedicated user-invoked `migrate-references` Skill for preparing context-sensitive repository reference changes and verifying the realized migration.

#### Responsibilities

<a id="reference-context-assessment"></a>

##### Reference-context assessment

Realizes: [Semantic reference migration](#semantic-reference-migration)

The coordinating host agent establishes the selected change and repository boundary, inventories affected references with deterministic search tools, and delegates read-only contextual assessment to subagents. Each assessment returns the referring location, relied-on meaning, competing source versions or occurrences, supported replacement targets or proposed relationship removal, evidence, and unresolved ambiguity. Assessment covers document paths, object titles and normalized fragments, apparent semantic duplication, and contradictory claims. Search hits alone are not a semantic mapping.

<a id="reconciliation-handoff-and-completion-assessment"></a>

##### Reconciliation handoff and completion assessment

Realizes: [Semantic reference migration](#semantic-reference-migration)

The coordinator consolidates mappings without accepting them, checks source and target changes since assessment, and supplies the proposed knowledge delta to the normal independent reconciliation process. After accepted mappings are realized, it searches again and checks target resolution and semantic preservation, reporting incomplete work and search limits. Proposed mappings do not authorize arbitrary implementation or external edits.

#### Components and Boundaries

- **`.scaffold/skills/migrate-references/`** is the user-invoked instruction artifact assigned-to [Reference-context assessment](#reference-context-assessment) and [Reconciliation handoff and completion assessment](#reconciliation-handoff-and-completion-assessment). Its `agents/openai.yaml` enables normal workflow discovery through existing initialization integration.
- **The existing host agent and its subagents** execute adaptive assessment. Subagents inspect referring context, competing source content and provenance, and target content read-only; they do not concurrently edit shared knowledge or accept their own mappings.
- **Repository search and filesystem tools** enumerate occurrences, inspect exact paths and anchors, and apply authorized edits. They do not determine semantic replacement or supply a deterministic semantic validator.
- **The reconciliation coordinator's handoff** feeds [Project Knowledge reconciliation](change-lifecycle-and-methods.md#project-knowledge-reconciliation). A workflow Skill does not invoke another workflow Skill: it returns the proposed delta for routing, and the accepted result returns as input to realization and completion assessment. Unavailable subagents or independent review leave that step incomplete; the Skill must not silently substitute self-review.

## Satisfies

- [Direct knowledge location](#direct-knowledge-location) satisfies [Descriptive knowledge-object location](../problem/knowledge-reference-lifecycle.md#descriptive-knowledge-object-location).
- [Semantic reference migration](#semantic-reference-migration) satisfies [Meaning-preserving repository reference migration](../problem/knowledge-reference-lifecycle.md#meaning-preserving-repository-reference-migration) and [Evidence-based document and object conflict resolution](../problem/knowledge-reference-lifecycle.md#evidence-based-document-and-object-conflict-resolution).

## Design and Decisions

The entries in this section are Decisions; explicitly superseded entries remain historical.

<a id="superseded-paths-with-stable-numeric-object-anchors"></a>

### Superseded: paths with stable numeric object anchors

Superseded by [Descriptive headings determine object locators](#descriptive-headings-determine-object-locators). The previous representation removed document IDs but retained local numeric object IDs and title-independent anchors. Its allocation and rename behavior are historical; the selected target derives object locators from descriptive titles and migrates references when titles change.

<a id="contextual-migration-without-retained-obsolete-files"></a>

### Contextual migration without retained obsolete files

Use `migrate-references` when an intended file or object rename, reorganization, or collision requires repository reference repair. Apply the conflict assessment in [Conflict-aware mapping retains source provenance](#conflict-aware-mapping-retains-source-provenance) before choosing mappings. Discover references to old paths, legacy document IDs when applicable, anchors, and material textual mentions; inspect referring context and incoming and outgoing links. Exclude dependency directories, Git internals, historical package archives, and generated artifacts from active-source repair, and report exclusions. Recheck search errors and coverage before claiming an inventory is complete.

Subagent assignments partition assessment by referring file to avoid conflicting interpretations of a shared paragraph. A move may permit an exact path substitution; splits and merges require meaning-based selection, possibly one-to-many mappings. A removed obligation may require retiring a relationship and revising its referring statement instead of choosing another target. Unsupported or ambiguous choices need owner direction through reconciliation. Revalidate assessed file content before applying mappings; concurrent source or target edits invalidate affected assessments.

After accepted changes are applied, remove obsolete files, keep no superseded files or redirect stubs, and inspect the resulting diff plus repository references again. Valid file and anchor resolution is necessary but does not establish semantic correctness; independent knowledge review remains required. External consumers are outside the repository repair boundary and must be reported as a limitation, not silently preserved through redirect files. Source history remains in Git rather than in active duplicate files.

<a id="design-implementation-then-representation-migration"></a>

### Design, implementation, then representation migration

First reconcile the selected descriptive-title and conflict-handling design plus [its represented-field mapping](../governance/reference-representation-migration.md#numeric-local-objects-to-descriptive-title-derived-locators), retaining the current knowledge format during that review. Second update Schema, selected templates, guide, `migrate-references` Skill, README, and affected verification. Third inventory each current path, object ID, title, and source occurrence before converting knowledge: remove numeric object prefixes, derive descriptive anchors, repair local and cross-document references, and independently review against the target Schema. Preserve unaffected meanings, Model ownership, and existing lean structure. The earlier document-ID conversion is recorded as historical mapping [Document-ID locators to relative paths and local anchors](../governance/reference-representation-migration.md#document-id-locators-to-relative-paths-and-local-anchors) in the same Crosswalk.

This is a bounded migration with one active Schema and no legacy compatibility mode. Activating the target artifact does not make both source and target Schemas authoritative. Use the source inventory to support location changes; changed meanings, duplicate titles, or fragment collisions require contextual assessment. Keep no old numeric or title aliases, superseded files, or redirect stubs. Do not report completion while artifacts, knowledge representation, and relationships disagree. The Crosswalk records field dispositions and does not authorize automatic semantic rewriting.

<a id="descriptive-headings-determine-object-locators"></a>

### Descriptive headings determine object locators

Use descriptive headings without allocated numeric or opaque object IDs. Cross-document links combine a relative file path with the descriptive title-derived fragment; same-document relationships use the title with a local fragment link when precise location is needed. Whole-document links omit the fragment. Object kind remains clear from its section or an explicit concept label where necessary, preserving Requirement/Acceptance-Criterion ownership and Capability/Responsibility distinctions.

For a referenceable object, derive the fragment from its plain-text title: normalize Unicode to NFC, lowercase, retain Unicode letters, combining marks, numbers, whitespace, hyphens and underscores, remove other punctuation and symbols, trim surrounding whitespace, then replace each remaining whitespace run with one hyphen. The result must be nonempty. Use an explicit HTML anchor with that derived value immediately before the heading so resolution does not depend on a renderer's implicit slug rules. For example, `Preserve accepted work` derives `preserve-accepted-work`; `保留已接受的工作` retains its descriptive Unicode characters. The anchor is a derived locator, not a separately allocated stable identity.

A title change regenerates its derived anchor and repairs affected local and cross-document references, even when meaning is unchanged. Do not keep numeric anchors or old-title aliases. Referenceable titles and derived fragments must be unambiguous within the document; normalization can make different title spellings collide. Inspect other explicit or rendered section targets when confirming unambiguous navigation. Identical titles in different files remain distinguishable by path. Use meaningful descriptive disambiguation for distinct objects rather than renderer-assigned or order-dependent numeric suffixes.

This choice makes locators readable and searchable while removing number-allocation coordination. It accepts reference-repair work on title changes, including case or punctuation changes that affect the chosen fragment. Search finds candidates but cannot establish semantic equivalence. The Knowledge Model and its relationships remain unchanged; [the represented-field Crosswalk](../governance/reference-representation-migration.md#numeric-local-objects-to-descriptive-title-derived-locators) records this Schema migration.

<a id="conflict-aware-mapping-retains-source-provenance"></a>

### Conflict-aware mapping retains source provenance

Extend the existing `migrate-references` Skill at both document and object levels. A document conflict may be competing contents at one path or an apparently duplicated subject at different paths. An object conflict may be the same title or normalized fragment for different content, equivalent content under different titles, or contradictory claims. Name equality and search similarity do not establish equivalent meaning; distinct locators do not prove distinct knowledge.

Before selecting a target, inspect competing contents, the accepted Git baseline, available branch or version evidence, and the specific source occurrence or version each referring statement relied on. A collision can make the old path or fragment insufficient as a mapping key. Read-only subagent assessments retain that provenance and offer evidence-backed descriptive disambiguation, consolidation of equivalent meaning, retention of distinct objects, or relationship retirement. Consolidation preserves applicable obligations and relationships, rather than merely deleting repeated text. Referring contexts may need different targets even when their old locator strings match.

The host consolidates proposed mappings and hands Project Knowledge changes to independent reconciliation; the Skill neither invokes another workflow nor accepts its own resolution. Owner direction is required when evidence cannot settle materially different meanings or referring intent. Do not overwrite one candidate, prefer the newest version by default, merge solely by name, or invent numbered suffixes as resolution. Recheck assessed source and target contents immediately before application and invalidate stale mappings. Exact search and link inspection stay tool responsibilities; semantic classification and resolution stay with the Skill-guided host and subagents. No new runtime or deterministic semantic validator is introduced.

## Verification Items

<a id="superseded-title-independent-object-navigation"></a>

### Superseded: title-independent object navigation

Historical expectation for superseded [Superseded: title-independent object navigation](../problem/knowledge-reference-lifecycle.md#superseded-title-independent-object-navigation). Replaced by [Descriptive rename navigation](#descriptive-rename-navigation), which verifies rename-driven reference repair.

<a id="superseded-independent-numeric-object-namespaces"></a>

### Superseded: independent numeric object namespaces

Historical expectation for superseded [Superseded: independent files with numeric local objects](../problem/knowledge-reference-lifecycle.md#superseded-independent-files-with-numeric-local-objects). Replaced by [Descriptive creation without allocated numbers](#descriptive-creation-without-allocated-numbers), which verifies descriptive creation without document or object-number allocation.

<a id="contextual-move-split-and-merge-assessment"></a>

### Contextual move, split, and merge assessment

Verifies:

- [Reorganization repairs references according to context](../problem/knowledge-reference-lifecycle.md#reorganization-repairs-references-according-to-context).

Scope:

- Skill-guided host/subagent interaction using real repository search and file inspection.

Expected evidence:

- read-only subagent mappings distinguish referring meanings during a rename, move, split, or merge; after reconciliation and realization, incoming and outgoing links resolve to justified targets and no obsolete file or redirect stub remains. Skill text alone is not evidence that this interaction succeeded.

<a id="ambiguity-and-stale-assessments-remain-incomplete"></a>

### Ambiguity and stale assessments remain incomplete

Verifies:

- [Missing targets and concurrent changes prevent false completion](../problem/knowledge-reference-lifecycle.md#missing-targets-and-concurrent-changes-prevent-false-completion).

Scope:

- Skill-guided handling of removed targets, ambiguity, concurrent edits, and scope limits.

Expected evidence:

- a missing or ambiguous replacement is not guessed; a concurrent edit triggers reassessment; owner decisions or unresolved work are reported explicitly, including unavailable external consumers and search exclusions.

<a id="descriptive-rename-navigation"></a>

### Descriptive rename navigation

Verifies:

- [A title rename repairs descriptive references](../problem/knowledge-reference-lifecycle.md#a-title-rename-repairs-descriptive-references).

Scope:

- title-derived locators and affected local and cross-document references.

Expected evidence:

- the old and new title mapping preserves object meaning, links resolve to the new descriptive fragment, and old numeric or title aliases are absent.

<a id="descriptive-creation-without-allocated-numbers"></a>

### Descriptive creation without allocated numbers

Verifies:

- [Independent creation needs no numeric allocation](../problem/knowledge-reference-lifecycle.md#independent-creation-needs-no-numeric-allocation).

Scope:

- creation guidance and reconciliation of title-derived object locations.

Expected evidence:

- different documents can use the same object title, distinct objects are located without allocated IDs, and within-document collisions are resolved before acceptance.

<a id="document-conflict-assessment"></a>

### Document-conflict assessment

Verifies:

- [Document conflicts preserve source meaning](../problem/knowledge-reference-lifecycle.md#document-conflicts-preserve-source-meaning).

Scope:

- real Skill-guided host/subagent assessment of competing file contents and referring contexts.

Expected evidence:

- mappings retain source-version provenance and distinguish same-path different subjects from evidence-supported duplicate subjects at different paths; neither version is silently overwritten.

<a id="object-conflict-assessment"></a>

### Object-conflict assessment

Verifies:

- [Object collisions are resolved by meaning](../problem/knowledge-reference-lifecycle.md#object-collisions-are-resolved-by-meaning).

Scope:

- real Skill-guided host/subagent assessment of title or fragment collisions and semantic duplicates.

Expected evidence:

- distinct meanings receive descriptive disambiguation, equivalence-based consolidation retains relationships, and per-reference mappings do not depend on first match or generated numeric suffixes.

<a id="unresolved-conflict-handling"></a>

### Unresolved conflict handling

Verifies:

- [Contradictions and ambiguous provenance block acceptance](../problem/knowledge-reference-lifecycle.md#contradictions-and-ambiguous-provenance-block-acceptance).

Scope:

- Skill-guided assessment, reconciliation handoff, and stale source or target detection.

Expected evidence:

- evidence gaps and competing claims produce concrete alternatives for owner direction without guessed acceptance; material source or target changes trigger reassessment. Written guidance alone does not demonstrate this adaptive behavior.
