import * as PIXI from "pixi.js";
import { Plane } from "../graphics/Plane";
import { ParallaxBackground } from "../graphics/ParallaxBackground";
import { Settings } from "../utils/Settings";
import { Tank } from "../graphics/Tank";
import { getRandom } from "../utils/HelperFunctions";

class Main extends PIXI.Container {
    private app: PIXI.Application;

    private background: ParallaxBackground;
    private plane: Plane;
    private tanks: Tank[] = [];

    constructor(app: PIXI.Application) {
        super();

        this.app = app;

        this.createBackground();
        this.createPlane();
        this.createTanks();

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

    private createTanks(): void {
        const tanksKeys: string[] = ["tank1", "tank2"];
        const bulletKeys: string[] = ["bullet1", "bullet2"];
        let randomKey: number;

        let tankX: number = Settings.TANK_SPAWN_X;
        let tankY: number;
        
        for (let i = 0; i < Settings.TANKS_COUNT; i++) {
            randomKey = getRandom(tanksKeys.length, 0);
            tankY = Settings.GAME_HEIGHT - getRandom(Settings.TANK_SPAWN_Y_MAX, Settings.TANK_SPAWN_Y_MIN);

            let tank = new Tank(tanksKeys[randomKey], bulletKeys[randomKey]);
            tank.x = tankX;
            tank.y = tankY;
            this.addChild(tank);
            this.tanks.push(tank);

            tankX += Settings.TANK_SPAWN_X_STEP;
        }
    }
    // end of create methods

    // game loop
    private update(): void {
        this.app.ticker.add((ticker: PIXI.Ticker) => {
            this.background.updateLayers();
            this.updateTanks();
            this.detectCollisions()
        });
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

    private updateTanks(): void {
        for (const tank of this.tanks) {
            tank.update();

            if (tank.x < Settings.TANK_X_MIN) {
                tank.x = Settings.TANK_SPAWN_X;
            }
        }
    }

    private detectCollisions(): void {
        for (const tank of this.tanks) {
            if (this.plane.x + this.plane.width / 2 > tank.x - tank.width / 2 &&
                this.plane.y + this.plane.height / 2 > tank.y - tank.height / 2 &&
                this.plane.x - this.plane.width / 2 < tank.x + tank.width / 2 &&
                this.plane.y - this.plane.height / 2 < tank.y + tank.height / 2) {
                console.log("COLLISION !!!!!!");
            }
        }
    }

    public destroy(): void {
        super.destroy(true);

        if (this.plane) {
            this.plane.removeAllListeners();
        }
    }
}

export { Main }
