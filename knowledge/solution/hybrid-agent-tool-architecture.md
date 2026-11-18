# Hybrid Agent, Skill, and Tool Architecture

## Capabilities and Architecture

<a id="hybrid-responsibility-architecture"></a>

### Hybrid responsibility architecture

Represent intentional responsibility allocation among existing general-purpose agent hosts, Skills, deterministic tools or bridges, and integration components, including their material boundaries and dependencies.

Relationships:

- Related-to: [Support explicit hybrid solution architecture](../project-context.md#support-explicit-hybrid-solution-architecture).

#### Responsibilities

Uses shared Responsibilities [Adaptive behavior guidance](#adaptive-behavior-guidance), [Exact operation execution](#exact-operation-execution), [Hybrid allocation guidance](#hybrid-allocation-guidance) defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

<a id="existing-agent-tool-integration"></a>

### Existing-agent tool integration

Enable Skills to guide existing agent hosts in using exact deterministic operations through documented interfaces and integration mechanisms, without supplying a new agent runtime.

#### Responsibilities

<a id="host-integration-lifecycle"></a>

##### Host integration lifecycle

Realizes: [Existing-agent tool integration](#existing-agent-tool-integration).

Integration components install Skills into host-readable locations, expose deterministic tools, or update agent-host configuration. They own the authority checks, bounded configuration mutation, and actionable failure reporting required by those mechanical operations.

Relationships:

- Related-to: [Agent guidance integration](cli-and-guidance.md#agent-guidance-integration) provides current host-instruction integration.

Uses shared Responsibilities [Adaptive behavior guidance](#adaptive-behavior-guidance), [Exact operation execution](#exact-operation-execution) defined in Shared Architecture.

#### Components and Boundaries

- **Integration component** is assigned-to [Host integration lifecycle](#host-integration-lifecycle). It connects host, Skill, and tool without becoming the executor of adaptive behavior.

See Shared Architecture for component assignments and interaction boundaries.

<a id="layered-hybrid-verification"></a>

### Layered hybrid verification

Define distinct but connected verification expectations for deterministic components, Skill-guided adaptive scenarios, and real agent/tool interactions.

#### Responsibilities

Uses shared Responsibilities [Hybrid allocation guidance](#hybrid-allocation-guidance) defined in Shared Architecture.

#### Components and Boundaries

See Shared Architecture for component assignments and interaction boundaries.

### Shared Architecture

#### Responsibilities

<a id="adaptive-behavior-guidance"></a>

##### Adaptive behavior guidance

Realizes: [Hybrid responsibility architecture](#hybrid-responsibility-architecture) and [Existing-agent tool integration](#existing-agent-tool-integration).

Project Skills own durable instructions for adaptive work. The selected external agent host executes that behavior; a Skill is not an independent runtime or actor.

Relationships:

- Related-to: [Method-flexible work guidance](change-lifecycle-and-methods.md#method-flexible-work-guidance) establishes the Skill method boundary.

<a id="exact-operation-execution"></a>

##### Exact operation execution

Realizes: [Hybrid responsibility architecture](#hybrid-responsibility-architecture) and [Existing-agent tool integration](#existing-agent-tool-integration).

Deterministic tools or bridges own operations that benefit from exact algorithms, repeatability, speed, or direct system access. They expose documented CLI, API, or agent-tool interfaces and return outcomes or failures without taking over the agent's adaptive responsibility.

Relationships:

- [Supported Node.js runtime](../governance/runtime-and-distribution.md#supported-nodejs-runtime) constrains Scaffold-distributed deterministic programs.

<a id="hybrid-allocation-guidance"></a>

##### Hybrid allocation guidance

Realizes: [Hybrid responsibility architecture](#hybrid-responsibility-architecture) and [Layered hybrid verification](#layered-hybrid-verification).

The default Harness guides projects to record material responsibility assignments, interfaces and dependencies, allocation rationale, applicable authority and failure concerns, and component plus end-to-end verification expectations.

Relationships:

- Related-to: [Package candidate and starter artifact provision](default-artifacts.md#package-candidate-and-starter-artifact-provision) distributes the default hybrid guidance for initialization and update comparison.
- Related-to: [Agent-mediated semantic validation](../governance/product-operating-boundaries.md#agent-mediated-semantic-validation) applies to allocation and Skill-guided behavior.
- Related-to: [Durable knowledge update threshold](../governance/product-operating-boundaries.md#durable-knowledge-update-threshold) applies when hybrid responsibilities, interfaces, or architectural boundaries change.

#### Components and Boundaries

- **Existing general-purpose agent host** executes adaptive behavior assigned through [Adaptive behavior guidance](#adaptive-behavior-guidance). It is an external dependency rather than a Scaffold-owned runtime. Current Scaffold host-integration scope includes Codex and Claude Code.
- **Project Skill** is assigned-to [Adaptive behavior guidance](#adaptive-behavior-guidance). It supplies instructions that the agent host interprets and may identify deterministic tools the agent can invoke.
- **Deterministic tool or bridge** is assigned-to [Exact operation execution](#exact-operation-execution). It may be a project CLI, service, script, or agent tool, provided its interface and failure behavior are explicit.
- **Default Harness Knowledge Model, Schema, Templates, Skills, and Rules** collectively support [Hybrid allocation guidance](#hybrid-allocation-guidance) through their existing semantic, representation, workflow, and policy authority boundaries. This assignment does not make any one artifact a new runtime authority.

<a id="agent-to-skill-guidance-boundary"></a>

##### Agent-to-Skill guidance boundary

Concept: Interface

The agent host reads or activates a Skill and remains responsible for interpreting its instructions, making adaptive decisions, and executing the guided work. A Skill may describe tool use but does not independently call tools.

<a id="agent-to-tool-execution-boundary"></a>

##### Agent-to-tool execution boundary

Concept: Interface

A deterministic tool or bridge exposes a documented CLI, API, or agent-tool contract. A Skill can guide the agent host to invoke that interface; the program owns exact execution and explicit success or failure results, while the agent owns contextual selection and response.

<a id="host-integration-boundary"></a>

##### Host integration boundary

Concept: Interface

An integration component may place Skills in host-readable folders, register or expose tools, or update host configuration. Its interface must identify the affected host, mutation scope, required authority, configuration owner, and observable failure behavior when those concerns are material.

## Satisfies

- [Hybrid responsibility architecture](#hybrid-responsibility-architecture) satisfies:
  - [Explicit hybrid responsibility allocation](../problem/hybrid-system-architecture.md#explicit-hybrid-responsibility-allocation)
- [Existing-agent tool integration](#existing-agent-tool-integration) satisfies:
  - [Existing-agent portability](../problem/hybrid-system-architecture.md#existing-agent-portability)
- [Layered hybrid verification](#layered-hybrid-verification) satisfies:
  - [Hybrid-boundary verification](../problem/hybrid-system-architecture.md#hybrid-boundary-verification)

## Design and Decisions

The entries in this section are Decisions; explicitly superseded entries remain historical.

<a id="existing-agent-hosts-execute-adaptive-behavior"></a>

### Existing agent hosts execute adaptive behavior

Scaffold remains vendor-neutral and relies on existing general-purpose AI agent hosts to execute adaptive behavior. Skills guide those hosts; Scaffold does not implement an agent, model runtime, or inference system. Current Codex and Claude Code integration remains in scope, and this architecture does not add a Hermes or other vendor adapter.

<a id="allocate-exact-operations-to-deterministic-programs"></a>

### Allocate exact operations to deterministic programs

Behavior requiring judgment, semantic interpretation, or contextual adaptation remains Skill-guided agent work. Operations that benefit from exactness, repeatability, speed, or direct mechanical access belong in deterministic tools or bridges. A workflow may combine both: a Skill guides when and why an operation is used, and the program performs it through an explicit interface.

<a id="keep-integration-mechanical-and-bounded"></a>

### Keep integration mechanical and bounded

Installing Skills, exposing tools, and updating agent-host configuration are deterministic integration responsibilities. Each integration must preserve host ownership outside its declared mutation scope and make missing authority, incompatible configuration, unavailable tools, and partial failure observable when applicable.

<a id="preserve-markdown-first-architecture"></a>

### Preserve Markdown-first architecture

Hybrid allocation is represented through the existing Markdown-first Knowledge Model and Schema. A project may adopt structured tool metadata when a concrete need justifies it, but the default Harness does not require a machine-readable manifest.

Relationships:

- [Markdown-first core operation](../governance/product-operating-boundaries.md#markdown-first-core-operation) constrains [Preserve Markdown-first architecture](#preserve-markdown-first-architecture).

<a id="verify-layers-and-real-boundaries-deliberately"></a>

### Verify layers and real boundaries deliberately

Deterministic tools, Skill-guided behavior, and their integration have different evidence boundaries. Dependencies outside a bounded component check may be substituted, but an end-to-end item targeting the agent/tool interaction must keep that interaction real enough to demonstrate the boundary.

## Verification Items

<a id="responsibility-allocation-completeness"></a>

### Responsibility allocation completeness

Verifies:

- [Hybrid responsibilities are distinguishable](../problem/hybrid-system-architecture.md#hybrid-responsibilities-are-distinguishable).

Scope:

- default Harness guidance for defining or reconstructing hybrid Solution knowledge.

Expected evidence:

- a representative hybrid solution assigns every material adaptive, deterministic, and integration responsibility and records its interfaces, dependencies, rationale, and applicable authority, configuration-ownership, and failure concerns.

<a id="existing-host-and-markdown-portability"></a>

### Existing-host and Markdown portability

Verifies:

- [Existing hosts remain sufficient](../problem/hybrid-system-architecture.md#existing-hosts-remain-sufficient).

Scope:

- default guidance and supported Codex and Claude Code integration behavior.

Expected evidence:

- a project can represent and use the hybrid architecture with an existing supported host and human-readable Markdown, without a Scaffold-owned agent runtime, an additional vendor adapter, or a mandatory machine-readable manifest.

<a id="deterministic-tool-behavior"></a>

### Deterministic tool behavior

Verifies:

- [Hybrid evidence covers components and interaction](../problem/hybrid-system-architecture.md#hybrid-evidence-covers-components-and-interaction).

Scope:

- exact operation and documented success and failure behavior of a deterministic tool or bridge.

Expected evidence:

- controlled inputs produce repeatable documented results, including observable failures at the tool boundary.

<a id="skill-guided-adaptive-scenario"></a>

### Skill-guided adaptive scenario

Verifies:

- [Hybrid evidence covers components and interaction](../problem/hybrid-system-architecture.md#hybrid-evidence-covers-components-and-interaction).

Scope:

- agent execution of a representative scenario under the relevant Skill guidance, with dependencies outside that adaptive behavior controlled where appropriate.

Expected evidence:

- the agent follows the Skill's responsibility and tool-use guidance while retaining contextual decision-making at the declared adaptive boundary.

<a id="real-agenttool-interaction"></a>

### Real agent/tool interaction

Verifies:

- [Hybrid evidence covers components and interaction](../problem/hybrid-system-architecture.md#hybrid-evidence-covers-components-and-interaction).

Scope:

- end-to-end interaction among an existing agent host, Skill guidance, deterministic tool interface, and required integration component.

Expected evidence:

- the host can discover and invoke the tool as guided, the tool returns its documented result or failure, and integration or authority failures remain observable without substituting the interaction under test.
