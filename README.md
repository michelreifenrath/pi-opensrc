# pi-opensrc

Unofficial [Pi](https://pi.dev/) package for [vercel-labs/opensrc](https://github.com/vercel-labs/opensrc).

It makes the `opensrc` CLI and the `opensrc` agent skill available to Pi with one command:

```bash
pi install npm:pi-opensrc
```

After restarting Pi, ask for dependency source code, for example:

```text
fetch source for zod and inspect how parsing errors are built
```

or explicitly load the skill:

```text
/skill:opensrc path zod
```

## What this package does

- Installs the upstream `opensrc` npm package as a dependency.
- Exposes the upstream `opensrc` skill through Pi's package manifest.
- Adds the package-local npm `.bin` directory to Pi's `PATH`, so the skill can run `opensrc ...` from Pi's `bash` tool.

## Update

```bash
pi update npm:pi-opensrc
```

This package tracks the upstream `opensrc` npm package. Maintainers can sync to the latest upstream release with:

```bash
npm run sync:opensrc
npm version patch
npm publish
```

## Development

```bash
npm install
npm run check
npm pack --dry-run
```

## Attribution

This is not an official Vercel package. It redistributes the `opensrc` skill from [vercel-labs/opensrc](https://github.com/vercel-labs/opensrc), which is licensed under Apache-2.0.
