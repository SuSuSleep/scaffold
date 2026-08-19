# Scaffold

Scaffold is a portable, knowledge-first software development harness. Its Knowledge Model is a shared semantic contract; projects may explicitly replace the Markdown Knowledge Schema, project rules, workflows, and skills.

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

`init` creates `.scaffold/metadata.md`, extension directories, and `knowledge/` directories. Shared operational defaults stay in the installed Scaffold package; they are not copied into the project. The Knowledge Model is always supplied by that package. A project can replace its Knowledge Schema and Project Rules with Markdown files in `.scaffold/`; local skills use `.scaffold/skills/<skill-name>/SKILL.md`.

For agent discovery, `init` makes one deliberate bootstrap exception: it creates `.scaffold/agent-guide.md` and, only when absent, root `AGENTS.md` and `CLAUDE.md`. These files tell Codex and Claude Code how to select Scaffold guidance for a request. Existing instruction files are never modified; the CLI reports when they need a manual integration.

`update` records the currently running Scaffold version in project metadata. It never overwrites a project-local schema, rules file, workflow, or skill.

When a new Scaffold version cannot be adopted through ordinary replacement, use the shared `workflows/migrate-project.md` guidance. Migration remains an explicit, project-owned activity; Scaffold does not perform automatic semantic migrations.

## Development

```bash
npm test
```
