'use strict';

const fs = require('node:fs');
const path = require('node:path');

const METADATA_FILE = 'metadata.md';
const OVERRIDES = ['knowledge-schema.md', 'project-rules.md'];
const AGENT_FILES = ['AGENTS.md', 'CLAUDE.md'];
const MANAGED_BLOCK = /<!-- scaffold:start -->[\s\S]*?<!-- scaffold:end -->/;

function scaffoldDirectory(directory) {
  return path.join(directory, '.scaffold');
}

function metadataPath(directory) {
  return path.join(scaffoldDirectory(directory), METADATA_FILE);
}

function timestamp() {
  return new Date().toISOString();
}

function metadata({ lastReviewedVersion, installedAt, updatedAt }) {
  const lines = [
    '# Scaffold Metadata',
    '',
    `Last Reviewed Scaffold Version: ${lastReviewedVersion}`,
    'Shared Defaults: package-managed',
    `Installed At: ${installedAt}`,
  ];
  if (updatedAt) lines.push(`Last Updated: ${updatedAt}`);
  return `${lines.join('\n')}\n`;
}

function agentInstruction() {
  return `# Scaffold Project Instructions

<!-- scaffold:start -->
Read \`.scaffold/agent-guide.md\` before meaningful project work.
<!-- scaffold:end -->
`;
}

function readMetadata(directory) {
  const file = metadataPath(directory);
  if (!fs.existsSync(file)) return null;
  const contents = fs.readFileSync(file, 'utf8');
  const field = (name) => contents.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1];
  return {
    contents,
    lastReviewedVersion: field('Last Reviewed Scaffold Version') || field('Scaffold Version'),
    installedAt: field('Installed At'),
    updatedAt: field('Last Updated'),
  };
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
  fs.writeFileSync(metadataPath(directory), metadata({ lastReviewedVersion: version, installedAt: now }), 'utf8');
  fs.copyFileSync(path.join(packageRoot, 'defaults', 'agent-guide.md'), path.join(root, 'agent-guide.md'));
  const preserved = [];
  for (const filename of AGENT_FILES) {
    const destination = path.join(directory, filename);
    if (fs.existsSync(destination)) {
      const contents = fs.readFileSync(destination, 'utf8');
      if (MANAGED_BLOCK.test(contents)) {
        fs.writeFileSync(destination, contents.replace(MANAGED_BLOCK, agentInstruction().match(MANAGED_BLOCK)[0]), 'utf8');
      } else {
        preserved.push(filename);
      }
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
  const reviewRequired = details.lastReviewedVersion !== version;
  const activeArtifact = (label, name) => {
    const local = path.join(scaffoldDirectory(directory), name);
    const shared = path.join(packageRoot, 'defaults', name);
    return [`${label}:`, `  source: ${fs.existsSync(local) ? 'project' : 'shared'}`, `  path: ${fs.existsSync(local) ? local : shared}`];
  };
  const sharedKnowledgeModel = path.join(packageRoot, 'defaults', 'knowledge-model.md');
  const localKnowledgeModel = path.join(scaffoldDirectory(directory), 'knowledge-model.md');
  const artifactLines = [
    'Knowledge Model:',
    '  source: shared',
    `  path: ${sharedKnowledgeModel}`,
    ...activeArtifact('Knowledge Schema', 'knowledge-schema.md'),
    ...activeArtifact('Project Rules', 'project-rules.md'),
  ];
  for (const type of ['workflows', 'skills']) {
    const sharedRoot = path.join(packageRoot, type);
    const localRoot = path.join(scaffoldDirectory(directory), type);
    const entries = new Set();
    for (const root of [sharedRoot, localRoot]) if (fs.existsSync(root)) for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (type === 'workflows' && entry.isFile() && entry.name.endsWith('.md')) entries.add(entry.name.replace(/\.md$/, ''));
      if (type === 'skills' && entry.isDirectory() && fs.existsSync(path.join(root, entry.name, 'SKILL.md'))) entries.add(entry.name);
    }
    for (const name of [...entries].sort()) {
      const relative = type === 'workflows' ? `${type}/${name}.md` : `${type}/${name}/SKILL.md`;
      const localPath = path.join(localRoot, type === 'workflows' ? `${name}.md` : path.join(name, 'SKILL.md'));
      artifactLines.push(`${type === 'workflows' ? 'Workflow' : 'Skill'}: ${name}`, `  source: ${fs.existsSync(localPath) ? 'project' : 'shared'}`, `  path: ${fs.existsSync(localPath) ? localPath : path.join(packageRoot, relative)}`);
    }
  }
  const shadowed = found.filter((relative) => fs.existsSync(path.join(packageRoot, relative)));
  return { ok: true, lines: [
    `Scaffold project: ${directory}`,
    `Running Scaffold Version: ${version}`,
    `Last Reviewed Scaffold Version: ${details.lastReviewedVersion || 'unknown'}`,
    `Update Review Status: ${reviewRequired ? 'required' : 'current'}`,
    `Shared Package Root: ${packageRoot}`,
    ...artifactLines,
    'Agent Integration:',
    ...AGENT_FILES.map((filename) => `  ${filename}: ${fs.existsSync(path.join(directory, filename)) && MANAGED_BLOCK.test(fs.readFileSync(path.join(directory, filename), 'utf8')) ? 'configured' : 'integration required'}`),
    `Project-local replacements: ${found.length ? found.join(', ') : 'none'}`,
    ...(fs.existsSync(localKnowledgeModel) ? [`Unsupported project-local Knowledge Model ignored: ${localKnowledgeModel}`] : []),
    `Shadowed shared artifacts: ${shadowed.length ? shadowed.join(', ') : 'none'}`,
    ...(reviewRequired ? ['Run the shared adopt-harness-update workflow, then use "scaffold update" to record completion.'] : []),
  ] };
}

function updateProject({ directory, version }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  const now = timestamp();
  fs.writeFileSync(metadataPath(directory), metadata({ lastReviewedVersion: version, installedAt: details.installedAt || now, updatedAt: now }), 'utf8');
  const found = overrides(directory);
  const localKnowledgeModel = path.join(scaffoldDirectory(directory), 'knowledge-model.md');
  return { ok: true, lines: [
    `Recorded Scaffold version ${version} as reviewed.`,
    `Project-local replacements preserved: ${found.length ? found.join(', ') : 'none'}.`,
    ...(fs.existsSync(localKnowledgeModel) ? [`Unsupported project-local Knowledge Model preserved but ignored: ${localKnowledgeModel}.`] : []),
    'Shared defaults are supplied by the currently running package and were not copied or overwritten.',
  ] };
}

module.exports = { initProject, inspectProject, updateProject };
