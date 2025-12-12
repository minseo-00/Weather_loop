#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function read(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}

function setEnvVar(filePath, key, value) {
  let content = read(filePath);
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (content.match(re)) {
    content = content.replace(re, line);
  } else {
    if (content && !content.endsWith('\n')) content += '\n';
    content += line + '\n';
  }
  write(filePath, content);
}

function replaceNgrokInFile(filePath, newBase) {
  if (!fs.existsSync(filePath)) return;
  const src = fs.readFileSync(filePath, 'utf8');
  // Replace any ngrok domain while preserving the path that follows the domain
  // e.g., https://abc.ngrok-free.dev/auth/login -> https://NEW/auth/login
  const pattern = new RegExp('https://[a-z0-9.-]*ngrok[^/]*(?=/)', 'gi');
  const replaced = src.replace(pattern, newBase);
  if (replaced !== src) {
    fs.writeFileSync(filePath, replaced, 'utf8');
    console.log(`updated: ${path.relative(repoRoot, filePath)}`);
  }
}

function main() {
  const arg = process.argv[2] || '';
  const trimmed = arg.trim();
  if (!trimmed) {
    console.error('Usage: node scripts/update-ngrok.mjs https://<host>.ngrok-free.dev');
    process.exit(1);
  }
  const newBase = trimmed.replace(/\/$/, '');
  if (!/^https:\/\/.+\.ngrok/.test(newBase)) {
    console.error('Please pass a full https ngrok URL, e.g. https://xxxx.ngrok-free.dev');
    process.exit(1);
  }

  // Frontend env
  const feEnv = path.join(repoRoot, 'frontend', '.env.local');
  setEnvVar(feEnv, 'NEXT_PUBLIC_BASE_URL', newBase);
  setEnvVar(feEnv, 'NEXT_PUBLIC_SPOTIFY_REDIRECT_URI', `${newBase}/api/auth/callback`);
  // Backstage compatibility
  setEnvVar(feEnv, 'SPOTIFY_REDIRECT_URI', `${newBase}/api/auth/callback`);

  // Backend env
  const beEnv = path.join(repoRoot, 'backend', '.env');
  setEnvVar(beEnv, 'FRONTEND_URL', newBase);
  setEnvVar(beEnv, 'SPOTIFY_REDIRECT_URI', `${newBase}/api/auth/callback`);

  // Replace hardcoded URLs in source files
  const files = [
    path.join(repoRoot, 'frontend', 'app', 'login', 'page.tsx'),
    path.join(repoRoot, 'frontend', 'app', 'signup', 'page.tsx'),
    path.join(repoRoot, 'frontend', 'app', 'auth', 'register.jsx'),
    path.join(repoRoot, 'frontend', 'widgets', 'weather-header', 'ui', 'WeatherHeader.tsx'),
    path.join(repoRoot, 'frontend', 'widgets', 'playlist-grid', 'ui', 'PlaylistGrid.tsx'),
    path.join(repoRoot, 'backend', 'src', 'auth.js'),
    path.join(repoRoot, 'backend', 'server.js'),
  ];
  files.forEach((f) => replaceNgrokInFile(f, newBase));

  console.log('\nDone. Remember to restart both frontend and backend dev servers.');
}

main();
