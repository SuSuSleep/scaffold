# Selective Guidance Consumption

Document ID: PROB-005

## Intent

Scaffold must preserve the distinction between durable Governance and Project Rules while enabling agents to load only the guidance relevant to the current work phase.

## Actors and Goals

- **Developer or coding agent**: collect sufficient, applicable Governance and Project Rules without loading unrelated guidance.
- **Project owner**: retain durable Governance as independently evolvable project knowledge and Project Rules as work guidance.

## Use Cases

- An agent collects context for a Workflow Phase with a defined goal and required outcome.
- A Workflow or Skill identifies relevant Governance and Rule categories without hard-coding project-specific guidance paths.

## Requirements

### REQ-010 — Selective guidance consumption

The Harness must keep durable Governance separate from Project Rules and enable agents to consume only the Governance and Rules relevant to the current Workflow Phase.

## Acceptance Criteria

### AC-014 — Agents consume only relevant durable guidance

For:

- REQ-010 — Selective guidance consumption

Given:

- a Workflow Phase has a defined goal and required outcome.

When:

- an agent collects work context.

Then:

- it resolves the applicable Governance and Rules semantically without loading all guidance by default.

## Related Knowledge

- SOL-005#CAP-001 — Selective guidance context resolution.
- SOL-005#CAP-002 — Rule-guided verification approach.
- SOL-003#CAP-002 — Deliberate guidance authority.
