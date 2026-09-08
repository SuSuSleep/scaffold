# core.knowledge-space-partition

## Applies When

- Defining, reconciling, writing, or reviewing durable project knowledge

## Guidance

- Before recording or reviewing a proposed knowledge change, partition each material claim by its primary meaning: Project Context, Problem Space, Governance Space, or Solution Space. A request may produce claims in more than one space.
- Project Context records project-wide orientation only. Problem Space owns intended outcomes, externally meaningful obligations, and observable acceptance conditions. Governance Space owns reusable or external obligations and may either derive a Problem requirement or directly constrain Solution knowledge. Solution Space owns intentional technical realization, including technical decisions.
- Distinguish a shared domain term and its agreed meaning from its technical representation, even when the term originated in implementation. Under the default Schema, record a shared definition once in Project Context's Domain Terms; use that meaning in Problem obligations and acceptance conditions; retain a representation or mapping in linked Solution knowledge only when it has durable reasoning value. Shared usage does not by itself make an identifier, field, enum, complete state set, or transition model a business obligation.
- When a request combines an externally meaningful behavior with an implementation approach, establish or reuse the applicable Problem obligation and observable acceptance condition before recording linked Solution knowledge. "Before" is a semantic dependency and traceability requirement, not a requirement to create a new Problem document when suitable Problem knowledge already exists.
- Keep a purely technical decision in Solution Space unless it changes an externally meaningful obligation or observable outcome. Do not manufacture a Problem record for Project Context-only, Governance-only, or Solution-only work.
- A representation rename or internal state split that leaves domain meaning, observable behavior, and applicable contracts unchanged does not require a Problem-obligation change; update Solution knowledge only when a durable representation or mapping becomes stale. A changed domain meaning or observable lifecycle requires affected Problem knowledge to be reconciled. When an external contract mandates exact values, preserve its source and applicability in Governance and derive requirements or constrain interfaces as appropriate.
- Represent material cross-space relationships explicitly using the active Knowledge Model and Schema. Do not hide a Problem obligation in Solution knowledge or prescribe unmandated technical realization in Problem knowledge.
- Apply this Rule as operating policy in the relevant workflow; the Rule does not redefine Knowledge Model concepts or Knowledge Schema representation.
