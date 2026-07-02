---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-004
sections:
  primary-actor: Primary Actor
  source: Source
  preconditions: Preconditions
  business-rules: Business Rules
  postconditions: Postconditions
  main-flow: Main Flow
  exception-flows: Exception Flows
  serves: Serves
---

# UC-004: Express a business requirement change in docs/drafts/

Take a free-form business requirement intent from the user (new feature, requirement change, cancelled feature, or ADR supersession) and translate it into a coherent set of CREATE / UPDATE / DELETE / COPY operations against `docs/drafts/`, executed in one pass. ADR supersession is a special sub-flow that fans out across every confirmed doc carrying the old ADR reference and requires a user-review pause before downstream skills (`/design-plan`, etc.) may run.

## Primary Actor

Inbound CLI invocation via the `/draft` slash command in Claude Code, with the user's requirement intent supplied as conversation context (e.g. "add a feature where users can export their data as CSV", "we're dropping UC-007", "the business wants subscription pricing instead of one-off purchases", "supersede ADR-012 with cookie-based sessions").

## Source

TBD (will be linked after /compose) — belongs to the greenfield implementation workflow: `explore → /draft → review-draft → design-plan → apply → merge → verify`.

## Preconditions

- The user has supplied at least one expressible requirement intent in the conversation (new requirement, change, cancellation, or ADR supersession)
- `docs/schema/format.md` is readable, **or** the embedded defaults from `skills/init/references/format.md` are available (the skill resolves this in Step 0)
- `docs/schema/workflow-rules.md` is readable, **or** the embedded defaults are used
- For ADR supersession: at least one confirmed ADR exists at `docs/adr/` or `docs/modules/{module}/adr/` matching the superseded ADR ID

## Business Rules

- Confirmed docs (`docs/use-cases/`, `docs/modules/`, `docs/adr/`) are **never** edited directly — always copy-to-drafts first, then apply the change to the copy
- Inline code references (`// see ADR-{old-id}` in `src/`) are NOT updated by `/draft` — that is `/apply`'s job during the rework batch of an ADR-supersession plan
- ADR-supersession cascades must complete in full or not at all — partial cascades leave the project in an inconsistent state
- IDs follow `highest-plus-one, no gaps` and are assigned **before** any file is written, so concurrent creates within a single invocation don't collide
- The skill **never** runs git operations — drafts land in the working tree and `/review-draft` decides commit policy

## Postconditions

On success (single-pass execution of the derived change set):

- `docs/drafts/use-cases/` reflects the intended state — new UC/US files created where the requirement is new, existing draft files edited in place where it changed, draft folders removed where features were cancelled
- For requirements that affect confirmed docs: the affected confirmed doc has been **copied** (not edited) to its mirror path under `docs/drafts/` and the change has been applied to the copy
- For ADR supersession: a new `docs/drafts/adr/adr-draft-{new-id}-{name}.md` exists with `Status: Proposed` and a Background section naming the superseded ADR; every confirmed UC/US carrying `Related ADR: ADR-{old-id}` has been copied to its draft mirror path with the reference rewritten to `TBD (new decision under discussion, see docs/drafts/adr/adr-draft-{new-id}-{name})`; an "ADR cascade" summary block is shown and downstream skills are blocked until the user reviews
- A conditional ADR draft has been created at `docs/drafts/adr/adr-draft-{id}-{name}.md` if the `adr-triggers` check passed (all three conditions met)
- Cross-references inside `docs/drafts/` are coherent — any reference to a renamed / split / deleted file has been repaired
- IDs assigned for new docs follow `id-rules` (default `highest-plus-one`, no gaps, shared namespace across drafts and confirmed; independent sequences for UC, US, ADR, plan)
- Confirmed docs under `docs/use-cases/`, `docs/modules/`, `docs/adr/` are **unchanged** — the skill never edits them directly
- Source code under `src/`, including inline `// see ADR-{old-id}` comments, is **unchanged** — those are `/apply`'s responsibility
- A summary block has been printed listing Created / Updated / Deleted / ADR / Refs fixed; for ADR supersession, an "ADR cascade" block follows with `⚠ REVIEW REQUIRED`

On stop (ambiguous intent): nothing is written; the user is asked a clarifying question.

## Main Flow

