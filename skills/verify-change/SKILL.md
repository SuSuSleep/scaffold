---
name: verify-change
description: Verify a completed software change proportionate to its risk in Scaffold. Use when confirming requirements, behavior, design expectations, tests, checks, or unresolved verification limits before reporting completion.
---

# Verify Change

1. Read the relevant effective Project Rules, applicable active-Model constraints and evidence expectations, and the changed files.
2. Identify the smallest verification that can demonstrate each changed behavior and the active Model's bounded evidence expectations. Treat external dependencies according to the active Model and applicable Rules. Increase coverage for higher-risk behavior, interfaces, migrations, security-sensitive code, or irreversible effects.
3. Run the relevant existing checks. Add or update focused tests only when verification requires them or the Project Rules require tests.
4. Inspect the result for requirement coverage, unintended regressions, and remaining uncertainty.
5. Report the checks run, their results, coverage limits, and any unresolved risk. Do not claim verification that was not performed or encode project-specific verification approach in this Skill.
