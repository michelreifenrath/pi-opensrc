import { existsSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function prependPath(dir) {
  if (!existsSync(dir)) return;

  const pathKey = Object.keys(process.env).find((key) => key.toLowerCase() === "path") ?? "PATH";
  const entries = (process.env[pathKey] ?? "").split(delimiter).filter(Boolean);

  if (!entries.includes(dir)) {
    process.env[pathKey] = [dir, ...entries].join(delimiter);
  }
}

export default function () {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

  prependPath(join(packageRoot, "node_modules", ".bin"));
  prependPath(join(dirname(packageRoot), ".bin"));
}
