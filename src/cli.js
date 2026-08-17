'use strict';

const path = require('node:path');
const { initProject, inspectProject, updateProject } = require('./project');
const packageInfo = require('../package.json');

const HELP = `Scaffold ${packageInfo.version}

Usage:
  scaffold init [directory]     Initialize Scaffold in a repository
  scaffold status [directory]   Inspect Scaffold metadata and overrides
  scaffold update [directory]   Record the currently running Scaffold version

Scaffold keeps shared defaults in the installed package. Project-specific
replacements live in .scaffold/ and are never overwritten by update.`;

async function run(args, { cwd = process.cwd(), output = console } = {}) {
  const [command, ...rest] = args;
  if (!command || command === '--help' || command === '-h') {
    output.log(HELP);
    return 0;
  }
  if (command === '--version' || command === '-v') {
    output.log(packageInfo.version);
    return 0;
  }
  if (!['init', 'status', 'update'].includes(command)) {
    output.error(`Unknown command: ${command}`);
    output.error('Run "scaffold --help" for usage.');
    return 1;
  }
  if (rest.length > 1 || rest[0]?.startsWith('-')) {
    output.error(`${command} accepts at most one directory path.`);
    return 1;
  }

  const directory = path.resolve(cwd, rest[0] || '.');
  const options = { directory, version: packageInfo.version, packageRoot: path.resolve(__dirname, '..') };
  const result = command === 'init' ? initProject(options)
    : command === 'status' ? inspectProject(options)
      : updateProject(options);

  for (const line of result.lines) output.log(line);
  return result.ok ? 0 : 1;
}

module.exports = { HELP, run };
