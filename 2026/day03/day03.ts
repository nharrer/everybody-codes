const iso = (a: number[], b: number[]) =>
    b.reduce((n, digit, i) => n + digit * a[i % a.length]! ** i, 0);

const digits = (s: number) => [...s.toString()].map(Number).toReversed();  // digits(123) = [3, 2, 1]

function part2(input: Array<[number[], number]>): number {
    return input.reduce((sum, [a, b]) => sum + iso(a, digits(b)), 0);
}

function part3(input: Array<[number[], number]>): number {
    return input.reduce((sum, [a, bn]) => {
        const n = iso(a, digits(bn));
        for (let cn = bn - 1; cn >= 0; cn--) {
            if (iso(a, digits(cn)) === n) {
                return sum;
            }
        }
        return sum + n;
    }, 0);
}

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): Array<[number[], number]> => input
        .split('\n')
        .map(line => line.split('-')[1]!)
        .map(line => line.split(' '))
        .map(nrs => [digits(+nrs[0]!), Number(nrs[1]!)]);
    console.log("Part 1:", part2(parse(input1)));   // 16635
    console.log("Part 2:", part2(parse(input2)));   // 25326989720
    console.log("Part 3:", part3(parse(input3)));   // 272306
}