1. **Load schema and rules** — read `docs/schema/format.md` (or fall back to `skills/init/references/format.md`); read `docs/schema/workflow-rules.md` (or embedded defaults). Extract section maps for `use-case` and `user-story` (project-layer means include `implemented-by`, omit `serves`); template bodies; `id-rules`; `adr-triggers`; `decomposition`; `lifecycle`; `cross-references`
2. **Scan existing drafts and confirmed docs** — list `docs/drafts/use-cases/`, `docs/drafts/adr/`, `docs/use-cases/`, `docs/adr/`, `docs/modules/`, `docs/modules/*/adr/`; note IDs in use, folder names, and content that might be relevant
3. **Map intent → operations** — read the conversation for what is new / changing / dropped / superseded; classify each into CREATE / UPDATE / DELETE / COPY-from-confirmed / ADR-supersession; ambiguity at this step ⇒ ask the user before proceeding (do not guess)
4. **Discover related existing docs** — extract keywords (business terms, actor names, data entities); search confirmed ADRs → confirmed UCs → confirmed module docs → existing drafts in that order; classify each finding as "needs updating" (add to copy-to-drafts set), "structural impact" (add to operation set), or "conceptual overlap" (flag for review only)
5. **For ADR supersession only — fan-out scan** — search ALL files in `docs/use-cases/`, `docs/modules/`, `docs/drafts/` for `Related ADR: ADR-{old-id}`; the complete match list is the impact set; every file in it must be copied to drafts and updated before the operation completes
6. **Assign IDs for all new documents up front** — apply `id-rules`; scan both `docs/drafts/` and confirmed locations for the highest existing UC / US / ADR / plan; assign next sequential ID per type; assign ALL IDs before writing any file so concurrent creates don't collide
7. **Decompose new requirements into UCs and USs** — apply `decomposition.uc-rule` (one UC per distinct user goal) and split rules (distinct exception paths, multiple actor perspectives, discrete phases). For overlapping UCs: extract shared sub-UC, modify existing UC for scope expansion, or delete-and-rebuild for fundamental goal change
8. **Assess ADR need for new requirements** — apply `adr-triggers`: all three of (multiple options considered, decision affects >1 module, "why" not inferable from result) must be true → auto-create an ADR draft with `Status: Proposed`; any condition not met → skip (a note in the US's Expected Behavior suffices)
9. **Execute the operation set in order**: creates → updates → deletes → cross-reference repair. This ordering prevents deleting something before its referents are updated:
   - **Create new UC drafts**: `docs/drafts/use-cases/uc-{id}-{kebab-name}/use-case.md` + one or more `us-{id}-{kebab-name}.md`, with project-layer frontmatter (include `implemented-by`, omit `serves`; api-type defaults to `rest`); fill every section derivable from the requirement, leave the rest as template placeholders (incomplete drafts are allowed)
   - **Update existing drafts**: edit in place per `lifecycle.drafts-edit-in-place` (default true); drafts reflect current state, not history (git handles history). On fundamental goal change: delete the old `use-case.md` and rewrite; re-evaluate each existing US under that UC (keep / update / delete)
   - **Copy-from-confirmed (UC/US)**: copy the whole folder from `docs/use-cases/uc-{id}-{name}/` or `docs/modules/{module}/use-cases/uc-{id}-{name}/` to the mirror path under `docs/drafts/`; apply the change to the draft copy; never touch the confirmed source
   - **ADR supersession execution**: (a) create new ADR draft with Background naming the superseded ADR + reason; (b) copy each impact-set file to its draft mirror path; (c) in each copied draft, replace `Related ADR: ADR-{old-id}` with `TBD (new decision under discussion, see docs/drafts/adr/adr-draft-{new-id}-{name})`; (d) inline `// see ADR-{old-id}` in `src/` is explicitly NOT updated here — `/apply` handles that during implementation
   - **Delete cancelled drafts**: per `lifecycle.cancelled-drafts` (default `delete-immediately`), first scan all other files in `docs/drafts/` for references to the doomed UC/US, update those references (remove or mark cancelled), then delete the folder
   - **Repair cross-references**: scan `docs/drafts/` for stale references to anything renamed / split / deleted in this pass; fix them; never fix a stale reference in a confirmed doc directly — if a confirmed doc has a broken reference because of this change, copy it to drafts first and fix it there
10. **Print summary block** — Created / Updated / Deleted / ADR (filename or "not needed — {reason}") / Refs fixed / May need review (related docs flagged in Step 4 but not edited)
11. **For ADR supersession only — append ADR cascade block** — Superseded (path) / New draft (path) / Affected docs (every file copied) / Code refs note ("Inline `// see ADR-{old-id}` in src/ will be updated by /apply — not done here") / `⚠ REVIEW REQUIRED — [N] documents are affected. Review docs/drafts/ before /design-plan.`

## Exception Flows

- **E1 — Ambiguous intent** (recoverable, user clarifies) — the conversation is unclear whether the user wants to add, change, or replace something; the actor or scope can't be pinned down; can't tell which existing draft is meant: ask the user a targeted clarifying question; do NOT guess; do NOT write anything until the answer arrives
- **E2 — User cancels a UC referenced by other drafts** (recoverable, two branches — auto-repair refs OR user-confirmed cascade): per Step 9 delete order, scan-and-repair-then-delete; if a reference cannot be safely removed (e.g. another draft's entire flow depends on the cancelled UC), surface the conflict and ask whether to cascade the cancellation
- **E3 — ADR supersession references an ADR ID that doesn't exist in confirmed docs** (recoverable, user clarifies — typo or fresh-ADR-not-supersession): report which ADR ID was searched for and not found; ask whether the user meant a different ID, or whether the supersession should be created as a fresh ADR draft instead of a supersession; do not write the cascade
- **E4 — Copy-from-confirmed target file already has a draft at the mirror path** (recoverable, auto-resolve): do NOT overwrite — the existing draft is the current working version (per Step 0 discovery rule); update the existing draft in place instead, and report this in the summary
- **E5 — Schema/rules + embedded defaults all missing** (recoverable, return to /init): stop and tell the user to run `/init`; the skill cannot synthesise UC/US bodies without a template
- **E6 — A new requirement matches an existing UC in scope** (recoverable, user picks — modify / extract shared / sibling) — would duplicate it: report the overlap; ask whether the user wants to modify the existing UC, extract a shared sub-UC, or create a sibling UC for a different user goal
- **E7 — User intent implies editing a confirmed doc but no actual content change is described** (recoverable, informational): report that nothing was copied (no change to apply); leave the confirmed doc untouched
- **E8 — ID collision detected after assignment** (recoverable, auto-retry) — a concurrent run or a forgotten file added an ID under the assigned target: re-scan and reassign; do not write under the colliding ID

## Serves

TBD (will be linked after /compose) — expected target: the requirement-capture step of the greenfield workflow business UC.
