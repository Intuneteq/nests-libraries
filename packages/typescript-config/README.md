# intune/typescript-config

Shared `tsconfig` presets used across Intune repositories.

## Install

```bash
npm install -D intune/typescript-config typescript
```

## Available configs

- `intune/typescript-config/base.json`
- `intune/typescript-config/nextjs.json`
- `intune/typescript-config/react-library.json`

## Usage

### Next.js app (`tsconfig.json`)

```json
{
  "extends": "intune/typescript-config/nextjs.json"
}
```

### React library (`tsconfig.json`)

```json
{
  "extends": "intune/typescript-config/react-library.json"
}
```

### Generic TypeScript project (`tsconfig.json`)

```json
{
  "extends": "intune/typescript-config/base.json"
}
```
