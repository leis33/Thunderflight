import * as PIXI from "pixi.js";
import { Settings } from "../utils/Settings";

class Tank extends PIXI.Container {
    private tank: PIXI.Sprite;
    private bullet: PIXI.Sprite;

    constructor(textureKey: string, bulletKey: string) {
        super();

        this.tank = PIXI.Sprite.from(textureKey);
        this.tank.anchor.set(0.5);
        this.addChild(this.tank);
        
        this.bullet = PIXI.Sprite.from(bulletKey);
        this.bullet.anchor.set(0.5);
        this.addChildAt(this.bullet, 0);
    }

    public fireBullet(): void {
        
    }

    public update(): void {
        this.x += Settings.TANK_SPEED;
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { Tank }
