# Project Verification Strategy

Document ID: GOV-003

> Evidence source: [`defaults/project-rules.md`](../../defaults/project-rules.md), [`skills/verify-change/SKILL.md`](../../skills/verify-change/SKILL.md), and [`PRD_delta1.md`](../../PRD_delta1.md), inspected 2026-08-20.

## Purpose

Define how Scaffold selects verification evidence across Solutions without making test methodology a default responsibility of an individual Solution record.

## Applies When

- Planning verification or defining Solution verification items.
- Writing or modifying tests.
- Reviewing test coverage or verifying implementation changes.
- Reviewing higher-risk interfaces, migrations, security-sensitive behavior, or irreversible effects.

## Does Not Normally Apply When

- Reconstructing business intent.
- Editing unrelated Problem knowledge.

## Guidance

### CTRL-001 — Project verification strategy

Select the smallest verification that can demonstrate each changed behavior, increasing coverage for higher-risk changes. Solution records define the specific expectation and expected evidence; this Governance record guides the choice of evidence, checks, and test level. Do not claim completed verification evidence before it has occurred.

## Verification

- Review each important Solution verification item for a clear target and expected evidence.
- Run the selected checks and report coverage limits and unresolved risk.

## Related Knowledge

- PROB-001#REQ-010 — Selective Governance consumption.
- SOL-005#CAP-002 — Project-level verification strategy.
- GOV-002#CON-002 — Agent-mediated semantic validation.
