# Scaffold: Portable Knowledge-First Software Development Harness

**Product Requirements Document — v0.2**

Status: Draft  
Target: Initial implementable product definition

---

# 1. Product Vision

The Scaffold is a portable, knowledge-first software development environment for human developers and coding agents.

It provides a reusable foundation for:

- project knowledge;
- documentation structure;
- engineering rules;
- workflows;
- reusable skills;
- project initialization;
- Scaffold updates and migration.

A project should be usable immediately after Scaffold initialization while remaining free to replace default behavior as its own requirements mature.

The core relationship is:

```text
Knowledge
    ↓
Solution
    ↓
Implementation
    ↓
Verification
```

Code is an implementation of project knowledge.

Code is not the sole source of truth for project intent, requirements, constraints, or design reasoning.

---

# 2. Product Principles

## 2.1 Knowledge First

Durable project knowledge SHOULD be explicitly represented when it cannot be safely reconstructed from code.

Examples include:

- business intent;
- requirements;
- external obligations;
- security controls;
- architectural boundaries;
- important design decisions;
- verification expectations.

---

## 2.2 Markdown First

Human-readable Markdown is the primary representation for:

- Knowledge Schema;
- Project Rules;
- Workflows;
- Skills;
- project knowledge.

The Scaffold MUST NOT require structured configuration for core operation.

Structured metadata MAY be introduced later when a concrete requirement justifies it.

---

## 2.3 Explicit Replacement

Project customization uses **replacement by default**.

If a project-local artifact exists for a replaceable Scaffold artifact, the project-local artifact becomes authoritative.

The Scaffold MUST NOT implicitly:

- merge sections;
- extend lists;
- combine fields;
- resolve inheritance hierarchies.

Example:

```text
Shared:
workflows/implement-change.md

Project:
.scaffold/workflows/implement-change.md
```

Result:

```text
Use project workflow.
Ignore shared workflow for this artifact.
```

---

## 2.4 Agent-Oriented Interpretation

The first product version relies on agent reasoning for:

- Knowledge Schema interpretation;
- Project Rule enforcement;
- documentation consistency;
- semantic traceability;
- relationship validation.

A deterministic schema engine is explicitly outside the initial product scope.

---

## 2.5 Workflow over Framework Complexity

When replacement alone cannot safely handle a change, the Scaffold SHOULD introduce a dedicated Workflow rather than increasingly complex inheritance or merge semantics.

Examples:

```text
migrate-knowledge-schema
upgrade-project-scaffold
adopt-new-security-policy
```

---

## 2.6 Small Skills

Skills SHOULD remain concise and tactical.

A Skill answers:

> How should one reusable activity be performed?

A Skill SHOULD NOT own:

- project policy;
- domain knowledge;
- complete development lifecycle logic;
- repository-specific assumptions unless the Skill itself is intentionally project-local.

---

## 2.7 Goal-Oriented Workflows

A Workflow defines:

- why the work exists;
- what must be true before it begins;
- what outcomes must be achieved;
- what conditions may require additional work;
- which Skills may help.

A Workflow SHOULD NOT duplicate reusable procedural guidance already represented by Skills.

---

# 3. Product Goals

## 3.1 Harness Architecture and Lifecycle

The Knowledge Model is a Harness-owned, non-replaceable semantic contract. The Knowledge Schema, Project Rules, Workflows, Skills, and Templates are project-replaceable artifacts. Project Knowledge remains project-owned durable truth; `AGENTS.md` and `CLAUDE.md` are host-owned integration files whose surrounding content Scaffold MUST NOT replace.

Replacement is explicit: when a project-local replaceable artifact exists it is used in full, otherwise the shared artifact is used. Scaffold MUST NOT implicitly merge either form. The dependency direction is Knowledge Model → Knowledge Schema → Template → Project Knowledge. Template resolution is mechanical, but the active Knowledge Schema alone determines whether a template type applies.

The normal lifecycle is `initialize-project` → `define-change` → `review-change` → `implement-change`. `define-change` produces a sufficiently defined proposed change, `review-change` establishes semantic correctness, representation compliance, relationship consistency, project-constraint compliance, and acceptance, and `implement-change` realizes an accepted change.

