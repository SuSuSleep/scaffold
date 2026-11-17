---
name: initialize-project
description: Establish trusted knowledge, Scaffold guidance, and project structure for useful work to begin.
---

# Initialize Project

## Goal

Establish sufficient trusted knowledge and project structure for useful work to begin.

## Entry Conditions

- A repository is available.

## Phases

### Phase — Establish Repository Context

#### Goal

Understand the repository and its existing knowledge before introducing Scaffold guidance.

#### Required Outcome

Repository context, existing knowledge, and relevant repository instructions are identified from the smallest sufficient available evidence, such as project documentation, source, tests, CI or build configuration, and team-maintained delivery material.

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

The complete active project-local Harness is available, including its Knowledge Model, Schema, Skills, Templates, and Rule collection. Host-owned `AGENTS.md` and `CLAUDE.md` integration is preserved or deliberately completed without replacing surrounding host instructions.

### Phase — Establish Foundational Project Knowledge

#### Goal

Establish the minimum external-facing Project Knowledge that lets people work usefully in the project.

#### Required Outcome

Project purpose, stakeholder or project goals, project-specific domain terms and glossary, scope or exclusions, and material unknowns are recorded from existing repository evidence or explicit project context in the applicable foundational knowledge records.

When repository evidence sufficiently establishes proposed foundational knowledge, present the evidence-derived content to the project maintainer and ask them to confirm or correct it before recording. When evidence is insufficient, including for a greenfield repository, ask the maintainer direct questions for the needed context without inventing or suggesting project-specific answers. Do not record foundational knowledge until the maintainer has supplied, confirmed, or corrected its content. These are agent-run workflow responsibilities; they do not change CLI behavior.

Do not require requirements and acceptance scenarios, architecture, integrations and external contracts, security and operational constraints, or Harness customization for this baseline. Establish them later when discovery or a change workflow makes them relevant.

#### Relevant Rules

- core.*

### Phase — Establish Project Rule Baseline

#### Goal

Determine whether the materialized project-local Rule baseline needs project-specific adjustment without inventing engineering conventions.

#### Required Outcome

Applicable code and style conventions, reusable testing practices and quality gates, and Git, pull-request, branching, and release conventions are compared with the materialized local Rule baseline and retained, revised, or deliberately left unresolved. Applicable local Rules are created or revised from evidence; unsupported practices remain undefined. Material Rule conflicts are reviewed.

#### Relevant Rules

- core.*
- documentation.*
- coding.*
- verification.*
- security.*
- architecture.*

Revise local Rules only from explicit repository instructions, existing engineering documentation, build or CI conventions, formatter or linter configuration, test structure, or other strong evidence. Do not invent a project convention: leave it undefined or record the uncertainty. Review overlapping local Rules for compatible specialization, semantic contradiction, redundancy, or unknown intent.

## Required Outcomes

- The project has a lightweight, evidence-based foundation: terms and goals as Project Knowledge, plus code, testing, and delivery conventions as Project Rules.
- Later discovery- or change-driven knowledge is not required before useful work begins.
