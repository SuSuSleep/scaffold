# Architecture

## Module Overview

| Module | Responsibility |
| ------ | -------------- |
| apply | TBD (fill in after /scan-deep) |
| compose | TBD (fill in after /scan-deep) |
| design-plan | TBD (fill in after /scan-deep) |
| draft | TBD (fill in after /scan-deep) |
| elicit | TBD (fill in after /scan-deep) |
| explore | TBD (fill in after /scan-deep) |
| init | TBD (fill in after /scan-deep) |
| merge | TBD (fill in after /scan-deep) |
| review-draft | TBD (fill in after /scan-deep) |
| scan-all | TBD (fill in after /scan-deep) |
| scan-deep | TBD (fill in after /scan-deep) |
| schema-update | TBD (fill in after /scan-deep) |
| setup | TBD (fill in after /scan-deep) |
| verify | TBD (fill in after /scan-deep) |

## Directory Structure

The authoritative definition of what each directory is for.
AI must not create directories outside this structure without updating this file.

| Directory             | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| docs/use-cases/       | Business-layer confirmed features                         |
| docs/modules/         | Module-layer confirmed contracts                          |
| docs/adr/             | Project-level architecture decisions                      |
| docs/drafts/          | All work in progress                                      |
| skills/{module}/      | Module implementation — no extra nesting                  |
| tests/behavioral/     | Layer 1 behavioral tests — driven by US scenarios         |
| tests/implementation/ | Layer 2 implementation quality tests                      |

## System Diagram

(Add Mermaid diagram here as modules are documented — see architecture.md conventions)

## Key Cross-Module Interaction Patterns

Document patterns here as they emerge.