Package upgrades activate new shared guidance immediately. `status` reports update-review drift and shadowed shared artifacts; `adopt-harness-update` reviews changed guidance, Active Conflicts, Shadow Drift, required project-owned adjustments, migration need, and consistency. Only then may `scaffold update` record the running version as reviewed. Scaffold MUST NOT automatically migrate semantic project knowledge merely because default Schema or Template artifacts changed.

Core CLI initialization establishes deterministic Harness infrastructure only. Representation-specific knowledge locations and files are established by `initialize-project` according to the active Knowledge Schema and existing repository knowledge.

The Scaffold MUST provide:

1. portable initialization across repositories;
2. usable defaults without prior customization;
3. project-specific Knowledge Schema replacement;
4. project-specific Project Rule replacement;
5. reusable Workflows;
6. concise reusable Skills;
7. CLI-managed installation and updates;
8. incremental brownfield adoption;
9. durable learning from security, operational, and engineering findings;
10. clear resolution between shared defaults and project-local artifacts.

---

# 4. Non-Goals

The initial Scaffold is not intended to:

- replace Git;
- replace issue trackers;
- replace CI/CD;
- replace project management tools;
- require Scrum or another process methodology;
- require TDD;
- require a knowledge graph;
- require a vector database;
- implement deterministic semantic validation;
- automatically reconcile conflicting documentation;
- maintain backward compatibility through configuration inheritance;
- preserve all temporary execution artifacts as long-term knowledge.

---

# 5. Terminology

## 5.1 Knowledge Model

Shared semantic vocabulary describing what kinds of durable knowledge exist.

Examples:

- Actor;
- Goal;
- Motivation;
- Use Case;
- Requirement;
- Capability;
- Decision;
- Design;
- Test;
- Security Control;
- External Contract.

The Knowledge Model describes meaning, not file format.

---

## 5.2 Knowledge Schema

Project-specific contract defining how project knowledge is represented.

It may define:

- document types;
- document structure;
- required sections;
- expected content;
- identifiers;
- relationships;
- traceability expectations.

Knowledge Schema is primarily expressed in Markdown.

---

## 5.3 Project Rules

Project-specific engineering constraints and preferences.

Examples:

- production behavior changes must use TDD;
- breaking API changes require approval;
- untrusted input must not reach shell interpretation;
- externally observable behavior changes require Problem Space updates.

---

## 5.4 Workflow

Reusable definition of a category of work. A Workflow owns sequencing through ordered Phases; each Phase owns local intent and a required outcome. A Workflow also states its overall required outcomes and conditional outcomes.

In short: **Workflow owns sequencing; Phase owns intent; Outcome owns completion; Skill owns method.**

Examples:

- initialize project;
- implement change;
- update knowledge;
- learn from finding.

---

## 5.5 Skill

Concise reusable guidance for performing an activity.

Examples:

- collect context;
- analyze impact;
- implement with TDD;
- verify change.

---

## 5.6 Project Knowledge

Actual durable knowledge describing a specific project.

---

## 5.7 Execution Artifact

Temporary or historical work information.

Examples:

- task;
- issue;
- sprint;
- pull request;
- commit;
- temporary implementation plan.

Execution artifacts MAY reference durable knowledge but do not replace it.

---

# 6. Knowledge Architecture

The default Scaffold recognizes three major knowledge spaces.

```text
Problem Space
Context & Governance Space
Solution Space
```

These spaces describe different sources and responsibilities of knowledge.

---

# 7. Problem Space

Problem Space describes the problem without coupling it to implementation.

It may contain:

- Business Intent;
- Actor;
- Business Goal;
- Motivation;
- Use Case;
- Requirement;
- Acceptance Criteria;
- Domain Concepts.

Problem Space SHOULD answer:

```text
Why does this need exist?
Who needs it?
What outcome is required?
What externally observable behavior is expected?
```

Problem Space SHOULD avoid unnecessary implementation terminology.

---

# 8. Context and Governance Space

Context and Governance Space captures obligations that do not originate directly from business workflows.

It may contain:

