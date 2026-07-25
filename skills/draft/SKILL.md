---
name: draft
description: >
  Manage the docs/drafts/ folder — create, update, and delete draft documents
  (use cases, user stories, ADR drafts) in response to new or changing business
  requirements. Use this skill whenever the user describes a new feature
  requirement, changes an existing requirement, cancels a feature, or says
  anything that implies docs/drafts/ should change. Also triggers on phrases
  like "add a draft", "document this requirement", "new feature:", "requirement
  changed", "we're dropping UC-xxx", "update the draft for", "let's define the
  flow for", "this feature is cancelled", or "the business wants X instead".
  A single invocation handles any mix of creates, updates, and deletes — it
  derives the full change set from context and executes everything in one pass.
  Use this skill even when the user hasn't finished thinking — ask a clarifying
  question rather than skipping the skill.
---

# Skill: draft

Translate business requirement changes into `docs/drafts/` — creating, editing,
and deleting UCs, USs, and ADR drafts as needed. A single invocation may do any
combination of these operations; the skill derives the complete change set from
context and executes it all.

Document section names and templates come from `docs/schema/format.md`.
Workflow rules (ID assignment, ADR criteria, decomposition rules, lifecycle)
come from `docs/schema/workflow-rules.md`. This skill describes the methodology;
those files describe the parameters.

---

## Step 0: Orient

1. **Load the document schema.** Check if `docs/schema/format.md` exists.
   - If yes: read its YAML frontmatter. Extract `schema`, `version`, and the
     `sections` maps for `use-case` and `user-story`. Read the markdown body
     for the `## use-case Template` and `## user-story Template` blocks.
   - If no: use the shipped defaults verbatim from
     `skills/init/references/format.md` (the agent-skills schema — the
     authoritative source for default section names and template bodies).
     Set the document's `schema-version` per the "Schema versioning" rules in
     that same file.

   `/draft` creates **project-layer** documents, so when copying the section
   maps: include `implemented-by` on the use-case, and omit `serves` on both
   use-case and user-story (those are module-layer sections).

2. **Load workflow rules.** Check if `docs/schema/workflow-rules.md` exists.
   - If yes: read its YAML frontmatter. Use values from `id-rules`,
     `adr-triggers`, `decomposition`, `lifecycle`, and `cross-references`
     wherever this skill references workflow policy below.
   - If no: use the embedded defaults stated inline in each step (these match
     the rules shipped with /init).

   Store all loaded values — you will need them in Steps 3–6.

3. Scan `docs/drafts/use-cases/` to understand what already exists — folder names,
   IDs in use, and content of any files that might be relevant to the current change.
4. If `docs/drafts/use-cases/` doesn't exist, create it (and `docs/drafts/` if needed).
5. If `docs/modules/` exists, note the module names — you'll use them during
   discovery.

---

## Step 1: Understand the full change

Read everything in the conversation about what is new, changing, or being dropped.

Map the intent to operations:

```
New requirement                   → CREATE new UC folder + US file(s) + optional ADR draft
Requirement changes draft         → UPDATE existing files in docs/drafts/ directly
Requirement changes confirmed doc → COPY confirmed doc to docs/drafts/ mirror path + apply changes
ADR supersession                  → CREATE new ADR draft + SCAN all docs referencing old ADR
                                     + COPY affected confirmed docs to docs/drafts/
                                     + SHOW impact report + AWAIT user confirmation
Cancelled feature                 → DELETE draft folder/files + repair cross-references
```

A single invocation can involve all three. Derive the **complete operation set**
before touching any files.

**If anything is genuinely ambiguous** — the actor is unclear, the scope is
unclear, or you can't tell which existing draft is meant — ask the user before
proceeding. Don't guess.

---

## Step 2: Discover related existing docs

Extract keywords from the requirement (business terms, actor names, data entities,
system names). Search in this order — each layer informs the next:

1. `docs/adr/` and `docs/modules/{module}/adr/` — confirmed decisions that constrain what's possible
2. `docs/use-cases/` — confirmed business-layer features this requirement relates to or extends
3. `docs/modules/` — confirmed module-level contracts (skip if absent)
4. `docs/drafts/` — in-progress work; if a draft and a confirmed doc cover the same UC, the draft is the current working version

**If the requirement supersedes an existing ADR**, scan ALL files across `docs/use-cases/`,
`docs/modules/`, and `docs/drafts/` for `Related ADR: ADR-{old-id}` references. This is
your full impact set — every file in that list must be copied to `docs/drafts/` and updated
before any implementation planning begins.

**What to do with what you find:**

- **Confirmed doc needs updating** (the requirement changes content in `docs/use-cases/`,
  `docs/modules/`, or a confirmed ADR): add to the copy-to-drafts set (see Step 6) —
  do not edit confirmed docs directly.
- **Structural impact** (a UC-ID is being deleted or renamed and other drafts reference it):
  add affected files to the operation set.
