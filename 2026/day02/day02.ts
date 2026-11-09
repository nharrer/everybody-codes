function kahn(input: Array<Array<[number, number]>>): number {
    const results: Array<number> = [];
    input.forEach((line) => {
        // Topological sort (Kahn's algorithm)
        // https://en.wikipedia.org/wiki/Topological_sorting
        const next = new Map<number, Array<number>>();
        const inedges = new Map<number, number>();
        line.forEach(([a, b]) => {
            next.set(a, [...(next.get(a) ?? []), b]);
            inedges.set(a, inedges.get(a) ?? 0);
            inedges.set(b, (inedges.get(b) ?? 0) + 1);
        });

        const S = [...inedges.keys()].filter((n) => inedges.get(n) === 0);
        const L: Array<number> = [];
        while (S.length > 0) {
            const n = S.shift()!;
            L.push(n);
            for (const m of next.get(n) ?? []) {
                const remaining = inedges.get(m)! - 1;
                inedges.set(m, remaining);
                if (remaining === 0) {
                    S.push(m);
                }
            }
        }
        results.push(L.reduce((value, digit) => value * 10 + digit, 0));
    });
    return results.reduce((a, b) => a + b, 0);
}

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): Array<Array<[number, number]>> => input.split('\n')
        .map(line => line.split(' ')
            .map(token => token.split(/([<>])/))
            .map((p: string[]) => p[1] === '<' ? [Number(p[2]), Number(p[0])] : [Number(p[0]), Number(p[2])]));
    console.log("Part 1:", kahn(parse(input1)));   // 444822
    console.log("Part 2:", kahn(parse(input2)));   // 56928474135 (wrong: 56928474126)
    console.log("Part 3:", kahn(parse(input3)));   // 610622249895
}
