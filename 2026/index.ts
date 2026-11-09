import { existsSync, readdirSync, readFile } from "node:fs";
import { bindNodeCallback, concatMap, defer, forkJoin, from, map, of, switchMap } from "rxjs";
import type { Observable } from "rxjs";

// use if day file: export const inputFile1 = "input-test.txt";
type DayModule = {
    solve: (input1: string, input2: string, input3: string) => void;
    inputFile1?: string;
    inputFile2?: string;
    inputFile3?: string;
};

class Day {
    private readonly dir: string;

    constructor(dir: string) {
        this.dir = dir;
    }

    public run(): Observable<void> {
        return this.load().pipe(
            switchMap(({
                solve,
                inputFile1 = "input-part1.txt",
                inputFile2 = "input-part2.txt",
                inputFile3 = "input-part3.txt",
            }) => forkJoin([
                this.readInput(inputFile1),
                this.readInput(inputFile2),
                this.readInput(inputFile3),
            ]).pipe(
                map(([input1, input2, input3]) => {
                    console.log(`Solutions for ${this.dir}:`);
                    const start = performance.now();
                    solve(input1, input2, input3);
                    console.log(`Time: ${(performance.now() - start).toFixed(3)} ms`);
                    console.log('================================================================');
                }),
            )),
        );
    }

    private load(): Observable<DayModule> {
        return defer(() => import(`./${this.dir}/${this.dir}.ts`) as Promise<DayModule>);
    }

    // A part's input may not be available yet, so a missing file is ignored.
    private readInput(file: string): Observable<string> {
        const url = new URL(`./${this.dir}/${file}`, import.meta.url);
        if (!existsSync(url)) {
            console.warn(`Missing input file: ${this.dir}/${file}`);
            return of("");
        }
        return bindNodeCallback(readFile)(url).pipe(
            map((data) => data.toString("utf8").trimEnd()),
        );
    }

    // All dayNN folders that contain a dayNN.ts, in day order.
    static findAll(): Day[] {
        return readdirSync(new URL("./", import.meta.url), { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && /^day\d+$/.test(entry.name))
            .map((entry) => entry.name)
            .filter((dir) => existsSync(new URL(`./${dir}/${dir}.ts`, import.meta.url)))
            .sort()
            .map((dir) => new Day(dir));
    }

    static fromArg(arg: string): Day {
        const day = Number(arg);
        if (!Number.isInteger(day) || day < 1) {
            throw new Error(`Invalid day: ${arg}`);
        }
        return new Day(`day${String(day).padStart(2, "0")}`);
    }
}

// Usage: node index.ts [day]
// Without a day, every day that can be found is run.
const arg = process.argv[2];
const days = arg === undefined ? Day.findAll() : [Day.fromArg(arg)];
from(days).pipe(concatMap((day) => day.run())).subscribe();
