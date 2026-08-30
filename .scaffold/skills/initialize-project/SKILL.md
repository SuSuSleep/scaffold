---
name: initialize-project
description: Establish trusted knowledge, Scaffold guidance, and project structure for useful work to begin.
---

# Initialize Project

## Internal Skill Loading

When a phase names a Suggested Skill, read and apply its project-local instruction at `.scaffold/skills/<skill-name>/SKILL.md` before proceeding. Replace `<skill-name>` with the named skill. Suggested Skills are internal methods, not native user-invoked skills; do not rely on agent skill discovery to load them.

## Goal

Establish sufficient trusted knowledge and project structure for useful work to begin.

## Entry Conditions

- A repository is available.

## Phases

### Phase — Establish Repository Context

#### Goal

Understand the repository and its existing knowledge before introducing Scaffold guidance.

#### Required Outcome

Repository context, existing knowledge, and relevant repository instructions are identified.

#### Relevant Rules

- documentation.*
- coding.*
- verification.*
- security.*
- architecture.*

#### Suggested Skills

- collect-context

### Phase — Resolve Scaffold Guidance

#### Goal

Make the active Knowledge Model and applicable replaceable Scaffold artifacts available to the project.

#### Required Outcome

The active Knowledge Model is available; full-replacement artifacts and the effective Project Rule collection are understood. Host-owned `AGENTS.md` and `CLAUDE.md` integration is preserved or deliberately completed without replacing surrounding host instructions.

### Phase — Establish Initial Knowledge

#### Goal

Create the minimum durable project knowledge needed for useful future work.

#### Required Outcome

Initial project knowledge locations, document types, and applicable template types are established from the active Knowledge Schema and existing repository knowledge. The CLI's Harness directories are not treated as semantic knowledge-layout requirements, and obvious unknowns are recorded.

### Phase — Establish Project Rule Baseline

#### Goal

Determine the project’s initial effective Rule set without inventing engineering conventions.

#### Required Outcome

Applicable existing engineering practices are retained through shared Rules, represented as local additions or same-identity replacements when strong evidence supports them, or deliberately left unresolved. Material shared/local Rule conflicts are reviewed.

#### Relevant Rules

- documentation.*
- coding.*
- verification.*
- security.*
- architecture.*

Establish local Rules only from explicit repository instructions, existing engineering documentation, build or CI conventions, formatter or linter configuration, test structure, or other strong evidence. Do not invent a project convention: leave it undefined or record the uncertainty. Review every established local Rule against the effective shared set, distinguishing a local addition, same-identity replacement, compatible specialization, semantic contradiction, and unknown intent.

## Required Outcomes

- The project has sufficient trusted context and structure for useful work to begin.
