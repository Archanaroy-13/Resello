#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('[Resello Build] react-scripts build intercepted -> redirecting to Vite build...');
const result = spawnSync('npx', ['vite', 'build'], { stdio: 'inherit', shell: true });

const distPath = path.resolve(__dirname, '..', 'dist');
const buildPath = path.resolve(__dirname, '..', 'build');

if (fs.existsSync(distPath)) {
  fs.cpSync(distPath, buildPath, { recursive: true });
  console.log('[Resello Build] Successfully synced dist to build directory.');
}

process.exit(result.status !== null ? result.status : 0);
