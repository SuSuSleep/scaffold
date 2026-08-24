# Default Knowledge Model

## Purpose

This model defines Scaffold's default meaning of durable project knowledge. It is authoritative when a project does not provide `.scaffold/knowledge-model.md`; that project-local Model fully replaces this default and is never implicitly merged with it.

> The active Knowledge Model defines semantic concepts and relationships. The active Knowledge Schema defines how those concepts are organized, represented, identified, and linked in project artifacts.

The active Knowledge Model defines what knowledge means. The active Knowledge Schema may change its representation without redefining the active Model's concepts or relationships. This default model is independent of document types, filenames, folder layout, Markdown headings and ordering, field layouts, identifier formatting, relationship encoding, templates, validation syntax, implementation workflow, coding standards, and project-specific policy.

## Knowledge Architecture

Durable knowledge belongs primarily to three connected spaces:

- **Problem Space**: intended outcomes and externally meaningful obligations, without unnecessarily prescribing realization.
- **Governance Space**: reusable or external obligations, evidence, controls, environmental conditions, and rationale that constrain project behavior beyond one business workflow.
- **Solution Space**: intentional technical structure that realizes applicable obligations.

The spaces form a graph, not a fixed hierarchy. Problem obligations, Governance obligations, and external constraints may all shape Solution knowledge.

## Problem Space

Problem Space answers why a need exists, who is affected, what outcome is expected, what must be true, and how satisfaction can be observed.

### Actor

An **Actor** is an external participant in the problem domain: a person, role, organization, or external system. An internal implementation Component is not an Actor merely because it communicates internally.

### Goal

A **Goal** is an outcome an Actor or stakeholder wants to achieve. It states what matters, not how a solution implements it. A Goal may motivate one or more Use Cases or Requirements.

### Motivation

**Motivation** states why achieving a Goal matters. Keep it distinct from the Goal. For example, recovering failed jobs is a Goal; reducing operator intervention and downtime is its Motivation.

### Use Case

A **Use Case** is a coherent, externally meaningful interaction through which an Actor pursues a Goal. It should not describe internal implementation sequencing unless an interface is itself part of the external contract.

### Requirement

A **Requirement** is one durable obligation the system or solution must satisfy. It may be derived from a Goal, Use Case, Governance Control, External Contract, Constraint, compliance obligation, or another Requirement. A Requirement owns its Acceptance Criteria. Preserve enough context to explain why it exists, and do not assume every Requirement originates from business intent.

### Acceptance Criteria

An **Acceptance Criterion** is an observable scenario under which its one primary parent Requirement is accepted as satisfied. It states explicit, observable preconditions, a trigger or action, and expected observations without prescribing implementation. A Requirement may own multiple Acceptance Criteria, and an Acceptance Criterion may be demonstrated through multiple Verification Items.

Dependency context does not imply acceptance ownership. Express a prerequisite as a concrete, observable scenario precondition rather than sharing an Acceptance Criterion between Requirements. If cross-Requirement behavior is itself an obligation, represent it as its own Requirement rather than hiding it in a precondition.

## Governance Space

Governance Space answers what reusable or external constraint, evidence, or rationale exists, why it exists, where it applies, and which project obligations follow from it. Governance may be project-wide in scope without being relevant to every activity; applicability determines selective consumption.

### External Contract

An **External Contract** is an obligation imposed by interaction with an external system or boundary, such as an API contract, event schema, authentication protocol, data format, or compatibility expectation. It may derive Integration Requirements or constrain Interfaces.

### Finding

A **Finding** is evidence that a relevant condition, defect, vulnerability, or risk has been observed, such as a SAST result, penetration-test result, production incident observation, or architecture-review result. A Finding is evidence, not automatically a reusable rule. Generalize it into a Control, Constraint, or Requirement only after appropriate analysis.

### Policy or Standard

A **Policy** or **Standard** is an externally established reusable expectation, such as an organizational security policy, platform standard, regulatory requirement, or architecture standard. Determine applicability before deriving project-specific obligations.

### Control

A **Control** is a reusable obligation intended to prevent, reduce, detect, or contain an identified class of risk. It should preserve rationale, applicability, relevant conditions, and useful safe alternatives. A Control may derive one or more Requirements.

### Constraint

A **Constraint** is a condition within which the solution must operate, such as no public internet access, use of an existing platform, or an external token lifetime. It may constrain Solution knowledge directly or derive a Requirement.

### Applicability

**Applicability** states the scope and conditions under which Governance knowledge applies. It may refer to components, data classes, trust boundaries, runtime environments, programming contexts, or types of change. Governance knowledge must not be interpreted as universal when correctness or safety depends on context.

## Solution Space

Solution Space answers which ability must be provided, what responsibilities exist, where they are assigned, which boundaries and interactions exist, what technical structure realizes them, why important choices were made, and how expectations will be verified.

### Capability

A **Capability** is an ability the solution provides to satisfy one or more obligations, such as task scheduling, credential management, audit logging, or model deployment. It is neither a Business Goal nor a Requirement, and it is not necessarily a Component.

