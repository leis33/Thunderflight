import * as PIXI from "pixi.js";

class Plane extends PIXI.Container {
    private plane: PIXI.Sprite;

    constructor() {
        super();

        this.plane = PIXI.Sprite.from("plane");
        this.plane.anchor.set(0.5);
        this.addChild(this.plane);
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { Plane }
