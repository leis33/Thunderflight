import * as PIXI from "pixi.js";
import { Plane } from "../graphics/Plane";
import { ParallaxBackground } from "../graphics/ParallaxBackground";
import { Settings } from "../utils/Settings";
import { Tank } from "../graphics/obstacles/Tank";
import { getRandom, wait } from "../utils/HelperFunctions";
import { Missile } from "../graphics/obstacles/Missile";
import { UI } from "../graphics/ui/UI";
import { GasCan } from "../graphics/obstacles/Fuel";

class Main extends PIXI.Container {
    private app: PIXI.Application;

    private isGameActive: boolean;

    private background: ParallaxBackground;
    private plane: Plane;
    private tanks: Tank[] = [];
    private missiles: Missile[] = [];
    private gasCan: GasCan;

    private ui: UI;

    private startTime: number;

    constructor(app: PIXI.Application) {
        super();

        this.app = app;

        this.isGameActive = false;

        this.createBackground();
        this.createPlane();
        this.createTanks();
        this.createMissiles();
        this.createGasCan();
        this.createUI();

        this.startGame();
    }

    public getBackgroundBounds(): PIXI.Bounds {
        return this.background.getBounds();
    }

    private startGame(): void {
        this.isGameActive = true;
        this.plane.startEngine();

        this.startTime = performance.now();

        this.app.ticker.add(this.update, this);
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
        this.plane.on(Plane.ON_GAME_OVER, this.gameOver, this);
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

            let tank: Tank = new Tank(tanksKeys[randomKey], bulletKeys[randomKey]);
            tank.x = tankX;
            tank.y = tankY;
            tank.on(Tank.ON_BULLET_RESET, this.onBulletReset, this);
            this.addChildAt(tank, 2);
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

            let missile: Missile = new Missile(PIXI.Texture.from("missile"));
            missile.anchor.set(0.5);
            missile.x = missileX;
            missile.y = missileY;
            this.addChildAt(missile, 2);
            this.missiles.push(missile);

            await wait(400);
        }
    }

    private createGasCan(): void {
        let gasCanX: number = Settings.GAS_CAN_SPAWN_X;
        let gasCanY: number = getRandom(Settings.GAS_CAN_SPAWN_Y_MAX, Settings.GAS_CAN_SPAWN_Y_MIN);

        this.gasCan = new GasCan(PIXI.Texture.from("gas_can"));
        this.gasCan.anchor.set(0.5);
        this.gasCan.x = gasCanX;
        this.gasCan.y = gasCanY;
        this.addChild(this.gasCan);
    }

    private createUI(): void {
        this.ui = new UI();
        this.ui.setHearts(this.plane.hearts);
        this.ui.setFuel(this.plane.fuel);
        this.ui.setScore(0);
        this.addChild(this.ui);
    }
    // end of create methods

    // event methods
    private async onBulletReset(tank: Tank): Promise<void> {
        await wait(500);
        tank.fireBullet();
    }

    private onGasCanCollision(): void {
        this.gasCan.y = -100;
        this.plane.fuel += Settings.FUEL_ADD;
    }

    private onBulletCollision(tank: Tank): void {
        if (this.plane.isInvulnerable) return;

        tank.resetBullet();
        this.takePlaneDamage(Settings.DAMAGE_BULLET);
    }

    private onMissileCollision(missile: Missile): void {
        if (this.plane.isInvulnerable) return;

        missile.y = -100;
        this.takePlaneDamage(Settings.DAMAGE_MISSILE);
    }

    private onTankCollision(): void {
        if (this.plane.isInvulnerable) return;

        this.takePlaneDamage(Settings.DAMAGE_TANK);
    }

    private takePlaneDamage(damage: number): void {
        this.plane.becomeInvulnerable();
        this.plane.hearts -= damage;
        this.ui.setHearts(this.plane.hearts);
    }

    private gameOver(): void {
        console.log("GAME OVER");

        this.ui.showGameOverScreen();
        this.ui.setFuel(this.plane.fuel);
        this.isGameActive = false;
        this.plane.removeAllListeners();
    }

    // game loop
    private update(): void {
        this.background.updateLayers();

        this.updateTanks();
        this.updateMissiles();
        this.updateGasCan();

        this.detectCollisions()

        const currentTime = performance.now();
        const elapsedTime = currentTime - this.startTime;
        this.updateUI(elapsedTime);
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

    private updateGasCan(): void {
        this.gasCan.update();

        if (this.gasCan.x < Settings.GAS_CAN_X_MIN) {
            this.gasCan.x = Settings.GAS_CAN_SPAWN_X;
            this.gasCan.y = getRandom(Settings.GAS_CAN_SPAWN_Y_MAX, Settings.GAS_CAN_SPAWN_Y_MIN);
        }
    }

    private detectCollisions(): void {
        if (!this.isGameActive) return;

        for (const tank of this.tanks) {
            // plane and tank
            if (this.plane.x + Settings.PLANE_HITBOX_WIDTH / 2 > tank.x - tank.getTankWidth() / 2 &&
                this.plane.y + Settings.PLANE_HITBOX_HEIGHT / 2 > tank.y - tank.getTankHeight() / 2 &&
                this.plane.x - Settings.PLANE_HITBOX_WIDTH / 2 < tank.x + tank.getTankWidth() / 2 &&
                this.plane.y - Settings.PLANE_HITBOX_HEIGHT / 2 < tank.y + tank.getTankHeight() / 2) {
                this.onTankCollision();
            }

            // bullet and world bounds
            let bulletCoords: PIXI.Point = this.toLocal({ x: tank.getBulletX(), y: tank.getBulletY() }, tank);
            if (bulletCoords.x < Settings.TANK_X_MIN || bulletCoords.y > Settings.GAME_HEIGHT) {
                tank.resetBullet();
            }

            // plane and bullet
            if (this.plane.x + Settings.PLANE_HITBOX_WIDTH / 2 > bulletCoords.x &&
                this.plane.y + Settings.PLANE_HITBOX_HEIGHT / 2 > bulletCoords.y &&
                this.plane.x - Settings.PLANE_HITBOX_WIDTH / 2 < bulletCoords.x &&
                this.plane.y - Settings.PLANE_HITBOX_HEIGHT / 2 < bulletCoords.y) {
                this.onBulletCollision(tank);
            }
        }

        for (const missile of this.missiles) {
            // plane and missile
            if (this.plane.x + Settings.PLANE_HITBOX_WIDTH / 2 > missile.x - missile.width / 2 &&
                this.plane.y + Settings.PLANE_HITBOX_HEIGHT / 2 > missile.y - Settings.MISSILE_HITBOX_HEIGHT / 2 &&
                this.plane.x - Settings.PLANE_HITBOX_WIDTH / 2 < missile.x + missile.width / 2 &&
                this.plane.y - Settings.PLANE_HITBOX_HEIGHT / 2 < missile.y + Settings.MISSILE_HITBOX_HEIGHT / 2) {
                this.onMissileCollision(missile);
            }
        }

        // plane and gas can
        if (this.plane.x + Settings.PLANE_HITBOX_WIDTH / 2 > this.gasCan.x - this.gasCan.width / 2 &&
            this.plane.y + Settings.PLANE_HITBOX_HEIGHT / 2 > this.gasCan.y - this.gasCan.height / 2 &&
            this.plane.x - Settings.PLANE_HITBOX_WIDTH / 2 < this.gasCan.x + this.gasCan.width / 2 &&
            this.plane.y - Settings.PLANE_HITBOX_HEIGHT / 2 < this.gasCan.y + this.gasCan.height / 2) {
            this.onGasCanCollision();
        }
    }

    private updateUI(elapsedMS: number): void {
        if (!this.isGameActive) return;

        let score: number = Math.floor(elapsedMS / 1000) * Settings.SCORE_MULTIPLIER;

        this.ui.setScore(score);
        this.ui.setFuel(this.plane.fuel);
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
