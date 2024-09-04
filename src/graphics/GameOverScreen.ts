import * as PIXI from "pixi.js"
import { Settings } from "../utils/Settings";

class GameOverScreen extends PIXI.Container {
    private background: PIXI.Graphics;
    private gameOverText: PIXI.Text;

    constructor() {
        super();

        this.background = new PIXI.Graphics();
        this.background.rect(0, 0, Settings.GAME_WIDTH, Settings.GAME_HEIGHT);
        this.background.fill({ color: 0x000, alpha: 0.5 });
        this.addChild(this.background);

        this.gameOverText = new PIXI.Text({ text: "GAME OVER", style: { fontSize: 128, fill: "#FFF" } });
        this.gameOverText.anchor.set(0.5);
        this.gameOverText.x = Settings.GAME_WIDTH / 2;
        this.gameOverText.y = Settings.GAME_HEIGHT / 2;
        this.addChild(this.gameOverText)
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { GameOverScreen }
