The purpose of this repos is to add whole chapters of a RoyalRoad story into a second brain applicaiton, such as Logseq, Roam Research, or Obsidian, for the express purpose of making connections between characters / places / events / ideas. This is done via [[backlinks]].

It is currently mainly setup for Outliners, but with very little work can accomodate any format desired.

## Setup

```bash
nvm use 20      # May be unnecessary 🤷‍♂
pnpm install
```

## Run

One must pass the fictionId (found in the url) as well as the name (for the download folder).

There are 3 download methods: `all`, `latest [num]`, or `chapters 1 2 6 20`

```bash
# Download all chapters
npx ts-node src/index.ts --id 63759 --name "Super Supportive" --all

# Download the latest 5 chapters
npx ts-node src/index.ts --id 63759 --name "Super Supportive" --latest 5

# Download only chapters 3, 18, and 27
npx ts-node src/index.ts --id 63759 --name "Super Supportive" --chapters 3 18 27
```

It will not overwrite the file if it already exists. Add `--overwrite` to change that.

## Todos

- Fix release date
  - Seems to be broken in the scraperpackage
- Add option to remove bullet points
- Add option to set the download folder
- Latest number is optional?
