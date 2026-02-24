#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const maxMbArg = args.find(arg => arg.startsWith('--max-mb='));
const maxMb = maxMbArg ? Number(maxMbArg.split('=')[1]) : 20;
const maxBytes = maxMb * 1024 * 1024;

const root = process.cwd();
const includeRoots = ['public', 'src', 'scripts'];
const ignoreDirs = new Set([
  'node_modules',
  '.next',
  '.git',
  '.turbo',
  'dist',
  'build',
  '.vercel',
]);

const oversizeFiles = [];

function walk(currentPath) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) {
        continue;
      }
      walk(fullPath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const stats = fs.statSync(fullPath);
    if (stats.size > maxBytes) {
      oversizeFiles.push({
        path: path.relative(root, fullPath).replace(/\\/g, '/'),
        size: stats.size,
      });
    }
  }
}

for (const dir of includeRoots) {
  const fullDir = path.join(root, dir);
  if (fs.existsSync(fullDir) && fs.statSync(fullDir).isDirectory()) {
    walk(fullDir);
  }
}

if (oversizeFiles.length > 0) {
  console.error(`❌ Found file(s) larger than ${maxMb}MB:`);
  for (const file of oversizeFiles.sort((a, b) => b.size - a.size)) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    console.error(` - ${file.path} (${sizeMb}MB)`);
  }
  process.exit(1);
}

console.log(`✅ File size check passed. No files over ${maxMb}MB in public/src/scripts.`);
