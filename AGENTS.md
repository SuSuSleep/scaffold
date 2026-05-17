# Scaffold

> Agent orientation file. Read this at the start of every session.

## What this service does

A documentation scaffold for AI coding agents — a reusable starter template that gives coding agents structured business context so teams don't have to re-explain their project from scratch each session.

## Key rules

- Read docs/overview/architecture.md to understand current module structure
  and the authoritative directory layout before making any changes
- Follow coding and documentation standards in CONVENTIONS.md
- Confirm before editing any "update in place" document
- Never invent requirements not found in docs/use-cases/ or docs/drafts/
- Do not create directories not defined in docs/overview/architecture.md

## Workflow

Follow these steps in order — each skill is self-contained:

  /explore      → think through ambiguous requirements (optional, before drafting)
  /draft        → create business-layer UC/US in docs/drafts/use-cases/
  /review-draft → quality gate before planning
  /plan         → implementation plan + module-layer docs
  /apply        → implement code + behavioral + quality tests
  /merge        → promote confirmed docs out of drafts/
  /verify       → three-way alignment check before opening PR
