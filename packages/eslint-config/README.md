# @intune/eslint-config

Shared flat ESLint configs for `@intune` projects.

## Available Exports

- `@intune/eslint-config/node`
- `@intune/eslint-config/nest`
- `@intune/eslint-config/react`
- `@intune/eslint-config/next`

## Install

```bash
pnpm add -D eslint @intune/eslint-config typescript
```

Add any framework-specific peer packages your app already needs, such as `eslint-config-next` for Next.js projects.

## Usage

Create an `eslint.config.mjs` file and import the preset that matches your project.

### Node

```js
import config from "@intune/eslint-config/node"

export default config
```

### NestJS

```js
import config from "@intune/eslint-config/nest"

export default config
```

### React

```js
import config from "@intune/eslint-config/react"

export default config
```

### Next.js

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