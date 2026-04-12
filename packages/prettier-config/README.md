# @intune/prettier-config

Shared Prettier configuration for `@intune` projects.

## Install

```bash
pnpm add -D prettier @intune/prettier-config
```

## Usage

Create a `prettier.config.mjs` file:

```js
import config from "@intune/prettier-config"

export default config
```

## Defaults

- `tabWidth: 4`
- `singleQuote: false`
- `semi: false`
- `trailingComma: "none"`
