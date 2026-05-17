#!/usr/bin/env node

'use strict';

const prompts = require('prompts');
const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

const AGENTS = [
  {
    title: 'Claude Code',
    value: 'claude',
    installPath: path.join(os.homedir(), '.claude', 'skills'),
  },
  {
    title: 'Pi-mono',
    value: 'pi',
    installPath: path.join(os.homedir(), '.agents', 'skills'),
  },
  {
    title: 'GitHub Copilot',
    value: 'copilot',
    installPath: path.join(os.homedir(), '.agents', 'skills'),
  },
];

async function main() {
  const { agents } = await prompts({
    type: 'multiselect',
    name: 'agents',
    message: 'Which AI coding agents do you use?',
    choices: AGENTS.map((a) => ({
      title: `${a.title}  →  ${a.installPath}`,
      value: a.value,
    })),
    min: 1,
    hint: '- Space to select, Enter to confirm',
  });

  if (!agents || agents.length === 0) {
    console.log('\nNo agents selected. Exiting.');
    process.exit(0);
  }

  // Deduplicate install paths (Pi-mono and Copilot share ~/.agents/skills/)
  const seen = new Set();
  const targets = agents
    .map((v) => AGENTS.find((a) => a.value === v))
    .filter((a) => {
      if (seen.has(a.installPath)) return false;
      seen.add(a.installPath);
      return true;
    });

  console.log('');
  for (const target of targets) {
    fs.mkdirSync(target.installPath, { recursive: true });
    copyDir(SKILLS_DIR, target.installPath);
    console.log(`✓  ${target.installPath}`);
  }

  console.log('\nDone. Run /init in any project to set it up.');
}

function copyDir(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
