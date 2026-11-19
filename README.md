# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Victorcollin123/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Victorcollin123/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline, open-source trophy guide and tracker for Grand Theft Auto VI on PlayStation 5: all 55 official trophies with their names, descriptions and grades, a saved checklist with export and import, search and filters, a spoiler setting, a roadmap to the platinum, and a guide to every trophy in our own words with its sources named.

## Trophy data

The trophy list lives in `app/data/trophies.json`: one entry per trophy with its official name, description and grade, plus the kind it belongs to (story, missable, collectibles or activities), whether it is a hidden trophy, and the guide text with its named sources. The front end reads that file at load time, so the data and the presentation stay separate — updating a guide never means touching the layout.

Progress is stored only in the browser's local storage under the key `leonida-trophy-guide-v1` (the earned trophy names and the spoiler setting). Export writes the same shape to a JSON file; import reads a file back and keeps only names this guide knows, so an export from an older or edited list cannot corrupt the tracker.

## Development

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

The hand-in is built with `node main.ts`, which copies `app/` and `screenshots/` into the output directory (`MAKEFUN_OUTPUT_DIR`, default `/output`) and writes `dossier.json` there. The dossier is built by the kit library in `vendor/makefun-frontend.ts` — do not edit it.

## Run it

```sh
node serve.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=qp17c3xn&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
