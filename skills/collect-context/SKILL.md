---
name: collect-context
description: Collect the smallest sufficient context for meaningful work in a Scaffold project. Use when starting initialization, implementation, knowledge updates, investigation, verification, or any request whose requirements or constraints need confirmation.
---

# Collect Context

1. Read the user request and identify the decision, change, or outcome it asks for.
2. Read `.scaffold/metadata.md`, then read the shared Knowledge Model from the installed package. Resolve Knowledge Schema, Workflow, Skill, and Template as full project-local replacements when present. Resolve Project Rules as an effective collection by stable identity: local additions coexist and a local identity atomically replaces the shared identity. Do not merge artifact or rule contents implicitly. A project-local Knowledge Model is unsupported and must not be used.
3. Read the active Knowledge Schema, relevant effective Project Rules, and relevant Workflow before changing behavior or durable knowledge.
4. Start from the current Workflow Phase Goal and Required Outcome. Locate only the relevant knowledge records, applicable Project Rules, applicable Governance categories, implementation, tests, repository instructions, and external evidence. Do not load all Governance records by default.
5. Resolve Governance and Rules by semantic subject rather than a hard-coded project path. Expand context only when dependencies or uncertainty require it. Treat coding, documentation, verification, and similar work practices as Rules, not default Governance knowledge.
6. Record the applicable requirements, constraints, assumptions, and unknowns. Ask the user about an ambiguity that could materially change the work.
