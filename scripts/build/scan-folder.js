#!/usr/bin/env node
/*
 * Scan a folder and produce a json file describing the folder structure
 *
 */
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .requiredOption('--folder <path>', 'Folder to scan')
  .requiredOption('--name <name>', 'Name prefix for label')
  .requiredOption('--repository <url>', 'Registry URL')
  .requiredOption('--outfile <path>', 'Output file path')
  // Add optional option --absolutePath
  .option('--absolutePath', 'Include absolute path in the output')
  .parse(process.argv);

const options = program.opts();

const { folder, name, repository, outfile, absolutePath } = options;
const result = [];

function scanDirectory(dir, prefix) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(entryPath, prefix + entry.name + '/');
    } else {
      const ext = path.extname(entry.name).substring(1);
      const output = {
        label: `${name}/${prefix}${path.basename(entry.name, path.extname(entry.name))}`,
        type: ext,
        url: `${repository}/${prefix}${entryPath}`
      }
      if (absolutePath) {
        output.absolutePath = path.resolve(entryPath);
      }
      result.push(output);
    }
  });
}

try {
  scanDirectory(folder, '');
  fs.writeFileSync(outfile, JSON.stringify(result, null, 2));
  console.log('Directory scan complete. Output saved to ' + outfile)
} catch (error) {
  console.error('Error scanning directory:', error);
}
