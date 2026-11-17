---
name: analyze-impact
description: Analyze the impact of a requested project change in Scaffold. Use when determining affected requirements, behavior, interfaces, responsibilities, constraints, tests, or durable knowledge before planning or implementing work.
---

# Analyze Impact

1. Start from the requested change, affected scope, and supplied constraints and evidence.
2. When evidence is missing, give `collect-context` a target covering the affected behavior, interfaces, responsibilities, dependencies, records, or tests, and state which impact question that evidence must resolve.
3. Map each affected concern to the requested change. Separate direct effects from consequential effects.
4. Identify changed behavior, interfaces, responsibilities, constraints, verification, and durable knowledge. Apply the active Model's ownership, scenario, evidence-boundary, dependency, and relationship rules when they apply. For a hybrid solution, trace whether a change moves or alters responsibility among the executing agent host, Skill guidance, deterministic tools or bridges, and integration components, including their material interfaces and verification boundaries.
5. Classify each finding as:
   - **Mechanical:** implementation or test work that does not change durable knowledge.
   - **Knowledge update:** a change that makes a documented fact, decision, rule, or relationship stale or incomplete.
   - **Uncertain:** impact that cannot be established from available evidence.
6. State evidence, affected locations, recommended follow-up, and important unknowns. Do not invent impacts or silently resolve ambiguity.