- **Conceptual impact** (overlap or extension, but no file structure breaks): flag in the
  summary for human review; don't touch unless the user directs you to.

Also check whether the new UC's "Related Use Cases" section can be populated from
what you find. Fill in any genuine relationships (prerequisite, follow-up, related,
shared sub-flow) rather than leaving the template placeholder.

---

## Step 3: Assign IDs for new documents

Apply `id-rules` from `workflow-rules.md`. The default policy (agent-skills):

- `highest + 1` across drafts and confirmed locations (shared namespace)
- Do not fill gaps — if `uc-001` and `uc-003` exist, next UC is `uc-004`
- UC, US, ADR, and plan sequences are independent of each other
- Start at `001` if no existing IDs

Scan **both** `docs/drafts/use-cases/` and `docs/use-cases/` for UC/US sequences.
Scan `docs/drafts/adr/` for ADR draft sequence.

Assign all IDs for the full operation set **before writing any files**, so a
single change that creates multiple documents doesn't produce ID conflicts.

---

## Step 4: Decompose into UCs and USs

Apply `decomposition` rules from `workflow-rules.md`. Default policy:

- **UC rule:** one UC per distinct user goal. If a requirement spans two
  different user goals, create two separate UCs.
- **Split a UC into multiple USs** when any of these apply:
  - Distinct exception paths each need their own contract
  - Multiple actor perspectives participate in the same goal
  - The happy path has discrete phases that can independently fail
    (initiate → confirm → complete)

**Practical heuristic:** if you'd write more than one independent endpoint /
command / interface, consider splitting into multiple USs. If the user's goal
changes between them, split into multiple UCs instead.

**Handling overlapping UCs:**

| Situation | How to handle |
|---|---|
| Multiple UCs share steps | Extract a shared sub-UC; original UCs reference it |
| Scope expands on existing UC | Modify the existing UC; add new US files |
| Goal fundamentally changes | Delete old UC; rebuild a new one |

---

## Step 5: Assess whether an ADR draft is needed

Apply `adr-triggers` from `workflow-rules.md`. Default policy: an ADR draft is
required when **all** of these are true:

```
□ Multiple implementation options were considered
□ The decision affects more than one module
□ A new team member couldn't infer the "why" from the result alone
```

**All conditions met** → auto-create an ADR draft. Do not ask — just create it.
Use `Status: Proposed` and the ADR template from `docs/schema/format.md` (or
the embedded default if no schema file exists).

**Any condition not met** → skip the ADR. A note in the US's Expected Behavior
section is enough.

---

## Step 6: Execute the full operation set

**Order**: creates first, then updates, then deletes, then cross-reference repairs.
This ensures you don't delete something before you've updated what references it.

### Creating new UC drafts

Folder: `docs/drafts/use-cases/uc-{id}-{kebab-case-name}/`

Files to create:

- `use-case.md` — prepend the frontmatter block below, then write the body
  using the `## use-case Template` from `docs/schema/format.md` (loaded in Step 0)
- `us-{id}-{kebab-case-name}.md` for each user story — prepend the user-story
  frontmatter block below, then write the body using the `## user-story Template`
  from `docs/schema/format.md`

**Frontmatter for `use-case.md`** (use section names loaded in Step 0; /draft
creates project-layer documents, so include `implemented-by` and omit `serves`):

```yaml
---
schema: {schema}
schema-version: {per Schema versioning rules — see Step 0}
doc-type: use-case
id: UC-{id}
sections:
  actor: "{actor}"
  preconditions: "{preconditions}"
  business-rules: "{business-rules}"
  postconditions: "{postconditions}"
  flow: "{flow}"
  exceptions: "{exceptions}"
  related: "{related}"
  implemented-by: "{implemented-by}"
  required-extra: {required-extra}
---
```

