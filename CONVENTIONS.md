# Conventions

> Documentation standards, naming conventions, and git rules for this project.
> AI must follow these. Humans should review and update as the project evolves.

---

## File Conventions

### Naming

- Files: `kebab-case.md`
- Directories: `kebab-case/`
- Headings: Title Case
- Classes / Functions / Constants / DB tables: N/A (markdown-only project)

### Comments

- Use blockquotes (`>`) for agent-facing notes and orientation hints within docs
- Comment the _why_, not the _what_

---

## Documentation Conventions

### Core Principle

> Always maintain current state only. History goes to git. Decision reasoning
> goes to ADR. Scenarios declared in US documents are the contract — they must
> be satisfied. Implementation quality tests live in code only and require no
> documentation.

### Two Document Layers

| Layer          | Location               | Owner           | Scope                      |
| -------------- | ---------------------- | --------------- | -------------------------- |
| Business       | docs/use-cases/        | Project manager | Cross-module user behavior |
| Implementation | docs/modules/{module}/ | Module manager  | Single module contract     |

### Document Types and Update Strategy

| Document                   | Location                              | Strategy                              |
| -------------------------- | ------------------------------------- | ------------------------------------- |
| System README              | /                                     | Update in place                       |
| CONVENTIONS                | /                                     | Update in place                       |
| Architecture               | docs/overview/                        | Update when structure changes         |
| Glossary                   | docs/overview/                        | Update in place                       |
| Test strategy              | docs/overview/                        | Update in place                       |
| Business UC/US (draft)     | docs/drafts/use-cases/                | Update in place                       |
| Business UC/US (confirmed) | docs/use-cases/                       | Update in place                       |
| Module UC/US (draft)       | docs/drafts/modules/{module}/         | Update in place                       |
| Module UC/US (confirmed)   | docs/modules/{module}/                | Update in place                       |
| Project ADR (draft)        | docs/drafts/adr/                      | Update in place                       |
| Project ADR (confirmed)    | docs/adr/                             | Delete when superseded                |
| Module ADR (draft)         | docs/drafts/modules/{module}/adr/     | Update in place                       |
| Module ADR (confirmed)     | docs/modules/{module}/adr/            | Delete when superseded                |
| Module README              | docs/modules/{module}/README.md       | Append on each UC/US confirmation     |
| Plan                       | docs/drafts/plans/                    | Check off items; delete on completion |

### Numbering and IDs

- Project ADRs: ADR-001, ADR-002, …
- Module ADRs: {module}-ADR-001, {module}-ADR-002, …
- Use cases: UC-001, UC-002, …
- User stories: US-001, US-002, …
- Plans: plan-001-{name}.md

### Linking Between Documents

Always use relative paths:
`See [Architecture](docs/overview/architecture.md) for system context.`

Mark unconfirmed references as TBD:
`- Related ADR: TBD (under discussion, see docs/drafts/adr/adr-draft-001-xxx)`

---

## Git Conventions

### Branch Naming

- Feature: `feat/short-description`
- Bug fix: `fix/short-description`
- Docs: `docs/short-description`
- Chore: `chore/short-description`

### Commit Messages

Follow Conventional Commits. Include enough context to explain _why_:

```
feat(skills): add review-draft quality gate before planning
docs(use-cases): move uc-001-checkout from drafts after confirmation
```

### PR Checklist

```
□ Are all US scenarios satisfied?
□ Are all behavioral tests placed and named per CONVENTIONS?
□ Do any module overviews need updating?
□ Are all referenced UCs / USs / ADRs in the confirmed folders?
  → If not, mark as "TBD"
□ Is there a new cross-module decision requiring a project-level ADR?
□ Does this merge introduce a new module, dependency, or interaction pattern?
  → Yes: update architecture.md
□ Is the final batch fully green?
```
