#!/usr/bin/env node

'use strict';

const { run } = require('../src/cli');

run(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch((error) => {
  console.error(`scaffold: ${error.message}`);
  process.exitCode = 1;
});
