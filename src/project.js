'use strict';

const fs = require('node:fs');
const path = require('node:path');

const METADATA_FILE = 'metadata.md';
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

function agentGuideBootstrap() {
  return `# Scaffold Agent Guide Bootstrap

This Scaffold-owned integration file intentionally contains no copied Harness guidance.
Before meaningful project work, run \`scaffold status\` and read the agent guide from
the currently installed Scaffold package at the reported Shared Package Root. This
keeps shared guidance, workflows, skills, and the agent entry guidance on the same
active Harness generation after package upgrades.
`;
}

function synchronizeAgentGuide(directory) {
  fs.writeFileSync(path.join(scaffoldDirectory(directory), 'agent-guide.md'), agentGuideBootstrap(), 'utf8');
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

function initProject({ directory, version, packageRoot, decideHostIntegration }) {
  const root = scaffoldDirectory(directory);
  if (fs.existsSync(metadataPath(directory))) {
    return { ok: false, lines: [`Scaffold is already initialized in ${directory}.`, 'Use "scaffold status" to inspect it or "scaffold update" to update its metadata.'] };
  }

  fs.mkdirSync(directory, { recursive: true });
  for (const relative of ['.scaffold/workflows', '.scaffold/skills', '.scaffold/templates']) {
    fs.mkdirSync(path.join(directory, relative), { recursive: true });
  }
  const now = timestamp();
  fs.writeFileSync(metadataPath(directory), metadata({ lastReviewedVersion: version, installedAt: now }), 'utf8');
  synchronizeAgentGuide(directory);
  const preserved = [];
  for (const filename of AGENT_FILES) {
    const destination = path.join(directory, filename);
    if (fs.existsSync(destination)) {
      const contents = fs.readFileSync(destination, 'utf8');
      if (MANAGED_BLOCK.test(contents)) {
        fs.writeFileSync(destination, contents.replace(MANAGED_BLOCK, agentInstruction().match(MANAGED_BLOCK)[0]), 'utf8');
      } else {
        const decision = decideHostIntegration?.(filename, agentInstruction()) || 'leave';
        if (decision === 'add') {
          fs.writeFileSync(destination, `${contents}${contents.endsWith('\n') ? '\n' : '\n\n'}${agentInstruction()}`, 'utf8');
        } else {
          preserved.push(filename);
        }
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
    `Created ${path.relative(directory, root)}/metadata.md and Harness extension directories.`,
    integration,
  ] };
}

function directoryEntries(root, predicate) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).filter(predicate).map((entry) => entry.name);
}

function resolvedArtifacts(directory, packageRoot) {
  const localRoot = scaffoldDirectory(directory);
  const artifacts = [
    { label: 'Knowledge Schema:', name: 'knowledge-schema', local: path.join(localRoot, 'knowledge-schema.md'), shared: path.join(packageRoot, 'defaults/knowledge-schema.md') },
    { label: 'Project Rules:', name: 'project-rules', local: path.join(localRoot, 'project-rules.md'), shared: path.join(packageRoot, 'defaults/project-rules.md') },
  ];
  const addNamed = (label, type, localPredicate, sharedPredicate, filePath) => {
    const localBase = path.join(localRoot, type);
    const sharedBase = path.join(packageRoot, type === 'templates' ? 'defaults/templates' : type);
    const names = new Set([
      ...directoryEntries(localBase, localPredicate),
      ...directoryEntries(sharedBase, sharedPredicate),
    ]);
    for (const name of [...names].sort()) artifacts.push({
      label: `${label}: ${name.replace(/\.md$/, '')}`,
      name: `${type}/${name}`,
      local: path.join(localBase, filePath(name)),
      shared: path.join(sharedBase, filePath(name)),
    });
  };
  addNamed('Workflow', 'workflows', (entry) => entry.isFile() && entry.name.endsWith('.md'), (entry) => entry.isFile() && entry.name.endsWith('.md'), (name) => name);
  addNamed('Skill', 'skills', (entry) => entry.isDirectory() && fs.existsSync(path.join(localRoot, 'skills', entry.name, 'SKILL.md')), (entry) => entry.isDirectory() && fs.existsSync(path.join(packageRoot, 'skills', entry.name, 'SKILL.md')), (name) => path.join(name, 'SKILL.md'));
  addNamed('Template', 'templates', (entry) => entry.isFile() && entry.name.endsWith('.md'), (entry) => entry.isFile() && entry.name.endsWith('.md'), (name) => name);
  return artifacts.map((artifact) => ({ ...artifact, source: fs.existsSync(artifact.local) ? 'project' : 'shared', path: fs.existsSync(artifact.local) ? artifact.local : artifact.shared }));
}

