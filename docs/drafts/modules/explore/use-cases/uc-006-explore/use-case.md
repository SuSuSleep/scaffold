---
schema: web-service
schema-version: 0
doc-type: use-case
id: UC-006
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

# UC-006: Enter explore mode — think with the user before committing to anything

Provide a free-form thinking-partner mode where the assistant can read files, search code, traverse docs, draw ASCII diagrams, compare approaches, and surface risks — **all without writing code, implementing features, or persisting anything to disk**. Notes and design summaries live entirely in the conversation. Explore mode is exited only when the user explicitly invokes another skill or asks for a file update.

## Primary Actor

Inbound CLI invocation via the `/explore` slash command in Claude Code. Often invoked in four archetypal contexts:
- A vague idea ("let me think about how we'd handle X")
- A specific problem ("I'm stuck on Y")
- Mid-implementation doubt ("is this the right approach?")
- An open design question ("how should we structure Z?")

## Source

TBD (will be linked after /compose) — belongs to the greenfield implementation workflow as an optional pre-step: `/explore → draft → review-draft → design-plan → apply → merge → verify`.

## Preconditions

- The user has invoked `/explore` and wants to think rather than implement
- Project navigation context (AGENTS.md, CLAUDE.md, README.md, ARCHITECTURE.md, or equivalent) is available to read — or the skill falls back to breadth-first scanning of `docs/` to infer structure
- The user is available for multi-turn synchronous conversation — explore is adaptive, not batch

## Business Rules

None — the technical preconditions cover it.

## Postconditions

On any explore-mode turn (the skill has no terminal "complete" state in the conventional sense — sessions end when the user changes mode):

- The user has gained clarity, options, a recommendation, or a question to raise — or all four, or none if the conversation is mid-flow
- **Zero changes to disk** — no source code, no test code, no documentation files, no scratch files, no notes-to-self files, no `docs/drafts/` writes
- Any "captured" output (ASCII diagrams, comparison tables, "What we figured out" summaries) exists only in the conversation transcript
- If thinking crystallised into something worth persisting, the skill **offered** a handoff to the appropriate next skill (`/draft`, ADR via `/draft`, `/spec-feature`, `/design-plan`, etc.) — it did NOT execute the handoff itself
- Explore mode remains active until the user explicitly invokes another skill, asks for a file update, or signals end of session — the skill does not auto-exit

## Main Flow

There is no fixed sequence in explore mode — the skill is adaptive. The flow below describes the **stance and posture** the skill maintains turn-by-turn, not a state machine:

1. **Silent orientation (first turn)** — read the system prompt's already-loaded nav context first (AGENTS.md, CLAUDE.md). If sufficient, proceed; if not, fall back to: read `README.md` → glob `docs/` → read any guide files (AGENT.md, GUIDELINE.md, ARCHITECTURE.md, etc.) → infer doc structure from what's actually there, not from a fixed layout assumption. Surface what was found: *"This project organises docs as [X]. Is that right?"* and let the user confirm before going deeper
2. **Map the relevant doc chain** — locate the most specific doc matching the topic; trace **upstream** (what requirement/goal/decision motivated it) and **downstream** (what tasks/contracts/tests depend on it); note contradictions, gaps, unanswered questions across layers
3. **Check code when relevant** — if the topic touches existing code, map the relevant files / modules, find integration points, hidden complexity, and where the code diverges from the docs
4. **Engage the conversation adaptively** — depending on what the user brings, the skill may: clarify the problem (ask questions that emerge naturally, not from a checklist); reframe if the docs-angle shows a different shape; surface assumptions worth challenging; compare approaches using tables (option A vs B with criteria like fits-goal, touches-ADR, downstream-impact); visualise with ASCII diagrams of doc/code structure; surface risks and gaps (what's undecided, where code diverges from spec, what open question could invalidate the approach); propose a direction once thinking crystallises
5. **Offer to capture, never auto-capture** — when a decision or design point solidifies, the skill offers naturally (e.g. *"That feels like an ADR — want me to draft it?"*) and **waits**. It does NOT write the doc; it points to the right next skill (`/draft` for requirements/ADR, `/design-plan` for implementation planning, etc.)
6. **Session end is the user's call** — sessions may flow into a document update (offered as a handoff), produce a clear recommendation the user takes away, just provide clarity, or surface a question worth raising with a stakeholder. Optionally a "What we figured out" summary block may be printed if things crystallised. The skill does NOT force a summary; sometimes the thinking is the value

**Adaptive posture rules (apply at every turn):**

- **Curious, not prescriptive** — ask emergent questions, not from a checklist
- **Open threads** — surface multiple angles; let the user follow what resonates
- **Visual** — reach for ASCII diagrams, tables, flow sketches when they beat words
- **Grounded** — explore the actual code AND docs, don't theorise without checking
- **Patient** — let problem shape emerge; don't rush a conclusion
- **Adaptive** — pivot when new information changes the picture

## Exception Flows

- **E1 — User asks the skill to implement something during explore mode** (contact support): ("just write the code for option B", "go ahead and add the function", "make the change"): **refuse and remind the user to exit explore mode first**. Do NOT comply once-and-warn; do NOT write the code "just this once". The hard gate is load-bearing for the UC: if explore can be coaxed into writing code, the mode loses its value as a pre-commitment space. Suggested phrasing: *"Explore mode doesn't write code or modify files. Want to exit and run `/draft` or `/design-plan` to capture this as a real change?"*
- **E2 — User asks the skill to write a note/summary/decision to a file** (contact support): ("save this to a markdown file", "write this analysis to docs/notes/"): same response as E1 — refuse and remind. **Conversation-only is the rule** (per UC-006 Postconditions): no scratch files, no `docs/drafts/exploration/` folder, no anything-to-disk. Offer the appropriate handoff instead (`/draft` for a UC/US/ADR, project-level notes via `/setup`, etc.)
- **E3 — Project nav context is missing or contradictory** (recoverable): (no AGENTS.md, no CLAUDE.md, sparse README): fall back to breadth-first scan of `docs/`; if the structure is still unclear, ask the user to confirm where knowledge lives in the project before going deeper — don't assume a fixed layout
- **E4 — Topic is large enough to warrant a different skill rather than exploration** (contact support): (user opens with "let's design the entire auth system from scratch"): explore the *problem shape* first — what's the user really after, what constraints already exist — then offer the handoff explicitly (*"Sounds like you're ready to draft this. Use `/draft` to start a UC, or stay here if you want to think through trade-offs more first."*); follow the user's choice
- **E5 — User changes mode explicitly** (contact support): (says "exit explore", invokes `/draft` or any other skill, or asks the skill to make a file change): explore mode ends; the skill yields control to whatever the user invoked. This is the **only** intended exit path
- **E6 — Conversation surfaces a topic that would benefit from existing notes the user has elsewhere** (recoverable): (Linear ticket, Slack thread, external doc): the skill notes that, asks the user to share or summarise, then continues. The skill does NOT auto-fetch from external systems
- **E7 — User asks for a conclusion when the thinking isn't ripe** (contact support): ("just tell me which one is right"): the skill names what's still undecided, what trade-off the user must own, and what info would let it firm up a recommendation — instead of inventing certainty. Sometimes "we don't know yet, here's why" is the answer

## Serves

TBD (will be linked after /compose) — expected target: the pre-drafting / thinking step of the greenfield workflow business UC.
