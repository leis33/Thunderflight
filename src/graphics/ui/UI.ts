import * as PIXI from "pixi.js"
import { Settings } from "../../utils/Settings";
import { HealthBar } from "./HealthBar";
import { GameOverScreen } from "./GameOverScreen";
import { Localizer } from "../../utils/Localizer";

class UI extends PIXI.Container {
    private scoreText: PIXI.Text;
    private fuelText: PIXI.Text;
    private healthBar: HealthBar;

    private gameOverScreen: GameOverScreen;

    constructor() {
        super();

        const FUEL_TEXT_OFFSET_X: number = 80;
        const HEALTH_BAR_OFFSET_Y: number = 30;

        this.scoreText = new PIXI.Text({ text: Localizer.getInstance().getString("score") , style: { fontSize: 36, fill: "#FFFFFF" } });
        this.scoreText.x = 30;
        this.scoreText.y = 30;
        this.addChild(this.scoreText);
        
        this.fuelText = new PIXI.Text({ text: Localizer.getInstance().getString("fuel") , style: { fontSize: 36, fill: "#FFFFFF" } });
        this.fuelText.x = Settings.GAME_WIDTH - this.fuelText.width - FUEL_TEXT_OFFSET_X;
        this.fuelText.y = 30;
        this.addChild(this.fuelText);

        this.healthBar = new HealthBar();
        this.healthBar.x = this.scoreText.x;
        this.healthBar.y = this.scoreText.y + this.scoreText.height + HEALTH_BAR_OFFSET_Y;
        this.addChild(this.healthBar);

        this.gameOverScreen = new GameOverScreen();
        this.gameOverScreen.visible = false;
        this.addChild(this.gameOverScreen);
    }

    public setScore(score: number): void {
        this.scoreText.text = Localizer.getInstance().getString("score") + score;
    }

    public setFuel(fuel: number): void {
        this.fuelText.text = Localizer.getInstance().getString("fuel") + fuel;
    }

    public setHearts(hearts: number): void {
        this.healthBar.setHearts(hearts);
    }

    public showGameOverScreen(): void {
        this.gameOverScreen.visible = true;
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { UI }
