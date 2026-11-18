# Knowledge Reference Representation and Migration

> Design basis: project-owner decisions on 2026-11-18 to remove document IDs, retain local object IDs, migrate references by context, retain no superseded files, and sequence design knowledge before implementation before knowledge-format migration. The representation artifacts and dedicated Skill implement this design; the Verification Items below state expectations and do not themselves claim completed verification.

## Capabilities and Architecture

<a id="cap-001"></a>

### CAP-001 — Direct knowledge location

Represent documents by their descriptive relative paths and independently managed objects by stable local anchors, without a repository-wide number allocator.

#### Responsibilities

<a id="resp-001"></a>

##### RESP-001 — Reference representation stewardship

Realizes: CAP-001

The project-local Schema defines link and anchor representation; selected templates and the agent guide teach it consistently. The existing agent host chooses coherent file boundaries and checks local identity during reconciliation.

#### Components and Boundaries

- **The active Knowledge Schema, selected templates, and agent guide** are assigned-to RESP-001; they are instruction artifacts, not an executing runtime. [RESP-001](default-artifacts.md#resp-001) owns their package distribution.
- **Existing agent hosts** interpret the guidance and edit files. Exact search and filesystem operations remain tool responsibilities.

<a id="cap-002"></a>

### CAP-002 — Semantic reference migration

Provide a dedicated user-invoked `migrate-references` Skill for preparing context-sensitive repository reference changes and verifying the realized migration.

#### Responsibilities

<a id="resp-002"></a>

##### RESP-002 — Reference-context assessment

Realizes: CAP-002

The coordinating host agent establishes the selected change and repository boundary, inventories affected references with deterministic search tools, and delegates read-only contextual assessment to subagents. Each assessment returns the referring location, relied-on meaning, supported replacement targets or proposed relationship removal, evidence, and unresolved ambiguity. Search hits alone are not a semantic mapping.

<a id="resp-003"></a>

##### RESP-003 — Reconciliation handoff and completion assessment

Realizes: CAP-002

The coordinator consolidates mappings without accepting them, checks source changes since assessment, and supplies the proposed knowledge delta to the normal independent reconciliation process. After accepted mappings are realized, it searches again and checks target resolution and semantic preservation, reporting incomplete work and search limits. Proposed mappings do not authorize arbitrary implementation or external edits.

#### Components and Boundaries

- **`.scaffold/skills/migrate-references/`** is the user-invoked instruction artifact assigned-to RESP-002 and RESP-003. Its `agents/openai.yaml` enables normal workflow discovery through existing initialization integration.
- **The existing host agent and its subagents** execute adaptive assessment. Subagents inspect referring context and target content read-only; they do not concurrently edit shared knowledge or accept their own mappings.
- **Repository search and filesystem tools** enumerate occurrences, inspect exact paths and anchors, and apply authorized edits. They do not determine semantic replacement or supply a deterministic semantic validator.
- **The reconciliation coordinator's handoff** feeds [CAP-004 — Project Knowledge reconciliation](change-lifecycle-and-methods.md#cap-004). A workflow Skill does not invoke another workflow Skill: it returns the proposed delta for routing, and the accepted result returns as input to realization and completion assessment. Unavailable subagents or independent review leave that step incomplete; the Skill must not silently substitute self-review.

## Satisfies

- CAP-001 satisfies [REQ-001 — Direct and precise knowledge references](../problem/knowledge-reference-lifecycle.md#req-001).
- CAP-002 satisfies [REQ-002 — Meaning-preserving repository reference migration](../problem/knowledge-reference-lifecycle.md#req-002).

## Design and Decisions

<a id="dec-001"></a>

### DEC-001 — Paths locate documents; local anchors locate objects

Cross-document references use Markdown links resolved relative to the referring file, such as `[REQ-001 — Preserve accepted work](../problem/task-recovery.md#req-001)`. Whole-document links omit the fragment. Retain typed numeric object IDs within each document; ordinary explanatory text needs none. Place an explicit lowercase HTML anchor immediately before every identified object's heading, such as `<a id="req-001"></a>`, so a title edit does not alter its target. Within a document, a local ID or `#req-001` link suffices. Preserve object IDs when meaning remains the same; changing semantic identity requires a new local ID.

Remove `Document ID:` declarations and typed document namespaces from the default representation. Descriptive filenames make locations readable and avoid shared document-counter allocation, but paths change when files move. Agents must search for existing subjects before creation and reconcile conflicting paths or duplicate knowledge. Concurrent edits to one document require one writer at a time or a reconciliation of local-ID allocations against the latest file; neither a free number nor a pathname is a reservation. Moving an object to a new document changes its full locator, and a merge that collides local IDs requires deliberate reassignment and reference repair.

Keyword IDs would still permit collisions and tie identity to mutable wording; search alone would not preserve exact acceptance and verification relationships. Relative paths plus local anchors retain direct navigation at the cost of explicit migration when document boundaries change. This changes Schema representation, not Knowledge Model semantics.

<a id="dec-002"></a>

### DEC-002 — Contextual migration without retained obsolete files

Use `migrate-references` when an intended file or object reorganization requires repository reference repair. Discover references to old paths, legacy document IDs when applicable, anchors, and material textual mentions; inspect referring context and incoming and outgoing links. Exclude dependency directories, Git internals, historical package archives, and generated artifacts from active-source repair, and report exclusions. Recheck search errors and coverage before claiming an inventory is complete.

Subagent assignments partition assessment by referring file to avoid conflicting interpretations of a shared paragraph. A move may permit an exact path substitution; splits and merges require meaning-based selection, possibly one-to-many mappings. A removed obligation may require retiring a relationship and revising its referring statement instead of choosing another target. Unsupported or ambiguous choices need owner direction through reconciliation. Revalidate assessed file content before applying mappings; concurrent edits invalidate affected assessments.

After accepted changes are applied, remove obsolete files, keep no superseded files or redirect stubs, and inspect the resulting diff plus repository references again. Valid file and anchor resolution is necessary but does not establish semantic correctness; independent knowledge review remains required. External consumers are outside the repository repair boundary and must be reported as a limitation, not silently preserved through redirect files. Source history remains in Git rather than in active duplicate files.

<a id="dec-003"></a>

### DEC-003 — Design, implementation, then representation migration

First reconcile this target design and the represented-field mapping in [Reference Representation Migration Crosswalk](../governance/reference-representation-migration.md) while retaining the current knowledge format. Second update non-knowledge implementation: Schema, templates, guide, `migrate-references` Skill and discovery interface, CLI retirement in [DEC-008](cli-and-guidance.md#dec-008), README, and relevant verification. The source snapshot recorded by [Reference Representation Migration Crosswalk](../governance/reference-representation-migration.md) remains the evidence for the retiring representation; activating the target Schema does not make both Schemas authoritative. Third deliberately migrate existing knowledge: add stable local anchors, convert qualified document-ID references to relative Markdown links from each referring file, convert meaningful whole-document mentions, remove document-ID declarations, and independently review the result against the target Schema. Preserve existing unrelated lean-template changes and all unaffected semantics.

The transition is a bounded migration with one active Schema and no legacy compatibility mode. Record the old document-to-path inventory before removing declarations. Use it as evidence for mechanical location changes; changed meaning or document boundaries still require contextual assessment. Do not report the change complete while active artifacts and knowledge disagree. [Reference Representation Migration Crosswalk](../governance/reference-representation-migration.md) identifies the source and target Schema representations and the field dispositions; no concept-migration crosswalk or automatic semantic rewrite is implied.

## Verification Items

<a id="ver-001"></a>

### VER-001 — Title-independent object navigation

Verifies:

- [AC-001 — An object remains directly locatable after a title edit](../problem/knowledge-reference-lifecycle.md#ac-001).

Scope:

- relative link and explicit local-anchor representation.

Expected evidence:

- an object link resolves to the same local anchor before and after a title-only edit; whole-document links also resolve without a document-ID lookup.

<a id="ver-002"></a>

### VER-002 — Independent document creation

Verifies:

- [AC-002 — Independent files need no document-number allocation](../problem/knowledge-reference-lifecycle.md#ac-002).

Scope:

- default creation guidance and reconciliation of local namespaces.

Expected evidence:

- independent files may share local IDs without a global counter; conflicting paths and shared-file duplicate IDs are identified and reconciled rather than accepted as unique.

<a id="ver-003"></a>

### VER-003 — Contextual move, split, and merge assessment

Verifies:

- [AC-003 — Reorganization repairs references according to context](../problem/knowledge-reference-lifecycle.md#ac-003).

Scope:

- Skill-guided host/subagent interaction using real repository search and file inspection.

Expected evidence:

- read-only subagent mappings distinguish referring meanings during a move, split, or merge; after reconciliation and realization, incoming and outgoing links resolve to justified targets and no obsolete file or redirect stub remains. Skill text alone is not evidence that this interaction succeeded.

<a id="ver-004"></a>

### VER-004 — Ambiguity and stale assessments remain incomplete

Verifies:

- [AC-004 — Missing targets and concurrent changes prevent false completion](../problem/knowledge-reference-lifecycle.md#ac-004).

Scope:

- Skill-guided handling of removed targets, ambiguity, concurrent edits, and scope limits.

Expected evidence:

- a missing or ambiguous replacement is not guessed; a concurrent edit triggers reassessment; owner decisions or unresolved work are reported explicitly, including unavailable external consumers and search exclusions.
