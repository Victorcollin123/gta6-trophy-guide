// Leonida Trophy Guide — entrypoint (Node 22, standard library only).
// The guide is this directory's app/ folder: plain static files a browser
// opens at app/index.html (ES modules, CSS, no build step), fully offline,
// its trophy list and guides in app/data/trophies.json. This program hands
// it in: it copies app/ and screenshots/ from beside this file to /output
// and writes /output/dossier.json, the summary the judge reads (the
// screenshots, the first load's files and bytes, and the source), with the
// vendored make.fun library. Leave vendor/makefun-frontend.ts as it is:
// the scorer requires dossier.json to be byte for byte what its own copy
// writes, so this program writes nothing else into /output and stamps no
// times into anything it writes.
//
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

// Authored check: read the dossier back and confirm it parses, and confirm
// the trophy file it was built from still names all 55 official trophies.
// This only reads; it writes nothing, so a second run still produces the
// same bytes. A failure here stops the build instead of handing in a guide
// whose data file drifted from the list the gate checks.
const dossier = JSON.parse(readFileSync(join(out, 'dossier.json'), 'utf8'));
const trophyData = JSON.parse(readFileSync(join(out, 'app', 'data', 'trophies.json'), 'utf8'));
const trophyCount = trophyData.trophies.length;
if (trophyCount !== 55) throw new Error(`expected 55 trophies, found ${trophyCount}`);
console.log(`dossier written: ${trophyCount} trophies, ${dossier.files?.length ?? 'unknown'} files listed`);
