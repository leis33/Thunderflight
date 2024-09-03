export function getRandom(max: number, min: number): number {
    return Math.floor(Math.random() * max + min);
}