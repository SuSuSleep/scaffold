# Hybrid Agent, Skill, and Tool Architecture

Document ID: SOL-006

## Capabilities

### CAP-001 — Hybrid responsibility architecture

Represent intentional responsibility allocation among existing general-purpose agent hosts, Skills, deterministic tools or bridges, and integration components, including their material boundaries and dependencies.

### CAP-002 — Existing-agent tool integration

Enable Skills to guide existing agent hosts in using exact deterministic operations through documented interfaces and integration mechanisms, without supplying a new agent runtime.

### CAP-003 — Layered hybrid verification

Define distinct but connected verification expectations for deterministic components, Skill-guided adaptive scenarios, and real agent/tool interactions.

## Responsibilities

### RESP-001 — Adaptive behavior guidance

Realizes: CAP-001 and CAP-002.

Project Skills own durable instructions for adaptive work. The selected external agent host executes that behavior; a Skill is not an independent runtime or actor.

### RESP-002 — Exact operation execution

Realizes: CAP-001 and CAP-002.

Deterministic tools or bridges own operations that benefit from exact algorithms, repeatability, speed, or direct system access. They expose documented CLI, API, or agent-tool interfaces and return outcomes or failures without taking over the agent's adaptive responsibility.

### RESP-003 — Host integration lifecycle

Realizes: CAP-002.

Integration components install Skills into host-readable locations, expose deterministic tools, or update agent-host configuration. They own the authority checks, bounded configuration mutation, and actionable failure reporting required by those mechanical operations.

### RESP-004 — Hybrid allocation guidance

Realizes: CAP-001 and CAP-003.

The default Harness guides projects to record material responsibility assignments, interfaces and dependencies, allocation rationale, applicable authority and failure concerns, and component plus end-to-end verification expectations.

## Components and Boundaries

- **Existing general-purpose agent host** executes adaptive behavior assigned through RESP-001. It is an external dependency rather than a Scaffold-owned runtime. Current Scaffold host-integration scope includes Codex and Claude Code.
- **Project Skill** is assigned-to RESP-001. It supplies instructions that the agent host interprets and may identify deterministic tools the agent can invoke.
- **Deterministic tool or bridge** is assigned-to RESP-002. It may be a project CLI, service, script, or agent tool, provided its interface and failure behavior are explicit.
- **Integration component** is assigned-to RESP-003. It connects host, Skill, and tool without becoming the executor of adaptive behavior.
- **Default Harness Knowledge Model, Schema, Templates, Skills, and Rules** collectively support RESP-004 through their existing semantic, representation, workflow, and policy authority boundaries. This assignment does not make any one artifact a new runtime authority.

### IFC-001 — Agent-to-Skill guidance boundary

The agent host reads or activates a Skill and remains responsible for interpreting its instructions, making adaptive decisions, and executing the guided work. A Skill may describe tool use but does not independently call tools.

### IFC-002 — Agent-to-tool execution boundary

A deterministic tool or bridge exposes a documented CLI, API, or agent-tool contract. A Skill can guide the agent host to invoke that interface; the program owns exact execution and explicit success or failure results, while the agent owns contextual selection and response.

### IFC-003 — Host integration boundary

An integration component may place Skills in host-readable folders, register or expose tools, or update host configuration. Its interface must identify the affected host, mutation scope, required authority, configuration owner, and observable failure behavior when those concerns are material.

## Satisfies

- CAP-001 — Hybrid responsibility architecture satisfies:
  - PROB-006#REQ-001 — Explicit hybrid responsibility allocation
- CAP-002 — Existing-agent tool integration satisfies:
  - PROB-006#REQ-002 — Existing-agent portability
- CAP-003 — Layered hybrid verification satisfies:
  - PROB-006#REQ-003 — Hybrid-boundary verification

## Design and Decisions

### DEC-001 — Existing agent hosts execute adaptive behavior

Scaffold remains vendor-neutral and relies on existing general-purpose AI agent hosts to execute adaptive behavior. Skills guide those hosts; Scaffold does not implement an agent, model runtime, or inference system. Current Codex and Claude Code integration remains in scope, and this architecture does not add a Hermes or other vendor adapter.

