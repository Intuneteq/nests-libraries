# @intune/vscode-config

Shared VS Code settings and extension recommendations for `@intune` projects.

## Install

```bash
pnpm add -D @intune/vscode-config
```

## Sync the recommended files

Run the packaged CLI from the root of the consumer project:

```bash
pnpm exec intune-vscode-config
```

Or use the package script while working inside this workspace:

```bash
pnpm --filter @intune/vscode-config run copy:vscode
```

This copies the package's `.vscode/settings.json` and `.vscode/extensions.json` into the current project's `.vscode/` directory.

You can also pass an explicit target path:

```bash
pnpm exec intune-vscode-config ./apps/server
```