function localReplacements(directory, packageRoot) {
  return resolvedArtifacts(directory, packageRoot).filter((artifact) => artifact.source === 'project');
}

function inspectProject({ directory, version, packageRoot }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  synchronizeAgentGuide(directory);
  const artifacts = resolvedArtifacts(directory, packageRoot);
  const found = localReplacements(directory, packageRoot);
  const reviewRequired = details.lastReviewedVersion !== version;
  const sharedKnowledgeModel = path.join(packageRoot, 'defaults', 'knowledge-model.md');
  const localKnowledgeModel = path.join(scaffoldDirectory(directory), 'knowledge-model.md');
  const artifactLines = [
    'Knowledge Model:',
    '  source: shared',
    `  path: ${sharedKnowledgeModel}`,
    ...artifacts.flatMap((artifact) => [artifact.label, `  source: ${artifact.source}`, `  path: ${artifact.path}`]),
  ];
  const shadowed = found.filter((artifact) => fs.existsSync(artifact.shared)).map((artifact) => path.relative(packageRoot, artifact.shared));
  return { ok: true, lines: [
    `Scaffold project: ${directory}`,
    `Running Scaffold Version: ${version}`,
    `Last Reviewed Scaffold Version: ${details.lastReviewedVersion || 'unknown'}`,
    `Update Review Status: ${reviewRequired ? 'required' : 'current'}`,
    `Shared Package Root: ${packageRoot}`,
    ...artifactLines,
    'Agent Integration:',
    ...AGENT_FILES.map((filename) => `  ${filename}: ${fs.existsSync(path.join(directory, filename)) && MANAGED_BLOCK.test(fs.readFileSync(path.join(directory, filename), 'utf8')) ? 'configured' : 'integration required'}`),
    `Project-local replacements: ${found.length ? found.map((artifact) => path.relative(scaffoldDirectory(directory), artifact.local)).join(', ') : 'none'}`,
    ...(fs.existsSync(localKnowledgeModel) ? [`Unsupported project-local Knowledge Model ignored: ${localKnowledgeModel}`] : []),
    `Shadowed shared artifacts: ${shadowed.length ? shadowed.join(', ') : 'none'}`,
    ...(reviewRequired ? ['Complete the shared adopt-harness-update review, then use "scaffold update" to attest and record completion.'] : []),
  ] };
}

function updateProject({ directory, version, packageRoot }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  const now = timestamp();
  fs.writeFileSync(metadataPath(directory), metadata({ lastReviewedVersion: version, installedAt: details.installedAt || now, updatedAt: now }), 'utf8');
  synchronizeAgentGuide(directory);
  const found = localReplacements(directory, packageRoot);
  const localKnowledgeModel = path.join(scaffoldDirectory(directory), 'knowledge-model.md');
  return { ok: true, lines: [
    `Recorded your attestation that Scaffold version ${version} has been reviewed.`,
    `Project-local replacements preserved: ${found.length ? found.map((artifact) => path.relative(scaffoldDirectory(directory), artifact.local)).join(', ') : 'none'}.`,
    ...(fs.existsSync(localKnowledgeModel) ? [`Unsupported project-local Knowledge Model preserved but ignored: ${localKnowledgeModel}.`] : []),
    'This command records review completion; semantic validation remains agent-driven. Shared defaults are supplied by the currently running package and were not copied or overwritten.',
  ] };
}

module.exports = { initProject, inspectProject, updateProject };