### Responsibility

A **Responsibility** defines what a solution element must own or be accountable for. Identify Responsibilities before unnecessary physical decomposition.

### Component

A **Component** is a concrete architectural unit assigned one or more Responsibilities. Do not invent a Component simply because a Requirement exists.

### Interface

An **Interface** is an interaction boundary between Components, systems, external Actors, or external services. It may be an API, event, protocol, file contract, or internal component boundary, and may be constrained by External Contracts, Requirements, Controls, or Solution Responsibilities.

### Design

A **Design** defines durable technical structure or behavior needed to realize Solution Responsibilities, such as state-transition behavior, retry semantics, data ownership, consistency model, API behavior, or message-processing strategy. Keep only information needed for future reasoning or safe modification; not every implementation detail is durable Design knowledge.

### Decision

A **Decision** records an intentional choice between meaningful alternatives. When relevant, capture context, selected choice, rationale, alternatives, trade-offs, and consequences. A Decision may select, explain, or constrain a Design, but must not redefine the obligation represented by a Requirement.

### Verification Item

A **Verification Item** is a bounded durable Solution expectation describing evidence that contributes to demonstrating one Acceptance Criterion. One Acceptance Criterion may require multiple Verification Items; the existence or completion of one item does not alone demonstrate the whole criterion. It is not a project-wide verification strategy or completed verification evidence.

Its verification boundary identifies the behavior being demonstrated. Dependencies outside that boundary may be substituted when doing so preserves meaningful evidence; an interaction that is itself the target must remain real enough to verify. Verification techniques, framework syntax, and temporary test setup are implementation or Project Rule concerns rather than default durable Solution knowledge.

## Relationship Semantics

Projects may use different representations through their Knowledge Schema, but the semantic relationship must remain clear.

| Relationship | Meaning and typical direction |
| --- | --- |
| `motivates` | Explains why another object exists or matters, for example Motivation → Goal or Finding → Control. |
| `derived-from` | States an origin, for example Requirement → Use Case, Control, or External Contract. |
| `satisfies` | States that Solution knowledge provides an ability intended to fulfill an obligation, for example Capability → Requirement. |
| `realizes` | Gives concrete form to another Solution concept, for example Responsibility → Capability or Design → Responsibility. |
| `constrains` | Limits valid solution space, for example Constraint → Solution, External Contract → Interface, or Decision → Design. |
| `assigned-to` | Assigns Responsibility ownership to a Component. |
| `exposes` | States that a Component or system offers an Interface. |
| `verifies` | States which expectation a Verification Item is intended to demonstrate. |
| `supersedes` | Intentionally replaces older durable knowledge. Superseded knowledge must not remain ambiguously active. |
| `related-to` | Records a meaningful connection when no more specific relationship applies. |

Relationships are many-to-many. A Capability may satisfy multiple Requirements, and a Requirement may require multiple Capabilities. Do not force knowledge into a one-Requirement → one-Capability → one-Component tree.

## Semantic Invariants

- Problem Requirements must not prescribe implementation unless that implementation is externally mandated.
- A Decision must not redefine a Requirement.
- A Capability must not be used as a Business Goal.
- A Finding must not automatically become a Control without root-cause analysis and justified generalization.
- An internal Component must not be treated as an Actor solely because it communicates with another Component.
- Responsibility describes ownership semantics; Component describes architectural assignment. They are not interchangeable.
- Verification Items are durable expectations; completed Verification Evidence must not be claimed before verification occurs and is not automatically durable knowledge.
- Each Acceptance Criterion has exactly one primary Requirement owner; a Requirement may own many Acceptance Criteria.
- Each normal Verification Item has exactly one primary Acceptance Criterion target; multiple Verification Items may collectively demonstrate that criterion.
- Relationships must support many-to-many connections.

## Semantic Anti-Patterns

- Do not invent a Component immediately from a Requirement; establish the needed Capability and Responsibility first.
- Do not turn a Finding directly into a universal security ban; analyze cause, scope, and applicability before deriving a Control or Constraint.
- Do not encode a Business Goal as a Capability.
- Do not use a Decision to rewrite expected behavior represented by a Requirement.
- Do not use a Component where ownership semantics require a Responsibility.
- Do not use `related-to` when a known, more precise relationship applies.
- Do not use a multi-owner Acceptance Criterion merely because other Requirements are prerequisites.
- Do not substitute an interaction while claiming to verify that interaction.


## Schema Integration and Customization

The active Knowledge Schema should reference the active Knowledge Model for concept meanings rather than redefine them. It may change representation, organization, identifiers, and linking without changing that Model's concepts or relationship semantics.

Projects that need different concepts or relationship semantics may provide a complete local Knowledge Model. A local Model is responsible for its own concepts, relationships, invariants, and compatibility with its Schema, Workflows, Skills, Templates, Rules, and existing project knowledge.

## Deferred Scope

This default model does not provide deterministic ontology validation, machine-readable relation schemas, a formal extension syntax, knowledge-graph storage, automatic graph construction, or automated semantic migration.
