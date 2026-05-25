# compose Templates

Templates for Business UC and Business US files produced by `/compose`.
Fill placeholders in `{braces}` with synthesized content from the interview and module docs.

---

## §1 — Business UC (`use-case.md`)

```markdown
# UC-{id}: {Business Goal Name — user-goal phrasing, e.g. "Complete Checkout"}

## Basic Information

- Primary Actor: {role name from Q3 — e.g. "Registered customer"}
- Preconditions:
  - {from Q6 — e.g. "User has a registered account"}
  - {technical: entry point preconditions from contributing module docs}
- Postconditions:
  - {composed from contributing module postconditions — what state changed}

## Main Flow

1. {first step at user-experience level — e.g. "User submits login credentials"}
2. {second step — e.g. "System authenticates and returns session tokens"}
3. {hand-off to next module — e.g. "User submits payment with valid session"}
4. {outcome — e.g. "System processes payment and marks order as paid"}
5. {follow-up — e.g. "System sends order confirmation to user"}

## Exception Flows

- {cross-module failure}: → See US-{id}
- {another failure}: → See US-{id}

## Related Use Cases

- Prerequisite: {UC-xxx or "None" — from Q6}
- Follow-up: {UC-xxx or "None" — from Q7}

## Implementation Layer Mapping

- {module-a} → docs/drafts/modules/{module-a}/use-cases/uc-{id}-{name}/
- {module-b} → docs/drafts/modules/{module-b}/use-cases/uc-{id}-{name}/
```

---

## §2 — Business US detailed (`us-{id}-{name}.md`)

```markdown
# US-{id}: {Feature Name — same as UC Business Goal Name}

## Links

- Belongs to: UC-{id}
- Related ADR: TBD

## Story

As a **{Primary Actor from Q3}**
When **{trigger from Q2 — what they do to start the flow}**
I want **{goal from Q4 — what they want to accomplish}**
So that **{value — what breaks if this flow disappears}**

## Expected Behavior

{2-3 sentences from Q2+Q4: what the user does, what the system does across modules,
and what the user ends up with. Written at the user-experience level — no module internals.}

## API Contract

### Entry Point(s)

{Primary user-facing endpoint — the one the user directly calls to start this flow.
If the flow requires multiple sequential calls from the client:}

| Step | Method | Path                    | Role                    |
| ---- | ------ | ----------------------- | ----------------------- |
| 1    | POST   | /api/auth/login         | Authenticate            |
| 2    | POST   | /api/v1/payments        | Submit payment          |

{If only one user-facing endpoint, use simple form:
POST /api/v1/payments}

### Notes

- Auth requirement: {e.g. "Step 2 requires Bearer token from Step 1"}
- Idempotency: TBD

## Test Scenarios

### Scenario 1: {Happy path name — from Q4, e.g. "Valid credentials and card — order confirmed"}

- **Given**: TBD
- **When**: TBD
- **Then**: the system SHALL TBD

### Scenario 2: {Cross-module failure — e.g. "Auth succeeds but payment card declined"}

- **Given**: TBD
- **When**: TBD
- **Then**: the system SHALL {exact user experience from Q5}

### Scenario 3: {Another cross-module failure from Q5}

- **Given**: TBD
- **When**: TBD
- **Then**: the system SHALL {exact user experience from Q5}
```
