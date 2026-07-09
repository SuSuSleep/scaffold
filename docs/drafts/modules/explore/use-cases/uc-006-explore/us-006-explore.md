---
schema: web-service
schema-version: 0
doc-type: user-story
id: US-006
api-type: cli
sections:
  belongs-to: Belongs to
  derived-from: Derived from
  story: Story
  expected-behavior: Expected Behavior
  api-contract: API Contract
  test-scenarios: Test Scenarios
  serves: Serves
---

# US-006: Run /explore to think through something before committing

## Belongs to

UC-006 — Enter explore mode (module `explore`, see `./use-case.md`)

## Derived from

TBD (will be linked after /compose) — expected target: the greenfield workflow business US, where the user-facing step is "I have a half-formed idea, a confusing situation, or a decision to make — I want a thinking partner who reads the actual code and docs, asks good questions, sketches options, and doesn't try to write code while we're still figuring it out."

## Story

- **As:** Developer or maintainer of this repo
- **I want to:** understand current repo with coding agent and clarify unclear detail, like target, method, and etc.
- **So that:** User would be hard to align their thought or idea with coding agent. Users need to show every detail about their idea when they don't know what the coding agent don't know.
- **Trigger:** User would trigger it when it want to do something with current repo (not only this repo, include all repo that have coding agent use this skill)

## Expected Behavior

`/explore` gives a developer or maintainer a conversation-first way to understand a repo with a coding agent before deciding what should be changed. The skill reads relevant project context, helps clarify unclear details such as the target, method, assumptions, and next step, and keeps all thinking in the conversation instead of writing files. This matters because users often do not know what context the coding agent is missing; without `/explore`, they have to spell out every detail up front and alignment becomes harder.

## API Contract

**api-type: `cli`** — invoked as a Claude Code slash command. The skill is multi-turn and adaptive: no fixed phases, no required outputs, no terminal "complete" state. Exits only when the user explicitly invokes another skill, asks for a file update, or signals end of session.

### Command

```
/explore [topic]
```

### Flags / Arguments

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `topic` | optional | Free-form opening topic, e.g. "auth refactor", "why is the queue lag spiking", "is splitting payment-service the right call". When omitted, the skill asks an opening question to find the right altitude. |

### Stdin

Not applicable in the OS sense — input is multi-turn conversational. The skill ingests:

- The user's opening topic + every follow-up turn
- Project navigation context: AGENTS.md, CLAUDE.md, README.md, ARCHITECTURE.md (or equivalents) — typically pre-loaded in the system prompt; otherwise the skill reads them directly
- `docs/` tree (globbed to infer structure when nav context is sparse)
- The relevant doc chain for the topic (most-specific doc + upstream + downstream)
- Source code under `src/` when the topic touches existing implementation
- User confirmation when the inferred doc structure is presented for sanity-check

### Stdout

Per-turn conversational output. There is no fixed output shape — possible elements include:

- A "this project organises docs as [X]; is that right?" orientation note on the first turn (when nav context required inference)
- Free-form thinking dialogue
- ASCII diagrams of doc/code structure when they beat words
- Comparison tables (Option A vs B with rows for fits-goal / touches-ADR / downstream-impact)
- Upstream/downstream impact maps
- Risk and gap callouts
- Direction proposals with rationale
- Capture-handoff offers (*"That feels like an ADR — want me to draft it?"*) without auto-execution
- Optional "What we figured out" summary block when thinking crystallises
- Refusal messages for E1 (implementation request) and E2 (file-write request) reminding the user to exit explore mode first

### Stderr

Not separately addressed. Refusals (E1, E2) and orientation-failure recoveries (E3) are surfaced inline in the conversational stream.

### Exit codes / outcomes

There is no terminal "complete" outcome — every outcome is mid-conversation or a user-initiated transition out:

