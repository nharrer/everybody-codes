function part1(input: number[]): number {
    return input
        .map((n: number) => Math.ceil(Math.sqrt(n)) ** 2 - n)
        .reduce((sum, distance) => sum + distance, 0);
}

function part2(input: number[]): number {
    return input
        .map((p: number): [number, number] => [p, Math.ceil((p + 4) / 4)])
        .map(([p, n]): [number, number] => [p, Math.max(n, 3)])
        .map(([p, next]) => 4 * next - 4 - p)
        .reduce((sum, distance) => sum + distance, 0);
}

function part3(input: number[]): number {
    return input
        .map((p: number): [number, number] => [p, Math.ceil(Math.sqrt(p + 1))])
        .map(([p, n]): [number, number] => [p, n % 2 === 0 ? n + 1 : n])
        .map(([p, next]) => (next ** 2 - 1) - p)
        .reduce((sum, distance) => sum + distance, 0);
}

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): number[] => input.split(',').map(Number);
    console.log("Part 1:", part1(parse(input1)));   // 1357
    console.log("Part 2:", part2(parse(input2)));   // 303
    console.log("Part 3:", part3(parse(input3)));   // 642421
}
