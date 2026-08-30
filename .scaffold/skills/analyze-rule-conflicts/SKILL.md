---
name: analyze-rule-conflicts
description: Review changed or newly active Project Rules for semantic contradiction, compatible specialization, redundancy, and unresolved precedence. Use when local Rules evolve, initialization infers Rules, or shared Rules change during harness-update adoption.
---

# Analyze Rule Conflicts

1. Resolve the effective Project Rule collection by stable identity. Treat the same local and shared identity as intentional atomic replacement, not a conflict.
2. Limit comparison to Rules whose `Applies When` conditions overlap with the changed or newly active Rule.
3. Compare mandatory strength, guidance, exceptions, and intended scope. Classify each overlap as compatible, specialization, semantic contradiction, redundancy, explicit replacement, or unknown intent.
4. Surface incompatible required behavior, materially duplicated guidance, and unresolved precedence. Do not infer project intent or claim deterministic validation.
5. Report the affected identities, evidence, classification, recommended resolution, and any decision that requires a project owner.
