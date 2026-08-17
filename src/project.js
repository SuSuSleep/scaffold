'use strict';

const fs = require('node:fs');
const path = require('node:path');

const METADATA_FILE = 'metadata.md';
const OVERRIDES = ['knowledge-schema.md', 'project-rules.md'];
const AGENT_FILES = ['AGENTS.md', 'CLAUDE.md'];

function scaffoldDirectory(directory) {
  return path.join(directory, '.scaffold');
}

function metadataPath(directory) {
  return path.join(scaffoldDirectory(directory), METADATA_FILE);
}

function timestamp() {
  return new Date().toISOString();
}

function metadata({ version, installedAt, updatedAt }) {
  const lines = [
    '# Scaffold Metadata',
    '',
    `Scaffold Version: ${version}`,
    'Shared Defaults: package-managed',
    `Installed At: ${installedAt}`,
  ];
  if (updatedAt) lines.push(`Last Updated: ${updatedAt}`);
  return `${lines.join('\n')}\n`;
}

function agentInstruction() {
  return `# Scaffold Project Instructions

Read \`.scaffold/agent-guide.md\` before performing meaningful work in this repository. It explains how to resolve Scaffold artifacts, choose a Workflow for the user's request, and determine whether durable knowledge needs updating.

Do not implicitly merge project-local Scaffold artifacts with shared defaults. Use \`scaffold status\` to locate the package-managed shared artifacts when needed.
`;
}

function readMetadata(directory) {
  const file = metadataPath(directory);
  if (!fs.existsSync(file)) return null;
  const contents = fs.readFileSync(file, 'utf8');
  const field = (name) => contents.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1];
  return { contents, version: field('Scaffold Version'), installedAt: field('Installed At'), updatedAt: field('Last Updated') };
}

function initProject({ directory, version, packageRoot }) {
  const root = scaffoldDirectory(directory);
  if (fs.existsSync(metadataPath(directory))) {
    return { ok: false, lines: [`Scaffold is already initialized in ${directory}.`, 'Use "scaffold status" to inspect it or "scaffold update" to update its metadata.'] };
  }

  fs.mkdirSync(directory, { recursive: true });
  for (const relative of ['.scaffold/workflows', '.scaffold/skills', 'knowledge/problem', 'knowledge/solution', 'knowledge/governance']) {
    fs.mkdirSync(path.join(directory, relative), { recursive: true });
  }
  const now = timestamp();
  fs.writeFileSync(metadataPath(directory), metadata({ version, installedAt: now }), 'utf8');
  fs.copyFileSync(path.join(packageRoot, 'defaults', 'agent-guide.md'), path.join(root, 'agent-guide.md'));
  const preserved = [];
  for (const filename of AGENT_FILES) {
    const destination = path.join(directory, filename);
    if (fs.existsSync(destination)) {
      preserved.push(filename);
    } else {
      fs.writeFileSync(destination, agentInstruction(), 'utf8');
    }
  }
  const integration = preserved.length
    ? `Existing agent instructions preserved: ${preserved.join(', ')}. Add the Scaffold guidance to them manually.`
    : 'Created AGENTS.md and CLAUDE.md to direct coding agents to the Scaffold guide.';
  return { ok: true, lines: [
    `Initialized Scaffold in ${directory}.`,
    'Shared defaults remain package-managed; only the local agent-discovery guide was created.',
    `Created ${path.relative(directory, root)}/metadata.md and knowledge directories.`,
    integration,
  ] };
}

function overrides(directory) {
  const root = scaffoldDirectory(directory);
  const found = OVERRIDES.filter((file) => fs.existsSync(path.join(root, file)));
  for (const type of ['workflows', 'skills']) {
    const dir = path.join(root, type);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.md')) found.push(`${type}/${entry.name}`);
      if (type === 'skills' && entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, 'SKILL.md'))) {
        found.push(`${type}/${entry.name}/SKILL.md`);
      }
    }
  }
  return found;
}

function inspectProject({ directory, version, packageRoot }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  const found = overrides(directory);
  return { ok: true, lines: [
    `Scaffold project: ${directory}`,
    `Installed version: ${details.version || 'unknown'}`,
    `Running version: ${version}`,
    `Shared defaults: ${path.join(packageRoot, 'defaults')}`,
    `Project-local replacements: ${found.length ? found.join(', ') : 'none'}`,
  ] };
}

function updateProject({ directory, version }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  const now = timestamp();
  fs.writeFileSync(metadataPath(directory), metadata({ version, installedAt: details.installedAt || now, updatedAt: now }), 'utf8');
  const found = overrides(directory);
  return { ok: true, lines: [
    `Updated Scaffold metadata to version ${version}.`,
    `Project-local replacements preserved: ${found.length ? found.join(', ') : 'none'}.`,
    'Shared defaults are supplied by the currently running package and were not copied or overwritten.',
  ] };
}

module.exports = { initProject, inspectProject, updateProject };
