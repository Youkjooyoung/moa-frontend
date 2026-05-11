const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const portableRoot = path.join(os.homedir(), 'moa-front-vitest');

function removePortableRoot() {
  if (!fs.existsSync(portableRoot)) return;
  fs.rmSync(portableRoot, { recursive: true, force: true });
}

function copyProject() {
  removePortableRoot();
  fs.mkdirSync(portableRoot, { recursive: true });

  fs.cpSync(root, portableRoot, {
    recursive: true,
    filter(source) {
      const relative = path.relative(root, source);
      if (!relative) return true;
      const firstSegment = relative.split(path.sep)[0];
      return !['dist', 'coverage', '.git'].includes(firstSegment);
    },
  });
}

copyProject();

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npmCommand, ['exec', 'vitest', 'run', '--', '--config', 'vitest.config.mjs', ...process.argv.slice(2)], {
  cwd: portableRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
