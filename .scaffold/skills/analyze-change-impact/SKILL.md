---
name: analyze-change-impact
description: Trace the direct and consequential effects of a proposed change and identify necessary implementation, verification, and durable knowledge updates.
---

# Analyze Change Impact

## Purpose and Inputs

Answer which elements a proposed change affects and what follow-up is needed. The caller supplies the proposed change, scope, impact question or completion criteria, and applicable constraints and evidence. These may be stated in a request or workflow Phase; no separate parameter format is required. Return a missing essential input to the caller rather than inventing a change to analyze.

Root-cause analysis, performance measurement, option or adoption evaluation, and rule-conflict analysis require their own methods. This Skill can trace the effects of a change considered in those activities; it does not establish their conclusions.

## Method

1. Establish the proposed change and the current behavior or knowledge it would alter from the supplied scope, constraints, and evidence.
2. When evidence is missing, give `collect-context` a target covering the affected behavior, interfaces, responsibilities, dependencies, records, or tests, and state which impact question that evidence must resolve.
3. Map each affected concern to the requested change. Separate direct effects from consequential effects.
4. Identify changed behavior, interfaces, responsibilities, constraints, verification, and durable knowledge. For a hybrid solution, trace whether a change moves or alters responsibility among the executing agent host, Skill guidance, deterministic tools or bridges, and integration components, including their material interfaces and verification boundaries.
5. Classify each finding as:
   - **Mechanical:** implementation or test work that does not change durable knowledge.
   - **Knowledge update:** a change that makes a documented fact, decision, rule, or relationship stale or incomplete.
   - **Uncertain:** impact that cannot be established from available evidence.
6. State the proposed change, evidence, direct and consequential effects, affected locations, recommended follow-up, and important unknowns. Use qualitative or quantitative findings as supported by the evidence; distinguish measured effects from estimates. Do not invent impacts or silently resolve ambiguity.
