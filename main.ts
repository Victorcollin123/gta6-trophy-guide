// main.ts — hands this entry in.
//
// Copies the guide (app/) and its screenshots (screenshots/) from this
// repository into the output directory, then writes the dossier that the
// sealed scorer checks, using the kit's library byte for byte.
//
// The output directory is MAKEFUN_OUTPUT_DIR when set, otherwise /output.
// Node standard library only; run it with `node main.ts`.
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
} as const;

function copyTreeInto(sourceDir: string, targetDir: string): void {
  mkdirSync(targetDir, { recursive: true });
  for (const entry of readdirSync(sourceDir)) {
    const from = join(sourceDir, entry);
    const to = join(targetDir, entry);
    if (statSync(from).isDirectory()) {
      copyTreeInto(from, to);
    } else {
      copyFileSync(from, to);
    }
  }
}

function handInEntry(): void {
  const appDir = join(repoRoot, "app");
  const shotsDir = join(repoRoot, "screenshots");
  if (!existsSync(appDir)) throw new Error("app/ is missing from the repository");
  if (!existsSync(shotsDir)) throw new Error("screenshots/ is missing from the repository");
  copyTreeInto(appDir, join(outDir, "app"));
  copyTreeInto(shotsDir, join(outDir, "screenshots"));
  const dossier = buildDossier(outDir, dossierCaps);
  writeFileSync(join(outDir, "dossier.json"), dossier);
  console.log(`wrote ${join(outDir, "dossier.json")} (${dossier.length} bytes)`);
}

handInEntry();
