const fs = require('fs');
const path = require('path');
const cliPath = path.join(__dirname, 'build/cli.js');
let cli = fs.readFileSync(cliPath, 'utf-8');
cli = `#! /usr/bin/env node\n${cli}`;
fs.writeFileSync(cliPath, cli);
