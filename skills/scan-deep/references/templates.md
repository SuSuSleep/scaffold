# scan-deep Templates

Templates for Module UC and Module US files produced by `/scan-deep`.
Fill placeholders in `{braces}` with content derived from the code.
Lines marked `← fill` come from code; lines marked `← TBD` stay as shown.

---

## §1 — Module UC (`use-case.md`)

```markdown
# UC-{id}: {Module-Internal Goal Name}

## Source

TBD (will be linked after /compose)                            ← TBD

## Basic Information

- Trigger: {what event/call/request activates this entry point}   ← fill
- Preconditions:
  - Technical: {validation guards at the top of the function}  ← fill
  - Business: TBD (what business rules should apply here?)      ← TBD
- Postconditions: {state changes that result from success}      ← fill

## Main Flow

1. {first step inferred from code}                              ← fill
2. {second step}
3. {…}

## Exception Flows

- {code-level exception name} → See US-{id}                    ← fill (use code names)
- {…}

## Related Use Cases

- Depends on: TBD (depends on {module-name} — will resolve when that module's loop completes)
- Follow-up: TBD
- (remove this section entirely if no cross-module calls were found)

## Interface Contract

- Accepts: {input — request body fields, function arguments, event payload}  ← fill
- Emits: {output — response body, return value, events fired}                ← fill
```

---

## §2 — Module US (HTTP) (`us-{id}-{name}.md`)

Use this template when the entry point is an HTTP route handler.

```markdown
# US-{id}: {Feature Name}

## Links

- Belongs to: UC-{id}
- Related ADR: TBD

## Story

As a **TBD (who calls this — end user, internal service, or automated process?)**
When **TBD (what makes them call this — on demand, event, or schedule?)**
I want **TBD (what does the caller want to achieve?)**
So that **TBD (what stops working if this entry point disappears?)**

## Expected Behavior

TBD (fill in after /elicit)

## API Contract

### Endpoint

{HTTP method} {path — e.g. POST /api/v1/payments}              ← fill

### Request

| Field    | Type   | Required | Rules                     |
| -------- | ------ | -------- | ------------------------- |
| {field}  | {type} | {Yes/No} | {validation rule}         |

### Response

| Field    | Type   | Description               |
| -------- | ------ | ------------------------- |
| {field}  | {type} | {description}             |

### Error Codes

| Status | Error Code        | Description                |
| ------ | ----------------- | -------------------------- |
| {4xx}  | {ERROR_CODE}      | {when this occurs}         |

### Notes

- Idempotency: TBD

## Test Scenarios

### Scenario 1: TBD (happy path name — fill in after /elicit)

- **Given**: TBD
- **When**: TBD
- **Then**: the system SHALL TBD

### Scenario 2: TBD (exception case — {code-level exception name})

- **Given**: TBD
- **When**: TBD
- **Then**: the system SHALL TBD
```

---

## §3 — Module US (Non-HTTP) (`us-{id}-{name}.md`)

Use this template when the entry point is an exported function, event listener, or CLI
command — not an HTTP route.

```markdown
# US-{id}: {Feature Name}

## Links

- Belongs to: UC-{id}
- Related ADR: TBD

## Story

As a **TBD (who calls this — another module, a worker, or an external trigger?)**
When **TBD (what causes this to be called?)**
I want **TBD (what does the caller want to achieve?)**
So that **TBD (what stops working if this entry point disappears?)**

## Expected Behavior

TBD (fill in after /elicit)

## Interface Contract

### Signature

{function/event/command name}({params with types}) → {return type}   ← fill

### Parameters

| Parameter | Type   | Required | Rules                     |
| --------- | ------ | -------- | ------------------------- |
| {param}   | {type} | {Yes/No} | {validation rule}         |

### Returns

| Field    | Type   | Description               |
| -------- | ------ | ------------------------- |
| {field}  | {type} | {description}             |

### Throws / Error Codes

| Error              | When                       |
| ------------------ | -------------------------- |
| {ErrorType/code}   | {when this occurs}         |

### Notes

- Idempotency: TBD

## Test Scenarios

### Scenario 1: TBD (happy path name — fill in after /elicit)

- **Given**: TBD
- **When**: TBD
- **Then**: the system SHALL TBD

### Scenario 2: TBD (exception case — {code-level error})

- **Given**: TBD
- **When**: TBD
- **Then**: the system SHALL TBD
```
