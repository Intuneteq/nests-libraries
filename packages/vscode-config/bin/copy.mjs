#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const sourceDir = path.join(packageRoot, ".vscode");
const projectRoot = path.resolve(process.argv[2] ?? process.cwd());
const targetDir = path.join(projectRoot, ".vscode");

if (!existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  process.exitCode = 1;
} else {
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true, force: true });

  console.log(`Copied VS Code settings to ${targetDir}`);
  console.log("Synced files:");
  console.log(`- ${path.join(targetDir, "settings.json")}`);
  console.log(`- ${path.join(targetDir, "extensions.json")}`);
}
