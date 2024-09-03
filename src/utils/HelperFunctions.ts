export function getRandom(max: number, min: number): number {
    return Math.floor(Math.random() * max + min);
}

export function wait(ms: number): Promise<void> {
    return new Promise<void>((res) => setTimeout(res, ms));
}