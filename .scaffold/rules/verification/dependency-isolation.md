# verification.dependency-isolation

## Applies When

- Planning verification
- Creating or updating tests or checks
- Selecting verification boundaries

## Guidance

- Keep each Verification Item focused on its declared evidence scope.
- Prefer controlled substitutes for dependencies outside the verification boundary when doing so preserves the behavior being demonstrated.
- Do not substitute an interaction when that interaction itself is the verification target.
- Add explicit integration or boundary verification when independently verified components must interoperate correctly.
