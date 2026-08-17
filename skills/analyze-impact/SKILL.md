---
name: analyze-impact
description: Analyze the impact of a requested project change in Scaffold. Use when determining affected requirements, behavior, interfaces, responsibilities, constraints, tests, or durable knowledge before planning or implementing work.
---

# Analyze Impact

1. Read the request and the active Knowledge Schema and Project Rules.
2. Locate the smallest relevant requirements, knowledge records, implementation, tests, interfaces, and repository instructions.
3. Map each affected concern to the requested change. Separate direct effects from consequential effects.
4. Identify changed behavior, interfaces, responsibilities, constraints, verification, and durable knowledge.
5. Classify each finding as:
   - **Mechanical:** implementation or test work that does not change durable knowledge.
   - **Knowledge update:** a change that makes a documented fact, decision, rule, or relationship stale or incomplete.
   - **Uncertain:** impact that cannot be established from available evidence.
6. State evidence, affected locations, recommended follow-up, and important unknowns. Do not invent impacts or silently resolve ambiguity.
