'use strict';

const fs = require('node:fs');
const path = require('node:path');

const METADATA_FILE = 'metadata.md';
const AGENT_FILES = ['AGENTS.md', 'CLAUDE.md'];
const AGENT_SKILL_DIRECTORIES = ['.agents/skills', '.claude/skills'];
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
    'Harness Artifacts: project-local',
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

function workflowSkillNames(skillsRoot) {
  return directoryEntries(skillsRoot, (entry) => entry.isDirectory()
    && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md'))
    && fs.existsSync(path.join(skillsRoot, entry.name, 'agents', 'openai.yaml'))).sort();
}

function copyMissing(source, destination) {
  if (fs.existsSync(destination)) return false;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
  return true;
}

function materializeHarness(directory, packageRoot) {
  const root = scaffoldDirectory(directory);
  const entries = [
    ['defaults/agent-guide.md', 'agent-guide.md'],
    ['defaults/knowledge-model.md', 'knowledge-model.md'],
    ['defaults/knowledge-schema.md', 'knowledge-schema.md'],
    ['defaults/rules', 'rules'],
    ['defaults/templates', 'templates'],
    ['skills', 'skills'],
  ];
  const created = entries.filter(([source, destination]) => copyMissing(path.join(packageRoot, source), path.join(root, destination)));
  return { created, preserved: entries.length - created.length };
}

