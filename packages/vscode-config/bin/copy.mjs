#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, "..", ".vscode");
const targetDir = path.resolve(process.cwd(), ".vscode");

console.log("🔄 Copying VS Code settings from package...");
console.log(`   Source: ${sourceDir}`);
console.log(`   Target: ${targetDir}`);

if (!existsSync(sourceDir)) {
  console.error("❌ Error: .vscode folder not found in the package");
  console.error(`   Expected at: ${sourceDir}`);
  process.exit(1);
}

if (path.resolve(sourceDir) === path.resolve(targetDir)) {
  console.error("❌ Error: Cannot copy to itself.");
  console.error("   Please run this command from your project root, not inside the package.");
  process.exit(1);
}

try {
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true, force: true });

  console.log("✅ Successfully copied VS Code settings!");
  console.log(`   → ${path.join(targetDir, "settings.json")}`);
  console.log(`   → ${path.join(targetDir, "extensions.json")}`);
  console.log("\nPlease restart VS Code (or run 'Developer: Reload Window') for changes to take effect.");
} catch (err) {
  console.error("❌ Failed to copy files:", err.message);
  process.exit(1);
}