**Frontmatter for `us-{id}.md`** (use section names loaded in Step 0; /draft
creates project-layer documents, so omit `serves`. Set `api-type` to match the
project's default — usually `rest`):

```yaml
---
schema: {schema}
schema-version: {per Schema versioning rules — see Step 0}
doc-type: user-story
id: US-{id}
api-type: {api-type from format.md, default rest}
sections:
  parent-link: "{parent-link}"
  story: "{story}"
  expected-behavior: "{expected-behavior}"
  api-contract: "{api-contract}"
  scenarios: "{scenarios}"
  required-extra: {required-extra}
---
```

Fill every section you can derive from the requirement. Sections where the
requirement doesn't provide enough detail can stay as template placeholders —
incomplete content is explicitly allowed in drafts.

**Dangling references**: if a new doc references something still in drafts/ (e.g.,
a related ADR not yet confirmed), write `TBD` with a note pointing to the draft:

```markdown
- Related ADR: TBD (retry strategy under discussion, see docs/drafts/adr-draft-001-retry)
```

### Updating existing drafts

Per `lifecycle.drafts-edit-in-place` from `workflow-rules.md` (default: true):
overwrite affected sections directly. Drafts always reflect the current state,
not a history. There is no version tracking inside the file itself; git handles
history.

**When a UC's goal changes fundamentally**: delete the old `use-case.md` and
write a new one from the template. Then evaluate each existing US file under that
UC, using the `parent-link` section name from the schema:

- Still aligned with the new goal → keep it, update the parent link if needed
- Partially aligned → update it
- No longer relevant → delete it and repair any references to it

**When only a US needs updating**: edit the US file directly. If the change adds
a new exception flow complex enough to need its own contract, create a new US
file rather than expanding the existing one.

### Deleting cancelled drafts

Per `lifecycle.cancelled-drafts` from `workflow-rules.md` (default:
`delete-immediately`):

1. Scan all other files in `docs/drafts/` for references to the UC/US being deleted
2. Update those references — remove the reference line, or replace it with a
   note that the feature was cancelled
3. Then delete the folder and all its contents

### Copying a confirmed doc into drafts for update

Per `lifecycle.confirmed-docs-editable` from `workflow-rules.md` (default: false):
confirmed docs in `docs/use-cases/`, `docs/modules/`, or `docs/adr/` are never
edited directly. When a requirement affects them, copy to the draft mirror path
first.

**For UC/US documents** — copy to the mirror path under `docs/drafts/`:

- `docs/use-cases/uc-001-checkout/` → `docs/drafts/use-cases/uc-001-checkout/`
- `docs/modules/payment/use-cases/uc-001-process-payment/` → `docs/drafts/modules/payment/use-cases/uc-001-process-payment/`

Copy all files in the folder. Apply the required changes to the draft copy. Do not edit
the original confirmed files — they remain the last-released state until `/merge`
promotes the draft over them.

**For ADR supersession** — do not copy the old ADR file directly. Instead:

1. Create a new ADR draft (`docs/drafts/adr/adr-draft-{new-id}-{name}.md`) with `Status: Proposed`
2. In its Background section, name the ADR being superseded and explain why the decision is changing
3. Copy every confirmed UC/US that carries `Related ADR: ADR-{old-id}` to its draft mirror path
4. In each copied draft, change `Related ADR: ADR-{old-id}` →
   `Related ADR: TBD (new decision under discussion, see docs/drafts/adr/adr-draft-{new-id}-{name})`
5. Inline code references (`// see ADR-{old-id}`) in `src/` are **not** updated here —
   that is handled by `/apply` during implementation

### Repairing cross-references

After creates, updates, and deletes, scan `docs/drafts/` for stale cross-references
(pointing to a file you renamed, split, or deleted). Fix them. Do not edit confirmed
docs in `docs/use-cases/`, `docs/modules/`, or `docs/adr/` directly — if a cross-reference
in a confirmed doc needs fixing, that doc should first be copied to `docs/drafts/` and
updated there.

---

## Step 7: Print summary

```
Draft update complete
──────────────────────────────────────────────────────
Created:   [list files with paths, or "none"]
Updated:   [list files with brief note on what changed, or "none"]
Deleted:   [list folders/files deleted, or "none"]
ADR:       [filename if created, or "not needed — [reason from checklist]"]
Refs fixed: [cross-references updated — omit section if none were touched]
May need review:
           [related docs found in Step 2 that weren't edited but might need
            human attention — omit section if nothing was flagged]
```

When an ADR is being superseded, append this block after the summary above:

```
ADR cascade
────────────────────────────────────────────────────────────────
Superseded:    [ADR-xxx — confirmed path]
New draft:     [docs/drafts/adr/adr-draft-{new-id}-{name}.md]
Affected docs: [list every file copied to docs/drafts/ due to this ADR change,
                with the old ADR reference it carried]
Code refs:     Inline `// see ADR-{old-id}` in src/ will be updated by /apply — not done here.

⚠ REVIEW REQUIRED — [N] documents are affected by this ADR change.
  Review docs/drafts/ to confirm the scope and updated content
  before proceeding to /design-plan.
```

---

## Reference: File naming

| Document | Path pattern |
|---|---|
| Business UC folder | `docs/drafts/use-cases/uc-{id}-{kebab-name}/` |
| Use case file | `docs/drafts/use-cases/uc-{id}-{name}/use-case.md` |
| User story (detailed) | `docs/drafts/use-cases/uc-{id}-{name}/us-{id}-{kebab-name}.md` |
| Project ADR draft | `docs/drafts/adr/adr-draft-{id}-{kebab-name}.md` |

Kebab-case name is derived from the document title. Keep it short (2–4 words),
lowercase letters, digits, and hyphens only.

---

## Reference: Templates

Document templates (UC, US, ADR) live in `docs/schema/format.md` under the
`## use-case Template`, `## user-story Template`, and `## adr Template` body
sections. Step 0 loads them. Use them verbatim when creating new documents,
substituting `{id}` and other placeholders.

If `docs/schema/format.md` does not exist, fall back to the templates shipped
in `skills/init/references/format.md` (the agent-skills defaults).
