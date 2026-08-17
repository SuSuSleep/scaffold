---
name: verify-change
description: Verify a completed software change proportionate to its risk in Scaffold. Use when confirming requirements, behavior, design expectations, tests, checks, or unresolved verification limits before reporting completion.
---

# Verify Change

1. Read the active Project Rules, the relevant requirement or design expectation, and the changed files.
2. Identify the smallest verification that can demonstrate each changed behavior. Increase coverage for higher-risk behavior, interfaces, migrations, security-sensitive code, or irreversible effects.
3. Run the relevant existing checks. Add or update focused tests only when verification requires them or the Project Rules require tests.
4. Inspect the result for requirement coverage, unintended regressions, and remaining uncertainty.
5. Report the checks run, their results, coverage limits, and any unresolved risk. Do not claim verification that was not performed.
