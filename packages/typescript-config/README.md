# @intune/typescript-config

Shared `tsconfig` presets used across `@intune` projects.

## Install

```bash
pnpm add -D @intune/typescript-config typescript
```

## Available Presets

- `@intune/typescript-config/base.json`
- `@intune/typescript-config/nestjs.json`
- `@intune/typescript-config/react-library.json`
- `@intune/typescript-config/nextjs.json`

## Usage

### Base TypeScript project

```json
{
    "extends": "@intune/typescript-config/base.json"
}
```

### NestJS project

```json
{
    "extends": "@intune/typescript-config/nestjs.json"
}
```

### React library

```json
{
    "extends": "@intune/typescript-config/react-library.json"
}
```

### Next.js app

```json
{
    "extends": "@intune/typescript-config/nextjs.json"
}
```

## License
   MIT © Tobi Olanitori
