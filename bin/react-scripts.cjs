#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('[Resello Build] Root react-scripts build intercepted -> redirecting to frontend build...');
const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true });

const distPath = path.resolve(__dirname, 'frontend', 'dist');
const rootDist = path.resolve(__dirname, 'dist');
const rootBuild = path.resolve(__dirname, 'build');

if (fs.existsSync(distPath)) {
  fs.cpSync(distPath, rootDist, { recursive: true });
  fs.cpSync(distPath, rootBuild, { recursive: true });
  console.log('[Resello Build] Synced output to root dist and build directories.');
}

process.exit(result.status !== null ? result.status : 0);
