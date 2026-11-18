# Knowledge Reference Lifecycle

## Intent

Maintainers and coding agents need to locate precise knowledge directly and preserve the meaning of its references when documents are reorganized. Independent work on different documents should not require a shared document-number counter. Reference repair is deliberate repository work; external consumers are outside its repair boundary.

## Requirements

<a id="req-001"></a>

### REQ-001 — Direct and precise knowledge references

The default representation must let a reader directly locate a referenced document or independently referenced knowledge object. Editing an object's descriptive title without changing its meaning must preserve its locator. Creating distinct documents must not require coordinated document-number allocation. Local object identity must remain unambiguous within each containing document, including after parallel edits are reconciled.

Relationships:

- Satisfied-by: [CAP-001 — Direct knowledge location](../solution/knowledge-reference-lifecycle.md#cap-001).

<a id="req-002"></a>

### REQ-002 — Meaning-preserving repository reference migration

When documents or independently referenced objects move, split, merge, or are removed, the Harness must support identifying affected repository references and reviewing each reference's intended meaning before selecting replacement targets, changing the referring statement, or removing an obsolete relationship. It must account for outgoing references whose relative base changes as well as incoming references. Ambiguous or unsupported mappings and stale results caused by concurrent edits must remain unresolved until evidence or owner direction resolves them; no guessed replacement may be accepted. A completed migration must leave applicable repository references valid and semantically justified, remove obsolete files, and retain no superseded files or redirect stubs. Completion must state the searched scope and any inaccessible or external references; it must not claim to repair external consumers.

Relationships:

- Satisfied-by: [CAP-002 — Semantic reference migration](../solution/knowledge-reference-lifecycle.md#cap-002).
- Related-to: [REQ-014 — Independently reconciled Project Knowledge](change-lifecycle-and-reconciliation.md#req-014).

## Acceptance Criteria

<a id="ac-001"></a>

### AC-001 — An object remains directly locatable after a title edit

For:

- REQ-001 — Direct and precise knowledge references.

Given:

- a document refers to an independently identified object in another document.

When:

- the object's descriptive title changes while its meaning and containing document remain the same.

Then:

- the reference still directly locates the same object; and
- the reader can distinguish that object from other objects in its document.

<a id="ac-002"></a>

### AC-002 — Independent files need no document-number allocation

For:

- REQ-001 — Direct and precise knowledge references.

Given:

- two agents create different documents with distinct paths, each containing a local REQ-001.

When:

- their changes are reconciled.

Then:

- neither document needs a global document number, and references distinguish the two local objects by their containing documents;
- conflicting paths or duplicate local objects in a shared document are resolved before acceptance; and
- the default creation process does not require a document-ID allocator.

<a id="ac-003"></a>

### AC-003 — Reorganization repairs references according to context

For:

- REQ-002 — Meaning-preserving repository reference migration.

Given:

- a selected document is moved, split, or merged, and repository references depend on different parts of its meaning.

When:

- a reference migration completes.

Then:

- each affected reference points to the justified replacement object or document, including multiple targets when necessary;
- outgoing relative references resolve from the new containing file;
- referring statements retain their intended supported meaning; and
- obsolete files and redirect stubs are absent.

<a id="ac-004"></a>

### AC-004 — Missing targets and concurrent changes prevent false completion

For:

- REQ-002 — Meaning-preserving repository reference migration.

Given:

- a former target has no supported replacement, its replacement is ambiguous, or a reviewed source has changed concurrently.

When:

- migration evaluates the affected reference.

Then:

- it does not silently redirect the reference or reuse stale conclusions;
- it obtains evidence or owner direction to revise or retire the relationship, or reports that migration remains incomplete;
- materially changed sources are reassessed before acceptance; and
- its report identifies repository search limits and external references without promising external repair.
