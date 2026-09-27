# <Solution Name>

Document ID: SOL-<ALLOCATED_ID>

> Follow the active Knowledge Schema for section guidance. Before creating this document, obtain its ID with `scaffold id next SOL`.

<!-- Use this template only when selected by the active Knowledge Schema. When creating or updating, retain applicable existing knowledge, correct stale knowledge, and use these instructions only for this template. -->

## Capabilities

<!-- Record Solution Capabilities that provide abilities intended to satisfy obligations. Use CAP identifiers for independently managed Capabilities; do not encode a Business Goal as a Capability. -->

### CAP-001 — <Solution ability>

<Authoritative capability meaning.>

## Responsibilities

<!-- Record owned Responsibilities that realize Capabilities. Use RESP identifiers when independently managed; establish ownership before unnecessary Component decomposition. For a hybrid solution, distinguish adaptive agent execution, Skill guidance, deterministic operations, and host integration when those ownership boundaries are material. -->

### RESP-001 — <Owned responsibility>

Realizes: CAP-001

## Components and Boundaries

<!-- Record Components, assigned Responsibilities, and relevant Interfaces or interaction boundaries. For a hybrid solution, identify the existing agent host, independently managed Skills, deterministic tools or bridges, integration components, and their material dependencies without treating the Skill as the executing runtime. Do not create a Component solely because a Requirement exists. -->

## Satisfies

<!-- Record explicit many-to-many satisfies relationships from Solution knowledge to Problem or Governance obligations. -->

- PROB-<ID>#AC-001 — <Observable acceptance condition>

## Design and Decisions

<!-- Record durable Designs and intentional Decisions. Capture meaningful alternatives, rationale, trade-offs, and consequences when relevant; do not redefine Requirements. For hybrid allocation, retain why behavior is adaptive, deterministic, or integration-owned when that choice matters to future reasoning. -->

### DEC-001 — <Intentional technical choice>

<Decision rationale and consequences.>

## Verification Items

<!-- Record bounded Verification Items. Complete Verifies, Scope, and Expected evidence; use Assumptions only when relevant. Each normal item has one primary Acceptance Criterion target and does not claim completed verification. For a hybrid solution, distinguish deterministic component evidence, Skill-guided scenario evidence, and end-to-end evidence that keeps a targeted agent-tool interaction real. -->

### VER-001 — <Specific expectation to demonstrate>

Verifies:

- PROB-001#AC-001 — <Observable acceptance condition>

Scope:

- <Bounded behavior demonstrated by this item.>

Expected evidence:

- <Observable result.>

Assumptions:

- <Optional observable dependency outside this verification boundary.>

## Related Knowledge

<!-- Record precise relationships to Problem, Governance, or other Solution knowledge, including constraints, external contracts, and supporting Decisions. -->
