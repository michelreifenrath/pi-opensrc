# Releasing

`pi-opensrc` publishes from GitHub Actions with npm trusted publishing and provenance. Do not publish with long-lived local npm tokens.

## One-time npm setup

In the npm package settings for `pi-opensrc`, add a trusted publisher:

- Owner/repository: `michelreifenrath/pi-opensrc`
- Workflow: `.github/workflows/release.yml`
- Environment: `npm-publish`

Equivalent npm CLI command:

```bash
npm trust github pi-opensrc \
  --repo michelreifenrath/pi-opensrc \
  --file release.yml \
  --env npm-publish
```

## Automatic upstream sync and publish

1. `.github/workflows/sync-opensrc.yml` runs weekly and can also be started manually.
2. If upstream `opensrc` changed, it updates:
   - `package.json`
   - `package-lock.json`
   - `skills/opensrc/SKILL.md`
   - `LICENSE`
3. The sync workflow bumps the wrapper patch version and opens a PR.
4. After the PR is reviewed and merged into `main`, `.github/workflows/release.yml`:
   - skips if `pi-opensrc@<version>` is already on npm
   - verifies the package
   - publishes to npm with provenance
   - creates the matching GitHub release tag `v<version>`

## Manual release fallback

If needed, bump the wrapper version and merge the change into `main`:

```bash
npm version patch --no-git-tag-version
```

The `Release` workflow handles npm publishing and GitHub release creation after the merge.
