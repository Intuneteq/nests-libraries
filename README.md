# nestjs-libraries

Shared packages for NestJS and TypeScript projects in the `@intune` workspace.

## Packages

- `@intune/nestjs-mail`: NestJS mail module with SMTP, AWS SES, and Mailgun strategies
- `@intune/eslint-config`: Reusable flat ESLint configs for Node, NestJS, React, and Next.js projects
- `@intune/prettier-config`: Shared Prettier defaults
- `@intune/typescript-config`: Shared `tsconfig` presets for base TypeScript, NestJS, React libraries, and Next.js
- `@intune/vscode-config`: VS Code settings and extension recommendations, plus a CLI to copy them into a project

## Tech Stack

- `pnpm` workspaces
- Turborepo
- Changesets
- TypeScript

## Getting Started

```bash
pnpm install
```

## Workspace Commands

Run these from the repository root:

```bash
pnpm build
pnpm dev
pnpm lint
pnpm check-types
pnpm format
```

Target a single package with a filter:

```bash
pnpm --filter @intune/nestjs-mail build
pnpm --filter @intune/eslint-config lint
```

## Releases

Package publishing is managed with Changesets.

```bash
pnpm publish-packages
```

That command builds packages in `packages/*` and then runs `changeset publish`.

## Repository Structure

```text
apps/
packages/
  eslint-config/
  mail/
  prettier-config/
  typescript-config/
  vscode-config/
.changeset/
```

## Notes

- Node `>=18` is required.
- Packages are configured for public release via Changesets.
- Package-specific usage lives in each package README under `packages/*`.
