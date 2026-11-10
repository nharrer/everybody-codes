import { colorCodes, colorize } from "../util/ansi.ts";

type Coord = [number, number];
const coordHash = (pos: Coord) => `${pos[0]},${pos[1]}`;

const neighbors: Coord[] = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1],
];

const stamp: Coord[] = [
    [-1, -2], [0, -2], [1, -2],
    [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
    [-2, 0], [-1, 0], [1, 0], [2, 0],
    [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
    [-1, 2], [0, 2], [1, 2],
];

class Grid {
    public map: number[][] = [];
    public w: number;
    public h: number;
    public land = new Map<string, Coord>();
    public sand = new Map<string, Coord>();
    public tree = new Map<string, Coord>();
    constructor(m: number[][]) {
        this.w = m[0]!.length;
        this.h = m.length;
        this.map = m;
        const center: Coord = [(this.w - 1) / 2, (this.h - 1) / 2];
        this.land.set(coordHash(center), center);
    }

    public neighbors([xpos, ypos]: Coord, clip: boolean = true): Map<string, Coord> {
        const n = new Map<string, Coord>();
        neighbors.forEach(([xd, yd]) => {
            const x = xpos + xd;
            const y = ypos + yd;
            if (!clip || (x >= 0 && x < this.w && y >= 0 && y < this.h)) {
                const c: Coord = [x, y];
                n.set(coordHash(c), c);
            }
        });
        return n;
    }

    public border(): Map<string, Coord> {
        const border = new Map<string, Coord>();
        this.land.values().forEach(pl => {
            this.neighbors(pl).forEach(nl => {
                if (!this.land.has(coordHash(nl))) {
                    border.set(coordHash(nl), nl);
                }
            });
        });
        return border;
    }

    public growland(): boolean {
        const newland = new Map<string, Coord>();
        this.border().forEach(pb => {
            const nn = this.neighbors(pb);
            let cnt = 0;
            nn.forEach(pn => {
                if (this.land.has(coordHash(pn)) || this.map[pn[1]]![pn[0]] === 1) {
                    cnt++;
                }
            });
            if (cnt >= 5) {
                newland.set(coordHash(pb), pb);
            }
        });
        newland.forEach((coord, key) => {
            this.land.set(key, coord);
        });
        return newland.size > 0;
    }

    public sandphase1(): void {
        const sand = new Map<string, Coord>();
        this.land.forEach(pl => {
            this.neighbors(pl, false).forEach(pn => {
                if (!this.land.has(coordHash(pn))) {
                    sand.set(coordHash(pl), pl);
                }
            });
        });
        sand.forEach((coord, key) => {
            this.land.delete(key);
        });
        this.sand = sand;
    }

    public sandphase2(): boolean {
        const sand = new Map<string, Coord>();
        this.land.forEach(pl => {
            let cnt = 0;
            this.neighbors(pl).forEach(pn => {
                if (this.sand.has(coordHash(pn))) {
                    cnt++;
                }
                if (cnt >= 5) {
                    sand.set(coordHash(pl), pl);
                }
            });
        });
        sand.forEach((coord, key) => {
            this.land.delete(key);
            this.sand.set(key, coord);
        });
        return sand.size > 0;
    }

    public treephase1(): void {
        const tree = new Map<string, Coord>();
        this.land.forEach(pl => {
            let ok = true;
            stamp.forEach(s => {
                const pn: Coord = [pl[0] + s[0], pl[1] + s[1]];
                if (!this.land.has(coordHash(pn))) {
                    ok = false;
                }
            });
            if (ok) {
                this.tree.set(coordHash(pl), pl);
            }
        });

        tree.forEach((coord, key) => {
            this.land.delete(key);
        });
    }

    public treephase2(): void {
        const tree = new Map<string, Coord>();
        this.land.forEach(pl => {
            let sand = false;
            let cnt = 0;
            this.neighbors(pl).forEach(pn => {
                if (this.tree.has(coordHash(pn))) {
                    cnt++;
                }
                if (this.sand.has(coordHash(pn))) {
                    sand = true;
                }
            });
            if (!sand && cnt >= 4) {
                tree.set(coordHash(pl), pl);
            }
        });

        tree.forEach((coord, key) => {
            this.land.delete(key);
            this.tree.set(key, coord);
        });
    }

    public dump(enabled = false): void {
        if (!enabled)  {
            return;
        }
        // const border = this.border();
        const border = new Map<string, Coord>();
        for (let y = 0; y < this.h; y++) {
            let line = "";
            for (let x = 0; x < this.w; x++) {
                const pos = coordHash([x, y]);
                let c = '' + this.map[y]![x]!;
                if (this.tree.has(pos)) {
                    c = colorize('@', colorCodes.green);
                } else if (this.sand.has(pos)) {
                    c = colorize('=', colorCodes.yellow);
                } else if (this.land.has(pos)) {
                    c = colorize('#', colorCodes.gray);
                } else if (border.has(pos)) {
                    c = colorize(c, colorCodes.white);
                } else {
                    c = colorize('.', colorCodes.blue);
                }
                line += c;
            }
            console.log(line);
        }
        console.log('');
    }
}

function build(map: Grid, dump = false): [number, number, number] {
    while (map.growland()) { }
    const land = map.land.size;

    map.sandphase1();
    while (map.sandphase2()) { }
    const sand = map.sand.size;

    map.treephase1();
    map.treephase2();
    map.treephase2();
    map.dump(dump);
    const tree = map.tree.size;

    return [land, sand, tree];
}

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): number[][] => input.split('\n').map(line => line.split('').map(Number));
    const [land, ,] = build(new Grid(parse(input1)));
    const [, sand,] = build(new Grid(parse(input2)));
    const [, , tree] = build(new Grid(parse(input3)), true);
    console.log("Part 1:", land);   // 1102
    console.log("Part 2:", sand);   // 959
    console.log("Part 3:", tree);   // 8754
}
