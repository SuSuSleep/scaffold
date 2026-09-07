# Scaffold Project Context

Document ID: CTX-001

## Project Purpose

Scaffold is a portable, knowledge-first software development harness. It materializes a project's complete active guidance locally so people and coding agents can establish, interpret, and evolve durable project knowledge without treating the installed package as runtime authority.

## Project Goals

### GOAL-001 — Enable safe project-local Harness adoption

Enable project maintainers to initialize and maintain Scaffold in new or existing repositories while preserving the repository's structure and host-owned agent instructions.

### GOAL-002 — Support evidence-based, deliberate project evolution

Enable maintainers and coding agents to use a visible, project-local Knowledge Model, Schema, Skills, Templates, and Rules to make and review knowledge-driven changes deliberately.

## Domain Terms

- **Harness**: Scaffold's complete active, project-local guidance collection: Knowledge Model, Knowledge Schema, Skills, Templates, Rules, and agent guide.
- **Project Knowledge**: durable project intent, obligations, constraints, and reasoning represented according to the active Knowledge Model and Schema.
- **Knowledge Model**: the authority that defines the meaning of Project Knowledge concepts and their relationships.
- **Knowledge Schema**: the authority that defines how Project Knowledge is organized, represented, identified, and linked.
- **Project Rule**: a project-local, reusable engineering-practice instruction with a stable dotted identity.
- **Workflow Skill**: a user-invoked Skill that owns ordered phases, goals, and required outcomes.
- **Model-invoked Skill**: a lower-level reusable method used by a Workflow Skill; it is not itself the high-level user interface.
- **Candidate bundle**: the installed Scaffold package used to initialize or compare against a Harness; it is not an implicit runtime authority or merge source.

## Scope, Exclusions, and Unknowns

- Scaffold is distributed as a Node.js command-line package and supports Node.js 20 or later.
- The current product scope includes portable Harness initialization, project-local guidance resolution, document-ID inspection, and deliberate update review.
- Scaffold does not replace Git, issue tracking, CI/CD, or project-management systems; it does not require Scrum, TDD, a knowledge graph, or a vector database.
- No repository-wide formatter, linter, or additional code-style convention was identified from the available repository configuration and documentation.
- No repository evidence identified pull-request, branching, release, or CI conventions beyond use of Git and the documented pre-release test-suite expectation. Those conventions remain unresolved rather than inferred.
