---
name: implement-with-tdd
description: Implement software changes with test-driven development. Use when the user requests TDD or active Project Rules require it, to define behavior with a failing test, make the smallest passing change, and refactor safely.
---

# Implement with TDD

1. Read the active Project Rules and the relevant existing tests.
2. Use TDD when the user requests it or the Project Rules require it. Otherwise, treat it as an optional strategy; do not impose it.
3. Express one intended behavior in a focused failing test.
4. Make the smallest production change that makes the test pass.
5. Refactor only while the relevant verification remains green.
6. Run the relevant tests and report the result, including any constraint that prevented full verification.
