---
name: analyze-rule-conflicts
description: Review changed Project Rules for semantic contradiction, compatible specialization, redundancy, and unresolved precedence. Use when local Rules evolve, initialization reviews Rules, or a package candidate is considered during harness-update adoption.
---

# Analyze Rule Conflicts

1. Resolve the project-local Rule collection by stable identity. Treat duplicate local identities as a conflict requiring deliberate resolution.
2. Limit comparison to Rules whose `Applies When` conditions overlap with the changed or newly active Rule.
3. Compare mandatory strength, guidance, exceptions, and intended scope. Classify each overlap as compatible, specialization, semantic contradiction, redundancy, explicit replacement, or unknown intent.
4. Surface incompatible required behavior, materially duplicated guidance, and unresolved precedence. Do not infer project intent or claim deterministic validation.
5. Report the affected identities, evidence, classification, recommended resolution, and any decision that requires a project owner.
