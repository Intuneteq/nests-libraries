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

### 1. Add a changeset

When a pull request changes a published package, create a changeset before
merging it:

```bash
pnpm changeset
```

Select every affected package, choose the appropriate version bump, and enter a
short summary for the changelog. Commit the generated `.changeset/*.md` file
with the rest of the pull request.

Do not manually update package versions or changelogs. The Changesets release
pull request handles those updates.

### 2. Update the lockfile

Run the install whenever a `package.json` changes, including dependency or
package-version changes:

```bash
pnpm install
```

Commit `pnpm-lock.yaml` if it changes. CI runs
`pnpm install --frozen-lockfile`, which treats the lockfile as read-only and
fails when it is out of sync with a `package.json`.

Before pushing, run the same checks used by CI:

```bash
pnpm install --frozen-lockfile
pnpm turbo run lint build
```

### 3. Merge the feature pull request

After the feature pull request is merged into `main`, the publish workflow
creates or updates a release pull request named:

```text
chore(release): version packages
```

That pull request consumes the changeset files, updates package versions and
changelogs, and updates the lockfile.

### 4. Merge the release pull request

Review the generated versions and changelog entries. When the release pull
request is merged into `main`, the publish workflow runs:

```bash
pnpm publish-packages
```

That command builds packages in `packages/*` and then runs `changeset publish`.
The packages are published using the repository's `NPM_TOKEN` secret.

The complete release flow is:

```text
Create changes -> pnpm changeset -> pnpm install -> feature pull request
-> release pull request -> publish to npm
```

### Troubleshooting

If CI fails during `pnpm install --frozen-lockfile`, update and commit the
lockfile:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update pnpm lockfile"
```

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
