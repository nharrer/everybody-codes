/** ANSI foreground color codes, keyed by color name. */
export const colorCodes = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    gray: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97,
} as const;

export type Color = keyof typeof colorCodes;
export type ColorCode = (typeof colorCodes)[Color];

/** Wraps text in ANSI escape codes so the terminal shows it in the given color (name or code). */
export function colorize(text: string, color: Color | ColorCode): string {
    const code = typeof color === 'number' ? color : colorCodes[color];
    return `\x1b[${code}m${text}\x1b[0m`;
}
