# Default Project Rules

## Knowledge

- Treat project knowledge as durable intent and code as its implementation.
- Inspect relevant knowledge, rules, and workflows before making a meaningful change.
- Update durable knowledge when implementation reveals or changes important behavior, constraints, or reasoning.

## Replacement

- A project-local artifact in `.scaffold/` replaces the corresponding shared artifact.
- Do not assume partial inheritance or implicit merging.

## Safety and Verification

- Preserve externally observable behavior unless an accepted change requires it.
- Verify completed changes in proportion to their risk.
- Convert recurring security, operational, or engineering findings into reusable governance knowledge when appropriate.
