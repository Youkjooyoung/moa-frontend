const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = fs.realpathSync(process.cwd());
const vitestCommand = process.platform === "win32" ? "vitest.cmd" : "vitest";
const result = spawnSync(
  vitestCommand,
  ["run", "--config", "vitest.unit.config.mjs", "--configLoader", "runner", ...process.argv.slice(2)],
  {
    cwd: root,
    env: {
      ...process.env,
      MOA_FRONTEND_ROOT: root,
    },
    stdio: "inherit",
    shell: process.platform === "win32",
  }
);

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
