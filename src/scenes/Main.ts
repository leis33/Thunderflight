import * as PIXI from "pixi.js";
import { Plane } from "../graphics/Plane";

class Main extends PIXI.Container {
    private app: PIXI.Application;

    private plane: Plane;

    constructor(app: PIXI.Application) {
        super();

        this.app = app;

        this.createPlane();

        this.update();
    }

    // create methods
    private createPlane(): void {
        this.plane = new Plane();
        this.plane.x = 300;
        this.plane.y = 300;
        this.addChild(this.plane);
    }
    // end of create methods

    // game loop
    private update(): void {
        this.app.ticker.add((ticker: PIXI.Ticker) => {
            // this.plane.x += 1;
        })
    }

    public destroy(): void {
        super.destroy(true);
    }
}

export { Main }