- External Systems;
- Interface Contracts;
- Platform Constraints;
- Engineering Policies;
- Security Findings;
- Security Controls;
- Prohibited Patterns;
- Operational Constraints;
- Compliance Requirements;
- reusable engineering knowledge.

Example:

```text
Vulnerability Finding
        ↓
Root Cause
        ↓
Security Control
        ↓
Security Requirement
```

This prevents a project from repeatedly solving the same class of vulnerability without preserving the learned rule.

---

# 9. Solution Space

Solution Space describes how applicable requirements are realized.

It may contain:

- Capability;
- Architecture;
- Components;
- Modules;
- Interfaces;
- State Models;
- Data Models;
- Design;
- Decision;
- Technical Constraints;
- Verification Strategy.

Solution Space SHOULD answer:

```text
How will the requirement be satisfied?
What responsibilities exist?
What technical choices were made?
How is the resulting behavior verified?
```

---

# 10. Requirement Model

Requirement is a central obligation object.

A Requirement MAY originate from:

```text
Business Goal
Use Case
External Contract
Security Control
Operational Incident
Engineering Policy
Platform Constraint
Compliance Obligation
Another Requirement
```

The Scaffold SHOULD preserve enough context to answer:

> Why does this Requirement exist?

The Scaffold SHOULD NOT assume that all Requirements are business requirements.

---

# 11. Knowledge Representation Strategy

The Scaffold adopts the principle:

> Conceptually structured, physically coherent.

Knowledge objects may have clear semantic identities without requiring one physical file per object.

The default representation SHOULD favor sufficiently contextual Markdown documents over excessive fragmentation.

A project MAY use a more granular representation through its own Knowledge Schema.

---

# 12. Default Knowledge Schema

The Scaffold MUST provide a usable default Knowledge Schema.

The default Schema SHOULD define at least:

```text
Problem Document
Solution Document
Governance Document
```

The exact initial templates MAY remain intentionally minimal.

The default Schema SHOULD optimize for:

- readability;
- sufficient context;
- AI retrieval reliability;
- low maintenance overhead;
- traceability.

---

# 13. Project Knowledge Schema

A project MAY replace the default Knowledge Schema.

Example:

```text
.scaffold/knowledge-schema.md
```

If the project-specific Schema exists:

```text
Project Knowledge Schema
        ↓
becomes authoritative
```

The shared default Schema MUST NOT be implicitly merged with it.

A project-specific Schema is responsible for being sufficiently complete for the project.

---

# 14. Knowledge Relationships

The default Knowledge Schema SHOULD establish guidance such as:

```text
Requirement
    ← derived from —
Goal / Use Case / Governance / External Context

Solution
    ← satisfies —
Requirement

Design
    ← realizes —
Solution responsibility

Test / Verification
    ← verifies —
Requirement or Design expectation
```

Many-to-many relationships are allowed.

Example:

```text
REQ-A ───┐
         ├── CAP-X
REQ-B ───┘

REQ-B ─────── CAP-Y
```

The Scaffold MUST NOT force these relationships into a tree structure.

---

# 15. Project Rules

The Scaffold MUST provide default Project Rules.

A project MAY replace them through:

```text
.scaffold/project-rules.md
```

When present, project-local rules become authoritative.

Project Rules may govern:

- coding practice;
- testing practice;
- compatibility;
- security;
- architecture;
- documentation updates;
- review requirements;
- technology-specific restrictions.

---

# 16. Workflows

The Scaffold MUST support reusable Workflows.

Each Workflow SHOULD contain only the structure needed to guide work.

Recommended format:

```markdown
# <Workflow Name>

## Goal

## Entry Conditions

## Phases

### Phase — <Name>

#### Goal

#### Required Outcome

#### Suggested Skills

## Required Outcomes

## Conditional Outcomes
```

Additional sections MAY be used when they materially improve the Workflow.

---

# 17. Default Workflows

The initial Scaffold SHOULD include at least the following Workflows.

## 17.1 Initialize Project

Goal:

> Establish sufficient trusted knowledge and project structure for useful work to begin.

Required outcomes SHOULD include:

- repository context understood;
- existing knowledge identified;
- applicable shared defaults and local replacements resolved;
- initial project knowledge established;
- obvious unknowns identified.

---

