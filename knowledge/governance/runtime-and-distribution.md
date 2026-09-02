# Runtime and Package Distribution

Document ID: GOV-001

> Evidence source: [`package.json`](../../package.json) and [`README.md`](../../README.md), inspected 2026-08-20.

## Purpose

Scaffold is distributed as a Node.js package with a `scaffold` command-line entry point. The package declares its supported runtime through the Node engine field.

## Applies When

The package is published, run from its command-line entry point, developed locally, or verified in automation.

## Does Not Normally Apply When

Documenting Problem-space intent that has no runtime or package-distribution consequence.

## Records

### CON-001 — Supported Node.js runtime

Scaffold must support execution on Node.js 20 or later. Changes to package behavior, dependencies, or verification must preserve compatibility with that supported runtime range.

Constrains:

- SOL-001#IFC-001 — Scaffold command-line interface.
- SOL-002#CAP-004 — Package candidate and starter artifact provision.

## Verification

- Confirm that `package.json` declares `node >=20` in `engines`.
- Run the project test suite on a supported Node.js version before release.

## Related Knowledge

- SOL-001#IFC-001 — Scaffold command-line interface.
- SOL-002#CAP-004 — Package candidate and starter artifact provision.
