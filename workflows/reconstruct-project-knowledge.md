# Reconstruct Project Knowledge

## Goal

Recover durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

## Entry Conditions

- A repository contains existing behavior, architecture, or constraints that are insufficiently documented.

## Phases

### Phase — Establish Repository Context

#### Goal

Understand the relevant repository area and its available evidence.

#### Required Outcome

Relevant repository structure, existing documentation, instructions, implementation areas, and available evidence are understood.

#### Relevant Governance

- Existing Security Controls and Architecture Constraints when they are evidence for reconstruction.

#### Relevant Rules

- documentation.*
- coding.*
- verification.*
- security.*
- architecture.*

#### Suggested Skills

- collect-context

### Phase — Identify Knowledge Subjects

#### Goal

Divide the repository area into coherent subjects suitable for incremental reconstruction.

#### Required Outcome

Coherent knowledge subjects are identified without using file count or directory structure alone as documentation boundaries.

### Phase — Reconstruct Evidence-Based Knowledge

#### Goal

Recover relevant durable knowledge from available evidence.

#### Required Outcome

Relevant Problem, Governance, and Solution knowledge is reconstructed from existing documentation, source code, tests, configuration, interfaces, deployment definitions, repository history, or user knowledge as appropriate. Reconstructed Acceptance Criteria receive one Requirement owner and concrete scenario preconditions; an independently required cross-Requirement interaction is reconstructed as a Requirement rather than hidden in `Given`. Verification Items identify one bounded Acceptance Criterion evidence responsibility. Normal accepted Project Knowledge needs no status marker; exceptional conclusions are explicitly marked Inferred or Unknown. Existing code is not converted directly into Requirements without evidence that its behavior is intended.

#### Relevant Rules

- Engineering conventions may be reconstructed as Project Rules only when explicit knowledge or strong repository evidence supports them.

### Phase — Resolve Material Uncertainty

#### Goal

Resolve or make visible uncertainty that affects durable knowledge.

#### Required Outcome

Ambiguities that materially affect durable knowledge are resolved from authoritative evidence, clarified with the user, or explicitly recorded as Unknown. Inferred or Unknown knowledge is not materially relied upon without review or clarification.

### Phase — Review Reconstructed Knowledge

#### Goal

Confirm the reconstruction is coherent and usable.

#### Required Outcome

Reconstructed knowledge is semantically consistent with the Knowledge Model, represented according to the active Knowledge Schema, compliant with Project Rules, internally consistent, and explicit about unresolved uncertainty. If it creates or changes normal Project Knowledge, it supplies a proposed delta to `reconcile-project-change`; reconstruction alone does not accept that knowledge.

## Required Outcomes

- The selected repository area has evidence-based durable knowledge suitable for future human and agent work.
- Important inference and unresolved uncertainty remain visible.