## 17.2 Define and Review Change

The primary lifecycle is:

```text
initialize-project
      ↓
define-change
      ↓
review-change
      ↓
implement-change
```

`define-change` produces a sufficiently defined proposed durable change. `review-change` establishes semantic correctness, representation compliance, relationship consistency, project-constraint compliance, and acceptance before implementation begins.

## 17.3 Implement Change

Goal:

> Bring the implementation into compliance with an accepted change while preserving knowledge consistency.

Typical required outcomes:

- sufficient context established;
- relevant requirements identified;
- affected scope understood;
- required knowledge updated;
- implementation completed;
- verification completed;
- durable discoveries reconciled.

---

## 17.4 Update Knowledge

Goal:

> Change durable project knowledge while preserving internal logical consistency.

Typical outcomes:

- authoritative document identified;
- intended semantics updated;
- dependent knowledge reviewed;
- obsolete knowledge corrected or removed;
- project Schema respected.

---

## 17.5 Reconstruct Project Knowledge

Goal:

> Recover durable project knowledge from an existing repository without treating implementation as unquestionable project intent.

The Workflow SHOULD establish repository context, select coherent knowledge subjects, reconstruct evidence-based knowledge, resolve material uncertainty, and review the result. It MUST distinguish knowledge that is Known, Inferred, and Unknown.

## 17.6 Learn From Finding

Goal:

> Convert a discovered problem into durable reusable knowledge when appropriate.

Applicable sources MAY include:

- vulnerability findings;
- production incidents;
- defects;
- architectural discoveries;
- unsafe coding patterns;
- external constraints.

Typical reasoning chain:

```text
Finding
   ↓
Root Cause
   ↓
Generalization
   ↓
Durable Rule / Requirement
   ↓
Solution Change
   ↓
Verification
```

---

# 18. Project-Local Workflows

Projects MAY replace shared Workflows.

Resolution follows normal replacement semantics.

Example:

```text
Shared:
workflows/implement-change.md

Project:
.scaffold/workflows/implement-change.md
```

The project Workflow replaces the shared Workflow.

If a project needs behavior that is substantially different rather than a simple replacement of an existing Workflow, a new Workflow SHOULD be created.

Example:

```text
workflows/
├── implement-change.md
└── implement-safety-critical-change.md
```

The Scaffold SHOULD prefer explicit Workflow specialization over hidden conditional complexity.

---

# 19. Skills

The Scaffold SHOULD provide a small default Skill set.

A Skill SHOULD:

- be concise;
- be task-oriented;
- contain high-signal guidance;
- avoid unnecessary schema;
- be reusable across Workflows;
- avoid project-specific policy unless project-local.

A Skill does not require extensive metadata unless a real use case justifies it.

---

# 20. Default Skills

Initial candidates:

```text
collect-context
analyze-impact
derive-requirements
derive-test-cases
implement-with-tdd
verify-change
update-knowledge
generalize-finding
```

The initial implementation MAY provide fewer Skills if some candidates do not yet justify independent reusable guidance.

The product SHOULD resist unnecessary Skill proliferation.

---

# 21. Workflow and Skill Roles

Workflows MAY suggest Skills within a Phase, but Skill names do not define a Workflow's sequencing or completion criteria. A Phase can be completed without a Skill when its required outcome is achieved. Project Rules may require a method such as TDD without changing the Workflow.

---

# 22. Context Collection

Information collection is a reusable activity and SHOULD be implemented as a Skill rather than duplicated across Workflows.

The `collect-context` Skill SHOULD help agents gather sufficient context from sources such as:

- current user request;
- Project Knowledge;
- Project Rules;
- Knowledge Schema;
- source code;
- tests;
- repository instructions;
- external references when necessary.

The Workflow defines that context must be sufficient.

The Skill defines how context is collected.

---

# 23. Implementation Method Flexibility

The default `Implement Change` Workflow MUST NOT require TDD.

A project may define:

```text
Project Rule:
Production behavior changes MUST use TDD.
```

The Workflow may then use:

```text
implement-with-tdd
```

Another project may use a different implementation Skill or practice.

Therefore:

```text
Workflow
= invariant work outcome

Skill
= implementation strategy
```

