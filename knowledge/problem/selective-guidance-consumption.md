# Selective Guidance Consumption

## Intent

Scaffold must preserve the distinction between durable Governance and Project Rules while enabling agents to load only the guidance relevant to the current work phase.

Interaction context:

- An agent collects context for a Workflow Phase with a defined goal and required outcome.
- A Workflow or Skill identifies relevant Governance and Rule categories without hard-coding project-specific guidance paths.

## Actors and Goals

- **Developer or coding agent**: collect sufficient, applicable Governance and Project Rules without loading unrelated guidance.
- **Project owner**: retain durable Governance as independently evolvable project knowledge and Project Rules as work guidance.

## Requirements

<a id="phase-relevant-guidance-consumption"></a>

### Phase-relevant guidance consumption

The Harness must keep durable Governance separate from Project Rules and enable agents to consume only the Governance and Rules relevant to the current Workflow Phase.

Relationships:

- Satisfied-by: [Selective guidance context resolution](../solution/governance-context-resolution.md#selective-guidance-context-resolution).
- Satisfied-by: [Rule-guided verification approach](../solution/governance-context-resolution.md#rule-guided-verification-approach).
- Related-to: [Deliberate guidance authority](../solution/knowledge-architecture.md#deliberate-guidance-authority).

## Acceptance Criteria

<a id="agents-consume-only-relevant-durable-guidance"></a>

### Agents consume only relevant durable guidance

For:

- [Phase-relevant guidance consumption](#phase-relevant-guidance-consumption)

Given:

- a Workflow Phase has a defined goal and required outcome.

When:

- an agent collects work context.

Then:

- it resolves the applicable Governance and Rules semantically without loading all guidance by default.
