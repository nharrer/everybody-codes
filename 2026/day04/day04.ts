class Time {
    public id: number;
    public quest: number;
    public part: number;
    public time: number;
    constructor(id: string, quest: string, part: string, time: string) {
        this.id = +id; this.quest = +quest; this.part = +part; this.time = +time;
    }
}

function part1(input: Time[]): number {
    const m = new Map<number, number>();            // id => time
    for (const { id, time } of input) {
        m.set(id, (m.get(id) ?? 0) + time);
    }
    return [...m.values()].sort((a, b) => a - b)
        .reduce((sum, time, i) => sum + (i + 1) * time, 0);
}

function part2(input: Time[]): number {
    const m = new Map<number, [number, number]>();  // id => [parts, time]
    for (const { id, time } of input) {
        const [parts, total] = m.get(id) ?? [0, 0];
        m.set(id, [parts + 1, total + time]);
    }
    return [...m.values()].sort(([p1, t1], [p2, t2]) => p2 - p1 || t1 - t2)
        .reduce((sum, [parts, time], i) => sum + (i + 1) * time, 0);
}

function part3(input: Time[]): number {
    const points = new Map<number, number>();
    const quests = Math.max(...input.map((t) => t.quest));
    for (let quest = 1; quest <= quests; quest++) {
        const totals = new Map<number, number>();  // id => time so far in this quest
        for (const part of [1, 2, 3]) {
            const finishers = new Set<number>();
            for (const { id, time } of input.filter((t) => t.quest === quest && t.part === part)) {
                totals.set(id, (totals.get(id) ?? 0) + time);
                finishers.add(id);
            }
            const times = [...finishers].map((id) => totals.get(id)!);
            for (const id of finishers) {
                const rank = times.filter((t) => t < totals.get(id)!).length;  // ties share a rank
                points.set(id, (points.get(id) ?? 0) + Math.max(0, part * 50 - rank));
            }
        }
    }
    const scores = [...points.values()];
    return scores.reduce((sum, s) => {
        const rank = scores.filter((o) => o > s).length + 1;
        return sum + rank * s
    }, 0);
}

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): Time[] => input.split('\n')
        .map(line => line.match(/\d+/g)!)
        .map(([id, quest, part, time]) => new Time(id, quest!, part!, time!));
    console.log("Part 1:", part1(parse(input1)));   // 183141
    console.log("Part 2:", part2(parse(input2)));   // 628741311
    console.log("Part 3:", part3(parse(input3)));   // 6627406
}
