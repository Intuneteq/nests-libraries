# @intune/vscode-config

Shared VS Code settings and extension recommendations for `@intune` projects.

## Install

```bash
pnpm add -D @intune/vscode-config
```

## Included Files

- `.vscode/settings.json`
- `.vscode/extensions.json`

The bundled settings enable Prettier as the default formatter, keep format-on-save on, and run ESLint fixes on save when triggered explicitly.

## Copy the Workspace Settings

Run the CLI from the root of the project that should receive the `.vscode` files:

```bash
pnpm exec intune-vscode-config
```

This copies the packaged `.vscode/settings.json` and `.vscode/extensions.json` into the current working directory.

After copying the files, reload VS Code so the settings are picked up.

## License
   MIT © Tobi Olanitori