| Outcome | Effect |
| ------- | ------ |
| User keeps exploring | Skill continues adaptively; zero disk writes; conversation grows |
| User accepts a capture handoff (`yes, draft it`) | Skill points to / hands off to the appropriate next skill (e.g. `/draft`); explore mode ends |
| User invokes another skill explicitly | Explore mode ends; control yields |
| User asks for a file update (any kind, any path) | E1 / E2 refusal; explore mode remains active; user can choose to exit |
| User asks for implementation during the session | E1 refusal; explore mode remains active; user can choose to exit |
| User signals end of session ("ok thanks, I'll think on it") | Skill optionally offers a "What we figured out" summary or just acknowledges; no writes; explore mode ends |
| Thinking doesn't crystallise | Acceptable outcome — sometimes the value IS the clarity that the thinking isn't ripe; the skill says so explicitly rather than inventing certainty |

### Side effects

- **Zero file writes** — no source code, no test code, no documentation, no scratch files, no notes-to-self files, no `docs/drafts/exploration/` folder. This is the load-bearing invariant of the UC. Captured content lives in the conversation transcript only
- **Zero git operations**
- **Zero test execution**
- **Zero external service calls** (Linear, Slack, GitHub API, etc.) — if relevant external context exists, the skill asks the user to share or summarise; it does not auto-fetch
- **Reads only**: AGENTS.md, CLAUDE.md, README.md, ARCHITECTURE.md, `docs/` globs and contents, `src/` files relevant to the topic
- The skill MAY suggest the user invoke another skill (`/draft`, `/design-plan`, `/spec-feature`) but does NOT invoke them itself

## Test Scenarios

> Skeleton only — Given/When/Then bodies are TBD pending `/elicit`. Each scenario maps to one behavioural test in `tests/behavioral/explore/us-006-*.test.*`.

### Scenario 1: TBD (happy path — user explores a vague idea; skill orients, maps doc chain, asks emergent questions, sketches options, proposes a direction, offers a capture handoff; user accepts and exits to `/draft`)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 2: TBD (specific problem — skill reads the relevant doc chain, shows what each layer says, surfaces the tension point, helps user resolve it without writing anything)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 3: TBD (stuck mid-implementation — skill reads code + spec + tasks, identifies the exact decision point, explores options without touching the implementation, ends with a recommendation the user takes back to implementation)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 4: TBD ("is this the right approach?" — skill checks the approach against upstream docs, shows fit-with-PRD analysis, surfaces ADR conflicts if any, gives a view; user accepts or pivots)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 5: TBD (E1 — user asks for implementation during the session; skill refuses with "exit explore mode first" reminder; conversation continues in explore mode)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 6: TBD (E2 — user asks to save analysis to a markdown file; skill refuses; offers handoff to `/draft` or `/setup`; conversation continues in explore mode)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 7: TBD (E3 — project has no AGENTS.md/CLAUDE.md/README; skill falls back to breadth-first scan of docs/, surfaces inferred structure for user confirmation before going deeper)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 8: TBD (E5 — user explicitly invokes `/draft` mid-explore; explore mode ends, control yields, no auto-summary unless user asks)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 9: TBD (E7 — user demands a definitive answer when thinking isn't ripe; skill names what's still undecided, what trade-off the user must own, and what info would firm it up — instead of inventing certainty)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 10: TBD (thinking doesn't crystallise — session ends with clarity-on-uncertainty as the deliverable; no capture offered; no writes)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 11: TBD (skill orients, draws a doc-chain ASCII map showing PRD → UC → spec → ADR + tasks; user uses the map to identify the layer they actually need to change)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

### Scenario 12: TBD (skill uses a comparison table to weigh Option A vs B against fits-PRD-goal / touches-ADR / downstream-impact; user picks Option B with eyes open)

- **Given:** TBD
- **When:** TBD
- **Then:** TBD

## Serves

TBD (will be linked after /compose) — expected target: the pre-drafting / thinking step of the greenfield workflow business US.
