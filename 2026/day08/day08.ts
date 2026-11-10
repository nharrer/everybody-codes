export const OFF = 0;  // outside the hexagon

const DIRS = {
    'SE': [1, 1],
    'SW': [1, -1],
    'WW': [0, -2],
    'NW': [-1, -1],
    'NE': [-1, 1],
    'EE': [0, 2],
} as const;

function scan(map: number[][], [dr, dc]: readonly [number, number]): boolean[][] {
    const height = map.length;
    const width = Math.max(...map.map(row => row.length));
    const inside = (r: number, c: number) => r >= 0 && r < height && c >= 0 && c < width;
    const visible = map.map(row => row.map(() => false));

    for (let r0 = 0; r0 < height; r0++) {
        for (let c0 = 0; c0 < width; c0++) {
            if (inside(r0 - dr, c0 - dc)) {
                continue;  // not first cell of a line
            }
            let shadow = 1;
            for (let r = r0, c = c0; inside(r, c); r += dr, c += dc) {
                shadow--;
                const h = map[r]?.[c] ?? OFF;
                if (h > 0 && h > shadow) {
                    visible[r]![c] = true;
                    shadow = h;
                }
            }
        }
    }
    return visible;
}

function part1(map: number[][]): number {
    const lit = scan(map, DIRS['SE']);
    return lit.flat().filter(v => v).length;
}

function part2(map: number[][]): number {
    const all = Object.values(DIRS).flatMap(d => scan(map, d).flat());
    return all.filter(v => v).length;
}

function part3(map: number[][]): number {
    let sum = 0;
    let warriors = 0;
    const dirs = Object.values(DIRS);
    for (let round = 0; warriors < 100000; round++) {
        const lit = scan(map, dirs[round % 6]!);
        map.forEach((row, r) => row.forEach((h, c) => {
            if (lit[r]![c]) {
                sum++;
                h++;
            }
            if (h > 9) {
                warriors++;
                h = -3;  // seed phase: -3, -2, -1, then back to 1
            } else if (h < -1) {
                h++;
            } else if (h === -1) {
                h = 1;
            }
            row[c] = h;
        }));
    }
    return sum;
}

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): number[][] => input.split('\n')
        .map(line => line.split('').map(c => c === '.' ? OFF : Number(c)));
    console.log("Part 1:", part1(parse(input1)));   // 186
    console.log("Part 2:", part2(parse(input2)));   // 1066
    console.log("Part 3:", part3(parse(input3)));   // 899237
}
