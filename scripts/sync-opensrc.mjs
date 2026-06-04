import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(packageRoot, "package.json");
const skillPath = join(packageRoot, "skills", "opensrc", "SKILL.md");
const licensePath = join(packageRoot, "LICENSE");
const upstreamRawBase = "https://raw.githubusercontent.com/vercel-labs/opensrc";

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], ...options }).trim();
}

async function downloadText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

const version = JSON.parse(run("npm", ["view", "opensrc", "version", "--json"]));
const tag = `v${version}`;

const [skill, license] = await Promise.all([
  downloadText(`${upstreamRawBase}/${tag}/skills/opensrc/SKILL.md`),
  downloadText(`${upstreamRawBase}/${tag}/LICENSE`),
]);

writeFileSync(skillPath, skill);
writeFileSync(licensePath, license);

const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
pkg.dependencies = { ...pkg.dependencies, opensrc: version };
pkg.metadata = { ...pkg.metadata, opensrcVersion: version };
writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
run("npm", ["install", "--package-lock-only", "--ignore-scripts"]);

console.log(`Synced opensrc@${version}`);