### DEC-002 — Allocate exact operations to deterministic programs

Behavior requiring judgment, semantic interpretation, or contextual adaptation remains Skill-guided agent work. Operations that benefit from exactness, repeatability, speed, or direct mechanical access belong in deterministic tools or bridges. A workflow may combine both: a Skill guides when and why an operation is used, and the program performs it through an explicit interface.

### DEC-003 — Keep integration mechanical and bounded

Installing Skills, exposing tools, and updating agent-host configuration are deterministic integration responsibilities. Each integration must preserve host ownership outside its declared mutation scope and make missing authority, incompatible configuration, unavailable tools, and partial failure observable when applicable.

### DEC-004 — Preserve Markdown-first architecture

Hybrid allocation is represented through the existing Markdown-first Knowledge Model and Schema. A project may adopt structured tool metadata when a concrete need justifies it, but the default Harness does not require a machine-readable manifest.

### DEC-005 — Verify layers and real boundaries deliberately

Deterministic tools, Skill-guided behavior, and their integration have different evidence boundaries. Dependencies outside a bounded component check may be substituted, but an end-to-end item targeting the agent/tool interaction must keep that interaction real enough to demonstrate the boundary.

## Verification Items

### VER-001 — Responsibility allocation completeness

Verifies:

- PROB-006#AC-001 — Hybrid responsibilities are distinguishable.

Scope:

- default Harness guidance for defining or reconstructing hybrid Solution knowledge.

Expected evidence:

- a representative hybrid solution assigns every material adaptive, deterministic, and integration responsibility and records its interfaces, dependencies, rationale, and applicable authority, configuration-ownership, and failure concerns.

### VER-002 — Existing-host and Markdown portability

Verifies:

- PROB-006#AC-002 — Existing hosts remain sufficient.

Scope:

- default guidance and supported Codex and Claude Code integration behavior.

Expected evidence:

- a project can represent and use the hybrid architecture with an existing supported host and human-readable Markdown, without a Scaffold-owned agent runtime, an additional vendor adapter, or a mandatory machine-readable manifest.

### VER-003 — Deterministic tool behavior

Verifies:

- PROB-006#AC-003 — Hybrid evidence covers components and interaction.

Scope:

- exact operation and documented success and failure behavior of a deterministic tool or bridge.

Expected evidence:

- controlled inputs produce repeatable documented results, including observable failures at the tool boundary.

### VER-004 — Skill-guided adaptive scenario

Verifies:

- PROB-006#AC-003 — Hybrid evidence covers components and interaction.

Scope:

- agent execution of a representative scenario under the relevant Skill guidance, with dependencies outside that adaptive behavior controlled where appropriate.

Expected evidence:

- the agent follows the Skill's responsibility and tool-use guidance while retaining contextual decision-making at the declared adaptive boundary.

### VER-005 — Real agent/tool interaction

Verifies:

- PROB-006#AC-003 — Hybrid evidence covers components and interaction.

Scope:

- end-to-end interaction among an existing agent host, Skill guidance, deterministic tool interface, and required integration component.

Expected evidence:

- the host can discover and invoke the tool as guided, the tool returns its documented result or failure, and integration or authority failures remain observable without substituting the interaction under test.

## Related Knowledge

- CTX-001#GOAL-003 — Support explicit hybrid solution architecture.
- SOL-001#CAP-003 — Agent guidance integration provides current host-instruction integration.
- SOL-002#CAP-004 — Package candidate and starter artifact provision distributes the default hybrid guidance for initialization and update comparison.
- SOL-004#CAP-002 — Method-flexible work guidance establishes the Skill method boundary.
- GOV-002#CON-001 — Markdown-first core operation constrains DEC-004.
- GOV-002#CON-002 — Agent-mediated semantic validation applies to allocation and Skill-guided behavior.
- GOV-002#CON-005 — Durable knowledge update threshold applies when hybrid responsibilities, interfaces, or architectural boundaries change.
- GOV-001#CON-001 — Supported Node.js runtime constrains Scaffold-distributed deterministic programs.
