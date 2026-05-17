# @sususleep/scaffold

AI coding agent skills for a structured documentation workflow — supports Claude Code, Pi-mono, and GitHub Copilot.

## Install

```bash
npx @sususleep/scaffold install
```

You'll be asked which agents you use. Skills are copied to the appropriate global path for each.

```
? Which AI coding agents do you use?
  ◉ Claude Code       →  ~/.claude/skills/
  ◉ Pi-mono           →  ~/.agents/skills/
  ◯ GitHub Copilot    →  ~/.agents/skills/
```

Re-run any time to update to a newer version — existing skills are silently overwritten.

## Skills

| Skill | Description |
| --- | --- |
| `/explore` | Thinking partner for investigating problems before implementation |
| `/draft` | Create business-layer UC/US docs in `docs/drafts/` |
| `/review-draft` | Quality gate before planning |
| `/design-plan` | Implementation plan + module-layer docs |
| `/apply` | Implement code + behavioral + quality tests |
| `/merge` | Promote confirmed docs out of drafts |
| `/verify` | Three-way alignment check before opening PR |
| `/init` | Initialize a new project with the documentation scaffold |
| `/setup` | Fill in project-level knowledge (conventions, glossary, test strategy) |

## Start a new project

After installing, run `/init` in any project to create the documentation scaffold:

```
AGENTS.md / CLAUDE.md     ← agent orientation
CONVENTIONS.md            ← coding and doc standards
docs/overview/            ← architecture, glossary, test strategy
docs/drafts/              ← in-progress work
docs/use-cases/           ← confirmed business features
docs/modules/             ← module implementation contracts
```

## Pi-mono native discovery

This package declares `"pi.skills": "./skills"` so pi-mono can discover skills directly from the installed npm package without running the installer:

```bash
npm install -g @sususleep/scaffold
```

---

## Contributing

Skills live in `skills/`. Each skill is a directory with a `SKILL.md` file (YAML frontmatter + markdown instructions).
