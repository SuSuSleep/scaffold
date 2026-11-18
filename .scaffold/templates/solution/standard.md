# <Solution Name>

> Follow the active Knowledge Schema for section guidance. Choose a descriptive file path after checking for existing knowledge on the same subject. Derive each object anchor from its actual descriptive title.

<!-- Use this template only when selected by the active Knowledge Schema. When creating or updating, retain applicable existing knowledge, correct stale knowledge, and use these instructions only for this template. -->

## Capabilities and Architecture

<!-- Record Solution Capabilities that provide abilities intended to satisfy obligations. Use descriptive headings for independently managed Capabilities; do not encode a Business Goal as a Capability. -->

<a id="solution-ability"></a>

### <Solution ability>

<Authoritative capability meaning.>

<!-- Place precise material relationships beside their relevant objects. Define shared objects once and reference them from other Capabilities; CAP nesting does not imply exclusive ownership. Preserve explicit many-to-many relationships and unambiguous descriptive locators. -->

#### Responsibilities

<!-- Record owned Responsibilities that realize Capabilities. Use descriptive headings when independently managed; establish ownership before unnecessary Component decomposition. For a hybrid solution, distinguish adaptive agent execution, Skill guidance, deterministic operations, and host integration when those ownership boundaries are material. -->

<a id="owned-responsibility"></a>

##### <Owned responsibility>

Realizes: [<Solution ability>](#solution-ability)

#### Components and Boundaries

<!-- Record Components, assigned Responsibilities, and relevant Interfaces or interaction boundaries. For a hybrid solution, identify the existing agent host, independently managed Skills, deterministic tools or bridges, integration components, and their material dependencies without treating the Skill as the executing runtime. Do not create a Component solely because a Requirement exists. -->

### Shared Architecture

<!-- Optional subsection: omit when no cross-Capability structure is needed. Define shared Responsibilities, Components, Interfaces, and dependencies once here when useful, retaining explicit Realizes and assignment relationships. Other Capabilities reference these definitions rather than duplicate them. -->

## Satisfies

<!-- Record explicit many-to-many satisfies relationships from Solution knowledge to Problem or Governance obligations. -->

- [<Observable obligation>](../problem/<subject>.md#observable-obligation)

## Design and Decisions

<!-- Record durable Designs and intentional Decisions. Capture meaningful alternatives, rationale, trade-offs, and consequences when relevant; do not redefine Requirements. For hybrid allocation, retain why behavior is adaptive, deterministic, or integration-owned when that choice matters to future reasoning. -->

<a id="intentional-technical-choice"></a>

### <Intentional technical choice>

<Decision rationale and consequences.>

## Verification Items

<!-- Record bounded Verification Items. Complete Verifies, Scope, and Expected evidence; use Assumptions only when relevant. Each normal item has one primary Acceptance Criterion target and does not claim completed verification. For a hybrid solution, distinguish deterministic component evidence, Skill-guided scenario evidence, and end-to-end evidence that keeps a targeted agent-tool interaction real. -->

<a id="specific-expectation-to-demonstrate"></a>

### <Specific expectation to demonstrate>

Verifies:

- [<Observable acceptance condition>](../problem/<subject>.md#observable-acceptance-condition)

Scope:

- <Bounded behavior demonstrated by this item.>

Expected evidence:

- <Observable result.>

Assumptions:

- <Optional observable dependency outside this verification boundary.>
