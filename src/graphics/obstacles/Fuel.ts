import * as PIXI from "pixi.js"
import { Settings } from "../../utils/Settings";

class GasCan extends PIXI.Sprite {
    constructor(options?: PIXI.SpriteOptions | PIXI.Texture) {
        super(options);
    }
    
    public update(): void {
        this.x += Settings.GAS_CAN_SPEED;
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { GasCan }
