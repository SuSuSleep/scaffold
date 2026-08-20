# Scaffold

Scaffold is a portable, knowledge-first software development harness. Its Knowledge Model is a shared, non-replaceable semantic contract; projects may explicitly replace the Markdown Knowledge Schema, Project Rules, Workflows, Skills, and Templates.

Workflows own the sequence of work through ordered Phases. Each Phase states its goal and required outcome; Skills are reusable, optional method guidance suggested by a Phase. Project Rules may require a particular method, such as TDD, without changing the Workflow. In short: workflow owns sequencing, phase owns intent, outcome owns completion, and skill owns method.

## Requirements

Node.js 20 or later.

## Install and use

```bash
npm install --global @sususleep/scaffold
scaffold init /path/to/project
scaffold status /path/to/project
scaffold update /path/to/project
```

`init` creates `.scaffold/metadata.md` and Harness extension directories for workflows, skills, and templates. It does not impose a `knowledge/` layout: the active Knowledge Schema and `initialize-project` Workflow establish project knowledge representation. Shared operational defaults stay in the installed Scaffold package; they are not copied into the project. The Knowledge Model is always supplied by that package. A project can replace its Knowledge Schema and Project Rules with Markdown files in `.scaffold/`; local workflows use `.scaffold/workflows/<name>.md`, skills use `.scaffold/skills/<name>/SKILL.md`, and templates use `.scaffold/templates/<name>.md`.

For agent discovery, `init` creates a Scaffold-owned `.scaffold/agent-guide.md` bootstrap that resolves the current package guidance rather than copying it. It creates root `AGENTS.md` and `CLAUDE.md` only when absent. Existing host-owned instruction files are preserved; an interactive terminal may add or preview a managed Scaffold block, while non-interactive runs report incomplete integration. Existing managed blocks may be updated without changing surrounding content.

`status` reports resolved artifact sources and shadowed shared artifacts. After `adopt-harness-update` has completed its conflict, drift, migration, and consistency review, `update` records the currently running Scaffold version as reviewed. It never overwrites project-local replacements.

When a new Scaffold version cannot be adopted through ordinary replacement, use the shared `workflows/migrate-project.md` guidance. Migration remains an explicit, project-owned activity; Scaffold does not perform automatic semantic migrations.

## Development

```bash
npm test
```