---

# 24. Artifact Resolution

The Scaffold MUST use simple artifact resolution.

For each replaceable artifact:

```text
Does a project-local version exist?
              │
        ┌─────┴─────┐
       Yes          No
        │            │
        ▼            ▼
 Project artifact   Shared default
```

No implicit merge occurs.

---

# 25. Initial Project Layout

A bootstrapped repository SHOULD resemble:

```text
project/
├── .scaffold/
│   ├── metadata.md
│   ├── agent-guide.md
│   ├── knowledge-schema.md        # optional override
│   ├── project-rules.md           # optional override
│   ├── workflows/                 # optional replacements/additions
│   └── skills/                    # optional replacements/additions
└── <existing project files>
```

The CLI establishes only Harness infrastructure. The active Knowledge Schema and `initialize-project` Workflow establish any project knowledge locations, document types, and applicable templates. `AGENTS.md` and `CLAUDE.md` are host-owned integration files: Scaffold creates them only when absent and otherwise preserves surrounding host content.

---

# 26. Shared Scaffold Layout

The distributed Scaffold SHOULD conceptually contain:

```text
scaffold/
├── knowledge-model/
├── defaults/
│   ├── knowledge-schema.md
│   ├── project-rules.md
│   └── templates/
│
├── workflows/
├── skills/
└── cli/
```

The precise physical packaging is an implementation decision.

---

# 27. CLI-Managed Installation

Scaffold installation and lifecycle MUST be managed by a CLI.

The CLI is responsible for operations such as:

```text
initialize Scaffold in repository
inspect installed Scaffold state
apply Scaffold updates
record completion of update reviews
```

Illustrative commands:

```text
scaffold init
scaffold status
scaffold update
```

These command names are not yet normative.

---

# 28. CLI Initialization

Initialization SHOULD:

1. inspect whether Scaffold state already exists;
2. establish Scaffold metadata;
3. create the minimum required project structure;
4. make default artifacts available;
5. avoid unnecessary project-local copies of unchanged defaults;
6. initialize project knowledge through the appropriate Workflow.

Initialization MUST NOT require manual copying of Scaffold files.

---

# 29. Scaffold Metadata

Each installed project SHOULD record the Scaffold version or revision last reviewed through `adopt-harness-update`.

Example:

```markdown
# Scaffold Metadata

Last Reviewed Scaffold Version: 0.2.0
```

Version information is used for:

- inspection;
- upgrade planning;
- migration reasoning.

It is NOT an automatic compatibility contract.

---

# 30. Scaffold Updates

The CLI SHOULD support updating an installed Scaffold.

The default update philosophy is:

> Replace shared defaults rather than preserve old behavior through implicit compatibility layers.

Project-local replacements remain explicit project-owned artifacts.

The update mechanism MUST distinguish between:

```text
Shared Scaffold artifact
Project-local replacement
```

An updated shared artifact MUST NOT silently overwrite a project-local replacement.

`adopt-harness-update` is the semantic review: it identifies changed guidance, active conflicts, shadow drift, required project-owned adjustments, migration need, and consistency concerns. `scaffold update` is not a deterministic workflow-state validator. It records the caller's attestation that this review is complete and the running Harness version has been reviewed.

---

# 31. Migration

When an update cannot be handled safely through ordinary replacement semantics, a dedicated Workflow SHOULD handle the migration.

Examples:

```text
migrate-knowledge-schema
upgrade-scaffold-layout
adopt-new-workflow-model
```

A migration Workflow MAY:

- inspect old state;
- inspect new Scaffold behavior;
- identify project-local replacements;
- transform project knowledge;
- request user decisions where semantics cannot be safely inferred.

The core artifact-resolution model MUST remain simple even when migrations are complex.

---

# 32. Agent-Only Validation

The initial Scaffold uses agent reasoning to determine whether:

- documentation follows the active Knowledge Schema;
- required relationships are present;
- Project Rules are satisfied;
- Workflows have achieved required outcomes;
- project knowledge is internally consistent.

The initial product MUST NOT depend on a deterministic validation engine.

Agents SHOULD report uncertainty rather than fabricate missing semantic relationships.

---

