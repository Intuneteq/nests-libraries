# @intune/eslint-config

ESLint flat-config presets for NodeJS projects.

## Install

```bash
pnpm add -D eslint @intune/eslint-config typescript
```

## Available presets

- `@intune/eslint-config/node`
- `@intune/eslint-config/nest`
- `@intune/eslint-config/react`
- `@intune/eslint-config/next`

## Usage

Create an `eslint.config.js` file and export the preset that matches your project.

### Node Project

```js
import config from "@intune/eslint-config/node"

export default config
```

### NestJS Project

```js
import config from "@intune/eslint-config/nest"

export default config
```

### React Project

```js
import config from "@intune/eslint-config/react"

export default config
```

### Next.js Project

```js
import config from "@intune/eslint-config/next"

export default config
```

## What These Configs Include

- Type-aware TypeScript linting
- Prettier integration through `eslint-plugin-prettier`
- Framework-specific defaults for React and Next.js
- Common ignores for build output directories

## License
   MIT © Tobi Olanitori
