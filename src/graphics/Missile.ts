import * as PIXI from "pixi.js"
import { Settings } from "../utils/Settings";

class Missile extends PIXI.Sprite {
    constructor(options?: PIXI.SpriteOptions | PIXI.Texture) {
        super(options);
    }
    
    public update(): void {
        this.x += Settings.MISSILE_SPEED;
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { Missile }
