import * as PIXI from "pixi.js";

class Localizer {
    public language: string;

    private static instance: Localizer

    private constructor() {
    }

    public static getInstance(): Localizer {
        if (!Localizer.instance) {
            Localizer.instance = new Localizer();
        }

        return Localizer.instance;
    }

    public getString(key: string): string {
        const json: any = PIXI.Assets.get(this.language);

        return json[key];
    }
}

export { Localizer }
