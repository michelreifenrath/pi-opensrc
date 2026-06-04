# Releasing

`pi-opensrc` should be published with npm trusted publishing and provenance from GitHub Actions, not with a long-lived local npm token.

## One-time npm setup

In the npm package settings for `pi-opensrc`, add a trusted publisher:

- Owner/repository: `michelreifenrath/pi-opensrc`
- Workflow: `.github/workflows/release.yml`
- Environment: `npm-publish`

## Release steps

1. Sync upstream if needed:

   ```bash
   npm run sync:opensrc
   ```

2. Bump the wrapper version:

   ```bash
   npm version patch
   ```

3. Push the commit and tag:

   ```bash
   git push origin main --follow-tags
   ```

4. Create a GitHub release for the tag.

The `Release` workflow verifies that the tag matches `package.json` and runs:

```bash
npm publish --provenance --access public
```
