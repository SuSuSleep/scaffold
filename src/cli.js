'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { checkDocumentId, initProject, inspectProject, nextDocumentId, updateProject } = require('./project');
const packageInfo = require('../package.json');

const HELP = `Scaffold ${packageInfo.version}

Usage:
  scaffold init [directory]     Initialize Scaffold in a repository
  scaffold status [directory]   Inspect effective artifacts and update-review state
  scaffold update [directory]   Record your attestation that update review is complete
  scaffold id next PREFIX [directory]  Return the next unused document ID
  scaffold id check ID [directory]     Check document ID availability

Scaffold keeps shared defaults in the installed package. Project-specific
replacements live in .scaffold/ and are never overwritten by update.`;

function decideHostIntegration(filename, proposed) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return 'leave';
  const readAnswer = () => {
    const buffer = Buffer.alloc(1024);
    const bytes = fs.readSync(0, buffer, 0, buffer.length, null);
    return buffer.subarray(0, bytes).toString('utf8').trim().toLowerCase();
  };
  process.stdout.write(`\n${filename} is host-owned and has no Scaffold block.\n[a]dd Scaffold instruction, [l]eave unchanged, or [s]how proposed change: `);
  let answer = readAnswer();
  if (answer === 's' || answer === 'show') {
    process.stdout.write(`\n${proposed}\nChoose [a]dd or [l]eave unchanged: `);
    answer = readAnswer();
  }
  return answer === 'a' || answer === 'add' ? 'add' : 'leave';
}

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
  if (command === 'id') {
    const [operation, value, directoryArgument, ...extra] = rest;
    if (extra.length || !operation || !value || !['next', 'check'].includes(operation) || directoryArgument?.startsWith('-')) {
      output.error('Usage: scaffold id next PREFIX [directory] | scaffold id check ID [directory]');
      return 1;
    }
    const directory = path.resolve(cwd, directoryArgument || '.');
    const valid = operation === 'next' ? /^[A-Z][A-Z0-9]*$/.test(value) : /^[A-Z][A-Z0-9]*-\d+$/.test(value);
    if (!valid) {
      output.error(operation === 'next' ? 'PREFIX must use uppercase letters and digits.' : 'ID must use the form PREFIX-NUMBER.');
      return 1;
    }
    const result = operation === 'next'
      ? nextDocumentId({ directory, prefix: value })
      : checkDocumentId({ directory, id: value });
    for (const line of result.lines) output.log(line);
    return result.ok ? 0 : 1;
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
  const options = { directory, version: packageInfo.version, packageRoot: path.resolve(__dirname, '..'), decideHostIntegration };
  const result = command === 'init' ? initProject(options)
    : command === 'status' ? inspectProject(options)
      : updateProject(options);

  for (const line of result.lines) output.log(line);
  return result.ok ? 0 : 1;
}

module.exports = { HELP, run };