# 33. Knowledge Update Threshold

Not every implementation change requires documentation changes.

Durable knowledge SHOULD be updated when changes affect:

- externally observable behavior;
- requirements;
- interfaces;
- system responsibilities;
- architectural boundaries;
- state semantics;
- important data semantics;
- security assumptions;
- reusable engineering constraints;
- meaningful design decisions.

Knowledge updates are generally unnecessary for purely mechanical changes such as:

- formatting;
- local renaming;
- equivalent refactoring;
- implementation details with no durable reasoning value.

---

# 34. Implementation-Discovered Knowledge

Agents and developers may discover durable knowledge during implementation.

They SHOULD NOT leave important discoveries only in code or temporary discussion.

The expected feedback loop is:

```text
Existing Knowledge
       ↓
Implementation
       ↓
Discovery
       ↓
Knowledge Update
       ↓
Continue / Verify
```

Examples include:

- undocumented external dependency;
- previously unknown security risk;
- hidden protocol requirement;
- incorrect existing requirement;
- important architectural constraint.

---

# 35. Security Learning

A security fix is incomplete as organizational learning if only a code patch remains.

When appropriate, the Scaffold SHOULD support:

```text
Specific Finding
      ↓
Reusable Security Knowledge
      ↓
Applicable Requirement
      ↓
Safe Design
      ↓
Implementation
      ↓
Verification
```

Reusable security knowledge SHOULD preserve relevant conditions.

Example:

Bad:

```text
Never use subprocess.
```

Better:

```text
Do not pass untrusted or partially trusted values through
shell-interpreted command construction.

Prefer direct executable invocation with structured,
validated arguments.
```

The Scaffold SHOULD avoid converting contextual risks into inaccurate universal prohibitions.

---

# 36. Brownfield Adoption

The Scaffold MUST support existing repositories.

Brownfield initialization MUST NOT require:

- rewriting all existing documentation;
- documenting every existing behavior;
- restructuring the entire codebase;
- reconstructing all historical design decisions.

Adoption SHOULD be incremental.

Initial knowledge SHOULD focus on information required for current and future safe development.

---

# 37. Greenfield Adoption

A new repository SHOULD be able to start with:

- default Knowledge Schema;
- default Project Rules;
- default Workflows;
- default Skills.

The user MAY immediately customize them, but customization is not required before useful work begins.

---

# 38. Source-of-Truth Boundaries

The Scaffold SHOULD maintain the following conceptual boundaries:

```text
Project Knowledge
= durable truth, intent, obligation, reasoning

Code
= implementation

Tests
= executable verification evidence

Execution Artifacts
= work history
```

When these disagree, the system is considered inconsistent.

Agents MUST analyze the inconsistency rather than automatically privileging one source without context.

---

# 39. Execution Artifacts

Execution artifacts are outside the durable Knowledge Model by default.

Examples:

```text
Task
Issue
Sprint
Pull Request
Commit
Release
```

They MAY contain references such as:

```text
Implements: REQ-021
Related Design: DES-004
Verifies: TEST-018
```

Long-term system reasoning SHOULD NOT depend exclusively on these temporary records.

---

# 40. Product-Level Resolution Rules

The following decisions are normative for v0.2.

## RD-01 — Representation

Markdown-first.

---

## RD-02 — Customization

Replace by default.

No implicit merge.

---

## RD-03 — Distribution

CLI-managed installation and lifecycle.

---

## RD-04 — Validation

Agent-only semantic validation in the initial version.

---

## RD-05 — Evolution

Replacement remains the default evolution model.

When replacement is insufficient, introduce a dedicated migration or specialized Workflow rather than configuration inheritance complexity.

---

# 41. Acceptance Criteria

## AC-01 — New Repository Bootstrap

A user can initialize a new repository through the CLI and begin using the default Scaffold without defining a custom Knowledge Schema.

---

## AC-02 — Brownfield Bootstrap

A user can initialize the Scaffold in an existing repository without restructuring the entire repository.

---

## AC-03 — Default Operation

A project without local replacements can use shared:

- Knowledge Schema;
- Project Rules;
- Workflows;
- Skills.

---

## AC-04 — Schema Replacement

