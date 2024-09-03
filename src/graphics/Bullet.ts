import * as PIXI from "pixi.js"
import gsap from "gsap";
import { getRandom } from "../utils/HelperFunctions";
import { Settings } from "../utils/Settings";

interface ITimeObject {
    time: number
}

class Bullet extends PIXI.Sprite {
    private _velocity: number;
    
    private timeObject: ITimeObject = {
        time: 0
    };
    private tweenBullet: gsap.core.Tween;

    constructor(options?: PIXI.SpriteOptions | PIXI.Texture) {
        super(options);

        this.setRandomVelocity();
    }

    get velocity(): number {
        return this._velocity;
    }

    public fire(): void {
        if (this.tweenBullet && this.tweenBullet.isActive()) {
            return;
        }

        this.tweenBullet = gsap.to(this.timeObject, {
            time: 10,
            duration: 10,
            ease: "none",
            callbackScope: this,
            onUpdate: this.onTweenUpdate
        });
    }
    
    public reset(): void {
        if (this.tweenBullet) {
            this.tweenBullet.kill();
            this.tweenBullet = null;
        }

        this.timeObject.time = 0;
        this.x = 0;
        this.y = 0;
        this.setRandomVelocity();
    }

    private onTweenUpdate(): void {
        let t: number = this.timeObject.time;

        let newX: number = ((this._velocity) * Math.cos(45 * 3.14 / 180)) * t;
        let newY: number = ((this._velocity) * Math.sin(45 * 3.14 / 180)) * t + Settings.GRAVITY * t * t;

        this.rotation = Math.atan2(newY - this.y, newX - this.x) - 3.14;

        this.x = newX;
        this.y = newY;
    }

    private setRandomVelocity(): void {
        this._velocity = getRandom(Settings.BULLET_VELOCITY_MAX, Settings.BULLET_VELOCITY_MIN);
    }

    destroy(): void {
        super.destroy(true);
        
        if (this.tweenBullet) {
            this.tweenBullet.kill();
            this.tweenBullet = null;
        }
    }
}

export { Bullet }
