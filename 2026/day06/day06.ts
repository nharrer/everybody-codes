class Food {
    public items = new Map<string, Item>();

    constructor(inp: [string, string[]][]) {
        for (const [name, ingredients] of inp) {
            const item = this.getOrCreate(name);
            ingredients.forEach(i => item.ingrediants.add(this.getOrCreate(i)));
        }
    }

    private getOrCreate(name: string): Item {
        return this.items.get(name) ?? this.items.set(name, new Item(name)).get(name)!;
    }
}

class Item {
    public name: string;
    public ingrediants = new Set<Item>();
    constructor(name: string) {
        this.name = name;
    }
}

function part1(input: Food): number {
    const all = new Set<Item>();
    const search = (cur: Item): void => {
        if (!all.has(cur)) {
            all.add(cur);
            cur.ingrediants.forEach(i => search(i));
        }
    };
    search(input.items.get("NULL")!);
    return all.size - 1;
}

function countNullVariants(input: Food, minVariants: number): number {
    const find = (cur: Item, visited: Set<Item>, variants: Set<string>): void => {
        visited.add(cur);
        for (const i of cur.ingrediants) {
            if (i.name.startsWith('NULL')) {
                variants.add(i.name);
                if (variants.size >= minVariants) {
                    return;
                }
            }
            if (!visited.has(i)) {
                find(i, visited, variants);
            }
        }
    };

    return [...input.items.values()].filter(item => {
        const variants = new Set<string>();
        find(item, new Set(), variants);
        return item.name !== 'NULL' && variants.size >= minVariants;
    }).length;
}

const part2 = (input: Food): number => countNullVariants(input, 1);
const part3 = (input: Food): number => countNullVariants(input, 2);

export function solve(input1: string, input2: string, input3: string): void {
    const parse = (input: string): Food => new Food(
        input.trim().split('\n')
            .map(line => line.split(':') as [string, string])
            .map(([itemname, lst]): [string, string[]] => [itemname, lst.split(',')])
    );
    console.log("Part 1:", part1(parse(input1)));   // 40
    console.log("Part 2:", part2(parse(input2)));   // 834
    console.log("Part 3:", part3(parse(input3)));   // 1637
}
