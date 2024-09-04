import * as PIXI from "pixi.js"
import { Settings } from "../../utils/Settings";

class HealthBar extends PIXI.Container {
    private hearts: PIXI.Sprite[] = [];

    constructor() {
        super();

        const HEART_X_OFFSET: number = 20;

        for (let i = 0; i < Settings.HEARTS_COUNT; i++) {
            let heart: PIXI.Sprite = PIXI.Sprite.from("heart");
            heart.anchor.set(0.5);
            heart.x = heart.width * i + HEART_X_OFFSET;
            heart.visible = false;
            this.addChild(heart);
            this.hearts.push(heart);
        }
    }

    public setHearts(hearts: number): void {
        if (!this.hearts || this.hearts.length <= 0) {
            console.log("Hearts aren't created");
            return;
        }
        
        if (hearts > this.hearts.length || hearts < 0) {
            console.log("Invalid number of hearts");
        }

        for (let heart of this.hearts) {
            heart.visible = false;
        }

        for (let i = 0; i < hearts; i++) {
            this.hearts[i].visible = true;
        }
    }

    destroy(): void {
        super.destroy();
    }
}

export { HealthBar }
