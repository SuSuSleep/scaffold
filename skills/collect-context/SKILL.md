---
name: collect-context
description: Collect the smallest sufficient context for meaningful work in a Scaffold project. Use when starting initialization, implementation, knowledge updates, investigation, verification, or any request whose requirements or constraints need confirmation.
---

# Collect Context

1. Read the user request and identify the decision, change, or outcome it asks for.
2. Read `.scaffold/metadata.md`, then resolve and read the active Knowledge Model: `.scaffold/knowledge-model.md` fully replaces the installed default when present. Resolve Knowledge Schema, Skill, and Template as full project-local replacements when present. Resolve Project Rules as an effective collection by stable identity: local additions coexist and a local identity atomically replaces the shared identity. Do not merge artifact or rule contents implicitly.
3. When the task materially interprets, creates, updates, or reviews Project Knowledge, read the active Knowledge Schema before that work. Do not require Schema loading for a purely mechanical repository operation. Read relevant effective Project Rules and the active workflow Skill before changing behavior or durable knowledge.
4. Start from the current workflow Skill Phase Goal and Required Outcome. Locate only the relevant knowledge records, applicable Project Rules, implementation, tests, repository instructions, and external evidence. Do not load all project knowledge by default.
5. Resolve knowledge and Rules by semantic subject rather than a hard-coded project path. Expand context only when dependencies or uncertainty require it. Treat coding, documentation, verification, and similar work practices as Rules, not default durable project knowledge.
6. Record the applicable active-Model obligations, constraints, assumptions, and unknowns. Ask the user about an ambiguity that could materially change the work.
