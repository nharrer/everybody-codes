# Everybody Codes 2026

Solutions to the [Everybody Codes 2026 quests](https://everybody.codes/event/2026/quests) in TypeScript. Node runs the `.ts` files directly, so there is no build step.

## Setup

Requires Node 26 or newer. With [fnm](https://github.com/Schniz/fnm), the version in `.node-version` is picked up automatically.

```sh
npm install
```

Puzzle inputs are not checked in. Save yours from the site as `input-part1.txt`, `input-part2.txt` and `input-part3.txt` in the folder of the day.

## Running

```sh
npm start            # run every day
npm start -- 3       # run day 3 only
npm run typecheck    # check types
```
