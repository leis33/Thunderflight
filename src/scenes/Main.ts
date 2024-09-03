import * as PIXI from "pixi.js";
import { Plane } from "../graphics/Plane";
import { ParallaxBackground } from "../graphics/ParallaxBackground";
import { Settings } from "../utils/Settings";
import { Tank } from "../graphics/Tank";
import { getRandom, wait } from "../utils/HelperFunctions";
import { Missile } from "../graphics/Missile";
import { UI } from "../graphics/UI";

class Main extends PIXI.Container {
    private app: PIXI.Application;

    private background: ParallaxBackground;
    private plane: Plane;
    private tanks: Tank[] = [];
    private missiles: Missile[] = [];

    private ui: UI;

    constructor(app: PIXI.Application) {
        super();

        this.app = app;

        this.createBackground();
        this.createPlane();
        this.createTanks();
        this.createMissiles();
        this.createUI();

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

    private async createTanks(): Promise<void> {
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
            tank.on(Tank.ON_BULLET_RESET, this.onBulletReset, this);
            this.addChild(tank);
            this.tanks.push(tank);

            tank.fireBullet();

            await wait(1850);
        }
    }

    private async createMissiles(): Promise<void> {
        let missileX: number = Settings.MISSILE_SPAWN_X;
        let missileY: number;

        for (let i = 0; i < Settings.MISSILES_COUNT; i++) {
            missileY = getRandom(Settings.MISSILE_SPAWN_Y_MAX, Settings.MISSILE_SPAWN_Y_MIN);

            let missile = new Missile(PIXI.Texture.from("missile"));
            missile.anchor.set(0.5);
            missile.x = missileX;
            missile.y = missileY;
            this.addChild(missile);
            this.missiles.push(missile);

            await wait(400);
        }
    }

    private createUI(): void {
        this.ui = new UI();
        this.addChild(this.ui);
    }
    // end of create methods

    // event methods
    private async onBulletReset(tank: Tank): Promise<void> {
        await wait(500);
        tank.fireBullet();
    }

    // game loop
    private update(): void {
        const startTime = performance.now();

        this.app.ticker.add((ticker: PIXI.Ticker) => {
            this.background.updateLayers();
            this.updateTanks();
            this.updateMissiles();
            this.detectCollisions()

            const currentTime = performance.now();
            const elapsedTime = currentTime - startTime;
            this.updateScore(Math.floor(elapsedTime / 1000));
        });
    }

    private positionPlane(event: PIXI.FederatedPointerEvent): void {
        const coords: PIXI.Point = this.toLocal({ x: event.x, y: event.y });
            
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

    private updateMissiles(): void {
        for (const missile of this.missiles) {
            missile.update();

            if (missile.x < Settings.MISSILE_X_MIN) {
                missile.x = Settings.MISSILE_SPAWN_X;
                missile.y = getRandom(Settings.MISSILE_SPAWN_Y_MAX, Settings.MISSILE_SPAWN_Y_MIN);
            }
        }
    }

    private detectCollisions(): void {
        for (const tank of this.tanks) {
            // plane and tank
            if (this.plane.x + Settings.PLANE_HITBOX_WIDTH / 2 > tank.x - tank.getTankWidth() / 2 &&
                this.plane.y + Settings.PLANE_HITBOX_HEIGHT / 2 > tank.y - tank.getTankHeight() / 2 &&
                this.plane.x - Settings.PLANE_HITBOX_WIDTH / 2 < tank.x + tank.getTankWidth() / 2 &&
                this.plane.y - Settings.PLANE_HITBOX_HEIGHT / 2 < tank.y + tank.getTankHeight() / 2) {
                console.log("COLLISION TANK !!!!!!");
            }

            // bullet and world bounds
            let bulletCoords: PIXI.Point = this.toLocal({ x: tank.getBulletX(), y: tank.getBulletY() }, tank);
            if (bulletCoords.x < Settings.TANK_X_MIN || bulletCoords.y > Settings.GAME_HEIGHT) {
                console.log("Bullet reset");
                tank.resetBullet();
            }

            // plane and bullet
            if (this.plane.x + Settings.PLANE_HITBOX_WIDTH / 2 > bulletCoords.x &&
                this.plane.y + Settings.PLANE_HITBOX_HEIGHT / 2 > bulletCoords.y &&
                this.plane.x - Settings.PLANE_HITBOX_WIDTH / 2 < bulletCoords.x &&
                this.plane.y - Settings.PLANE_HITBOX_HEIGHT / 2 < bulletCoords.y) {
                console.log("COLLISION !!!!!!");
            }
        }

        for (const missile of this.missiles) {
            // plane and missile
            if (this.plane.x + Settings.PLANE_HITBOX_WIDTH / 2 > missile.x - missile.width / 2 &&
                this.plane.y + Settings.PLANE_HITBOX_HEIGHT / 2 > missile.y - Settings.MISSILE_HITBOX_HEIGHT / 2 &&
                this.plane.x - Settings.PLANE_HITBOX_WIDTH / 2 < missile.x + missile.width / 2 &&
                this.plane.y - Settings.PLANE_HITBOX_HEIGHT / 2 < missile.y + Settings.MISSILE_HITBOX_HEIGHT / 2) {
                console.log("COLLISION MISSILE !!!!!!");
            }
        }
    }

    private updateScore(score: number): void {
        this.ui.setScore(score * Settings.SCORE_MULTIPLIER);
    }

    public destroy(): void {
        super.destroy(true);

        if (this.plane) {
            this.plane.removeAllListeners();
        }

        if (this.tanks && this.tanks.length > 0) {
            for (let tank of this.tanks) {
                tank.removeAllListeners();
            }
        }
    }
}

export { Main }
