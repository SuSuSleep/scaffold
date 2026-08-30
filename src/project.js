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
keeps shared guidance, workflow Skills, model-invoked Skills, and the agent entry guidance on the same
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
  for (const relative of [
    '.scaffold/skills',
    '.scaffold/rules/core',
    '.scaffold/rules/documentation',
    '.scaffold/rules/coding',
    '.scaffold/rules/verification',
    '.scaffold/rules/security',
    '.scaffold/rules/architecture',
    '.scaffold/rules/delivery',
    '.scaffold/templates/problem',
    '.scaffold/templates/solution',
    '.scaffold/templates/governance',
  ]) {
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

function templateNames(root, relative = '') {
  const directory = path.join(root, relative);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) return templateNames(root, name);
    return entry.isFile() && entry.name.endsWith('.md') ? [name] : [];
  });
}

function markdownFiles(root, relative = '') {
  const directory = path.join(root, relative);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) return markdownFiles(root, name);
    return entry.isFile() && entry.name.endsWith('.md') ? [name] : [];
  });
}

function projectMarkdownFiles(root, relative = '') {
  const directory = path.join(root, relative);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ['.git', '.scaffold', 'node_modules'].includes(entry.name)) return [];
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) return projectMarkdownFiles(root, name);
    return entry.isFile() && entry.name.endsWith('.md') ? [name] : [];
  });
}

function documentIds(directory) {
  const ids = new Map();
  for (const relative of projectMarkdownFiles(directory)) {
    const file = path.join(directory, relative);
    const matches = fs.readFileSync(file, 'utf8').matchAll(/^Document ID:\s*([A-Z][A-Z0-9]*-\d+)\s*$/gm);
    for (const match of matches) {
      const paths = ids.get(match[1]) || [];
      paths.push(file);
      ids.set(match[1], paths);
    }
  }
  return ids;
}

function nextDocumentId({ directory, prefix }) {
  const ids = documentIds(directory);
  const used = new Set([...ids.keys()]
    .map((id) => id.match(new RegExp(`^${prefix}-(\\d+)$`))?.[1])
    .filter(Boolean)
    .map(Number));
  let number = 1;
  while (used.has(number)) number += 1;
  return { ok: true, lines: [`${prefix}-${String(number).padStart(3, '0')}`] };
}

function checkDocumentId({ directory, id }) {
  const paths = documentIds(directory).get(id) || [];
  return paths.length
    ? { ok: false, lines: ['already used:', ...paths.map((file) => path.relative(directory, file))] }
    : { ok: true, lines: ['available'] };
}

