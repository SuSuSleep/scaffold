---
name: collect-context
description: Collect the smallest sufficient context for meaningful work in a Scaffold project. Use when starting initialization, implementation, knowledge updates, investigation, verification, or any request whose requirements or constraints need confirmation.
---

# Collect Context

1. Read the user request and identify the decision, change, or outcome it asks for.
2. Read `.scaffold/metadata.md`, then read the shared Knowledge Model from the installed package. Resolve the Knowledge Schema, Project Rules, and relevant Workflow explicitly: use a project-local replacement when present; otherwise use the shared package artifact. Do not merge them implicitly. A project-local Knowledge Model is unsupported and must not be used.
3. Read the active Knowledge Schema, Project Rules, and relevant Workflow before changing behavior or durable knowledge.
4. Locate only the relevant knowledge records, implementation, tests, repository instructions, and external evidence.
5. Record the applicable requirements, constraints, assumptions, and unknowns. Ask the user about an ambiguity that could materially change the work.