function synchronizeAgentSkills(directory) {
  const skillsRoot = path.join(scaffoldDirectory(directory), 'skills');
  if (!fs.existsSync(skillsRoot)) return { linked: [], conflicts: [] };
  const linked = [];
  const conflicts = [];
  for (const relativeDirectory of AGENT_SKILL_DIRECTORIES) {
    const agentSkillsRoot = path.join(directory, relativeDirectory);
    fs.mkdirSync(agentSkillsRoot, { recursive: true });
    for (const name of workflowSkillNames(skillsRoot)) {
      const destination = path.join(agentSkillsRoot, name);
      const target = path.relative(agentSkillsRoot, path.join(skillsRoot, name));
      const legacyTarget = path.relative(agentSkillsRoot, path.join(directory, 'skills', name));
      let existing = null;
      try {
        existing = fs.lstatSync(destination);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      if (existing) {
        const existingTarget = existing.isSymbolicLink() ? fs.readlinkSync(destination) : null;
        if (existingTarget === target) {
          linked.push(path.join(relativeDirectory, name));
        } else if (existingTarget === legacyTarget) {
          fs.unlinkSync(destination);
          fs.symlinkSync(target, destination, 'dir');
          linked.push(path.join(relativeDirectory, name));
        } else {
          conflicts.push(path.join(relativeDirectory, name));
        }
        continue;
      }
      fs.symlinkSync(target, destination, 'dir');
      linked.push(path.join(relativeDirectory, name));
    }
  }
  return { linked, conflicts };
}

function initProject({ directory, version, packageRoot, decideHostIntegration }) {
  const root = scaffoldDirectory(directory);
  if (fs.existsSync(metadataPath(directory))) {
    return { ok: false, lines: [`Scaffold is already initialized in ${directory}.`, 'Use "scaffold status" to inspect it or "scaffold update" to update its metadata.'] };
  }

  fs.mkdirSync(directory, { recursive: true });
  fs.mkdirSync(root, { recursive: true });
  const now = timestamp();
  fs.writeFileSync(metadataPath(directory), metadata({ lastReviewedVersion: version, installedAt: now }), 'utf8');
  const harness = materializeHarness(directory, packageRoot);
  const agentSkills = synchronizeAgentSkills(directory);
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
    `Materialized ${harness.created.length} Harness artifact groups in .scaffold/; preserved ${harness.preserved} existing groups.`,
    `Linked ${agentSkills.linked.length} user-invoked skills for Codex and Claude Code.${agentSkills.conflicts.length ? ` Existing agent-skill entries preserved: ${agentSkills.conflicts.join(', ')}.` : ''}`,
    'All active Harness guidance is project-local; the installed package remains an initialization and update candidate bundle.',
    `Created ${path.relative(directory, root)}/metadata.md and materialized Harness guidance.`,
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

function filesAt(root, relative = '') {
  const directory = path.join(root, relative);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) return filesAt(root, name);
    return entry.isFile() ? [name] : [];
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

function rulesAt(root) {
  return markdownFiles(root).map((name) => {
    const file = path.join(root, name);
    return { relative: name, path: file, identity: ruleIdentity(file) };
  });
}

function resolvedRules(directory) {
  const rules = rulesAt(path.join(scaffoldDirectory(directory), 'rules'));
  const invalid = rules.filter((rule) => !rule.identity);
  const duplicates = rules.reduce((duplicates, rule) => {
    if (!rule.identity) return duplicates;
    const matching = rules.filter((candidate) => candidate.identity === rule.identity);
    if (matching.length > 1 && !duplicates.some((entry) => entry.identity === rule.identity)) {
      duplicates.push({ identity: rule.identity, paths: matching.map((entry) => entry.path) });
    }
    return duplicates;
  }, []);
  return { rules, invalid, duplicates, legacy: path.join(scaffoldDirectory(directory), 'project-rules.md') };
}

function resolvedArtifacts(directory) {
  const localRoot = scaffoldDirectory(directory);
  const artifacts = [
    { label: 'Knowledge Model:', name: 'knowledge-model.md', path: path.join(localRoot, 'knowledge-model.md') },
    { label: 'Knowledge Schema:', name: 'knowledge-schema.md', path: path.join(localRoot, 'knowledge-schema.md') },
  ];
  const addNamed = (label, type, predicate, filePath) => {
    const localBase = path.join(localRoot, type);
    const names = type === 'templates' ? templateNames(localBase) : directoryEntries(localBase, predicate);
    for (const name of names.sort()) artifacts.push({
      label: `${label}: ${name.replace(/\.md$/, '')}`,
      name: `${type}/${name}`,
      path: path.join(localBase, filePath(name)),
    });
  };
  addNamed('Skill', 'skills', (entry) => entry.isDirectory() && fs.existsSync(path.join(localRoot, 'skills', entry.name, 'SKILL.md')), (name) => path.join(name, 'SKILL.md'));
  addNamed('Template', 'templates', (entry) => entry.isFile() && entry.name.endsWith('.md'), (name) => name);
  return artifacts.filter((artifact) => fs.existsSync(artifact.path)).map((artifact) => {
    const isSkill = artifact.name.startsWith('skills/');
    const isWorkflowSkill = isSkill && fs.existsSync(path.join(path.dirname(artifact.path), 'agents', 'openai.yaml'));
    return {
      ...artifact,
      label: isWorkflowSkill ? artifact.label.replace('Skill:', 'Workflow Skill:') : artifact.label,
      source: 'project',
    };
  });
}

function candidateFiles(packageRoot) {
  const files = new Map();
  const add = (root, prefix = '') => filesAt(root).forEach((name) => files.set(path.join(prefix, name), path.join(root, name)));
  add(path.join(packageRoot, 'defaults'), '');
  add(path.join(packageRoot, 'skills'), 'skills');
  return files;
}

function projectArtifactFiles(directory) {
  const root = scaffoldDirectory(directory);
  const files = new Map();
  const add = (base, prefix = '') => filesAt(base).forEach((name) => files.set(path.join(prefix, name), path.join(base, name)));
  for (const name of ['agent-guide.md', 'knowledge-model.md', 'knowledge-schema.md']) {
    const file = path.join(root, name);
    if (fs.existsSync(file)) files.set(name, file);
  }
  add(path.join(root, 'rules'), 'rules');
  add(path.join(root, 'templates'), 'templates');
  add(path.join(root, 'skills'), 'skills');
  return files;
}

function updateDiff(directory, packageRoot) {
  if (!readMetadata(directory)) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  const project = projectArtifactFiles(directory);
  const candidate = candidateFiles(packageRoot);
  const names = new Set([...project.keys(), ...candidate.keys()]);
  const lines = [...names].sort().flatMap((name) => {
    if (!project.has(name)) return [`added: ${name}`];
    if (!candidate.has(name)) return [`package-removed: ${name}`];
    return fs.readFileSync(project.get(name), 'utf8') === fs.readFileSync(candidate.get(name), 'utf8') ? [] : [`changed: ${name}`];
  });
  return { ok: true, lines: lines.length ? lines : ['No Harness artifact differences.'] };
}

function inspectProject({ directory, version, packageRoot }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  const artifacts = resolvedArtifacts(directory);
  const ruleSet = resolvedRules(directory);
  const reviewRequired = details.lastReviewedVersion !== version;
  const artifactLines = [
    ...artifacts.flatMap((artifact) => [artifact.label, `  source: ${artifact.source}`, `  path: ${artifact.path}`]),
    'Project Rules:',
    ...(ruleSet.rules.length ? ruleSet.rules.flatMap((rule) => [
      `  Rule: ${rule.identity}`,
      '    source: project',
      `    path: ${rule.path}`,
    ]) : ['  none discovered']),
  ];
  return { ok: true, lines: [
    `Scaffold project: ${directory}`,
    `Installed Scaffold Version: ${version}`,
    `Project Harness Version: ${details.lastReviewedVersion || 'unknown'}`,
    `Update Review Status: ${reviewRequired ? 'required' : 'current'}`,
    `Package Candidate Root: ${packageRoot}`,
    ...artifactLines,
    'Agent Integration:',
    ...AGENT_FILES.map((filename) => `  ${filename}: ${fs.existsSync(path.join(directory, filename)) && MANAGED_BLOCK.test(fs.readFileSync(path.join(directory, filename), 'utf8')) ? 'configured' : 'integration required'}`),
    `Active Harness Artifacts: ${artifacts.length ? artifacts.map((artifact) => path.relative(scaffoldDirectory(directory), artifact.path)).join(', ') : 'none'}`,
    `Project-local Rules: ${ruleSet.rules.length ? ruleSet.rules.map((rule) => path.relative(scaffoldDirectory(directory), rule.path)).join(', ') : 'none'}`,
    ...(fs.existsSync(ruleSet.legacy) ? [`Legacy monolithic Project Rules require deliberate migration and are ignored: ${ruleSet.legacy}`] : []),
    ...ruleSet.invalid.map((rule) => `Invalid Project Rule identity (expected a dotted identity in the H1 heading): ${rule.path}`),
    ...ruleSet.duplicates.map((duplicate) => `Duplicate project Project Rule identity ${duplicate.identity}: ${duplicate.paths.join(', ')}`),
    ...(reviewRequired ? ['Run "scaffold update --diff", review the candidate changes with adopt-harness-update, then use "scaffold update" to record completion.'] : []),
  ] };
}

function updateProject({ directory, version }) {
  const details = readMetadata(directory);
  if (!details) return { ok: false, lines: [`Scaffold is not initialized in ${directory}.`, 'Run "scaffold init" first.'] };
  const now = timestamp();
  fs.writeFileSync(metadataPath(directory), metadata({ lastReviewedVersion: version, installedAt: details.installedAt || now, updatedAt: now }), 'utf8');
  return { ok: true, lines: [
    `Recorded your attestation that Scaffold version ${version} has been reviewed.`,
    'This command records review completion only; it does not copy, merge, delete, or otherwise change Harness artifacts.',
  ] };
}

module.exports = { checkDocumentId, initProject, inspectProject, nextDocumentId, updateDiff, updateProject };