function ruleIdentity(file) {
  const heading = fs.readFileSync(file, 'utf8').match(/^# ([a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+)\s*$/m)?.[1];
  return heading || null;
}

function rulesAt(root, source) {
  return markdownFiles(root).map((name) => {
    const file = path.join(root, name);
    return { source, relative: name, path: file, identity: ruleIdentity(file) };
  });
}

function resolvedRules(directory, packageRoot) {
  const shared = rulesAt(path.join(packageRoot, 'defaults/rules'), 'shared');
  const local = rulesAt(path.join(scaffoldDirectory(directory), 'rules'), 'project');
  const invalid = [...shared, ...local].filter((rule) => !rule.identity);
  const duplicateIdentities = (rules) => rules.reduce((duplicates, rule) => {
    if (!rule.identity) return duplicates;
    const matching = rules.filter((candidate) => candidate.identity === rule.identity);
    if (matching.length > 1 && !duplicates.some((entry) => entry.identity === rule.identity && entry.source === rule.source)) {
      duplicates.push({ identity: rule.identity, source: rule.source, paths: matching.map((entry) => entry.path) });
    }
    return duplicates;
  }, []);
  const duplicates = [...duplicateIdentities(shared), ...duplicateIdentities(local)];
  const sharedByIdentity = new Map(shared.filter((rule) => rule.identity).map((rule) => [rule.identity, rule]));
  const localByIdentity = new Map(local.filter((rule) => rule.identity).map((rule) => [rule.identity, rule]));
  const identities = new Set([...sharedByIdentity.keys(), ...localByIdentity.keys()]);
  const rules = [...identities].sort().map((identity) => {
    const sharedRule = sharedByIdentity.get(identity);
    const localRule = localByIdentity.get(identity);
    const active = localRule || sharedRule;
    return {
      identity,
      source: active.source,
      path: active.path,
      disposition: sharedRule && localRule ? 'local replacement' : localRule ? 'local addition' : 'shared',
      shared: sharedRule,
      local: localRule,
    };
  });
  return { rules, invalid, duplicates, legacy: path.join(scaffoldDirectory(directory), 'project-rules.md') };
}

function resolvedArtifacts(directory, packageRoot) {
  const localRoot = scaffoldDirectory(directory);
  const artifacts = [
    { label: 'Knowledge Model:', name: 'knowledge-model', local: path.join(localRoot, 'knowledge-model.md'), shared: path.join(packageRoot, 'defaults/knowledge-model.md') },
    { label: 'Knowledge Schema:', name: 'knowledge-schema', local: path.join(localRoot, 'knowledge-schema.md'), shared: path.join(packageRoot, 'defaults/knowledge-schema.md') },
  ];
  const addNamed = (label, type, localPredicate, sharedPredicate, filePath) => {
    const localBase = path.join(localRoot, type);
    const sharedBase = path.join(packageRoot, type === 'templates' ? 'defaults/templates' : type);
    const names = new Set(type === 'templates'
      ? [...templateNames(localBase), ...templateNames(sharedBase)]
      : [
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
  addNamed('Skill', 'skills', (entry) => entry.isDirectory() && fs.existsSync(path.join(localRoot, 'skills', entry.name, 'SKILL.md')), (entry) => entry.isDirectory() && fs.existsSync(path.join(packageRoot, 'skills', entry.name, 'SKILL.md')), (name) => path.join(name, 'SKILL.md'));
  addNamed('Template', 'templates', (entry) => entry.isFile() && entry.name.endsWith('.md'), (entry) => entry.isFile() && entry.name.endsWith('.md'), (name) => name);
  return artifacts.map((artifact) => {
    const artifactPath = fs.existsSync(artifact.local) ? artifact.local : artifact.shared;
    const isSkill = artifact.name.startsWith('skills/');
    const isWorkflowSkill = isSkill && fs.existsSync(path.join(path.dirname(artifactPath), 'agents', 'openai.yaml'));
    return {
      ...artifact,
      label: isWorkflowSkill ? artifact.label.replace('Skill:', 'Workflow Skill:') : artifact.label,
      source: fs.existsSync(artifact.local) ? 'project' : 'shared',
      path: artifactPath,
    };
  });
}

function localReplacements(directory, packageRoot) {
  return resolvedArtifacts(directory, packageRoot).filter((artifact) => artifact.source === 'project');
}

function inspectProject({ directory, version, packageRoot }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  synchronizeAgentGuide(directory);
  const artifacts = resolvedArtifacts(directory, packageRoot);
  const ruleSet = resolvedRules(directory, packageRoot);
  const found = localReplacements(directory, packageRoot);
  const reviewRequired = details.lastReviewedVersion !== version;
  const artifactLines = [
    ...artifacts.flatMap((artifact) => [artifact.label, `  source: ${artifact.source}`, `  path: ${artifact.path}`]),
    'Project Rules:',
    ...(ruleSet.rules.length ? ruleSet.rules.flatMap((rule) => [
      `  Rule: ${rule.identity}`,
      `    source: ${rule.source}`,
      `    disposition: ${rule.disposition}`,
      `    path: ${rule.path}`,
    ]) : ['  none discovered']),
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
    `Project-local Rules: ${ruleSet.rules.filter((rule) => rule.local).length ? ruleSet.rules.filter((rule) => rule.local).map((rule) => path.relative(scaffoldDirectory(directory), rule.local.path)).join(', ') : 'none'}`,
    ...(fs.existsSync(ruleSet.legacy) ? [`Legacy monolithic Project Rules require deliberate migration and are ignored: ${ruleSet.legacy}`] : []),
    ...ruleSet.invalid.map((rule) => `Invalid Project Rule identity (expected a dotted identity in the H1 heading): ${rule.path}`),
    ...ruleSet.duplicates.map((duplicate) => `Duplicate ${duplicate.source} Project Rule identity ${duplicate.identity}: ${duplicate.paths.join(', ')}`),
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
  const ruleSet = resolvedRules(directory, packageRoot);
  return { ok: true, lines: [
    `Recorded your attestation that Scaffold version ${version} has been reviewed.`,
    `Project-local replacements preserved: ${found.length ? found.map((artifact) => path.relative(scaffoldDirectory(directory), artifact.local)).join(', ') : 'none'}.`,
    `Project-local Rules preserved: ${ruleSet.rules.filter((rule) => rule.local).length ? ruleSet.rules.filter((rule) => rule.local).map((rule) => path.relative(scaffoldDirectory(directory), rule.local.path)).join(', ') : 'none'}.`,
    'This command records review completion; semantic validation remains agent-driven. Shared defaults are supplied by the currently running package and were not copied or overwritten.',
  ] };
}

module.exports = { checkDocumentId, initProject, inspectProject, nextDocumentId, updateProject };
