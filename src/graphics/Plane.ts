import * as PIXI from "pixi.js";
import gsap from "gsap";
import { Settings } from "../utils/Settings";

class Plane extends PIXI.Container {
    public static ON_GAME_OVER: string = "onGameOver";

    private plane: PIXI.Sprite;
    private _fuel: number = Settings.PLANE_FUEL;
    private _hearts: number = Settings.HEARTS_COUNT;
    private _isInvulnerable: boolean = false;

    private refreshInterval: NodeJS.Timeout;
    private tweenInvulnerable: gsap.core.Tween;

    constructor() {
        super();

        this.plane = PIXI.Sprite.from("plane");
        this.plane.anchor.set(0.5);
        this.addChild(this.plane);
    }

    get isInvulnerable(): boolean {
        return this._isInvulnerable;
    }

    get fuel(): number {
        return this._fuel;
    }

    set fuel(fuel: number) {
        if (fuel <= 0) {
            this._fuel = 0;
            this.gameOver();
            return;
        }

        this._fuel = fuel;
    }

    
    get hearts(): number {
        return this._hearts;
    }

    set hearts(hearts: number) {
        if (hearts > Settings.HEARTS_COUNT) {
            console.log("Invalid number of hearts");
            return;
        }

        if (hearts <= 0) {
            this._hearts = 0;
            this.gameOver();
            return;
        }

        this._hearts = hearts;
    }

    public startEngine(): void {
        if (this.refreshInterval) {
            return;
        }

        this.refreshInterval = setInterval(() => {
            this.fuel -= Settings.FUEL_PER_INTERVAL;
        }, Settings.FUEL_INTERVAL);
    }

    public becomeInvulnerable(): void {
        if (this.tweenInvulnerable && this.tweenInvulnerable.isActive()) {
            return;
        }

        this._isInvulnerable = true;

        this.tweenInvulnerable = gsap.to(this, {
            alpha: 0.1,
            duration: 0.3,
            yoyo: true,
            ease: "sine.out",
            repeat: 5,
            onComplete: () => this._isInvulnerable = false
        });
    }

    private gameOver(): void {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;

        this.emit(Plane.ON_GAME_OVER);
    }

    destroy(): void {
        super.destroy(true);

        clearInterval(this.refreshInterval);
        this.refreshInterval = null;

        if (this.tweenInvulnerable) {
            this.tweenInvulnerable.kill();
            this.tweenInvulnerable = null;
        }
    }
}

export { Plane }
