import * as PIXI from "pixi.js";
import { Settings } from "../utils/Settings";

class Plane extends PIXI.Container {
    public static ON_FUEL_EMPTY: string = "onFuelEmpty";

    private plane: PIXI.Sprite;
    private _fuel: number = Settings.PLANE_FUEL;

    private refreshInterval: NodeJS.Timeout;

    constructor() {
        super();

        this.plane = PIXI.Sprite.from("plane");
        this.plane.anchor.set(0.5);
        this.addChild(this.plane);
    }

    get fuel(): number {
        return this._fuel;
    }

    set fuel(fuel: number) {
        if (fuel <= 0) {
            this._fuel = 0;
            this.onFuelEmpty();
            return;
        }

        this._fuel = fuel;
    }

    public startEngine(): void {
        if (this.refreshInterval) {
            return;
        }

        this.refreshInterval = setInterval(() => {
            this.fuel -= Settings.FUEL_PER_INTERVAL;
        }, Settings.FUEL_INTERVAL);
    }

    private onFuelEmpty(): void {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;

        this.emit(Plane.ON_FUEL_EMPTY);
    }

    destroy(): void {
        super.destroy(true);

        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
    }
}

export { Plane }
