import * as PIXI from "pixi.js";
import { Plane } from "../graphics/Plane";
import { ParallaxBackground } from "../graphics/ParallaxBackground";
import { Settings } from "../utils/Settings";

class Main extends PIXI.Container {
    private app: PIXI.Application;

    private background: ParallaxBackground;
    private plane: Plane;

    constructor(app: PIXI.Application) {
        super();

        this.app = app;

        this.createBackground();
        this.createPlane();

        this.update();
    }

    // create methods
    private createBackground(): void {
        this.background = new ParallaxBackground();
        this.addChild(this.background);
    }

    private createPlane(): void {
        this.plane = new Plane();
        this.plane.x = 300;
        this.plane.y = 300;
        this.plane.eventMode = "static";
        this.plane.on("globalpointermove", this.positionPlane, this);
        this.addChild(this.plane);
    }
    // end of create methods

    // game loop
    private update(): void {
        this.app.ticker.add((ticker: PIXI.Ticker) => {
            this.background.updateLayers();
        })
    }

    private positionPlane(event: PIXI.FederatedPointerEvent): void {
        const coords: PIXI.Point = this.plane.parent.toLocal({ x: event.x, y: event.y });
            
        if (coords.y < 0) {
            coords.y = 0;
        } else if (coords.y > Settings.GAME_HEIGHT) {
            coords.y = Settings.GAME_HEIGHT;
        }
        
        if (coords.x < 0) {
            coords.x = 0;
        } else if (coords.x > Settings.GAME_WIDTH) {
            coords.x = Settings.GAME_WIDTH;
        }

        this.plane.x = coords.x;
        this.plane.y = coords.y;
    }

    public destroy(): void {
        super.destroy(true);

        if (this.plane) {
            this.plane.removeAllListeners();
        }
    }
}

export { Main }
