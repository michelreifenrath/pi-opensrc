import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(packageRoot, "package.json");
const skillPath = join(packageRoot, "skills", "opensrc", "SKILL.md");
const extensionPath = join(packageRoot, "extensions", "path.js");

function fail(message) {
  throw new Error(message);
}

const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
if (pkg.name !== "pi-opensrc") fail("package name must be pi-opensrc");
if (!pkg.keywords?.includes("pi-package")) fail("package must include pi-package keyword");
if (pkg.pi?.skills?.[0] !== "./skills") fail("package must expose ./skills via pi manifest");
if (pkg.pi?.extensions?.[0] !== "./extensions/path.js") fail("package must expose the PATH extension");
if (!pkg.dependencies?.opensrc) fail("package must depend on opensrc");

const skill = readFileSync(skillPath, "utf8");
if (!skill.startsWith("---\n")) fail("skill is missing frontmatter");
const frontmatter = skill.split("---\n", 2)[1];
if (!/^name:\s*opensrc\s*$/m.test(frontmatter)) fail("skill frontmatter must declare name: opensrc");
if (!/^description:\s*.+/m.test(frontmatter)) fail("skill frontmatter needs a description");
if (!skill.includes("opensrc path")) fail("skill should document opensrc path usage");

const extension = await import(pathToFileURL(extensionPath));
if (typeof extension.default !== "function") fail("extension must export a default function");

extension.default();
const pathEntries = (process.env.PATH ?? "").split(delimiter).filter(Boolean);
const candidateBins = [join(packageRoot, "node_modules", ".bin"), join(dirname(packageRoot), ".bin")].filter(existsSync);
if (candidateBins.length > 0 && !candidateBins.some((bin) => pathEntries.includes(bin))) {
  fail("extension did not add an opensrc .bin directory to PATH");
}

const opensrcBin = [
  join(packageRoot, "node_modules", ".bin", process.platform === "win32" ? "opensrc.cmd" : "opensrc"),
  join(dirname(packageRoot), ".bin", process.platform === "win32" ? "opensrc.cmd" : "opensrc"),
].find(existsSync);

if (opensrcBin) {
  const version = execFileSync(opensrcBin, ["--version"], { encoding: "utf8" }).trim();
  if (!version.startsWith("opensrc ")) fail(`unexpected opensrc --version output: ${version}`);
  console.log(version);
}

console.log("pi-opensrc package checks passed");
