# <Solution Name>

> Follow the active Knowledge Schema for section guidance. Choose a descriptive file path after checking for existing knowledge on the same subject.

<!-- Use this template only when selected by the active Knowledge Schema. When creating or updating, retain applicable existing knowledge, correct stale knowledge, and use these instructions only for this template. -->

## Capabilities and Architecture

<!-- Record Solution Capabilities that provide abilities intended to satisfy obligations. Use CAP identifiers for independently managed Capabilities; do not encode a Business Goal as a Capability. -->

<a id="cap-001"></a>

### CAP-001 — <Solution ability>

<Authoritative capability meaning.>

<!-- Place precise material relationships beside their relevant objects. Define shared objects once and reference them from other Capabilities; CAP nesting does not imply exclusive ownership. Preserve explicit many-to-many relationships and stable IDs. -->

#### Responsibilities

<!-- Record owned Responsibilities that realize Capabilities. Use RESP identifiers when independently managed; establish ownership before unnecessary Component decomposition. For a hybrid solution, distinguish adaptive agent execution, Skill guidance, deterministic operations, and host integration when those ownership boundaries are material. -->

<a id="resp-001"></a>

##### RESP-001 — <Owned responsibility>

Realizes: CAP-001

#### Components and Boundaries

<!-- Record Components, assigned Responsibilities, and relevant Interfaces or interaction boundaries. For a hybrid solution, identify the existing agent host, independently managed Skills, deterministic tools or bridges, integration components, and their material dependencies without treating the Skill as the executing runtime. Do not create a Component solely because a Requirement exists. -->

### Shared Architecture

<!-- Optional subsection: omit when no cross-Capability structure is needed. Define shared Responsibilities, Components, Interfaces, and dependencies once here when useful, retaining explicit Realizes and assignment relationships. Other Capabilities reference these definitions rather than duplicate them. -->

## Satisfies

<!-- Record explicit many-to-many satisfies relationships from Solution knowledge to Problem or Governance obligations. -->

- [REQ-001 — <Observable obligation>](../problem/<subject>.md#req-001)

## Design and Decisions

<!-- Record durable Designs and intentional Decisions. Capture meaningful alternatives, rationale, trade-offs, and consequences when relevant; do not redefine Requirements. For hybrid allocation, retain why behavior is adaptive, deterministic, or integration-owned when that choice matters to future reasoning. -->

<a id="dec-001"></a>

### DEC-001 — <Intentional technical choice>

<Decision rationale and consequences.>

## Verification Items

<!-- Record bounded Verification Items. Complete Verifies, Scope, and Expected evidence; use Assumptions only when relevant. Each normal item has one primary Acceptance Criterion target and does not claim completed verification. For a hybrid solution, distinguish deterministic component evidence, Skill-guided scenario evidence, and end-to-end evidence that keeps a targeted agent-tool interaction real. -->

<a id="ver-001"></a>

### VER-001 — <Specific expectation to demonstrate>

Verifies:

- [AC-001 — <Observable acceptance condition>](../problem/<subject>.md#ac-001)

Scope:

- <Bounded behavior demonstrated by this item.>

Expected evidence:

- <Observable result.>

Assumptions:

- <Optional observable dependency outside this verification boundary.>
