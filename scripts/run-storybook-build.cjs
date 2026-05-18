const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const cacheRoot = path.join(root, ".cache");

fs.mkdirSync(cacheRoot, { recursive: true });

const storybookCommand = process.platform === "win32" ? "storybook.cmd" : "storybook";
const result = spawnSync(storybookCommand, ["build", ...process.argv.slice(2)], {
  cwd: root,
  env: {
    ...process.env,
    CACHE_DIR: cacheRoot,
  },
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
