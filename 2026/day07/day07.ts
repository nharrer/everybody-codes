const THRESHOLD = 1000000;  // 100;

class Sky {
    public clouds: Map<number, Cloud>;

    constructor(entries: [Cloud, number[]][]) {
        this.clouds = new Map(entries.map(([c]) => [c.id, c]));
        entries.forEach(([c, cids]) => cids.forEach(cid => c.connections.add(this.clouds.get(cid)!)));
    }

    public reset() {
        this.clouds.forEach(c => { c.exploded = false; c.energy = c.initalenergy; });
    }
}

class Cloud {
    public id: number;
    public initalenergy: number;
    public energy: number;
    public connections = new Set<Cloud>();
    public exploded = false;

    constructor(id: number, energy: number) {
        this.id = id;
        this.initalenergy = this.energy = energy;
    }
}

function blitz(sky: Sky, startid: number, starte: number, threshold: number = -1): number {
    let stack = new Map<number, Map<number, number>>(); // id => (pulse energy => count)
    stack.set(startid, new Map([[starte, 1]]));

    while (stack.size > 0) {
        const stack2 = new Map<number, Map<number, number>>();
        stack.forEach((pulseMap, id) => {
            pulseMap.forEach((cnt, e) => {
                const cloud = sky.clouds.get(id)!;
                if (!cloud.exploded) {
                    cloud.energy += cnt * e;
                    e--;
                    if (e > 0) {
                        cloud.connections.forEach(n => {
                            const pulseMap2 = stack2.get(n.id) ?? new Map<number, number>();
                            pulseMap2.set(e, (pulseMap2.get(e) ?? 0) + cnt);
                            stack2.set(n.id, pulseMap2);
                        });
                    }
                }
            });
        });

        sky.clouds.forEach(c => {
            if (!c.exploded && threshold !== -1 && c.energy >= threshold) {
                let e = 10;
                c.connections.forEach(n => {
                    if (!n.exploded) {
                        const pulseMap2 = stack2.get(n.id) ?? new Map<number, number>();
                        pulseMap2.set(e, (pulseMap2.get(e) ?? 0) + 1);
                        stack2.set(n.id, pulseMap2);
                    }
                });
                c.exploded = true;
            }
        });

        stack = stack2;
    }

    return sky.clouds.values().filter(c => !c.exploded).reduce((sum, c) => sum + c.energy, 0);
}

function part1_2(sky: Sky, initialpulse: number) {
    const start = sky.clouds.values()
        .reduce((best, cloud) => cloud.connections.size > best.connections.size ? cloud : best);
    return blitz(sky, start.id, initialpulse);
}

function part3(sky: Sky): number {
    return Math.max(...sky.clouds.keys().map(id => {
        sky.reset();
        return blitz(sky, id, 10, THRESHOLD);
    }));
}

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): Sky => new Sky(
        input.split('\n')
            .map(line => line.split(', ') as [string, string, string])
            .map(([id, energy, conn]): [Cloud, number[]] => {
                const i = Number(id.split('=')[1]);
                const e = Number(energy.split('=')[1]);
                const c = conn.split('=')[1]!.split(',').map(i => Number(i))
                return [new Cloud(i, e), c];
            })
    );
    console.log("Part 1:", part1_2(parse(input1), 5));  // 291
    console.log("Part 2:", part1_2(parse(input2), 10)); // 114423763
    console.log("Part 3:", part3(parse(input3)));       // 30103366
}