A project can provide its own `knowledge-schema.md`, and agents use it instead of the shared default Schema.

---

## AC-05 — Rule Replacement

A project can provide its own `project-rules.md`, and agents use it instead of shared default rules.

---

## AC-06 — Workflow Replacement

A project can replace `implement-change` without modifying the shared Scaffold.

---

## AC-07 — New Workflow

A project can introduce a new Workflow when existing Workflow semantics are insufficient.

---

## AC-08 — Skill Reuse

The same shared Skill can be used by multiple Workflows and multiple projects.

---

## AC-09 — Implementation Strategy Flexibility

Two projects can use the same `Implement Change` Workflow while using different implementation strategies.

---

## AC-10 — CLI Installation

Scaffold files and metadata can be initialized through the CLI without manual file copying.

---

## AC-11 — Update Protection

Updating shared Scaffold content does not silently overwrite project-local replacements.

---

## AC-12 — Migration Workflow

A Scaffold upgrade that cannot be represented by ordinary replacement can invoke or instruct a dedicated migration Workflow.

---

## AC-13 — Scaffold Version Awareness

The project can determine which Scaffold version or revision its installation is based on.

---

## AC-14 — Requirement Origin

For an important Requirement, an agent can determine why it exists from project knowledge or explicitly report that its origin is missing.

---

## AC-15 — Solution Traceability

For an important Solution decision, an agent can identify related Requirements or constraints where such relationships are required by the active Knowledge Schema.

---

## AC-16 — Security Learning

A reusable unsafe pattern discovered through a vulnerability finding can be preserved as durable governance knowledge and applied to later work.

---

## AC-17 — Agent Validation

An agent can inspect active Schema, Rules, Workflow, and relevant project knowledge and report meaningful inconsistencies without requiring a deterministic validator.

---

# 42. Initial Implementation Scope

The first implementation milestone SHOULD include:

```text
CLI
├── initialization
├── status / metadata inspection
└── basic update behavior

Defaults
├── Knowledge Schema
├── Project Rules
├── Problem template
├── Solution template
└── Governance template

Workflows
├── initialize-project
├── define-change
├── review-change
├── implement-change
├── update-knowledge
├── reconstruct-project-knowledge
├── learn-from-finding
├── adopt-harness-update
└── migrate-project

Skills
├── collect-context
├── analyze-impact
├── implement-with-tdd
└── verify-change
```

The exact initial Skill list MAY be reduced if individual Skills do not yet provide enough distinct reusable value.

---

# 43. Deferred Scope

The following capabilities are intentionally deferred:

- deterministic Knowledge Schema validation;
- structured schema language;
- automatic field-level merge;
- configuration inheritance;
- centralized Scaffold server;
- knowledge graph storage;
- vector search infrastructure;
- multi-agent scheduling;
- automatic issue tracker integration;
- automatic PR generation;
- organization-wide policy distribution;
- automatic semantic migration.

These may be introduced later only when concrete requirements justify the added complexity.

---

# 44. Implementation Priorities

The recommended product implementation order is:

```text
1. Repository and artifact resolution model
        ↓
2. CLI bootstrap
        ↓
3. Default Knowledge Schema and templates
        ↓
4. Default Project Rules
        ↓
5. Core Workflows
        ↓
6. Minimal Skills
        ↓
7. CLI update behavior
        ↓
8. Migration Workflow support
```

This order prioritizes a usable portable Scaffold before advanced automation.

---

# 45. Product Success Criteria

The Scaffold succeeds when a user can:

```text
Install once
    ↓
Apply to a repository
    ↓
Use useful defaults immediately
    ↓
Replace project-specific knowledge conventions
    ↓
Replace project-specific rules
    ↓
Reuse common Workflows and Skills
    ↓
Evolve the project without losing durable reasoning
```

without turning the Scaffold itself into a rigid development framework.

---

# 46. Final Product Principle

The Scaffold should optimize for:

> Explicit knowledge, simple replacement, reusable guidance, and project-level freedom.

The goal is not to make every project identical.

The goal is to make different projects operable through the same conceptual Scaffold while keeping their domain knowledge, engineering constraints, and documentation practices independently adaptable.
