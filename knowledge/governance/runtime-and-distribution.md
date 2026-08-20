# Runtime and Package Distribution

Document ID: GOV-001

> Evidence source: [`package.json`](../../package.json) and [`README.md`](../../README.md), inspected 2026-08-20.

## Context

Scaffold is distributed as a Node.js package with a `scaffold` command-line entry point. The package declares its supported runtime through the Node engine field.

## Obligation or Control

### CON-001 — Supported Node.js runtime

Scaffold must support execution on Node.js 20 or later. Changes to package behavior, dependencies, or verification must preserve compatibility with that supported runtime range.

Constrains:

- SOL-001#IFC-001 — Scaffold command-line interface.
- SOL-002#CAP-001 — Shared guidance artifact provision.

## Applicability

This constraint applies to the published package, command-line use, local development, and automated verification of Scaffold.

## Verification

- Confirm that `package.json` declares `node >=20` in `engines`.
- Run the project test suite on a supported Node.js version before release.

## Related Knowledge

- SOL-001#IFC-001 — Scaffold command-line interface.
- SOL-002#CAP-001 — Shared guidance artifact provision.
