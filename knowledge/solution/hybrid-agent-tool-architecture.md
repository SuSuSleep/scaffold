# Hybrid Agent, Skill, and Tool Architecture

## Capabilities and Architecture

<a id="cap-001"></a>

### CAP-001 — Hybrid responsibility architecture

Represent intentional responsibility allocation among existing general-purpose agent hosts, Skills, deterministic tools or bridges, and integration components, including their material boundaries and dependencies.

Relationships:

- Related-to: [GOAL-003 — Support explicit hybrid solution architecture](../project-context.md#goal-003).

#### Responsibilities

Uses shared Responsibilities RESP-001, RESP-002, RESP-004 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-002"></a>

### CAP-002 — Existing-agent tool integration

Enable Skills to guide existing agent hosts in using exact deterministic operations through documented interfaces and integration mechanisms, without supplying a new agent runtime.

#### Responsibilities

<a id="resp-003"></a>

##### RESP-003 — Host integration lifecycle

Realizes: CAP-002.

Integration components install Skills into host-readable locations, expose deterministic tools, or update agent-host configuration. They own the authority checks, bounded configuration mutation, and actionable failure reporting required by those mechanical operations.

Relationships:

- Related-to: [CAP-003 — Agent guidance integration](cli-and-guidance.md#cap-003) provides current host-instruction integration.

Uses shared Responsibilities RESP-001, RESP-002 defined in Shared Architecture.

#### Components and Boundaries

- **Integration component** is assigned-to RESP-003. It connects host, Skill, and tool without becoming the executor of adaptive behavior.

See Shared Architecture for component assignments and interaction boundaries.

<a id="cap-003"></a>

### CAP-003 — Layered hybrid verification

Define distinct but connected verification expectations for deterministic components, Skill-guided adaptive scenarios, and real agent/tool interactions.

#### Responsibilities

Uses shared Responsibilities RESP-004 defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

### Shared Architecture

#### Responsibilities

<a id="resp-001"></a>

##### RESP-001 — Adaptive behavior guidance

Realizes: CAP-001 and CAP-002.

Project Skills own durable instructions for adaptive work. The selected external agent host executes that behavior; a Skill is not an independent runtime or actor.

Relationships:

- Related-to: [CAP-002 — Method-flexible work guidance](change-lifecycle-and-methods.md#cap-002) establishes the Skill method boundary.

<a id="resp-002"></a>

##### RESP-002 — Exact operation execution

Realizes: CAP-001 and CAP-002.

Deterministic tools or bridges own operations that benefit from exact algorithms, repeatability, speed, or direct system access. They expose documented CLI, API, or agent-tool interfaces and return outcomes or failures without taking over the agent's adaptive responsibility.

Relationships:

- [CON-001 — Supported Node.js runtime](../governance/runtime-and-distribution.md#con-001) constrains Scaffold-distributed deterministic programs.

<a id="resp-004"></a>

##### RESP-004 — Hybrid allocation guidance

Realizes: CAP-001 and CAP-003.

The default Harness guides projects to record material responsibility assignments, interfaces and dependencies, allocation rationale, applicable authority and failure concerns, and component plus end-to-end verification expectations.

Relationships:

- Related-to: [CAP-004 — Package candidate and starter artifact provision](default-artifacts.md#cap-004) distributes the default hybrid guidance for initialization and update comparison.
- Related-to: [CON-002 — Agent-mediated semantic validation](../governance/product-operating-boundaries.md#con-002) applies to allocation and Skill-guided behavior.
- Related-to: [CON-005 — Durable knowledge update threshold](../governance/product-operating-boundaries.md#con-005) applies when hybrid responsibilities, interfaces, or architectural boundaries change.

#### Components and Boundaries

- **Existing general-purpose agent host** executes adaptive behavior assigned through RESP-001. It is an external dependency rather than a Scaffold-owned runtime. Current Scaffold host-integration scope includes Codex and Claude Code.
- **Project Skill** is assigned-to RESP-001. It supplies instructions that the agent host interprets and may identify deterministic tools the agent can invoke.
- **Deterministic tool or bridge** is assigned-to RESP-002. It may be a project CLI, service, script, or agent tool, provided its interface and failure behavior are explicit.
- **Default Harness Knowledge Model, Schema, Templates, Skills, and Rules** collectively support RESP-004 through their existing semantic, representation, workflow, and policy authority boundaries. This assignment does not make any one artifact a new runtime authority.

<a id="ifc-001"></a>

##### IFC-001 — Agent-to-Skill guidance boundary

The agent host reads or activates a Skill and remains responsible for interpreting its instructions, making adaptive decisions, and executing the guided work. A Skill may describe tool use but does not independently call tools.

<a id="ifc-002"></a>

##### IFC-002 — Agent-to-tool execution boundary

A deterministic tool or bridge exposes a documented CLI, API, or agent-tool contract. A Skill can guide the agent host to invoke that interface; the program owns exact execution and explicit success or failure results, while the agent owns contextual selection and response.

<a id="ifc-003"></a>

##### IFC-003 — Host integration boundary

An integration component may place Skills in host-readable folders, register or expose tools, or update host configuration. Its interface must identify the affected host, mutation scope, required authority, configuration owner, and observable failure behavior when those concerns are material.

## Satisfies

- CAP-001 — Hybrid responsibility architecture satisfies:
  - [REQ-001 — Explicit hybrid responsibility allocation](../problem/hybrid-system-architecture.md#req-001)
- CAP-002 — Existing-agent tool integration satisfies:
  - [REQ-002 — Existing-agent portability](../problem/hybrid-system-architecture.md#req-002)
- CAP-003 — Layered hybrid verification satisfies:
  - [REQ-003 — Hybrid-boundary verification](../problem/hybrid-system-architecture.md#req-003)

## Design and Decisions

<a id="dec-001"></a>

### DEC-001 — Existing agent hosts execute adaptive behavior

Scaffold remains vendor-neutral and relies on existing general-purpose AI agent hosts to execute adaptive behavior. Skills guide those hosts; Scaffold does not implement an agent, model runtime, or inference system. Current Codex and Claude Code integration remains in scope, and this architecture does not add a Hermes or other vendor adapter.

<a id="dec-002"></a>

### DEC-002 — Allocate exact operations to deterministic programs

Behavior requiring judgment, semantic interpretation, or contextual adaptation remains Skill-guided agent work. Operations that benefit from exactness, repeatability, speed, or direct mechanical access belong in deterministic tools or bridges. A workflow may combine both: a Skill guides when and why an operation is used, and the program performs it through an explicit interface.

<a id="dec-003"></a>

### DEC-003 — Keep integration mechanical and bounded

Installing Skills, exposing tools, and updating agent-host configuration are deterministic integration responsibilities. Each integration must preserve host ownership outside its declared mutation scope and make missing authority, incompatible configuration, unavailable tools, and partial failure observable when applicable.

<a id="dec-004"></a>

### DEC-004 — Preserve Markdown-first architecture

Hybrid allocation is represented through the existing Markdown-first Knowledge Model and Schema. A project may adopt structured tool metadata when a concrete need justifies it, but the default Harness does not require a machine-readable manifest.

Relationships:

- [CON-001 — Markdown-first core operation](../governance/product-operating-boundaries.md#con-001) constrains DEC-004.

<a id="dec-005"></a>

### DEC-005 — Verify layers and real boundaries deliberately

Deterministic tools, Skill-guided behavior, and their integration have different evidence boundaries. Dependencies outside a bounded component check may be substituted, but an end-to-end item targeting the agent/tool interaction must keep that interaction real enough to demonstrate the boundary.

## Verification Items

<a id="ver-001"></a>

### VER-001 — Responsibility allocation completeness

Verifies:

- [AC-001 — Hybrid responsibilities are distinguishable](../problem/hybrid-system-architecture.md#ac-001).

Scope:

- default Harness guidance for defining or reconstructing hybrid Solution knowledge.

Expected evidence:

- a representative hybrid solution assigns every material adaptive, deterministic, and integration responsibility and records its interfaces, dependencies, rationale, and applicable authority, configuration-ownership, and failure concerns.

<a id="ver-002"></a>

### VER-002 — Existing-host and Markdown portability

Verifies:

- [AC-002 — Existing hosts remain sufficient](../problem/hybrid-system-architecture.md#ac-002).

Scope:

- default guidance and supported Codex and Claude Code integration behavior.

Expected evidence:

- a project can represent and use the hybrid architecture with an existing supported host and human-readable Markdown, without a Scaffold-owned agent runtime, an additional vendor adapter, or a mandatory machine-readable manifest.

<a id="ver-003"></a>

### VER-003 — Deterministic tool behavior

Verifies:

- [AC-003 — Hybrid evidence covers components and interaction](../problem/hybrid-system-architecture.md#ac-003).

Scope:

- exact operation and documented success and failure behavior of a deterministic tool or bridge.

Expected evidence:

- controlled inputs produce repeatable documented results, including observable failures at the tool boundary.

<a id="ver-004"></a>

### VER-004 — Skill-guided adaptive scenario

Verifies:

- [AC-003 — Hybrid evidence covers components and interaction](../problem/hybrid-system-architecture.md#ac-003).

Scope:

- agent execution of a representative scenario under the relevant Skill guidance, with dependencies outside that adaptive behavior controlled where appropriate.

Expected evidence:

- the agent follows the Skill's responsibility and tool-use guidance while retaining contextual decision-making at the declared adaptive boundary.

<a id="ver-005"></a>

### VER-005 — Real agent/tool interaction

Verifies:

- [AC-003 — Hybrid evidence covers components and interaction](../problem/hybrid-system-architecture.md#ac-003).

Scope:

- end-to-end interaction among an existing agent host, Skill guidance, deterministic tool interface, and required integration component.

Expected evidence:

- the host can discover and invoke the tool as guided, the tool returns its documented result or failure, and integration or authority failures remain observable without substituting the interaction under test.
