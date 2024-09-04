import * as PIXI from "pixi.js";
import { Settings } from "../../utils/Settings";
import { Bullet } from "./Bullet";

class Tank extends PIXI.Container {
    public static ON_BULLET_RESET: string = "onBulletReset";

    private tank: PIXI.Sprite;
    private bullet: Bullet;

    constructor(textureKey: string, bulletKey: string) {
        super();

        this.tank = PIXI.Sprite.from(textureKey);
        this.tank.anchor.set(0.5);
        this.addChild(this.tank);
        
        this.bullet = new Bullet(PIXI.Texture.from(bulletKey));
        this.bullet.anchor.set(0.5);
        this.bullet.visible = false;
        this.addChildAt(this.bullet, 0);
    }

    public getBulletX(): number {
        return this.bullet.x;
    }

    public getBulletY(): number {
        return this.bullet.y;
    }
    
    public getTankWidth(): number {
        return this.tank.width;
    }
    
    public getTankHeight(): number {
        return this.tank.height;
    }

    public fireBullet(): void {
        this.bullet.visible = true;
        this.bullet.fire();
    }

    public resetBullet(): void {
        this.bullet.visible = false;
        this.bullet.reset();

        this.emit(Tank.ON_BULLET_RESET, this);
    }

    public update(): void {
        this.x += Settings.TANK_SPEED;
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { Tank }
